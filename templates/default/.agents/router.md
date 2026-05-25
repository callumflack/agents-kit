# Agent Router

Use this first. Pick the narrowest matching row.

| Trigger | Resolver | Gate | Skill |
| --- | --- | --- | --- |
| failed checks, repeated misses, stale task state, learning-promotion questions, repair-loop decisions, maintenance-rinse findings | `.agents/resolvers/factory-failure.md` | `.agents/gates/factory-failure.md` | `.agents/skills/agents-kit` when patching `.agents` or learning surfaces; otherwise route by classified owner |
| agent tooling, docs placement, `.agents` control-plane, `.scratch`, PRDs, skills, host-specific agent setup, lesson artifacts | `.agents/resolvers/agent-tooling.md` | `.agents/gates/agent-tooling.md` | `.agents/skills/agents-kit` for `.agents` changes; otherwise matching `.agents/skills/*` |
| resolver/gate/router quality pass | `.agents/resolvers/rule-rinse.md` | `.agents/gates/rule-rinse.md` | none by default |

## Priority Rules

- Agent tooling work stays in the control-plane lane unless the user explicitly switches into product implementation.
- Factory failure classifies a miss before repair; it does not replace the selected owner resolver or gate.
- Repo-specific product rows should be added only after live repo evidence exists.
