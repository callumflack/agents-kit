# Agent Router

Use this first. Pick the narrowest matching row.

| Trigger | Resolver | Gate | Skill |
| --- | --- | --- | --- |
| failed checks, repeated misses, stale task state, learning-promotion questions, repair-loop decisions, maintenance-rinse findings | `.agents/resolvers/factory-failure.md` | `.agents/gates/factory-failure.md` | `.agents/skills/agents-kit` when patching `.agents` or learning surfaces; otherwise route by classified owner |
| agent tooling, docs placement, `.agents` control-plane, `.agents/commands`, `.agents/checks`, `.scratch`, PRDs, skills, host-specific agent setup, lesson artifacts, initial repo setup, package-script plumbing, resolver/gate/router quality pass | `.agents/resolvers/agent-tooling.md` | `.agents/gates/agent-tooling.md` | `.agents/skills/agents-kit` for `.agents` changes; otherwise matching `.agents/skills/*` |

## Priority Rules

- Agent tooling work stays in the control-plane lane unless the user explicitly switches into product implementation.
- Resolver, gate, and router quality passes use agent-tooling plus `.agents/AGENT-CONTROL-PLANE.md`; do not create a second live lane for rule cleanup.
- Factory failure classifies a miss before repair; it does not replace the selected owner resolver or gate.
- Repo-specific product rows should be added only after live repo evidence exists.
