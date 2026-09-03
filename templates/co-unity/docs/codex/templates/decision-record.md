---
type: decision
domain: production
tags: [adr]
status: stable
updated: YYYY-MM-DD
sources: []
---

# ADR-NNNN: <Decision Title>

**Date:** YYYY-MM-DD · **Status:** proposed | accepted | superseded by [adr-mmmm]

## Context
The situation and forces that led to this decision. What problem are we solving?

## Decision
What we chose to do, stated plainly.

## Consequences
Trade-offs accepted, what this enables, what it rules out, follow-ups required.

## Alternatives considered
- **Option B** — why not.

## Related
[…]

---

> **Where this template is used.** **Production** ADRs — process, tooling, pipeline — live in the codex, at `docs/codex/production/adr-NNNN-<slug>.md`. **Design** decision records keep this exact shape but live in the process layer, at `docs/design/<topic>/decisions/adr-NNNN-<slug>.md`, and carry `topic:` in place of `domain:`. The `decisions/` subfolder is created **lazily** — only when a topic gets its first ADR. The ADR number sequence is shared: check the highest number already on disk before assigning one.
