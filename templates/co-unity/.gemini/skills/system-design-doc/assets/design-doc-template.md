---
type: system
topic: <combat | navigation | voice | vr-ux | art | narrative | audio — project-defined>
tags: [<kebab, tags>, pillar-<N>]
status: draft
updated: <YYYY-MM-DD>
sources:
  - <docs/design/<topic>/README.md (§N — the parent hub section)>
  - <docs/design/<topic>/decisions/adr-NNNN-<slug>.md>
  - "<Session direction YYYY-MM-DD (...)>"
---

# <System Name>

<!-- This is a DESIGN-track doc: specify the MODEL, argue the DYNAMICS it produces, trace to the pillar it serves. The design intent is what G1 locks; numbers are provisional (→ the balance pass). It is NOT implementation (→ architecture doc) and NOT a buildable acceptance check (→ requirements doc). Follow the project's bound prose/link convention — a wikilink-aware project keeps one logical line per paragraph or list item. Order the middle sections to fit the system; tables and matrices are house style. Keep the top callout and the two bottom bookends. Delete these guidance comments as you fill each section. -->

<!-- OPENING (one paragraph): what this system is, where it sits in the topic, the keystone fork/ADR it resolves, and the one governing constraint that shapes everything below. Name the pillar(s) it carries. -->

> **What's decided.** <The locked skeleton in a sentence or two — the decisions G1 locks.> All numbers on this page are **provisional → the balance pass** (the design intent is the load-bearing part).

## <The model>

<!-- The mechanism at MODEL altitude: the state it tracks, the rules, how a hit / turn / order resolves. Use a table or matrix where it sharpens the model (e.g. a weapon x layer matrix). NO numbers presented as decided — flag them provisional. NO class names or components — that is the architecture doc. -->

## The player's decisions

<!-- The heart. What choices does this system put in front of the player? For each: the choice, the information the player has when they choose, the opportunity cost, and why no single option dominates. A system with no interesting decision is an animation, not a system. -->

## Dynamics & anti-degeneracy

<!-- Reason FORWARD from the rules to the emergent play (e.g. "three roads to a kill"). Then attack your own rules: the dominant strategy, the degenerate loop, the dead zone — and name the rule that kills each. This section is what separates a design from a rulebook. -->

## Boundaries & couplings

<!-- What this system OWNS; what it CONSUMES from sibling systems; what it HANDS OFF and to where; and what it explicitly does NOT decide. This is the scope fence that keeps the doc independently lockable. -->

## <Experience payoff / identity>

<!-- Close the loop: this model → this play → the pillar's promised feeling. If you cannot state what playing it right FEELS like, the dynamics argument above is not finished. -->

## Status / openness

<!-- The lock-state and the honest unknowns. -->

- **Status: draft.** <The locked skeleton vs what is still drafting; which forks are recorded in ADRs.>
- **All numbers provisional → the balance pass:** <list the key deferred numbers.>
- **Hard dependencies / open:**
  - <a forward dependency or an open fork — mark RESOLVED ones with their ADR and where they landed.>

## Related

<!-- Dense list of links (per the project's bound link convention): the coupled systems, the ADRs, the parent hub, and the codex pages this touches. -->
