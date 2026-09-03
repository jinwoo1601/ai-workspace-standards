# System-Design-Doc Skill — Lifecycle Record

## Metadata
- **Skill**: system-design-doc
- **Status**: active
- **Version**: 0.1.2
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-03

## Description
Authors a system design doc at `docs/design/<topic>/<system>.md` — a model plus the dynamics it produces, locked at G1 — and resolves contested design forks into design ADRs at `docs/design/<topic>/decisions/adr-NNNN-<slug>.md`. The earliest doc in the Design & Build Workflow, upstream of the feature-requirement doc and the architecture doc.

## Changelog
- 2026-09-03: 0.1.2 — design ADRs copy `docs/codex/templates/decision-record.md` (C7); orientation and bookkeeping rebound to `memory/workflow.md`.
- 2026-09-03: 0.1.1 — feature backlog output bound to `docs/design/<topic>/backlog.md` (S3).
- 2026-09-01: Initial release for the co-unity variant (0.1.0) — ported from the workspace-level skill and generalized: project-specific paths, pillars, and tooling replaced with the variant's `docs/design/` layout, project-defined `topic:` vocabulary, Plastic SCM checkin via `vc-checkin`, and session-log Workflow-state bookkeeping.

## Dependencies
- `assets/design-doc-template.md` (the doc skeleton)
- `references/quality-bar.md` (the eight principles, worked good/bad pairs, the altitude stack)
- The common `decision-record` skill (design ADR shape)
- A `design-<topic>` branch (G0) and the project's design pillars

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Ported from the workspace-level skill and generalized for co-unity | architect |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/system-design-doc/SKILL.md`
- [x] Frontmatter valid: name, description, status, scope, version, owner populated
- [x] The five required sections present: Context, When to Use, Execution Steps, Output Format, Related Skills

## Notes
- Variant-exclusive skill (scope: co-unity); owner: architect
- Used by: architect, vr-ux-designer — phase 1 (design track)
- Writes process docs only; the codex (`docs/codex/**`) is off-limits before G2
