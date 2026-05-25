# Resolvers

Resolvers decide task shape. They do not hold technique dumps.

## Required Shape

Each resolver should state:

- trigger;
- required reads;
- owned files/surfaces;
- allowed writes;
- non-goals;
- gate;
- cold-agent test;
- failure signs.

## Rinse Before Trust

If resolver confidence matters, record an explicit `Last Rinsed` note with the date, scenarios, and log link. Do not leave vague `Status: draft` labels behind as stale metadata.

Use `.agents/resolvers/rule-rinse.md` for that pass.
