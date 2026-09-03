# Agents Directory

This directory contains the **personas** used by the co-unity workflow.

## Personas, not tool agents

These files are tool-agnostic canon. They describe a role, not a tool configuration: no tool-native
agent format, no platform wording. Each project **derives** its tool-native agents from these files
at scaffold time, and the derivation enforces two frontmatter fields mechanically — `access`
(`read-only` or `write`) and `intended_tools` (the tools the role may hold, plus a notes line on the
limits). Change the persona; the derived agent follows.

## Persona Files

Each persona is a markdown file (`<name>.md`) carrying:

- **Frontmatter** — `tier`, `phases`, `handoff_to` / `handoff_from`, `required_skills`, `access`,
  `access_scope`, `intended_tools`, and the `lifecycle` block pointing at its governance record.
- **`## Role`** — what it is, and the line that names it as derivable canon.
- **`## ⚠️ PM-ONLY INVOCATION`** — no persona accepts a direct user request.
- **`## Responsibilities`**, then its own method sections.
- **`## Output Format`** — including `### Required Deliverable Artifact`, the on-disk path every
  dispatch must leave behind.
- **`## Constraints`**, **`## Meeting Participation`**, **`## Dispatch Protocol`**.

## Available Personas

| Persona | File | Tier | Access | Phases | Optional |
|---------|------|------|--------|--------|:--------:|
| PM (main thread) | `pm.md` | high | write — `memory/*.md`, `CHANGELOG.md`; carve-out: runs the `cm.exe` merge ceremony | 0–6 | no |
| Architect | `architect.md` | high | write — `docs/design/**`, `docs/features/**` | 1, 2 | no |
| VR UX Designer | `vr-ux-designer.md` | medium | write — `docs/design/vr-ux/**` and UX sections | 1 | yes |
| Stack Setup | `stack-setup.md` | medium | write — bindings, `ignore.conf`, config | 0 | yes |
| Security Monitor | `security-monitor.md` | medium | read-only | 0, 4 | yes |
| Code Mapper | `code-mapper.md` | medium | read-only | 2, 4 | no |
| Doc Extractor | `doc-extractor.md` | medium | read-only | 2 | no |
| Plan Validator | `plan-validator.md` | high | read-only | 2 | no |
| Code Writer | `code-writer.md` | medium | write — source, tests, and the `.meta` files it creates | 3, 4 | no |
| Test Runner | `test-runner.md` | medium | read-only — runs the bound commands, never edits | 0, 3, 4, 5 | no |
| Review Angle | `review-angle.md` | high | read-only | 4 | no |
| Finding Verifier | `finding-verifier.md` | high | read-only | 4 | no |
| Gate Preflight | `gate-preflight.md` | medium | read-only — `cm.exe status/log/find/cat` only | 5 | no |
| Codex Reconcile | `codex-reconcile.md` | high | write — `docs/codex/**` only | 5 | no |
| VC Checkin | `vc-checkin.md` | medium | write — version-control state only | 1, 2, 3, 4, 5, 6 | no |

The PM is the main thread, not a dispatched specialist. Everything else is dispatched by the PM.

## Persona Groups

- **Orchestration** — PM
- **Design** — Architect, VR UX Designer
- **Recon & Audit** — Code Mapper, Doc Extractor, Plan Validator, Gate Preflight, Security Monitor
- **Execution** — Code Writer, Test Runner
- **Review** — Review Angle, Finding Verifier
- **Docs & Version Control** — Codex Reconcile, VC Checkin
- **Environment** — Stack Setup

## Adding or Changing a Persona

1. Copy the shape of an existing file in this directory — the seven required `##` sections in order.
2. Fill the frontmatter contract, including `access`, `access_scope`, and `intended_tools`.
3. Add a governance record at `docs/lifecycle/agents/<name>.md`.
4. Register the persona in `AGENTS.md` and in the roster table above.
5. Re-derive the project's tool-native agents so the access rules are re-enforced.

## Handoff Specification

See [`../docs/handoff-spec.md`](../docs/handoff-spec.md) for the JSON handoff format between personas.

**Handoff rules**: always include `handoff_version`, `task_id`, `from_agent`, `to_agent`; use
ISO-8601 timestamps; update status at each handoff; escalate after 3 failed iterations.

---

*Variant template — customize per project.*
