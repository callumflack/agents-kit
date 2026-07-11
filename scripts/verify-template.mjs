#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
function parseRoot(argv) {
  if (argv.length === 0) return path.join(repoRoot, "templates", "default")
  if (argv.length === 2 && argv[0] === "--root" && argv[1]) {
    return path.resolve(argv[1])
  }
  throw new Error("usage: verify-template.mjs [--root <template-root>]")
}

const templateRoot = parseRoot(process.argv.slice(2))

const requiredFiles = [
  "AGENTS.md",
  "skills-lock.json",
  ".agents/README.md",
  ".agents/AGENT-CONTROL-PLANE.md",
  ".agents/router.md",
  ".agents/resolvers/README.md",
  ".agents/resolvers/agent-tooling.md",
  ".agents/resolvers/factory-failure.md",
  ".agents/gates/README.md",
  ".agents/gates/agent-tooling.md",
  ".agents/gates/factory-failure.md",
  ".agents/commands/README.md",
  ".agents/checks/README.md",
  ".agents/skills/README.md",
  ".agents/skills/manifest.json",
  ".agents/skills/agents-kit/SKILL.md",
  ".agents/skills/agents-kit/scripts/check-agents-kit-health.py",
  ".agents/skills/agents-kit/scripts/check-skill-frontmatter.py",
  ".agents/logs/README.md",
  ".scratch/README.md",
  "history/README.md",
  "history/plans/README.md",
  "history/lessons/README.md",
]

async function exists(relativePath) {
  try {
    await fs.access(path.join(templateRoot, relativePath))
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

const missing = []
for (const file of requiredFiles) {
  if (!await exists(file)) missing.push(file)
}

if (missing.length > 0) {
  console.error("Template missing required files:")
  for (const file of missing) console.error(`- ${file}`)
  process.exit(1)
}

const conflictMarkers = ["<<<<<<<", "|||||||", ">>>>>>>"]
const conflicts = []
for (const file of await listFiles(templateRoot)) {
  const text = await fs.readFile(path.join(templateRoot, file), "utf8")
  for (const marker of conflictMarkers) {
    if (text.includes(marker)) conflicts.push({ file, marker })
  }
}

if (conflicts.length > 0) {
  console.error("Template contains conflict markers:")
  for (const { file, marker } of conflicts) {
    console.error(`- conflict marker ${marker} in ${file}`)
  }
  process.exit(1)
}

const health = spawnSync("python3", [
  path.join(templateRoot, ".agents/skills/agents-kit/scripts/check-agents-kit-health.py"),
], {
  cwd: templateRoot,
  encoding: "utf8",
})

process.stdout.write(health.stdout)
process.stderr.write(health.stderr)

if (health.status !== 0) {
  process.exit(health.status ?? 1)
}

console.log("template verify: PASS")
