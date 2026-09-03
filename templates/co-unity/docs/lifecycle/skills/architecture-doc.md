# Architecture-Doc Skill — Lifecycle Record

## Metadata
- **Skill**: architecture-doc
- **Status**: active
- **Version**: 0.1.1
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-03

## Description
Authors a feature's architecture doc at `docs/features/<feature>/architecture.md` — components, data contracts, runtime flow, non-functional realization — and holds the persisted build plan. The only process doc that crosses into the codex at G2, by distillation rather than rewrite; reconciled to as-built before acceptance.

## Changelog
- 2026-09-03: 0.1.1 — persisted-plan sub-heading `### Phase <id> — persisted plan (YYYY-MM-DD)` (C3); orientation and bookkeeping rebound to `memory/workflow.md`.
- 2026-09-01: Initial release for the co-unity variant (0.1.0) — ported from the workspace-level skill and generalized: project-specific paths, house patterns, and tooling replaced with the variant's `docs/features/` layout, the codex (`docs/codex/`) as the post-G2 layer, the bound compile gate in `docs/verification-bindings.md`, Plastic SCM checkin via `vc-checkin`, and session-log Workflow-state bookkeeping.

## Dependencies
- `assets/architecture-template.md` (the doc skeleton, shaped toward the codex system page)
- `references/quality-bar.md` (the eight principles, the altitude stack, the arch-doc → codex-page distillation map)
- The feature's requirements doc and the locked design docs / ADRs it realizes
- `docs/codex/templates/system-page.md` (the page this distills into)
- `docs/verification-bindings.md` (the compile gate each build phase must pass)

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Ported from the workspace-level skill and generalized for co-unity | architect |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/architecture-doc/SKILL.md`
- [x] Frontmatter valid: name, description, status, scope, version, owner populated
- [x] The five required sections present: Context, When to Use, Execution Steps, Output Format, Related Skills

## Notes
- Variant-exclusive skill (scope: co-unity); owner: architect
- Used by: architect — phase 2 (feature planning); reconciliation pass before G2 in phase 5
- The plan does not exist until it is persisted under `## Build plan`
- Architectural decisions go inline in the decision register; only design forks get ADRs under `docs/design/<topic>/decisions/`
