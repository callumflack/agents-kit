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
  const result = verify(root)
  assert.notEqual(result.status, 0, "agents-kit must remain seed-owned")
  assert.match(output(result), /repoSkills\.agents-kit ownership must be seed/)
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
  await fs.writeFile(skillPath, "---\nname: imported\ndescription: test fixture\n---\n")
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
  await fs.writeFile(skillPath, "---\nname: imported\ndescription: test fixture\n---\n")
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
