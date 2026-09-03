---
name: architecture-doc
description: >
  Author or revise a feature's architecture doc at `docs/features/<feature>/architecture.md` —
  components, data contracts, runtime flow, and the persisted build plan — or reconcile it to
  as-built before G2. Use when: the requirements doc is done and the build design begins, the
  plan needs persisting, or the doc must be reconciled before acceptance.
version: 0.1.1
scope: co-unity
status: active
owner: architect
last_reviewed: 2026-09-01
prerequisites: the feature's requirements doc exists on the same `feat-<feature>` branch
relates_to:
  - skill: feature-requirement-doc
    type: follows
  - skill: codex
    type: relates_to
  - skill: documentation-writing
    type: relates_to
gemini-parity: skip
metadata:
  type: process
  triggers:
    - architecture doc
    - how do we build this
    - build plan
    - persist the plan
    - reconcile to as-built
    - data contract and runtime flow
---

## Context

An architecture doc specifies **how one feature is built** — the components, the data contracts, the runtime flow, the non-functional realization — and **holds the implementation plan**. It answers the one question the design and requirements docs refuse to (both say "names a class → that is the architecture doc"). It sits on the `feat-<feature>` branch, written *after* the requirements doc, and feeds **G2**.

It has two mandates a generic architecture doc does not, and they shape everything:

> **Write the architecture doc as the as-built page it will become.** It is the *how* to the requirements doc's *what* — and the **only one of the three process docs that crosses into the codex** (`docs/codex/code/`) at G2, by *distillation* rather than rewrite. It also **holds the build plan**: planning output evaporates at session end, so the implementation plan is persisted here. The plan does not exist until it is persisted.

The test of every line: *would this still be true, and worth keeping, on the as-built codex page after the feature ships?* So document the **load-bearing decisions** (the ones costly to reverse) with their rejected alternatives; cite real paths and symbols so drift is detectable; and reconcile the doc to **as-built** before G2. Trivia the code already states, exact signatures that churn, throwaway scaffolding — leave out or expect to trim. The code is the source of truth; this doc records how it is organized and *why*.

## When to Use

Trigger: a feature's architecture/implementation design begins (after its requirements). Before drafting, confirm:

- **You are on the `feat-<feature>` branch** (the same branch as the requirements doc), never on `main`. Check with `cm.exe status --header`.
- **The requirements doc exists.** Architecture *realizes* the requirements — the §4 functional requirements and §5 NFRs are its inputs. If they are missing, write them first (that is the `feature-requirement-doc` step).
- **This is still the docs phase — but implementation is the next step.** Author the architecture and the plan *before* you start coding; do not jump ahead and scaffold mid-authoring. (Unlike design and requirements, where code is far off, here you implement immediately after — so the doc is written as *intended* architecture, then reconciled to **as-built** before G2.)

Also use it for the **as-built reconciliation pass** before G2, and to **persist a build plan** that would otherwise be lost.

### What the architecture derives from

1. **The requirements doc** — the buildable contract this realizes. Every component traces to a requirement it serves; the §5 NFRs (frame budget, comfort, input robustness) are architectural drivers, not footnotes.
2. **The locked design docs / design ADRs** under `docs/design/` — the model and its rationale. The architecture is how that model meets engine and platform reality.
3. **The existing codebase** — the *primary source of truth*. Read the code you will touch and the patterns it already uses; align with the house patterns the project context and existing code state, and **cite what you reuse**. Do not reinvent a pattern the codebase already has.

## Execution Steps

1. **Orient.** Read `memory/workflow.md` (one row per active branch) and cross-check `cm.exe status --header`. Confirm the feature, the branch, and that requirements exist.
2. **Gather the inputs.** Read the requirements doc, the design docs / ADRs it realizes, and the live code you will touch. Where recon reports exist (a code inventory, a doc extract), read them first.
3. **Draft against the skeleton.** Copy `assets/architecture-template.md` to `docs/features/<feature>/architecture.md` and fill it. Shape it toward the codex system page (`docs/codex/templates/system-page.md`); keep the `## Related` bookend.
4. **Apply the quality bar** (below). For the hard parts — keeping the right altitude, realizing the NFRs, drafting so it distills cleanly — read `references/quality-bar.md` for worked good/bad examples, the **altitude stack**, and the **arch-doc → codex-page** distillation map.
5. **Plan, then persist the plan.** Plan the implementation, then write the result into the doc's **Build plan** section under a `### Phase <id> — persisted plan (YYYY-MM-DD)` sub-heading (the section `plan-validator` is pointed at) — ordered phases, lowest-risk-first, each passing the bound compile gate in `docs/verification-bindings.md` and ideally independently shippable. Prototype the riskiest or most visual parts first as a throwaway prototype in the project's uncontrolled scratch area. Flag editor-only assets the build needs (meshes, materials, prefabs, serialized wiring) — code cannot create them.
6. **Implement, then reconcile to as-built.** After building, update the doc where the build diverged from the plan — an **As-built deltas** pass. The doc that reaches G2 must describe what was *actually built*, because it is about to be distilled into the codex.
7. **File and report the bookkeeping** (see Output Format).

## The quality bar

Every architecture doc must clear these. (Expanded, with good/bad examples and the distillation map: `references/quality-bar.md`.)

