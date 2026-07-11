#!/usr/bin/env node
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const installer = path.join(repoRoot, "bin", "agents-kit.mjs")
const manifest = ".agents/skills/manifest.json"

async function withTarget(run) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "agents-kit-installer-"))
  try {
    await run(root)
  } finally {
    await fs.rm(root, { recursive: true, force: true })
  }
}

async function write(root, relative, content) {
  const target = path.join(root, relative)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, content)
}

function run(command, root) {
  return spawnSync(process.execPath, [installer, command, "--target", root], {
    cwd: repoRoot,
    encoding: "utf8",
  })
}

function output(result) {
  return `${result.stdout}${result.stderr}`
}

async function assertRefused(result, root) {
  assert.notEqual(result.status, 0, "legacy inventory should be refused")
  assert.match(output(result), /installer will not infer ownership or materialization hashes/i)
  await assert.rejects(fs.access(path.join(root, manifest)))
}

await withTarget(async (root) => {
  await write(root, "skills-lock.json", JSON.stringify({
    skills: {
      imported: { computedHash: "a".repeat(64) },
    },
  }))
  await assertRefused(run("adopt", root), root)
})

await withTarget(async (root) => {
  await write(root, "skills-lock.json", JSON.stringify({ skills: {} }))
  await write(root, ".agents/skills/imported/SKILL.md", "fixture\n")
  await assertRefused(run("update", root), root)
})

await withTarget(async (root) => {
  const result = run("adopt", root)
  assert.equal(result.status, 0, output(result))
  await fs.access(path.join(root, manifest))
})

await withTarget(async (root) => {
  const result = run("update", root)
  assert.equal(result.status, 0, output(result))
  await fs.access(path.join(root, manifest))
})

console.log("installer self-test: PASS")
