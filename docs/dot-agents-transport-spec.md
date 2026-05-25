# Dot Agents Transport Spec

Date: 2026-05-25

## Source Rule

`unity-surfaces` is the source of truth for the harness shape.

The existing `agents-kit` repo is useful only for the package and installer
shell. Do not merge doctrine from its old template unless it is still present
in, or directly implied by, the live `unity-surfaces` `.agents` system.

No blog post is part of this transport. The post comes after the installable
harness exists.

## Current `agents-kit` Repo Shape

The old repo already answers the installer question.

```text
README.md
package.json
bin/agents-kit.mjs
scripts/verify-template.mjs
templates/default/
  AGENTS.md
  .agents/
    README.md
    AGENT-CONTROL-PLANE.md
    active-work.md
    router.md
    resolvers/
      README.md
      agent-tooling.md
      rule-rinse.md
    gates/
      README.md
      agent-tooling.md
      rule-rinse.md
    skills/
      agents-kit/
        SKILL.md
        scripts/check-agents-kit-health.py
    logs/
      README.md
  history/solutions/README.md
history/260501-plan-update-migration-planner.md
```

The CLI has the right primitive shape:

- `init`: copy the template into a repo that does not already have `.agents`.
- `adopt`: copy only missing template files into an existing repo.
- `update`: roll forward from the template, keep review-only local doctrine
  untouched by default, and require a clean worktree before writes.
- `--dry-run`: preview without writes.
- `--overwrite`: update non-doctrine seed files during `update`.
- review-only files: `AGENTS.md`, `.agents/active-work.md`,
  `.agents/router.md`, `.agents/resolvers/*`, `.agents/gates/*`.

Answer: yes, the old repo can enable simple installation of dot agents. The
installer mechanism is usable. The shipped template is not. The template must
be replaced from the live `unity-surfaces` harness before this repo represents
the survived system.

## Live Harness Shape To Transport

The reusable harness is this structure, abstracted from `unity-surfaces`:

```text
AGENTS.md
  boot pointer and hard invariants only

.agents/router.md
  dispatch table: trigger -> resolver -> gate -> skill

.agents/README.md
  compact map of control-plane surfaces

.agents/AGENT-CONTROL-PLANE.md
  doctrine for artifact roles, placement, promotion, receipts, scripts,
  settlement, pressure checks, and lessons

.agents/resolvers/
  task-shape and owner-surface rules

.agents/gates/
  done-means-done checks

.agents/skills/
  repo-local techniques and bundled helper scripts

.agents/skills/agents-kit/
  safe surgery procedure and health scripts for the control plane itself

.agents/logs/
  session orientation notes only

history/
  dated evidence

history/plans/
  completed plans

history/lessons/
  captured lesson artifacts; lifecycle owned by factory-failure resolver

.scratch/
  optional active execution packets; not part of `.agents`
```

The important structure is the authority split:

| Surface | Role |
| --- | --- |
| `AGENTS.md` | boot invariants, not a handbook |
| `.agents/router.md` | routing law |
| `.agents/resolvers/*` | owner and scope law |
| `.agents/gates/*` | done law |
| `.agents/skills/*` | technique |
| `.agents/logs/*` | handoff orientation, never live law |
| `.scratch/*` | active execution state, not doctrine |
| `history/*` | dated evidence, not current law |
| `history/plans/*` | completed plans |
| `history/lessons/*` | lesson artifacts, not lifecycle owner |

## Default Template Required

Replace `templates/default` with this installable seed:

```text
templates/default/
  AGENTS.md
  skills-lock.json
  .agents/
    README.md
    AGENT-CONTROL-PLANE.md
    router.md
    resolvers/
      README.md
      agent-tooling.md
      factory-failure.md
      rule-rinse.md
    gates/
      README.md
      agent-tooling.md
      factory-failure.md
      rule-rinse.md
    skills/
      README.md
      agents-kit/
        SKILL.md
        scripts/
          check-agents-kit-health.py
          check-skill-frontmatter.py
    logs/
      README.md
  history/
    README.md
    plans/
      README.md
    lessons/
      README.md
  .scratch/
    README.md
```

Do not install `active-work.md`. In the live system, current-focus/build-loop
runtime state was retired from `.agents`; the health check should keep it out.

Do not install product-specific Unity resolvers by default:

