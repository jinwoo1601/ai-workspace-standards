# Merge ceremony — main-thread runbook (Plastic SCM)

<!-- Executed by the PM on the MAIN THREAD at both close-outs — the design track after G1
     (system-design step 5) and the feature track after G2 (release-verification step 5). This
     never moves into the check-in ceremony: that executor is forbidden to merge, and content
     conflicts need the human. -->

All commands: `cm.exe` (Windows binary driven from WSL), paths quoted.

## 1. Pre-merge: clean workspace

`cm merge` refuses with ANY pending tracked changes ("MergeWithPendingChanges"). Check
`cm.exe status` on the DESTINATION branch after switching.

Recurring blocker — phantom-Changed files (byte-identical, editor-touched; classically the
generated project-settings assets such as `OpenXRPackageSettings.asset` and `URPProjectSettings.asset`).
Park them:

1. `cm.exe checkout "<file>" ...`
2. `cm.exe shelveset create "<file>" ... -c "parked for merge"`
3. `cm.exe undocheckout "<file>" ...`

Shelve verbs are `cm shelveset create | apply | delete` (alias `cm shelve`). `cm unshelve` does
NOT exist. Restore later with `cm.exe shelveset apply sh:N` if the contents were real.

## 2. Merge

1. `cm.exe switch <destination-branch>`
2. `cm.exe merge br:/<source-branch> --merge`

Clean files merge and stage automatically. The merge is resumable — a conflict does not lose the
staged portion.

## 3. Content conflicts → the human

A file changed by BOTH contributors in the same region launches the Windows GUI Mergetool, which
hangs a headless/WSL session — `--keepdestination` / `--nointeractiveresolution` do NOT pre-resolve
a non-automatic conflict (`memory/workflow.md`, whose rows both branches may have touched, is the classic
case).

Hand it to the human with this exact click path, then wait:

> In the Mergetool: **Merge ▾ → Keep destination** (or resolve by hand) → **Mark as resolved** →
> **Save & exit**.

Do not attempt to fight the conflict headless, and do not kill the mergetool process to "retry".

## 4. Checkin

You cannot `cm ci` while a merge is in progress ("Finish it before checkin") — resolve everything
first, then `cm.exe ci -c "<merge comment>"` (or `-commentsfile=<WINDOWS path>` for long comments).

## 5. Bookkeeping update — separate commit

The bookkeeping update (`memory/workflow.md`, the session log, and `CHANGELOG.md`) is a
SEPARATE commit after the merge checkin (merge-then-bookkeeping), never folded into the merge
changeset. Run it through the check-in ceremony (`../SKILL.md`), not inline.
