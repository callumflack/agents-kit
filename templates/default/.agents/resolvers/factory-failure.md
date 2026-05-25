# Factory Failure Resolver

## Trigger

Use when a failure or drift signal needs classification before deciding what to patch.

Examples:

- a check fails and the owner is unclear;
- an agent repeats a miss or user correction;
- `.scratch` or task state appears stale;
- a learning should maybe become live behavior;
- a maintenance-rinse pass finds stale, duplicated, or orphaned control-plane artifacts;
- a review finding may be a doctrine gap rather than a local code fix;
- a user correction may be normal iteration or an agent-process failure, and the agent must decide which before creating doctrine.

## Required Reads

- `AGENTS.md`
- `.agents/router.md`
- the failing command output, review finding, user correction, stale artifact, or learning being classified
- the currently selected resolver and gate if one already applied
- the relevant `.scratch/*` packet when local task state drift is involved
- `history/lessons/README.md` and the relevant lesson note for learning questions

## Owned Surfaces

- failure classification;
- owner-surface selection;
- repair decision;
- learning decision;
- HITL/blocker decision when the harness cannot safely repair the issue.

## Classification Table

Use this table before choosing an actuator.

| Observation | Class | Next move |
| --- | --- | --- |
| test fails because behavior is wrong | product regression | patch code and test |
| test fails because expectation is stale | stale spec | patch the spec, plan, or test with evidence |
| agent keeps choosing the wrong task type | routing failure | patch router or resolver |
| agent finishes without proof | weak gate | patch gate |
| user repeats the same correction | alignment failure | stop, restate, then repair live owner |
| task loop has no eligible work | handoff-blocked | report exact HITL/blocker |
| two planning artifacts disagree | artifact drift | decide owner, update non-owner pointer |
| external contract is missing | external blocker | mark HITL/blocked; do not invent integration |
| check catches recurring boundary drift | mechanical invariant working | keep check; improve message if needed |
| same failure appears twice | harness gap | promote lesson into live owner |
| user dislikes, tightens, or redirects a product detail during expected iteration | normal iteration | continue in selected product resolver; do not create a learning by default |
| agent bypasses a required resolver, gate, read, tool, owner surface, or previously corrected behavior | agent-process failure | stop, write/update log, write learning, decide live promotion |

## Learning Line

Normal iteration:

- user changes taste, copy, layout, density, color, interaction feel, or product preference;
- QA finds a local product bug while the agent is already using the right route and gate;
- implementation changes because the target got sharper.

Normal iteration does not require a learning unless the same agent behavior keeps recurring.

Agent-process failure:

- required resolver, gate, skill, read, command, or tool was skipped;
- the agent substituted a generic tool for a repo-named tool;
- the wrong owner surface was patched;
- done was claimed without required proof;
- the same correction class repeated;
- system ambiguity made a wrong agent behavior plausible.

Agent-process failure requires a learning. The log records what happened; the learning states what future agents must do differently. If the miss must be mechanically prevented, also patch the narrow live owner surface.

## Repair Loop

Run this loop when classification selects a live owner surface.

```text
observed failure
  -> name failure
  -> classify failure
  -> name owner surface
  -> read owner resolver/gate or doctrine
  -> patch smallest owner surface
  -> run owner gate
  -> run factory-failure gate
  -> record outcome
```

Owner examples:

| Class | Owner surface | Required proof |
| --- | --- | --- |
| product regression | selected product resolver, app code, and tests | selected product gate plus factory-failure gate |
| stale spec | owning spec, plan, or test | evidence for the stale expectation plus selected owner gate and factory-failure gate |
| external blocker | `.scratch/*`, blocker note, or relevant task state | exact HITL/blocker recorded when tracker state changes |
| routing failure | `.agents/router.md` | agent-tooling or rule-rinse gate plus factory-failure gate |
| scope/classification failure | `.agents/resolvers/*` | rule-rinse gate plus factory-failure gate |
| weak gate | `.agents/gates/*` | rule-rinse gate plus factory-failure gate |
| technique gap | `.agents/skills/*` | agent-tooling gate plus factory-failure gate |
| missing mechanical invariant | tests, scripts, or checks owned by the repo | relevant owner gate plus factory-failure gate |

## Learning Loop

Run this loop when completed work, a failure, a correction, or a review finding reveals a reusable pattern.

`factory-failure` owns this lifecycle. `history/lessons/` stores the resulting lesson artifact only.

```text
observed pattern
  -> classify normal iteration vs agent-process failure
  -> decide whether it is reusable
  -> decide promotion state
  -> write or update a lesson artifact when useful, and always for agent-process failure
  -> patch live owner when behavior must change
  -> run relevant gate
  -> leave no ambiguous promotion state
```

Promotion states:

| State | Meaning | Required action |
| --- | --- | --- |
| no-learning | Run-specific evidence only | keep in normal history/logs; do not create `history/lessons/*` |
| context-only | Useful future context, but no mandatory behavior change | write or update `history/lessons/*` with the reason it is context-only |
| live-promotion | Future behavior must change | patch router, resolver, gate, skill, or mechanical check; update the lesson note if one exists |
| HITL | Promotion owner or desired behavior is unclear | record the blocker and do not silently create law |

A learning loop is incomplete if a note says only "not yet promoted" without explaining whether it is context-only, live-promotion, or HITL.

## Allowed Writes

- the narrow owner surface selected by the classifier:
  - app code or tests for product regressions;
  - `.agents/router.md` for routing failures;
  - `.agents/resolvers/*` for scope/classification failures;
  - `.agents/gates/*` for weak done checks;
  - `.agents/skills/*` for repeatable technique gaps;
  - repo-owned scripts, tests, or checks for missing mechanical invariants;
  - `.scratch/*` for task-state drift;
  - `history/lessons/*` for reusable context that is not yet live behavior;
  - `.agents/logs/*` for handoff context changes.

## Non-Goals

- fixing product code before classifying the failure;
- creating a learning as a substitute for a live rule when future behavior must change;
- turning every failure into doctrine;
- building a generic orchestrator;
- broad maintenance cleanup beyond the classified failure.

## Gate

`.agents/gates/factory-failure.md`

## Cold-Agent Test

Given "the same correction happened twice", the agent classifies this as a harness gap, stops fix-forward, chooses the narrow live owner surface, and patches that surface before claiming done.

Given "the user dislikes the spacing on a card", the agent classifies this as normal iteration and keeps working in the selected product resolver without writing a learning.

Given "the agent used the wrong browser tool after the gate named a repo-specific browser tool", the agent classifies this as agent-process failure, writes/updates the orientation log, writes a learning, then decides whether the live owner is the gate, resolver, skill, or docs surface.

## Failure Signs

- the agent writes a `history/lessons/*` note but leaves the next agent able to repeat the miss;
- the agent edits product code while the actual miss was router, resolver, gate, or task-state drift;
- the agent expands `AGENTS.md` instead of patching the owner surface;
- a failed check is rerun repeatedly without classification;
- maintenance-rinse work deletes or archives artifacts without an explicit keep/promote/archive/delete/HITL decision.
