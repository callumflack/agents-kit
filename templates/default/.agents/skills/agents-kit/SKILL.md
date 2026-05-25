---
name: agents-kit
description: "Use when editing or reviewing this repo's installed .agents control plane, agents-kit bundled health scripts, or repo-local agent doctrine."
---

# Agents Kit

Maintain this repo's installed `.agents` control plane. Keep this skill procedural. If a rule belongs in the router, resolver, gate, doctrine, script, log, or history, patch that owner instead.

## Scope

Use the nearest live source:

1. `AGENTS.md` boots the local instructions.
2. `.agents/router.md` owns task routing.
3. `.agents/resolvers/*` owns scope, reads, writes, owners, and non-goals.
4. `.agents/gates/*` owns done checks.
5. `.agents/skills/*` owns repeatable technique.
6. `.agents/logs/*` owns handoff notes, not live law.
7. `history/*` owns dated evidence, not current law.
8. `skills-lock.json` records installed skill mirrors.

## Modes

- Control-plane edit: change the narrowest `.agents/**`, `AGENTS.md`, `skills-lock.json`, or `history/*` owner surface.
- Skill edit: change `.agents/skills/<name>/SKILL.md` only after checking `skills-lock.json` and the existing skill directory.
- Health-script edit: change `.agents/skills/agents-kit/scripts/*`; run the local health gate.
- Read-only assessment: inspect live files, name owner and oracle, then report without edits.

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

Put instructions where they act.

| If it answers... | Put it in... |
| --- | --- |
| What task route applies? | `.agents/router.md` |
| What scope, reads, writes, and non-goals apply? | `.agents/resolvers/*` |
| What proves done? | `.agents/gates/*` |
| What repeatable method helps? | `.agents/skills/*` |
| What objective control-plane invariant needs checking? | `.agents/skills/agents-kit/scripts/*` |
| What happened this run? | `.agents/logs/*` |
| What dated evidence exists? | `history/*` |

Do not duplicate full control-plane doctrine in this skill.

## Skill Boundary

Before adding or changing a skill, inspect `skills-lock.json`, the existing skill directory, and any user-provided install command or upstream docs.

- Treat `.agents/skills/agents-kit/**` as seed-managed whether or not it appears in `skills-lock.json`. Do not edit it for target-local behavior unless the user deliberately forks it.
- Put target-local doctrine in the router, resolver, gate, docs, logs, or history.
- If another skill is listed in `skills-lock.json`, treat it as an installed mirror. Do not hand-edit it for local behavior repair.
- If another skill comes from upstream docs or an external source, refresh it through that source's documented command and keep `skills-lock.json` in sync; do not hand-edit the mirror for local behavior repair.
- Hand-author a skill only when it is explicitly local-only repo technique.

For local-only skill authoring or edits, run:

```bash
python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/.agents/skills/<name>/SKILL.md"
```

## Gates

Run the narrowest real gate that matches the change:

```bash
python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/.agents/skills/agents-kit/SKILL.md"
python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py
```

## Do Not Reintroduce

- `.agents/active-work.md`
- `.agents/current-work.md`
- `history/solutions/`
- `history/learnings/`
- product task runners, dashboard sync, or app workflow state under `.agents/skills/agents-kit/scripts/`
