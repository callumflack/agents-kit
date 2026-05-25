# Lessons

Reusable lesson artifacts extracted from completed work.

`history/lessons/` is the artifact shelf for captured lessons. It is not the learning lifecycle owner and it does not decide when a lesson exists, whether it is reusable, or where it is promoted.

`.agents/resolvers/factory-failure.md` owns the learning lifecycle: classification, reusable-vs-not, creation decision, promotion state, and live-owner selection.

`.agents/gates/factory-failure.md` owns lifecycle closeout: log link, lesson link, promotion decision, and required checks.

This file defines note shape only.

## Anti-Consolidation Rule

Do not continuously rewrite lesson artifacts into broader abstractions.

Preserve source logs and history notes as episodic evidence. A lesson artifact should point to the observed miss, trigger, owner surface, and promotion state. It should not replace the source episode with a polished general memory.

Prefer a new dated lesson artifact over rewriting an old one. Update an existing lesson only to correct wrong information, add source links, clarify promotion state, or name the live owner surface that changed.

Do not merge lesson artifacts into a grand unified doctrine note. Maintenance passes classify each artifact as keep, promote, archive, delete, or HITL; they do not consolidate lessons by default.

If future behavior must change, patch the narrow live owner surface: router, resolver, gate, skill, script, or check. If behavior does not need to change, keep the lesson context-only and preserve the episode trail.

## Shape

```md
# Lesson title

Date: YYYY-MM-DD

Source:
- history/<source>.md

## Problem

What kept recurring, broke, confused the agent, or caused wrong work?

## Lesson

What should a future agent know?

## Applies When

What task, surface, or context should trigger this lesson?

## Do

Concrete behavior.

## Do Not

Failure mode to avoid.

## Related Control Plane

- .agents/resolvers/<file>.md
- .agents/gates/<file>.md
- .agents/skills/<skill>/SKILL.md

## Promotion State

context-only | live-promotion | no-learning | HITL

Explain why this state is correct. If `live-promotion`, name the live owner surface that changed.
```

Promotion state is required metadata. The decision comes from `factory-failure`.
