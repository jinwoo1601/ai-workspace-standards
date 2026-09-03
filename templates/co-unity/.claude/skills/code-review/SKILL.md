---
name: code-review
description: >
  Runs the union review cycle over a changeset range or feature branch — brief, parallel
  correctness + quality angles, main-thread dedup, adversarial verification, human ruling,
  surgical fixes, verification, check-in. Use when: a feature build reaches its review step,
  the human asks for a review pass or a simplify pass, or a change is about to be put to G2.
version: 0.1.2
scope: co-unity
status: active
owner: pm
last_reviewed: 2026-09-01
prerequisites: The build compiles and the verification bindings are green; the scope is expressible as a changeset range or branch.
relates_to:
  - skill: refactoring
    type: composes_with
  - skill: test-driven-development
    type: follows
gemini-parity: skip
metadata:
  type: process
  triggers:
    - code review
    - review pass
    - review cycle
    - simplify pass
    - review this branch
    - review this changeset
---

## Context

**One union review cycle: correctness and quality in the same fan-out.** Finder angles read a
shared brief and hunt in parallel; adversarial verifiers kill the weak findings; the human rules
on the survivors; the main thread applies the fixes — via `code-writer`.

> Finders find, verifiers kill, the human rules, the main thread applies fixes — via `code-writer`.
> No finding reaches the human unverified; no fix is applied unruled.

There is no separate "correctness review" and "quality review" in this variant. Splitting them
doubles the brief-building cost and lets each half assume the other covered something. One brief,
one fan-out, one ruling session.

Version control is Plastic SCM (Unity Version Control), driven as `cm.exe` from WSL. The brief's
revision idioms and the closing check-in are stated in Plastic terms and nothing else. A project
that does not bind Plastic has no revision range this skill can resolve — report that and stop.

## When to Use

**Feature review step (phase 4)**:
- Trigger: the implementation loop closed green and the feature moves to review.
- Use case: the full profile — every angle — because G2 is downstream.

**Human-requested review or simplify pass**:
- Trigger: "review this", "review the branch", "do a simplify pass".
- Use case: profile chosen by lane (see *Depth profiles*), widened on request.

**Small fix on a working tree**:
- Trigger: a one-or-two-file correction that still needs a second pair of eyes.
- Use case: the slim profile plus the materiality floor.

