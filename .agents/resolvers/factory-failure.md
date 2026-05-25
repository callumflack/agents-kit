# Factory Failure Resolver

## Trigger

Use when a repeated correction, missed check, wrong tool choice, scope drift, or accidental staging risk needs containment before more work happens.

## Required Reads

- `AGENTS.md`
- `.agents/router.md`
- the current user correction or failed check
- the files already touched in this turn
- `git status --short`

## Owned Surfaces

- failure classification
- missed-constraint naming
- owner-surface realignment
- decision to patch root `AGENTS.md`, root `.agents/*`, README, HTML, CLI, or shipped template

## Allowed Writes

- the smallest owner surface needed to prevent the repeat
- `.agents/gates/factory-failure.md` when the done contract itself was weak
- `.agents/router.md` when task routing was unclear
- `AGENTS.md` when the root invariant was missing
- `.gitignore` when accidental public surface drift was enabled
- `.agents/skills/README.md` when root skill policy was unclear

## Non-Goals

- broad cleanup
- committing local installed skills
- changing shipped template doctrine when the miss belongs only to root repo maintenance
- using a learning note as a substitute for patching the live owner surface

## Gate

`.agents/gates/factory-failure.md`

## Improvement Pressure

After a contained miss, ask whether the root harness needs one small patch:

- Did root `AGENTS.md` miss an invariant?
- Did `.agents/router.md` miss a failure route?
- Did this resolver or gate miss a check?
- Did `.gitignore` allow accidental public surface drift?
- Did README or HTML confuse the package story?

Patch only when the miss would plausibly repeat. Otherwise record no new process.

## Cold-Agent Test

Given "use Agent Browser, not Playwright", the agent stops, names wrong tool choice as the miss, and patches the root owner surface rather than adding a generic browser rule to the shipped template.

## Failure Signs

- the agent keeps editing after a repeated correction without restating scope
- the agent commits root `.agents/skills/` or root `skills-lock.json`
- the agent patches `templates/default/**` for a root-only maintainer rule
- the agent claims done without `npm run verify` or the relevant browser check
