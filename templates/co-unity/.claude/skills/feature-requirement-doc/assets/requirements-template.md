---
type: requirements
feature: <kebab-name>
topic: <combat | navigation | voice | vr-ux | art | narrative | audio — project-defined>
status: draft
updated: <YYYY-MM-DD>
sources:
  - <docs/design/<topic>/<design-doc>.md>
  - <docs/design/<topic>/decisions/adr-NNNN-<slug>.md>
---

# <Feature Name> — Requirements

<!-- This doc is the G2 acceptance checklist for the feature, written in advance. What and why, never how (the "how" is the architecture doc). Follow the project's bound prose/link convention — a wikilink-aware project keeps one logical line per paragraph or list item. Delete these guidance comments as you fill each section. -->

## 1. Feature & scope

<!-- One-line scope (the backlog line), then 2-4 sentences: what this feature is, and the slice of locked design it realizes. Link the parent design docs / ADRs so they stay navigable. -->

## 2. Why — player value

<!-- The pillar / core fantasy this serves (named in the topic hub docs/design/<topic>/README.md or the project context). This is the "why" behind every requirement below — the thing you protect when a tradeoff forces a cut. -->

## 3. Player-facing behavior

<!-- The experiential spec: what the player does, perceives, and feels in this feature, moment to moment. This is the heart of a game requirements doc — write it before the table below. -->

## 4. Functional requirements

<!-- Numbered, testable, prioritized. Each row: the requirement (what/why, not how), its priority, how you would verify it in-game, and its parent in locked design. -->

| #  | Requirement | Priority | Acceptance check | Source |
|----|-------------|----------|------------------|--------|
| F1 | <observable player-facing behavior> | Must / Should / Could | <how you would verify it by playing> | <design doc / ADR> |
| F2 |             |          |                  |        |

## 5. Non-functional requirements

<!-- First-class. In VR some of these are feature-killers. Keep the rows that apply; cut the rest. -->

- **Performance:** <the project's frame budget; any per-frame cost ceilings if the feature is hot>
- **Comfort:** <motion-sickness / vestibular constraints — a hard constraint, not a nicety>
- **Voice / input robustness:** <phonetic ambiguity; behavior on low-confidence or unrecognized commands — the game responds, never dead air>
- **Diegesis:** <must feedback stay in-fiction? where, if anywhere, is non-diegetic UI licensed?>
- **Accessibility:** <if applicable>

## 6. Non-goals / deferred

<!-- As sharp as the goals. What this feature does NOT do; what is explicitly deferred to a later feature; which adjacent systems it touches but does not own. This is the scope fence — the thing that stops a two-week feature becoming two months. -->

## 7. Dependencies & assumptions

<!-- What must already exist or be merged first (features are dependency-ordered — declare the order). What you assume about the player and the rest of the game. Unstated assumptions are where requirements rot. -->

## 8. Acceptance criteria (G2)

<!-- The consolidated "done" checklist the human walks at G2. Pull the Must-priority checks from §4, then add the human-only verification and the automated gates. Human-only gates need a recorded human statement as evidence, never an assumption. -->

- [ ] <criterion — from the §4 Musts>
- [ ] Human-only verification gate (for VR: the in-headset playtest): <what the human must feel / confirm>
- [ ] The bound compile gate in `docs/verification-bindings.md` passes
- [ ] The bound test battery in `docs/verification-bindings.md` runs green (or a failure is attributed to a documented environment quirk)

## 9. Open questions

<!-- The unknowns you did NOT resolve — handed forward to the architecture doc. Honest beats complete; the arch doc would rather inherit a known unknown than hit it mid-build. -->
