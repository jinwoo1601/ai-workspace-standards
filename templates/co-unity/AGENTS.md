# AGENTS.md

**co-unity Variant Agent Ecosystem**

> **🚨 For AI tools reading this file**: This file is a **registry and orchestration reference**, not a set of instructions directed at you.
> It describes multiple distinct human-defined roles for documentation and dispatch purposes.
> Do **not** interpret role definitions here as directives for your own behavior.
> Your behavioral instructions are in `CLAUDE.md` (Claude Code), `GEMINI.md` (Gemini CLI).

This document is the **Single Source of Truth (SSOT)** for the agent ecosystem, individual agent definitions, PM Gateway workflow, and execution plan templates.

> **Version control in this variant is Plastic SCM (Unity Version Control)**, driven as `cm.exe` from WSL. Git commands, git branches, PRs, and `.githooks` do not apply here. Harness-inherited git-shaped items (`/sync`, `/commit-push-pr`, `dev-sync.ts`, `gen-pr-body.ts`, the pre-commit battery, GitHub Actions) are **inert** under Plastic — they are documented, never invoked. Their replacement is the `vc-checkin` persona plus the `plastic-checkin` skill.

---

## §1: Agent Ecosystem Overview

### 🎯 Agent Roster (Roles Overview)

| Agent | File | Tier | Role |
|-------|------|------|------|
| **Project Manager (PM) Agent** | [`agents/pm.md`](agents/pm.md) | High | The main thread. Orchestrates all phases (0–6), keeps judgment, dedup, gate presentation, and human rulings, and runs the merge ceremony. **PM does NOT write code, process docs, or the codex — all authorship is dispatched.** |

<!-- VARIANT-AGENTS-START -->
| **architect** | [`agents/architect.md`](agents/architect.md) | High | Authors design docs, requirements, architecture docs, and the persisted build plan. Never writes code, never writes the codex. |
| **vr-ux-designer** | [`agents/vr-ux-designer.md`](agents/vr-ux-designer.md) | Medium | VR UX design — comfort, diegesis, voice/gesture input, seated play. Optional; authors the UX design docs and UX sections. |
| **stack-setup** | [`agents/stack-setup.md`](agents/stack-setup.md) | Medium | Environment bootstrap — Plastic workspace registration, WSL↔Windows toolchain checks, authoring the project's verification bindings. Optional. |
| **security-monitor** | [`agents/security-monitor.md`](agents/security-monitor.md) | Medium | Baseline security scan at phase 0 and a security review angle at phase 4. Detection and reporting only. Optional. |
| **code-mapper** | [`agents/code-mapper.md`](agents/code-mapper.md) | Medium | Read-only inventory of the existing code surface for a feature, including assembly/asmdef boundaries. Runs before planning. |
| **doc-extractor** | [`agents/doc-extractor.md`](agents/doc-extractor.md) | Medium | Read-only extraction of what the existing process docs already decide about a feature. Runs in parallel with code-mapper. |
| **plan-validator** | [`agents/plan-validator.md`](agents/plan-validator.md) | High | Audits the persisted plan against canon (requirements, architecture, design ADRs). A canon conflict stops the line. |
| **code-writer** | [`agents/code-writer.md`](agents/code-writer.md) | Medium | Writes and fixes code and tests from the persisted plan, with Unity guardrails (`.meta`, asmdef, serialized fields). Never runs version control. |
| **test-runner** | [`agents/test-runner.md`](agents/test-runner.md) | Medium | Runs the bound verification commands and reports honestly. Never edits, never invents a build command. |
| **review-angle** | [`agents/review-angle.md`](agents/review-angle.md) | High | One review angle per dispatch against the reviewed base revision. Read-only; produces findings, never fixes. |
| **finding-verifier** | [`agents/finding-verifier.md`](agents/finding-verifier.md) | High | Independently verifies one surviving finding before it reaches the human. Negative results are findings. |
| **gate-preflight** | [`agents/gate-preflight.md`](agents/gate-preflight.md) | Medium | Evidence audit before the G2 gate. Preflight PASS is not acceptance — it is only evidence for the human's ruling. |
| **codex-reconcile** | [`agents/codex-reconcile.md`](agents/codex-reconcile.md) | High | Writes the codex (as-built docs) — schema first, and only after the human has ruled G2. |
| **vc-checkin** | [`agents/vc-checkin.md`](agents/vc-checkin.md) | Medium | The `cm.exe` check-in ceremony: status → categorize → re-register → add → checkin → verify. Returns `cs:N` or `BLOCKED`. |
<!-- VARIANT-AGENTS-END -->
---

## §2: Individual Agent Definitions

See [`agents/pm.md`](agents/pm.md) for the PM Agent full definition.

<!-- VARIANT-AGENT-DETAILS-START -->
### architect

| Field | Value |
|-------|-------|
| **File** | [`agents/architect.md`](agents/architect.md) |
| **Tier** | high |
| **Phases** | 1, 2 |
| **Role** | Authors process docs — design docs, design ADRs, the feature backlog, requirements, architecture, and the persisted build plan. Use when a design topic is being written up or a feature is being planned. |
| **Access** | write — `docs/design/**`, `docs/features/**`; process docs and the persisted plan only; never code, never the codex |

### vr-ux-designer

| Field | Value |
|-------|-------|
| **File** | [`agents/vr-ux-designer.md`](agents/vr-ux-designer.md) |
| **Tier** | medium |
| **Phases** | 1 |
| **Role** | VR user-experience design — comfort and locomotion, diegetic interfaces, voice and gesture input, seated play. Optional; skipped when no VR UX surface is in scope. |
| **Access** | write — `docs/design/vr-ux/**` and the UX sections of design docs |

### stack-setup

| Field | Value |
|-------|-------|
| **File** | [`agents/stack-setup.md`](agents/stack-setup.md) |
| **Tier** | medium |
| **Phases** | 0 |
| **Role** | Environment bootstrap. Verifies `cm.exe`, `dotnet.exe`, and `Unity.exe` are reachable from WSL, registers the Plastic workspace, and authors `docs/verification-bindings.md`. Optional; skipped when the environment is already bound. |
| **Access** | write — `docs/verification-bindings.md`, `ignore.conf`, environment/config files only |

### security-monitor

| Field | Value |
|-------|-------|
| **File** | [`agents/security-monitor.md`](agents/security-monitor.md) |
| **Tier** | medium |
| **Phases** | 0, 4 |
| **Role** | Baseline security scan at environment bootstrap and an optional security angle during the review cycle: secret scanning, dependency and package audit, secrets confined to `.env`. Detection and reporting only. |
| **Access** | read-only — none |

### code-mapper

| Field | Value |
|-------|-------|
| **File** | [`agents/code-mapper.md`](agents/code-mapper.md) |
| **Tier** | medium |
| **Phases** | 2, 4 |
| **Role** | Produces a read-only inventory of the code surface a feature will touch — types, call sites, assembly/asmdef boundaries, and the seams a plan must respect. Recon always precedes planning. |
| **Access** | read-only — none |

