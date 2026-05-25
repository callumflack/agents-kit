# AGENTS

Boot file only. This repo ships a reusable `.agents` control-plane seed and also dogfoods a thin root `.agents` harness.

## Start

1. Read `.agents/router.md`.
2. Pick the narrowest matching root resolver.
3. For nontrivial work, state the owner surface, allowed writes, forbidden surfaces, done gate, and first check before editing.
4. Run the narrowest real check before calling work done.
5. Stage explicit paths only.

## Invariants

- `templates/default/**` is the shipped harness source of truth.
- Before editing `templates/default/**`, read `docs/agents-kit-maintainer.md`; shipped files must read as if the agent is inside an installed target repo.
- `templates/default/.agents/skills/agents-kit/SKILL.md` is shipped seed technique, not the root maintainer skill.
- Root `.agents/skills/` and root `skills-lock.json` are local installed skill mirrors; do not commit them.
- `README.md` is the practical installer entry point.
- `dot-agents-system.html` is the visual explainer.
- `bin/agents-kit.mjs` owns installer behavior; README follows actual behavior.
- Do not hard-wrap Markdown prose; let paragraphs run unless structure requires line breaks.
- For DOM or browser inspection of local HTML, use the globally installed `agent-browser`; do not use Playwright by default.
- Do not commit secrets, local credentials, `.env*`, caches, build output, or copied `node_modules`.

## Checks

- Run `npm run verify` when the shipped template, installer, verifier, README, or explainer changes.
- For local HTML changes, inspect with `agent-browser`.

## Repair Rule

If the user says `stop`, `no`, `not that`, repeats the same correction class, or done was claimed without the required check:

- stop editing immediately;
- restate the current request in one line;
- name the missed constraint;
- do not fix forward until the task is re-aligned;
- continue only inside the corrected scope.
