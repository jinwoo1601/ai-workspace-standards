---
type: architecture
feature: <kebab-name>
topic: <combat | navigation | voice | vr-ux | art | narrative | audio — project-defined>
status: draft
updated: <YYYY-MM-DD>
sources:
  - docs/features/<feature>/requirements.md
  - <docs/design/<topic>/<design-doc>.md, docs/design/<topic>/decisions/adr-NNNN-<slug>.md>
  - "<project source path> — the code this builds/touches"
---

# <Feature Name> — Architecture

<!-- This is the HOW for the feature, AND the draft of the eventual codex system page. Write it in the shape of docs/codex/templates/system-page.md so G2 distills it instead of rewriting it. Document load-bearing decisions + WHY (and the rejected alternative); cite real paths/symbols so drift is detectable; reconcile to AS-BUILT before G2. Follow the project's bound prose/link convention. Delete these guidance comments as you fill each section. -->

<!-- OPENING (one paragraph): what this feature builds, the requirements it realizes, and the one governing architectural driver (often an NFR — the frame budget, comfort, input robustness) that shapes the design below. -->

## What this implements

<!-- Optional but powerful: a table mapping each requirement / locked design decision → the code work → the section here that covers it. Makes coverage legible and flags verify-only vs new-code items. -->

| Requirement / decision | Code work | Section |
|---|---|---|
| <F1 / design decision> | <what gets built> | <§ below> |

## Context & scope

<!-- → distills into the codex page's "Purpose & responsibilities". Where this sits in the existing system; what it owns and what it deliberately does not; the existing systems/assemblies it touches. Align with the house patterns the project context and existing code state — cite what you reuse. -->

## Decision register

<!-- The heart, and what distills into "Design intent". The load-bearing, costly-to-reverse choices — each: the decision, WHY, and the rejected alternative kept on record. (Inline here — a feature has no separate ADR files; only design ADRs live under docs/design/<topic>/decisions/.) -->

- **<Decision A — short name>.** <Chosen approach.> *Why:* <rationale — the requirement/constraint it serves>. *Rejected:* <the alternative and why it loses>.

## Components & responsibilities

<!-- → "Key types / components". Each class/system/object with ONE clear responsibility and how they collaborate. Cite intended/real paths + symbols. Treat as drift-prone. -->

- `<TypeOrFile>` — <role>. Cite: `<project source path>` (`Symbol`).

## Data contract & runtime flow

<!-- → "How it works". The data crossing the seams (events, data-asset schemas, per-frame structs, serialized/save state) AND the runtime flow: what happens per command / per frame, update vs fixed-step placement, lifecycle, state machine. A reader should trace input → resolution from here. -->

## Non-functional realization

<!-- How the §5 (requirements) NFRs are MET structurally — not restated, realized. The frame budget (allocation pattern, pooling, jobs, caps & budgets), comfort, pipeline reuse, and any structural law the project binds (e.g. a rendering/layer discipline). In VR this often drives the whole design. -->

## Build plan

<!-- The persisted planning output (otherwise lost at session end — the plan does not exist until persisted). Each persisted plan sits under a dated `### Phase <id> — persisted plan (YYYY-MM-DD)` sub-heading. Ordered phases, LOWEST-RISK-FIRST, each passing the bound compile gate in docs/verification-bindings.md and ideally independently shippable. Prototype the riskiest/visual parts first as a throwaway prototype in the project's uncontrolled scratch area. Flag editor-only assets the build needs — code cannot create them. -->

- **Phase 0 — <lowest-risk first>.** <scope; verify: the bound compile gate + ...>
- **Phase 1 — ...**
- **Editor-only assets the build needs (flag for the team):** <meshes, materials, prefabs, serialized wiring>.

## Risks, tradeoffs & open questions

<!-- The fragile parts, load-bearing assumptions, deferred work, drift watch. Honest beats tidy. -->

## As-built deltas

<!-- Fill AFTER implementing: where the build diverged from the plan/decisions above. This is what keeps the doc honest before it is distilled into the codex. (Empty while still planning.) -->

## Related

<!-- Dense list of links (per the project's bound link convention): the requirements doc, the design docs/ADRs, the code and codex pages this couples to. -->
