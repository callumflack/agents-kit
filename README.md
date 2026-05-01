# Dotagents Control Plane

Portable seed for a tiny repo-local `.agents` control plane.

Use this like a shadcn-style installer: run one command in a target repo, copy the seed files in, then review the diff. The target repo owns the files after install.

This repo is a quarry, not a dependency.

## Philosophy

> Compression makes it loadable. Friction makes it honest.

`dotagents-control-plane` is a seed for building repo-local agent harnesses. It keeps the agent surface compressed enough to load and frictional enough to prevent silent drift: `AGENTS.md` points, the router dispatches, resolvers scope the work, gates define done, skills hold technique, logs receipt the run, and `history/` preserves evidence. The seed can travel between repos, but each repo owns its own law.

## Install In Another Repo

Use `init` for a repo that does not already have a `.agents` control plane.

Once this repo is available on GitHub, run from a target repo:

```bash
npx github:callumflack/dotagents-control-plane init
```

Local development from this checkout:

```bash
node /Users/cflack/Repos/callumflack/dotagents-control-plane/bin/dotagents-control-plane.mjs init --target /path/to/repo
```

The installer refuses to overwrite existing files unless `--force` is passed.

## Adopt Into An Existing Repo

Use `adopt` when a repo already has local `.agents` files. It copies only missing seed files and keeps local files untouched.

```bash
npx github:callumflack/dotagents-control-plane adopt
```

Local development from this checkout:

```bash
node /Users/cflack/Repos/callumflack/dotagents-control-plane/bin/dotagents-control-plane.mjs adopt --target /path/to/repo
```

Run a dry pass first when adopting into an active repo:

```bash
node /Users/cflack/Repos/callumflack/dotagents-control-plane/bin/dotagents-control-plane.mjs adopt --target /path/to/repo --dry-run
```

`adopt` reports existing local files as `keep local` and prints unified review diffs for those skipped files. Merge useful seed doctrine manually instead of replacing repo-shaped routers, resolvers, gates, or active-work files.

## Update In Another Repo

For a repo installed from the seed and still close to it, re-run `init` and review the diff:

```bash
npx github:callumflack/dotagents-control-plane init
```

For a mature repo with local `.agents` doctrine, use `adopt` to add missing new pieces and review skipped-file diffs. Use `--force` only when intentionally resetting files to the seed.

## What Gets Installed

```text
AGENTS.md
.agents/
  README.md
  AGENT-CONTROL-PLANE.md
  router.md
  active-work.md
  resolvers/
    README.md
    agent-tooling.md
    rule-rinse.md
  gates/
    README.md
    agent-tooling.md
    rule-rinse.md
  skills/
    dotagents-control-plane/
      SKILL.md
      scripts/check-dotagents-health.py
  logs/
    README.md
history/
  solutions/
    README.md
```

## Localize After Install

1. Edit `.agents/active-work.md`.
2. Replace placeholder router rows with repo-specific surfaces.
3. Add repo-specific resolvers and gates only for current work.
4. Run:

```bash
python3 .agents/skills/dotagents-control-plane/scripts/check-dotagents-health.py
```

5. Review the diff and commit explicit paths.

## Source Repo Checks

Before changing this seed:

```bash
npm run verify
```

The verifier checks that the template has the expected files and that the bundled dotagents health check passes against the template.
