# Resolvers

Resolvers decide task shape. They do not hold technique dumps.

## Required Shape

Each resolver should state:

- status: draft, rinsed, or stable;
- trigger;
- required reads;
- owned files/surfaces;
- allowed writes;
- non-goals;
- gate;
- cold-agent test;
- failure signs.

## Rinse Before Trust

A resolver is draft until it has been criticized against real code and at least 2-3 real scenarios.

Use `.agents/resolvers/rule-rinse.md` for that pass.
