# Rule Rinse Resolver

Status: stable process, draft targets.

## Trigger

Use when creating, reviewing, or improving `.agents/router.md`, `.agents/resolvers/*`, `.agents/gates/*`, or agent skill routing.

## Required Reads

- The rule being rinsed.
- The matching gate.
- `.agents/AGENT-CONTROL-PLANE.md` when the pass changes control-plane shape, placement, or doctrine.
- Relevant source files and docs for the scenario.
- At least one real prior artifact when available: `history/`, git diff, audit note, or current failing behavior.

## Owned Surfaces

- `.agents/router.md`
- `.agents/resolvers/*`
- `.agents/gates/*`
- `.agents/skills/*` when the issue is technique or skill routing
- `.agents/AGENT-CONTROL-PLANE.md` when the issue is placement or doctrine
- `.agents/logs/*` receipts for the rinse

## Method

1. State the scenario in one sentence.
2. Pretend to be a cold agent using only `AGENTS.md`, router, resolver, and gate.
3. Identify the first ambiguity, overreach, or missing boundary.
4. Inspect code/docs that would settle it.
5. Patch the narrowest rule file.
6. Add or tighten a cold-agent test.
7. Record the pass in `.agents/logs/`.

If the user asked for critique only, propose the patch instead of applying it.

## Allowed Writes

- The narrowest router, resolver, gate, skill, or control-plane doctrine file needed to prevent the miss.
- `.agents/logs/YYMMDD-*.md` receipt for the pass.

## Non-Goals

- Do not implement product code during a rule-rinse pass unless the user explicitly switches to implementation.
- Do not broaden `AGENTS.md` to compensate for a weak resolver.
- Do not promote dated `history/` files into live rules.

## Gate

`.agents/gates/rule-rinse.md`

## Cold-Agent Test

Given a concrete task, a cold agent can identify the resolver, name allowed writes, name non-goals, and choose the verification gate without asking for extra doctrine.

## Failure Signs

- The rule sounds plausible but names no owned files.
- The rule has no non-goals.
- The gate says "verify" but gives no concrete checks.
- The resolver would cause broad refactors for a narrow request.
