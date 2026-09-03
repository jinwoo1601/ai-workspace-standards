---
name: handoff
description: >
  Write a focused handoff brief a cold, context-light session can start from — one task, minimal
  state, exact paths, naming the co-unity procedure or skill to invoke. Use when: asked to "write a
  handoff", "prep the next session", "continue this in a new session", "summarize where we are", or
  at a session's end.
version: 0.1.1
scope: co-unity
status: active
owner: pm
last_reviewed: 2026-09-01
prerequisites: none
relates_to:
  - skill: documentation-writing
    type: relates_to
gemini-parity: skip
metadata:
  type: process
  triggers:
    - write a handoff
    - prep the next session
    - continue this in a new session
    - summarize where we are
    - end of session
---

## Context

A handoff brief lets another session start **cold**, with no access to this conversation. The goal is to hand off ONE focused task — not to dump the whole session. Include only what the next session needs to do that task well, and deliberately leave everything else out.

State, not process: the brief carries the *state* the next session needs and *names* the procedure or skill that owns the steps. It never re-transcribes a procedure's own steps — those live in the procedure.

## When to Use

- The human asks for a handoff, a next-session prep, or a "where are we".
- A session is ending mid-track (design or feature) and the work must survive the context boundary.
- A task is being passed to a different session or a different person.

Focus of the handoff: whatever focus the human gave when invoking this skill. If none was given, infer the single most likely next task from where this session left off, and **state that inference in the Objective** so the human can correct it.

## Execution Steps

1. **Pin the focus.** One task. If the human did not name it, infer it and say so in the Objective.
2. **Pull the state.** Read `memory/workflow.md` (the row for the active branch: `branch | track | stage | last changeset | next action`), the recent session logs in `memory/`, and the codex (`docs/codex/`) if the project has one. Cross-check the branch with `cm.exe status --header`. Do not assume state you have not read.
3. **Collect the exact paths** the task touches — process docs under `docs/design/` and `docs/features/`, the code, the bindings in `docs/verification-bindings.md`.
4. **Name the entry point.** Decide which co-unity procedure or skill the next session should invoke: `environment-bootstrap`, `system-design`, `feature-planning`, `feature-implementation`, `feature-review`, or `release-verification`. Name it in Next steps with the state it needs.
5. **Write the brief** into the sections below, dropping any that are genuinely empty rather than padding them.
6. **Emit it as one copy-pasteable fenced block** (see Output Format), then add the one-line usage note outside the block.

### Sections

1. **Objective** — the one task, in a sentence or two. Concrete and verifiable.
2. **Context** — the minimum background needed to understand *why*, plus the workflow state that matters: the active branch, the track, the stage, the last changeset, and any gate status (G0/G1/G2) and design decisions in play.
3. **Current state** — what is already done and what is in progress, so the next session does not redo it.
4. **Key files & locations** — exact paths (with line refs where useful) the task touches.
5. **Constraints & decisions** — locked choices, conventions, and gotchas that must be respected; things NOT to change. Include the gate discipline where a gate is near: *the gate ruling belongs to the human*; *do not proceed on silence, enthusiasm, or a "looks good" about anything other than the gate itself*.
6. **Next steps** — an ordered, concrete starting sequence. **State, not process:** if the next task is a workflow step, this section says "invoke `<procedure or skill>`" plus the state it needs — it never re-transcribes the procedure's own steps.
7. **Open questions** — anything unresolved that needs the human's input, so the new session asks instead of guessing.

Keep it tight and skimmable. Prefer precise paths and names over prose. Do not invent facts to fill a section — if something is unknown, say so. If a piece of state has no binding on disk, report that and stop; never improvise one.

## Output Format

**Produced artifact:** a single copy-pasteable fenced block, emitted in the conversation, that the human pastes as the first message of a new session. Open the block with a one-line instruction to the new session, e.g.:

> You are picking up: `<objective>`. Read the files below, then start at Next steps.

Then the seven sections above, in order, empty ones dropped.

**After the block** (outside it, so it is not part of the handoff): one line on how to use it — start a fresh session and paste the block as the first message.

**Bookkeeping the PM records:** the handoff does not change the workflow stage. If the `memory/workflow.md` row for this branch is stale, say so in the brief and record the correction — the PM writes the row. **Commit only when the human asks**, via the `vc-checkin` persona (Plastic SCM; new files must be added before checkin — that is `vc-checkin`'s job); a bookkeeping commit is always a separate changeset from work commits.

If the human asks for the brief on disk rather than in conversation, write it under `memory/reports/<YYYY-MM-DD>-handoff-<slug>.md` and report the path.

## Related Skills

- **`documentation-writing`** (common) — general prose and structure conventions.
- **`system-design-doc`**, **`feature-requirement-doc`**, **`architecture-doc`** — the doc-authoring skills a handoff most often points the next session at.
- **`decision-record`** (common) — if the session produced a gate-moment decision, it belongs in a `docs/decisions/DEC-*.md` record (distinct from design ADRs under `docs/design/<topic>/decisions/`), and the handoff cites it rather than restating it.
- **`plastic-checkin`** — the checkin ceremony the handoff points at when uncommitted work must be carried across the boundary.
