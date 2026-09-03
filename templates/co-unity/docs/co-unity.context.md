# [Project Name] — co-unity Configuration

> Extends docs/context.md. This file IS the customization layer for this project.
> context.md is IMMUTABLE — all project-specific changes belong here.
>
> Read order for all AI tools:
>   1. docs/context.md              — immutable project identity (architecture, standards)
>   2. docs/co-unity.context.md     — THIS FILE — tech stack, agents, skills, workflow, gates
>   3. docs/verification-bindings.md — the verification contract (what may be run, and by whom)

---

## Tech Stack
<!-- VARIANT-INJECT: tech-stack -->

| Layer | Technology |
|-------|-----------|
| **Engine** | Unity 6, or Unity 2022 LTS or newer — the exact version is authoritative in `ProjectSettings/ProjectVersion.txt` |
| **Language** | C# (the engine's scripting runtime; project-bound language version) |
| **Render / XR** | Universal Render Pipeline (URP) + OpenXR — project-bound; record the render pipeline asset and the XR plug-in providers here |
| **Version Control** | Plastic SCM (Unity Version Control), driven as `cm.exe` from WSL. There is no git workflow in this variant |
| **Toolchain** | `dotnet.exe` for compile harnesses, `Unity.exe -batchmode` for Editor test suites — both Windows executables invoked from WSL with the `.exe` suffix |
| **Testing** | Unity Test Framework, EditMode and PlayMode, plus the headless compile and run harnesses bound in `docs/verification-bindings.md` |
| **Harness scripts** | bun / TypeScript — `bun scripts/<name>.ts`; no `.sh` / `.ps1` counterparts |
| **Package manager** | Unity Package Manager (`Packages/manifest.json`) for engine packages; bun for harness scripts |
<!-- END VARIANT-INJECT -->

---

## Agents
<!-- VARIANT-INJECT: agents -->

