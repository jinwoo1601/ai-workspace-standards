# co-unity User Guide

**Language**: **English** · [한국어](user-guide_ko.md)

> Practical, task-oriented guide for using the co-unity agent team on a Unity / VR project under Plastic SCM. For the team overview and roster, see [README.md](../README.md). For governance and dispatch rules, see [AGENTS.md](../AGENTS.md) and [CLAUDE.md](../CLAUDE.md) / [GEMINI.md](../GEMINI.md).

---

## 1. Quick Start

co-unity is driven entirely through the **PM Gateway pattern**: you talk to PM, PM plans, PM dispatches specialists, PM presents the gates, and **you** rule them.

1. **Describe your task in plain language** — "start a design topic for the damage model", "pick up the waypoint feature", "review this branch", "accept it and merge". Do not try to invoke a specialist agent directly; specialists refuse direct user requests and redirect you to PM.
2. **PM classifies the task** (Phase Determination) and, for any multi-step task (2+ files or 2+ sequential steps), outputs an **execution plan table** before doing anything else:

   | # | Task | Agent | Tier | Model |
   |---|------|-------|------|-------|
   | 1 | Inventory the code surface the feature touches | `code-mapper` | Medium | [model] |
   | 2 | Write the requirements doc | `architect` | High | [model] |
   | 3 | Check in the work, then the bookkeeping as a separate changeset | `vc-checkin` | Medium | [model] |

3. **You approve the plan** (or ask for changes). PM never proceeds to specialist dispatch without this step for multi-agent work.
4. **PM dispatches specialists**, one per row, respecting sequential vs. parallel execution order. Read-only work (recon, review angles, verification) goes in parallel; writes go one at a time.
5. **PM presents the gate, you rule it.** G1 (design locked) and G2 (feature accepted) are yours. Preflight PASS is evidence, not acceptance.
6. **PM closes out with a check-in, not a sync.** The last row of every plan is a `vc-checkin` row — the work is checked in, and the bookkeeping is checked in as a **separate** changeset. There is no `/sync`, no PR, no push here.

**Rule of thumb**: if you find yourself about to ask an agent file (`agents/code-writer.md` etc.) to do something directly, stop — route it through PM instead. And if a gate seems to have passed without you saying so, it has not passed.

---

## 2. What Kind of Task Do You Have?

Use this table to anticipate which agent(s) and skill(s) PM will dispatch. You don't need to name the agent yourself — describing the task is enough — but knowing the mapping helps you write a clearer request.

| Your task | Agent(s) | Skill(s) / procedure | Notes |
|-----------|----------|----------------------|-------|
| Start a design topic | `architect`, `vr-ux-designer` (optional) | `system-design-doc` · procedure `system-design` | Needs G0 first: a `design-<topic>` branch exists and the scope is agreed. Design docs capture *intent* and become immutable once locked at G1 |
| Pick up a feature from the backlog | `code-mapper` ∥ `doc-extractor`, then `architect`, then `plan-validator` | `feature-requirement-doc`, `architecture-doc`, `research-analysis` · procedure `feature-planning` | Recon always runs before planning. The build plan does not exist until it is persisted under the architecture doc's `## Build plan` |
| Implement it | `code-writer` ↔ `test-runner` | `test-driven-development`, `unity-custom-package` · procedure `feature-implementation` | Loop at most 3 times, then PM escalates to you. `.meta` for every new asset and folder |
| Review the change | `review-angle` ×N, then `finding-verifier` per survivor, `security-monitor` (optional) | `code-review`, `security-scan` · procedure `feature-review` | Never ad hoc — always the procedure. No finding reaches you unverified; no fix is applied until you rule it |
| Accept it and merge | `gate-preflight`, `test-runner`, `codex-reconcile`, `vc-checkin`, then PM | `evidence-ledger`, `codex`, `plastic-checkin` · procedure `release-verification` | G2 is yours. The codex is written only after you rule it. Three changesets, in order: codex → merge → bookkeeping |
| Onboard the project and its bindings | `stack-setup`, `test-runner`, `security-monitor` | `documentation-writing`, `test-driven-development`, `security-scan` · procedure `environment-bootstrap` | Produces `docs/verification-bindings.md`. A binding that cannot be run is not bound — nobody improvises a build command |
| Write the codex | `codex-reconcile` | `codex` | Schema first: it reads `docs/codex/CODEX.md` before writing. Only after G2. Design is not a codex domain |
| Hand off a session | PM | `handoff` | Produces a brief a cold, context-light session can start from: one task, exact paths, the workflow skill to invoke |

