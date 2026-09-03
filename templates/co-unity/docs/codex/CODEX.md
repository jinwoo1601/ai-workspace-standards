# Codex Schema

This folder is the **LLM-maintained knowledge base** for this project — the *codex*. You (the LLM) are its maintainer. This file is the schema: it tells you how the codex is structured and how to operate on it. **Read it at the start of any session that touches the codex**, and follow it precisely. It turns you into a disciplined codex maintainer rather than a generic assistant.

This file is loaded **by contract** — the persona or skill that touches the codex reads it first. It is never auto-injected into your context, and it outranks your instincts on page structure, frontmatter, linking, naming, and bookkeeping.

> **Co-evolve this schema.** When a new convention is settled during a session, record it here. The schema is a living file, not a fixed inheritance.

## Operating model

This variant runs a two-track workflow: **process docs precede implementation; the codex follows it.**

- Design, feature-requirement, and architecture docs are the **process**. They live under `docs/design/` and `docs/features/`.
- The codex represents the **product as built**. A page is created or updated **only after** the feature it documents has been accepted at **G2** by an explicit human ruling — never during design, never during implementation.
- **Design is not authored here.** Intent lives in the process layer. Systems *as built* are documented in the codex, citing their design rationale by path.

If you are asked to write a codex page for something that has not passed G2, stop and say so. Product docs before acceptance is a workflow violation, not a judgment call.

## The division of labor

The human curates sources, directs analysis, and asks questions. **You write and maintain every codex page** — the summarizing, cross-referencing, filing, and bookkeeping. The human reads the codex; they should rarely need to hand-edit it.

## The three layers

**1. Process docs — the input layer (`docs/design/`, `docs/features/`).** Everything that precedes implementation: design docs (locked at G1), design decision records, per-feature requirements and architecture docs. From the codex's point of view these are **read-only**: by G2 they are locked. You cite them; you never edit them during a codex operation.

