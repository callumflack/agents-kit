#!/usr/bin/env node
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = path.join(repoRoot, "templates", "default")
const verifier = path.join(repoRoot, "scripts", "verify-template.mjs")
const importedSkillBody = "---\nname: imported\ndescription: fixture\n---\n"
const importedMaterializedHash = "b7e73bd6ee8643f059062b27771430221472c1ede175fae683b176434b038122"

async function withTemplate(run) {
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), "agents-kit-verify-"))
  const root = path.join(parent, "template")
  try {
    await fs.cp(sourceRoot, root, { recursive: true })
    await run(root)
  } finally {
    await fs.rm(parent, { recursive: true, force: true })
  }
}

function verify(root) {
  return spawnSync(process.execPath, [verifier, "--root", root], {
    cwd: repoRoot,
    encoding: "utf8",
  })
}

function health(root) {
  return spawnSync("python3", [
    path.join(root, ".agents", "skills", "agents-kit", "scripts", "check-agents-kit-health.py"),
  ], {
    cwd: root,
    encoding: "utf8",
  })
}

function output(result) {
  return `${result.stdout}${result.stderr}`
}

async function readManifest(root) {
  const manifestPath = path.join(root, ".agents", "skills", "manifest.json")
  return {
    manifestPath,
    manifest: JSON.parse(await fs.readFile(manifestPath, "utf8")),
  }
}