<!-- context-proximity: agent roles summarized here for AI context window efficiency; authoritative definitions in agents/*.md -->

<!-- Add/remove rows as agents are introduced or retired via lifecycle management. -->
<!-- Status: active | deprecated | experimental -->

| Agent | File | Role | Access | Status |
|-------|------|------|--------|--------|
| PM (main thread) | `agents/pm.md` | Judgment, dedup, gate presentation, human rulings, the merge ceremony; writes `memory/*.md` and `CHANGELOG.md` | write — `memory/*.md`, `CHANGELOG.md`; carve-out: runs the `cm.exe` merge ceremony | active |
| Architect | `agents/architect.md` | Authors design docs, requirements, architecture and the persisted build plan | write — `docs/design/**`, `docs/features/**`; never code, never the codex | active |
| VR UX Designer | `agents/vr-ux-designer.md` | VR interaction design — comfort, diegesis, voice and gesture input, seated play | write — `docs/design/vr-ux/**` and UX sections of design docs | active |
| Stack Setup | `agents/stack-setup.md` | Toolchain reachability, Plastic workspace registration, authors the verification bindings | write — `docs/verification-bindings.md`, `ignore.conf`, environment/config files only | active |
| Security Monitor | `agents/security-monitor.md` | Phase 0 baseline scan; an optional security review angle at phase 4 | read-only | active |
| Code Mapper | `agents/code-mapper.md` | Read-only source reconnaissance including assembly-definition boundaries | read-only | active |
| Doc Extractor | `agents/doc-extractor.md` | Read-only canon reconnaissance across design docs and their ADRs (process docs only) | read-only | active |
| Plan Validator | `agents/plan-validator.md` | Audits the persisted plan against canon; canon conflicts stop the line | read-only | active |
| Code Writer | `agents/code-writer.md` | Implements the persisted plan and its tests, with Unity guardrails | write — project source tree, tests, and the `.meta` files of assets/folders it creates; never process docs, never the codex, never VCS commands | active |
| Test Runner | `agents/test-runner.md` | Runs the bound verification commands exactly as written and reports honestly | read-only — runs bound commands; never edits | active |
| Review Angle | `agents/review-angle.md` | One independent review angle per dispatch; negative results are findings | read-only | active |
| Finding Verifier | `agents/finding-verifier.md` | Independently confirms or refutes one finding before it reaches the human | read-only | active |
| Gate Preflight | `agents/gate-preflight.md` | Assembles the acceptance evidence ledger with an explicit verdict line | read-only — `cm.exe status/log/find/cat` only | active |
| Codex Reconcile | `agents/codex-reconcile.md` | Writes the as-built codex, schema first, only after G2 | write — `docs/codex/**` only | active |
| VC Checkin | `agents/vc-checkin.md` | The Plastic checkin ceremony; returns `cs:N` or `BLOCKED` | write — version-control state only; never edits file content | active |

> Lifecycle management: `bun scripts/agent-lifecycle-audit.ts`
> After any agent change, update AGENTS.md and this table.
<!-- END VARIANT-INJECT -->

---

## Skills
<!-- VARIANT-INJECT: skills -->

<!-- Add/remove rows as skills are introduced or retired via lifecycle management. -->
<!-- Status: active | deprecated | experimental -->

| Skill | Owner | Used by | Phases |
|-------|-------|---------|--------|
| `system-design-doc` | architect | architect, vr-ux-designer | 1 |
| `feature-requirement-doc` | architect | architect | 2 |
| `architecture-doc` | architect | architect | 2 |
| `handoff` | pm | pm | 6 |
| `code-review` | pm | review-angle, finding-verifier, pm | 4 |
| `test-driven-development` | test-runner | code-writer, test-runner | 3, 4, 5 |
| `refactoring` | code-writer | code-writer | 4 |
| `unity-custom-package` | code-writer | code-writer | 3 |
| `plastic-checkin` | vc-checkin | vc-checkin, pm | 1, 2, 3, 4, 5, 6 |
| `codex` | codex-reconcile | codex-reconcile | 5 |

<!-- DYNAMIC_SKILLS_START -->
<!-- DYNAMIC_SKILLS_END -->

> Lifecycle management: `bun scripts/skill-lifecycle-audit.ts`

> **Lifecycle procedures**: See `templates/common/docs/context.md § Lifecycle Management`
<!-- END VARIANT-INJECT -->

---

## Procedures

Structured step contracts live in `procedures/<name>/schema.yaml`; their output vocabulary is
closed and declared in `procedures/_output-types.yaml`.

| Procedure | Phase | What it does |
|-----------|-------|--------------|
| `environment-bootstrap` | 0 | Confirms the toolchain from WSL, registers the Plastic workspace, authors and baselines `docs/verification-bindings.md`, takes the security baseline. |
| `system-design` | 1 | Design track: design doc, ADRs for contested forks, then — after the human's G1 lock — the feature backlog and the PM's merge of the design branch to main. |
| `feature-planning` | 2 | Parallel read-only recon, then requirements, architecture, the persisted build plan, and an independent plan audit. |
| `feature-implementation` | 3 | Code writer builds the persisted plan; test runner proves it against the bound gates; loop at most three times. |
| `feature-review` | 4 | Review brief, independent angles, per-finding verification, human ruling per finding, then only the ruled fixes. |
| `release-verification` | 5 | Preflight evidence ledger, the full bound battery, the human's G2 ruling, then the codex and the three close-out changesets. |

---

## Environment Setup
<!-- VARIANT-INJECT: environment-setup -->

- **WSL ↔ Windows.** The harness runs in WSL; the engine and its toolchain are Windows executables.
  Every Windows binary is called with its `.exe` suffix — `cm.exe`, `dotnet.exe`, `Unity.exe`,
  `tasklist.exe`. A bare `unity` or `dotnet` is a different binary or no binary at all.
- **Harness scripts.** `bun install` once, then `bun scripts/<name>.ts`.
- **Plastic bootstrap.** Run `bun scripts/co-unity/plastic-bootstrap.ts` immediately after
  scaffolding, and again after **every** `upgrade-project.ts` run — the upgrade restores the
  harness's git-shaped machinery, and the bootstrap strips it and writes `ignore.conf`.
- **Workspace registration.** `cm.exe workspace create <workspace-name> <path>` binds the working
  copy to the repository. Until the workspace is registered, `vc-checkin` has nothing to check into
  and will report `BLOCKED`.
- **Verification contract.** `docs/verification-bindings.md` is the contract: it names every command
  that may be run to verify this project, its expected-green pattern, its dated baseline and its
  known quirks. **No binding, no verification** — an agent that finds no binding for a gate reports
  that and stops. It never invents, modifies or "fixes" a build command.
- Copy `.env.sample` to `.env` and fill in any required values. Secrets live only in `.env`.
<!-- END VARIANT-INJECT -->

---

## Development Workflow
<!-- VARIANT-INJECT: development-workflow -->

Two tracks run decoupled. The design track may run far ahead of the implementation track, and a
locked design can sit in the backlog for as long as it takes.

```
DESIGN TRACK (phase 1)
  design-<topic> branch + agreed scope
        │  G0
        ▼
  design doc (docs/design/<topic>/)  ──► ADRs for contested forks
        │
        │  G1 ── HUMAN LOCK (hard stop)
        ▼
  feature backlog  ──►  merge to main
        ╎
        ╎  (decoupled — may be days or months)
        ╎
IMPLEMENTATION TRACK (phases 2-6)
  feat-<feature> branch
        ▼
  recon (code-mapper ∥ doc-extractor)  ──►  requirements  ──►  architecture
        ▼
  persisted build plan  ──►  plan audit
        ▼
  implement  ◄──►  verify   (at most 3 iterations, then PM escalation)
        ▼
  review cycle: angles ──► verification ──► human ruling per finding
        ▼
  preflight audit  +  full bound battery
        │  G2 ── HUMAN ACCEPTANCE (hard stop)
        ▼
  codex (as-built)  ──►  merge ceremony  ──►  bookkeeping
```

> **Gate language.** Do not proceed on silence, enthusiasm, or a "looks good" about anything other
> than the gate itself. The gate ruling belongs to the human. Preflight PASS is not acceptance.
> Nothing crosses G1 or G2 on the assistant's judgment.

**Branching.** One branch per design topic (`design-<topic>`) and one per feature (`feat-<feature>`),
both children of `main`; never design or build on main. Default to sequential-through-main: build a
feature, merge it, branch the next off the updated main; parallel feature branches only when the
features are genuinely independent. Features within a design are often dependency-ordered — merge
prerequisites first, and branch a dependent feature off its prerequisite (or off main once the
prerequisite has merged), never blindly off main.

### Inert harness machinery

This variant inherits harness items that assume git. Under Plastic SCM they are **inert** — they are
documented rather than deleted, and `bun scripts/co-unity/plastic-bootstrap.ts` strips the active
machinery after every scaffold and upgrade:

| Inert item | Replacement |
|------------|-------------|
| `/sync`, `/commit-push-pr` commands | `vc-checkin` running the `plastic-checkin` skill |
| `sync`, `source-command-commit-push-pr`, `finishing-a-development-branch` skills | `plastic-checkin` |
| `dev-sync.ts`, `gen-pr-body.ts`, `scripts/hooks/pre-commit.ts`, the `.githooks/` battery | `plastic-checkin` + the PM's merge ceremony |
| CI workflow files | the bound verification battery, run by `test-runner` |

**Workflow state lives in one file: `memory/workflow.md`.** There is no board file and no per-day
table. It holds one row per active branch — `branch | track | stage | last changeset | next action` —
and nothing else: a row is added at G0 or when a feature branch is created, its `stage` carries each
gate with its date (`locked(G1 2026-09-03)`, `accepted(G2 2026-09-10)`), and the row is removed once
the branch has merged. The daily session log `memory/YYYY-MM-DD.md` keeps the narrative — what was
ruled, by whom, and why. Orientation at the start of a session means reading `memory/workflow.md` and
cross-checking it against `cm.exe status --header`. If a row and the repository disagree, another
session may be mid-flight: warn the human and wait for their call — never correct the file silently.
Bookkeeping commits (`memory/workflow.md`, the session log, `CHANGELOG.md`) are always a separate
changeset from work commits.

Stage vocabulary — design track: `scope → design-doc → locked(G1 <date>) → backlog → merged`.
Feature track: `requirements → architecture → plan → implement → review → preflight → accepted(G2 <date>) → codex → merged`.

### Workflow Phases

| Phase | Name | PM role | Who acts | Gate |
|-------|------|---------|----------|------|
| 0 | Environment bootstrap | Orchestrator | `stack-setup` (opt), `test-runner`, `security-monitor` (opt) | bindings exist and run green |
| 1 | Design track | Gate keeper (G0, G1) | `architect`, `vr-ux-designer` (opt), `vc-checkin` | **G1 human lock** |
| 2 | Feature planning | Coordinator | `code-mapper` ∥ `doc-extractor`, `architect`, `plan-validator`, `vc-checkin` | plan persisted + audited; canon conflict stops the line |
| 3 | Implementation | Coordinator | `code-writer` ↔ `test-runner` (≤3 iterations, then PM escalation), `vc-checkin` | all bound gates green |
| 4 | Review cycle | Judge (dedup, present, apply rulings) | `review-angle` ×N, `finding-verifier` per survivor, `security-monitor` (opt), `code-writer`, `test-runner`, `vc-checkin` | human rules per finding |
| 5 | Acceptance & codex | Gate keeper (G2) | `gate-preflight`, `test-runner`, `codex-reconcile`, `vc-checkin` | **G2 human ruling**; codex only after |
| 6 | Close-out | Owner (merge ceremony on the main thread) | pm, `vc-checkin` | merge checkin then bookkeeping commit |
<!-- END VARIANT-INJECT -->

---

<!-- VARIANT-INJECT: guidelines [REQUIRED] -->
## Coding Guidelines
<!-- intentional-duplicate: workspace standards §8 — maintained locally for AI context proximity; source: docs/constitution/08-coding-guidelines.md; hash: d03bef2a -->

### Core Rules

1. **Think before coding** — state assumptions; if uncertain, ask.
2. **Simplicity first** — minimum code that solves the problem.
3. **Surgical changes** — touch only what is necessary; the reviewed code's shape is canon.
4. **No hardcoded secrets** — always use env vars / `.env.sample`.
5. **Every checkin via `vc-checkin`; never git.** Version control in this project is Plastic SCM.
   The `vc-checkin` persona runs the ceremony and returns `cs:N` or `BLOCKED`; the merge ceremony
   belongs to the PM on the main thread. No agent runs a git command.

### Unity rules

- **`.meta` discipline.** Every new asset and every new folder gets its `.meta` committed with it —
  a folder's own `.meta` lives in the **parent** directory, which is the classic omission. Never
  delete a `.meta` file.
- **Call-site audits reach outside `Assets/**`.** Any change to a public member must sweep the
  uncontrolled harness directories the project binds as well as the asset tree; a harness that
  compiles the sources directly breaks on a rename that an `Assets/**`-only audit calls clean.
- **Assembly definitions.** Respect `.asmdef` boundaries; tests live in test assemblies gated by
  `UNITY_INCLUDE_TESTS`. A type is not reachable just because it is in the same repository.
- **Serialized-field renames break scenes and prefabs.** Use `[FormerlySerializedAs]`, or say plainly
  in the report that scenes and prefabs need re-wiring.
- **Engine lifetime traps.** Main-thread-only engine APIs, coroutine and async lifetimes, struct copy
  semantics, per-frame allocation — follow the project's stated conventions, and flag it when the
  plan itself forces a trap rather than silently working around the plan.
- **No version-control commands from `code-writer`, ever.** That is `vc-checkin`'s job.

### Planning

Plan before coding when: a new feature, a significant refactor, or a change touching more than 2 files.
The plan does not exist until it is persisted under the architecture document's `## Build plan`
heading. A plan that lives only in the conversation may not be built.

### Subagent Pattern

Each implementation task follows the phase 3 execution loop:

1. **code-writer** implements the persisted plan.
2. **test-runner** runs the bound gates and reports each result against its expected-green pattern.
3. Loop at **most 3 iterations**, then escalate to the PM with the failing output verbatim.

Verification never runs on the main thread. Reconnaissance (code-mapper ∥ doc-extractor, read-only)
always precedes planning. Reviews always run through the `feature-review` procedure, never ad hoc.

### Hybrid Scripting

All harness scripts are TypeScript (`.ts`) executed via Bun — no `.sh` / `.ps1` counterparts
(ADR-0036). Windows binaries are always called with the `.exe` suffix from WSL.

### Package Policy

Engine packages are added through the Unity Package Manager and recorded in `Packages/manifest.json`;
in-house packages follow the `unity-custom-package` skill. For third-party code prefer OSI-approved
licenses: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC. Avoid GPL-3.0, AGPL-3.0, SSPL, BSL unless
explicitly justified — a copyleft dependency compiled into a shipped game binary is a licensing
decision, not a technical one.

<!-- END VARIANT-INJECT -->

---

## Computational Integrity

All numeric outputs in deliverables (aggregations, statistics, percentages, metrics) must be computed by executed code (bun/TypeScript scripts) — never by the AI performing arithmetic directly. High-precision or safety-critical domains (Class A: aerospace, precision control, regulated finance) require validated external tools. See `docs/context.md` § Computational Integrity Standards for the full policy; label AI estimates **approximate**.

---

## File Organization Policy
<!-- VARIANT-INJECT: file-organization -->

### Recommended Folder Structure (co-unity)

| Folder | Purpose |
|--------|---------|
| `docs/design/<topic>/` | Design documents — intent, locked at G1, immutable once locked |
| `docs/design/<topic>/decisions/` | Design ADRs, `adr-NNNN-<slug>.md`; created lazily, shared number sequence — check the highest number on disk first |
| `docs/design/<topic>/README.md` | The topic hub — the pillars the topic serves, its scope, and an index of its system docs and ADRs; the doc skills cite it as the parent |
| `docs/design/<topic>/backlog.md` | The feature backlog, written after the human's G1 lock — one line per buildable feature (kebab-case name plus a one-line scope); the input to `feature-planning` |
| `docs/features/<feature>/` | `requirements.md` and `architecture.md` (which carries the persisted `## Build plan`) |
| `docs/codex/` | The as-built codex — `CODEX.md` (the schema, loaded by contract), `index.md`, `log.md`, `templates/`, and the domain folders. Written only after G2 |
| `docs/verification-bindings.md` | The verification contract: bound commands, expected-green patterns, dated baselines, quirks |
| `docs/decisions/` | Records of gate moments — what was ruled at G1/G2, by whom, on what date |
| `memory/workflow.md` | The workflow state — one row per active branch, gates with dates in `stage`, row removed on merge. The only board |
| `memory/` | Daily session logs (the narrative); `memory/reports/` holds read-only personas' saved reports and the review ruling records |
| Project scratch / harness area | Uncontrolled, bound per project — verification harnesses and generated results. It is not committed, but it **does** compile the sources, so call-site audits must cover it |
| `Assets/`, `Packages/`, `ProjectSettings/` | The Unity project proper — controlled in Plastic, `.meta` files included |

Design and codex are two areas and are **never merged**. Design documents state intent and stop being
edited when they lock; the codex describes the systems as they were actually built and is the
teammate-facing entry point.
<!-- END VARIANT-INJECT -->

---

## Per-Role Deliverable Artifacts

Every specialist dispatch leaves one durable artifact on disk — never chat output only. The same
contract is stated in each agent file's `## Output Format → Required Deliverable Artifact` section.

| Role | Required artifact | Path convention | Consumed by |
|------|-------------------|-----------------|-------------|
| pm | Execution plan table, session log, workflow state, gate rulings | `memory/workflow.md`, `memory/YYYY-MM-DD.md`, `docs/decisions/`, `CHANGELOG.md` | all specialists |
| architect | Design doc, requirements, architecture + persisted build plan | `docs/design/<topic>/<system>.md`, `docs/features/<feature>/{requirements,architecture}.md` | plan-validator, code-writer |
| vr-ux-designer | VR UX design sections | `docs/design/vr-ux/<system>.md` | architect |
| stack-setup | The verification bindings and the environment record | `docs/verification-bindings.md`, `ignore.conf` | test-runner, PM |
| security-monitor | Baseline scan / security angle findings | `memory/reports/<YYYY-MM-DD>-security-monitor-<slug>.md` | pm |
| code-mapper | Code inventory report | `memory/reports/<YYYY-MM-DD>-code-mapper-<slug>.md` | architect, pm |
| doc-extractor | Canon extract report | `memory/reports/<YYYY-MM-DD>-doc-extractor-<slug>.md` | architect |
| plan-validator | Plan audit with canon-conflict findings | `memory/reports/<YYYY-MM-DD>-plan-validator-<slug>.md` | pm |
| code-writer | Source change, tests, and the `.meta` of everything it created | project source tree | test-runner |
| test-runner | Verification report — per binding, command, raw result, verdict | `memory/reports/<YYYY-MM-DD>-test-runner-<slug>.md` | pm, code-writer |
| review-angle | Findings for one angle (including "no findings") | `memory/reports/<YYYY-MM-DD>-review-angle-<slug>.md` | pm |
| finding-verifier | Confirmation or refutation of one finding | `memory/reports/<YYYY-MM-DD>-finding-verifier-<slug>.md` | pm |
| gate-preflight | Evidence ledger with an explicit closing verdict line | `memory/reports/<YYYY-MM-DD>-gate-preflight-<slug>.md` | pm |
| codex-reconcile | As-built codex pages and the codex log entry | `docs/codex/**` | teammates |
| vc-checkin | `cs:N` or `BLOCKED`, with what was included | the changeset itself; recorded in `memory/workflow.md` | pm |

---

## Domain Rules
<!-- VARIANT-INJECT: domain-rules -->

1. An agent or skill that finds no binding for a gate reports that and stops. It never improvises,
   modifies or "fixes" a build command. **[UNITY-R1]**
2. If building reveals that a locked design decision is wrong, stop. Reopen the design on a design
   branch, amend it, and re-lock it at G1. Never silently patch a locked design mid-implementation. **[UNITY-R2]**
3. Process documents come before implementation; the codex is written only after G2. **[UNITY-R3]**
4. Design documents state intent and are immutable once locked; the codex describes the systems as
   built and is the teammate-facing entry point. The two areas are never merged. **[UNITY-R4]**
5. Verification never runs on the main thread. It runs in `test-runner`, against the bound commands,
   exactly as written. **[UNITY-R5]**
6. Version control is Plastic SCM only, driven as `cm.exe`. No agent runs a git command; the
   inherited git-shaped harness items are inert. **[UNITY-R6]**
7. Every new asset and every new folder has its `.meta` file committed with it — a folder's own
   `.meta` lives in the parent directory. **[UNITY-R7]**
8. Authored content — voice lines, text pools, art, level dressing — has no automated gate. It is
   human-verified, and it stays unverified until a human has seen or heard it. **[UNITY-R8]**
9. Human gates are rulings, never inferences. G1 and G2 each require an explicit in-conversation
   statement from the human, recorded with its date. Preflight PASS is not acceptance. **[UNITY-R9]**
10. Bookkeeping commits are always a separate changeset from work commits, and at close-out the order
    is codex commit → merge checkin → bookkeeping commit. **[UNITY-R10]**
11. Precedence: a project's bindings (this file's Tech Stack and Environment Setup, `docs/verification-bindings.md`,
    the `CODEX.md` Project bindings) win on specifics — commands, paths, names, vocabulary; the variant canon
    (`AGENTS.md`, the personas, procedures, and skills) wins on process — gates, ordering, and who may write
    what. A binding can never remove a gate or widen a persona's access. **[UNITY-R11]**
<!-- END VARIANT-INJECT -->

---

<!-- COMMON-CONTEXT:START -->
This project follows the workspace coding standards defined in the project's Coding Guidelines section.

Key rules:
- All operational scripts must be TypeScript (`.ts`) — run via `bun scripts/<name>.ts` (ADR-0036; no `.sh`/`.ps1` pairs)
- Git hook scripts in `.githooks/` remain Unix shell (`.sh`) for git compatibility
- All text files saved as **UTF-8 (without BOM)**
- Commit messages and PR artifacts in **English only**
<!-- COMMON-CONTEXT:END -->

---

*co-unity.context.md version: 0.1.2 — bookkeeping bound to `memory/workflow.md`, cosmetics C1–C16 (2026-09-03); 0.1.1 review fixes S3–S9 (2026-09-03); 0.1.0 initial variant authoring (2026-09-01)*

---

## Variant-Specific PM Configuration

### Governance Workflow

<!-- VARIANT-SECTION: governance-workflow -->
## Governance Workflow

**Core principle: process docs come before implementation; the codex (as-built docs) is written only after G2.** Design docs capture *intent* and are immutable once locked; the codex describes the systems *as built* and is the teammate-facing entry point. The two areas are never merged.

**Two decoupled tracks.** Design may run far ahead of implementation — do not force them to move together.

- **Design track** — G0 (`design-<topic>` branch exists and scope is agreed) → design doc → **G1 design locked (human sign-off, hard stop)** → feature backlog (`docs/design/<topic>/backlog.md`) → merge to main (the PM's ceremony) → bookkeeping commit.
- **Implementation track** — `feat-<feature>` branch → requirements doc → architecture doc (+ persisted build plan) → implement → review → test → **G2 feature accepted (human sign-off, hard stop)** → codex → merge.

**Gate language — quote verbatim wherever a gate appears:** "Do not proceed on silence, enthusiasm, or a 'looks good' about anything other than the gate itself." / "The gate ruling belongs to the human." / "Preflight PASS is not acceptance." / "Nothing crosses G1 or G2 on the assistant's judgment."

**The PM is the main thread.** This persona rides the interactive session; it is not a subagent.

- **Stays on the main thread:** judgment, review dedup, gate presentation, recording the human's rulings, the `cm.exe` merge ceremony, and bookkeeping writes to `memory/*.md` and `CHANGELOG.md`.
- **Is dispatched:** write-authorship (`architect` for process docs and the persisted plan, `code-writer` for code, `codex-reconcile` for the codex, `vc-checkin` for check-ins), verification (`test-runner`), and recon (`code-mapper`, `doc-extractor`).
- **Superseded source rules:** "never spawn an agent to write the plan" and "fix on the main thread" — neither holds in this variant.

**Orientation.** At session start, read `memory/workflow.md` — one row per active branch: `branch | track | stage | last changeset | next action` — and cross-check it against `cm.exe status --header`. If the row's stage, changeset, or dates do not match what the repository shows — a stage already at `implement` with no matching workspace evidence, a changeset newer than the row, a row newer than this session's handoff — warn the human that another session may be mid-flight and wait for their call before proceeding. Never correct the file silently. There is no other board and no per-day table: the daily session log `memory/YYYY-MM-DD.md` keeps the narrative, a row's `stage` carries each gate with its date, and a row is removed once its branch has merged.

**Design contradiction rule.** If building reveals a locked design decision is wrong, **stop**; reopen the design on a design branch, amend it, and re-lock at G1. Never silently patch a locked design mid-implementation.

**The binding sentence.** An agent or skill that finds no binding reports that and stops; it never improvises one.
<!-- END VARIANT-SECTION -->


### Agent Roster

<!-- VARIANT-SECTION: agent-roster -->
## Agent Roster

Fourteen specialist personas. `access` is declarative canon: the derivation that produces tool-native agents at scaffold time enforces it together with each persona's `intended_tools`.

| Name | File | Tier | Access | Phases | Optional |
|------|------|------|--------|--------|:--------:|
| architect | `agents/architect.md` | high | write — `docs/design/**`, `docs/features/**` | 1, 2 | no |
| vr-ux-designer | `agents/vr-ux-designer.md` | medium | write — `docs/design/vr-ux/**` and UX sections | 1 | yes |
| stack-setup | `agents/stack-setup.md` | medium | write — bindings, `ignore.conf`, config | 0 | yes |
| security-monitor | `agents/security-monitor.md` | medium | read-only | 0, 4 | yes |
| code-mapper | `agents/code-mapper.md` | medium | read-only | 2, 4 | no |
| doc-extractor | `agents/doc-extractor.md` | medium | read-only | 2 | no |
| plan-validator | `agents/plan-validator.md` | high | read-only | 2 | no |
| code-writer | `agents/code-writer.md` | medium | write — source, tests, and the `.meta` files it creates | 3, 4 | no |
| test-runner | `agents/test-runner.md` | medium | read-only — runs the bound commands, never edits | 0, 3, 4, 5 | no |
| review-angle | `agents/review-angle.md` | high | read-only | 4 | no |
| finding-verifier | `agents/finding-verifier.md` | high | read-only | 4 | no |
| gate-preflight | `agents/gate-preflight.md` | medium | read-only — `cm.exe status/log/find/cat` only | 5 | no |
| codex-reconcile | `agents/codex-reconcile.md` | high | write — `docs/codex/**` only | 5 | no |
| vc-checkin | `agents/vc-checkin.md` | medium | write — version-control state only | 1, 2, 3, 4, 5, 6 | no |
<!-- END VARIANT-SECTION -->


### Dispatch Protocol

<!-- VARIANT-SECTION: dispatch-protocol -->
## Dispatch Protocol

- **Recon before any plan.** Dispatch `code-mapper` and `doc-extractor` in parallel (read-only) before the architect plans anything. Their reports are trusted, not re-derived on the main thread.
- **Verification never runs on the main thread.** Builds and test suites go to `test-runner`, on a command bound in `docs/verification-bindings.md`. Never invent, modify, or "fix" a build command.
- **Reviews only via the `feature-review` procedure**, never ad hoc: review-angle fan-out (one dispatch per angle) → dedup on the main thread → `finding-verifier` on each survivor → **human ruling per finding** (fix / defer / reject) → `code-writer` applies only the findings ruled fix, surgically. No finding reaches the human unverified; no fix is applied unruled.
- **`codex-reconcile` is dispatched only after G2**, and the dispatch must state that the human ruled G2 and the date it was ruled. Without that statement the persona stops — that is a workflow violation, not a judgment call.
- **`vc-checkin` runs every check-in.** Bookkeeping (`memory/*.md`, `CHANGELOG.md`) is always its own changeset, never folded into a work commit or into a merge. Close-out order is three separate changesets: codex commit → merge check-in → bookkeeping commit; the design track closes with two: merge check-in → bookkeeping commit.
- **Parallel reads, serial writes.** Read-only personas may run concurrently; write personas run one at a time.
- **At most 3 `code-writer` ↔ `test-runner` iterations**, then stop and escalate to the human.
- **Execution plan table before dispatching two or more personas.**

### PM Direct Execution — carve-out

Write/Edit remains limited to `memory/*.md` and `CHANGELOG.md`. **In addition**, the PM runs the `cm.exe` merge ceremony on the main thread: switch to the destination branch, confirm a clean workspace (park byte-identical phantom-changed files by shelving them), merge, resolve, check in. `vc-checkin` is forbidden to merge.

A content conflict launches the Windows Mergetool, which hangs a headless session — hand it to the human with the exact click path (**Merge ▾ → Keep destination**, or resolve by hand → **Mark as resolved** → **Save & exit**) and wait. Do not fight the conflict headless and do not kill the mergetool process to retry.
<!-- END VARIANT-SECTION -->