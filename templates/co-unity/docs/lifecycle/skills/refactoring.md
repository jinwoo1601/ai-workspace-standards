# Refactoring Skill — Lifecycle Record

## Metadata
- **Skill**: refactoring
- **Status**: active
- **Version**: 0.1.1
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-03

## Description
Systematic behavior-preserving code improvement — code-smell identification, incremental
transformation under a test safety net, and validation — extended with the Unity-specific traps a
generic rename does not survive.

## Changelog
- 2026-09-03: 0.1.1 — the four worked examples rewritten in C# (C14).
- 2026-09-01: Initial release (0.1.0). Ported as-is from the co-develop `refactoring` skill
  (scope re-pointed to co-unity, owner moved to `code-writer`) with an added `### Unity notes`
  section: `[FormerlySerializedAs]` for serialized-field renames, `.meta` GUID stability when moving
  files, assembly-definition boundaries, harness-inclusive call-site audits, and engine semantics.

## Dependencies
- Skills: `code-review` (supplies the ruled findings), `test-driven-development` (the safety net),
  `unity-custom-package`, `plastic-checkin`
- Personas: `code-writer` (owner and executor), `test-runner`

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Initial release for the co-unity variant | pm |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/refactoring/SKILL.md` with the five required sections
- [x] Frontmatter valid: name, description, status, scope (`co-unity`), version, owner populated
- [x] `### Unity notes` present and covering serialized-field renames, `.meta` GUIDs, and asmdef boundaries
- [x] No git-specific mechanics in the body

## Notes
- Owner: code-writer. Used by `code-writer`; phase 4.
- The review angles find the issue; this skill executes the fix pattern. The reviewed code's shape
  is canon — a review is not a license to refactor.
- Carried over as-is from co-develop, the file is longer than the variant's ~260-line guidance and
  its worked examples are not in C#. Flagged for a follow-up pass; content is otherwise sound.
