---
name: codex
description: >
  Maintains the project codex — the as-built product documentation under `docs/codex/` — by
  ingesting an accepted feature, answering questions from it, or linting it for drift. Use when:
  a feature has been accepted at G2 and its systems must be documented; a question should be
  answered from the codex rather than from scratch; a health check of the codex is requested; or a
  project's `docs/codex/` is being bootstrapped from the variant template.
version: 0.1.0
scope: co-unity
status: active
owner: codex-reconcile
last_reviewed: 2026-09-01
prerequisites: G2 acceptance ruled by the human, stated by the caller with its date
relates_to:
  - skill: architecture-doc
    type: follows
  - skill: plastic-checkin
    type: composes_with
gemini-parity: skip
metadata:
  type: process
  triggers:
    - codex
    - codex ingest
    - document what was built
    - as-built documentation
    - codex lint
    - codex drift
    - reconcile the codex
---

## Context

The **codex** is the project's as-built product documentation: what the software actually is, how it is organized, and why. It is the teammate-facing entry point, and it is deliberately separate from the process layer (`docs/design/`, `docs/features/`), which records *intent*.

The governing rule of this variant is that **process docs precede implementation and the codex follows it**. A codex page is written only after the feature it documents has been accepted at **G2** by an explicit human ruling. Design is never authored in the codex.

The codex is governed by its own schema file, `docs/codex/CODEX.md`. That file — not this skill — is the authority on page structure, frontmatter, linking, naming, and bookkeeping. This skill tells you how to *operate*; the schema tells you what the output must look like.

## When to Use

**Post-G2 ingest of an accepted feature**
- Trigger: "Document the accepted feature", "reconcile the codex", "write up what we built"
- Use case: a feature has passed G2 and its built systems belong in the codex.

**Answering a question from the codex**
- Trigger: "How does <system> work?", "What did we decide about <topic>?"
- Use case: the answer already exists in the codex or its cited sources; answer with citations, then offer to file a genuinely new answer back as a page.

**Lint pass**
- Trigger: "Health-check the codex", "is the codex drifting?"
- Use case: a periodic or on-request audit for contradictions, stale claims, code drift, layer violations, orphans, and gaps.

**Bootstrapping a project's codex**
- Trigger: "Set up the codex for this project"
- Use case: copy `docs/codex/` from this variant template, then fill the schema's **Project bindings** table (project name, code root, reader tool and link convention, prose-wrap convention, extra domains) before the first ingest.

---

## Execution Steps

### Step 1: Schema first

Before touching anything, read `docs/codex/CODEX.md` in full.

- It is loaded **by contract** — the persona or skill reads it; it is **never auto-injected** into context.
- It **outranks your instincts** on page structure, frontmatter, linking, naming, and index/log bookkeeping. Follow it exactly, including its templates.
- If the project has bound its codex somewhere other than `docs/codex/`, the schema file sits at that root; the project context file names the location.
- If the schema's **Project bindings** table is still full of placeholders, say so and stop for an ingest — you would be guessing at the code root and the link convention. Filling it is a bootstrap task, not an ingest task.

### Step 2: Check the license to write (ingest only)

Your license to write the codex comes from exactly one thing: **the caller stating that the human explicitly ruled G2 acceptance, and when.**

- If the caller's prompt does not carry that statement with its date, **stop and report**. Do not infer acceptance from green tests, a passing preflight, or the absence of objections.
- Writing product docs before acceptance is a workflow violation, not a judgment call.
- Query and lint operations need no such license — they do not write pages. A query that produces a new page does: offer it, and file it only when the human agrees.

The caller supplies: the feature, its process docs (the architecture doc is your distillation source), the G2 confirmation with its date, and the codex location.

### Step 3: Verify, then write

