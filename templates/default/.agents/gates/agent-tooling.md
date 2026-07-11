# Agent Tooling Gate

Done means:

- `.agents/skills/agents-kit/` exists when `.agents` control-plane behavior is being edited;
- nontrivial edits used the canonical five-field ownership receipt from `.agents/AGENT-CONTROL-PLANE.md`; evidence order or a next oracle was added only when the task required it;
- `python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py` passes when router, resolver, gate, command, check, skill, or lesson-artifact structure changes;
- captured lesson artifacts live under `history/lessons/`, not `.agents/`;
- `skills-lock.json` matches the intended installed skill set;
- skill inventory changes prove source-of-truth lookup happened before edits: `skills-lock.json`, existing `.agents/skills/<name>/`, and any user-provided install command or upstream docs were checked;
- third-party skills are installed with the repo skill manager, not hand-authored under `.agents/skills/*`;
- hand-authored `.agents/skills/<name>/` additions are explicitly logged as local-only skills;
- hand-authored or edited local-only skills pass `python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py .agents/skills/<name>/SKILL.md`;
- `AGENTS.md` stays short and points to `.agents/`;
- touched `history/lessons/*` notes have valid shape and promotion-state metadata;
- learning lifecycle decisions point to `.agents/resolvers/factory-failure.md` and close through `.agents/gates/factory-failure.md`, not agent-tooling;
- `agents-kit` scripts are limited to objective control-plane health checks;
- objective repo or agent-process checks live under `.agents/checks/*`, not `agents-kit`;
- command files collapse repeated hops and call checks; they do not own verdicts or hide owner selection;
- delegated subagent work follows `.agents/resolvers/agent-tooling.md`: spawn once, report id, keep write sets disjoint, verify the returned result, then close the worker;
- `.agents` contains no current-focus or build-loop runtime state;
- plan-specific one-off work is not authored as a live resolver/gate;
- `git status --short --ignored` shows no accidental local-only staged files.
