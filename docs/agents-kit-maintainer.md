# Agents Kit Maintainer

Use this when editing the package that ships the `.agents` seed.

## Hard Boundary

`templates/default/**` is external-facing. Anything under it must read as if the agent is inside an installed target repo.

Do not ship source-maintainer instructions in `templates/default/.agents/skills/agents-kit/SKILL.md`.

## Owner Map

| If changing... | Owner |
| --- | --- |
| Installed repo operator guidance | `templates/default/.agents/skills/agents-kit/SKILL.md` |
| Seed control-plane files | `templates/default/**` |
| Installer behavior | `bin/agents-kit.mjs` |
| Template verifier | `scripts/verify-template.mjs` |
| Package-facing usage | `README.md` |
| Maintainer-only guidance | `docs/agents-kit-maintainer.md` |

## Shipped Skill Rule

The shipped `agents-kit` skill is an installed target operator guide.

It may mention:

- `AGENTS.md`
- `.agents/router.md`
- `.agents/resolvers/*`
- `.agents/gates/*`
- `.agents/skills/*`
- `.agents/skills/manifest.json`
- `.agents/logs/*`
- `history/*`
- `skills-lock.json`
- `python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/.agents/skills/<name>/SKILL.md"`
- `python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py`

It should stay procedural and point to the installed router, control-plane doctrine, resolver, and gate rather than repeat their placement maps.

It must not mention:

- `templates/default/**`
- `bin/agents-kit.mjs`
- `scripts/verify-template.mjs`
- package `README.md`
- `npm run verify`
- `npm pack --dry-run --json`
- package command smoke tests

## Maintainer Checks

Run the narrowest relevant checks:

```bash
rg "templates/default|bin/agents-kit|scripts/verify-template|package README|npm run verify|npm pack|init|adopt|update" templates/default/.agents/skills/agents-kit/SKILL.md
npm run verify
```

The first command should return no matches when the shipped skill was edited.

Also run `npm pack --dry-run --json` when package contents, `package.json` `files`, installer distribution, or shipped file paths change.

Smoke test package commands when installer behavior changes. Cover clean-worktree, dirty-worktree, dry-run, overwrite, and review-only cases for the touched command path.

## Harvest Rule (2026-06-10)

Before any seed release, diff the live unity-surfaces `.agents` shape (`/Users/cflack/Repos/vana-com/unity-surfaces/.agents`: top-level entries plus resolver/gate/skill filenames) against `templates/default`. Classify each delta adopt/reject/defer with a dated note in this section.

### Harvest 2026-06-10

Live-only deltas:

| Delta | Decision | Note |
| --- | --- | --- |
| top-level `loops/` (`doc-drift.md`, `doc-drift-state.md`) | defer | adopt into the seed after 5 recorded loop runs including verifier verdicts demonstrate the shape holds; kit priority rule: rows only after live repo evidence |
| resolvers `repo-bootstrap.md`, `runtime-boundary.md`, `shared-package.md`, `testing.md`, `web-surface.md` | reject | repo-grown surfaces; the seed ships the minimal control plane and target repos grow their own |
| gates `git-handover.md`, `repo-bootstrap.md`, `runtime-boundary.md`, `shared-package.md`, `testing.md`, `web-surface.md` | reject | pair with repo-grown resolvers, not seed doctrine |
| 50 installed skills beyond `agents-kit` | reject | target-local, lock-managed installs; the seed ships only the `agents-kit` operator skill |
| `.DS_Store` (top-level and `skills/`) | reject | OS noise |

No seed entry is missing from live.

Drift note: `templates/default/.agents/resolvers/factory-failure.md` carries uncommitted drift (a Friction Promotion Shape addition) awaiting the owner's commit. Do not commit it during harvest.

### Delta noted 2026-06-11

| Delta | Decision | Note |
| --- | --- | --- |
| top-level `roles/` (vendor-neutral sub-agent role doctrine; `.claude/agents/`/`.codex/agents/` as thin capability adapters) | defer (adopt-candidate) | ratified as unity law 2026-06-11 per Callum (Authority Map row added); minted by an agent session in unity `60f5e0c6` — no ecosystem prior art beyond Flue's roles primitive. Adopt into the seed once a second role (e.g. `doc-drift-verifier`) proves the pattern beyond one instance |