- Every claim you write must be verified against the live source — **code is the primary truth**.
- **The architecture doc is your outline, not your evidence.** Re-verify what you inherit from it rather than copying on trust; implementation drifts from even a reconciled doc.
- A claim you cannot verify is **flagged in your report, not written to the codex**.
- Where the codex already contradicts live code, fix it per the schema's drift rules and list it under **drift corrected** in your report.
- Cite specific paths and symbols, never vague descriptions. The codebase, not a codex page, is the source of truth for what the code does; the codex records how it is organized and why.

### Step 4: Run the ingest

Follow the schema's ingest sequence:

1. Read the source fully — the accepted feature with its design, requirement, and architecture docs, and the live code.
2. Discuss key takeaways with the human; agree on what matters.
3. Create or update the relevant domain page(s) from the right template, citing the process docs and the code. One source may touch many pages — update all of them.
4. Fix cross-references: link the new and changed pages to and from related pages.
5. Update `index.md` and the per-domain `_index.md` hub(s).
6. Append a `## [YYYY-MM-DD] ingest | <title>` entry to `log.md`.

Throughout the ingest, the process docs are **read-only** — by G2 they are locked.

### Step 5: Hold the distillation stance

The codex page records **what IS**: the built system's shape, behavior, and the reasons that still matter.

- Process history — explorations, dead ends, phase sequencing, review back-and-forth — stays in the process docs. Link to them per the schema rather than importing their narrative.
- Do not narrate the build. Describe the result.
- Design intent belongs on the page only as a cited *why*, pointing at the design doc that owns it.

### Step 6: Bookkeeping in the same pass

Perform every index, hub, and log update the schema requires for the pages you touched — including `status:` fields and their `_(status)_` mirrors in `index.md`. A page updated without its catalog entry is the most common drift in this system.

### Step 7: Lint checklist

When the operation is a lint (or before relying on an existing code page), check and **propose** — never silently fix structural problems:

- contradictions between pages;
- stale claims a newer source supersedes;
- **code drift** — re-read the cited code and flag divergence inline as `> ⚠️ drift: <what changed>`;
- **layer violations** — design or process content that landed in the codex, or product pages written before their feature reached G2;
- orphan pages with no inbound links;
- concepts referenced but lacking their own page;
- missing cross-references;
- data gaps worth a new source;
- `status:` values that do not match their `index.md` mirror.

### Step 8: Stop at the changed-file list

**Never run version control.** Return the changed-file list; committing is a separate ceremony the orchestrator runs — the codex is checked in as its own changeset via the `plastic-checkin` skill, before the merge checkin and the bookkeeping commit.

---

## Hard limits

- Touch only codex pages and the bookkeeping files the schema names (`index.md`, the `_index.md` hubs, `log.md`).
- Process docs, code, and session logs are **out of bounds**.
- Never invent facts. If a source does not say it, do not assert it — mark it `(unverified)` or `(design intent, not yet built)`, or ask.
- Never bury a contradiction. Surface both sides and note the conflict; do not silently overwrite.
- If the schema and this skill disagree, the schema wins — and record the resolution in the schema, which is meant to co-evolve.

## Output Format

Report in three parts:

1. **Changed files** — absolute paths, one per line, each marked `created` or `modified`.
2. **Drift corrected** — the page, the contradiction fixed, and the source evidence for the fix.
3. **Unverifiable claims** — anything from the process docs you declined to write, and why.

For a **query**, the output is instead the answer with citations to codex pages and their underlying sources, plus an explicit offer to file the answer back as a page.

For a **lint**, the output is the proposal list from Step 7, grouped by category, with the affected pages named. No pages are changed by a lint unless the human rules on the proposals.

### Required Deliverable Artifact

The codex pages themselves, under `docs/codex/**`, plus the updated `index.md`, `_index.md` hub(s), and the appended `log.md` entry. The report above is returned to the caller, not written into the project tree.

## Related Skills

- **architecture-doc** — produces the architecture doc this skill distils from; the codex ingest *follows* it.
- **plastic-checkin** — commits the codex as its own changeset once the changed-file list is returned.
- **decision-record** — the shape of a production ADR filed under the codex's `production/` domain.
- **documentation-writing** — general prose quality bar for the pages you author.