async function writeJson(file, value) {
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`)
}

await withTemplate(async (root) => {
  const result = verify(root)
  assert.equal(result.status, 0, output(result))
})

await withTemplate(async (root) => {
  const target = path.join(root, ".agents", "README.md")
  await fs.appendFile(target, "\n<<<<<<< ours\n||||||| base\n=======\n>>>>>>> theirs\n")
  const result = verify(root)
  assert.notEqual(result.status, 0, "conflict markers should fail verification")
  assert.match(output(result), /conflict marker.*\.agents\/README\.md/i)
})

await withTemplate(async (root) => {
  const target = path.join(root, ".agents", "README.md")
  await fs.appendFile(target, "\n=======\n")
  const result = verify(root)
  assert.equal(result.status, 0, output(result))
})

await withTemplate(async (root) => {
  const { manifestPath, manifest } = await readManifest(root)
  manifest.repoSkills["agents-kit"].ownership = "repo"
  await writeJson(manifestPath, manifest)
  const installedResult = health(root)
  assert.equal(installedResult.status, 0, output(installedResult))
  const result = verify(root)
  assert.notEqual(result.status, 0, "the shipped seed must keep agents-kit seed-owned")
  assert.match(output(result), /Shipped template manifest must declare agents-kit ownership seed/)
})

await withTemplate(async (root) => {
  const lockPath = path.join(root, "skills-lock.json")
  await writeJson(lockPath, {
    skills: {
      "agents-kit": {
        localPath: ".agents/skills/agents-kit/SKILL.md",
        computedHash: "b".repeat(64),
      },
    },
  })
  const { manifestPath, manifest } = await readManifest(root)
  manifest.materializedImports.hashes["agents-kit"] = "a".repeat(64)
  await writeJson(manifestPath, manifest)
  const result = verify(root)
  assert.notEqual(result.status, 0, "overlapping skill owners should fail")
  assert.match(output(result), /skill is both repo-declared and externally locked: agents-kit/)
})

await withTemplate(async (root) => {
  const { manifestPath, manifest } = await readManifest(root)
  manifest.materializedImports.hashes.orphan = "a".repeat(64)
  await writeJson(manifestPath, manifest)
  const result = verify(root)
  assert.notEqual(result.status, 0, "orphan materialization hashes should fail")
  assert.match(output(result), /materialization hash has no externally locked skill: orphan/)
})

await withTemplate(async (root) => {
  const skillPath = path.join(root, ".agents", "skills", "imported", "SKILL.md")
  await fs.mkdir(path.dirname(skillPath), { recursive: true })
  await fs.writeFile(skillPath, importedSkillBody)
  await writeJson(path.join(root, "skills-lock.json"), {
    skills: {
      imported: {
        localPath: ".agents/skills/imported/SKILL.md",
        computedHash: "c".repeat(64),
      },
    },
  })
  const result = verify(root)
  assert.notEqual(result.status, 0, "a locked skill without materialization coverage should fail")
  assert.match(output(result), /externally locked skill missing materialization hash: imported/)
})

await withTemplate(async (root) => {
  const skillPath = path.join(root, ".agents", "skills", "imported", "SKILL.md")
  await fs.mkdir(path.dirname(skillPath), { recursive: true })
  await fs.writeFile(skillPath, importedSkillBody)
  await writeJson(path.join(root, "skills-lock.json"), {
    skills: {
      imported: {
        localPath: ".agents/skills/imported/SKILL.md",
        computedHash: "OPAQUE",
      },
    },
  })
  const { manifestPath, manifest } = await readManifest(root)
  manifest.materializedImports.hashes.imported = "d".repeat(64)
  await writeJson(manifestPath, manifest)
  const result = verify(root)
  assert.notEqual(result.status, 0, "an invalid computedHash shape should fail")
  assert.match(output(result), /computedHash is not 64 lowercase hex: imported/)
})

await withTemplate(async (root) => {
  const skillPath = path.join(root, ".agents", "skills", "imported", "SKILL.md")
  await fs.mkdir(path.dirname(skillPath), { recursive: true })
  await fs.writeFile(skillPath, importedSkillBody)
  await writeJson(path.join(root, "skills-lock.json"), {
    skills: {
      imported: {
        localPath: ".agents/skills/imported/SKILL.md",
        computedHash: "e".repeat(64),
      },
    },
  })
  const { manifestPath, manifest } = await readManifest(root)
  manifest.materializedImports.hashes.imported = importedMaterializedHash
  await writeJson(manifestPath, manifest)
  const result = verify(root)
  assert.equal(result.status, 0, output(result))

  await fs.appendFile(skillPath, "# drift\n")
  const drift = verify(root)
  assert.notEqual(drift.status, 0, "materialized import drift should fail")
  assert.match(output(drift), /materialized skill hash drift: imported/)
})

await withTemplate(async (root) => {
  const skillPath = path.join(root, ".agents", "skills", "imported", "SKILL.md")
  await fs.mkdir(path.dirname(skillPath), { recursive: true })
  await fs.writeFile(skillPath, importedSkillBody)
  await writeJson(path.join(root, "skills-lock.json"), {
    skills: {
      imported: {
        localPath: "../outside/SKILL.md",
        computedHash: "f".repeat(64),
      },
    },
  })
  const { manifestPath, manifest } = await readManifest(root)
  manifest.materializedImports.hashes.imported = importedMaterializedHash
  await writeJson(manifestPath, manifest)
  const result = verify(root)
  assert.notEqual(result.status, 0, "a localPath outside the repo should fail")
  assert.match(output(result), /localPath escapes repo root: imported -> \.\.\/outside\/SKILL\.md/)
})

await withTemplate(async (root) => {
  const { manifestPath, manifest } = await readManifest(root)
  manifest.repoSkills.missing = { ownership: "repo" }
  await writeJson(manifestPath, manifest)
  const result = verify(root)
  assert.notEqual(result.status, 0, "a declared skill without a body should fail")
  assert.match(output(result), /repo-declared skill missing SKILL\.md: \.agents\/skills\/missing/)
})

await withTemplate(async (root) => {
  const skillPath = path.join(root, ".agents", "skills", "unowned", "SKILL.md")
  await fs.mkdir(path.dirname(skillPath), { recursive: true })
  await fs.writeFile(skillPath, "---\nname: unowned\ndescription: test fixture\n---\n")
  const result = verify(root)
  assert.notEqual(result.status, 0, "a materialized directory without an owner should fail")
  assert.match(output(result), /skill has no manifest owner: \.agents\/skills\/unowned/)
})

console.log("template verifier self-test: PASS")
