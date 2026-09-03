# Review-cycle angle roster

Each entry below is pasted into one `review-angle` dispatch, together with the review brief's
absolute path. Every angle runs in every **full** cycle — the union review covers correctness AND
quality in one fan-out. The **slim** profile runs `LINE` + `GONE` only; see the depth profiles in
`../SKILL.md`. Do not drop angles to save cost unless the human narrows scope explicitly, and say
which angles you dropped when you do.

## Correctness family

### LINE — line-by-line re-derivation
Re-derive what each changed line actually does, statement by statement, against what the brief says it should do. Check operator precedence, sign conventions, boundary conditions, off-by-ones, null/None paths, early returns that skip cleanup.
Do NOT report: style, naming, or anything about unchanged code except where a changed line's correctness depends on it.

### GONE — removed-behavior hunt
For every deletion or replacement in scope, establish what the old code did that the new code doesn't. Compare against the base revision (the brief gives the changeset spec). Look especially for silently dropped edge-case handling, event unsubscription, cleanup, and clamps.
Do NOT report: removals the brief declares intentional — but verify the declaration covers the whole removal, not just its headline.

### XFILE — cross-file consistency tracer
Trace every contract that crosses file boundaries in the change: call signatures, serialized field names, event payloads, enum ordinals, string keys, units and coordinate frames. Verify both ends agree after the change.
Do NOT report: single-file logic (LINE owns it).

### PIT — C#/Unity pitfalls
Hunt the platform's known traps in the changed code: struct copy semantics, closure capture in loops, foreach allocation, Unity lifetime/null-bool semantics, serialized-field renames breaking scenes/prefabs, main-thread-only API calls, floating-point equality, execution-order dependencies, coroutine/async misuse.
Do NOT report: generic logic errors with no platform component (LINE owns those).

### WRAP — wrapper/adapter correctness
Where the change wraps, adapts, or mirrors another layer (adapter over a sim model, serialization mirror, interface implementation), verify the wrapper preserves the wrapped contract: value ranges, units, null behavior, ordering, threading assumptions, error propagation.
Do NOT report: the wrapped layer's own internal bugs unless the wrapper amplifies them.

## Quality family

### REUSE — reuse of existing code
Find changed code that reimplements something that already exists in the codebase (helpers, extension methods, established utilities). Name the existing symbol with file:line.
Do NOT report: near-misses where the existing code's semantics genuinely differ — check before claiming.

### SIMP — simplification
Find changed code that can be materially simpler with identical behavior: collapsible branches, redundant state, dead parameters, conditions provably constant in context.
Do NOT report: simplifications that change behavior, however slightly, or matters of taste with no complexity payoff.

### EFF — efficiency/allocation
Find allocation and cost in paths the brief marks hot (per-frame, per-tick, per-event): hidden allocations (LINQ, boxing, string concat, closures), repeated computation of invariants, O(n²) scans where n grows with content.
Do NOT report: costs in cold paths (setup, editor-only, one-shot) unless egregious.

### ALT — altitude
Judge whether each fix/feature in scope sits at the right abstraction level: is a symptom patched where a cause is reachable? Is special-casing accumulating where the underlying model should change? Is a change fighting the architecture the docs describe?
Do NOT report: line-level issues (other angles own them) — this angle is about the shape of the change, argued from the brief's canon pointers.

## Sweep family

### CONV — conventions
Check the changed code against the project's stated conventions (the project context doc `docs/co-unity.context.md`, house patterns visible in neighboring code): naming, file headers, serialized-field typing rules, comment discipline, assembly placement.
Do NOT report: conventions the project doesn't actually state or practice — cite the rule's source for every finding.

### GAP — gap-sweep
Read the brief's invariants list and the full diff, and ask what NO other angle covers: unexercised new code paths, missing test coverage for the change's riskiest claim, brief invariants nothing in the change enforces, TODOs introduced without tracking.
Do NOT report: anything clearly owned by a named angle above — your value is the remainder; duplicating others is noise.
