# Agent Router

Use this first. Pick the narrowest matching row.

Resolver rows are dispatch rules. Gates decide done. Draft resolvers/gates must be rinsed against live repo evidence before being treated as stable.

| Trigger | Resolver | Gate | Skill |
| --- | --- | --- | --- |
| agent tooling, `.agents` control-plane, skills, OpenSpec, Claude/Codex surfaces | `.agents/resolvers/agent-tooling.md` | `.agents/gates/agent-tooling.md` | `dotagents-control-plane` for `.agents` changes; otherwise matching `.agents/skills/*` |
| resolver/gate quality pass | `.agents/resolvers/rule-rinse.md` | `.agents/gates/rule-rinse.md` | none by default |

## Priority Rules

- Security and secret handling beats feature polish.
- Add repo-specific resolver rows only after inspecting live repo evidence.
- If the request names one surface, the named resolver wins once it exists.
- OpenSpec is optional workflow tooling; do not force it into small tasks.
- `history/` can inform context, but live routing comes from `.agents/`.