- `repo-bootstrap.md`
- `runtime-boundary.md`
- `shared-package.md`
- `web-surface.md`

Those can become examples or fixtures later. They are not the generic harness.

## Content To Port From `unity-surfaces`

Port these live concepts directly:

- `AGENTS.md` as boot file only:
  - read router;
  - pick narrowest resolver;
  - run gate before done;
  - update logs when handoff changes;
  - keep repair rule live.
- `.agents/README.md`:
  - "AGENTS points, router dispatches, resolvers scope, gates verify, skills
    teach, logs orient, history is evidence";
  - map of each surface;
  - no learning live rules from logs or history;
  - resolver quality loop.
- `.agents/AGENT-CONTROL-PLANE.md`:
  - rule of thumb;
  - authority map;
  - operating rule;
  - pre-edit ownership receipt;
  - placement test;
  - promotion timing;
  - resolver/gate/skill distinction;
  - scripts boundary;
  - artifact ownership;
  - settlement check;
  - doctrine pressure check;
  - lessons lifecycle boundary.
- `.agents/router.md`:
  - generic rows only: agent-tooling, factory-failure, rule-rinse;
  - clear priority rules;
  - no Unity product rows.
- `.agents/resolvers/agent-tooling.md`:
  - control-plane, scratch, docs, skills, host setup trigger;
  - pre-edit ownership receipt;
  - skill inventory boundary;
  - installed skill mirror boundary;
  - local-only skill authoring rule;
  - allowed writes and non-goals;
  - no product code by default.
- `.agents/gates/agent-tooling.md`:
  - receipt required for nontrivial lane edits;
  - health check required for router/resolver/gate/skill/lesson structure;
  - lessons stay in `history/lessons`;
  - skill provenance checked before inventory edits;
  - `AGENTS.md` stays short;
  - `.agents` contains no current-focus/build-loop runtime state;
  - local-only files are not accidentally staged.
- `.agents/resolvers/factory-failure.md`:
  - classify failures before repair;
  - distinguish normal product iteration from agent-process failure;
  - choose owner surface before patching;
  - learning lifecycle belongs here, not in `history/lessons`;
  - promote only when future behavior must change.
- `.agents/gates/factory-failure.md`:
  - observed failure named;
  - class recorded;
  - user correction classified;
  - owner surface named before edits;
  - selected owner gate run;
  - exactly one outcome recorded;
  - skipped checks report blocker and residual risk.
- `.agents/resolvers/rule-rinse.md` and `.agents/gates/rule-rinse.md`:
  - rules are live hypotheses;
  - test against real scenarios;
  - add non-goals and cold-agent tests;
  - record rinse in logs.
- `.agents/logs/README.md`:
  - logs orient resumption;
  - logs are not changelogs, commit proof, or live law;
  - receipts happen before edits; logs happen after durable work;
  - write/update logs when durable context changes;
  - do not force `.scratch` for ad hoc product work.
- `.agents/skills/agents-kit/SKILL.md`:
  - required reads before control-plane edits;
  - placement table;
  - narrowest live surface rule;
  - health check command;
  - do-not list.
- `check-agents-kit-health.py`:
  - verify router references;
  - verify resolver required sections and gate paths;
  - verify gates state done criteria;
  - verify skill frontmatter;
  - verify locked skill paths when `skills-lock.json` exists;
  - verify `AGENTS.md` remains short;
  - verify `history/lessons/README.md`;
  - fail if retired runtime state returns to `.agents`;
  - verify lesson promotion states.
- `check-skill-frontmatter.py`:
  - targeted guard for hand-authored or edited local-only skills.

## Generic Router Seed

The default router should be small:

