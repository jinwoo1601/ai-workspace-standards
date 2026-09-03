# The quality bar — worked examples

Read this while drafting the hard parts of a requirements doc: making subjective "feel" testable, and keeping implementation (*how*) out of requirements (*what*). It expands the eight principles from `SKILL.md`, each with a good/bad pair.

> The examples below are illustrative of **form**, not authoritative design. They use generic game examples — a damage model, a waypoint system, a voice-designation feature. When you cite a real design doc or ADR in your project, verify its actual content first; do not lift these example claims as fact.

## Contents
- The anchor
- 1. Testable — done is observable
- 2. What and why, never how
- 3. Traced upward
- 4. Scoped — non-goals
- 5. Prioritized
- 6. Non-functional — the VR feature-killers
- 7. Dependencies & assumptions
- 8. Right-sized & honest
- Operationalizing "feel"
- Smell tests

## The anchor

Every line earns its place by answering: *could the human tick this off at G2 by playing the game?* If not, it is not a requirement yet — it is a wish, a design decision, or an implementation note. Send each to where it belongs.

## 1. Testable — done is observable

- ❌ "Combat should feel tense and dangerous."
- ✅ "In every combat encounter the player faces at least one decision under time pressure — a closing threat with a visible countdown to weapons range. *Verify:* enter any encounter; confirm a timed threat appears and forces a choice before it can be neutralized."

The bad version is a *feel target* (a why). The good version is its observable proxy — something you can watch happen.

## 2. What and why, never how

- ❌ "Add a `ThreatTracker` component that polls all contacts each fixed step and raises an event when the nearest hostile changes."
- ✅ "The player can tell at a glance which contact is the most immediate threat, and that read updates continuously as the situation changes."

The first chose an implementation — it belongs in the architecture doc. The second states the player-facing *what*; the architecture doc gets to decide polling vs events, component vs system.

Constraints are the exception. "Must update within one frame at the project's frame budget" is a legitimate requirement: it bounds the solution space without choosing the solution.

## 3. Traced upward

Every requirement names its parent in locked design.

- ✅ "Railguns are effective only as internal breachers against already-open armour, not as openers themselves (source: the damage-model design doc and its keystone ADR)."

A requirement you cannot trace to a locked design doc or ADR is scope creep — or a sign the design is not actually locked. Surface that; do not invent the rationale to cover the gap.

## 4. Scoped — non-goals as sharp as goals

The non-goals section is what stops a two-week feature becoming two months. For a *voice target designation* feature:

- Goal: "The player can designate a target by voice."
- Non-goal: "This feature does **not** cover fire-control or weapon assignment — designation only. Firing is a separate feature."

Always name the adjacent systems you touch but do not own (here: the weapons system, the tactical map's contact list).

## 5. Prioritized — Must / Should / Could

The Musts are the minimal G2-acceptable feature; Shoulds and Coulds are the richer target. This is what lets a feature ship instead of sprawling.

- **Must:** "The command 'target the lead ship' selects the nearest hostile on the player's heading."
- **Should:** "An ambiguous designation ('target the cruiser' with two cruisers present) triggers a clarification prompt, not a silent pick."
- **Could:** "The player can designate by relative bearing ('target bearing two-seven-zero')."

## 6. Non-functional — the VR feature-killers

In VR these can sink a feature that is functionally perfect. Always check:

- **Performance** — the project's frame budget is the floor; a feature that drops frames induces sickness. State per-frame ceilings if the feature is hot.
- **Comfort** — vestibular conflict, sudden camera motion, anything that fights the player's inner ear. A hard constraint, not a polish item.
- **Voice / input robustness** — where the player drives by voice, transcription is lossy and phonetically ambiguous. Specify failure behavior: on a low-confidence or unrecognized command the game responds (a clarifying line, a "say again"), never dead air.
- **Diegesis** — confirmations and feedback should stay in-fiction (a spoken line, a console light) unless the doc explicitly licenses a non-diegetic element.

## 7. Dependencies & assumptions

- **Dependency:** "Requires the tactical-map feature merged — designation reads contacts from the map's contact list."
- **Assumption:** "Assumes the player is seated and facing forward at the primary terminal, per the locked seated-play design."

Features are dependency-ordered; declare the ordering here so the build sequence is legible to whoever picks this up.

## 8. Right-sized & honest

A page or three. If you are writing twenty, you are either documenting more than one feature (split it) or smuggling in architecture (cut it). End with the open questions you did not resolve — the architecture doc would rather inherit a known unknown than hit it mid-build.

## Operationalizing "feel"

Game requirements are full of subjective targets — "tense", "massive", "immersive", "readable". Do not ban them; they are the *why*. Convert each into an observable proxy that becomes the actual requirement, and keep the feel target alongside as the rationale.

| Feel target (the why) | Observable proxy (the requirement) |
|---|---|
| "Combat is tense" | A decision under time pressure each encounter; the am-I-winning read stays ambiguous until the final third. |
| "The ship feels massive" | Helm commands have visible spool-up and lag; no instantaneous heading changes. |
| "Being in command feels real" | Every player command is acknowledged by a spoken line before it resolves; nothing resolves silently. |

## Smell tests

- Cannot test it → rewrite it as something observable.
- Names a class / component / algorithm → it is architecture; move it to the arch doc.
- A "feel" word with no proxy → unfinished.
- No non-goals → unscoped.
- No upward citation → unparented (or the design is not actually locked).
