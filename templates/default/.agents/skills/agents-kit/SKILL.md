---
name: agents-kit
description: Maintain a repo-local .agents control plane. Use when creating, reviewing, or editing AGENTS.md, .agents/router.md, .agents/resolvers, .agents/gates, .agents/skills, .agents/logs, history/lessons, or the agent-control-plane doctrine.
---

# Agents Kit

Use this skill for safe surgery on this repo's local `.agents` system.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `.agents/README.md`
- `.agents/AGENT-CONTROL-PLANE.md`
- `.agents/router.md`
- the resolver and gate for the current task
- every file being changed

## Placement

Place changes by function:

| If it answers... | Put it in... |
| --- | --- |
| What task route applies? | `.agents/router.md` |
| What scope, reads, writes, and non-goals apply? | `.agents/resolvers/*` |
| What makes the work done? | `.agents/gates/*` |
| What repeatable method helps? | `.agents/skills/*` |
| What objective control-plane invariant needs repeatable checking? | `.agents/skills/agents-kit/scripts/*` |
| What objective factory or repo invariant needs repeatable checking? | `docs/checks/*` or package scripts |
| What happened this run? | `.agents/logs/*` |
| What captured lesson artifact exists? | `history/lessons/*` |
| What is dated evidence? | `history/*` |

Skills hold technique, not law. Resolvers own routing and scope. Gates own done checks. Logs orient handoff. History is evidence. Git proves commits and diffs. `history/lessons/` stores lesson artifacts only.

## Skill Procedure

1. Classify the requested change with the placement table.
2. For any skill inventory change, inspect `skills-lock.json`, the existing skill directory, and any user-provided install command or upstream docs before editing.
3. Use the repo skill manager for third-party skills, for example `npx skills add <source>`. Hand-author a skill only when it is explicitly local-only.
4. Patch the narrowest live surface that would prevent the failure or ambiguity.
5. Keep `AGENTS.md` as a boot pointer; do not grow it into a handbook.
6. Keep `.agents/` live and executable; do not put reusable lessons in `.agents/`.
7. For the learning lifecycle, use `.agents/resolvers/factory-failure.md`; for lifecycle closeout, use `.agents/gates/factory-failure.md`.
8. Keep `history/lessons/*` edits to note shape and the promotion outcome selected by `factory-failure`.
9. Add `agents-kit` scripts only for objective control-plane health checks. Put factory-state checks in `docs/checks/*`; put product validation commands in package scripts. Do not add product task runners, app workflow commands, current-focus managers, or dashboard sync scripts under `.agents`.
10. Run the health check when router, resolver, gate, skill, or lesson-artifact structure changes:

```bash
python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py
```

11. Update the relevant session note in `.agents/logs/` when handoff context changes.

## Do Not

- Do not make CE a dependency or operating law.
- Do not treat `history/lessons/` as live behavior.
- Do not put completed plans or execution ledgers in `history/lessons/`; keep completed plans in `history/plans/` and execution ledgers in `history/`.
- Do not patch product code during control-plane work unless the user explicitly switches scope.
- Do not use generic skill packaging rules as a substitute for `.agents` placement.
- Do not hand-create third-party skill mirrors. Install them through the documented skill manager.
