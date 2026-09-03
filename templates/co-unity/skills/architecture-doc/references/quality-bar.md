# The quality bar — worked examples

Read this while drafting the hard parts of an architecture doc: holding the right altitude, realizing the VR non-functionals, and writing so the doc *distills* into the codex page instead of being rewritten. It expands the eight principles from `SKILL.md`, each with a good/bad pair.

> The examples below are illustrative of **form**, not authoritative architecture. They use generic game examples — a damage model, a waypoint/system-map renderer, a voice-designation feature. Re-read the live code before relying on any cited symbol; code is the source of truth and it drifts.

## Contents
- The anchor
- The altitude stack — where the architecture doc sits
- Drafting toward the codex page — the distillation map
- 1. Drafted toward the codex page
- 2. Load-bearing decisions, with the rejected alternative
- 3. Right altitude
- 4. Contracts and flow are the spine
- 5. Non-functional realization
- 6. Cite real paths, symbols, changesets
- 7. The build plan lives here
- 8. Honest about risk & as-built drift
- Smell tests

## The anchor

Every line earns its place by answering: *would this still be true, and worth keeping, on the as-built codex page after the feature ships?* If it is trivia the code already states, or a signature that will churn, leave it out. If it is a load-bearing decision, a seam, a flow, or an NFR realization — it stays, cited and reconciled to as-built. The architecture doc is the codex page written early; treat it that way.

## The altitude stack — where the architecture doc sits

The architecture doc is the **bottom floor** — the only one that touches code and the only one that becomes a codex page. Using armour as the worked example across all four floors:

| Floor | Doc | Armour example |
|---|---|---|
| Model + dynamics + forks | system design doc | "Armour is sectioned, directional; type-% reduction then a gate. Produces three kill-roads + a finite aggression window." |
| Numbers / tuning | the project's balance pass | "−30% / −10% / −50%; ~3 missiles / ~2 railgun rounds." |
| Buildable, testable contract | feature requirement doc | "A breached facing exposes the module behind it. *Verify:* called-shot through a broken plate." |
| **How it is built** | **architecture doc** *(this)* | "`ArmourSection` holds per-facing health in a struct array (no per-hit garbage); `DamageResolver` applies type-% then gates internals; resolved in the fixed step off the hit-event queue." |

Stay on your floor: numbers belong to the balance pass, the acceptance check to requirements. The architecture doc owns components, contracts, flow, NFR realization, and the plan.

## Drafting toward the codex page — the distillation map

A good architecture doc is shaped so each section folds into `docs/codex/templates/system-page.md` at G2. Build it knowing where each part lands:

