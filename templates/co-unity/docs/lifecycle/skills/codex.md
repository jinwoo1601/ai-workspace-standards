# Codex Skill — Lifecycle Record

## Metadata
- **Skill**: codex
- **Status**: active
- **Version**: 0.1.0
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-01

## Description
Maintains the project codex — the as-built product documentation under `docs/codex/` — through three operations: the post-G2 ingest of an accepted feature, answering questions from the codex with citations, and lint passes for contradictions, code drift, and layer violations. The codex's own schema file (`docs/codex/CODEX.md`) is read first and outranks the skill on structure, frontmatter, linking, and bookkeeping.

## Changelog
- 2026-09-01: Initial release — generalized from the source project's knowledge-base schema and its reconcile persona for the co-unity variant. Editor-specific link mechanics, the source project's process-folder layout, and all project names were dropped; the codex root became `docs/codex/` and the process layer `docs/design/` + `docs/features/`.

## Dependencies
- `docs/codex/CODEX.md` — the codex schema, loaded by contract at the start of every operation
- `docs/codex/templates/` — the five page templates
- Locked process docs under `docs/design/**` and `docs/features/**` (read-only inputs)
- The live project source tree (the primary truth for every code claim)
- `plastic-checkin` skill — commits the returned changed-file list as its own changeset

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Initial release for the co-unity variant | pm |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/codex/SKILL.md`
- [x] Frontmatter valid: name, description, status, scope, version, owner populated
- [x] Required body sections present: Context, When to Use, Execution Steps, Output Format, Related Skills
- [x] Scope: co-unity (variant-exclusive)

## Notes
- Owner: codex-reconcile — the only roster persona licensed to write `docs/codex/**`.
- The license to write is the caller's statement that the human ruled G2 acceptance, with the date. Without it, the skill stops and reports.
- The skill never runs version control; it returns a changed-file list and the check-in is a separate ceremony.
