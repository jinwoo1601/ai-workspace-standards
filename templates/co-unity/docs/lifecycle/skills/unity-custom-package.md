# Unity Custom Package Skill — Lifecycle Record

## Metadata
- **Skill**: unity-custom-package
- **Status**: active
- **Version**: 0.1.0
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-01

## Description
Scaffolding and configuration of custom Unity packages (UPM) for URL-based distribution: repository
layout, the `package.json` manifest and its field contract, assembly definitions including test
assemblies, `Samples~`/`Documentation~`, semver and changelog discipline, editor tooling, and the
`.meta` rules that decide whether the package works for anyone but its author.

## Changelog
- 2026-09-01: Initial release (0.1.0). Ported from the source `unity-custom-package` skill; the
  required frontmatter and the five required sections added, and a boundary note added stating that
  UPM's Git-URL install is a distribution channel for the **package repository** and is independent
  of the consuming project's version control (co-unity projects are on Plastic SCM).

## Dependencies
- Skills: `test-driven-development` (test assembly template), `refactoring` (`.meta` GUID stability),
  `documentation-writing`, `plastic-checkin`
- Personas: `code-writer` (owner)

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Initial release for the co-unity variant | pm |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/unity-custom-package/SKILL.md` with the five required sections
- [x] Frontmatter valid: name, description, status, scope (`co-unity`), version, owner populated
- [x] The package-repo vs. consuming-project version-control boundary is stated explicitly
- [x] `.meta` guidance retained, including the folder's own `.meta` and the pre-first-commit import step

## Notes
- Owner: code-writer. Used by `code-writer`; phase 3.
- The only place in this variant where repository mechanics other than Plastic legitimately appear,
  and only for the package repo — never for the consuming project's working copy.