### doc-extractor

| Field | Value |
|-------|-------|
| **File** | [`agents/doc-extractor.md`](agents/doc-extractor.md) |
| **Tier** | medium |
| **Phases** | 2 |
| **Role** | Extracts what the existing process docs (`docs/design/`, `docs/features/`) already decide about a feature, so planning does not re-decide settled questions. Runs in parallel with code-mapper. |
| **Access** | read-only — none |

### plan-validator

| Field | Value |
|-------|-------|
| **File** | [`agents/plan-validator.md`](agents/plan-validator.md) |
| **Tier** | high |
| **Phases** | 2 |
| **Role** | Audits the persisted build plan against canon — the requirements doc, the architecture doc, and the locked design ADRs. A canon-conflict finding stops the line and reopens the design with the human. |
| **Access** | read-only — none |

### code-writer

| Field | Value |
|-------|-------|
| **File** | [`agents/code-writer.md`](agents/code-writer.md) |
| **Tier** | medium |
| **Phases** | 3, 4 |
| **Role** | Writes and fixes code and tests strictly from the persisted plan, under the Unity guardrails: `.meta` discipline, asmdef boundaries, serialized-field rename safety, main-thread-only APIs, call-site audits across every directory the project binds. |
| **Access** | write — project source tree, tests, and the `.meta` files of assets/folders it creates; never process docs, never the codex, never version-control commands |

### test-runner

| Field | Value |
|-------|-------|
| **File** | [`agents/test-runner.md`](agents/test-runner.md) |
| **Tier** | medium |
| **Phases** | 0, 3, 4, 5 |
| **Role** | Runs the bound verification commands (Mode A: run; Mode B: parse a supplied log) and reports honestly — quirk attribution against the dated baselines, and "0 tests ran" with compile errors in the log is a FAIL. Never invents, modifies, or "fixes" a build command. |
| **Access** | read-only — none; runs the bound verification commands, never edits |

### review-angle

| Field | Value |
|-------|-------|
| **File** | [`agents/review-angle.md`](agents/review-angle.md) |
| **Tier** | high |
| **Phases** | 4 |
| **Role** | Reviews the change from exactly one assigned angle against the reviewed base revision (`cm.exe cat "path#cs:N"`). Produces findings with evidence; never fixes, never rules. |
| **Access** | read-only — none |

### finding-verifier

| Field | Value |
|-------|-------|
| **File** | [`agents/finding-verifier.md`](agents/finding-verifier.md) |
| **Tier** | high |
| **Phases** | 4 |
| **Role** | Independently verifies one surviving finding and returns CONFIRMED, REFUTED, or CONFIRMED-AS-CLARITY with decisive evidence. No finding reaches the human unverified; a negative result is itself a finding. |
| **Access** | read-only — none |

### gate-preflight

| Field | Value |
|-------|-------|
| **File** | [`agents/gate-preflight.md`](agents/gate-preflight.md) |
| **Tier** | medium |
| **Phases** | 5 |
| **Role** | Audits the evidence before the G2 gate: deliverables present, verification green, review rulings applied, bookkeeping current (the `memory/workflow.md` row matches reality). Reports PASS or FAIL with the closing line. |
| **Access** | read-only — none; `cm.exe status/log/find/cat` only |

### codex-reconcile

| Field | Value |
|-------|-------|
| **File** | [`agents/codex-reconcile.md`](agents/codex-reconcile.md) |
| **Tier** | high |
| **Phases** | 5 |
| **Role** | Writes the codex — the as-built, teammate-facing documentation. Schema first: it reads `docs/codex/CODEX.md` before writing anything. Dispatched only after the human has ruled G2. |
| **Access** | write — `docs/codex/**` (pages plus the bookkeeping files the schema names) only |

### vc-checkin

| Field | Value |
|-------|-------|
| **File** | [`agents/vc-checkin.md`](agents/vc-checkin.md) |
| **Tier** | medium |
| **Phases** | 1, 2, 3, 4, 5, 6 |
| **Role** | Runs the check-in ceremony — status → categorize → re-register → add → checkin → verify — and returns `cs:N` or `BLOCKED`. Never edits file content. Never merges. |
| **Access** | write — version-control state only (`cm.exe add / checkout / remove / ci / status`); never `merge`/`switch`/`undo`/shelve unless the caller instructs that exact operation |
<!-- VARIANT-AGENT-DETAILS-END -->
---

## §3: PM Gateway Workflow

**Integrated from pm.md, CLAUDE.md §5, GEMINI.md §5**

### §3.1 PM Gateway Policy

**Single Point of Entry**: PM is the ONLY agent that users may directly invoke.
All specialist agents require PM dispatch - enforced at 4 levels.

#### §3.1.1 PM Direct Execution Scope

PM is an escalation gateway, not an executor. **⚠️ CRITICAL**: PM MUST NOT perform Write/Edit on any file except `memory/*.md` and `CHANGELOG.md`. All file authorship MUST be dispatched to specialists. See [PM Direct Execution Constraints](agents/pm.md) in `agents/pm.md`.

| Category | Tools | Scope |
|----------|-------|-------|
| Unconditional | Read, Glob, Grep, dispatch, task tracking, question-asking, Skill | Always allowed |
| Conditional | Write, Edit | `memory/*.md` and `CHANGELOG.md` only |
| Conditional | Bash | Read-only: `cm.exe status`, `cm.exe log`, `cm.exe find`, `cm.exe cat`, `bun scripts/audit.ts`, `ls`, `cat` |
| Carve-out | Bash | The `cm.exe` merge ceremony (see below) — an operational action, not authorship |
| Forbidden | Write, Edit (all other paths) | Must delegate to a specialist |
| Forbidden | Bash (write/execute patterns other than the merge ceremony) | Must delegate to a specialist |

**PM Direct Execution carve-out (co-unity).** The PM is the main thread, and the main thread runs the **merge ceremony** itself: `cm.exe` merge, conflict triage, and the merge check-in. This is an operational action on version-control state, not authorship of file content, which is why it sits with the PM rather than with `vc-checkin` — `vc-checkin` never merges. Content conflicts are **not** resolved by the assistant: they are handed to the human's Windows Mergetool with the documented click path, and the PM waits. Everything else about the PM's Write/Edit limit still stands: outside `memory/*.md` and `CHANGELOG.md`, the PM does not author files. Verification never runs on the main thread either — `test-runner` runs it.

**Rationale**: PM is orchestrator and judge, not author. Direct authorship violates governance separation of concerns.

When a specialist agent's required tool is denied, PM applies the [Permission Denial Protocol](#38-permission-denial-protocol) — never substitutes for the specialist.

#### §3.1.2 PM Role Boundaries

**What PM Does**:
- Orchestrate the two tracks (design and implementation) across phases 0–6
- Create execution plans and dispatch specialists
- Deduplicate review findings and present them to the human for a ruling
- Present G0 / G1 / G2 gates and record the human's ruling with the date
- Run the merge ceremony and hand content conflicts to the human's Mergetool
- Keep bookkeeping: `memory/workflow.md` (one row per active branch, removed on merge) and the daily session log

