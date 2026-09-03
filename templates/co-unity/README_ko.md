---
sync_version: 1
lang: ko
lang_reason: source-material
---

# co-unity

> **언어**: [English](README.md) · **한국어**
> **상태**: ⚠️ Beta — v0.1.0
> Gated Unity/VR game-development workflow. Work runs on two decoupled tracks: a design track that takes a topic from agreed scope (G0) to a human-locked design document and a feature backlog (G1), and an implementation track that takes one backlog entry through reconnaissance, requirements, architecture, a persisted build plan, implementation, a verified review cycle and human acceptance (G2) to an as-built codex and a merge. Process documents are written before implementation and the codex only after G2; design (intent, immutable once locked) and codex (as-built, teammate-facing) are two areas that are never merged. Version control is Plastic SCM (Unity Version Control) driven as cm.exe from WSL — the inherited git-shaped harness items are documented as inert. The PM is the main thread: it keeps judgment, dedup, gate presentation, human rulings and the merge ceremony, and dispatches only write-authorship and verification, which never run on the main thread.

## 개요

Gated Unity/VR game-development workflow. Work runs on two decoupled tracks: a design track that takes a topic from agreed scope (G0) to a human-locked design document and a feature backlog (G1), and an implementation track that takes one backlog entry through reconnaissance, requirements, architecture, a persisted build plan, implementation, a verified review cycle and human acceptance (G2) to an as-built codex and a merge. Process documents are written before implementation and the codex only after G2; design (intent, immutable once locked) and codex (as-built, teammate-facing) are two areas that are never merged. Version control is Plastic SCM (Unity Version Control) driven as cm.exe from WSL — the inherited git-shaped harness items are documented as inert. The PM is the main thread: it keeps judgment, dedup, gate presentation, human rulings and the merge ceremony, and dispatches only write-authorship and verification, which never run on the main thread. 전체 아키텍처와 표준은 docs/context.md를 참고하세요.

## 빠른 시작

이것은 워크스페이스 템플릿의 beta 변형입니다. `templates/common`에서 상속하며 변형별 맞춤 설정을 포함합니다.

### Claude Code 사용자:

자세한 지침은 `CLAUDE.md`를 참고하세요.

### Gemini CLI 사용자:

자세한 지침은 `GEMINI.md`를 참고하세요.

## 팀 미션

**미션:** Gated Unity/VR game-development workflow. Work runs on two decoupled tracks: a design track that takes a topic from agreed scope (G0) to a human-locked design document and a feature backlog (G1), and an implementation track that takes one backlog entry through reconnaissance, requirements, architecture, a persisted build plan, implementation, a verified review cycle and human acceptance (G2) to an as-built codex and a merge. Process documents are written before implementation and the codex only after G2; design (intent, immutable once locked) and codex (as-built, teammate-facing) are two areas that are never merged. Version control is Plastic SCM (Unity Version Control) driven as cm.exe from WSL — the inherited git-shaped harness items are documented as inert. The PM is the main thread: it keeps judgment, dedup, gate presentation, human rulings and the merge ceremony, and dispatches only write-authorship and verification, which never run on the main thread.

## AI 팀 소개

당신의 파트너는 각기 고유한 역할을 가진 전문 에이전트들입니다. **프로젝트 매니저(PM)**가 유일한 진입점입니다 — PM은 메인 스레드로서 판단과 사람의 게이트를 쥐고, 나머지 팀을 디스패치합니다.

| 에이전트 | 역할 | 티어 | 모델 |
|---------|------|------|------|
| **architect** | 설계 문서, 설계 ADR, 기능 백로그, 요구사항, 아키텍처, 영속화된 빌드 계획을 작성 | high | inherit |
| **code-mapper** | 읽기 전용 코드 정찰: 검증된 file:line 목록, 호출 경로, 어셈블리 경계 | medium | inherit |
| **code-writer** | Unity 가드레일 아래에서 영속화된 계획을 구현하고 판정된 리뷰 수정을 적용 | medium | inherit |
| **codex-reconcile** | 사람이 G2를 판정한 뒤에만, 스키마를 먼저 읽고 as-built 코덱스를 작성 | high | inherit |
| **doc-extractor** | 프로세스 문서에서 원문 그대로 추출; 문서에 없으면 `NOT ANSWERED IN DOCS` | medium | inherit |
| **finding-verifier** | 리뷰 발견 사항 하나를 적대적으로 검증: CONFIRMED, REFUTED, CONFIRMED-AS-CLARITY | high | inherit |
| **gate-preflight** | G2 전제조건을 증거와 함께 감사; 프리플라이트 PASS는 승인이 아님 | medium | inherit |
| **plan-validator** | 영속화된 계획을 캐논에 대해 적대적으로 감사; 캐논 충돌은 라인을 멈춤 | high | inherit |
| **review-angle** | 공유 브리프에 대해 정확히 하나의 리뷰 관점을 실행; 발견만, 수정은 없음 | high | inherit |
| **security-monitor** | 0단계 기준 스캔과 선택적 4단계 보안 관점; 보고만, 수정은 없음 | medium | inherit |
| **stack-setup** | WSL에서의 툴체인 도달성, Plastic 워크스페이스 등록, 검증 바인딩 작성 | medium | inherit |
| **test-runner** | 바인딩된 검증 명령을 적힌 그대로 실행하고 정직하게 보고 | medium | inherit |
| **vc-checkin** | `cm.exe` 체크인 절차; `cs:N` 또는 `BLOCKED` 반환; 절대 머지하지 않음 | medium | inherit |
| **vr-ux-designer** | VR 편안함, 디제시스, 인체공학, 입력 견고성 (선택) | medium | inherit |

