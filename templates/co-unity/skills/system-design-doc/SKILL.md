---
name: system-design-doc
description: >
  Author a system design doc at `docs/design/<topic>/<system>.md` — a model plus the dynamics it
  produces, locked at G1 — or resolve a design fork into a design ADR. Use when: a design topic
  starts, a contested fork needs an ADR, or an as-built system needs reverse-documenting.
version: 0.1.2
scope: co-unity
status: active
owner: architect
last_reviewed: 2026-09-01
prerequisites: G0 done — a `design-<topic>` branch exists and its scope is agreed with the human
relates_to:
  - skill: feature-requirement-doc
    type: enables
  - skill: decision-record
    type: composes_with
  - skill: documentation-writing
    type: relates_to
gemini-parity: skip
metadata:
  type: process
  triggers:
    - system design doc
    - design a system
    - design fork
    - design adr
    - reverse-document a system
    - what belongs in the design doc
---

## Context

A system design doc specifies **one gameplay or UX system** — a damage model, a waypoint system, a voice grammar, a seated cockpit terminal — as a **model**, and argues the **dynamics** that model produces: the emergent play the rules create, and why that play delivers the experience the project's pillars promise.

It is the *earliest* doc in the Design & Build Workflow — a **design-track** doc authored at `docs/design/<topic>/<system>.md` on a `design-<topic>` branch and **locked at G1**, upstream of the feature-requirement doc (the buildable contract) and the architecture doc (the how).

The anchor idea, and the test of every line:

> **Specify the model; argue the dynamics. The design *intent* is what G1 locks — the numbers are provisional.**

A doc that only *describes mechanics* and never reasons about what *emerges* from them is a rulebook, not a design. The value is the argument that *these rules → this play → the pillar's promised feeling*. So the test of every line is: *is this a decision you could lock at G1, and would it survive the numbers being tuned later?* If the line is really a number, defer it to the project's balance pass. If it is an implementation choice, it belongs in the architecture doc. If it is a buildable acceptance check, it belongs in requirements. Everything that stays is model, dynamics, or a resolved fork.

## When to Use

Trigger: the design track for a system is active. Before drafting, confirm:

- **You are on a `design-<topic>` branch** (G0 done — the branch exists, scope agreed), never on `main`. Check with `cm.exe status --header`.
- **This is docs, not code.** Design precedes implementation. Do **not** scaffold, move, or edit code in this phase, even to "set things up" — treat that as a hard line.
- **You will not cross G1 on your own judgment.** "Locked" is the human's call. You draft, explore forks, and hold the bar; the human signs off. *The gate ruling belongs to the human.* *Do not proceed on silence, enthusiasm, or a "looks good" about anything other than the gate itself.*

Also use it to **reverse-document an as-built system** into a design-of-record, and to **resolve a contested fork into a design ADR**.

### What the system derives from

Unlike a requirements doc (which derives from *locked* design), a system design doc derives from the **layer above it**:

1. **The pillars.** The load-bearing design pillars the system must serve, and that conflicts resolve in favour of — the project's design pillars, named in the topic hub `docs/design/<topic>/README.md` or the project context. Open by naming which pillar(s) this system carries; a `pillar-N` tag marks it.
2. **The parent hub / source.** The topic's overview doc and the relevant section of any imported source material. Where the source numbers its sections, trace to that number.
3. **Already-locked sibling systems.** A new system must stay consistent with the locked decisions of the systems it couples to. Read them first; cite them.

Read those fully before drafting. A mechanic with no parent pillar is flavour or scope creep — surface it, do not paper over it.

## Execution Steps

