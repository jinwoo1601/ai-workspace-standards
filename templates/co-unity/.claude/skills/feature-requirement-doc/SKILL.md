---
name: feature-requirement-doc
description: >
  Author or revise a feature's requirements doc at `docs/features/<feature>/requirements.md` — the
  testable, scoped contract for one buildable feature, written after G1 and before the architecture
  doc. Use when: picking a feature off the locked design, or asked what belongs in requirements or
  acceptance criteria.
version: 0.1.2
scope: co-unity
status: active
owner: architect
last_reviewed: 2026-09-01
prerequisites: the parent design is locked at G1 and a `feat-<feature>` branch exists
relates_to:
  - skill: system-design-doc
    type: follows
  - skill: architecture-doc
    type: enables
  - skill: documentation-writing
    type: relates_to
gemini-parity: skip
metadata:
  type: process
  triggers:
    - requirements doc
    - feature requirements
    - acceptance criteria
    - what belongs in requirements
    - scope this feature
---

## Context

A feature-requirement doc turns one slice of **G1-locked design** into a precise, scoped, testable contract for a single buildable feature — **without deciding how to build it**. It sits in one specific gap in the Design & Build Workflow: *after* the design is locked, *before* the architecture doc (which is the "how", and drafts the eventual codex page).

The anchor idea, and the test of every line you write:

> **The requirements doc is the G2 acceptance checklist, written in advance.**

