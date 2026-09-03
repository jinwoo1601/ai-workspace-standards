# PROMOTION_CHECKLIST.md — Phase B Promotion Conditions

## ✅ PROMOTION HOLD RELEASED — PROMOTED 2026-09-03

> **This project has been promoted to `templates/co-unity/`.** The owner approved promotion
> in plain language on 2026-09-03; `variant.json` now declares `promotionHold.hold = false`,
> flipped as step 0 of the Phase C run. The hold text below is retained as the standing
> record of the gate that governed this variant up to that point.
>
> **The hold that was in force:** `variant.json` declared `promotionHold.hold = true`. The hold
> came off only when the owner approved promotion **in plain language**. Green readiness checks
> were **not** an approval: every condition in the table below could be ✅ and this project
> still must not have been promoted.
>
> **Enforcement is mechanical, not advisory.** `scripts/l3-to-variant-pipeline.ts` and
> `scripts/project-to-variant.ts` each run a pre-flight that reads the **source**
> project's `variant.json` before any write and abort on `promotionHold.hold === true`.
> There is no `--force` bypass — `--force` cannot override the hold. Removing it is a
> deliberate, reviewable edit to `variant.json` made by the owner *after* the approval,
> never a silent default and never a side effect of this checklist turning green.
>
> Reference: `docs/designs/2026-08-29-promotion-hold-gate-design.md` (workspace root).

---

## Promotion Conditions

