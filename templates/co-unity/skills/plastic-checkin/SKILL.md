---
name: plastic-checkin
description: >
  Runs the full Plastic SCM (Unity Version Control) check-in ceremony from WSL — status,
  categorize, re-register, add, check in, verify — and returns the created changeset number or the
  specific blocker. Use when: committing any work, docs, codex pages, or bookkeeping; and as the
  reference for the cm.exe idioms, the merge ceremony, and the standard ignore list.
version: 0.1.2
scope: co-unity
status: active
owner: vc-checkin
last_reviewed: 2026-09-01
prerequisites: The project binds Plastic SCM (Unity Version Control) and the workspace is registered; cm.exe is reachable from WSL.
relates_to:
  - skill: code-review
    type: follows
  - skill: handoff
    type: relates_to
gemini-parity: skip
metadata:
  type: process
  triggers:
    - check in
    - checkin
    - commit
    - cm.exe
    - plastic scm
    - unity version control
    - changeset
    - merge ceremony
---

## Context

Version control in this variant is **Plastic SCM (Unity Version Control)**, driven as a Windows
binary from WSL. There is no staging area, no index, no pull request; commits are **changesets**
(`cs:N`). Every git-shaped habit is wrong here, and several of the wrong ones fail *silently* —
which is why the ceremony below exists as a fixed sequence rather than as advice.

The caller states the intent, the comment (or a path to a file holding it), and optionally an
explicit file list. The ceremony executor owns the sequence end to end and returns a result. **It
never makes scoping decisions the caller did not state**, and it never phrases its output as an
opinion about what should have been committed.

If the project does not bind Plastic, report that and stop. Never improvise with another version
control system.

**Environment.** The binary is `cm.exe` — never bare `cm` — at
`"/mnt/c/Program Files/PlasticSCM5/client/cm.exe"` if it is not on PATH. Project paths contain
spaces: always quote. Two idioms are forbidden outright:

- **Never run `cm diff` on file content** — it launches the Windows GUI difftool and hangs a
  headless session. Use `cm.exe cat "path#cs:N"` into a temp file plus unix `diff`. For a
  changed-file list use `cm.exe status` or `cm.exe diff cs:A cs:B --format="{status}|{path}{newline}"`.
- **Never assume `cm.exe cat` is byte-faithful** — it transliterates Unicode through the Windows
  codepage (an em dash becomes a hyphen, a multiplication sign becomes `x`, a section sign is
  dropped), producing phantom hunks on every Unicode-bearing line. Use `cmp -s` for byte-identity
  checks; strip non-ASCII from **both** sides when localizing a real edit.

Companion references: `references/cm-cheatsheet.md` (the command mapping),
`references/merge-ceremony.md` (the main-thread merge runbook), `assets/ignore.conf` (the standard
ignore list).

## When to Use

**Every commit** — feature code, tests, process docs, codex pages, bookkeeping. There is no
"small enough to do inline" commit; the ceremony is what catches the silent failures.

**Phases 1, 2, 3, 4, 5, 6** — the closing step of the design, planning, implementation, review,
acceptance, and close-out procedures.

**Dry-run / audit** — when the caller wants to know what *would* be committed before anything is.

**Not for**: merging (the merge ceremony is run by the PM on the main thread — see
`references/merge-ceremony.md`), branch switching, undo, or shelving, unless the caller's prompt
explicitly instructs that exact operation.

---

## Execution Steps

### 1. Status

`cm.exe status`. Parse **every** pending item into one of five categories:

| Category | Meaning |
|---|---|
| Changed | Controlled, content differs |
| Added | New, already checked out for add |
| Private | New, never added — invisible to a check-in until added |
| Deleted | Controlled item removed from the working copy |
| Phantom | Byte-identical; the editor re-saved it and nothing actually changed |

### 2. Categorize against the caller's stated scope

Items **in scope but wrongly registered** go to step 3. Items **out of scope are left alone** and
listed in the report. **Never sweep unrelated pending state into the commit** — an editor leaves
settings assets and imported artifacts pending constantly, and a commit that quietly absorbs them
is unreviewable.

### 3. Re-register

The `not changed in current workspace` abort is atomic (rc=1, nothing commits) and has **four**
triggers, each with its own fix:

