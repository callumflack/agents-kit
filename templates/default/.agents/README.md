# Agent Control Plane

Live agent operating files for this repository.

## Map

```text
AGENTS.md
  boot file only

.agents/router.md
  dispatch table: task trigger -> resolver -> gate -> skill

.agents/AGENT-CONTROL-PLANE.md
  meta doctrine for where router, resolver, gate, skill, log, and history rules belong

.agents/active-work.md
  current project context and next pointers

.agents/resolvers/
  task-specific decision rules

.agents/gates/
  done-means-done checklists

.agents/skills/
  techniques loaded only when routed

.agents/logs/
  session receipts only

.agents/legacy/
  old instruction snapshots, reference only

history/
  durable evidence: audits, plans, decisions, reports
```

## Change Rule

Patch the narrowest live file that would have prevented the miss:

```text
routing miss -> .agents/router.md
classification miss -> .agents/resolvers/
completion miss -> .agents/gates/
technique miss -> .agents/skills/
current-context miss -> .agents/active-work.md
receipt/log miss -> .agents/logs/README.md
historical artifact -> history/
```

Do not add workflow detail to `AGENTS.md`.
Do not learn live rules from `.agents/logs/` or `history/`.

## Resolver Quality Loop

Resolvers and gates are live hypotheses. First drafts are not trusted.

Before treating a resolver/gate as solid:

1. Inspect the relevant code and docs.
2. Run the resolver mentally against 2-3 real scenarios from this repo.
3. Add explicit non-goals.
4. Add one cold-agent test.
5. Criticize the resolver: what would make an agent do the wrong thing?
6. Patch the resolver/gate to block that failure.
7. Record the rinse in `.agents/logs/`.

Target quality is not "sounds right"; target quality is "a cold agent can follow it without inventing architecture."