```markdown
# Agent Router

Use this first. Pick the narrowest matching row.

| Trigger | Resolver | Gate | Skill |
| --- | --- | --- | --- |
| failed checks, repeated misses, stale task state, learning-promotion questions, repair-loop decisions, maintenance-rinse findings | `.agents/resolvers/factory-failure.md` | `.agents/gates/factory-failure.md` | `.agents/skills/agents-kit` when patching `.agents` or learning surfaces; otherwise route by classified owner |
| agent tooling, docs placement, `.agents` control-plane, `.scratch`, PRDs, skills, host-specific agent setup, lesson artifacts | `.agents/resolvers/agent-tooling.md` | `.agents/gates/agent-tooling.md` | `.agents/skills/agents-kit` for `.agents` changes; otherwise matching `.agents/skills/*` |
| resolver/gate/router quality pass | `.agents/resolvers/rule-rinse.md` | `.agents/gates/rule-rinse.md` | none by default |

## Priority Rules

- Agent tooling work stays in the control-plane lane unless the user explicitly switches into product implementation.
- Factory failure classifies a miss before repair; it does not replace the selected owner resolver or gate.
- Repo-specific product rows should be added only after live repo evidence exists.
```

## Installer Behavior Required

Keep the old CLI model, but update the protected/review-only list for the new
template.

`init`:

- copies the full default seed;
- refuses overwrite unless `--force`;
- supports `--dry-run`.

`adopt`:

- never overwrites;
- creates missing seed files;
- prints compact review diffs for conflicting local files.

`update`:

- requires clean target worktree unless `--force`;
- creates missing seed files;
- keeps local doctrine by default;
- supports `--overwrite` only for non-doctrine files;
- prints compact review diffs for local doctrine.

Review-only / local-doctrine files:

- `AGENTS.md`
- `.agents/router.md`
- `.agents/resolvers/*`
- `.agents/gates/*`
- `.agents/logs/*`
- `history/*`
- `.scratch/*`

Overwrite-eligible seed files:

- `.agents/README.md`
- `.agents/AGENT-CONTROL-PLANE.md`
- `.agents/skills/agents-kit/**`
- `.agents/logs/README.md`
- directory README files
- verification scripts

If this is too broad during implementation, bias toward review-only. Losing
local doctrine is worse than requiring a manual merge.

## Verification Required

`agents-kit` source repo check:

```bash
npm run verify
```

`verify-template.mjs` must assert the new required files, not the old
`active-work.md` / `history/solutions` shape.

The template health check must pass inside `templates/default`.

Smoke tests:

```bash
tmpdir=$(mktemp -d)
git -C "$tmpdir" init
node /Users/cflack/Repos/callumflack/agents-kit/bin/agents-kit.mjs init --target "$tmpdir"
python3 "$tmpdir/.agents/skills/agents-kit/scripts/check-agents-kit-health.py"

node /Users/cflack/Repos/callumflack/agents-kit/bin/agents-kit.mjs adopt --target "$tmpdir" --dry-run
node /Users/cflack/Repos/callumflack/agents-kit/bin/agents-kit.mjs update --target "$tmpdir" --dry-run
```

Regression checks:

- `init --dry-run` writes nothing.
- `adopt` does not overwrite local router/resolver/gate/log/history/scratch files.
- dirty `update` refuses unless `--force`.
- update diff output is compact enough to review.
- health check fails if `.agents/active-work.md` or `.agents/current-work.md`
  appears.
- health check fails if a resolver has no non-goals or cold-agent test.
- health check fails if a gate has no concrete done criteria.

## Migration Steps

1. Replace old template content from `unity-surfaces` live harness, not from the
   old `agents-kit` doctrine.
2. Remove `templates/default/.agents/active-work.md`.
3. Replace `history/solutions` with `history/lessons` and add
   `history/plans`.
4. Add `skills-lock.json` as an empty template object, or make the health
   checker explicitly tolerate its absence in fresh installs.
5. Add `factory-failure` resolver and gate.
6. Port `check-skill-frontmatter.py`.
7. Update `verify-template.mjs` required files.
8. Update `README.md` to describe install/adopt/update against the new harness.
9. Run source verification and smoke tests.
10. Only after that, write the public post.

## Non-Goals

- Do not transport Unity product doctrine into the default install.
- Do not transport old `active-work.md`.
- Do not transport `history/solutions`.
- Do not make a workflow engine.
- Do not turn logs into source of truth.
- Do not make the blog post part of the first transport.
- Do not make the old template and live Unity doctrine compete.

## Done Gate For This Transport

The extraction is done only when:

- `templates/default` reflects the live `unity-surfaces` harness roles;
- old template-only concepts are removed or intentionally retained with live
  evidence;
- `npm run verify` passes;
- `init`, `adopt`, and `update --dry-run` work in a temp git repo;
- `update` does not overwrite local doctrine by default;
- the health check catches retired `.agents` runtime state;
- the README answers: what this is, how to install it, how to adopt it into an
  existing repo, how to update it, and what the target repo owns after install.
