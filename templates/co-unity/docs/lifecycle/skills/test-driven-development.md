# Test-Driven Development Skill — Lifecycle Record

## Metadata
- **Skill**: test-driven-development
- **Status**: active
- **Version**: 0.1.0
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-01

## Description
Red-green-refactor for Unity projects driven from WSL: the EditMode/PlayMode split, test assemblies
via `.asmdef` (`UNITY_INCLUDE_TESTS`, `overrideReferences` + `nunit.framework.dll`,
`[InternalsVisibleTo]`), the batchmode test-runner shape and its failure modes, the cheaper headless
compile gates that run first, and the reporting discipline for results.

## Changelog
- 2026-09-01: Initial release (0.1.0). Adapted from the co-develop `test-driven-development` skill;
  red-green-refactor structure retained, engine specifics and the bound-verification contract added.

## Dependencies
- `docs/verification-bindings.md` — the authoritative source of every command this skill runs
- `docs/co-unity.context.md` § Environment Setup — the fallback lookup
- Personas: `test-runner` (owner), `code-writer`
- Skills: `code-review`, `refactoring`, `unity-custom-package`

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Initial release for the co-unity variant | pm |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/test-driven-development/SKILL.md` with the five required sections
- [x] Frontmatter valid: name, description, status, scope (`co-unity`), version, owner populated
- [x] States that exact commands are bound in `docs/verification-bindings.md` and never invented
- [x] Records the standing caveats: `-quit` never with `-runTests`; "0 tests ran" + compile errors is a FAIL; authored content is human-only

## Notes
- Owner: test-runner. Used by `code-writer` and `test-runner`; phases 3, 4, 5 (and the phase-0 baseline run).
- Verification never runs on the main thread.
