# Agent Governance Record — pm

## Overview

- **Agent Name**: pm
- **Role**: Project Manager (PM) Agent — variant override extending the workspace PM template
- **Phase**: production
- **Variant**: co-unity

## Phase History

- **2026-09-03**: 0.1.2 — bookkeeping rebound to a single `memory/workflow.md` (owner ruling 2026-09-03); rows retired on merge, session log keeps the narrative.
- **2026-09-03**: 0.1.1 — orientation warns and waits on a Workflow-state/repository mismatch instead of correcting the log (S5); design-track close-out order stated (S4); backlog path bound (S3); roster phases for `vc-checkin` (S7).
- **2026-09-01**: Initial release — scaffolded by `create-l3-scaffold.ts`.

## Acceptance Criteria

- [x] Defined in `agents/pm.md`
- [x] Uses the `extends` pattern (ADR-0033) rather than duplicating the workspace PM
- [x] Carries `lifecycle` frontmatter with `phase` and `governance`
- [x] Validated by `scripts/validate-agents.ts`
- [x] `variant_overrides` filled in — governance workflow, agent roster, and dispatch protocol are authored for co-unity (2026-09-01)
