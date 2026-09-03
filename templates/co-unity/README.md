---
sync_version: 1
content_hash: d904905e23064a0f756806081d6c9321fb4b20700d69cc736723437242965946
---

# co-unity

> **Language**: **English** · [한국어](README_ko.md)
> **Status**: ⚠️ Beta — v0.1.0
> Gated Unity/VR game-development workflow. Work runs on two decoupled tracks: a design track that takes a topic from agreed scope (G0) to a human-locked design document and a feature backlog (G1), and an implementation track that takes one backlog entry through reconnaissance, requirements, architecture, a persisted build plan, implementation, a verified review cycle and human acceptance (G2) to an as-built codex and a merge. Process documents are written before implementation and the codex only after G2; design (intent, immutable once locked) and codex (as-built, teammate-facing) are two areas that are never merged. Version control is Plastic SCM (Unity Version Control) driven as cm.exe from WSL — the inherited git-shaped harness items are documented as inert. The PM is the main thread: it keeps judgment, dedup, gate presentation, human rulings and the merge ceremony, and dispatches only write-authorship and verification, which never run on the main thread.

## Overview

Gated Unity/VR game-development workflow. Work runs on two decoupled tracks: a design track that takes a topic from agreed scope (G0) to a human-locked design document and a feature backlog (G1), and an implementation track that takes one backlog entry through reconnaissance, requirements, architecture, a persisted build plan, implementation, a verified review cycle and human acceptance (G2) to an as-built codex and a merge. Process documents are written before implementation and the codex only after G2; design (intent, immutable once locked) and codex (as-built, teammate-facing) are two areas that are never merged. Version control is Plastic SCM (Unity Version Control) driven as cm.exe from WSL — the inherited git-shaped harness items are documented as inert. The PM is the main thread: it keeps judgment, dedup, gate presentation, human rulings and the merge ceremony, and dispatches only write-authorship and verification, which never run on the main thread. See docs/context.md for full architecture and standards.

## Quick Start

This is a beta variant of the workspace template. It inherits from `templates/common` and includes variant-specific customizations.

### For Claude Code users:

See `CLAUDE.md` for detailed instructions.

### For Gemini CLI users:

See `GEMINI.md` for detailed instructions.

## Team Mission

**Mission:** Gated Unity/VR game-development workflow. Work runs on two decoupled tracks: a design track that takes a topic from agreed scope (G0) to a human-locked design document and a feature backlog (G1), and an implementation track that takes one backlog entry through reconnaissance, requirements, architecture, a persisted build plan, implementation, a verified review cycle and human acceptance (G2) to an as-built codex and a merge. Process documents are written before implementation and the codex only after G2; design (intent, immutable once locked) and codex (as-built, teammate-facing) are two areas that are never merged. Version control is Plastic SCM (Unity Version Control) driven as cm.exe from WSL — the inherited git-shaped harness items are documented as inert. The PM is the main thread: it keeps judgment, dedup, gate presentation, human rulings and the merge ceremony, and dispatches only write-authorship and verification, which never run on the main thread.

## Meet the AI Team

Your partners consist of specialized agents, each with a distinct role. The **Project Manager (PM)** is your single point of entry — it is the main thread, keeps judgment and the human gates, and dispatches the rest of the team.

| Agent | Role | Tier | Model |
|-------|------|------|-------|
| **architect** | Authors design docs, design ADRs, the feature backlog, requirements, architecture, and the persisted build plan | high | inherit |
| **code-mapper** | Read-only code recon: verified file:line inventories, call paths, assembly boundaries | medium | inherit |
| **code-writer** | Implements the persisted plan and applies ruled review fixes, under the Unity guardrails | medium | inherit |
| **codex-reconcile** | Writes the as-built codex, schema first, only after the human rules G2 | high | inherit |
| **doc-extractor** | Verbatim extraction from the process docs; `NOT ANSWERED IN DOCS` when they are silent | medium | inherit |
| **finding-verifier** | Adversarially verifies one review finding: CONFIRMED, REFUTED, or CONFIRMED-AS-CLARITY | high | inherit |
| **gate-preflight** | Audits the G2 preconditions with evidence; preflight PASS is not acceptance | medium | inherit |
| **plan-validator** | Hostile audit of the persisted plan against canon; a canon conflict stops the line | high | inherit |
| **review-angle** | Runs exactly one review angle against the shared brief; findings only, never fixes | high | inherit |
| **security-monitor** | Phase 0 baseline scan and an optional phase 4 security angle; reports, never fixes | medium | inherit |
| **stack-setup** | Toolchain reachability from WSL, Plastic workspace registration, the verification bindings | medium | inherit |
| **test-runner** | Runs the bound verification commands exactly as written and reports honestly | medium | inherit |
| **vc-checkin** | The `cm.exe` check-in ceremony; returns `cs:N` or `BLOCKED`; never merges | medium | inherit |
| **vr-ux-designer** | VR comfort, diegesis, ergonomics, and input robustness (optional) | medium | inherit |

