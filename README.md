# agents-kit

Portable seed for a repo-local `.agents` control plane.

`agents-kit` gives a cold coding agent a small operating surface before it edits:
where to start, how to route the task, what scope applies, what check proves
done, and where evidence belongs.

It is a seed and quarry, not a runtime dependency. Install it into a target repo,
review the diff, then let that repo own the files.

## Core Model

- `AGENTS.md` points to the control plane.
- `.agents/router.md` dispatches task shape to resolver, gate, and skill.
- `.agents/resolvers/*` scope reads, writes, owners, and non-goals.
- `.agents/gates/*` verify done with observable checks.
- `.agents/skills/*` teach repeatable technique.
- `.agents/logs/*` orient handoff.
- `history/*` preserves dated evidence.

## Install

Use `init` for a repo that does not already have `.agents` files.

```bash
npx github:callumflack/agents-kit init
```

Install into another path:

```bash
npx github:callumflack/agents-kit init --target /path/to/repo
```

From this checkout:

```bash
node /Users/cflack/Repos/callumflack/agents-kit/bin/agents-kit.mjs init --target /path/to/repo
```

`init` refuses to overwrite conflicting files. Use `--force` only when replacing
the target files is intentional.

## Adopt

Use `adopt` when a repo already has local agent files.

```bash
npx github:callumflack/agents-kit adopt --target /path/to/repo
```

`adopt` creates missing seed files only. Existing local files are reported as
`keep local`; differing files get review diffs. Merge useful seed doctrine
manually.

## Update

Use `update` to roll an existing installation forward from this seed.

```bash
npx github:callumflack/agents-kit update --target /path/to/repo
```

`update` requires a clean target git worktree before writing. It creates missing
files, keeps local doctrine by default, and prints review diffs for changed
files.

Replace changed non-doctrine seed files:

```bash
npx github:callumflack/agents-kit update --target /path/to/repo --overwrite
```

`--overwrite` still does not replace review-only files.

## Dry Run

Add `--dry-run` to preview without writes.

```bash
npx github:callumflack/agents-kit init --target /path/to/repo --dry-run
npx github:callumflack/agents-kit adopt --target /path/to/repo --dry-run
npx github:callumflack/agents-kit update --target /path/to/repo --dry-run
```

For `update`, dry-run can run on a dirty target worktree. It warns and previews
only.

## Installed Files

Current template:

```text
AGENTS.md
skills-lock.json
.agents/
  README.md
  AGENT-CONTROL-PLANE.md
  router.md
  resolvers/
    README.md
    agent-tooling.md
    factory-failure.md
    rule-rinse.md
  gates/
    README.md
    agent-tooling.md
    factory-failure.md
    rule-rinse.md
  skills/
    README.md
    agents-kit/
      SKILL.md
      scripts/
        check-agents-kit-health.py
        check-skill-frontmatter.py
  logs/
    README.md
.scratch/
  README.md
history/
  README.md
  plans/
    README.md
  lessons/
    README.md
```

## Update Protection

During `update`, these files are review-only and are not overwritten:

```text
AGENTS.md
skills-lock.json
.agents/AGENT-CONTROL-PLANE.md
.agents/router.md
.agents/resolvers/*
.agents/gates/*
.agents/logs/*
history/*
.scratch/*
```

All existing files are protected during `adopt`.

## Localize

After install:

1. Keep `AGENTS.md` short.
2. Replace placeholder router rows only after live repo evidence exists.
3. Add repo-specific resolvers for recurring task lanes.
4. Add gates with concrete checks, not vague verification language.
5. Keep logs for handoff context, not live law.
6. Keep dated evidence in `history/`.

## Verify

In this source repo:

```bash
npm run verify
```

In an installed target repo:

```bash
python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py
```

The source verifier checks the transported template file list and runs the
installed health check against `templates/default`.
