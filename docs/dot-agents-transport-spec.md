# Dot Agents Transport Spec

Date: 2026-05-25

## Source Rule

`unity-surfaces` is the source of truth for the harness shape.

The existing `agents-kit` repo is useful only for the package and installer
shell. Do not merge doctrine from its old template unless it is still present
in, or directly implied by, the live `unity-surfaces` `.agents` system.

No blog post is part of this transport. The post comes after the installable
harness exists.

## July 2026 Rinse Decisions

The Unity rinse adds five portable decisions from the June commit sequence.

- `dfbec319` is the main portable source: port the spine `repeated friction -> owning surface -> smallest durable constraint -> nearest oracle`; port the authority split where commands collapse hops, checks prove, and gates name done checks; route resolver/gate/router quality work through `agent-tooling` rather than a separate `rule-rinse` lane.
- `6075a07f` is a pattern, not a default check: copy/class assertion enforcement belongs in a repo-owned `.agents/checks/*` or hook only when that repo has the same objective test invariant. Do not ship the Unity-specific test-copy check in the default seed.
- `316a4972` is mostly a host-adapter pattern: role/adaptor structure belongs in a repo only after it has real host agent surfaces. Do not ship Unity's `test-reviewer` or doc-drift roles as generic defaults.
- `6703041b` is the counterweight: trim enforcement when it becomes heavier than the miss. The subagent repair belongs first in `.agents/resolvers/agent-tooling.md`; promote to `.agents/checks/*` only if a transcript or tool-call oracle exists.
- `aa3dd514` is the delegated-subagent proof commit: port the resolver rule and its "no transcript oracle yet" reasoning, but do not port Unity's dated log into the default seed.

## Additional Commit Archaeology

Comparing Unity history and the current `agents-kit` template gives this transport decision table.

| Commit | Unity change | Transport decision |
| --- | --- | --- |
| `83d08dca` | Adds the factory-failure control loop, router row, gate, and health coverage. | Already core seed behavior. Keep generic failure classification and live-owner repair. |
| `fd778261` | Renames learning artifacts to `history/lessons` and makes lessons an artifact shelf, not live law. | Already core seed behavior. Keep `history/lessons` and `factory-failure` lifecycle ownership. |
| `af55c851` | Adds anti-consolidation rules for lesson artifacts. | Already/now core seed behavior. Preserve source episodes and promotion state. |
| `8c6c0e3f` | Adds a Unity factory-state checker under `agents-kit` scripts. | Do not port the checker. Later doctrine supersedes it: repo/factory checks belong in `.agents/checks/*`, not `agents-kit` scripts. |
| `22c499b1` | Adds stack-landing dirty-diff rules for stacked PR work. | Do not ship by default. It is useful repo doctrine when a repo uses the `stack` workflow, but too specific for the portable seed. |
| `9c93e919` | Adds Unity git handover gate and branch/upstream rules. | Do not ship as default doctrine. Target repos have different branch protections; keep only stage-explicit-paths and review-only install protection. |
| `31bed50f` | Tightens Unity testing gate around class/style checksum assertions. | Do not ship by default. Treat as an example of a repo-owned test invariant. |
| `6075a07f` | Adds PostToolUse hook plus copy/class assertion check. | Do not ship by default. Port the doctrine pattern only: hooks/checks are for mechanically observable invariants. |
| `316a4972` | Adds roles, hooks, governed loops, and adapter doctrine. | Do not ship by default. Keep role/adapter and loop machinery out until a target repo has actual host-agent surfaces or recurring loop contracts. |
| `6703041b` | Trims remote-guard enforcement after it became too heavy. | Port the restraint: avoid heavy gates when a smaller resolver rule or git/platform guardrail is enough. |
| `dfbec319` | Consolidates command/check/gate authority and retires stale lanes. | Ported: commands/checks surfaces, health coverage, and agent-tooling-owned quality passes. |
| `aa3dd514` | Adds delegated subagent flow to `agent-tooling`. | Ported: resolver rule and check-promotion condition. |
| `32845c27` | Thins and hardens the Unity control plane after the rinse. | Use as the live comparison point for the portable spine. Keep the five-field receipt, fail-closed proof expectations, and generic lanes; reject Unity product surfaces, roles, loops, hooks, logs, lesson bodies, and installed-skill inventory. |
| `2a7e7645` | Separates repo-owned materialization hashes from installer-owned import metadata. | Adopted without fake provenance: the seed manifest declares `agents-kit` and an empty versioned materialization map; `skills-lock.json` remains the import-metadata owner. The health check proves the split without interpreting installer `computedHash`. |

The two integrity decisions are implemented and covered by the source verification gate:

- The package verifier rejects conflict markers by inspecting shipped template content, and a negative self-test proves that rejection. `git diff --check` remains an independent maintainer oracle.
- The seed declares `agents-kit` ownership in `.agents/skills/manifest.json` without inventing imported skills or hashes. The health checker validates schema, owner overlap, orphan hashes, declared skill presence, and materialized directory ownership; the installer treats the exact manifest path as review-only.
- The shipped `agents-kit` operator skill is rinsed to a short installed-repo procedure: find the nearest owner, inspect dirty state plus both skill ownership records, state the canonical five-field receipt, and run frontmatter and health gates without repeating the control-plane placement map.

## Codebase Comparison Result

The live Unity `.agents` tree is intentionally larger than the default seed: it includes product resolvers, package gates, role adapters, governed loops, hooks, commands, checks, many installed skills, and dated logs/lessons. The portable seed should carry the reusable owner/oracle contract, not Unity's product surface inventory.