## Skills

- **architecture-doc**: The feature's architecture doc — components, contracts, runtime flow, and the persisted build plan.
- **code-review**: The union review cycle — brief, eleven angles, dedup, verification, human ruling, surgical fixes.
- **codex**: Ingest, query, and lint the as-built codex against `docs/codex/CODEX.md`, after G2 only.
- **feature-requirement-doc**: The testable, scoped contract for one buildable feature, written after G1.
- **handoff**: A brief a cold session can start from — one task, exact paths, the procedure to invoke.
- **plastic-checkin**: The `cm.exe` check-in ceremony, the merge runbook, the git→cm cheat sheet, `ignore.conf`.
- **refactoring**: Behavior-preserving change under the bound gates, plus the Unity traps.
- **system-design-doc**: A design-track system doc — model plus dynamics — locked by the human at G1.
- **test-driven-development**: Red-green-refactor against the bound EditMode/PlayMode suites and compile gates.
- **unity-custom-package**: Scaffolding and maintaining custom UPM packages.

## How to Collaborate

Working with us is structured to maximize quality and prevent collisions. Here is our standard workflow:

### A. The PM Gateway

Always start your requests by talking to the **PM**. Do not invoke specialist agents directly. The PM will analyze your request and bring in the right experts.

### B. Standard Workflow Phases

Two decoupled tracks. The design track (phase 1) ends in the human's **G1** lock; the implementation track (phases 2–6) ends in the human's **G2** acceptance, the codex, and a merge.

0. **Environment bootstrap:** `stack-setup` binds the toolchain and authors `docs/verification-bindings.md`; `test-runner` records the baseline.
1. **Design track:** `architect` writes the design doc and its ADRs on `design-<topic>`; **G1** is your ruling; then the feature backlog, and the PM merges the branch to main.
2. **Feature planning:** `code-mapper` ∥ `doc-extractor` recon, then `architect` writes requirements, architecture, and the persisted build plan; `plan-validator` audits it.
3. **Implementation:** `code-writer` ↔ `test-runner`, at most three iterations before the PM escalates to you.
4. **Review cycle:** one `review-angle` per roster angle, `finding-verifier` per survivor, then **you rule each finding** fix / defer / reject.
5. **Acceptance and codex:** `gate-preflight` assembles the evidence; **G2** is your ruling; only then `codex-reconcile` writes the codex.
6. **Close-out:** the PM runs the `cm.exe` merge ceremony; `vc-checkin` commits the bookkeeping as a separate changeset. No PR, no push.

### C. Available Commands

Version control here is Plastic SCM (Unity Version Control), driven as `cm.exe` from WSL — never git. The harness's `/sync` and `/commit-push-pr` commands are git-only and **inert**; `plastic-bootstrap.ts` rewrites them as redirect stubs at scaffold time.

- `cm.exe status --header` — Orientation: repository and current branch.
- `bun scripts/co-unity/plastic-bootstrap.ts` — Strip the git machinery and write `ignore.conf`; run after scaffolding and after every `upgrade-project.ts`.
- `bun scripts/audit.ts` — The harness QA gate (must exit 0).
- `/changelog "..."` — Add an entry to `CHANGELOG.md`.
- `/memlog "summary"` — Append a summary to today's session log.
- `/meeting` — Run a structured, inline multi-agent discussion.

## Variant Type

**Type**: game

This variant focuses on Unity / VR game development under Plastic SCM (Unity Version Control): a gated two-track workflow — design locked by the human at G1, features accepted at G2 — with an as-built codex written only after acceptance.

> **⚠️ Beta variant** — not for production use.

- **Client Engagements**: 0/3 (see variant governance rules)
- **Beta Duration**: 0/3 months
- **Additional Checks**: Pending

See `scripts/helpers/variant-governance-rules.ts` for promotion criteria.

---

*Last Updated: 2026-09-03*
