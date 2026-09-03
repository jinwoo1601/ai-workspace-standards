# Codex Log

Append-only chronological record of every codex operation. **Newest entries at the bottom.** Every entry starts with a fixed prefix so the log is greppable (`grep "^## \[" log.md | tail`):

```
## [YYYY-MM-DD] <op> | <title>
```

`<op>` is one of `ingest`, `query`, `lint`, `decision`. Follow the header with a few bullets: what changed, which pages were touched, open questions raised. Dates are absolute — never "today".

---

## [2026-09-01] decision | codex initialized from the co-unity template

- Created `CODEX.md` (the schema), `index.md` (the catalog), this log, and `templates/`.
- Domain folders (`code/`, `art/`, `narrative/`, `audio/`, `production/`, optionally `vr-ux/`) are created lazily — on the first page filed into each.
- Open: fill the **Project bindings** table in `CODEX.md` before the first ingest.
