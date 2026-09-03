# Agent Handoff Specification

This document defines the JSON-based handoff format between agents in the co-unity multi-agent workflow.

## Handoff Format

All agent handoffs use a structured JSON format to ensure clear communication and traceability.

### Basic Structure

```json
{
  "handoff_version": "1.0",
  "task_id": "unique-identifier",
  "from_agent": "agent-name",
  "to_agent": "agent-name",
  "timestamp": "ISO-8601-timestamp",
  "phase": "phase-id",
  "status": "in_progress | completed | blocked | failed",
  "data": {
    // Agent-specific data
  }
}
```

### Standard Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `handoff_version` | string | Yes | Format version (default: "1.0") |
| `task_id` | string | Yes | Unique task identifier |
| `from_agent` | string | Yes | Name of the sending agent |
| `to_agent` | string | Yes | Name of the receiving agent |
| `timestamp` | string | Yes | ISO-8601 timestamp |
| `phase` | string | Yes | Current workflow phase (`0-environment-bootstrap` … `6-close-out`) |
| `status` | string | Yes | Task status |
| `data` | object | Yes | Agent-specific payload |

## Agent-Specific Handoff Formats

> The payloads below use an **illustrative** generic game example (a waypoint system). Paths, feature names, and binding ids are placeholders — substitute the project's own.

### PM → Code Writer

Dispatches implementation. The plan is referenced by its **persisted path**, never restated in the payload: the plan does not exist until it is persisted, and the persisted copy is the only authority.

```json
{
  "handoff_version": "1.0",
  "task_id": "FEAT-2026-014",
  "from_agent": "pm",
  "to_agent": "code-writer",
  "timestamp": "2026-09-01T09:20:00Z",
  "phase": "3-implementation",
  "status": "in_progress",
  "data": {
    "feature": "waypoint-routing",
    "branch": "feat-waypoint-routing",
    "persisted_plan": {
      "path": "docs/features/waypoint-routing/architecture.md",
      "section": "## Build plan",
      "phase_id": "build-plan-phase-1",
      "audited_by": "plan-validator",
      "audit_result": "no canon conflict"
    },
    "canon": [
      "docs/features/waypoint-routing/requirements.md",
      "docs/design/navigation/waypoint-graph.md"
    ],
    "constraints": {
      "scope": "exactly the persisted plan phase — no scope creep",
      "meta_discipline": "every new asset and folder gets its .meta; a folder's own .meta lives in the parent directory",
      "assembly_boundaries": "respect the existing asmdef graph; tests belong in the test assembly",
      "version_control": "none — vc-checkin runs every check-in"
    }
  }
}
```

### Code Writer → Test Runner

Hands over verification. The payload names the **changed files** and the **subset of bindings** that covers them — the receiver runs bound commands only, and never invents one.

```json
{
  "handoff_version": "1.0",
  "task_id": "FEAT-2026-014",
  "from_agent": "code-writer",
  "to_agent": "test-runner",
  "timestamp": "2026-09-01T11:05:00Z",
  "phase": "3-implementation",
  "status": "in_progress",
  "data": {
    "changed_files": [
      "Assets/Scripts/Navigation/WaypointGraph.cs",
      "Assets/Scripts/Navigation/WaypointGraph.cs.meta",
      "Assets/Tests/EditMode/Navigation/WaypointGraphTests.cs"
    ],
    "bindings_subset": {
      "source": "docs/verification-bindings.md",
      "run": ["compile-editor", "editmode-tests:Navigation"],
      "skip": ["playmode-tests", "build-android"],
      "skip_reason": "no runtime or platform surface touched by this changeset"
    },
    "expected_green": "see the binding's expected-green patterns and the dated baseline",
    "notes": [
      "Serialized field 'nodes' was not renamed — no scene or prefab migration needed",
      "New test assembly reference added: Navigation.Tests -> Navigation"
    ],
    "iteration": 1,
    "max_iterations": 3
  }
}
```

### PM → Codex Reconcile

Dispatches the as-built documentation. This handoff is **only valid after G2**, and it must carry the ruling and its date — if the dispatch cannot state them, the gate has not happened.

```json
{
  "handoff_version": "1.0",
  "task_id": "FEAT-2026-014",
  "from_agent": "pm",
  "to_agent": "codex-reconcile",
  "timestamp": "2026-09-01T16:40:00Z",
  "phase": "5-acceptance-and-codex",
  "status": "in_progress",
  "data": {
    "g2_ruled_by": "human",
    "g2_ruled_at": "2026-09-01",
    "g2_statement": "Accepted in conversation; recorded in memory/workflow.md (stage accepted(G2 2026-09-01)) and in memory/2026-09-01.md",
    "feature_docs": [
      "docs/features/waypoint-routing/requirements.md",
      "docs/features/waypoint-routing/architecture.md"
    ],
    "codex_root": "docs/codex/",
    "schema": "docs/codex/CODEX.md",
    "domains": ["code"],
    "constraints": {
      "schema_first": "read docs/codex/CODEX.md before writing anything",
      "as_built_only": "describe what shipped, not what was intended — design is not a codex domain",
      "commit": "the codex is its own changeset, checked in by vc-checkin before the merge ceremony"
    }
  }
}
```

## Error Status Handoff

```json
{
  "handoff_version": "1.0",
  "task_id": "FEAT-2026-014",
  "from_agent": "test-runner",
  "to_agent": "pm",
  "timestamp": "2026-09-01T12:30:00Z",
  "phase": "3-implementation",
  "status": "blocked",
  "data": {
    "error": {
      "type": "verification_failure | no_binding | environment_quirk | plan_conflict",
      "message": "Error description",
      "binding": "editmode-tests:Navigation",
      "evidence": "0 tests ran with compile errors present in the log — this is a FAIL, not a pass"
    },
    "recovery_attempts": 3,
    "escalation_required": true
  }
}
```

## Handoff Rules

1. **Version Control**: Always include `handoff_version`
2. **Task Continuity**: Use the same `task_id` throughout the workflow
3. **Timestamp**: Use ISO-8601 format for all timestamps — always, with the timezone offset, never a local or relative date
4. **Status Updates**: Update `status` field at each handoff
5. **Error Handling**: Use `status: blocked` for issues requiring escalation
6. **Retry ceiling**: the `code-writer` ↔ `test-runner` loop runs at most **3** iterations. On the third failure, stop and escalate to the PM with `escalation_required: true` — never a fourth silent attempt
7. **Gate provenance**: any handoff downstream of a gate restates the ruling and its date (`g1_ruled_by` / `g1_ruled_at`, `g2_ruled_by` / `g2_ruled_at`). A missing ruling is a blocked handoff, not an assumption
8. **Paths, not restatements**: reference persisted documents by path. Never paste a plan, a requirement, or a binding into the payload — the file on disk is the authority
9. **Completion**: Final handoff to PM should have `status: completed`

## Validation

When receiving a handoff, agents should:

1. Verify `handoff_version` is supported
2. Check `task_id` matches the expected workflow
3. Validate required fields are present
4. Confirm any gate provenance the phase requires is present and dated
5. Log the handoff for traceability
6. Return acknowledgment on successful receipt

---

*Handoff specification v1.0 - subject to change as workflow evolves*
