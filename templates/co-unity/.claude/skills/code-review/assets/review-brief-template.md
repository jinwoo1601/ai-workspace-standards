# Review brief — <feature / phase>

<!-- Written by the orchestrating session into its scratchpad by ABSOLUTE path — never into
     the project tree. Every review-angle and finding-verifier dispatch reads this file by
     absolute path; it is their entire shared context. Anything not written here does not
     exist for them. -->

## Scope

- Branch / revision range: `<br:/main/feat-<feature> | cs:A → cs:B>`
- Base revision for comparisons: `cs:N`, fetched with exactly this idiom:
  `cm.exe cat "<path>#cs:N"` into a temp file, then unix `diff`.
  Never run `cm diff` on file content — it launches the GUI difftool and hangs.
  `cm.exe cat` transliterates Unicode through the Windows codepage; use `cmp -s` for
  byte-identity checks and strip non-ASCII from both sides when localizing a real edit.
- Changed-file list produced by: `cm.exe diff cs:A cs:B --format="{status}|{path}{newline}"`
  (or `cm.exe status` when the work under review is still pending).
- Review intent: <one sentence — what this change set was supposed to accomplish>
- Depth profile: <slim | full> · angles dropped or added: <list, or none>

## Changed files

| File (absolute path) | Status | Intent (one line) |
|---|---|---|
| ... | Changed/Added/Deleted/Private | ... |

## Load-bearing invariants

<!-- From the feature's requirements/architecture docs and the design ADRs in play. These are
     what verifiers refute findings against and what GAP checks for enforcement. -->
1. ...
2. ...

## Canon pointers

- Requirements: `docs/features/<feature>/requirements.md`
- Architecture: `docs/features/<feature>/architecture.md` (§ the sections bearing on this change,
  including `## Build plan` for per-file intent)
- Design docs in play: `docs/design/<topic>/<system>.md`
- ADRs in play: `docs/design/<topic>/decisions/adr-NNNN-<slug>.md`

## Hot paths

<!-- Paths EFF treats as per-frame/per-tick/per-event; everything else is cold unless listed. -->
- ...

## Out of scope — declared

<!-- Known intentional removals/changes angles must not report; deferred items with their
     ruling record (`memory/reports/<YYYY-MM-DD>-review-<feature>.md`); adjacent code being left alone deliberately. -->
- ...