1. **Orient.** Read `memory/workflow.md` (one row per active branch) and cross-check `cm.exe status --header`. Confirm the design topic, the branch, and the agreed scope.
2. **Gather the parents.** Read the pillars, the parent hub / source section, and the locked sibling docs this system couples to — in full.
3. **Draft against the skeleton.** Copy `assets/design-doc-template.md` to `docs/design/<topic>/<system>.md` and fill it. Order the middle sections to fit the system; keep the top `> **What's decided.**` callout and the two fixed bookends (`## Status / openness`, `## Related`).
4. **Apply the quality bar** (below). For the hard parts — arguing the dynamics, killing degenerate strategies, keeping numbers out of the model — read `references/quality-bar.md` for worked good/bad examples and the altitude-stack table.
5. **Resolve forks into ADRs.** A genuine fork (a contested decision with real tradeoffs) gets a design ADR at `docs/design/<topic>/decisions/adr-NNNN-<slug>.md` — copy the shape of `docs/codex/templates/decision-record.md` with `topic:` in place of `domain:` (as its footnote says); the common `decision-record` skill writes gate-moment DEC records, not design ADRs. Create `decisions/` **lazily** (on the topic's first ADR). **Check the highest existing ADR number on disk first** — concurrent sessions share the sequence; never reuse a number. For meaty or contested forks, run independent panels (an adversarial red-team pass and/or a fresh-derivation pass) and synthesise — convergence across independent passes is strong signal. For a *visual* fork, build a throwaway prototype in the project's uncontrolled scratch area rather than arguing look in prose.
6. **Surface forks, do not railroad.** Where a decision is genuinely open, lay the tradeoff out in prose and let the human make the call — do not force a picker, do not silently pick. Park unresolved unknowns in `## Status / openness`; the downstream docs inherit them.
7. **File and report the bookkeeping** (see Output Format).

## The quality bar

Every system design doc must clear these. (Expanded, with good/bad examples: `references/quality-bar.md`.)

1. **Traced to a pillar — open by naming the feeling it serves.** Every system exists to deliver part of the project's core fantasy; state which pillar(s) up front. A system with no pillar is flavour or scope creep.
2. **The decision space is the heart.** A system is interesting because of the *decisions* it puts in front of the player. Enumerate them — the choice, the information the player has when choosing, the opportunity cost, why no option dominates. No interesting decision → it is not a system.
3. **Model altitude — not numbers, not implementation.** Specify the *model* (state, rules, how a hit / turn / order resolves). Defer the **numbers** to the balance pass and flag them provisional. Defer **implementation** (classes, components) to the architecture doc. Defer the **buildable acceptance check** to requirements. A good design survives all three being filled in later.
4. **Argue the dynamics — and war-game them.** Reason forward from the rules to the emergent play. Then attack your own rules: where is the dominant strategy, the degenerate loop, the dead zone — and the rule that kills each? Anti-degeneracy is first-class here; a contested one earns its own ADR.
5. **Draw the boundaries — own / couple / hand off / explicitly do not decide.** State what this system owns, what it consumes from siblings, what it pushes elsewhere, and what it deliberately does *not* decide. Naming the non-decisions keeps each doc independently lockable and stops one system silently deciding another's.
6. **Cash the model out into the experience.** Close the loop: this model → this play → the pillar's promised feeling. If you cannot say what playing it right *feels* like, the dynamics argument is not finished.
7. **Forks recorded as ADRs.** Every contested decision points to its `adr-NNNN`; the keystone fork gets its own. Keep the rejected branch and *why it lost* — that is what lets a later contradiction reopen the design intelligently instead of guessing which assumption broke.
8. **Right-sized, and honest about openness.** A few screens, not a spec. Mark the locked skeleton (the `> What's decided` callout), flag every number provisional, and end with the open items and forward dependencies you did *not* resolve.

**Smell tests:** describes rules but never what emerges → rulebook; add the dynamics. A number presented as decided → move it to the balance pass. Names a class → architecture, not design. No pillar cited → unparented. No degeneracy analysis → unstress-tested. No non-decisions / hand-offs → unscoped.

## Filing

- **Location:** `docs/design/<topic>/<system>.md`, kebab-case, one system per page. `topic:` vocabulary is project-defined; the default taxonomy mirrors the codex domains, with gameplay leaves such as `combat`, `navigation`, `voice`, plus `vr-ux`, `art`, `narrative`, `audio`. Design ADRs live at `docs/design/<topic>/decisions/adr-NNNN-<slug>.md`.
- **Prose / link convention:** follow the project's bound prose and link convention. A project that reads its docs in a wikilink-aware tool may bind `[[bare-filename]]` links and soft-wrapped paragraphs (one logical line per paragraph or list item); otherwise use standard markdown with relative links. Paths are project-root-relative; dates are absolute, never "today".
- **Do NOT touch the codex.** `docs/codex/**` — its pages, `index.md`, and `log.md` — is the **post-G2 as-built layer**; writing there now is a layer violation. Design docs are process docs. (Cross-*linking* to a codex page is fine; never create or edit codex pages from here.)
- **Commit only when the human asks**, via the `vc-checkin` persona (Plastic SCM; new files must be added before checkin — that is `vc-checkin`'s job). Concurrent sessions share the ADR sequence — re-check the highest ADR number on disk before appending.

## Collaborative discipline

The human owns the lock (G1) and the hard design calls; you draft, explore forks, surface tradeoffs in prose, and hold the bar. Never invent a mechanic no pillar supports, or assert a number as decided (numbers are provisional → the balance pass). Mark anything not yet built `(design intent, not yet built)`. **Once a design is locked at G1 it is immutable** — if drafting a coupled system reveals a locked sibling decision is wrong, **stop**: reopen that design on a design branch, amend it, re-lock (G1 again). Never silently patch a locked decision from a neighbouring doc. *Nothing crosses G1 or G2 on the assistant's judgment.*

## Output Format

**Produced file:** `docs/design/<topic>/<system>.md` (plus, for each contested fork, `docs/design/<topic>/decisions/adr-NNNN-<slug>.md`).

**After G1 (the backlog step of the `system-design` procedure):** `docs/design/<topic>/backlog.md` — one line per buildable feature, `- <feature-kebab-name> — <one-line scope>`, derived only from the locked design. The backlog is the input to `feature-planning` and is checked in with the design doc and its ADRs.

**Frontmatter:**

```yaml
---
type: system        # system (a designed mechanism) | concept (a cross-cutting tension/legibility model) | overview (a topic hub)
topic: combat       # project-defined; default: a gameplay leaf (combat | navigation | voice) or a domain (vr-ux | art | narrative | audio)
tags: [kebab, tags, pillar-N]
status: draft       # draft while designing; stable only for an as-built design-of-record reverse-documented from shipped code
updated: YYYY-MM-DD # absolute date, never "today"
sources:
  - docs/design/<topic>/README.md (§N — the parent section)
  - docs/design/<topic>/decisions/adr-NNNN-<slug>.md
  - "Session direction YYYY-MM-DD (...)"
---
```

**Body:** the sections of `assets/design-doc-template.md`, ending with `## Status / openness` then `## Related`.

**Bookkeeping the PM records:** report the stage to advance to — design track, stage `design-doc` (pre-G1); after the human's G1 ruling, `locked(G1 <date>)`, then `backlog` once the feature backlog is written to `docs/design/<topic>/backlog.md`. The PM writes the row (`branch | track | stage | last changeset | next action`) into `memory/workflow.md`. The skill reports the stage; it never edits that file itself.

**Report back:** the file path(s) written, the ADR numbers claimed, the stage to advance to, and the open forks the human still has to rule on.

## Related Skills

- **`feature-requirement-doc`** — the next doc downstream; requirements derive from *locked* design and never invent it.
- **`architecture-doc`** — two floors down; owns components, contracts, and the persisted build plan.
- **`decision-record`** (common) — writes **gate-moment** records at `docs/decisions/DEC-*.md`. Those are *different* from the design ADRs this skill files under `docs/design/<topic>/decisions/`: DEC records capture a workflow/governance decision at a gate moment; design ADRs capture a resolved design fork inside a topic.
- **`documentation-writing`** (common) — general prose and structure conventions.
- **`codex`** — the post-G2 as-built layer. Off-limits during the design track.
