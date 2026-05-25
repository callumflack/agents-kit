---
name: agents-kit
description: "Use when editing or reviewing the shipped agents-kit .agents harness seed, installer behavior, verifier, package README, or a target repo .agents surface installed from this seed."
---

# Agents Kit

Maintain the shipped `.agents` harness seed. Keep this skill procedural. If a rule belongs in the router, resolver, gate, doctrine, script, log, or history, say so and patch that owner instead.

## Source Order

Use the nearest live source:

1. `templates/default/**` is the shipped seed.
2. `bin/agents-kit.mjs` owns `init`, `adopt`, `update`, `--dry-run`, `--force`, `--overwrite`, dirty-worktree, and review-only behavior.
3. `scripts/verify-template.mjs` owns source-repo template verification.
4. `README.md` describes package usage; keep it behavior-accurate with the installer.
5. Installed target repos own local doctrine after install, but `.agents/skills/agents-kit/**` is seed-managed unless deliberately forked. Do not back-port target-local doctrine into the seed unless the user asks to change the default.
6. Source-repo local or untracked `.agents/` and `skills-lock.json` surfaces are maintainer-local, not shipped seed, unless they are under `templates/default/`.

## Modes

- Template edit: change `templates/default/**`; preserve the control-plane roles; run the seed gates.
- Installer edit: change `bin/agents-kit.mjs`; verify template shape and smoke the affected command path.
- Docs edit: change `README.md` only when package-facing usage or behavior changed; do not create extra docs.
- Target repo edit: follow that repo's `AGENTS.md`, router, resolver, and gate; treat `agents-kit` as the quarry, not the owner.
- Read-only assessment: inspect the live source, name the owner and oracle, then report without edits.

## Before Editing

State a compact ownership receipt before nontrivial edits:

```text
Request:
Mode:
Source of truth / evidence order:
Owner surface:
Allowed writes:
Forbidden surfaces:
Done gate:
First oracle:
Next oracle:
```

Check `git status --short` first. Keep unrelated dirty files untouched. Stage explicit paths only.

## Placement Test

Put instructions where they act. In the source repo, prefix `.agents/...` and `history/*` rows with `templates/default/`. In an installed target repo, use the paths as written.

| If it answers... | Put it in... |
| --- | --- |
| What task route applies? | `.agents/router.md` |
| What scope, reads, writes, and non-goals apply? | `.agents/resolvers/*` |
| What proves done? | `.agents/gates/*` |
| What repeatable method helps? | `.agents/skills/*` |
| What objective control-plane invariant needs checking? | `.agents/skills/agents-kit/scripts/*` |
| What happened this run? | `.agents/logs/*` |
| What dated evidence exists? | `history/*` |
| What is package behavior? | Source repo only: `bin/agents-kit.mjs`, with README copy following it |

Do not duplicate full control-plane doctrine in this skill.

## Skill Boundary

Before adding or changing a skill, inspect `skills-lock.json`, the existing skill directory, and any user-provided install command or upstream docs.

- Treat `.agents/skills/agents-kit/**` as seed-managed whether or not it appears in `skills-lock.json`. Do not hand-edit an installed copy for target-local behavior unless the user deliberately forks it.
- If another skill is listed in `skills-lock.json`, treat it as an installed mirror. Do not hand-edit it for local behavior repair.
- If another skill is third-party or installer-owned, use the installer and let it update the mirror and lock.
- Hand-author a skill only when it is explicitly local-only repo technique.

Use the command for the current mode.

Source repo:

```bash
python3 templates/default/.agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/templates/default/.agents/skills/<name>/SKILL.md"
```

Installed target repo:

```bash
python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/.agents/skills/<name>/SKILL.md"
```

## Gates

Run the narrowest real gate that matches the change:

Source repo:

```bash
python3 templates/default/.agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/templates/default/.agents/skills/agents-kit/SKILL.md"
npm run verify
```

Installed target repo:

```bash
python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/.agents/skills/agents-kit/SKILL.md"
python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py
```

Also run:

- `npm pack --dry-run --json` when package contents, `package.json` `files`, installer distribution, or shipped file paths change.
- Temp `init`, `adopt`, and/or `update` smoke tests when installer behavior changes. Include dirty-worktree, dry-run, overwrite, and review-only cases when touched.

## Do Not Reintroduce

- `.agents/active-work.md`
- `.agents/current-work.md`
- `history/solutions/`
- `history/learnings/`
- product task runners, dashboard sync, or app workflow state under `.agents/skills/agents-kit/scripts/`
