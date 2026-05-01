# AGENTS

Boot file only. Do not put workflow detail here.

## Start

1. Read `.agents/router.md`.
2. Read `.agents/active-work.md` when the request needs current project context.
3. Pick the matching resolver.
4. Run the required gate before calling the task done.
5. If the work changes durable state, write a receipt in `.agents/logs/`.

## Invariants

- Stage explicit paths only.
- Do not commit secrets, local credentials, `.env*`, `.pi/`, caches, or build output.
- `history/` is evidence: audits, plans, decisions, reports. It is not live operating law.
- `.agents/` is the control plane: router, resolvers, gates, active state, logs, skills.

## Skills

Repo-local Codex skills live in `.agents/skills/`.

When a user needs another agent host, sync or copy the needed skills into that host's expected local directory, for example `.claude/skills/` and `.claude/commands/` for Claude. Keep `.agents/skills/` as the Codex-facing repo source unless the user says otherwise.

## Repair Rule

If an agent repeats a mistake, patch the narrowest live surface that would have prevented it:

| Miss | Patch |
| --- | --- |
| wrong task route | `.agents/router.md` |
| wrong decision shape | `.agents/resolvers/*` |
| weak done check | `.agents/gates/*` |
| technique gap | `.agents/skills/*` |
| stale plan/history | new `history/YYMMDD-{type}-{slug}.md` |
| recurring project context | `.agents/active-work.md` |

`AGENTS.md` points. Resolvers decide shape. Gates decide done. Skills hold technique. Logs are receipts. History is evidence.
