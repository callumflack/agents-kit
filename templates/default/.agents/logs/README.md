# Agent Logs

Use `.agents/logs/` for session receipts only.

## When To Write

Write or update a log when:

- a work session ends;
- a plan or audit is created;
- a resolver, gate, skill, or router changes;
- a durable artifact or active-work pointer changes;
- current work state changes.

## Shape

Each log should include:

- date;
- branch;
- changed files;
- checks run;
- decisions made;
- next pointer.

## Boundaries

Do not:

- put live rules in logs;
- read logs before router/resolvers unless reconstructing prior work;
- treat logs as source of truth over `.agents/active-work.md`, resolvers, gates, skills, or docs.
