# Repo-Local Agent Control Plane

A repo-local agent control plane is the small set of files that lets a cold agent enter a repository, classify the task, act in the right scope, verify done, and improve the operating system after mistakes.

It is not a workflow engine. It is not a memory palace. It is not a second README. It is repo law.

The control plane should be compressed enough to load, constrained enough to prevent drift, and frictional enough that agents cannot silently guess their way through dangerous work.

## Principle

Add friction where silent agent drift is expensive. Remove friction where the repo already makes the right action obvious.

Compression makes the system loadable. Constraint makes it followable. Friction makes it honest.

## Spine

```text
repeated friction -> owning surface -> smallest durable constraint -> nearest oracle
```

Promote only when the miss repeated, cost real time, the owner is known, and a nearby prompt, resolver, gate, command, check, hook, CI job, or package script would have prevented it.

Do not centralize wisdom. Put the smallest rule where it acts.

## Rule of Thumb

If a cold agent does not need it to orient, route, constrain scope, apply reusable technique, verify done, or resume handoff, it does not belong in `.agents`.

## Public Model

The public model is deliberately thin:

```text
agents judge
commands collapse hops
checks prove
memory remembers
```

These are public words, not necessarily folders. Do not create `.agents/memory/`. Memory lives as `.agents/logs/*`, `history/lessons/*`, and other dated repo evidence.

Router, resolvers, and gates are project adapters. Use them when a repo has real ownership hazards, expensive done conditions, or repeated wrong-surface misses.

## Shape

```text
AGENTS.md              boot pointer into the live control plane
.agents/router.md      task trigger -> resolver -> gate -> skill
.agents/resolvers/     decision rules for task shape
.agents/gates/         concrete done checks
.agents/commands/      executable hop-collapsers for recurring hot paths
.agents/checks/        agent-process and repo-ownership mechanical oracles
.agents/skills/        repo-local techniques
.agents/skills/agents-kit/scripts/
                       control-plane health checks only
.agents/logs/          session notes and handoff context
history/               dated evidence, audits, decisions
history/plans/         completed plans
history/lessons/       captured lesson artifacts; factory-failure owns the lifecycle
```

`AGENTS.md` points. It does not teach. Boot happens at every new agent session, and the pointed-to `.agents/` files continue to govern the work after startup.

Resolvers decide scope. Gates name done checks. Commands collapse repeated hops. Checks prove agent-process truth. Skills hold technique. Logs orient resumption. History explains why something was once believed. Git proves commits and diffs. None of these should impersonate the others.

## Authority Map

Every artifact is either live law, current app doctrine, active execution state, or dated evidence. Do not let one artifact play two roles.

| Surface | Authority | Maintenance rule |
| --- | --- | --- |
| `AGENTS.md` | boot invariants | keep tiny; point into `.agents` |
| `.agents/router.md` | routing law | classify the task, resolver, gate, and default skill |
| `.agents/resolvers/*` | owner and scope law | own reads, allowed writes, non-goals, and cold-agent tests |
| `.agents/gates/*` | done law | own observable checks before done is claimed |
| `.agents/commands/*` | executable hop-collapsing entrypoints | run common workflows and call checks; do not hide ownership |
| `.agents/checks/*` | mechanical oracle law | return pass/fail for objective agent-process or repo-ownership invariants |
| `.agents/skills/*` | technique | teach repeatable methods; do not hide routing or done rules |
| `.agents/logs/*` | handoff receipts | orient resumption; never treat as live law |
| repo docs | current domain or product vocabulary | keep terms and relationships current |
| decision records | accepted decisions | supersede by explicit later decision, not silent overwrite |
| task or PRD docs | active product intent | feed implementation planning; do not impersonate execution state |
| boundary docs | current boundary evidence | update when ownership or runtime facts shift |
| `.scratch/*` | active local execution state | hold working packets only; do not turn into doctrine |
| `history/*` | dated evidence | preserve what happened or was believed; not live law |
| `history/plans/*` | completed plans | archive finished plans; do not run work from here |
| `history/lessons/*` | captured lesson artifacts | factory-failure owns promotion; lessons are not law by default |
| personal orientation docs | orientation | useful map; not agent law |

## Operating Rule

A cold agent should be able to answer four questions before editing:

1. What kind of task is this?
2. What files or surfaces am I allowed to touch?
3. What am I explicitly not doing?
4. What check makes this done?

If the control plane cannot answer those, patch the control plane before trusting it.

## Pre-Edit Ownership Receipt

A pre-edit ownership receipt is the pre-action callout that proves the agent has selected the owner before touching files.

Use it for nontrivial edits, and always for durable product code, `.agents` control-plane changes, docs/tracker/skill/history changes, and expensive repo-specific lanes.

