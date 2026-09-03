# cm.exe cheat sheet — the git-shaped habit and what to do instead

On-demand reference for Plastic SCM (Unity Version Control). **In WSL always invoke `cm.exe`, never
bare `cm`**, and always quote paths — project paths contain spaces. The check-in ceremony itself
lives in `../SKILL.md`; this file is the command mapping only.

## The three differences that break habits

1. **No staging area.** `cm add` is for **new files only**. Modified and deleted controlled files
   are not staged — they are named on the check-in, or picked up by `cm ci --all` (which has no
   exclude flag; see the ceremony's traps).
2. **Commits are changesets.** A commit is `cs:N`, a repository-wide integer, not a per-branch hash.
   Revisions are addressed as `path#cs:N`.
3. **Branches are paths.** `br:/main`, `br:/main/design-<topic>`, `br:/main/feat-<feature>`. A child
   branch's full path includes its parent.

## Status and inspection

| Instead of… | Use |
|---|---|
| `git status` | `cm.exe status` |
| current branch / workspace header | `cm.exe status --header` |
| `git diff` (file list) | `cm.exe diff cs:A cs:B --format="{status}\|{path}{newline}"` |
| `git diff` (file content) | **Never `cm diff` on content — it launches the GUI difftool and hangs.** Use `cm.exe cat "path#cs:N"` into a temp file, then unix `diff` |
| `git show <sha>:<path>` | `cm.exe cat "path#cs:N"` |
| `git log` | `cm.exe log [csetspec] [--from=csetspec]` |
| `git log -- <file>` | `cm.exe history "<file>"` |
| `git blame <file>` | `cm.exe annotate "<file>"` |
| searching history | `cm.exe find changeset "where branch='main'"` (SQL-like query language) |

`cm.exe cat` transliterates Unicode through the Windows codepage — use `cmp -s` for byte-identity
checks, and strip non-ASCII from both sides before diffing real edits.

## Branching

| Instead of… | Use |
|---|---|
| `git branch` (list) | `cm.exe branch list` |
| `git branch <name>` | `cm.exe branch create <name>` |
| `git checkout -b` / `git switch` | `cm.exe switch br:/main/<name>` |

Branch naming in this variant: design track `br:/main/design-<topic>`, feature track
`br:/main/feat-<feature>`.

## Committing

| Instead of… | Use |
|---|---|
| `git add <new files>` | `cm.exe add "<path>"` — **new files only** |
| `git add -A <folder>` | `cm.exe add -R "<folder>"` — **misses the folder's own `.meta`**; add it explicitly |
| `git rm <file>` | `cm.exe remove "<path>"` |
| re-hash a stale entry | `cm.exe checkout "<path>"` |
| `git commit -m "msg"` | `cm.exe ci "<file>" … -c "msg"` (alias of `cm checkin`) |
| `git commit -F <file>` | `cm.exe ci … -commentsfile=D:\windows\path.txt` — **Windows path only** |
| `git commit -am "msg"` | `cm.exe ci --all -c "msg"` — no exclude flag; unsafe with out-of-scope pending items |
| `git stash` | `cm.exe shelveset create "<path>" -c "…"` |
| `git stash pop` | `cm.exe shelveset apply sh:N` — **`cm unshelve` does not exist**; the verbs are `create \| apply \| delete` |
| `git checkout -- <file>` | `cm.exe undocheckout "<path>"` |

## Merging

| Instead of… | Use |
|---|---|
| `git merge <branch>` | `cm.exe merge br:/<source> --merge` (destination = current workspace branch) |
| `git mergetool` | The Windows GUI Mergetool — **the human's job**; see `merge-ceremony.md` |

## Syncing

| Instead of… | Use |
|---|---|
| `git push` | `cm.exe push br:/<branch>@<local_repo>@<local_server> <remote_repo>@<remote_server>` |
| `git pull` | `cm.exe pull br:/<branch>@<remote_repo>@<remote_server> <local_repo>@<local_server>` |

Remote paths are always `branch@repo@server` triples — there is no named remote.

## Inert here

Pull requests, forks, rebases, cherry-pick-by-hash, hooks directories, and CI triggered by a push
have **no Plastic equivalent in this variant**. Any harness item that assumes them is inert; its
replacement is the check-in ceremony in `../SKILL.md` plus the merge ceremony in
`merge-ceremony.md`.
