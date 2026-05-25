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
- `.agents/logs/*`
- `history/*`
- `skills-lock.json`
- `python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/.agents/skills/<name>/SKILL.md"`
- `python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py`

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
