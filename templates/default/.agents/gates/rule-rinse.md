# Rule Rinse Gate

A rule-rinse pass is done only when:

- the target rule names its trigger;
- required reads are concrete files or file groups;
- allowed writes and non-goals are explicit;
- the gate has concrete checks;
- at least one cold-agent test exists;
- one likely failure mode has been added or tightened;
- the pass is recorded in `.agents/logs/`.