**What PM Does NOT Do**:
- Directly Edit/Write files (except `memory/*.md`, `CHANGELOG.md`)
- Write code, tests, process docs, or the codex
- Run verification — that is `test-runner`'s job, never the main thread's
- Run check-ins — that is `vc-checkin`'s job
- Rule its own gates — G1 and G2 belong to the human

**Task Owner vs Executor Distinction**:
- **Task owner (PM)**: "Buck stops here" responsible person for tracking progress
- **Task executor (specialist)**: Agent who performs the actual work
- PM creates tasks (owner: pm), dispatches specialists (executor: `[specialist agent]`), and updates task status upon completion

**User Communication for Specialist Tasks**:
When work requires specialist delegation, PM uses the following template:
```
PM: 🔍 [Task Analysis] This task falls within the [specialist] domain of expertise.
   Task: [description]
   Specialist: [specialist name]
   Reason: [why specialist needed]
PM: Shall I dispatch [specialist]?
User: "Yes"
PM: ▶️ [specialist] dispatch...
```

See [agents/pm.md](agents/pm.md) for complete role definition and delegation protocols.

#### §3.1.3 Enforcement Layers
1. **Tool-Level**: The dispatch tool rejects non-PM specialist calls (hard enforcement)
2. **System Prompt-Level**: CLAUDE.md/GEMINI.md rules loaded first
3. **Agent File-Level**: All specialists have a "PM-ONLY INVOCATION" section
4. **QA Gate-Level**: `bun scripts/audit.ts` detects bypass at close-out

#### §3.1.4 Specialist Agent Dispatch Flow
```
User Request → PM Triage → Recon → Plan → Human Gate → Specialist Dispatch → Verification → Human Gate → Close-out
```

#### §3.1.5 Specialist Agent Roster (PM-ONLY INVOCATION)

All specialist agents below are dispatched ONLY through PM:

<!-- VARIANT-DISPATCH-TRIGGERS-START -->
| `architect` | Phase 1, Phase 2 | "write the design doc", "write the requirements", "write the architecture doc", "persist the build plan" |
| `vr-ux-designer` | Phase 1 | "VR comfort/locomotion", "diegetic UI", "voice or gesture input", "seated play ergonomics" |
| `stack-setup` | Phase 0 | "the toolchain is not bound", "register the Plastic workspace", "author the verification bindings" |
| `security-monitor` | Phase 0, Phase 4 | "baseline security scan", "secret scan", "dependency/package audit", "security review angle" |
| `code-mapper` | Phase 2, Phase 4 | "what does the code already do here", "inventory the call sites", "which assemblies does this cross" |
| `doc-extractor` | Phase 2 | "what do the process docs already decide", "extract the locked constraints for this feature" |
| `plan-validator` | Phase 2 | "audit the persisted plan", "does the plan contradict canon" |
| `code-writer` | Phase 3, Phase 4 | "implement the persisted plan", "apply the fix rulings", "write the tests" |
| `test-runner` | Phase 0, Phase 3, Phase 4, Phase 5 | "run the bound verification", "parse this build log", "run the full battery before the gate" |
| `review-angle` | Phase 4 | "review this change from angle X", "run the review roster" |
| `finding-verifier` | Phase 4 | "verify this finding before I present it" |
| `gate-preflight` | Phase 5 | "preflight the acceptance gate", "is the evidence complete" |
| `codex-reconcile` | Phase 5 | "write the codex pages" — only after the human has ruled G2 |
| `vc-checkin` | Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, Phase 6 | "check this in", "commit the bookkeeping as its own changeset" |
<!-- VARIANT-DISPATCH-TRIGGERS-END -->

**Delegation policy (co-unity)**