| # | Condition | Verification | Status |
|---|-----------|--------------|--------|
| 1 | All 14 specialist personas plus `pm` present, each with the 7 required `##` sections in order and an `access` field in frontmatter | `bun run agent:verify` | Done — `agent:verify` 15/15, `validate-agents.ts` 0 errors (2026-09-01) |
| 2 | All 10 variant skills present with the 5 required `##` sections (`## Context`, `## When to Use`, `## Execution Steps`, `## Output Format`, `## Related Skills`) | `bun scripts/validate-skills.ts` | Done — `validate-skills.ts` 0 errors; audit skill-section check green (2026-09-01) |
| 3 | All 6 procedures validate: every `agent_key` is a roster name, every `skill_key` is a registered skill, every output type is registered in `procedures/_output-types.yaml`, and `procedures/_template/` is deleted | `bun scripts/validate-procedures.ts --variant co-unity --root <scratch>` where `<scratch>` symlinks `templates/co-unity/{procedures,agents,skills}` → this draft and `templates/common/{agents,skills}` → the harness (a bare run from the draft root reads `procedures/` as the `l0` namespace; `--variant co-unity` without that layout passes vacuously — `listProcedureDirs` returns nothing) | Done — OK on the symlinked layout, all 6 procedures incl. the S4 steps (2026-09-03) |
| 4 | Audit script passes with 0 errors | `bun scripts/audit.ts` | Done — `audit.ts` all checks passed, git-less tree (2026-09-01) |
| 5 | `AGENTS.md` carries all 6 `VARIANT-*` marker pairs with content between them, and the `COMMON-AGENTS` block verbatim | `bun run agent:verify` + manual diff of the COMMON-AGENTS block against `templates/common/AGENTS.md` | Done — markers present (Phase 3.5 pre-flight, 2026-09-01 rehearsal); COMMON-AGENTS block byte-identical. **Presence is not survival**: the pipeline regenerates `AGENTS.md` from common — row 14 restores it |
| 6 | `docs/co-unity.context.md` conforms to the WS-09 context skeleton (standard slot order) | From workspace root: `bun scripts/validate-templates.ts` (check WS-09) | Done — slot order verified; context generated cleanly in the 2026-09-01 rehearsal |
| 7 | Every `agents/*.md` carries the WS-10 `lifecycle:` frontmatter block, with a matching record at `docs/lifecycle/agents/<name>.md` | From workspace root: `bun scripts/validate-templates.ts` (check WS-10) | Done — `validate-agents.ts` runtime + governance records valid (2026-09-01) |
| 8 | Bilingual user guide present and 1:1 mirrored: `docs/user-guide.md` + `docs/user-guide_ko.md`, identical heading and table structure (WS-11) | From workspace root: `bun scripts/validate-templates.ts` (check WS-11) + manual heading diff | Done — EN/KO heading sets identical (8/8), 2026-09-01 |
| 9 | No `docs/context.md` override — the inherited common context is untouched — and no file in the variant references a constitution document | `docs/context.md` differs from `templates/common/docs/context.md` only by the scaffold's name substitutions (`[Project Name]` / `<variant-name>` → `co-unity`) and is in the pipeline's `SKIP_IN_COPY` — confirm it is absent from the pipeline output; `grep -rni constitution Projects/co-unity --include='*.md'` returns only the standard `intentional-duplicate` comment in `docs/co-unity.context.md` | Done — absent from the 2026-09-03 rehearsal output; grep clean apart from the standard comment |
| 10 | Hand-authored template lifecycle record exists: `docs/lifecycle/templates/co-unity.md` (Created / Phase History / Acceptance Criteria / Metadata) | Human review | Done — `docs/lifecycle/templates/co-unity.md` authored 2026-09-01 |
| 11 | `scripts/co-unity/SCRIPTS.md` registers every variant script with its layer and version row | `bun scripts/verify-scripts.ts --verify` | Done — `verify-scripts.ts --verify` 98 scripts, 0 warnings (2026-09-01) |
| 12 | End-to-end: scaffold a throwaway project from this variant, run `bun scripts/co-unity/plastic-bootstrap.ts` on it, and confirm the audit is green — the git machinery is stripped and `ignore.conf` is written | Manual run on a throwaway scaffold; then `bun scripts/audit.ts` in that scaffold | Done — 2026-09-03, `.sandbox/co-unity-e2e-20260903` scaffolded via `new-project.ts --variant co-unity --platform both`: readiness gate green, scaffold audit **all checks passed** before bootstrap; `plastic-bootstrap.ts` then removed `.git`, `.githooks`, `.github`, `.gitattributes`, `.gitignore` (REMOVE 5), wrote the four `/sync` + `/commit-push-pr` redirect commands (WRITE 4), and skipped `ignore.conf` (already complete from the template); post-bootstrap `audit.ts` **all checks passed** and `bun test tests/plastic-bootstrap.test.ts` 10/10. The only `cm.exe` note is the expected WARN that the throwaway dir is not a registered Plastic workspace |
| 13 | `_ORIGIN.md` Phase B manual copy steps reviewed and complete | Human review | Done — steps 0–14 executed 2026-09-03. Step 0 flipped `promotionHold.hold` to `false`; `l3-to-variant-pipeline.ts` ran 7/7 phases with the readiness gate green; steps 1–7 landed via the pipeline (15 agents, 10 variant skills, 6 procedures + `_output-types.yaml`, `docs/codex/`, `docs/verification-bindings.md`, `docs/phase-definitions.md`, the bilingual guides, `scripts/co-unity/`, `tests/`); step 8 copied `docs/lifecycle/templates/co-unity.md` to the workspace root with the promotion row added; step 9 confirmed `CLAUDE.md`/`GEMINI.md` pruned as identical (expected) and `variant.json` carried; steps 10–11 `validate-templates.ts` 0 errors and `validate-procedures.ts --variant co-unity` OK on the real layout; steps 12–14 as recorded in rows 12 and 14. **Deviations**: (a) the pipeline must be invoked with an explicit `--output` — the no-`--output` form aborts Phase 4 at `join(config.outputPath, …)` with `paths[0] … got undefined` **after** the variant is already written (`l3-to-variant-pipeline.ts:904`, harness defect, not fixed here per the owner's ruling that the pipeline stays as is); (b) Phase 4.5 writes `_pipeline_report.json` / `_pipeline_report.md` into the variant root — no other variant ships them and `new-project.ts` overlays them into every scaffold, where root-`.md` File Organization Policy fails the audit, so both were removed from `templates/co-unity/` |
| 14 | Post-pipeline restore and survival diff: `AGENTS.md`, `README.md`, `README_ko.md`, `SECURITY.md`, `LICENSE`, `memory/workflow.md`, `.claude/settings.json`, `.gemini/settings.json` copied from this draft over the pipeline output and byte-identical to it; the review report removed from the output; `docs/co-unity.context.md` identical except the appended `## Variant-Specific PM Configuration` section and the re-applied `VARIANT-INJECT` wrappers; skill graph generated; the same diff run against the rehearsal output first | `_ORIGIN.md` Phase B steps 13–14 — the `diff -q` list must print nothing; then `validate-templates.ts` + `validate-variant-readiness.ts` green again | Done — real run 2026-09-03 against `templates/co-unity/`. Restore applied (`AGENTS.md`, `README.md`, `README_ko.md`, `SECURITY.md`, `LICENSE`, `memory/workflow.md`, both `settings.json`), `docs/reports/2026-09-02-adoption-review.md` removed (empty dir kept with `.gitkeep`), and the 14-file `diff -q` list **printed nothing**. `COMMON-AGENTS` block byte-identical to `templates/common/AGENTS.md`. `docs/co-unity.context.md` differs only by the 14 re-applied `VARIANT-INJECT` wrapper lines plus two blank lines and the trailing `---` — the shape both rehearsals predicted. Skill graph regenerated and verified (scope: 71 nodes / 224 edges; root: 571 nodes / 1739 edges). Post-restore `validate-templates.ts` 0 errors (4 warnings, all pre-existing — the only co-unity one is the known C-SK-02 `pm.md` `last_reviewed` parity warning), `validate-variant-readiness.ts --variant co-unity` all checks passed, `validate-procedures.ts --variant co-unity` OK. `git status -- skills/ templates/common/` clean — no collateral writes. Rehearsed first on `.sandbox/rehearsal-20260903-075111/` and `…-081447/` as required |

---

## Notes

- **Version control**: this variant runs on Plastic SCM (Unity Version Control) via `cm.exe`.
  The harness-inherited git pipeline (`/sync`, `dev-sync.ts`, `gen-pr-body.ts`, the pre-commit
  battery, GitHub Actions) is **inert** here and is documented as such, not deleted from the
  inherited template. None of the verification steps above run a version-control command inside
  a scaffolded co-unity project; the workspace-root checks operate on the harness tree.
- **Pipeline regeneration (2026-09-03, confirmed by rehearsal)**: `generate-variant.ts` does not copy
  this draft's `AGENTS.md` (`generateAgentsMd` rebuilds it from `templates/common/AGENTS.md` + agent
  frontmatter) or READMEs (`generateReadme` renders the common template with the registry's
  variant-type text); root files outside the scan set (`SECURITY.md`, `LICENSE`) never enter the
  manifest. Both `settings.json` files survived the rehearsal (`keep_l3`) and stay on the restore list
  as a guard. Row 14 is the compensating gate.
- **Appended PM section**: Phase 4.6 appends `## Variant-Specific PM Configuration` (pm.md's three
  overrides) to `docs/co-unity.context.md`. Kept as-is — it is the harness contract for every variant.
- **CLAUDE.md / GEMINI.md**: deliberately identical to `templates/common`. The current variant
  contract inherits them and the pipeline strips files identical to their L0 counterpart, so no
  variant-specific section is added to either. Reconcile survival for this variant rests on
  `AGENTS.md`, `README.md` / `README_ko.md`, `variant.json`, and the variant-owned trees.

**Promotion Decision**: [x] PASS / [ ] FAIL — *the owner approved promotion in plain language in conversation on 2026-09-03 ("this is my plain language approval"), after the independent adoption review, fixes S3–S9, cosmetics C1–C16, and two green rehearsals. **Phase C executed 2026-09-03**: step 0 flipped `promotionHold.hold` to `false`, `_ORIGIN.md` steps 1–14 ran to completion, and all 14 conditions above are Done. The variant now lives at `templates/co-unity/` (status `beta`, v0.1.0). The commit/PR is the owner's to run via `/sync` — this run stopped before it.*
**Reviewed By**: the owner (in conversation)
**Review Date**: 2026-09-03
