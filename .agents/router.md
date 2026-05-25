# Agent Router

Use this first. Pick the narrowest matching row.

| Trigger | Resolver | Gate | Skill |
| --- | --- | --- | --- |
| `AGENTS.md`, root `.agents/**`, root skill policy, `.gitignore` agent surfaces, maintainer docs about agent workflow | `.agents/resolvers/agent-tooling.md` | `.agents/gates/agent-tooling.md` | local installed skills only when already present |
| repeated correction, scope drift, wrong tool choice, done claimed without check, accidental staging, unclear owner surface | `.agents/resolvers/factory-failure.md` | `.agents/gates/factory-failure.md` | local installed skills only when already present |

## Priority Rules

- This root harness governs `agents-kit` repository maintenance only.
- The shipped seed lives under `templates/default/**`; do not confuse it with root maintainer tooling.
- Root `.agents/skills/` is local installed tooling and should stay uncommitted.