| Architecture doc (process, build-time) | Distills into → `docs/codex/code/` system page (post-G2) |
|---|---|
| Opening + Context & scope | one-paragraph summary + **Purpose & responsibilities** |
| Decision register (decisions + rejected alts) | **Design intent** (trimmed to what survives) |
| Components & responsibilities | **Key types / components** (cited) |
| Data contract & runtime flow | **How it works** |
| Non-functional realization | **How it works** / constraints (caps & budgets; the project's rendering law) |
| Build plan & sequencing/risk | mostly **trimmed** (build scaffolding) — a one-line build trace may remain |
| Risks · As-built deltas | **Open questions / TODO**, folded into How it works as as-built |
| Related | **Related** |

If a section has nowhere to land on that map, ask whether it belongs in the doc at all.

## 1. Drafted toward the codex page

- ❌ A scratch build-guide: "TODO: make the armour thing. Steps: 1) add class 2) hook up 3) test." *(throwaway — post-G2 the codex page gets written from scratch anyway)*
- ✅ Sections named and shaped like the codex system page (Purpose & responsibilities, Key types/components, How it works, Design intent), so distillation is a trim, not a rewrite. The best architecture docs *become* their codex page: same content, annotated with as-built deltas.

## 2. Load-bearing decisions, with the rejected alternative

- ❌ "Bodies and waypoints are unified into one indexed list." *(states the what; no why, no alternative — nothing to evaluate or reopen)*
- ✅ "**Positional alignment** — the form list is built 1:1 with the waypoint list, so `WaypointForms.Count == Waypoints.Count` by construction. *Why:* it makes the no-drift invariant *structural*. *Rejected:* an explicit `int WaypointIndex` link (keeps the dual-list drift it is meant to kill); a single merged struct (re-emits static geometry every frame, defeating the built-version gate)."

Record these inline in the decision register — a feature has no separate ADR files; only design forks get ADRs, under `docs/design/<topic>/decisions/`. The rejected branch is what lets a later contradiction reopen the call from the reasoning.

## 3. Right altitude

- ❌ A paragraph walking every method of the body instancer line by line. *(a duplicate of the code that rots on the next edit)*
- ✅ "`SceneryBodyInstancer` draws bodies by *form* bucket (Sphere / Star / Octa / Ring / Rock) via instanced mesh rendering, gated by a built-version counter so geometry rebuilds only when the system version changes." *(the organizing shape + the one non-obvious invariant — not the line-by-line)*

Pick the level: context → components → only the load-bearing code detail. Let the code speak for the rest.

## 4. Contracts and flow are the spine

The seams matter more than the internals.

- ✅ **Contract:** "Two read-only surfaces: a per-frame status-struct source and an immutable per-system geometry source. The renderer reads both by the same index `i`."
- ✅ **Flow:** "Sustained state (the commit highlight) lives in polled own-ship state, **not** an event — the event bus is for one-shot effects; persistent 'while-active' state is polled." *(a real flow/ownership decision, with the rule that decides it)*

A reader should trace a command from producer → contract → renderer without opening the code. Where the project's context names a house pattern — a layering rule such as Contract → Producer → Renderer, or an event-bus-vs-poll rule — cite it rather than restating it; those two are illustrative of the *kind* of rule to cite, not a fixed list.

## 5. Non-functional realization

In VR the NFRs from the requirements doc *drive* the architecture — so show them *met*, structurally, not restated.

- ❌ "The map will hold the frame budget." *(a restated requirement, not an architecture)*
- ✅ "The requirement that the projection emits no light into the world is enforced **structurally**: the overlay renders on a dedicated overlay camera whose culling mask is the overlay layer only, that layer is stripped from the main headset camera and reflection probes, and post-processing is off on the overlay — so glowing geometry *cannot* light the room or feed bloom." *(an illustrative rendering-law realization)*
- ✅ "Per-facing armour state is a struct array, not a class graph — zero per-hit allocation; budget headroom tracked in the caps table."

## 6. Cite real paths, symbols, changesets

- ✅ "`Contract/Enums.cs` · `BodyForm` (renamed from `BodyClass`, cs:NN → cs:NN)"; "baked via the editor-only context-menu asset-database pattern on the instancer."

Code is primary and moves; cited symbols make drift *detectable* on review (`⚠️ drift: <what changed>`). Document slow-drifting rationale heavily, fast-drifting signatures lightly. Cite the changeset as `cs:NN` — Plastic changeset numbers are how a reviewer pins the base revision.

## 7. The build plan lives here

Persist the planning output — it is otherwise lost at session end, and the plan does not exist until it is persisted.

- ✅ "Ordered lowest-risk-first, each phase passing the bound compile gate in `docs/verification-bindings.md` and shippable: **Phase 0** contract refactor, *zero visual change* (broadest diff, review as a pure refactor); **Phase 1** selection plumbing (trivial); **Phase 2** solid glowing bodies — the visual heart and riskiest: **prototype first** in the project's uncontrolled scratch area, then shaders + bakes; **Phase 3** stalk migration; **Phase 4** commit effects + legend (polish, last). **Editor-only assets to flag:** the glow shader + material, the baked meshes, the serialized wiring — code cannot create them."

Riskiest/visual parts get a throwaway prototype first; editor-only assets get flagged because code cannot author them.

## 8. Honest about risk & as-built drift

- ✅ **Risk (before build):** "Riskiest sub-items: the rim highlight reading well with post-processing off (prototype first); ~90 lit instanced spheres against the standalone-headset budget."
- ✅ **As-built delta (after build):** "The glow shader has **no terminator** — the plan called for a lambert term against a fixed sun; the prototype settled on flat per-nature tint plus a self-contained rim. Simpler, still satisfies the non-luminous rule."

The doc that reaches G2 must describe what was *actually built* — it is about to be distilled into the codex. Reconcile before you distill.

## Smell tests

- Transcribes the code method-by-method → it is a duplicate; document the *why* and the shape.
- Lists components with no rationale → nothing to evaluate or reopen; add the decision + rejected branch.
- No NFR realization → in VR that *is* the architecture; show how the budget, comfort, and rendering law are met.
- Reads like scratch scaffolding, not a codex page → it will not distill; shape it toward `docs/codex/templates/system-page.md`.
- Uncited or vague → drift-blind; cite paths + symbols (+ `cs:NN`).
- A plan with no risk ordering → sequence lowest-risk-first; prototype the riskiest part early.
- A separate `decisions/` folder for the feature → architectural decisions go *inline*; only design ADRs live under `docs/design/<topic>/decisions/`.
