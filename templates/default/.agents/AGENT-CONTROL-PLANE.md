# Repo-Local Agent Control Plane

A repo-local agent control plane is the small set of files that lets a cold agent enter a repository, classify the task, act in the right scope, verify done, and improve the operating system after mistakes.

It is not a workflow engine. It is not a memory palace. It is not a second README. It is repo law.

The control plane should be compressed enough to load, constrained enough to prevent drift, and frictional enough that agents cannot silently guess their way through dangerous work.

## Principle

Add friction where silent agent drift is expensive. Remove friction where the repo already makes the right action obvious.

Compression makes the system loadable. Constraint makes it followable. Friction makes it honest.

## Shape

```text
AGENTS.md              boot pointer only
.agents/router.md      task trigger -> resolver -> gate -> skill
.agents/active-work.md current context and open questions
.agents/resolvers/     decision rules for task shape
.agents/gates/         concrete done checks
.agents/skills/        repo-local techniques
.agents/logs/          receipts only
history/               dated evidence, audits, plans, decisions
history/solutions/     reusable learned patterns extracted from completed work
```

`AGENTS.md` points. It does not teach.

Resolvers decide scope. Gates decide done. Skills hold technique. Logs prove what happened. History explains why something was once believed. None of these should impersonate the others.

## Operating Rule

A cold agent should be able to answer four questions before editing:

1. What kind of task is this?
2. What files or surfaces am I allowed to touch?
3. What am I explicitly not doing?
4. What check makes this done?

If the control plane cannot answer those, patch the control plane before trusting it.

## Placement Test

When a rule, note, or technique needs a home, place it by function:

| If it answers... | Put it in... |
| --- | --- |
| What kind of task is this? | `.agents/router.md` |
| What scope, reads, writes, and non-goals apply? | `.agents/resolvers/*` |
| What makes the work done? | `.agents/gates/*` |
| What repeatable method or tool technique helps? | `.agents/skills/*` |
| What is the current project context? | `.agents/active-work.md` |
| What happened in this run? | `.agents/logs/*` |
| What evidence or decision was true at a date? | `history/*` |
| What reusable lesson should future work search? | `history/solutions/*` |
| What is the control-plane doctrine itself? | `.agents/AGENT-CONTROL-PLANE.md` |

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

Generic skill design is a baseline, not the repo-local control-plane rule. `skill-creator` teaches skill packaging. `.agents/skills/dotagents-control-plane` teaches safe surgery on this repo's router, resolvers, gates, skills, logs, history, and solutions.

Generic skill design is not enough. Repo-local skill design must ask:

- Is this actually technique, or should it be a resolver rule?
- Is this actually a done check, or should it be a gate?
- Is this reusable across tasks, or just evidence from one run?
- Would putting this in a skill make the agent skip a required repo boundary?

## Artifacts

Artifacts need owners.

A brainstorm produces requirements. A plan produces a plan. Execution produces code changes and, when useful, an execution ledger. Work does not mutate the plan body. Review produces findings. Compound learning produces reusable solutions. Logs produce receipts. History preserves evidence.

Do not let one artifact quietly become another. That is how agents create process sludge.

Artifact placement:

| Artifact | Home |
| --- | --- |
| Active operating rule | `.agents/router.md`, `.agents/resolvers/*`, `.agents/gates/*`, or `.agents/skills/*` |
| Current project context | `.agents/active-work.md` |
| Session receipt | `.agents/logs/*` |
| Completed plan | `history/*` |
| Execution ledger | `history/*` |
| Dated audit, decision, or report | `history/*` |
| Reusable learned pattern | `history/solutions/*` |

Completed plans and execution ledgers stay in `history/`. Put only extracted reusable lessons in `history/solutions/`.

## Solutions

Use `history/solutions/` for reusable learned patterns extracted from completed work.

A solution is not created just because work finished. Create one when the work revealed a pattern that should make the next similar task faster or safer.

Extraction flow:

```text
execution -> ledger/evidence -> closeout question -> solution note -> optional control-plane patch
```

Closeout question:

```text
Did this work teach a pattern that should change how a future agent investigates, decides, or implements?
```

If yes, write `history/solutions/<slug>.md` with:

- problem;
- lesson;
- applies when;
- do;
- do not;
- source history links;
- related control-plane file, or "not yet promoted to live rule."

Promotion rule:

```text
helpful context only       -> keep in history/solutions/
future behavior must change -> patch resolver, gate, or skill
run-specific evidence only -> keep in normal history/
```

## Repair Rule

If an agent repeats a mistake, patch the narrowest live surface that would have prevented it:

```text
wrong task route      -> .agents/router.md
wrong decision shape  -> .agents/resolvers/*
weak done check       -> .agents/gates/*
technique gap         -> .agents/skills/*
stale current context -> .agents/active-work.md
historical evidence   -> history/*
receipt gap           -> .agents/logs/*
```

Do not bloat `AGENTS.md` to compensate for weak downstream files.

## Health

The control plane should be lintable.

A health pass should check that router rows point to real files, every resolver has non-goals and a cold-agent test, every gate has concrete checks, every named skill exists, `history/solutions/` exists, logs are not treated as doctrine, and history is not treated as current state.

The health check is not ceremony. It is how the system resists entropy.
