# Plastic Check-in Skill — Lifecycle Record

## Metadata
- **Skill**: plastic-checkin
- **Status**: active
- **Version**: 0.1.2
- **Created**: 2026-09-01
- **Last Updated**: 2026-09-03

## Description
The Plastic SCM (Unity Version Control) check-in ceremony driven as `cm.exe` from WSL — status,
categorize, re-register, add, check in, verify — with the full bug catalogue of silent failures, a
dry-run mode, hard limits, and a fixed `cs:N` / `BLOCKED` return format. Ships the git→cm command
mapping, the main-thread merge runbook, and the standard `ignore.conf`.

## Changelog
- 2026-09-03: 0.1.2 — bookkeeping commit names `memory/workflow.md`; merge runbook keeps the phantom-file examples (C2).
- 2026-09-03: 0.1.1 — phase 3 added (implementation check-in, S7); design-track close-out order (merge check-in → bookkeeping commit) stated in the skill and in the merge-runbook header (S4).
- 2026-09-01: Initial release (0.1.0). Ported from the source `vc-checkin` agent body and the
  `accept-feature` merge-ceremony runbook; "board-row commit" generalized to "bookkeeping commit
  (session log / CHANGELOG)", and project-specific asset names replaced with generic ones.

## Dependencies
- `references/cm-cheatsheet.md` — git→cm command mapping
- `references/merge-ceremony.md` — the main-thread merge runbook (PM only, never the check-in executor)
- `assets/ignore.conf` — the standard ignore list, identical to the one the variant's bootstrap script writes
- Personas: `vc-checkin` (owner and executor), `pm` (merge ceremony)

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | production | Initial release for the co-unity variant | pm |

## Acceptance Criteria

### Production Phase

- [x] Skill SKILL.md exists at `skills/plastic-checkin/SKILL.md` with the five required sections
- [x] Frontmatter valid: name, description, status, scope (`co-unity`), version, owner populated
- [x] All four `not changed in current workspace` triggers, the directory-ci skip, the `--all` trap, and the comment-length trap are documented
- [x] `assets/ignore.conf` is byte-identical to the variant's standard list

## Notes
- Owner: vc-checkin. Used by `vc-checkin` and `pm`; phases 1, 2, 3, 4, 5, 6.
- The merge ceremony never moves into the check-in executor: it may not merge, switch, undo, or
  shelve unless the caller instructs that exact operation, and content conflicts belong to the human.
- Bookkeeping commits are always a separate changeset; close-out order is codex → merge → bookkeeping.