---

## 3. The Standard Multi-Stage Workflow

co-unity runs **two decoupled tracks**. A design is locked once and feeds many features; each feature runs its own loop.

```
 DESIGN TRACK                                IMPLEMENTATION TRACK
 branch: design-<topic>                      branch: feat-<feature>

   [G0] branch + scope agreed
        │
        ▼
   design doc  (architect, vr-ux-designer)
        │
        ▼
   design ADRs for contested forks
        │
        ▼
   ══ [G1] DESIGN LOCKED — human ══
        │  hard stop
        ▼
   feature backlog ──────────────────────▶  requirements doc
        │                                        │
        ▼                                        ▼
   merge to main                            architecture doc + persisted build plan
                                                 │
                                                 ▼
                                            plan audit  (plan-validator)
                                                 │
                                                 ▼
                                            implement  (code-writer ↔ test-runner, ≤3)
                                                 │
                                                 ▼
                                            review  (review-angle ×N → finding-verifier)
                                                 │
                                                 ▼
                                            preflight  (gate-preflight)
                                                 │
                                                 ▼
                                       ══ [G2] FEATURE ACCEPTED — human ══
                                                 │  hard stop
                                                 ▼
                                            codex  (codex-reconcile)
                                                 │
                                                 ▼
                                            merge ceremony (PM) → bookkeeping
```

### Key commands

```
cm.exe status --header                        # orientation: where the workspace actually is
bun scripts/co-unity/plastic-bootstrap.ts     # strip the git machinery, write ignore.conf
bun scripts/audit.ts                          # QA / documentation gate (must exit 0)
```

Run `plastic-bootstrap.ts` after scaffolding a project, and **again after every `upgrade-project.ts`** — the upgrade re-delivers the harness's git machinery, and the bootstrap strips it back out.

> ### ⚠️ Never git. `/sync` is inert here.
>
> Version control in this variant is **Plastic SCM (Unity Version Control)**, driven as `cm.exe` from WSL. Do not run git commands, do not create git branches, do not open PRs.
>
> The harness ships git-shaped items that this variant **does not use**: the `/sync` and `/commit-push-pr` commands; the `sync`, `source-command-commit-push-pr`, and `finishing-a-development-branch` skills; `dev-sync.ts`, `gen-pr-body.ts`, the pre-commit hook battery, and the CI workflow files. They are left in place and documented as **inert** — never invoked.
>
> Their replacement is the `vc-checkin` persona plus the `plastic-checkin` skill. `vc-checkin` runs status → categorize → re-register → add → checkin → verify and returns `cs:N` or `BLOCKED`. It never merges: the **merge ceremony runs on the main thread with PM**, and content conflicts go to your Windows Mergetool with the documented click path.
>
> Because there are no git hooks, there is also no pre-commit secret gate. The compensating control is an explicit `gitleaks --no-git` scan — see [SECURITY.md](../SECURITY.md).

---

## 4. Phase Structure

co-unity uses a seven-phase model (see `AGENTS.md` §3.5 and `docs/phase-definitions.md`):

