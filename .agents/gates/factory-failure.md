# Factory Failure Gate

Done means:

- the observed miss is named in one sentence;
- the missed constraint is named;
- the owner surface is named before edits continue;
- unrelated dirty files are left untouched;
- the smallest owner surface was patched, or no-op reason was stated;
- improvement pressure was considered, with either a small owner patch or a no-new-process decision;
- `npm run verify` passes when README, HTML, CLI, verifier, or shipped template changed;
- `agent-browser` is used for local HTML/browser inspection when relevant;
- a short chat closeout names `Miss`, `Missed constraint`, `Owner patched`, `Check`, and `Residual risk`;
- any skipped check has a concrete blocker and residual risk.
