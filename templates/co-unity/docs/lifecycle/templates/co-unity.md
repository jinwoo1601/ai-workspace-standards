# co-unity — Template Lifecycle

## Created

2026-09-01

## Phase History

| Date | From | To | Reason | Approver |
|------|------|-----|---------|----------|
| 2026-09-01 | - | review | Initial creation — game variant (Unity/VR, Plastic SCM) | pm |

## Acceptance Criteria

### Review Phase

- [x] variant.json exists with valid schema
- [x] All 14 specialist personas present (architect, vr-ux-designer, stack-setup, security-monitor, code-mapper, doc-extractor, plan-validator, code-writer, test-runner, review-angle, finding-verifier, gate-preflight, codex-reconcile, vc-checkin) plus the pm override — 15 personas total
- [x] All 10 variant skills present (system-design-doc, feature-requirement-doc, architecture-doc, handoff, code-review, test-driven-development, refactoring, unity-custom-package, plastic-checkin, codex)
- [x] All 6 procedures present (environment-bootstrap, system-design, feature-planning, feature-implementation, feature-review, release-verification) with every output type registered in `procedures/_output-types.yaml`
- [x] inherits_common correctly points to templates/common
- [x] Pipeline order documented: stack-setup → architect → vr-ux-designer → code-mapper ∥ doc-extractor → plan-validator → code-writer → test-runner → review-angle → finding-verifier → gate-preflight → codex-reconcile → vc-checkin
- [x] Optional agents (vr-ux-designer, stack-setup, security-monitor) documented
- [x] Promotion hold declared: `promotionHold.hold = true` in variant.json, with a matching ⛔ PROMOTION HOLD banner in PROMOTION_CHECKLIST.md — promotion requires the owner's plain-language approval, and neither `l3-to-variant-pipeline.ts` nor `project-to-variant.ts` can be forced past it

## Dependencies

- templates/common (L1 common layer)

## Metadata

- **Type**: Template (L2 Variant — game)
- **Current Phase**: review
- **Owner**: pm
- **Last Updated**: 2026-09-01
- **Last Reviewer**: pm
