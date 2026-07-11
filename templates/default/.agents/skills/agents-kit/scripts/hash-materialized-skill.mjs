#!/usr/bin/env node
import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

async function collectFiles(base, current, files) {
  for (const entry of await readdir(current, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue
    const absolute = path.join(current, entry.name)
    if (entry.isDirectory()) {
      await collectFiles(base, absolute, files)
    } else if (entry.isFile()) {
      files.push({
        relative: path.relative(base, absolute).split(path.sep).join("/"),
        content: await readFile(absolute),
      })
    }
  }
}

const directory = process.argv[2]
if (!directory || process.argv.length !== 3) {
  console.error("usage: hash-materialized-skill.mjs <skill-directory>")
  process.exit(1)
}

const files = []
await collectFiles(directory, directory, files)
files.sort((a, b) => a.relative.localeCompare(b.relative))

const hash = createHash("sha256")
for (const file of files) {
  hash.update(file.relative)
  hash.update(file.content)
}
console.log(hash.digest("hex"))
