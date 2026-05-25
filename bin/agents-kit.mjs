#!/usr/bin/env node
import { constants as fsConstants } from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const templateRoot = path.join(repoRoot, "templates", "default")

function usage() {
  console.log(`agents-kit

Usage:
  agents-kit init [target] [--target <path>] [--force] [--dry-run]
  agents-kit adopt [target] [--target <path>] [--dry-run]
  agents-kit update [target] [--target <path>] [--overwrite] [--force] [--dry-run]

Examples:
  agents-kit init
  agents-kit init --target /path/to/repo
  agents-kit init /path/to/repo --dry-run
  agents-kit adopt --target /path/to/repo
  agents-kit adopt /path/to/repo --dry-run
  agents-kit update --target /path/to/repo --dry-run
  agents-kit update --target /path/to/repo --overwrite
`)
}

function parseArgs(argv) {
  const args = [...argv]
  if (args[0] === "--help" || args[0] === "-h") {
    return {
      command: undefined,
      target: process.cwd(),
      force: false,
      dryRun: false,
      overwrite: false,
      help: true,
    }
  }

  const command = args.shift()
  const options = {
    command,
    target: process.cwd(),
    force: false,
    dryRun: false,
    overwrite: false,
  }

  while (args.length > 0) {
    const arg = args.shift()
    if (arg === "--help" || arg === "-h") {
      options.help = true
    } else if (arg === "--force") {
      options.force = true
    } else if (arg === "--dry-run") {
      options.dryRun = true
    } else if (arg === "--overwrite") {
      options.overwrite = true
    } else if (arg === "--target") {
      const value = args.shift()
      if (!value) throw new Error("--target requires a path")
      options.target = value
    } else if (arg?.startsWith("--target=")) {
      options.target = arg.slice("--target=".length)
    } else if (arg?.startsWith("-")) {
      throw new Error(`unknown option: ${arg}`)
    } else {
      options.target = arg
    }
  }

  return options
}

function isReviewOnly(file) {
  return file === "AGENTS.md" ||
    file === "skills-lock.json" ||
    file === ".agents/router.md" ||
    file.startsWith(".agents/resolvers/") ||
    file.startsWith(".agents/gates/") ||
    file.startsWith(".agents/logs/") ||
    file.startsWith("history/") ||
    file.startsWith(".scratch/")
}

async function exists(filePath) {
  try {
    await fs.access(filePath, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function listFiles(root, base = root) {
  const entries = await fs.readdir(root, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath, base))
    } else if (entry.isFile()) {
      files.push(path.relative(base, fullPath))
    }
  }
  return files.sort()
}

async function sameFile(source, target) {
  try {
    const [sourceText, targetText] = await Promise.all([
      fs.readFile(source, "utf8"),
      fs.readFile(target, "utf8"),
    ])
    return sourceText === targetText
  } catch {
    return false
  }
}

function printDiff(source, target, file) {
  const diff = spawnSync("diff", [
    "-u",
    "--label",
    `seed/${file}`,
    "--label",
    `local/${file}`,
    source,
    target,
  ], {
    encoding: "utf8",
  })

  if (diff.error) {
    console.log(`\nCould not diff ${file}: ${diff.error.message}`)
    return
  }

  if (diff.status !== 0 && diff.status !== 1) {
    console.log(`\nCould not diff ${file}: diff exited ${diff.status}`)
    if (diff.stderr) process.stderr.write(diff.stderr)
    return
  }

  if (diff.stdout) {
    console.log(`\n--- Review ${file} ---`)
    process.stdout.write(diff.stdout)
  }
}

function gitStatus(targetRoot) {
  const inside = spawnSync("git", [
    "-C",
    targetRoot,
    "rev-parse",
    "--is-inside-work-tree",
  ], {
    encoding: "utf8",
  })

  if (inside.status !== 0 || inside.stdout.trim() !== "true") {
    return undefined
  }

  return spawnSync("git", [
    "-C",
    targetRoot,
    "status",
    "--porcelain",
  ], {
    encoding: "utf8",
  })
}

function assertCleanWorktree(targetRoot, options) {
  if (options.force) return

  const status = gitStatus(targetRoot)
  if (!status) return
  if (status.error) throw status.error
  if (status.status !== 0) {
    throw new Error("could not inspect target git worktree")
  }
  if (status.stdout.trim()) {
    if (options.dryRun) {
      console.warn("target worktree is not clean; dry-run preview only.")
      return
    }
    throw new Error("target worktree is not clean. Commit or stash first. Use --force only after inspecting the target diff.")
  }
}