G2 is "feature accepted — human sign-off." If, at G2, you cannot walk the doc ticking each line against the running game (including the project's bound human-only verification gate — for VR, the in-headset playtest), the doc failed its one job. Everything below follows from that.

## When to Use

Trigger: the implementation track for a feature begins. Before drafting, confirm:

- **The design is locked (G1).** Requirements derive from locked design; they never invent it. If the parent design is not locked, stop — that is a design-track problem, not a requirements one.
- **You are on a `feat-<feature>` branch**, off `main`, never on `main`. Check with `cm.exe status --header`.
- **This is docs, not code.** Requirements (and the architecture doc after them) are written before any implementation. Do **not** scaffold, move, or edit code in this phase, even to "set things up". Treat that as a hard line.

### Where the feature comes from

Candidate features come from the **feature backlog** at `docs/design/<topic>/backlog.md`, produced at the end of the design track (name + one-line scope each) and derived from the locked design docs in `docs/design/`. Step one is to pin down, **with the human**:

1. **Which feature** — its name (kebab-case) and one-line scope.
2. **Its parent design** — the specific design doc(s) and design ADR(s) it derives from. These become the doc's `sources:` and the spine of every requirement.

Read those parent docs **fully** before drafting. A requirement with no parent in locked design is either scope creep or a sign the design is not actually locked — surface it, do not paper over it.

## Execution Steps

1. **Orient.** Read `memory/workflow.md` (one row per active branch) and cross-check `cm.exe status --header`. Confirm the feature, the branch, and that the parent design is locked.
2. **Gather the parent.** Read the locked design doc(s) + design ADR(s) the feature derives from, in full.
3. **Draft against the skeleton.** Copy `assets/requirements-template.md` to `docs/features/<feature>/requirements.md` and fill it section by section.
4. **Apply the quality bar** (below). For the hard parts — making "feel" testable, keeping *how* out of *what* — read `references/quality-bar.md` for worked good/bad examples and the feel→proxy table.
5. **Surface forks and gaps — do not invent.** Where scope, priority, or a requirement's value is genuinely open, lay the tradeoff out in prose and let the human make the call; do not railroad with a picker and do not silently pick. Park unresolved unknowns in the doc's Open Questions section — the architecture doc inherits them.
6. **File and report the bookkeeping** (see Output Format).

## The quality bar

Every requirement must clear these. (Expanded, with good/bad examples: `references/quality-bar.md`.)

1. **Testable — done is observable.** Each requirement has an acceptance check you could run by playing the game. Subjective "feel" targets are allowed *only* once cashed out into an observable proxy.
2. **What and why, never how.** No class, data layout, engine component, or algorithm — a good requirement survives a total re-implementation. Genuine *constraints* (hold the frame budget, reuse the existing voice pipeline) are allowed: they bound the solution, they do not choose it.
3. **Traced upward.** Each requirement cites the locked design doc / ADR it derives from, and the pillar it serves — the project's core fantasy and pillars, named in the topic hub `docs/design/<topic>/README.md` or the project context.
4. **Scoped — non-goals as sharp as goals.** State what the feature does *not* do, what is deferred, and which adjacent systems it touches but does not own.
5. **Prioritized.** Must / Should / Could. The Musts define the minimal G2-acceptable version.
6. **Non-functional requirements are first-class — in VR some are feature-killers.** Frame budget, comfort / motion sickness (a hard constraint, not a nicety), voice/input robustness (phonetic ambiguity, recognition failure, and what the game says when it does *not* understand — never silence), diegesis (must feedback stay in-fiction?), accessibility.
7. **Dependencies and assumptions stated.** What must already exist or be merged first (features are dependency-ordered); what you assume about the player and the rest of the game.
8. **Right-sized and honest about unknowns.** A page or three, not a spec. End with the open questions you did *not* resolve.

**Smell tests:** cannot test it → rewrite it. Names a class → it is architecture, move it to the arch doc. A "feel" word with no proxy → unfinished. No non-goals → unscoped. No upward citation → unparented.

## Filing

- **Location:** `docs/features/<feature>/requirements.md`. Create `docs/features/<feature>/` — if `docs/features/` does not exist yet, this is the project's first feature directory.
- **Prose / link convention:** follow the project's bound prose and link convention. A project that reads its docs in a wikilink-aware tool may bind `[[bare-filename]]` links and soft-wrapped paragraphs (one logical line per paragraph or list item); otherwise use standard markdown with relative links. Paths are project-root-relative; dates are absolute, never "today".
- **Do NOT touch the codex.** `docs/codex/**` is the **post-G2 as-built layer**; writing there now is a layer violation. Requirements are process docs.
- **Commit only when the human asks**, via the `vc-checkin` persona (Plastic SCM; new files must be added before checkin — that is `vc-checkin`'s job).

## Collaborative discipline

The human owns the scope and priority calls; you draft, surface tradeoffs, and hold the bar. Never invent a requirement the locked design does not support. If building *later* reveals a requirement contradicts locked design, **stop** — reopen the design on a design branch, amend it, and re-lock (G1 again); never silently patch the design here. *Nothing crosses G1 or G2 on the assistant's judgment.* *Preflight PASS is not acceptance.*

## Output Format

**Produced file:** `docs/features/<feature>/requirements.md`.

**Frontmatter:**

```yaml
---
type: requirements
feature: <kebab-name>
topic: combat | navigation | voice | vr-ux | art | narrative | audio   # project-defined vocabulary
status: draft
updated: YYYY-MM-DD        # absolute date, never "today"
sources:
  - docs/design/<topic>/<design-doc>.md
  - docs/design/<topic>/decisions/adr-NNNN-<slug>.md
---
```

**Body:** the nine sections of `assets/requirements-template.md` — Feature & scope · Why (player value) · Player-facing behavior · Functional requirements (the numbered, prioritized, checked table) · Non-functional requirements · Non-goals / deferred · Dependencies & assumptions · Acceptance criteria (G2) · Open questions.

**Bookkeeping the PM records:** report the stage to advance to — feature track, stage `requirements`. The PM writes the row (`branch | track | stage | last changeset | next action`) into `memory/workflow.md`. The skill reports the stage; it never edits that file itself.

**Report back:** the file path written, the parent design docs/ADRs cited, the stage to advance to, the Must-count that defines the minimal G2-acceptable feature, and the open questions handed to the architecture doc.

## Related Skills

- **`system-design-doc`** — the upstream doc; this one derives from its G1-locked output and never invents design.
- **`architecture-doc`** — the next doc downstream; it realizes these requirements and holds the persisted build plan.
- **`decision-record`** (common) — writes **gate-moment** records at `docs/decisions/DEC-*.md`. Those are *different* from the design ADRs under `docs/design/<topic>/decisions/` that this doc cites as sources.
- **`documentation-writing`** (common) — general prose and structure conventions.
- **`test-driven-development`** — downstream, turns the §4 acceptance checks into the bound verification battery.
