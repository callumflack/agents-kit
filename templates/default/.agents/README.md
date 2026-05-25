# Agent Control Plane

Live agent operating files for this repo.

`AGENTS.md` points. Router dispatches. Resolvers scope. Gates verify. Skills teach technique. Logs orient handoff. History is evidence.

Rule of thumb: if a cold agent does not need it to orient, route, constrain scope, apply reusable technique, verify done, or resume handoff, it does not belong in `.agents`.

## Map

Scratch is for planned executable work. Logs are for preserving orientation after real work happens. Git is for diffs.

```text
AGENTS.md
  boot file only

.agents/router.md
  dispatch table: task trigger -> resolver -> gate -> skill

.agents/AGENT-CONTROL-PLANE.md
  doctrine for where control-plane rules, gates, skills, logs, history, and lessons belong

.agents/resolvers/
  task-specific decision rules

.agents/gates/
  done-means-done checklists

.agents/skills/
  repo-local techniques loaded only when routed

.agents/skills/agents-kit/scripts/
  control-plane health checks only

.agents/logs/
  session notes and handoff context only

history/
  durable evidence: audits, decisions, reports

history/plans/
  completed plans

history/lessons/
  captured lesson artifacts; factory-failure owns the lifecycle
```

## Change Rule

Repair classification lives in `.agents/resolvers/factory-failure.md`.

Use this map only for placement after the classifier names the owner: router dispatches, resolvers scope, gates verify, skills teach technique, logs orient handoff, and history preserves evidence.

Do not add workflow detail to `AGENTS.md`.
Do not learn live rules from `.agents/logs/` or `history/`.

## Resolver Quality Loop

Resolvers and gates are live hypotheses. First drafts are not trusted.

Before treating a resolver/gate as solid:

1. Inspect the relevant code and docs.
2. Run the resolver against 2-3 real scenarios from this repo.
3. Add explicit non-goals.
4. Add one cold-agent test.
5. Criticize the resolver: what would make an agent do the wrong thing?
6. Patch the resolver/gate to block that failure.
7. Record the rinse in `.agents/logs/`.

Target quality is not "sounds right"; target quality is "a cold agent can follow it without inventing architecture."
