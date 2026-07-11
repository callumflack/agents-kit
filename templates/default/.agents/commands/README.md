# Commands

Commands collapse repeated manual hops. They are optional entrypoints for workflows that agents or humans invoke often enough to justify a file.

A command may gather facts, print receipts, and call checks. It does not own the verdict. Ownership still lives in the selected resolver, gate, check, test, or package script.

Create a command only when it removes repeated routing or sensor assembly. Keep one-off runbooks in `history/` or task docs.
