# Factory Failure Gate

Done means:

- the observed failure is named in one sentence;
- the failure is classified using `.agents/resolvers/factory-failure.md`;
- user corrections are explicitly classified as normal iteration or agent-process failure using the Learning Line;
- the owner surface is named before edits happen;
- live-owner repairs follow the repair loop in `.agents/resolvers/factory-failure.md`;
- learning decisions follow the learning loop in `.agents/resolvers/factory-failure.md`;
- agent-process failures write/update both the orientation log and a `history/lessons/*` lesson note, linked both ways;
- normal iteration does not create a learning unless a repeated agent behavior or system ambiguity is identified;
- exactly one of these outcomes is recorded:
  - local fix completed;
  - live control-plane repair completed;
  - factory learning captured as context only;
  - factory learning promoted into a live owner surface;
  - HITL/blocker recorded because repair is unsafe or underspecified;
  - no-op with reason;
- the selected owner resolver and gate are run when a live surface is patched;
- the factory-failure gate is run after the owner gate for live-owner repairs;
- `python3 .agents/skills/agents-kit/scripts/check-agents-kit-health.py` passes when router, resolver, gate, skill, or learning structure changes;
- the relevant repo-owned check passes when repairing task-state drift, or the remaining state blocker is recorded as HITL/blocker;
- touched `history/lessons/*` notes record a promotion state: context-only, live-promotion, no-learning, or HITL;
- lesson or history changes preserve source episodes and do not consolidate multiple lessons into broader doctrine unless a live owner surface is explicitly patched and named;
- any skipped check has a concrete blocker and residual risk;
- no unrelated cleanup, archiving, or doctrine promotion is bundled into the failure repair.