- **Verification never runs on the main thread.** The PM does not run builds or test suites to "just check" (`bun scripts/audit.ts` is harness QA, not verification, and stays in the PM's read-only scope). `test-runner` runs every bound command and reports; the PM reads the report.
- **Recon before planning.** `code-mapper` and `doc-extractor` are dispatched in parallel (read-only) before `architect` writes requirements or an architecture doc. Planning on an unmapped surface is a defect, not a shortcut.
- **Reviews only via the `feature-review` procedure, never ad hoc.** One dispatch per roster angle, main-thread dedup, then one `finding-verifier` per surviving finding. A finding never reaches the human unverified, and no fix is applied unruled.
- **`codex-reconcile` only after G2**, and the dispatch itself must state the ruling and the date (`G2 ruled by the human on YYYY-MM-DD`). If the dispatch cannot state it, the gate has not happened.
- **Every check-in goes through `vc-checkin`**, and bookkeeping is always a **separate** changeset from work. At close-out the order is: codex commit → merge check-in (PM's ceremony) → bookkeeping commit — three changesets, in that order. The design track closes with two: merge check-in → bookkeeping commit (no codex).

**⚠️ IMPORTANT**: Do NOT invoke any specialist agent directly. All requests must go through PM.

> **Execution Plan Format**: For mandatory criteria, boilerplate table, and rules, see [§5 Execution Plan Templates](#5-execution-plan-templates). For platform-specific dispatch instructions, see [CLAUDE.md §5](CLAUDE.md) or [GEMINI.md §5](GEMINI.md).

### §3.5 Phase Determination (Deliverable-Type Gate)

Before assigning an agent to any task, PM MUST classify the deliverable type:

| Deliverable Type | Phase | Required Agent | Tier | Notes |
|------------------|-------|----------------|------|-------|
| New file design, schema definition, ADR | Phase 1-2 | `[design specialist]` | High | Must precede implementation |
| New directory structure, template layout | Phase 1-2 | `[design specialist]` | High | Must precede implementation |
| Cross-platform convention, naming standard | Phase 1-2 | `[design specialist]` | High | Must precede implementation |
| Script/tool implementation (approved plan exists) | Phase 3 | `[implementation specialist]` | Medium | Persisted plan required |
| Documentation update | Phase 5 | `[docs specialist]` | Medium | |
| Security configuration | Phase 0 | `[security specialist]` | Medium | |
| Project setup | Phase 0 | pm | Medium | PM orchestrates; `stack-setup` executes |

<!-- VARIANT-PHASE-GATE-START -->
### Phase Gate (co-unity)

| Deliverable Type | Phase | Agent | Tier | Notes |
|-------------------|-------|-------|------|-------|
| Toolchain reachability, Plastic workspace registration, `docs/verification-bindings.md` | Phase 0 | `stack-setup` | Medium | Optional — skip when the bindings already exist and run green. A binding that cannot be run is not bound: stop, never improvise a build command |
| Baseline verification run, dated baselines recorded | Phase 0 | `test-runner` | Medium | Every binding runs once; the result is the baseline the later runs are attributed against |
| Baseline security scan | Phase 0 | `security-monitor` | Medium | Optional — detection and reporting only, never modifies source or dependency files |
| Design doc for a topic (intent, immutable once locked) | Phase 1 | `architect` | High | On a `design-<topic>` branch, after G0. The codex is untouched throughout |
| VR UX design doc / UX sections | Phase 1 | `vr-ux-designer` | Medium | Optional — skip when no VR UX surface is in scope |
| Design ADR for a contested fork | Phase 1 | `architect` | High | `docs/design/<topic>/decisions/adr-NNNN-<slug>.md` — shared sequence, check the highest number on disk first |
| Feature backlog (`docs/design/<topic>/backlog.md`, name + one-line scope each) | Phase 1 | `architect` | High | **Only after G1 is ruled by the human, in conversation, with the date** |
| Code inventory / doc extract (recon) | Phase 2 | `code-mapper` ∥ `doc-extractor` | Medium | Read-only, dispatched in parallel, always before planning |
| Requirements doc | Phase 2 | `architect` | High | Testable, scoped contract for one buildable feature |
| Architecture doc + persisted build plan | Phase 2 | `architect` | High | ONE phase; persisted under the architecture doc's `## Build plan`. The plan does not exist until it is persisted |
| Plan audit against canon | Phase 2 | `plan-validator` | High | A canon-conflict finding stops the line — reopen the design with the human, do not patch it silently |
| Source and test implementation | Phase 3 | `code-writer` | Medium | Strictly from the persisted plan. `.meta` for every new asset and folder; asmdef boundaries respected |
| Verification report | Phase 3, 4, 5 | `test-runner` | Medium | Loop code-writer ↔ test-runner at most 3 times, then escalate to the PM |
| Review findings, one angle per dispatch | Phase 4 | `review-angle` | High | Against the reviewed base revision. Never fixes, never rules |
| Verified findings | Phase 4 | `finding-verifier` | High | One per surviving finding after main-thread dedup. Human rules fix / defer / reject per finding |
| Security review angle | Phase 4 | `security-monitor` | Medium | Optional |
| Ruled fixes applied | Phase 4 | `code-writer` | Medium | Only rulings marked fix; surgical; the reviewed code's shape is canon |
| Preflight evidence audit | Phase 5 | `gate-preflight` | Medium | PASS is evidence for the human's ruling, never the ruling itself |
| Codex pages (as-built) | Phase 5 | `codex-reconcile` | High | **Only after G2**, with the ruling and date stated in the dispatch. Schema first: read `docs/codex/CODEX.md` |
| Changeset (`cs:N`) | Phase 1, 2, 3, 4, 5, 6 | `vc-checkin` | Medium | Bookkeeping is always its own changeset, separate from work |
| Merge record | Phase 1, 6 | pm | High | The merge ceremony runs on the main thread — the design branch after G1, the feature branch after G2 and the codex commit; content conflicts go to the human's Mergetool |

### Human gates G0 / G1 / G2

Three gates in this variant belong to a human, not to the assistant. **G0** — a `design-<topic>` branch exists and the scope is agreed — opens the design track. **G1** locks a design: the intent is fixed and becomes immutable. **G2** accepts a feature: only after it may the codex be written, and only then does close-out begin.

**Nothing crosses G1 or G2 on the assistant's judgment. Do not proceed on silence, enthusiasm, or a 'looks good' about anything other than the gate itself. Preflight PASS is not acceptance. The gate ruling belongs to the human.**

A gate is ruled in conversation, in plain language, and the PM records the ruling with its date in `memory/workflow.md` (the row's stage, e.g. `locked(G1 2026-09-03)`) and in the session log. Every downstream dispatch that depends on a gate restates the ruling and date; if it cannot, the gate has not happened. If building reveals that a locked design decision is wrong, stop — reopen the design on a design branch, amend it, and re-lock at G1. Never silently patch a locked design mid-implementation.
<!-- VARIANT-PHASE-GATE-END -->

**Tier Ceiling Rule**: An agent's tier may NOT be elevated beyond its defined tier.

> **Execution Plan Boilerplate Policy**: For mandatory and discretionary boilerplate cases, see [§3 (PM Gateway Workflow)](#3-pm-gateway-workflow) above.


### §3.6 3-Tier Strategy

When leading execution and improvement tasks, PM MUST use the 3-Tier model strategy:

- **High-tier**: Complex reasoning, architectural design, planning, review judgment (claude-opus-5-0 / gemini-3.1-pro)
- **Medium-tier**: Implementation, verification, recon, check-ins (claude-sonnet-5-0 / gemini-3.7-flash)
- **Low-tier**: Fast, repetitive, strictly scoped tasks (claude-haiku-4-5 / gemini-3.7-flash)

### §3.7 Meeting Facilitation

When `/meeting` is invoked, the PM orchestrates structured multi-agent discussions.

**Meeting Process**:
1. **Open meeting**: Set agenda and objectives
2. **Facilitate dialogue**: Ensure all specialists contribute
3. **Synthesize outcomes**: Cross-domain agent synthesizes agreements
4. **Document results**: Write transcript to `memory/meeting-YYYY-MM-DD-[slug].md`

### §3.8 Permission Denial Protocol

When a specialist agent's required tool is denied, PM must **not** substitute for the specialist. Instead:

1. Identify the denial Type (A/B/C/D) using the classification in [`agents/pm.md`](agents/pm.md)
2. Output the Escalation Template immediately
3. Log the denial to `memory/YYYY-MM-DD.md`
4. Halt the blocked task — do not proceed without the required tool

---

<!-- COMMON-AGENTS:START -->
## Language Policy

**English-Only Documentation Rule**: All workspace documentation files (.md) must be written in English, with explicit exceptions for recognized locale translation zones and declared Korean legal/regulatory content (see Exceptions below).

### English Documentation Requirement
- All `.md` files outside `ko/` and `locales/ko/` directories MUST be in English
- Applies to: README.md, CLAUDE.md, GEMINI.md, AGENTS.md, context.md, CHANGELOG.md, all documentation in docs/, agents/, skills/
- Rationale: English documentation ensures global accessibility and cross-team collaboration

### Translation Zones (Locale Exceptions)
- `<lang-code>/` directories — language-specific documentation (e.g. `ko/`, `ja/`)
- `locales/<lang-code>/` — locale translation files for internationalization (e.g. `locales/ko/`, `locales/zh-CN/`)
- These are the ONLY locations where non-English `.md` files are permitted (except declared exceptions)
- Recognized locale codes (from `docs/workspace-schema.json` `i18n.locale_codes`):
  `ko`, `ja`, `zh-CN`, `zh-TW`, `de`, `es`, `fr`, `pt`, `vi`, `ms`, `id`, `th`, `ru`, `it`, `ar`

### Language Policy Exception — Korean Legal/Regulatory Content
The English-only policy admits a narrow exception for files where Korean is legally or academically mandatory. To declare an exception, add to the file's frontmatter:
```yaml
lang: ko
lang_reason: legal   # legal | source-material | proper-noun
```
- `legal`: Statutory texts, ordinances, regulations, contracts where Korean original has legal force.
- `source-material`: Primary source quotations where English translation would compromise academic accuracy or meaning.
- `proper-noun`: Files dominated by Korean proper nouns (institution/place/person names).

*Note: Exception is NOT available for: agents/*.md, skills/*.md, context.md, CLAUDE.md, GEMINI.md, AGENTS.md, or any variant context.md file.*

### Enforcement
- Pre-commit audit checks for Korean content outside ko/ and locales/ko/
- PR reviews reject non-English documentation outside translation zones
- Auditor validates compliance during Phase 6 QA gate

### Git/PR Artifacts Language Rule
- All commit messages: English
- All PR titles: English
- All PR descriptions: English
- All branch names: English
- Code comments: English (unless documenting locale-specific logic)

### Pluggable Variant Audit Hooks and Integrity Protection
- **Core Script Standardization**: The core synchronization and validation scripts (`scripts/dev-sync.ts` and `scripts/audit.ts`) must remain standardized and identical across all templates and variants. Direct modification of these core scripts in L2 projects is strictly forbidden.
- **Variant-Specific Audit Hook**: Variant projects requiring custom verification checks must implement them in a pluggable hook script located at `scripts/audit-variant.ts`.
- **Integrity Enforcement**: During template reconciliation (`l3-to-variant-pipeline.ts`), any modified core scripts will be automatically detected and will fail the reconciliation.
<!-- COMMON-AGENTS:END -->

---

## §4: Other Workflows

### §4.1 PM Subagent Dispatch Protocol

The PM agent follows a three-level inheritance model: **L0 (workspace root)** → **L1 (common template)** → **L2 (variant templates)**.

> **For PM Agent Architecture**: See [docs/co-unity.context.md](docs/co-unity.context.md) for the variant governance workflow, the L0→L1→L2 extends chain, and variant-specific configuration.

#### Dispatch Decision

```
Request received
  │
  ├─▶ Read-only? (recon, review angle, verification, preflight)
  │   └─▶ PARALLEL - dispatch multiple agents in a single message
  │
  └─▶ Write? (process docs, code, codex, check-ins)
       └─▶ SERIAL - one agent at a time to prevent file lock conflicts
```

> **Why serial writes?** Concurrent writes to the same files cause conflicts and lock contention — and under Plastic, a half-registered working set makes the next `cm.exe status` unreadable. Always wait for a write agent to complete before dispatching the next.

> **The canonical parallel pair** is recon: `code-mapper` ∥ `doc-extractor` at phase 2. The canonical parallel fan-out is the review roster: one `review-angle` dispatch per angle at phase 4.

#### Cost Optimization (3-Tier Strategy)

The PM uses a 3-tier model strategy to optimize cost and quality:

- **High-tier (Design/Judgment)**: `architect`, `plan-validator`, `review-angle`, `finding-verifier`, `codex-reconcile` — complex reasoning, canon checking, and review judgment.
- **Medium-tier (Build/Verify)**: `code-writer`, `test-runner`, `code-mapper`, `doc-extractor`, `vc-checkin`, `gate-preflight`, `stack-setup`, `vr-ux-designer`, `security-monitor` — implementation, verification, recon, and ceremony.
- **Low-tier**: not used by this variant's roster; every persona carries a real correctness burden.

**Tier Adjustment Rules:**
- The PM can dynamically downgrade an agent's Tier for simple tasks (Assigned <= Baseline) to save costs.
- The PM can NEVER upgrade a Tier above the baseline.
- If a downgraded task fails, the PM MUST restore the agent's baseline Tier for the retry.

> **Note on 3-Tier Strategy Models:**
> The exact model configurations and prompt arguments (e.g. `thinking_level`) are explicitly managed within the workspace configuration files (`CLAUDE.md` and `GEMINI.md`). Please refer to those files for your specific tool's exact AI model mappings and tier strategies.

#### Dispatch Rules

1. **Autonomous Agent Handoffs** - Agents hand off via the JSON contract in [`docs/handoff-spec.md`](docs/handoff-spec.md) for routine workflows
2. **PM Orchestration** - PM orchestrates every phase 0–6; it is the main thread, not a phase-limited coordinator
3. **QA Gate** - `bun scripts/audit.ts` runs at close-out; verification itself is `test-runner`'s, never the main thread's
4. **Parallel Agent Dispatch** - all parallel read-only agents must be dispatched in one turn (recon pair, review roster)
5. **Error handling** - if any parallel agent fails, the failure is resolved before proceeding. Do not skip
6. **Max iterations** - the `code-writer` ↔ `test-runner` loop runs at most 3 times before PM escalation to the human

#### Subagent Roster

| Agent | File | Tier | Parallelizable | Write Allowed? | Access |
|-------|------|------|:--------------:|:--------------:|--------|
| PM Orchestrator | `agents/pm.md` | High | - | orchestrates only | `memory/*.md`, `CHANGELOG.md`; carve-out: the `cm.exe` merge ceremony |

<!-- VARIANT-SUBAGENT-ROSTER-START -->
| architect | `agents/architect.md` | High | ⚠️ sequential preferred | process docs | write — `docs/design/**`, `docs/features/**`; never code, never the codex |
| vr-ux-designer | `agents/vr-ux-designer.md` | Medium | ⚠️ sequential preferred | process docs | write — `docs/design/vr-ux/**` and UX sections of design docs |
| stack-setup | `agents/stack-setup.md` | Medium | ⚠️ sequential preferred | config files | write — `docs/verification-bindings.md`, `ignore.conf`, environment/config files only |
| security-monitor | `agents/security-monitor.md` | Medium | ✅ | ❌ no | read-only — none |
| code-mapper | `agents/code-mapper.md` | Medium | ✅ | ❌ no | read-only — none |
| doc-extractor | `agents/doc-extractor.md` | Medium | ✅ | ❌ no | read-only — none |
| plan-validator | `agents/plan-validator.md` | High | ✅ | ❌ no | read-only — none |
| code-writer | `agents/code-writer.md` | Medium | ⚠️ sequential preferred | project files | write — source tree, tests, and the `.meta` files it creates; never process docs, never the codex, never VCS commands |
| test-runner | `agents/test-runner.md` | Medium | ✅ | ❌ no | read-only — none; runs the bound verification commands, never edits |
| review-angle | `agents/review-angle.md` | High | ✅ | ❌ no | read-only — none |
| finding-verifier | `agents/finding-verifier.md` | High | ✅ | ❌ no | read-only — none |
| gate-preflight | `agents/gate-preflight.md` | Medium | ✅ | ❌ no | read-only — none; `cm.exe status/log/find/cat` only |
| codex-reconcile | `agents/codex-reconcile.md` | High | ⚠️ sequential preferred | codex pages | write — `docs/codex/**` only |
| vc-checkin | `agents/vc-checkin.md` | Medium | ❌ never | version-control state | write — VCS state only (`cm.exe add / checkout / remove / ci / status`); never edits file content; never merges |
<!-- VARIANT-SUBAGENT-ROSTER-END -->

> **Agent frontmatter specification**: All agent files must include YAML frontmatter as defined in [docs/co-unity.context.md](docs/co-unity.context.md).

---

### §4.2 Two-Track Engineering Workflow

co-unity runs **two decoupled tracks**. Design docs capture *intent* and are immutable once locked; the codex describes the systems *as built* and is written only after acceptance. The two areas are never merged.

```
DESIGN TRACK (branch: design-<topic>)

Phase 0 - Environment bootstrap (PM-orchestrated)
  stack-setup binds the toolchain and authors docs/verification-bindings.md
  test-runner runs every binding once and records the dated baseline
  security-monitor takes the baseline scan
  → GATE: every binding runs green, or its failure is attributed to a documented quirk

Phase 1 - Design track (PM as gate keeper)
  G0: the design-<topic> branch exists and the scope is agreed with the human
  architect authors docs/design/<topic>/<system>.md — intent, not implementation
  vr-ux-designer authors the VR UX systems (optional)
  architect records each contested fork as docs/design/<topic>/decisions/adr-NNNN-<slug>.md
  → GATE G1: the human locks the design, in conversation, with the date
  architect writes the feature backlog (docs/design/<topic>/backlog.md, name + one-line scope each)
  vc-checkin checks in; PM runs the merge ceremony — design-<topic> into main; vc-checkin bookkeeping commit (stage: merged)

IMPLEMENTATION TRACK (branch: feat-<feature>)

Phase 2 - Feature planning (PM as coordinator)
  Orientation: read memory/workflow.md, cross-check cm.exe status --header; on a mismatch warn the human (another session may be mid-flight) and wait
  code-mapper ∥ doc-extractor (parallel, read-only) — recon always precedes planning
  architect writes docs/features/<feature>/requirements.md
  architect writes docs/features/<feature>/architecture.md incl. the persisted ## Build plan
  plan-validator audits the plan against canon
  → GATE: the plan is persisted and audited; a canon conflict stops the line

Phase 3 - Implementation (PM as coordinator)
  code-writer implements from the persisted plan
  test-runner runs the bound verification; loop at most 3x, then PM escalation
  → GATE: all bound gates green; .meta present for every new asset and folder

Phase 4 - Review cycle (PM as judge)
  PM writes the review brief to the session scratchpad, by absolute path
  review-angle ×N (one dispatch per roster angle) — parallel, read-only
  PM deduplicates on the main thread
  finding-verifier — one per surviving finding; nothing reaches the human unverified
  → the human rules each finding: fix / defer / reject
  code-writer applies only the fix rulings, surgically
  test-runner re-verifies

Phase 5 - Acceptance & codex (PM as gate keeper)
  gate-preflight audits the evidence — PASS is not acceptance
  test-runner runs the full bound battery; human-only gates need a recorded human statement
  → GATE G2: the human accepts the feature, in conversation, with the date
  codex-reconcile writes docs/codex/** — schema first, and only now
  vc-checkin checks the codex in as its own changeset

Phase 6 - Close-out (PM as owner)
  PM runs the merge ceremony on the main thread
  Content conflicts → the human's Windows Mergetool, documented click path
  vc-checkin records the bookkeeping commit as a separate changeset
  Order: codex commit → merge check-in → bookkeeping commit
```

> **Design contradiction rule**: if building reveals that a locked design decision is wrong, stop. Reopen the design on a design branch, amend it, re-lock at G1. Never silently patch a locked design mid-implementation.

---

### §4.3 Role Boundary Matrix

Use this to resolve ambiguity when multiple agents could handle a request.

| Scenario | Use | Do NOT use |
|----------|-----|------------|
| Orchestrate multi-step task across agents | `pm` | any execution agent |

<!-- VARIANT-ROLE-BOUNDARY-START -->
### Role Boundaries (co-unity)

| Scenario | Use | Do NOT use |
|----------|-----|------------|
| Design docs, ADRs, requirements, architecture, the persisted build plan | `architect` | `code-writer` (implements a plan; has no authority to write or change one) |
| Write, modify, or delete source files and tests from the persisted plan | `code-writer` | `architect` (authors process docs only, never application code) |
| Inventory the existing code surface, call sites, assembly boundaries | `code-mapper` | `doc-extractor` (reads process docs, not code) · `codex-reconcile` (writes as-built docs, does not do recon) |
| Extract what the process docs already decide about a feature | `doc-extractor` | `code-mapper` (reads code, not docs) · `codex-reconcile` (the codex is an output, not a recon source) |
| Describe the systems as built, after acceptance | `codex-reconcile` | `code-mapper` / `doc-extractor` (recon is input to planning, not the codex) |
| Run the bound verification commands and report the result | `test-runner` | `code-writer` (self-verification conflict) · the main thread (verification never runs on it) |
| Produce findings from one review angle | `review-angle` | `finding-verifier` (verifies a finding; it does not generate the roster) |
| Confirm or refute a single surviving finding with evidence | `finding-verifier` | `review-angle` (an angle cannot adjudicate its own output) |
| Audit the evidence before the acceptance gate | `gate-preflight` | the human's G2 ruling — preflight PASS is evidence, never acceptance |
| Check work in and return `cs:N` | `vc-checkin` | `pm` (the PM's merge ceremony is a merge, not a check-in) |
| Merge a branch and triage conflicts | `pm` (main thread; content conflicts → the human's Mergetool) | `vc-checkin` (never merges, switches, undoes, or shelves unless instructed for that exact operation) |
| Write the codex from the shipped code | `codex-reconcile` | `architect` (intent, not as-built — the two areas are never merged) |
| Decide system intent and lock it | `architect` (then the human at G1) | `codex-reconcile` (documents what exists; it never decides design) |
| Bind the toolchain, register the workspace, author verification bindings | `stack-setup` | `code-writer` (a binding is environment truth, not code; never improvise a build command) |
| Configure or repair the project environment | `stack-setup` | `code-writer` (setup requires toolchain research and a security pass first) |
<!-- VARIANT-ROLE-BOUNDARY-END -->

---

## §5: Execution Plan Templates

### §5.1 Standard Execution Plan Template

| # | Task | Agent | Tier | Model |
|---|------|-------|------|-------|
| 1 | [task description] | [specialist] | High/Medium/Low | [model] |
| N | Check in the work, then the bookkeeping as a separate changeset | vc-checkin | Medium | [model] |

**Execution Order**: [Parallel | Sequential]

**Key points**:
- Tier column is MANDATORY (High/Medium/Low)
- **The closing row is NOT `/sync`.** `/sync` is a git-only pipeline (audit → commit → push → PR) and is **inert** in this variant, because version control here is Plastic SCM. Every plan closes with a `vc-checkin` row — "checkin + separate bookkeeping changeset" — instead.
- Bookkeeping (`memory/workflow.md`, the session log, `CHANGELOG.md`) is always its own changeset, never folded into the work changeset
- At close-out the closing rows are three, in order: codex commit (`vc-checkin`) → merge check-in (`pm`, the merge ceremony) → bookkeeping commit (`vc-checkin`); on the design track two rows: merge check-in (`pm`) → bookkeeping commit (`vc-checkin`)
- State parallel vs sequential order below the table
- "pm (direct)" is FORBIDDEN for authorship — the PM's only direct actions are `memory/*.md`, `CHANGELOG.md`, and the merge ceremony

### §5.2 Platform Parity Considerations

When modifying files that affect both CLAUDE.md and GEMINI.md:

| # | Task | Agent | Tier | Model | Platform |
|---|------|-------|------|---------|----------|
| 1 | [task] | [specialist] | [tier] | [model] | Both |
| N | Check in the work, then the bookkeeping as a separate changeset | vc-checkin | Medium | [model] | Both |

**Platform Column**: `Claude` / `Antigravity` / `Both` / `L0-only`

**Note**: See execution plan boilerplate in CLAUDE.md §5, GEMINI.md §5, and agents/pm.md for the Platform column definition.

### §5.3 Example Execution Plans

#### Example 1: Feature Planning (recon in parallel, then serial authorship)

> **Note**: The `Model` column below shows the Claude Code short alias (`sonnet`/`opus`/`haiku`/`fable`) actually passed to the `Agent()` tool's `model` parameter — not the registry ID (e.g. `claude-sonnet-5-0`). See [CLAUDE.md §6](CLAUDE.md) for the registry-ID → alias translation table. On Gemini/Antigravity, use the literal model ID instead (see GEMINI.md's equivalent example).

| # | Task | Agent | Tier | Model |
|---|------|-------|------|-------|
| 1 | Inventory the code surface the feature touches | `code-mapper` | Medium | sonnet |
| 2 | Extract what the locked design already decides | `doc-extractor` | Medium | sonnet |
| 3 | Write `docs/features/<feature>/requirements.md` | `architect` | High | opus |
| 4 | Write `docs/features/<feature>/architecture.md` incl. the persisted `## Build plan` | `architect` | High | opus |
| 5 | Audit the persisted plan against canon | `plan-validator` | High | opus |
| 6 | Check in the planning docs, then the bookkeeping as a separate changeset | `vc-checkin` | Medium | sonnet |

**Execution Order**: Rows 1–2 in parallel (read-only recon), then 3–6 sequential.

#### Example 2: Review Cycle

| # | Task | Agent | Tier | Model |
|---|------|-------|------|-------|
| 1 | Review from the assigned angle against the reviewed base revision | `review-angle` (×N, one per angle) | High | opus |
| 2 | Verify each surviving finding after main-thread dedup | `finding-verifier` (×N) | High | opus |
| 3 | Apply only the findings the human ruled "fix" | `code-writer` | Medium | sonnet |
| 4 | Re-run the bound verification | `test-runner` | Medium | sonnet |
| 5 | Check in the fixes, then the bookkeeping as a separate changeset | `vc-checkin` | Medium | sonnet |

**Execution Order**: Row 1 parallel; rows 2 parallel per surviving finding; rows 3–5 sequential. The human rules each verified finding between rows 2 and 3.

---

## §6: Skills

### Skill Resolution Priority

When a user request matches a skill trigger, apply this priority order — **enforced every session, regardless of platform**:

| Priority | Source | Location | Purpose |
|----------|--------|----------|---------|
| **1 (highest)** | Variant and project skills | `skills/<name>/SKILL.md` in the project root | co-unity workflow skills and inherited common skills |
| **2** | Platform config skills | `.claude/skills/` or `.gemini/skills/` in the project root | Platform-specific hooks, commands, and lifecycle management |
| **3 (lowest)** | Global plugin skills | e.g., `superpowers/brainstorming`, `superpowers/writing-plans` | General-purpose development workflows |

**Location Rules**:
- **Single location requirement**: Variant skills should exist **only** in the `skills/` folder (priority 1). Do not duplicate them in `.claude/skills/` or `.gemini/skills/`.
- **Platform-specific skills**: `.claude/skills/` and `.gemini/skills/` are reserved for platform-specific hooks, commands, and lifecycle management tools.
- **No cross-duplication**: Avoid duplicating the same skill across multiple locations.

**Resolution Rule**: If a higher-priority skill's `metadata.triggers` matches the user request, use it — do **not** fall through to lower-priority skills with overlapping intent.

### Variant Skills Registry (co-unity)

| Skill | File | Owner | Phases | Purpose |
|-------|------|-------|--------|---------|
| **system-design-doc** | `skills/system-design-doc/SKILL.md` | architect | 1 | Author a design doc for a topic — a model plus the dynamics it produces — or resolve a fork into an ADR |
| **feature-requirement-doc** | `skills/feature-requirement-doc/SKILL.md` | architect | 2 | Author the testable, scoped contract for one buildable feature |
| **architecture-doc** | `skills/architecture-doc/SKILL.md` | architect | 2 | Author the architecture doc and the persisted build plan; reconcile to as-built before G2 |
| **handoff** | `skills/handoff/SKILL.md` | pm | 6 | Write a handoff brief a cold, context-light session can start from |
| **code-review** | `skills/code-review/SKILL.md` | pm | 4 | The review brief, the angle roster, and the verification discipline for findings |
| **test-driven-development** | `skills/test-driven-development/SKILL.md` | test-runner | 3, 4, 5 | Red-green-refactor and the honest reporting of bound verification results |
| **refactoring** | `skills/refactoring/SKILL.md` | code-writer | 4 | Behavior-preserving change under the reviewed code's shape |
| **unity-custom-package** | `skills/unity-custom-package/SKILL.md` | code-writer | 3 | Authoring and consuming custom UPM packages |
| **plastic-checkin** | `skills/plastic-checkin/SKILL.md` | vc-checkin | 1, 2, 3, 4, 5, 6 | The `cm.exe` check-in ceremony, the merge ceremony reference, and the `cm.exe` cheat sheet |
| **codex** | `skills/codex/SKILL.md` | codex-reconcile | 5 | Writing the as-built codex against the schema in `docs/codex/CODEX.md` |

> **📌 VERSION_MANIFEST is the Single Source of Truth (SSOT)**
>
> All skill versions, status, and lifecycle metadata are maintained in [`docs/VERSION_MANIFEST.md`](docs/VERSION_MANIFEST.md).
> The table above provides skill names and locations only. For current versions, status, and detailed metadata, always reference VERSION_MANIFEST.
>
> **Skill structure specification**: See [docs/co-unity.context.md](docs/co-unity.context.md) for frontmatter format and session skill registration.

> **`owner` field definition**: The `owner` field in `SKILL.md` frontmatter identifies the **maintainer responsibility** for that skill — the agent or role accountable for keeping the skill current. It does NOT require that agent to exist in the current project, and does NOT mean that agent is the only one who can invoke the skill.

> **Inert skills under Plastic**: the harness-inherited `sync`, `source-command-commit-push-pr`, and `finishing-a-development-branch` skills are git-shaped and do not apply here. They are documented, never invoked. Their replacement is `plastic-checkin` plus the `vc-checkin` persona.

---


## §7: Universal Baseline Behaviors

All agents, regardless of their role, must adhere to the following:

- **Security Boundaries**: Never expose or log secrets (API keys, tokens, Plastic cloud credentials). Do not modify CI or environment configuration without explicit permission.
- **Communication Style**: Keep explanations concise and use markdown formatting. Always explain "why", not just "what".
- **Conflicting Instructions**: If a user request violates project rules (e.g., bypassing a gate or a verification binding), warn the user and request explicit confirmation before proceeding.
- **Coding Standards**: Follow the project's stated conventions. Write tests when creating functional code. No speculative abstractions.
- **Language**: All code, config, and check-in comments - **English only**.
- **UTF-8 Enforcement**: Always use UTF-8 encoding; prevent CP949 or other localized encoding corruptions.
- **File Organization**: Never create `.md` files at the project root unless explicitly creating a standard root file (README.md, CHANGELOG.md, AGENTS.md, SECURITY.md). Process docs land in `docs/design/` and `docs/features/`, as-built docs in `docs/codex/`, session logs in `memory/`, temporary code and scratch scripts in `tests/`.
- **The binding sentence**: an agent or skill that finds no verification binding reports that and stops. It never improvises one, never modifies one, and never "fixes" a build command.
- **Source Attribution**: When presenting research findings, external data, or factual claims, always cite the source using `[Source: URL/document]` inline or a `## References` section. If a source cannot be verified, explicitly mark it as `⚠️ Unverified` and recommend manual verification. Never present unverified information as established fact.
- **Computational Integrity**: Never perform high-precision or safety-critical numerical calculations directly. Label any AI-generated numerical estimate explicitly as **approximate**. For all other reported numbers (aggregations, statistics, percentages, metrics), compute via executed code — never by mental arithmetic.

---

## §8: Lifecycle Management

### Lifecycle Finalization

At close-out, PM **must** execute finalization when any of the following occurred in the session:

| Trigger | Dispatch lifecycle finalization? |
|---------|---------------------------|
| Agent added, modified, or deprecated | ✅ Yes |
| Skill added, modified, or deprecated | ✅ Yes |
| Procedure added or modified | ✅ Yes |
| Script status changed in SCRIPTS.md | ✅ Yes |
| Variant status changed (draft→beta, beta→stable, etc.) | ✅ Yes |
| Governance tool updated (audit.ts, validate-templates.ts, etc.) | ✅ Yes |
| `.claude/commands/*.md` or `.gemini/commands/*.md` added or removed | ✅ Yes |
| `.claude/skills/*/SKILL.md` or `.gemini/skills/*/SKILL.md` added or modified | ✅ Yes |
| Verification bindings changed | ✅ Yes |
| Codex pages only | ❌ No |
| README/documentation-only changes | ❌ No |
| Memory log entries only | ❌ No |

PM will produce either a **"no drift" confirmation** or a **drift report + governance document updates**.

> **For Agent Lifecycle procedures**: See [docs/co-unity.context.md](docs/co-unity.context.md) for detailed lifecycle procedures.

---


## §9: Maintenance Rule

When a new `agents/<name>.md` is created, **the developer or AI agent responsible for the change** must:
1. Add a row to the Agent Roster table in §1 (inside the `VARIANT-AGENTS` markers).
2. Add a detail block to §2 (inside the `VARIANT-AGENT-DETAILS` markers), including the **Access** row.
3. Add a dispatch-trigger row to §3.1.5 and a Phase Gate row to §3.5.
4. Add a row to the Subagent Roster in §4.1 (with Parallelizable / Write Allowed / Access columns).
5. Add the disambiguating row to the Role Boundaries table in §4.3.
6. Create the governance record at `docs/lifecycle/agents/<name>.md`.
7. Ensure the agent file follows the persona frontmatter contract in [docs/co-unity.context.md](docs/co-unity.context.md) — including `access`, `access_scope`, and `intended_tools`.

When a new skill is created in `skills/`:
1. Add a row to the Variant Skills Registry in §6 and to `skills/SKILLS.md`.
2. Create the governance record at `docs/lifecycle/skills/<name>.md`.
3. Ensure the skill follows the frontmatter contract in [docs/co-unity.context.md](docs/co-unity.context.md).
4. Register it in `variant.json → skill_manifest`.

When a new procedure is added under `procedures/`:
1. Register every output type in `procedures/_output-types.yaml`.
2. Verify every `agent_key` is a roster name and every `skill_key` is a registered skill.
3. Run `bun scripts/validate-procedures.ts`.

> Keep AGENTS.md in sync with `docs/co-unity.context.md ## Agents`.

---

## §10: Periodic Skill Review Schedule

**Frequency**: Quarterly (every 3 months)  
**Owner**: pm  
**Tool**: `bun scripts/skill-dependency-analysis.ts --report`

### Review Cadence

| Quarter | Target Month | Scope |
|---------|-------------|-------|
| Q1 | March | All active skills — full health report |
| Q2 | June | All active skills — full health report |
| Q3 | September | All active skills — full health report |
| Q4 | December | All active skills — full health report + deprecation sweep |

### Review Steps

1. **Generate health report**
   ```
   bun scripts/skill-dependency-analysis.ts --report
   bun scripts/validate-skills.ts
   ```

2. **Triage findings** by severity:
   - 🔴 Broken dependencies or circular references → fix before quarter ends
   - 🟡 Deprecated dependency usage → fix within 2 weeks
   - 🟢 Wording or example improvements → batch in next release cycle

3. **Apply modifications** following the review and triage steps defined inline in this section (§10)

4. **Update governance records** in `docs/lifecycle/skills/<name>.md` for every skill modified

5. **Deprecation sweep** (Q4 only): review skills with `last_updated` older than 12 months — evaluate whether they remain relevant or should be deprecated

6. **Log results** in the quarterly memory log: `memory/YYYY-MM-DD.md` with `## Skill Review Q[N] YYYY` heading

### Trigger Conditions (Outside Quarterly Cadence)

A skill health check should also be run outside the quarterly schedule when:
- A tool, agent, or script referenced by any skill is renamed or removed
- A new skill is added that may introduce dependency cycles
- Skill validation fails on any branch

---

## Version History

- **v0.1.2 (2026-09-03)**: Bookkeeping bound to a single `memory/workflow.md` (owner ruling); cosmetics C1–C16 from the adoption review; `code-writer` confirmed at medium tier.
- **v0.1.1 (2026-09-03)**: Review fixes S3–S9 — feature backlog bound to `docs/design/<topic>/backlog.md`; the design-track merge and bookkeeping steps added to `system-design`; orientation on a Workflow-state/repository mismatch warns and waits; `doc-extractor` scoped to process docs; `vc-checkin` / `plastic-checkin` carry phase 3; verifier verdict vocabulary aligned; merge check-in ownership fixed in `docs/phase-definitions.md`.
- **v0.1.0 (2026-09-01)**: Initial co-unity variant ecosystem — 15 personas (PM + 14 specialists), 10 variant skills, 6 procedures, the two-track design/implementation workflow with human gates G0 / G1 / G2, Plastic SCM (`cm.exe`) as the version-control layer, and the PM merge-ceremony carve-out. `/sync` and the git pipeline are documented as inert; `vc-checkin` + `plastic-checkin` replace them.