| Phase | Name | PM role | Who acts | Gate |
|-------|------|---------|----------|------|
| 0 | Environment bootstrap | Orchestrator | `stack-setup` (optional), `test-runner`, `security-monitor` (optional) | bindings exist and run green |
| 1 | Design track | Gate keeper (G0, G1) | `architect`, `vr-ux-designer` (optional), `vc-checkin` | **G1 human lock** |
| 2 | Feature planning | Coordinator | `code-mapper` ∥ `doc-extractor`, `architect`, `plan-validator`, `vc-checkin` | plan persisted + audited; a canon conflict stops the line |
| 3 | Implementation | Coordinator | `code-writer` ↔ `test-runner` (≤3 iterations, then PM escalation), `vc-checkin` | all bound gates green |
| 4 | Review cycle | Judge (dedup, present, apply rulings) | `review-angle` ×N, `finding-verifier` per survivor, `security-monitor` (optional), `code-writer`, `test-runner`, `vc-checkin` | human rules per finding |
| 5 | Acceptance & codex | Gate keeper (G2) | `gate-preflight`, `test-runner`, `codex-reconcile`, `vc-checkin` | **G2 human ruling**; codex only after |
| 6 | Close-out | Owner (merge ceremony on the main thread) | pm, `vc-checkin` | merge check-in then bookkeeping commit |

**Serial writes, parallel reads.** Read-only work is dispatched in parallel in a single turn — the recon pair (`code-mapper` ∥ `doc-extractor`) at phase 2, and the review roster (`review-angle` ×N) at phase 4. Write work is dispatched **one agent at a time**: concurrent writes cause file-lock contention, and under Plastic a half-registered working set makes the next `cm.exe status` unreadable.

**Tier ceiling rule**: an agent's tier can be downgraded for simple tasks but never raised above its defined baseline.

---

## 5. Where Your Output Goes

| Artifact | Location |
|----------|----------|
| Design docs (intent — immutable once locked) | `docs/design/<topic>/<system>.md` |
| Design ADRs | `docs/design/<topic>/decisions/adr-NNNN-<slug>.md` |
| Feature backlog (written after G1) | `docs/design/<topic>/backlog.md` |
| Requirements doc | `docs/features/<feature>/requirements.md` |
| Architecture doc + the persisted build plan | `docs/features/<feature>/architecture.md` (`## Build plan`) |
| Codex (as-built, teammate-facing) | `docs/codex/` — `CODEX.md` (the schema), `index.md`, `log.md`, `templates/`, and the domain folders `code/ art/ narrative/ audio/ production/` (`vr-ux/` optional) |
| Verification bindings | `docs/verification-bindings.md` |
| Workflow state and session logs | `memory/workflow.md` (one row per active branch, the only board) and `memory/YYYY-MM-DD.md` (the narrative) |
| Read-only agent reports | `memory/reports/<YYYY-MM-DD>-<agent>-<slug>.md` |
| Review briefs | The session scratchpad, by absolute path — never inside the project tree |
| Changelog entries | `CHANGELOG.md` (`[Unreleased]` section, moved on release) |
| Agent-to-agent handoff payloads | In-session JSON per [handoff-spec.md](handoff-spec.md) (not persisted to disk by default) |
| Implementation code and tests | The project's normal source tree, per the persisted plan |

**Domain rules**

- **Design and the codex are never merged.** Design docs record *intent* and are immutable once locked at G1. The codex describes the systems *as built* and is the teammate-facing entry point. **Design is not a codex domain.**
- **The codex is written only after G2**, never before, and never speculatively.
- **The ADR sequence is shared across topics.** Before writing `adr-NNNN`, check the highest number already on disk. The `decisions/` folder is created lazily, on the first ADR for that topic.
- **Workflow state lives in one file.** `memory/workflow.md` holds one row per active branch — `branch | track | stage | last changeset | next action` — with each gate and its date in `stage`; a row is removed once its branch has merged, and the daily session log keeps the narrative. Orientation means reading that file and cross-checking it against `cm.exe status --header`. If the two disagree, PM warns you that another session may be mid-flight and waits for your call — it never corrects the log silently.
- **Bookkeeping is always its own changeset**, never folded into a work changeset.
- **A missing binding is reported, not invented.** An agent or skill that finds no verification binding says so and stops.
- **Authored content has no automated gate.** Voice lines, text pools, and art are ruled by a human; a human-only gate needs a recorded human statement as evidence, never an assumption.
