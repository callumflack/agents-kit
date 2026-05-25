# AGENTS

Boot file only. Points to the live `.agents` control plane; do not put workflow detail here.

## Start

1. Read `.agents/router.md`.
2. Pick the narrowest matching resolver.
3. Run the required gate before calling the task done.
4. If handoff context changes, update the relevant session note in `.agents/logs/`.
5. Keep the selected resolver, gate, logs, and Repair Rule live through the session.

## Invariants

- Stage explicit paths only.
- Do not commit secrets, local credentials, `.env*`, caches, build output, or copied `node_modules`.
- `.agents/` is the control plane: router, resolvers, gates, logs, skills.
- Repo-specific product, runtime, docs, and tracker rules belong in resolvers, gates, docs, or skills, not in this boot file.

## Repair Rule

Trigger this rule immediately when a user correction repeats, scope drifts after correction, or done was claimed without the required gate. Stop normal execution and contain the miss:

If the user says `stop`, `no`, `not that`, or repeats the same correction class:

- stop editing immediately;
- restate the current request in one line;
- do not fix forward until the task is re-aligned;
- then route repair through `.agents/resolvers/factory-failure.md`.

`AGENTS.md` points. Resolvers decide shape. Gates decide done. Skills hold technique. Logs orient the next session.
