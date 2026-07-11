---
name: agents-kit
description: "Use when editing or reviewing this repo's installed .agents control plane, bundled health scripts, or repo-local agent doctrine."
---

# Agents Kit

Maintain this repo's installed `.agents` control plane. Use the nearest live owner; do not duplicate its law here.

## Orient

1. Read `AGENTS.md`, `.agents/router.md`, and the routed resolver and gate.
2. Read `.agents/AGENT-CONTROL-PLANE.md` for placement or doctrine changes and `.agents/resolvers/agent-tooling.md` for control-plane, skill, or delegated-agent work.
3. Inspect the exact files you may change before editing.

## Before Editing

Inspect the working tree and both skill ownership records:

```bash
git status --short
sed -n '1,240p' .agents/skills/manifest.json
sed -n '1,240p' skills-lock.json
```

Keep unrelated dirty files untouched. State the canonical receipt:

```text
Owner surface:
Allowed writes:
Forbidden surfaces:
Done gate:
First real check:
```

## Skill Ownership

- Seed-owned skills are declared with `"ownership": "seed"` in `.agents/skills/manifest.json`; preserve their generic target-repo contract.
- Repo-owned skills are declared with `"ownership": "repo"`; edit them only for reusable repo technique.
- Imported skills are recorded in `skills-lock.json`; treat their directories as mirrors and refresh them through their owning source.
- Manifest declarations and lock entries must be disjoint and must account for every materialized skill directory.
- Before changing any skill, inspect its directory and any named source instructions as well as both ownership records.

Put target-local operating law in the routed owner. Do not hide routing or done rules inside a skill. Do not use bundled health scripts for product work or repo checks.

## Verify

Run edited skill frontmatter and installed control-plane health checks:

```bash
python3 .agents/skills/agents-kit/scripts/check-skill-frontmatter.py "$PWD/.agents/skills/<name>/SKILL.md"
python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py
```

Run the routed gate's narrower product, docs, or repository oracle when the task requires one. If a check cannot run, report why and keep the residual risk visible.

Do not reintroduce current-focus or build-loop state under `.agents`, old learning or solution directories in place of `history/lessons/`, product runners or workflow state under bundled health scripts, or duplicated control-plane doctrine in this skill.
