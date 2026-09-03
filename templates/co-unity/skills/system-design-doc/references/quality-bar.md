# The quality bar — worked examples

Read this while drafting the hard parts of a system design doc: arguing the *dynamics* a model produces, war-gaming your own rules against degeneracy, and keeping *numbers* and *implementation* out of the *model*. It expands the eight principles from `SKILL.md`, each with a good/bad pair.

> The examples below are illustrative of **form**, not authoritative design. They use a generic game example — a damage model over a sectioned armour layer — so the *shape* of a good line is visible. When you cite a real doc in your project, re-read it first: design moves, and a locked decision may have been revised.

## Contents
- The anchor
- The altitude stack — model vs numbers vs requirements vs implementation
- 1. Traced to a pillar
- 2. The decision space is the heart
- 3. Model altitude
- 4. Argue the dynamics — and war-game them
- 5. Draw the boundaries
- 6. Cash out into the experience
- 7. Forks recorded as ADRs
- 8. Right-sized & honest
- Smell tests

## The anchor

Every line earns its place by answering: *is this a decision you could lock at G1, and would it survive the numbers being tuned later?* If not, it is not design yet — it is a number (defer it to the balance pass), an implementation choice (architecture doc), or a buildable check (requirements doc). Send each to where it belongs; keep the model, the dynamics, and the resolved forks.

## The altitude stack — model vs numbers vs requirements vs implementation

The single most common failure is writing at the wrong altitude. Four docs, four floors, using armour as the worked example:

| Floor | Doc | Armour example |
|---|---|---|
| **Model + dynamics + resolved forks** | **system design doc** *(this)* | "Armour is destroyable, directional, sectioned; type-% reduction, then a gate that blocks the modules behind an intact plate. Produces three kill-roads and a finite aggression window." |
| **Numbers / tuning** | the project's balance pass | "−30% / −10% / −50%; survive ~3 missiles / ~2 railgun rounds at max upgrade." *(provisional — not locked at G1)* |
| **Buildable, testable contract** | feature-requirement doc | "A breached facing exposes the module behind it. *Verify:* called-shot through a broken plate and confirm the internal can now be hit." |
| **Implementation (classes, data)** | architecture doc | "`ArmourSection` holds per-facing health; `DamageResolver` applies reduction, then gates internals." |

The design doc owns the **top floor only**. Numbers belong one floor down (flag them `provisional → the balance pass`); class names two floors down.

## 1. Traced to a pillar

