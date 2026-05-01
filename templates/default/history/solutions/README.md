# Solutions

Reusable learned patterns extracted from completed work.

`history/solutions/` is a quarry of lessons, not live law. Future agents should search it before repeating similar work, but behavior changes only when a lesson is promoted into `.agents/resolvers/*`, `.agents/gates/*`, or `.agents/skills/*`.

## Create A Solution When

Completed work revealed a pattern that should make the next similar task faster or safer.

Do not create a solution just because work finished.

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
- Not yet promoted to live rule.
```

## Promotion Rule

```text
helpful context only        -> keep in history/solutions/
future behavior must change -> patch resolver, gate, or skill
run-specific evidence only  -> keep in normal history/
```