## 스킬

- **architecture-doc**: 기능의 아키텍처 문서 — 컴포넌트, 계약, 런타임 흐름, 영속화된 빌드 계획.
- **code-review**: 통합 리뷰 사이클 — 브리프, 11개 관점, 중복 제거, 검증, 사람의 판정, 외과적 수정.
- **codex**: `docs/codex/CODEX.md`에 따라 as-built 코덱스를 수집·질의·린트, G2 이후에만.
- **feature-requirement-doc**: 빌드 가능한 기능 하나의 테스트 가능하고 범위가 정해진 계약, G1 이후 작성.
- **handoff**: 콜드 세션이 시작할 수 있는 브리프 — 작업 하나, 정확한 경로, 호출할 프로시저.
- **plastic-checkin**: `cm.exe` 체크인 절차, 머지 런북, git→cm 치트시트, `ignore.conf`.
- **refactoring**: 바인딩된 게이트 아래에서의 동작 보존 변경, 그리고 Unity 함정들.
- **system-design-doc**: 설계 트랙 시스템 문서 — 모델과 다이내믹스 — 사람이 G1에서 잠금.
- **test-driven-development**: 바인딩된 EditMode/PlayMode 스위트와 컴파일 게이트에 대한 red-green-refactor.
- **unity-custom-package**: 커스텀 UPM 패키지의 스캐폴딩과 유지보수.

## 협업 방법

협업 방식은 품질을 극대화하고 충돌을 방지하도록 구조화되어 있습니다. 표준 워크플로는 다음과 같습니다:

### A. PM 게이트웨이

항상 요청을 시작할 때 **PM**과 먼저 대화하세요. 전문 에이전트를 직접 호출하지 마세요. PM이 요청을 분석하고 적절한 전문가를 불러옵니다.

### B. 표준 워크플로 단계

분리된 두 트랙입니다. 설계 트랙(1단계)은 사람의 **G1** 잠금으로 끝나고, 구현 트랙(2–6단계)은 사람의 **G2** 승인, 코덱스, 머지로 끝납니다.

0. **환경 부트스트랩:** `stack-setup`이 툴체인을 바인딩하고 `docs/verification-bindings.md`를 작성합니다; `test-runner`가 기준선을 기록합니다.
1. **설계 트랙:** `architect`가 `design-<topic>` 브랜치에서 설계 문서와 ADR을 작성합니다; **G1**은 당신의 판정입니다; 그 다음 기능 백로그, 그리고 PM이 브랜치를 main에 머지합니다.
2. **기능 계획:** `code-mapper` ∥ `doc-extractor` 정찰 후 `architect`가 요구사항, 아키텍처, 영속화된 빌드 계획을 작성하고 `plan-validator`가 감사합니다.
3. **구현:** `code-writer` ↔ `test-runner`, 최대 3회 반복 후 PM이 당신에게 에스컬레이션합니다.
4. **리뷰 사이클:** 로스터 관점마다 `review-angle` 하나, 생존한 발견마다 `finding-verifier` 하나, 그 다음 **당신이 각 발견을 판정**합니다 — fix / defer / reject.
5. **승인과 코덱스:** `gate-preflight`가 증거를 모읍니다; **G2**는 당신의 판정입니다; 그 후에만 `codex-reconcile`이 코덱스를 작성합니다.
6. **마무리:** PM이 `cm.exe` 머지 절차를 실행하고, `vc-checkin`이 북키핑을 별도 체인지셋으로 커밋합니다. PR도 push도 없습니다.

### C. 사용 가능한 명령어

이 변형의 버전 관리는 WSL에서 `cm.exe`로 구동하는 Plastic SCM(Unity Version Control)입니다 — git은 절대 사용하지 않습니다. 하네스의 `/sync`와 `/commit-push-pr` 명령은 git 전용이며 **비활성**입니다; `plastic-bootstrap.ts`가 스캐폴드 시점에 리다이렉트 스텁으로 다시 씁니다.

- `cm.exe status --header` — 오리엔테이션: 저장소와 현재 브랜치.
- `bun scripts/co-unity/plastic-bootstrap.ts` — git 기계장치를 제거하고 `ignore.conf`를 작성; 스캐폴딩 후와 모든 `upgrade-project.ts` 후에 실행.
- `bun scripts/audit.ts` — 하네스 QA 게이트 (0으로 종료해야 함).
- `/changelog "..."` — `CHANGELOG.md`에 항목 추가.
- `/memlog "summary"` — 오늘 세션 로그에 요약 추가.
- `/meeting` — 구조화된 인라인 다중 에이전트 토론 진행.

## 변형 유형

**유형**: game

이 변형은 Plastic SCM(Unity Version Control) 아래의 Unity / VR 게임 개발에 중점을 둡니다: 게이트가 있는 두 트랙 워크플로 — 설계는 사람이 G1에서 잠그고, 기능은 G2에서 승인 — 와 승인 이후에만 작성되는 as-built 코덱스.

> **⚠️ 베타 변형** — 프로덕션 용도가 아닙니다.

- **클라이언트 참여**: 0/3 (변형 거버넌스 규칙 참조)
- **베타 기간**: 0/3개월
- **추가 검증**: 대기 중

승급 기준은 `scripts/helpers/variant-governance-rules.ts`를 참조하세요.

---

*최근 업데이트: 2026-09-03*
