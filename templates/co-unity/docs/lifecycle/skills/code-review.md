# Code Review Skill — Lifecycle Record

## Metadata
- **Skill**: code-review
- **Status**: active
- **Version**: 0.1.2
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-03

## Description
The union review cycle for the co-unity variant: one brief, one parallel fan-out covering
correctness and quality together, main-thread dedup, adversarial verification of every survivor, a
per-finding human ruling, and surgical fixes applied through `code-writer`. Ships an 11-angle
roster and a Plastic-idiom review-brief template.

## Changelog
- 2026-09-03: 0.1.2 — deferral convention defined — ruling record at `memory/reports/<date>-review-<feature>.md`, carried into the architecture doc's open questions (C4).
- 2026-09-03: 0.1.1 — review-record verdict vocabulary aligned to the `finding-verifier` persona (CONFIRMED / REFUTED / CONFIRMED-AS-CLARITY), replacing UNDETERMINED (S8).
- 2026-09-01: Initial release (0.1.0). Ported from the source review-cycle skill for the co-unity
  variant; git idioms replaced by Plastic (`cm.exe diff cs:A cs:B --format=…`, `cm.exe cat "path#cs:N"`,
  never `cm diff` on content). Two ideas salvaged from the source PR-review skill before it was
  dropped as git-only: depth-by-lane profiles (slim/full) and the materiality floor. Fixes moved
  off the main thread to `code-writer` per the variant's delegation policy.

## Dependencies
- `references/angle-roster.md` — the 11 review angles, pasted verbatim into each dispatch
- `assets/review-brief-template.md` — the shared brief written into the session scratchpad
- Personas: `review-angle`, `finding-verifier`, `code-writer`, `test-runner`, `vc-checkin`
- Skills: `refactoring`, `test-driven-development`, `plastic-checkin`, `security-scan`

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Initial release for the co-unity variant | pm |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/code-review/SKILL.md` with the five required sections
- [x] Frontmatter valid: name, description, status, scope (`co-unity`), version, owner populated
- [x] Angle roster carries all 11 angles with their "Do NOT report" lines
- [x] No git commands, branches, or PR mechanics appear anywhere in the skill

## Notes
- Owner: pm. Used by `review-angle`, `finding-verifier`, and the PM on the main thread; phase 4.
- Hard gates: no finding reaches the human unverified; no fix is applied unruled.
