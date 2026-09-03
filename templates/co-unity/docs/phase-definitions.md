# Phase Definitions — co-unity

This document defines the workflow phases used by the `co-unity` variant. It follows the standard workspace phase structure (see `templates/common/docs/phase-definitions.md`) with co-unity's specialist personas mapped to each phase, per each persona's `phases:` frontmatter field in `agents/*.md` and the Phase Determination table in `AGENTS.md`.

**Two tracks, not one pipeline.** co-unity does not run a single linear phase sequence. Phase 1 is the **design track**: it takes a topic from agreed scope to a human-locked design document and a feature backlog. Phases 2 through 6 are the **implementation track**: they take one backlog entry from reconnaissance to a merged, codex-documented feature. The two tracks are decoupled — design may run far ahead of implementation, and a locked design may sit in the backlog indefinitely before anything is built from it. Phase numbers describe *what kind of work is happening*, not a clock.

Phase 0 belongs to neither track. It is the environment contract that both depend on.

---

## Phase Overview

| Phase | Name | Track | PM Role | Who Acts | Gate |
|-------|------|-------|---------|----------|------|
| 0 | Environment bootstrap | — | Orchestrator | `stack-setup` (optional), `test-runner`, `security-monitor` (optional) | bindings exist and run green |
| 1 | Design track | design | Gate keeper (G0, G1) | `architect`, `vr-ux-designer` (optional), `vc-checkin`, pm (merge ceremony) | **G1 human lock** |
| 2 | Feature planning | implementation | Coordinator | `code-mapper` ∥ `doc-extractor`, `architect`, `plan-validator`, `vc-checkin` | plan persisted + audited; a canon conflict stops the line |
| 3 | Implementation | implementation | Coordinator | `code-writer` ↔ `test-runner` (≤3 iterations, then PM escalation), `vc-checkin` | all bound gates green |
| 4 | Review cycle | implementation | Judge (dedup, present, apply rulings) | `review-angle` ×N, `finding-verifier` per survivor, `security-monitor` (optional), `code-writer`, `test-runner`, `vc-checkin` | human rules per finding |
| 5 | Acceptance & codex | implementation | Gate keeper (G2) | `gate-preflight`, `test-runner`, `codex-reconcile`, `vc-checkin` | **G2 human ruling**; codex only after |
| 6 | Close-out | implementation | Owner (merge ceremony on the main thread) | pm, `vc-checkin` | merge checkin, then bookkeeping commit |

---

## Phase Details

### Phase 0 — Environment bootstrap
**PM opens the phase**: confirm the target engine version, render pipeline and XR stack with the human, then establish the verification contract.
- `stack-setup` (Tier: Medium, optional) confirms `cm.exe`, `dotnet.exe` and `Unity.exe` are reachable from WSL and records their versions; registers the Plastic SCM workspace; writes `ignore.conf`; authors `docs/verification-bindings.md` from the variant template
- `test-runner` (Tier: Medium) runs every binding exactly once and records the dated baseline
- `security-monitor` (Tier: Medium, optional) takes the baseline security scan
- **Procedure**: `procedures/environment-bootstrap/schema.yaml`
- **Output**: `docs/verification-bindings.md` with dated baselines; a security baseline
- **Gate**: every binding runs green, or its failure is attributed in writing to a documented environment quirk. A gate that cannot be run as written is **not bound** — say so; never improvise a build command.

### Phase 1 — Design track
**PM keeps two gates**: G0 opens the track, G1 closes it and belongs entirely to the human.
- G0: a `design-<topic>` branch exists in Plastic and the topic's scope is agreed with the human
- `architect` (Tier: High) authors the design document under `docs/design/<topic>/` — a model plus the dynamics it produces, written as intent
- `vr-ux-designer` (Tier: Medium, optional) authors the VR UX material — comfort, diegesis, voice and gesture input, seated play — for topics with an interaction surface
- `architect` resolves each contested fork into an ADR at `docs/design/<topic>/decisions/adr-NNNN-<slug>.md` (lazy folder, shared number sequence — check the highest number on disk first)
- **G1 — HUMAN LOCK (hard stop)**. The human rules, in conversation, with the date. Only then does the backlog step run
- `architect` derives the feature backlog at `docs/design/<topic>/backlog.md`: one name and one line of scope per buildable feature
- `vc-checkin` (Tier: Medium) checks the locked design, its ADRs and the backlog in
- PM runs the merge ceremony on the main thread: `design-<topic>` merges into main; content conflicts go to the human's Windows Mergetool with the documented click path. Main now holds the locked design, its ADRs and the backlog
- `vc-checkin` runs the bookkeeping commit (stage `merged`) as a separate changeset after the merge checkin — two changesets on the design track, never combined
- The codex is untouched for the whole phase
- **Procedure**: `procedures/system-design/schema.yaml`
- **Output**: locked design document, design ADRs, feature backlog (`docs/design/<topic>/backlog.md`), the design branch merged to main
- **Gate**: **G1**. Do not proceed on silence, enthusiasm, or a "looks good" about anything other than the gate itself. Nothing crosses G1 on the assistant's judgment.