1. **Drafted toward the codex page.** Write it in the shape of the `docs/codex/code/` system page it becomes (Purpose & responsibilities · Key types/components · How it works · Design intent · Open questions), so G2 means *distill*, not *rewrite*.
2. **Load-bearing decisions, with the rejected alternative — recorded inline.** Spend words on the choices costly to reverse (state ownership, the seams, event-vs-poll, update-loop placement, assembly boundaries) and *why this over the obvious alternative*. Record them inline in a decision register — **not** as separate ADR files; a feature has just `requirements.md` + `architecture.md`.
3. **Right altitude — context → components → only load-bearing code detail.** Do not transcribe the code method-by-method (it rots and duplicates the source of truth); do not stay so vague it constrains nothing. Pick the level and hold it.
4. **Contracts and flow are the spine.** The data crossing the seams (events, data-asset schemas, per-frame structs, serialized/save state) and the runtime flow (per-command, per-frame, update vs fixed-step, lifecycle, state machine). A reader should trace input → resolution without opening the code.
5. **Non-functional realization is first-class — VR makes it load-bearing.** Show how the frame budget, allocation, jobs, and comfort are *met* structurally (struct arrays over class graphs, pooling over per-frame instantiation, the camera/layer discipline the project's rendering law requires). A clean object design that allocates every frame is *wrong* here.
6. **Cite real paths, symbols, changesets — make drift detectable.** Code is primary and moves; cite the real script path + the symbol (+ `cs:NN` for the changeset). Document slow-drifting rationale heavily, fast-drifting signatures lightly.
7. **The build plan lives here — sequenced, risk-first, verifiable.** Persist the planning output (it is otherwise lost): ordered phases, lowest-risk-first, each passing the bound compile gate; riskiest/visual parts prototyped first; editor-only assets flagged.
8. **Honest about risk, tradeoff, and as-built drift.** Name the fragile parts, the assumptions, the deferred work — and after building, record where the build diverged (As-built deltas). Honest beats tidy: the codex page must describe what was built.

**Smell tests:** transcribes the code method-by-method → it is a duplicate; document the *why* and the shape. Lists components with no rationale → nothing to evaluate or reopen. No NFR realization → in VR that *is* the architecture. Reads like scratch scaffolding, not a codex page → it will not distill. Uncited or vague → drift-blind. A plan with no risk ordering → sequence it lowest-risk-first.

## Filing

- **Location:** `docs/features/<feature>/architecture.md`, beside `requirements.md`.
- **Prose / link convention:** follow the project's bound prose and link convention. A project that reads its docs in a wikilink-aware tool may bind `[[bare-filename]]` links and soft-wrapped paragraphs (one logical line per paragraph or list item); otherwise use standard markdown with relative links. Paths are project-root-relative; dates are absolute.
- **Do NOT touch the codex — it is the post-G2 as-built layer; writing there now is a layer violation.** The architecture doc is a process doc until G2. The **distillation into `docs/codex/code/` happens after the human's G2 ruling** and is a *separate* step owned by the `codex` skill and the `codex-reconcile` persona — not part of authoring this doc. (Cross-*linking* to a codex page is fine.)
- **Commit only when the human asks**, via the `vc-checkin` persona (Plastic SCM; new files must be added before checkin — that is `vc-checkin`'s job).

## Collaborative discipline

The human owns acceptance (G2) and the hard build calls; you draft, surface tradeoffs, and hold the bar. Match the existing code's patterns and style even where you would do it differently — every documented decision should trace to a requirement or a real constraint, not a preference. If building reveals the requirements (or the locked design behind them) are wrong, **stop**: a requirements error is a requirements-doc fix on this branch; a design error means reopening the design on a design branch and re-locking (G1 again). Never silently paper over the contradiction in the architecture doc. *Preflight PASS is not acceptance.* *Nothing crosses G1 or G2 on the assistant's judgment.*

## Output Format

**Produced file:** `docs/features/<feature>/architecture.md`, including the persisted build plan under `## Build plan`.

**Frontmatter:**

```yaml
---
type: architecture
feature: <kebab-name>
topic: combat | navigation | voice | vr-ux | art | narrative | audio   # project-defined vocabulary
status: draft              # draft while building; reconcile to as-built before G2
updated: YYYY-MM-DD        # absolute date, never "today"
sources:
  - docs/features/<feature>/requirements.md
  - docs/design/<topic>/<design-doc>.md
  - docs/design/<topic>/decisions/adr-NNNN-<slug>.md
  - "<project source path> — the code this builds/touches"
---
```

**Body:** the sections of `assets/architecture-template.md` — What this implements · Context & scope · Decision register · Components & responsibilities · Data contract & runtime flow · Non-functional realization · Build plan · Risks, tradeoffs & open questions · As-built deltas · Related.

**Bookkeeping the PM records:** report the stage to advance to — feature track, `architecture` when the doc is drafted, `plan` once the build plan is persisted, then `implement`. The PM writes the row (`branch | track | stage | last changeset | next action`) into `memory/workflow.md`. The skill reports the stage; it never edits that file itself.

**Report back:** the file path written, whether the build plan is persisted, the editor-only assets flagged for the team, the riskiest phase and how it is de-risked, and (on the reconciliation pass) the as-built deltas recorded.

## Related Skills

- **`feature-requirement-doc`** — the upstream doc; its §4 requirements and §5 NFRs are this doc's inputs.
- **`system-design-doc`** — two floors up; owns the model, the dynamics, and the design ADRs this cites.
- **`codex`** — the post-G2 as-built layer this doc is distilled into by `codex-reconcile`, after the human's G2 ruling.
- **`decision-record`** (common) — writes **gate-moment** records at `docs/decisions/DEC-*.md`. Those are *different* from both the inline decision register in this doc and the design ADRs under `docs/design/<topic>/decisions/`; a feature never gets its own `decisions/` folder.
- **`test-driven-development`** — runs the bound gates each build phase must pass.
- **`documentation-writing`** (common) — general prose and structure conventions.
