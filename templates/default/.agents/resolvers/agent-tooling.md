# Agent Tooling Resolver

Status: draft until rinsed after one more tooling change.

## Trigger

Use for `AGENTS.md`, `.agents/**`, `history/solutions/**`, `.claude/**`, `.pi/**`, OpenSpec, skills, skill locks, or host-specific agent setup.

## Required Reads

- `AGENTS.md`
- `.agents/README.md`
- `.agents/AGENT-CONTROL-PLANE.md` when changing `.agents/` structure, placement, or doctrine
- `.agents/router.md`
- `.agents/skills/dotagents-control-plane/SKILL.md` when changing `.agents` control-plane behavior
- relevant skill or host directory
- `history/solutions/README.md` when changing captured-learning behavior
- `skills-lock.json` when skill inventory changes

## Owned Surfaces

- agent bootloader;
- router/resolvers/gates/log rules;
- repo-local skills;
- `history/solutions/` captured-learning shape;
- host-specific mirrors such as `.claude/`.

## Allowed Writes

- `.agents/**`
- `history/solutions/**`;
- `.claude/**` when user wants Claude support;
- `skills-lock.json`;
- `.gitignore` for local-only agent directories.

## Non-Goals

- product code changes;
- global skill installation;
- treating `.pi/` as tracked unless user explicitly asks.
- turning `history/solutions/` into live law without promoting the behavior into a resolver, gate, or skill.

## Gate

`.agents/gates/agent-tooling.md`

## Cold-Agent Test

The agent can explain which skill surface is source, which host mirrors are tracked, which directories stay local, and why reusable learning belongs in `history/solutions/` rather than `.agents/`.

## Failure Signs

- Codex skills placed only in `.codex/skills`.
- `.pi/` gets committed accidentally.
- `AGENTS.md` grows into a handbook.
- reusable lessons are put in `.agents/` as live rules without a resolver/gate/skill promotion decision.