```text
Owner surface:
Allowed writes:
Forbidden surfaces:
Done gate:
First real check:
```

The receipt is not a plan, not a session log, and not a new resolver. It can be a short chat update. It prevents stale ownership and wrong-surface edits before action. Name evidence order only when sources can disagree. Name a next oracle only when the first check is deliberately narrower than the final done claim.

Logs happen after durable work. A log may compress receipt fields into orientation when they help future resumption, but the log does not replace the pre-edit receipt.

## Placement Test

When a rule, note, or technique needs a home, place it by function:

| If it answers... | Put it in... |
| --- | --- |
| What kind of task is this? | `.agents/router.md` |
| What scope, reads, writes, and non-goals apply? | `.agents/resolvers/*` |
| What makes the work done? | `.agents/gates/*` |
| What loop should the human/agent run? | `.agents/commands/*` |
| What objective invariant proves pass/fail? | `.agents/checks/*` |
| What repeatable method or tool technique helps? | `.agents/skills/*` |
| What objective control-plane invariant needs repeatable checking? | `.agents/skills/agents-kit/scripts/*` |
| What objective product or package invariant needs repeatable checking? | package scripts or tests |
| What happened in this run? | `.agents/logs/*` |
| What evidence or decision was true at a date? | `history/*` |
| What completed plan should be archived? | `history/plans/*` |
| What reusable lesson artifact should future work search? | `history/lessons/*` |
| What is the control-plane doctrine itself? | `.agents/AGENT-CONTROL-PLANE.md` |

## Promotion Timing

Use timing before placement gets fuzzy:

| If the agent needs it... | Promote it to... |
| --- | --- |
| before editing, to classify scope, reads, allowed writes, or non-goals | resolver |
| before claiming done, to prove the task is complete | gate |
| as a recurring hot path that collapses manual routing or sensor assembly | `.agents/commands/*` |
| as an objective repeatable filesystem, AST, command, or probe check | `.agents/checks/*`, tests, or package scripts |
| to explain why the product, app, or boundary is shaped that way | docs or ADR |
| to perform a repeatable technique across cases | skill |

Start with the weakest live rule that prevents the miss. Move from prose to a mechanical check when the invariant is objective or has been missed repeatedly. Do not grow resolvers or gates into handbooks; once a gate says "run this check", the script owns the detail.

## Resolvers

A resolver is a scope decision.

Each resolver should name:

- trigger
- required reads
- owned surfaces
- allowed writes
- non-goals
- gate
- cold-agent test
- failure signs

A resolver should not contain technique dumps. If the task needs a method, put that in a skill. If the task needs a done check, put that in a gate.

## Gates

A gate is a done contract.

A gate should name observable checks, commands, probes, or evidence. “Verify behavior” is not a gate. “Unauthenticated private route returns `401/403/302`” is a gate.

If a check cannot be run, the agent must say why and leave the residual risk visible.

## Skills

A skill is technique, not law.

Use skills for repeatable procedure, tool use, bundled references, scripts, and specialized judgment. Do not use skills to hide repo routing rules. A skill can help execute a resolver, but the resolver owns whether the skill belongs.

When a skill materially shapes the work or answer, name it visibly as the final
line of the opening boundary block or the final line before the artifact:
`Skill used: .agents/skills/<name>/SKILL.md`. Omit the line when no skill
materially shaped the response.

Skill provenance is explicit: `.agents/skills/manifest.json` owns repo and seed skills plus versioned local materialization hashes; `skills-lock.json` owns installer import metadata, whose `computedHash` remains opaque. The owner sets are disjoint, repo declarations win over same-name global skills, and global fallback applies only to undeclared skills. Before changing a skill, inspect both ownership files and its directory. A materialization hash proves local snapshot integrity, not upstream provenance.

Imported bodies remain tracked until an immutable upstream reference can restore the same materialized bytes. If a skill has an upstream installer, use it. Hand-authored skills are for repo technique and must be declared in `.agents/skills/manifest.json`.

Generic skill design is a baseline, not the repo-local control-plane rule. `skill-creator` teaches skill packaging. `.agents/skills/agents-kit` teaches safe surgery on this repo's router, resolvers, gates, skills, logs, history, and lessons.

Generic skill design is not enough. Repo-local skill design must ask:

- Is this actually technique, or should it be a resolver rule?
- Is this actually a done check, or should it be a gate?
- Is this reusable across tasks, or just evidence from one run?
- Would putting this in a skill make the agent skip a required repo boundary?

## Commands And Checks

Commands are optional hop-collapsing entrypoints. Checks, gates, product tests, package scripts, and CI own truth.

A command earns its file when it removes repeated manual routing or sensor assembly without owning the verdict.

Use `.agents/commands/*` for human-invoked hop-collapsers. A command may gather facts, print receipts, and call checks. It should not become a broad orchestrator.

