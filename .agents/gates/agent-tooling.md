# Agent Tooling Gate

Done means:

- the root router selected `agent-tooling` for root harness work;
- nontrivial edits were preceded by an ownership receipt naming request, resolver, why this resolver, source of truth or evidence order, owner surface, allowed writes, forbidden surfaces, done gate, first oracle, next oracle, and skill used last when material;
- root maintainer behavior stayed in root `AGENTS.md` or root `.agents/**`;
- shipped seed behavior stayed under `templates/default/**`;
- root `.agents/skills/*` installed mirrors and root `skills-lock.json` were not staged;
- `AGENTS.md` stayed short and bootloader-shaped;
- `.agents` contains no current-focus or build-loop runtime state;
- `npm run verify` passes when package-facing files, shipped seed files, installer, verifier, README, or explainer changed;
- `agent-browser` is used for local HTML/browser inspection when relevant;
- `git status --short` shows no unrelated dirty or staged files.
