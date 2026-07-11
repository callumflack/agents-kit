# Agent Tooling Resolver

## Trigger

Use for `AGENTS.md`, `.agents/**`, `.scratch/**`, docs or tracker setup, skills, skill locks, lesson artifacts, host-specific agent setup, initial repo setup, package-script plumbing, or resolver/gate/router quality passes.

## Required Reads

- `AGENTS.md`
- `.agents/README.md`
- `.agents/AGENT-CONTROL-PLANE.md` when changing `.agents/` structure, placement, or doctrine
- `.agents/router.md`
- `.agents/skills/agents-kit/SKILL.md` when changing `.agents` control-plane behavior
- relevant skill, docs, tracker, scratch, or host directory
- relevant `.agents/commands/*` or `.agents/checks/*` file when changing commands or checks
- `history/lessons/README.md` when changing lesson-artifact shape
- `skills-lock.json` when skill inventory changes

## Pre-Edit Ownership Receipt

Before nontrivial edits in this lane, state the pre-edit ownership receipt:

```text
Owner surface:
Allowed writes:
Forbidden surfaces:
Done gate:
First real check:
```

Name evidence order only when sources can disagree. Name a next oracle only when the first check is deliberately narrower than the final done claim.

The receipt does not replace `.agents/logs/`. If durable control-plane or log doctrine changed, write or update the session log at closeout.

## Skill Inventory Boundary

Before creating, installing, editing, or routing to a repo skill, identify the source of truth:

1. inspect `skills-lock.json`;
2. inspect the existing `.agents/skills/<name>/` directory if it exists;
3. inspect the user-provided install command or upstream skill docs when the user names one;
4. only then patch router, resolver, gate, skill, or learning surfaces.

If the skill is third-party or the user provides an install command, use that installer and let it update `.agents/skills/*` and `skills-lock.json`. Do not hand-author a mirror.

Hand-author `.agents/skills/<name>/` only when the task is explicitly to create a new local-only repo skill. Record that local-only decision in the session log.

When hand-authoring or editing a local-only repo skill, run:

```bash
python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py .agents/skills/<name>/SKILL.md
```

## Skill Edit Boundary

If a repo-local skill is listed in `skills-lock.json`, treat it as an installed mirror. Do not edit that skill or files under its skill directory for local behavior repair unless the user explicitly asks to change that installed skill. Put local operating rules in the narrow live resolver, gate, log doctrine, history learning, or product docs instead.

## Delegated Subagent Work

When the user asks this agent to run a subagent, treat delegation as agent tooling, not a new skill requirement.

- Spawn each requested worker once and report the agent id.
- Keep parent and worker write sets disjoint; do not duplicate the worker's assigned work in the parent.
- Do not block the parent on a long synchronous wait unless integration depends on the result; poll briefly, then resume when the worker reports back.
- When the worker returns, inspect its diff or findings, verify the claimed owner surfaces, and close the worker.
- If the same spawn, wait, or duplicated-work miss repeats and a tool-call transcript oracle exists, promote the narrow invariant to `.agents/checks/*`; otherwise route the repair through `.agents/resolvers/factory-failure.md`.

This does not apply to user-owned external threads; those follow the host thread tooling.

## Owned Surfaces

- agent bootloader;
- router/resolvers/gates/commands/checks/log rules;
- `agents-kit` harness check scripts;
- local docs, tracker, and scratch packets;
- repo-local skills;
- `history/lessons/` lesson-artifact shape;
- host-specific agent mirrors.

## Allowed Writes

- `.agents/**`
- `.scratch/**`
- docs or tracker files when the user asks for agent-facing setup;
- `history/lessons/**`;
- host-specific agent mirrors when intended;
- `skills-lock.json`;
- `.gitignore` for local-only agent directories.

## Non-Goals

- product code changes;
- global skill installation;
- turning `history/lessons/` into live law or a lifecycle owner;
- creating `.scratch` only to represent chat-stated focus;
- putting current-focus or build-loop runtime state into `.agents`;
- using `.agents/skills/agents-kit/scripts/*` for objective repo checks that belong in `.agents/checks/*`;
- using `.agents/skills/agents-kit/scripts/*` for product builds, app workflows, migration runners, active project status, or dashboard sync.

## Gate

`.agents/gates/agent-tooling.md`

## Cold-Agent Test

The agent can explain which skill surface is source, which host mirrors are tracked, which directories stay local, why lesson artifacts belong in `history/lessons/`, and why `.agents/resolvers/factory-failure.md` remains the learning lifecycle owner.

If the user states a focus in chat, follow that focus through the router. `.agents` does not decide what the user wants next.

If adding or changing an `agents-kit` script, the agent can name the exact control-plane invariant it checks and why that check is objective enough to automate.

If adding or changing an `.agents/checks/*` file, the agent can name the exact invariant it proves and why the repo can observe it objectively.

If rinsing router/resolver/gate quality, the agent uses this resolver plus `.agents/AGENT-CONTROL-PLANE.md`, patches the narrow owner surface, runs agents-kit health, and does not route through a separate rule-rinse lane.

Given "run a subagent to review tests", the parent spawns one worker, reports its id, keeps parent edits separate, verifies the returned findings, and closes the worker. It does not do the same review in parallel unless the user asked for redundant reviews.

## Failure Signs

- third-party skills are hand-authored under `.agents/skills/*` instead of installed through the repo skill manager;
- installed skill mirrors listed in `skills-lock.json` are patched for local doctrine instead of the owning resolver, gate, docs, or learning surface;
- `AGENTS.md` grows into a handbook;
- reusable lessons are put in `.agents/` as live rules without a resolver/gate/skill promotion decision;
- chat-stated focus is forced into `.scratch` even though no plan or issue loop exists;
- current-focus or build-loop runtime state is added back into `.agents`;
- an `agents-kit` script checks product state or runs product work instead of checking the control plane.
- resolver, gate, or router quality work is routed through a separate rule-rinse lane instead of this resolver.
- delegated subagent work is spawned twice, duplicated in the parent, or treated as done without inspecting the worker result.
