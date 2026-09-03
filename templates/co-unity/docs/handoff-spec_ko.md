# 에이전트 핸드오프 명세서

이 문서는 co-unity 멀티 에이전트 워크플로우에서 에이전트 간 JSON 기반 핸드오프 형식을 정의합니다.

## 핸드오프 형식

모든 에이전트 핸드오프는 명확한 통신과 추적 가능성을 보장하기 위해 구조화된 JSON 형식을 사용합니다.

### 기본 구조

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
    // 에이전트별 데이터
  }
}
```

### 표준 필드

| 필드 | 타입 | 필수 | 설명 |
|-------|------|------|------|
| `handoff_version` | string | 예 | 형식 버전 (기본값: "1.0") |
| `task_id` | string | 예 | 고유 작업 식별자 |
| `from_agent` | string | 예 | 보내는 에이전트 이름 |
| `to_agent` | string | 예 | 받는 에이전트 이름 |
| `timestamp` | string | 예 | ISO-8601 타임스탬프 |
| `phase` | string | 예 | 현재 워크플로우 단계 (`0-environment-bootstrap` … `6-close-out`) |
| `status` | string | 예 | 작업 상태 |
| `data` | object | 예 | 에이전트별 페이로드 |

## 에이전트별 핸드오프 형식

> 아래 페이로드는 **예시용** 일반 게임 사례(웨이포인트 시스템)를 사용합니다. 경로, 기능 이름, 바인딩 id는 자리표시자이므로 프로젝트의 실제 값으로 대체하세요.

### PM → Code Writer

구현을 디스패치합니다. 계획은 **영속화된 경로**로 참조하며 페이로드에 다시 서술하지 않습니다. 계획은 영속화되기 전까지 존재하지 않으며, 영속화된 사본만이 유일한 권위입니다.

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

검증을 인계합니다. 페이로드는 **변경된 파일**과 그것을 커버하는 **바인딩의 부분집합**을 명시합니다. 수신자는 바인딩된 명령만 실행하며, 명령을 즉석에서 만들어내지 않습니다.

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

as-built 문서 작성을 디스패치합니다. 이 핸드오프는 **G2 이후에만 유효**하며, 판정과 그 날짜를 반드시 담아야 합니다. 디스패치가 그것을 명시할 수 없다면 게이트는 일어나지 않은 것입니다.

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

## 오류 상태 핸드오프

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

## 핸드오프 규칙

1. **버전 관리**: 항상 `handoff_version`을 포함하세요
2. **작업 연속성**: 전체 워크플로우에서 동일한 `task_id`를 사용하세요
3. **타임스탬프**: 모든 타임스탬프에 ISO-8601 형식을 사용하세요 — 예외 없이, 타임존 오프셋을 포함하여, 로컬 표기나 상대 날짜를 쓰지 마세요
4. **상태 업데이트**: 각 핸드오프 시 `status` 필드를 업데이트하세요
5. **오류 처리**: 에스컬레이션이 필요한 문제의 경우 `status: blocked`를 사용하세요
6. **재시도 상한**: `code-writer` ↔ `test-runner` 루프는 최대 **3**회 반복합니다. 세 번째 실패 시 멈추고 `escalation_required: true`와 함께 PM에게 에스컬레이션하세요 — 네 번째 조용한 시도는 없습니다
7. **게이트 출처**: 게이트 하류의 모든 핸드오프는 판정과 그 날짜를 다시 명시합니다 (`g1_ruled_by` / `g1_ruled_at`, `g2_ruled_by` / `g2_ruled_at`). 판정이 없으면 그것은 차단된 핸드오프이지 가정할 대상이 아닙니다
8. **다시 서술하지 말고 경로로**: 영속화된 문서는 경로로 참조하세요. 계획, 요구사항, 바인딩을 페이로드에 붙여넣지 마세요 — 디스크의 파일이 권위입니다
9. **완료**: PM에 대한 최종 핸드오프는 `status: completed`여야 합니다

## 검증

핸드오프를 받을 때 에이전트는 다음을 수행해야 합니다:

1. 지원되는 `handoff_version`인지 확인
2. `task_id`가 예상된 워크플로우와 일치하는지 확인
3. 필수 필드가 있는지 검증
4. 해당 단계가 요구하는 게이트 출처가 존재하고 날짜가 기재되어 있는지 확인
5. 추적 가능성을 위해 핸드오프 기록
6. 성공적인 수신 시 승인 반환

---

*핸드오프 명세서 v1.0 - 워크플로우 발전에 따라 변경될 수 있음*
