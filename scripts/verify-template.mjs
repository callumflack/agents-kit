#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const templateRoot = path.join(repoRoot, "templates", "default")

const requiredFiles = [
  "AGENTS.md",
  "skills-lock.json",
  ".agents/README.md",
  ".agents/AGENT-CONTROL-PLANE.md",
  ".agents/router.md",
  ".agents/resolvers/README.md",
  ".agents/resolvers/agent-tooling.md",
  ".agents/resolvers/factory-failure.md",
  ".agents/resolvers/rule-rinse.md",
  ".agents/gates/README.md",
  ".agents/gates/agent-tooling.md",
  ".agents/gates/factory-failure.md",
  ".agents/gates/rule-rinse.md",
  ".agents/skills/README.md",
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

const missing = []
for (const file of requiredFiles) {
  if (!await exists(file)) missing.push(file)
}

if (missing.length > 0) {
  console.error("Template missing required files:")
  for (const file of missing) console.error(`- ${file}`)
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