- ❌ "The damage system tracks hull, armour, and subsystem health." *(a mechanism floating free of any reason to exist)*
- ✅ "This is the layer where the pillar *consequence is persistent and systemic; attrition is the skill* becomes mechanism: hull damage accumulates across fights, and the player who cannot out-aim anyone wins by managing attrition." *(a damage-model design doc's opening)*

A system with no pillar is flavour or scope creep. Open by naming the feeling it carries — the pillars are named in the topic hub `docs/design/<topic>/README.md` or the project context.

## 2. The decision space is the heart

A system is interesting because of the decisions it puts in front of the player.

- ❌ "Combat resolves automatically once weapons are assigned." *(no live decision = an animation)*
- ✅ "Every engagement is the four-question loop: *what am I fighting and how do I beat it? · which weapons/tactics, and when? · how do I survive the incoming salvo? · what do I do with the wreck?* — each answered under time pressure and partial information."

For each decision, give the choice, the information the player has when choosing, the opportunity cost, and *why no option dominates*. If one option always wins, it is not a decision.

## 3. Model altitude

- ❌ "Missiles do −30%, railgun −10%, point-defence −50% damage to plated facings." *(numbers presented as decided — these are tuning)*
- ❌ "Add a `DamageResolver` that subtracts a per-type reduction float before applying to the hull." *(implementation — → architecture doc)*
- ✅ "While a plate lives it reduces incoming damage by a **weapon-type percentage** *(provisional → the balance pass)*, and **gates** the modules behind it — they cannot be touched until the plate breaks." *(the model: the shape of the rule, not its constants or its code)*

The model is the durable, designable thing. The constants will be tuned; the code will be written. Both happen *after* G1. State the rule's *shape* and defer the rest.

## 4. Argue the dynamics — and war-game them

This is what separates a design from a rulebook. Do not stop at the rules — reason forward to what *emerges*, then attack it.

- ❌ "Armour reduces damage and can be destroyed; subsystems can be disabled." *(stops at the rules — never says what play results)*
- ✅ **Forward:** "These rules yield **three roads to end a ship**: grind the hull (the brawler), decapitate the command centre, or kill the reactor — each gated so none is a one-shot." *(the dynamics)*
- ✅ **War-gamed:** "Naively, sniping one external on turn 1 de-fangs the enemy cheaply — a degenerate opener. **Rule M1 kills it:** a single salvo only *degrades* an external; a confirmed disable needs sustained commitment." *(the degeneracy named, and the rule that closes it)*

Anti-degeneracy is first-class here: a contested anti-degeneracy call earns its own design ADR, and a couplings doc that exists mainly to war-game how systems interact is a good sign, not scope creep. For a contested fork, run independent passes (adversarial red-team, fresh derivation) and synthesise — convergence is signal.

## 5. Draw the boundaries

- ✅ **Owns:** "the hull/armour/subsystem layers and how a hit resolves across them."
- ✅ **Consumes:** "orientation from the combat model (the facing you present is the facing that eats the hit)."
- ✅ **Hands off:** "the *surrender trigger* → the morale system (a will-to-fight model, not damage's call); all constants → the balance pass."
- ✅ **Does NOT decide:** "what makes a crew strike its colours — damage authors the structural state; the morale system owns the fold."

Naming the non-decisions is half the job: it keeps each doc independently lockable and stops the damage doc quietly deciding morale.

## 6. Cash out into the experience

Close the loop back to principle 1: model → play → feeling.

- ❌ "Armour is a destroyable damage-reduction layer with per-facing health." *(true, but: so what? what does it make the player feel?)*
- ✅ "Because it is thin and destroyable, armour is **the brawler's licence to commit** — a *finite aggression window* that lets you out-commit the enemy in the joust and keep your internals alive behind the plate, not immunity. Win inside the window or you are exposed."

If you cannot state what playing it right *feels* like, the dynamics argument is not finished.

## 7. Forks recorded as ADRs

- ✅ "The armour-vs-penetration fork — soak model vs gate model vs hybrid — is resolved in the topic's keystone ADR: a gate+chip hybrid, with the rejected pure-soak branch and why it failed the alpha-strike case recorded there."

Every contested decision points to its `adr-NNNN` under `docs/design/<topic>/decisions/`; the keystone fork gets its own. Keep the rejected branch — a later contradiction reopens the design from the *reasoning*, not a guess. Check the highest ADR number on disk before assigning one (concurrent sessions share the sequence, and the `decisions/` folder is created lazily).

## 8. Right-sized & honest

A few screens, not a spec. If it is twenty pages you are either documenting more than one system (split it) or smuggling in numbers and implementation (cut them down a floor). Three habits keep it honest:

- the `> **What's decided.**` callout up top — the locked skeleton, separated from the still-open;
- **every number flagged** `provisional → the balance pass`;
- a `## Status / openness` close listing the forward dependencies and open forks you did *not* resolve (mark RESOLVED ones with their ADR), so downstream docs inherit known unknowns instead of hitting them mid-build.

## Smell tests

- Describes rules but never what emerges → rulebook; add the dynamics.
- A number presented as decided → it is tuning; move it to the balance pass and flag it provisional.
- Names a class / component → it is architecture; move it down a floor.
- No pillar cited → unparented (flavour or scope creep).
- No degeneracy analysis → unstress-tested; war-game it.
- No non-decisions / hand-offs → unscoped; draw the boundary.