### Phase 2 — Feature planning
**PM coordinates**: reconnaissance always precedes planning, and the plan does not exist until it is persisted.
- Preconditions: the parent design is locked at G1, a `feat-<feature>` branch exists, and orientation is done from `memory/workflow.md` cross-checked against `cm.exe status --header` (a mismatch is raised with the human — another session may be mid-flight — never corrected silently)
- `code-mapper` (Tier: Medium, read-only) and `doc-extractor` (Tier: Medium, read-only) run **in parallel** — source seams and assembly boundaries on one side, governing canon on the other
- `architect` (Tier: High) writes `requirements.md`, then `architecture.md`, then persists exactly **one** build phase under the architecture document's `## Build plan` heading
- `plan-validator` (Tier: High, read-only) audits the persisted plan against canon
- `vc-checkin` checks the process documents in
- **Procedure**: `procedures/feature-planning/schema.yaml`
- **Output**: requirements doc, architecture doc, persisted build plan, plan audit
- **Gate**: the plan is persisted and audited. A canon-conflict finding **stops the line** — it goes back to the human and the design is reopened, not worked around. A scope change re-gates with the human.

### Phase 3 — Implementation
**PM coordinates**: writing and verifying are separate roles held by separate agents.
- `code-writer` (Tier: Medium) implements the persisted plan and its tests, under the Unity guardrails — `.meta` for every new asset and folder, assembly-definition boundaries respected, no version-control commands
- `test-runner` (Tier: Medium, read-only) runs the bound gates exactly as `docs/verification-bindings.md` writes them and reports each result against its expected-green pattern
- The pair loops at most **3 iterations**; on the third non-green result the PM is escalated to with the failing output verbatim
- `vc-checkin` checks the implementation in
- Verification never runs on the main thread
- **Procedure**: `procedures/feature-implementation/schema.yaml`
- **Output**: the implemented change set and a verification report
- **Gate**: all bound gates green, with quirk failures attributed per the bindings; a "0 tests ran" result with compile errors in the log is a **FAIL**.

### Phase 4 — Review cycle
**PM is the judge**: dedup, presentation and rulings stay on the main thread; every angle and every verification runs in a subagent.
- PM writes the review brief to the session scratchpad **by absolute path**, never into the project tree
- `review-angle` (Tier: High, read-only) runs once per roster angle named by the depth profile; negative results are findings
- `security-monitor` (Tier: Medium, optional) supplies the security angle when secrets, dependencies or configuration are in scope
- PM dedups; `finding-verifier` (Tier: High, read-only) independently confirms or refutes each survivor
- **The human rules on each verified finding** — fix, defer or reject
- `code-writer` applies only the rulings marked fix, surgically; `test-runner` re-runs the bound gates; `vc-checkin` checks the fixes in
- Reviews always run through this procedure, never ad hoc
- **Procedure**: `procedures/feature-review/schema.yaml`
- **Output**: verified findings with rulings, applied fixes, a fresh verification report
- **Gate**: no finding reaches the human unverified; no fix is applied unruled.

### Phase 5 — Acceptance & codex
**PM keeps the gate**: G2 belongs entirely to the human, and the codex is what follows it.
- `gate-preflight` (Tier: Medium, read-only — `cm.exe status/log/find/cat` only) assembles the evidence ledger and closes with an explicit verdict line. **Preflight PASS is not acceptance.**
- `test-runner` runs the full bound battery including the Unity Editor test suites. Human-only gates — authored content, the in-headset playtest — need a recorded human statement as evidence
- **G2 — HUMAN ACCEPTANCE (hard stop)**. The human rules, in conversation, with the date; the caller states that ruling in the dispatch that follows
- `codex-reconcile` (Tier: High) reads `docs/codex/CODEX.md` for the schema first, then writes the as-built pages. Design documents are untouched
- `vc-checkin` checks the codex in as its own changeset
- **Procedure**: `procedures/release-verification/schema.yaml`
- **Output**: preflight audit, full verification report, codex pages, merge record
- **Gate**: **G2**. The codex is written only after the ruling, never in anticipation of it.

### Phase 6 — Close-out
**PM owns**: the merge ceremony runs on the main thread and is never delegated.
- PM runs the merge with `cm.exe`; content conflicts go to the human's Windows Mergetool with the documented click path
- PM runs the merge checkin (`cm.exe ci`) once every conflict is resolved — the last step of the ceremony; `vc-checkin` never merges and is not dispatched while a merge is in progress
- `vc-checkin` runs the bookkeeping commit — `memory/workflow.md` (row retired now that the branch has merged), the session log, and the changelog — as a **separate** changeset
- Close-out order is fixed: **codex commit → merge checkin → bookkeeping commit**, three separate changesets
- PM writes the handoff if the session ends here
- **Output**: merged branch, updated `memory/workflow.md`, session log
- **Gate**: the merge checkin lands before the bookkeeping commit, and the two are never combined.

---