async function init(options) {
  if (options.overwrite) {
    throw new Error("--overwrite is only supported by update")
  }

  const targetRoot = path.resolve(options.target)
  const files = await listFiles(templateRoot)
  const conflicts = []

  for (const file of files) {
    const source = path.join(templateRoot, file)
    const target = path.join(targetRoot, file)
    if (await exists(target)) {
      if (await sameFile(source, target)) continue
      conflicts.push(file)
    }
  }

  if (conflicts.length > 0 && !options.force) {
    console.error("agents-kit install refused to overwrite existing files:")
    for (const conflict of conflicts) console.error(`- ${conflict}`)
    console.error("\nReview the target repo, then rerun with --force only if replacement is intended.")
    process.exitCode = 1
    return
  }

  for (const file of files) {
    const source = path.join(templateRoot, file)
    const target = path.join(targetRoot, file)
    const action = await exists(target) ? "update" : "create"
    console.log(`${options.dryRun ? "would " : ""}${action} ${file}`)
    if (options.dryRun) continue
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.copyFile(source, target)
  }

  if (!options.dryRun) {
    console.log("\nInstalled agents-kit control plane.")
    console.log("Next: localize .agents/router.md, run the health check, and review the diff.")
  }
}

async function adopt(options) {
  if (options.force) {
    throw new Error("adopt never overwrites files. Use init --force only when resetting to the seed is intended.")
  }
  if (options.overwrite) {
    throw new Error("--overwrite is only supported by update")
  }

  const targetRoot = path.resolve(options.target)
  const files = await listFiles(templateRoot)
  const skipped = []

  for (const file of files) {
    const source = path.join(templateRoot, file)
    const target = path.join(targetRoot, file)

    if (await exists(target)) {
      if (await sameFile(source, target)) {
        console.log(`exists ${file}`)
      } else {
        skipped.push(file)
        console.log(`keep local ${file}`)
      }
      continue
    }

    console.log(`${options.dryRun ? "would " : ""}create ${file}`)
    if (options.dryRun) continue
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.copyFile(source, target)
  }

  if (skipped.length > 0) {
    console.log("\nSkipped existing local files:")
    for (const file of skipped) console.log(`- ${file}`)
    console.log("\nReview diffs for skipped files:")
    for (const file of skipped) {
      printDiff(
        path.join(templateRoot, file),
        path.join(targetRoot, file),
        file,
      )
    }
    console.log("\nMerge useful seed doctrine manually; do not replace repo-shaped local files blindly.")
  }

  if (!options.dryRun) {
    console.log("\nAdopted missing agents-kit files.")
    console.log("Next: run the health check, review skipped files, and commit explicit paths.")
  }
}

async function update(options) {
  const targetRoot = path.resolve(options.target)
  assertCleanWorktree(targetRoot, options)

  const files = await listFiles(templateRoot)
  const changed = []
  const reviewOnly = []

  for (const file of files) {
    const source = path.join(templateRoot, file)
    const target = path.join(targetRoot, file)

    if (!await exists(target)) {
      console.log(`${options.dryRun ? "would " : ""}create ${file}`)
      if (!options.dryRun) {
        await fs.mkdir(path.dirname(target), { recursive: true })
        await fs.copyFile(source, target)
      }
      continue
    }

    if (await sameFile(source, target)) {
      console.log(`unchanged ${file}`)
      continue
    }

    if (isReviewOnly(file)) {
      reviewOnly.push(file)
      console.log(`review local ${file}`)
      continue
    }

    changed.push(file)
    if (options.overwrite) {
      console.log(`${options.dryRun ? "would " : ""}update ${file}`)
      if (!options.dryRun) await fs.copyFile(source, target)
    } else {
      console.log(`keep local ${file}`)
    }
  }

  const reviewFiles = [...reviewOnly, ...(!options.overwrite ? changed : [])]
  if (reviewFiles.length > 0) {
    console.log("\nReview diffs for local files:")
    for (const file of reviewFiles) {
      printDiff(
        path.join(templateRoot, file),
        path.join(targetRoot, file),
        file,
      )
    }
  }

  if (reviewOnly.length > 0) {
    console.log("\nReview-only files were not overwritten because they usually contain repo-local doctrine.")
  }

  if (!options.overwrite && changed.length > 0) {
    console.log("\nRerun with --overwrite to replace non-doctrine seed files.")
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help || !options.command) {
    usage()
    return
  }
  if (options.command === "init") {
    await init(options)
    return
  }
  if (options.command === "adopt") {
    await adopt(options)
    return
  }
  if (options.command === "update") {
    await update(options)
    return
  }
  throw new Error(`unknown command: ${options.command}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
