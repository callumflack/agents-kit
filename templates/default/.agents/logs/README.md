# Agent Logs

Use `.agents/logs/` for session orientation notes.

Logs preserve what the agent was trying to do, what decisions were made, what checks mattered, and where the next agent should resume. They are not commit ledgers, changelogs, or proof of what shipped. Git remains the source of truth for commits, diffs, and exact file history.

Logs are not a changelog. They answer “what conversation-state would the next agent otherwise have to reconstruct badly from git diff plus chat?”.

Principle: Git proves the commit. The log orients the next agent.

Pre-edit ownership receipts are not logs. The receipt happens before edits to prevent wrong-owner work; the log happens after durable work to orient handoff. A log may include receipt fields only when they help future resumption.

## When To Write

Write or update a log when:

- a work session ends;
- the Repair Rule in `AGENTS.md` is triggered;
- a plan or audit is created;
- a resolver, gate, skill, or router changes;
- log doctrine changes;
- a durable artifact changes;
- informal chat or critique turns into code changes on a durable product surface.

## Informal Product Work

Informal product work does not require a `.scratch` packet.

If there is no active build-loop plan, do not block startup or force a PRD. Let the conversation move.

When ad hoc UI/product discussion changes durable product code, write or update a compact orientation log if a future agent would otherwise have to reconstruct the user's target, product boundary, visual reference, or continuation path from git diff plus chat.

A useful ad hoc product log names:

- what surface was being polished or investigated;
- what product boundary was being preserved;
- which resolver and gate applied;
- what was intentionally not being started;
- what the next likely continuation is.

Do not require a central focus file. If the user is jumping across small UI surfaces, log the durable code paths that actually changed. Prefer updating one current ad hoc session note when the work belongs to the same conversation arc. Create a new note when the surface, decision path, or future continuation changes enough that one note would blur the handoff.

Use `.scratch` only when there is an actual plan, issue loop, or executable task packet. Do not create scratch state just to make informal UI polish look planned.

### Compact Shape

For ad hoc durable product work, the note can be short:

- intent / visual target;
- touched surface;
- boundary preserved;
- checks or browser probes;
- next pointer.

## Create Vs Update

Early in a new repo or fuzzy slice, extra session notes are acceptable discovery. At closeout, make the current resume path obvious: update the active slice note, extract reusable lessons, or leave a clear next pointer.

Update the current session note when:

- fixing review findings in the same slice;
- running extra checks;
- making small cleanup inside the same slice;
- applying reviewer or skill feedback without changing scope.

Create a new session note when:

- starting a new product slice;
- changing router, resolver, gate, skill, or log doctrine;
- changing handoff context;
- making a new decision path that future agents need to see.

Do not write a log note for:

- typo-only fixes;
- pure formatting after checks;
- transient investigation with no durable change.

Default log target: the current active slice note. Create a new note only when the handoff path would be clearer than updating the existing one.

## Closeout

Logs record incident and handoff context. They do not decide whether a learning is required or where it is promoted.

If `.agents/resolvers/factory-failure.md` requires a lesson artifact, link the `history/lessons/*` note from the current session log.

After the Repair Rule is triggered, the current session log records:

- the miss;
- the classification from `.agents/resolvers/factory-failure.md`;
- whether editing was halted for alignment loss;
- the containment action;
- the live surface patched, or why no live surface changed.

## Shape

Each log should include:

- session intent;
- branch/worktree;
- touched surfaces;
- checks/probes run;
- decisions made;
- unresolved questions;
- next pointer.

## Boundaries

Do not:

- put live rules in logs;
- read logs before router/resolvers unless reconstructing prior work;
- treat logs as source of truth over resolvers, gates, skills, or docs.
