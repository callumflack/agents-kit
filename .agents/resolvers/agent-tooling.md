# Agent Tooling Resolver

## Trigger

Use for this repo's root agent harness: `AGENTS.md`, root `.agents/**`, root skill policy, `.gitignore` agent surfaces, local-only skill mirrors, or maintainer docs about agent workflow.

## Required Reads

- `AGENTS.md`
- `.agents/router.md`
- the root resolver and gate for the current task
- `.gitignore` when changing agent-local tracked/ignored surfaces
- `git status --short`
- every file being changed

Read `templates/default/**` only when the task is about the shipped seed. Do not treat shipped template files as the owner for root repo maintainer behavior.

## Pre-Edit Ownership Receipt

Before nontrivial edits in this lane, state:

```text
Request:
Resolver:
Why this resolver:
Source of truth / evidence order:
Owner surface:
Allowed writes:
Forbidden surfaces:
Done gate:
First oracle:
Next oracle:
Skill used (last, if material):
```

## Owned Surfaces

- root `AGENTS.md`
- root `.agents/router.md`
- root `.agents/resolvers/*`
- root `.agents/gates/*`
- root `.agents/skills/README.md`
- `.gitignore` rules for local agent tooling

## Allowed Writes

- the owned surfaces above
- docs that explicitly describe this repo's maintainer agent workflow

## Non-Goals

- changing the shipped seed under `templates/default/**` for a root-only rule
- committing root `.agents/skills/*` installed mirrors
- committing root `skills-lock.json`
- using root `.agents` as product/runtime state
- adding process when a one-line root invariant or gate check would prevent the miss

## Gate

`.agents/gates/agent-tooling.md`

## Cold-Agent Test

The agent can explain whether a rule belongs to root repo maintenance or the shipped seed, name the owner surface before editing, and keep local installed skills out of the public repo.

## Failure Signs

- `templates/default/**` is patched for behavior that only belongs to this repo's maintainer harness
- root installed skills are staged
- `AGENTS.md` grows into a handbook
- root `.agents` gains current-focus or build-loop runtime state
- done is claimed without `npm run verify` when package-facing files or shipped seed files changed