**The live code is a third, mutable source.** It is referenced **in place**, never copied into the codex. See [Code is a live source](#code-is-a-live-source).

**2. The codex — the product layer (you own this entirely).** Every page under the domain folders, plus `index.md`, the per-domain `_index.md` hubs, and `log.md`. Keep cross-references maintained, keep the catalog current, and keep the whole thing internally consistent.

**3. The schema — this file.** The project's own context and workflow files own environment, version control, and the project's binding of the workflow; do not duplicate those here.

## Directory map

```
docs/codex/
├── CODEX.md          # this schema
├── index.md          # catalog of every codex page, grouped by domain
├── log.md            # append-only chronological op log
├── templates/        # page templates — copy these when creating pages
├── code/             # architecture, runtime systems (as built), data contracts, rendering
├── art/              # art direction, visual language, palette, shaders-as-look, references
├── narrative/        # world, factions, entities, characters, tone
├── audio/            # sound design, VO, music direction
├── production/       # dev phases, milestones, production decision records (ADRs)
└── vr-ux/            # (optional) player-interaction design as built — see Domain guide
```

## Page conventions

- **Filenames:** `kebab-case.md`. One concept / system / entity / decision per page.
- **Location:** put each page in the domain folder that owns it. A page that spans domains lives in its **primary** domain and is cross-linked from the others.
- **Frontmatter (YAML) on every page:**
  ```yaml
  ---
  type: system | concept | entity | decision | source-summary | overview
  domain: code | art | narrative | audio | production   # + vr-ux if the project enables it
  tags: [kebab, tags]
  status: stub | draft | stable | needs-review
  updated: YYYY-MM-DD
  sources: [docs/design/<topic>/<doc>.md, "<code-root>/.../Bar.cs"]
  ---
  ```
- **`status:` convention — the built-vs-designed legibility signal.** `status` is the at-a-glance answer to *"can I trust this as the built product?"*, so it carries weight:
  - **`stable`** — documents a **built, accepted** system and is **verified accurate against the current code** (re-read this session / recently). The trustworthy as-built layer.
  - **`draft`** — in progress, **mixes built with not-yet-built / design-intent**, or has not been re-verified against current code. Most pages that touch design rationale stay `draft`.
  - **`stub`** — minimal placeholder.
  - **`needs-review`** — suspected drift; flag for a lint/verify pass.

  Keep the page's `status` and its `_(status)_` tag in `index.md` **in sync** — a mismatch is recurring drift. On `index.md` the trailing `_(stable)_` / `_(draft)_` is the scannable mirror of this field. Pure design intent does **not** live in the codex at all; it belongs to the process layer.
- **Cross-links:** link liberally between codex pages, and from a codex page to the process doc that holds its rationale. A link to a page that does not exist yet is fine — it flags a page worth writing. The link *syntax* is a project binding (see [Project bindings](#project-bindings)).
- **Cite everything.** Every non-obvious claim points to a source: a process doc (`docs/design/<topic>/<doc>.md`, `docs/features/<feature>/architecture.md`) or code (a path plus the symbol or line). If a claim has no source, mark it `(unverified)` or `(design intent, not yet built)`.
- **Paths** to code and project files are written **relative to the project root** — stable no matter which page cites them.
- **Dates are absolute** (`2026-09-01`), never "today" / "last week".
- **Start from a template** in `templates/`.

## `index.md`

The content catalog — your first stop when answering a query. Grouped by domain. Each entry:

```
- [page-name] — one-line summary. _(status)_
```

Update `index.md` **and** the relevant per-domain `_index.md` hub on **every** ingest (add new pages, revise summaries when a page's scope changes). Updating one but not the other is recurring drift.

## `log.md`

Append-only chronological record. Newest entries at the bottom. Every entry starts with a fixed prefix so the log is greppable (`grep "^## \[" log.md | tail`):

```
## [YYYY-MM-DD] <op> | <title>
```

`<op>` is one of `ingest`, `query`, `lint`, `decision`. Follow the header with a few bullets: what changed, which pages were touched, open questions raised.

## Operations

### Ingest (writing the product layer)

Codex pages are written **after** implementation, not before. Triggers: a feature reaches **G2** (document what was built); the live code changes (update the affected `code/` pages); an external reference worth recording. Design work does **not** ingest here. Then:

1. Read the source fully — the accepted feature with its design / requirement / architecture docs, and/or the live code.
2. Discuss key takeaways with the human; agree on what matters.
3. Create or update the relevant domain page(s) from the right template, citing the process docs and the code. A single source may touch many pages — update all of them.
4. Fix cross-references: link the new/changed pages to and from related pages.
5. Update `index.md` and the per-domain `_index.md` hub(s).
6. Append a `## [date] ingest | <title>` entry to `log.md`.

During an ingest, treat the process docs as **read-only** — by G2 they are locked. Authoring them happens earlier, in the design and implementation tracks.

### Query

The human asks a question:

1. Read `index.md`, then drill into the relevant pages.
2. Answer with citations to codex pages and their underlying sources.
3. **Offer to file good answers back into the codex** as a new page (a comparison, an analysis, a discovered connection) so the exploration compounds instead of vanishing into chat.

### Lint

On request, health-check the codex and report — **do not silently fix structural problems; propose**:

- contradictions between pages,
- stale claims a newer source supersedes,
- **code drift** (see below),
- **layer violations**: design/process content that landed in the codex, or product pages written before their feature was accepted (G2),
- orphan pages (no inbound links),
- concepts referenced but lacking their own page,
- missing cross-references,
- data gaps worth a new source.

## Code is a live source

Unlike locked process docs, the codebase **changes**. Therefore:

- `code/` pages cite specific paths and symbols (`<code-root>/.../Foo.cs`, class/method names) — not vague descriptions.
- Treat code citations as **drift-prone**. During lint (or before relying on a code page), re-read the cited code and flag any divergence inline as `> ⚠️ drift: <what changed>`.
- **The codebase, not a codex page, is the source of truth for what the code does.** The codex records *how it's organized and why*.

## Domain guide

| Domain | Holds | Example page types |
|---|---|---|
| `code` | the product as built | architecture overview, a runtime system, data contracts, rendering pipeline |
| `art` | how it looks | art direction, visual language, palette, look-of-shaders, reference boards |
| `narrative` | the fiction | world & timeline, factions, entity classes, crew, characters, tone |
| `audio` | how it sounds | sound-design direction, VO, music/score direction |
| `production` | how it's made | dev phases, milestones, pipeline/workflow, decision records (ADRs) |
| `vr-ux` *(optional)* | player interaction as built | seated-play layout, voice-command grammar, comfort/locomotion, diegetic UI |

**Design is not a codex domain.** The product-as-designed (loops, mechanics, encounters, balance) lives in the process layer. Systems *as built* are documented under `code/`, citing their design rationale. `production/` holds only genuine process and tooling decisions.

## Templates

Copy from `templates/` when creating a codex page:

- `system-page.md` — a built code/runtime system
- `concept-page.md` — a mechanic, pillar, or concept as realized
- `entity-page.md` — an in-world entity: a vehicle, faction, crew role, character, or location
- `decision-record.md` — a production decision (ADR); design decisions live in the process layer
- `source-summary.md` — a summary of an ingested source doc

## Golden rules

1. **Never invent facts.** If a source doesn't say it, don't assert it — mark it unverified or ask.
2. **Always cite.** Trace every claim to a process doc or to code.
3. **Flag contradictions, don't bury them.** When a new source conflicts with an existing page, surface both and note the conflict; don't silently overwrite.
4. **Keep bookkeeping current** in the same pass — pages, cross-links, `index.md`, the `_index` hubs, `log.md`.
5. **Co-evolve this schema.** When we adopt a new convention, write it here.

## Project bindings

This schema is generic. Each project fills these in — replace the placeholders below on adoption, and keep them current.

| Binding | Value | Notes |
|---|---|---|
| Game / project name | `<Project Name>` | Use this everywhere in codex prose. |
| Repository / workspace folder name | `<workspace-folder>` | Only relevant when citing code paths; may differ from the project name. |
| Code root | `<code-root>` | e.g. `Assets/<Project>/Scripts/` — the prefix every code citation starts from. |
| Reader tool | `<tool>` | The editor or viewer the human reads the codex in. |
| Link convention | `[[bare-filename]]` **or** relative Markdown links | Use `[[bare-filename]]` only if the reader tool resolves bare-filename links across the whole tree; otherwise use relative links (`../code/foo.md`). Pick one and use it everywhere. |
| Prose wrap | one logical line per paragraph **or** hard-wrapped at N columns | Match what the reader tool renders correctly; a tool that treats a single newline as a line break needs one logical line per paragraph. |
| Extra domains | `<none>` | e.g. enable `vr-ux/`, or add a project-specific domain. Record it in the Domain guide table above when you do. |
| Codex location | `docs/codex/` | The default binding. A project may bind its codex elsewhere — for example to an existing wiki — in which case record the root here and keep this schema at that root. |