What must match at the seed level:

- `AGENTS.md` stays a boot pointer.
- Router defaults stay generic: `agent-tooling` and `factory-failure`.
- `agent-tooling` owns control-plane edits, commands/checks placement, skill inventory, and delegated subagent behavior.
- `factory-failure` owns classification, learning lifecycle, anti-consolidation, and live-owner repair.
- `commands/` and `checks/` exist as first-class surfaces.
- `agents-kit` scripts check the control plane only.

What should not match by default:

- Unity product rows: web, runtime-boundary, shared-package, testing.
- Unity commands/checks: git-handover, test-proof, runtime-boundary, visible-copy, factory-state.
- Unity hooks, roles, loops, host adapters, and installed skill inventory.
- Unity logs and lesson bodies, except for generic lesson shape and lifecycle doctrine.

## Pre-Refactor `agents-kit` Repo Shape

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

.agents/commands/
  executable hop-collapsers for recurring hot paths

.agents/checks/
  mechanical pass/fail oracles for agent-process or repo-ownership invariants

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
| `.agents/commands/*` | hop-collapsing entrypoints |
| `.agents/checks/*` | mechanical oracles |
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
    gates/
      README.md
      agent-tooling.md
      factory-failure.md
    commands/
      README.md
    checks/
      README.md
    skills/
      README.md
      manifest.json
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
  - "AGENTS points, router dispatches, resolvers scope, gates name proof, commands collapse hops, checks prove, skills teach, logs orient, history is evidence";
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
  - resolver/gate/command/check/skill distinction;
  - agents-kit scripts boundary;
  - artifact ownership;
  - settlement check;
  - doctrine pressure check;
  - lessons lifecycle boundary.
- `.agents/router.md`:
  - generic rows only: agent-tooling and factory-failure;
  - clear priority rules;
  - no Unity product rows.
- `.agents/resolvers/agent-tooling.md`:
  - control-plane, scratch, docs, skills, host setup trigger;
  - pre-edit ownership receipt;
  - skill inventory boundary;
  - installed skill mirror boundary;
  - local-only skill authoring rule;
  - delegated subagent work rule: spawn once, report id, keep write sets disjoint, poll/await cleanly, verify returned result, close worker;
  - allowed writes and non-goals;
  - no product code by default.
- `.agents/gates/agent-tooling.md`:
  - receipt required for nontrivial lane edits;
  - health check required for router/resolver/gate/command/check/skill/lesson structure;
  - lessons stay in `history/lessons`;
  - skill provenance checked before inventory edits;
  - commands collapse repeated hops and do not own verdicts;
  - checks own objective pass/fail;
  - `AGENTS.md` stays short;
  - `.agents` contains no current-focus/build-loop runtime state;
  - local-only files are not accidentally staged.
- `.agents/resolvers/factory-failure.md`:
  - classify failures before repair;
  - use the friction-promotion shape for repeated or expensive misses;
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
- `.agents/commands/README.md` and `.agents/checks/README.md`:
  - commands collapse repeated manual hops without owning verdicts;
  - checks prove objective repo-observable invariants;
  - no check is added when the repo cannot observe the miss.
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
  - verify gates and commands only name existing `.agents/checks/*` paths;
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
| agent tooling, docs placement, `.agents` control-plane, `.agents/commands`, `.agents/checks`, `.scratch`, PRDs, skills, host-specific agent setup, lesson artifacts, initial repo setup, package-script plumbing, resolver/gate/router quality pass | `.agents/resolvers/agent-tooling.md` | `.agents/gates/agent-tooling.md` | `.agents/skills/agents-kit` for `.agents` changes; otherwise matching `.agents/skills/*` |

## Priority Rules

- Agent tooling work stays in the control-plane lane unless the user explicitly switches into product implementation.
- Resolver, gate, and router quality passes use agent-tooling plus `.agents/AGENT-CONTROL-PLANE.md`; do not create a second live lane for rule cleanup.
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
- `.agents/commands/*`
- `.agents/checks/*`
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
6. Add `commands/README.md` and `checks/README.md`; do not ship Unity product checks.
7. Retire the default `rule-rinse` lane; quality passes route through `agent-tooling`.
8. Port `check-skill-frontmatter.py`.
9. Update `verify-template.mjs` required files.
10. Update `README.md` to describe install/adopt/update against the new harness.
11. Run source verification and smoke tests.
12. Only after that, write the public post.

## Non-Goals

- Do not transport Unity product doctrine into the default install.
- Do not transport old `active-work.md`.
- Do not transport `history/solutions`.
- Do not make a workflow engine.
- Do not turn logs into source of truth.
- Do not ship a giant subagent gate without a real transcript/tool-call oracle.
- Do not make the blog post part of the first transport.
- Do not make the old template and live Unity doctrine compete.

## Done Gate For This Transport

The extraction is done only when:

- `templates/default` reflects the live `unity-surfaces` harness roles;
- the authority split is visible: commands collapse hops, checks prove, gates name done checks;
- old template-only concepts are removed or intentionally retained with live
  evidence;
- `npm run verify` passes;
- `init`, `adopt`, and `update --dry-run` work in a temp git repo;
- `update` does not overwrite local doctrine by default;
- the health check catches retired `.agents` runtime state;
- the README answers: what this is, how to install it, how to adopt it into an
  existing repo, how to update it, and what the target repo owns after install.
