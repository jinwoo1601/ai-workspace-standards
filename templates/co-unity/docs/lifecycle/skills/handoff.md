# Handoff Skill — Lifecycle Record

## Metadata
- **Skill**: handoff
- **Status**: active
- **Version**: 0.1.1
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-03

## Description
Writes a focused handoff brief a cold, context-light session can start from — one task, minimal state, exact paths, naming the co-unity procedure or skill to invoke. Emitted as a single copy-pasteable block; state, not process.

## Changelog
- 2026-09-03: 0.1.1 — `environment-bootstrap` added to the entry points (C10); state pulled from `memory/workflow.md`.
- 2026-09-01: Initial release for the co-unity variant (0.1.0) — ported from the workspace-level skill and generalized: state is pulled from the latest session log's Workflow state, `memory/`, and the codex; the entry point named is a co-unity procedure or skill (system-design, feature-planning, feature-implementation, feature-review, release-verification).

## Dependencies
- The latest `memory/YYYY-MM-DD.md` session log's `## Workflow state` table
- `cm.exe status --header` (branch cross-check)
- `docs/codex/` (where the project has one)

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Ported from the workspace-level skill and generalized for co-unity | pm |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/handoff/SKILL.md`
- [x] Frontmatter valid: name, description, status, scope, version, owner populated
- [x] The five required sections present: Context, When to Use, Execution Steps, Output Format, Related Skills

## Notes
- Variant-exclusive skill (scope: co-unity); owner: pm
- Used by: pm — phase 6 (close-out), and at any session boundary
- The brief carries state and names the owning procedure; it never re-transcribes a procedure's steps
