# 에이전트 디렉토리 (Agents Directory)

이 디렉토리에는 co-unity 워크플로우에서 사용되는 **페르소나(persona)** 파일이 있습니다.

## 도구 에이전트가 아니라 페르소나입니다

이 파일들은 도구 비종속(tool-agnostic) 정본입니다. 도구 설정이 아니라 역할을 기술합니다 —
도구 고유의 에이전트 포맷도, 플랫폼 명칭도 없습니다. 각 프로젝트는 스캐폴딩 시점에 이 파일들로부터
도구 네이티브 에이전트를 **파생(derive)** 하며, 파생 과정은 두 개의 frontmatter 필드를 기계적으로
강제합니다 — `access`(`read-only` 또는 `write`)와 `intended_tools`(역할이 보유할 수 있는 도구와
그 한계를 적은 notes 줄). 페르소나를 바꾸면 파생된 에이전트가 따라옵니다.

## 페르소나 파일

각 페르소나는 마크다운 파일(`<name>.md`)이며 다음을 포함합니다:

- **Frontmatter** — `tier`, `phases`, `handoff_to` / `handoff_from`, `required_skills`, `access`,
  `access_scope`, `intended_tools`, 그리고 거버넌스 기록을 가리키는 `lifecycle` 블록.
- **`## Role`** — 무엇인지, 그리고 파생 가능한 정본임을 명시하는 줄.
- **`## ⚠️ PM-ONLY INVOCATION`** — 어떤 페르소나도 사용자의 직접 요청을 받지 않습니다.
- **`## Responsibilities`**, 그리고 각자의 방법론 섹션.
- **`## Output Format`** — 모든 디스패치가 디스크에 남겨야 하는 경로를 담은
  `### Required Deliverable Artifact` 포함.
- **`## Constraints`**, **`## Meeting Participation`**, **`## Dispatch Protocol`**.

## 사용 가능한 페르소나

| 페르소나 | 파일 | 티어 | 접근 권한 | 페이즈 | 선택 |
|---------|------|------|----------|--------|:----:|
| PM (메인 스레드) | `pm.md` | high | write — `memory/*.md`, `CHANGELOG.md`; 예외: `cm.exe` 머지 의식 수행 | 0–6 | 아니오 |
| 아키텍트 | `architect.md` | high | write — `docs/design/**`, `docs/features/**` | 1, 2 | 아니오 |
| VR UX 디자이너 | `vr-ux-designer.md` | medium | write — `docs/design/vr-ux/**` 및 설계 문서의 UX 섹션 | 1 | 예 |
| 스택 설정 | `stack-setup.md` | medium | write — 검증 바인딩, `ignore.conf`, 환경 설정 파일 | 0 | 예 |
| 보안 모니터 | `security-monitor.md` | medium | read-only | 0, 4 | 예 |
| 코드 매퍼 | `code-mapper.md` | medium | read-only | 2, 4 | 아니오 |
| 문서 추출자 | `doc-extractor.md` | medium | read-only | 2 | 아니오 |
| 플랜 검증자 | `plan-validator.md` | high | read-only | 2 | 아니오 |
| 코드 작성자 | `code-writer.md` | medium | write — 소스, 테스트, 그리고 자신이 만든 `.meta` 파일 | 3, 4 | 아니오 |
| 테스트 실행자 | `test-runner.md` | medium | read-only — 바인딩된 명령만 실행, 편집 금지 | 0, 3, 4, 5 | 아니오 |
| 리뷰 앵글 | `review-angle.md` | high | read-only | 4 | 아니오 |
| 발견 검증자 | `finding-verifier.md` | high | read-only | 4 | 아니오 |
| 게이트 프리플라이트 | `gate-preflight.md` | medium | read-only — `cm.exe status/log/find/cat`만 | 5 | 아니오 |
| 코덱스 정합자 | `codex-reconcile.md` | high | write — `docs/codex/**`만 | 5 | 아니오 |
| 체크인 실행자 | `vc-checkin.md` | medium | write — 버전 관리 상태만 | 1, 2, 3, 4, 5, 6 | 아니오 |

PM은 디스패치되는 전문가가 아니라 메인 스레드입니다. 그 외 전부는 PM이 디스패치합니다.

## 페르소나 그룹

- **오케스트레이션** — PM
- **설계** — 아키텍트, VR UX 디자이너
- **정찰 및 감사** — 코드 매퍼, 문서 추출자, 플랜 검증자, 게이트 프리플라이트, 보안 모니터
- **실행** — 코드 작성자, 테스트 실행자
- **리뷰** — 리뷰 앵글, 발견 검증자
- **문서 및 버전 관리** — 코덱스 정합자, 체크인 실행자
- **환경** — 스택 설정

## 페르소나 추가 및 변경

1. 이 디렉토리의 기존 파일 구조를 복사합니다 — 필수 `##` 섹션 7개를 순서대로.
2. `access`, `access_scope`, `intended_tools`를 포함한 frontmatter 계약을 채웁니다.
3. `docs/lifecycle/agents/<name>.md`에 거버넌스 기록을 추가합니다.
4. `AGENTS.md`와 위 로스터 표에 페르소나를 등록합니다.
5. 프로젝트의 도구 네이티브 에이전트를 재파생하여 접근 규칙을 다시 강제합니다.

## 핸드오프 사양

페르소나 간 JSON 핸드오프 형식은 [`../docs/handoff-spec.md`](../docs/handoff-spec.md)를 참조하세요.

**핸드오프 규칙**: `handoff_version`, `task_id`, `from_agent`, `to_agent`를 항상 포함하고,
ISO-8601 타임스탬프를 사용하며, 각 핸드오프마다 상태를 갱신하고, 3회 반복 실패 후 에스컬레이션합니다.

---

*Variant 템플릿 — 프로젝트에 맞게 사용자 정의하세요.*
