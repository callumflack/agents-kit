# Checks

Checks prove objective agent-process or repo-ownership invariants that normal product tests do not naturally express.

A check should be runnable, deterministic enough to trust, and return nonzero on failure. Gates may name checks; commands may call checks; the check owns the pass/fail detail.

Do not add a check for behavior the repo cannot observe. If the miss lives only in tool-call choreography or transcript behavior, keep the rule in the narrow resolver until a real oracle exists.