## Agent-to-Phase Mapping (Source of Truth)

Per each persona's frontmatter `phases:` field in `agents/*.md`:

| Agent | Phases | Tier | Access | Optional? |
|-------|--------|------|--------|-----------|
| `pm` | 0, 1, 2, 3, 4, 5, 6 | High | write — `memory/*.md`, `CHANGELOG.md`; carve-out: the `cm.exe` merge ceremony | No |
| `architect` | 1, 2 | High | write — `docs/design/**`, `docs/features/**` | No |
| `vr-ux-designer` | 1 | Medium | write — `docs/design/vr-ux/**` and UX sections | Yes — skip when the topic has no VR UX surface |
| `stack-setup` | 0 | Medium | write — `docs/verification-bindings.md`, `ignore.conf`, environment/config files | Yes — skip when the bindings already exist and are current |
| `security-monitor` | 0, 4 | Medium | read-only | Yes — skip when no secrets, dependencies or configuration are in scope |
| `code-mapper` | 2, 4 | Medium | read-only | No |
| `doc-extractor` | 2 | Medium | read-only | No |
| `plan-validator` | 2 | High | read-only | No |
| `code-writer` | 3, 4 | Medium | write — source tree, tests, and the `.meta` of what it creates | No |
| `test-runner` | 0, 3, 4, 5 | Medium | read-only — runs the bound commands | No |
| `review-angle` | 4 | High | read-only | No |
| `finding-verifier` | 4 | High | read-only | No |
| `gate-preflight` | 5 | Medium | read-only — `cm.exe status/log/find/cat` only | No |
| `codex-reconcile` | 5 | High | write — `docs/codex/**` | No |
| `vc-checkin` | 1, 2, 3, 4, 5, 6 | Medium | write — version-control state only | No |

`vr-ux-designer`, `stack-setup` and `security-monitor` are declared optional in `variant.json → agent_manifest.optional`, matching the "(optional)" annotations in the Phase Overview and in `AGENTS.md`.

---

## Variant Customization Points

co-unity declares its personas per phase in `AGENTS.md` and each persona's `agents/<name>.md` frontmatter:

```yaml
# Example persona frontmatter (code-writer)
phases: [3, 4]
handoff_to: [test-runner]
handoff_from: [pm, architect]
required_skills: [test-driven-development, refactoring, unity-custom-package]
access: write
access_scope: "project source tree, tests, and the .meta files of assets/folders it creates"
```

co-unity differs from the standard workspace phase model in these ways:

- **Two decoupled tracks.** Phase 1 is a self-contained design track ending in a human lock, not a step on the way to phase 2. A project may run phase 1 for several topics before any phase 2 work starts, and may return to phase 1 mid-implementation when a locked design turns out to be wrong.
- **Two hard human gates, not one approval step.** G1 (design locked) and G2 (feature accepted) are rulings the human states in conversation, with a date. Preflight PASS is evidence, not acceptance.
- **Process docs before, codex after.** Requirements and architecture are written before code exists; the as-built codex is written only after G2. Design and codex are two areas and are never merged.
- **Reconnaissance is mandatory and parallel.** `code-mapper` and `doc-extractor` always run, read-only and in parallel, before any planning.
- **Verification is bound, not invented.** Every command `test-runner` may run is written in `docs/verification-bindings.md`. No binding, no verification.
- **Version control is Plastic SCM.** Phase 6 is a merge ceremony run by the PM on the main thread, not a pull request. The inherited git-shaped harness items are documented as inert.
- **Authored content has no automated gate.** Voice lines, text pools and art are human-verified; the phase 5 gate records a human statement for each such item rather than assuming it.

---

## PM Facilitation per Phase

| Phase | PM Opening | PM Monitoring | PM Synthesis |
|-------|-----------|---------------|--------------|
| 0 | Confirm the engine, pipeline and XR targets; dispatch `stack-setup` | Watch for unbound gates and unreachable executables | Verification bindings with dated baselines; security baseline |
| 1 | Confirm G0 — branch and scope — then brief `architect` | Track open forks; ensure none is resolved silently | Present the design for the **G1 ruling**; record the ruling and its date; after the backlog, merge the design branch to main |
| 2 | Dispatch recon in parallel, then brief `architect` on the backlog entry | Check that the plan is persisted, not conversational | Present the plan audit; take a canon conflict back to the human |
| 3 | Hand the persisted plan to `code-writer` | Track the `code-writer` ↔ `test-runner` loop (max 3×) | Verification report; escalate verbatim on the third failure |
| 4 | Write the review brief to the scratchpad; dispatch the angles | Dedup findings; dispatch one verifier per survivor | Present each verified finding for a **fix / defer / reject** ruling |
| 5 | Dispatch `gate-preflight` and the full battery | Confirm every human-only gate has a recorded human statement | Present the evidence for the **G2 ruling**; dispatch `codex-reconcile` only after it |
| 6 | Run the merge ceremony on the main thread | Hand content conflicts to the human's Mergetool | Merge record, updated `memory/workflow.md`, bookkeeping commit |