Use `.agents/checks/*` for objective agent-process or repo-ownership invariants. Checks exit nonzero on failure.

Product build/test/runtime checks that engineers run outside agent workflow belong in package scripts or package tests. Docs explain product/domain truth; they do not own executable agent oracles.

## Agents-Kit Scripts

A script belongs under `.agents/skills/agents-kit/scripts/` only when it mechanically checks the `.agents` control plane itself:

- router, resolver, gate, skill, log, and lesson paths exist and have required shape;
- `.agents` has not regained current-focus or build-loop runtime state;
- lesson promotion metadata points at real live-owner surfaces.

Current accepted `agents-kit` scripts:

- `check-agents-kit-health.py`: lints the live control-plane structure.

A script does not belong under `.agents/skills/agents-kit/scripts/` when it checks factory artifacts, builds product code, runs app workflows, performs migration work, manages active project status, or replaces a resolver/gate decision. Put agent/repo checks in `.agents/checks/*`; put product commands in package scripts; put one-off evidence in `history/*`.

## Artifacts

Artifacts need owners.

A brainstorm produces requirements. A plan produces a plan. Execution produces code changes and, when useful, an execution ledger. Work does not mutate the plan body. Review produces findings. Factory-failure may produce captured lessons. Logs produce handoff notes. History preserves evidence.

Do not let one artifact quietly become another. That is how agents create process sludge.

Artifact placement:

| Artifact | Home |
| --- | --- |
| Active operating rule | `.agents/router.md`, `.agents/resolvers/*`, `.agents/gates/*`, `.agents/commands/*`, `.agents/checks/*`, or `.agents/skills/*` |
| Session handoff note | `.agents/logs/*` |
| Completed plan | `history/plans/*` |
| Execution ledger | `history/*` |
| Dated audit, decision, or report | `history/*` |
| Captured lesson artifact | `history/lessons/*` |

Completed plans stay in `history/plans/`. Execution ledgers stay in `history/`. Captured lesson artifacts stay in `history/lessons/`.

## Settlement Check

Before treating a new route, gate, boundary, or slice plan as settled, name:

- what is proven;
- what is provisional;
- what would change or retire this shape;
- whether it belongs in live `.agents/*` or only `history/*`.

This is a closeout question, not a status label. Do not use stale `draft/stable` metadata as a substitute for naming the evidence pressure.

## Doctrine Pressure Check

When domain vocabulary, app behavior, or external contract facts start carrying enforcement weight, ask:

```text
Has this moved between vocabulary, current boundary evidence, and enforceable doctrine?
```

Run this check when a term, relationship, or boundary becomes cross-surface, ownership-critical, execution-critical, repeatedly corrected, code-backed by multiple call sites, externally updated by a backend/protocol/service owner, or mechanically checkable.

The answer may be "no". Do not create law because a concept feels important. Name the evidence pressure first:

- what changed;
- which code, contract, or repeated correction proves it;
- what breaks if the current docs stay unchanged;
- whether existing doctrine should be updated instead of creating a new rule.

Use the smallest live surface that will still be read in four weeks:

| If the pressure is... | Put it in... |
| --- | --- |
| vocabulary or domain relationship | repo docs |
| current evidence boundary | boundary docs |
| hard-to-reverse, surprising trade-off | decision records |
| task classification | `.agents/router.md` |
| scope, reads, writes, or non-goals | `.agents/resolvers/*` |
| done check | `.agents/gates/*` |
| mechanical invariant | tests, package scripts, or `.agents/checks/*` |
| run-specific evidence | `history/*` |

Prefer updating the existing owning doctrine over adding a second source of truth.

## Lessons

`history/lessons/` stores captured lesson artifacts. It is not the learning lifecycle owner.

`.agents/resolvers/factory-failure.md` owns the learning lifecycle: classification, reusable-vs-not, creation decision, promotion state, and live-owner selection.

`.agents/gates/factory-failure.md` owns lifecycle closeout: log link, lesson link, promotion decision, and required checks.

Lesson note shape lives in `history/lessons/README.md`.

## Repair Rule

Repair classification and owner selection live in `.agents/resolvers/factory-failure.md`.

Use this document's placement map only after `factory-failure` has named the owner surface.

Do not bloat `AGENTS.md` to compensate for weak downstream files.

## Health

The control plane should be lintable.

A health pass should check that router rows point to real files, every resolver has non-goals and a cold-agent test, every command and gate path points to a real check when it names one, every named skill exists, `history/lessons/` exists, logs are not treated as doctrine, history is not treated as current state, retired runtime-state files are absent from `.agents`, and lesson notes have promotion-state metadata.

The health check is not ceremony. It is how the system resists entropy.
