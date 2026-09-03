# Feature-Requirement-Doc Skill — Lifecycle Record

## Metadata
- **Skill**: feature-requirement-doc
- **Status**: active
- **Version**: 0.1.2
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-03

## Description
Authors a feature's requirements doc at `docs/features/<feature>/requirements.md` — the testable, scoped contract for one buildable feature, written after G1 and before the architecture doc. The anchor: the requirements doc is the G2 acceptance checklist, written in advance.

## Changelog
- 2026-09-03: 0.1.2 — orientation and bookkeeping rebound to `memory/workflow.md`.
- 2026-09-03: 0.1.1 — backlog source path bound to `docs/design/<topic>/backlog.md` (S3).
- 2026-09-01: Initial release for the co-unity variant (0.1.0) — ported from the workspace-level skill and generalized: project-specific paths, pillars, and gates replaced with the variant's `docs/features/` layout, project-defined `topic:` vocabulary, the project's bound human-only verification gate and compile gate, Plastic SCM checkin via `vc-checkin`, and session-log Workflow-state bookkeeping.

## Dependencies
- `assets/requirements-template.md` (the nine-section skeleton)
- `references/quality-bar.md` (the eight principles, worked good/bad pairs, the feel→proxy table)
- A G1-locked parent design doc and a `feat-<feature>` branch
- `docs/verification-bindings.md` (the bound gates cited in §8)

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Ported from the workspace-level skill and generalized for co-unity | architect |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/feature-requirement-doc/SKILL.md`
- [x] Frontmatter valid: name, description, status, scope, version, owner populated
- [x] The five required sections present: Context, When to Use, Execution Steps, Output Format, Related Skills

## Notes
- Variant-exclusive skill (scope: co-unity); owner: architect
- Used by: architect — phase 2 (feature planning)
- Requirements derive from locked design and never invent it; a contradiction reopens the design at G1