| Trigger | Fix |
|---|---|
| Byte-identical — re-saved, no real change | Drop it from the check-in list |
| Private, never added | `cm.exe add "<path>"` |
| Genuinely changed, stale status cache | `cm.exe checkout "<path>"` first — forces a re-hash |
| Locally deleted controlled item | `cm.exe remove "<path>"` |

**Bulk tactic**: `cm.exe checkout` the entire intended check-in list up front — code and docs
alike — then re-read status. Anything still not registering gets individual diagnosis:

```bash
diff <(cm.exe cat "<path>#cs:HEAD") "<path>"
```

### 4. Add

For new files. **`cm.exe add -R "<folder>"` misses the folder's OWN `.meta`** — the editor puts a
folder's `.meta` in the *parent* directory, so a recursive add of the folder never sees it. After
any recursive add:

```bash
cm.exe add "<folder>.meta"        # and every nested new folder's .meta
```

Then confirm via `cm.exe status` that **nothing in scope remains Private**. A missing folder `.meta`
is the classic omission and it breaks the project for everyone who syncs it.

### 5. Check in

Two traps, both silent:

- **`cm ci` given a DIRECTORY path silently SKIPS Changed-status files.** It commits only
  Added and Deleted items, exits 0, and prints no warning. Always pass Changed files **explicitly**,
  or run two passes: a directory-path check-in for Added/Deleted, then an explicit-file check-in for
  Changed.
- **`cm ci --all` has no exclude flag.** Do not use it when anything out of scope is pending.

```bash
cm.exe ci "<file>" "<file>" -c "<comment>"
```

### 6. Comment

**Comments longer than roughly 2000 characters fail silently with rc=0** — the check-in lands with
a truncated or missing comment. For long comments, write the text to a file on the **Windows** side
and pass:

```bash
cm.exe ci "<file>" ... -commentsfile=D:\path\to\comment.txt
```

The path must be a **Windows** path — never a `/tmp/...` path. Note that `cm changeset edit` takes
only a positional comment and has **no** `-commentsfile`, so a comment that failed this way cannot
be repaired the same way.

### 7. Verify

A second `cm.exe status` after the check-in. **Success of the check-in command is NOT success of
the commit.** Confirm every in-scope file left the pending list, and parse the new changeset number
from the check-in output. Report `cs:N` only after this step.

---

### Bookkeeping commit — always a separate changeset

The bookkeeping update (`memory/workflow.md`, the session log, `CHANGELOG.md`) is committed as
a **separate, second changeset** with its own comment. Never fold a bookkeeping update into a work
commit, and never commit bookkeeping in the same changeset as a merge. At close-out the order is
fixed: **codex commit → merge check-in → bookkeeping commit**, three separate changesets; on the
design track, which touches no codex, it is **merge check-in → bookkeeping commit**, two.

### Dry-run mode

If the caller says "dry-run" or "report only": run status, categorize everything, print the exact
command sequence that **would** run, and execute none of it.

### Hard limits

- **Never** `cm merge`, `cm switch`, `cm undo`, or shelve, unless the caller's prompt explicitly
  instructs that exact operation. If the workspace state requires one of those to proceed, **STOP
  and report** — that is the main thread's call.
- The **merge ceremony is never run here.** It belongs to the PM on the main thread, because
  content conflicts need the human (`references/merge-ceremony.md`).
- **Never edit file content.** This ceremony changes version-control state only.
- **Never phrase the output as a decision about what should have been committed.** Execute the
  caller's stated scope; list what was left pending.
- For reference only, if the caller *does* instruct shelving: the verbs are
  `cm shelveset create | apply | delete` (alias `cm shelve`). **`cm unshelve` does not exist.**

---

## Output Format

Exactly one of:

```
cs:N — <what was committed: file count by category> · left pending (out of scope): <count or none>
```

```
BLOCKED — <the specific blocker>
Trigger category: <byte-identical | private-never-added | stale-status-cache | locally-deleted | directory-ci-skip | comment-too-long | merge-in-progress | other>
Attempted / recommended fix: <what was run, or what should be>
Raw error: <the raw error line, verbatim>
```

Nothing else. No narrative, no assessment of the change itself.

---

## Related Skills

- **code-review** — its COMMIT step dispatches this ceremony with the review-pass comment.
- **test-driven-development** — the bound gates run green *before* the check-in, not after.
- **handoff** — a handoff brief cites the last `cs:N` this ceremony returned.
- **codex** — the codex commit is its own changeset, ahead of the merge and the bookkeeping commit.