**Not for**: reviewing a design doc (that is the design track's G1 conversation), or auditing a
persisted plan (`plan-validator` owns that).

---

## Execution Steps

### 1. BRIEF — build the shared context

Build the review brief from `assets/review-brief-template.md` and write it **into the session
scratchpad by absolute path — never into the project tree**, so the working tree stays clean and
the brief never becomes a controlled file.

Plastic idioms — the brief states them literally, because the dispatched angles use exactly what
the brief says:

- Changed-file list: `cm.exe diff cs:A cs:B --format="{status}|{path}{newline}"`, or `cm.exe status`
  when the work under review is still pending.
- Base content for comparisons: `cm.exe cat "path#cs:N"` into a temp file, then unix `diff`.
- **Never run `cm diff` on file content** — it launches the Windows GUI difftool and hangs a
  headless session.
- `cm.exe cat` transliterates Unicode through the Windows codepage, producing phantom hunks on
  every Unicode-bearing line; use `cmp -s` for byte-identity checks and strip non-ASCII from both
  sides when localizing a real edit.

Per-file intent comes from the persisted build plan; load-bearing invariants and canon pointers
come from the feature's requirements and architecture docs and the design ADRs in play.

### 2. FAN OUT — one dispatch per angle

One `review-angle` dispatch per entry in `references/angle-roster.md`, per the depth profile.
Each call prompt is **self-contained**: the brief's absolute path plus that angle's roster entry
pasted in full. Dispatched angles inherit no context from this thread — anything not in the prompt
or the brief does not exist for them. Batch the dispatches in as few messages as possible.

An optional `security-monitor` angle runs alongside when the change touches secrets handling,
dependencies, or packaging.

### 3. DEDUP — main thread, no dispatches

Main-thread reasoning only. Merge duplicate findings across angles, keep the strongest statement
of each, and drop anything the brief declared out of scope. **If this session wrote the code under
review, that is exactly when not to soften a finding** — dedup edits for overlap, never for comfort.

### 4. VERIFY — one verifier per survivor

One `finding-verifier` dispatch per surviving finding, its text passed verbatim plus the brief's
absolute path. Batch about five at a time when survivors exceed ten. No finding is presented to
the human without a verifier verdict. Negative results are findings: a refuted finding is named in
one line so the human can see what was considered and killed. The verdict vocabulary is the
`finding-verifier` persona's — CONFIRMED, REFUTED, or CONFIRMED-AS-CLARITY; the last means the code
or doc failed to carry its rationale, and the fix is to make the intent legible.

### 5. RULE — the human rules, per finding

Present survivors ranked by severity then confidence, each with its verdict and its decisive
evidence. **The human rules fix / defer / reject per finding. This is a hard gate.** Do not proceed
on silence, enthusiasm, or a "looks good" about anything other than the ruling itself. Deferred
items are filed in the ruling record (`memory/reports/<YYYY-MM-DD>-review-<feature>.md`, the table
below) with the ruling date, and `architect` carries each still-open one into the feature's
architecture doc `## Risks, tradeoffs & open questions` at the as-built reconciliation — a deferral
is never only in chat.

### 6. FIX — surgical, via code-writer

Only rulings marked *fix* are applied, and they are applied by `code-writer`, not on the main
thread. The dispatch names the finding, the file and line, and the agreed fix. **The reviewed
code's shape is canon** — a review is not a license to refactor. Where a fix is a named refactoring
pattern, the `refactoring` skill carries the pattern; this skill supplies the reason.

### 7. CHECK — re-verify

Dispatch `test-runner` on the project's verification bindings. A fix that was never re-verified is
not a fix.

### 8. COMMIT — the review pass as its own changeset

Dispatch `vc-checkin` with the review-pass comment (a findings summary: what was found, what was
ruled, what was fixed, what was deferred). Long comments go through `-commentsfile=<WINDOWS path>`
per the `plastic-checkin` skill.

---

### Depth profiles

Depth is chosen by lane, not by taste. State which profile ran in the review record.

| Profile | Lane | Angles |
|---|---|---|
| **slim** | A small fix — one or two files, one behavior | `LINE` + `GONE` |
| **full** | Feature and design lanes, and anything bound for G2 | all 11 roster angles |

**Why slim is two angles.** On a small diff, `XFILE`, `PIT`, and `GAP` mostly re-find what `LINE`
and `GONE` already have, while `GAP` reliably converts a small fix into a long list of
could-assert-more remarks. A small fix buys its confidence from two correctness angles read
carefully, not from breadth. Add `XFILE` back when the diff crosses a contract boundary (a
serialized field name, an enum, an interface used across assembly boundaries) and `PIT` when it
touches component lifecycle, coroutines, or main-thread-only engine APIs — and name the addition
in the review record.

Depth may be widened on request ("review this thoroughly" → full, whatever the lane). **Never
narrow below the lane's profile without the human saying so, and if you do, say which angles you
dropped** — a silently narrowed review reads as a clean one.

### Materiality floor

A survivor becomes a **numbered finding** only if it asserts that something in the result is
*wrong*: code that misbehaves, a doc statement that is false, a claim the change does not deliver,
or a removal that lost behavior. That is the whole bar — severity is not the test, so a false row
in a reference table is numbered even though it is minor.

Everything about what the change *could additionally* have done — coverage that could be stronger,
an assertion that could be tighter, an adjacent improvement, style, naming — is **not** a numbered
finding. It goes in a flat `### Notes` list at the end: one line each, no evidence block,
explicitly marked unverified. Notes are not verified; that is what earns them their one line and
their unverified label.

Sorting a real defect down into Notes to shorten the review is the one failure this step must not
produce — **the floor asks _wrong vs. could-be-better_, never _big vs. small_.**

The floor applies to the slim profile. It does not apply to the full profile, where a coverage gap
can be exactly what blocks G2.

---

## Output Format

**The review record** (presented in conversation, then summarized into the check-in comment):

```markdown
## Review — <feature / changeset range>
Profile: <slim | full> · angles run: <list> · angles dropped or added: <list, or none>
Base revision: cs:N · files reviewed: <count>

### Findings
1. **<one-line claim>** — severity <blocker|major|minor>, confidence <high|medium|low>
   - Verdict: CONFIRMED | REFUTED | CONFIRMED-AS-CLARITY
   - Evidence: `<absolute path>:<line>` — <the decisive fact, not a narrative>
   - Fix: <the smallest change that resolves it>
2. ...

### Refuted
- <finding, one line each> — refuted because <reason>

### Notes (unverified, slim profile only)
- ...

### Not verifiable from here
- <device checks, headset playtest, authored-content review — named explicitly>
```

**The ruling record** (appended once the human has ruled, saved by the PM at `memory/reports/<YYYY-MM-DD>-review-<feature>.md`, and carried into the check-in comment):

| # | Finding | Ruling | Applied by | Changeset |
|---|---|---|---|---|
| 1 | ... | fix / defer / reject | code-writer | cs:N |

Zero findings is a valid, good review — say so plainly rather than manufacturing a finding.

Length: on the slim profile, budget roughly 150 words per numbered finding — the claim, the
decisive evidence, the fix, nothing else. The full profile has no budget: at G2 the human is
weighing evidence, not scanning.

---

## Related Skills

- **refactoring** — composes with this skill: the angles find the issue, `refactoring` carries the
  fix pattern that `code-writer` executes.
- **test-driven-development** — follows: the CHECK step runs the bound verification battery, and a
  confirmed correctness finding is worth a regression test before the fix.
- **security-scan** — the optional security angle in step 2.
- **evidence-ledger** — for recording verdicts and rulings when a review feeds a gate packet.
- **plastic-checkin** — the check-in ceremony the COMMIT step dispatches.
