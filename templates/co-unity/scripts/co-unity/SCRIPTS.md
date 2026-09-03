# SCRIPTS.md — co-unity Variant Scripts

> Lifecycle registry for co-unity variant-specific scripts in `scripts/co-unity/`.

## Registry

| Script | Version | Status | Description | Usage |
|--------|---------|--------|-------------|-------|
| `plastic-bootstrap.ts` | 1.0.0 | active | Plastic SCM workspace bootstrap — converts a scaffolded co-unity project from a git repository into a Unity Version Control workspace. Removes the inherited git machinery (`.githooks/`, `.github/`, `.gitattributes`, `.gitignore`, `.git/`; a `.git/` holding more than one commit is kept unless `--force`, exit 2), writes the standard Unity `ignore.conf` (appending only missing entries to a pre-existing file), rewrites `/sync` and `/commit-push-pr` on both platforms as `vc-checkin` redirect stubs, and reports `cm.exe` reachability plus `cm.exe status --header` (never fails on a missing `cm.exe`). Idempotent; every action prints `REMOVE`/`WRITE`/`SKIP`/`KEEP`. Run after scaffolding and after every `upgrade-project.ts`. | `bun scripts/co-unity/plastic-bootstrap.ts [--project <path>] [--dry-run] [--check] [--force]` |

## Notes

- This sub-registry governs `scripts/co-unity/` on its own; the main `scripts/SCRIPTS.md`
  does not list these files (see `verify-scripts.ts`, variant-directory rule).
- The `// @version` header in each script must match its Version column above.
- `plastic-bootstrap.ts` is the sanctioned way a co-unity project becomes a Plastic
  workspace: `new-project.ts` always creates a git repository and there is no
  overlay-exclusion mechanism, so the git machinery is stripped after the fact.
