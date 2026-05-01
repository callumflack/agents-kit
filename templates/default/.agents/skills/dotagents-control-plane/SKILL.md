---
name: dotagents-control-plane
description: Maintain a repo-local .agents control plane. Use when creating, reviewing, or editing AGENTS.md, .agents/router.md, .agents/resolvers, .agents/gates, .agents/skills, .agents/logs, history/solutions, or the agent-control-plane doctrine.
---

# Dotagents Control Plane

Use this skill for safe surgery on this repo's local `.agents` system.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `.agents/README.md`
- `.agents/AGENT-CONTROL-PLANE.md`
- `.agents/router.md`
- the resolver and gate for the current task
- any skill, log, or `history/solutions/` file being changed

## Placement

Place changes by function:

| If it answers... | Put it in... |
| --- | --- |
| What task route applies? | `.agents/router.md` |
| What scope, reads, writes, and non-goals apply? | `.agents/resolvers/*` |
| What makes the work done? | `.agents/gates/*` |
| What repeatable method helps? | `.agents/skills/*` |
| What is current project state? | `.agents/active-work.md` |
| What happened this run? | `.agents/logs/*` |
| What reusable lesson was learned? | `history/solutions/*` |
| What is dated evidence? | `history/*` |

Skills hold technique, not law. Resolvers own routing and scope. Gates own done checks. Logs are receipts. History is evidence. Solutions are reusable learning.

## Workflow

1. Classify the requested change with the placement table.
2. Patch the narrowest live surface that would prevent the failure or ambiguity.
3. Keep `AGENTS.md` as a boot pointer; do not grow it into a handbook.
4. Keep `.agents/` live and executable; do not put reusable lessons in `.agents/`.
5. If completed work revealed a reusable pattern, write `history/solutions/<slug>.md`.
6. If that pattern must change future behavior, also promote it into a resolver, gate, or skill.
7. Add scripts only when reliability matters or the same check would otherwise be reimplemented.
8. Run the health check when router, resolver, gate, skill, or captured-learning structure changes:

```bash
python3 .agents/skills/dotagents-control-plane/scripts/check-dotagents-health.py
```

9. Write a receipt in `.agents/logs/`.

## Do Not

- Do not make CE a dependency or operating law.
- Do not treat `history/solutions/` as live behavior.
- Do not put completed plans or execution ledgers in `history/solutions/`; keep them in `history/`.
- Do not patch product code during control-plane work unless the user explicitly switches scope.
- Do not use generic skill packaging rules as a substitute for `.agents` placement.
