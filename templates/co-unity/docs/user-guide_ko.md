---
translated_from_hash: c1c821700657903cfdce9c25389ea663a9a81b33e4b22f18ca93baaa7f3ab285
---
# co-unity User Guide

**Language**: [English](user-guide.md) · **한국어**

> Plastic SCM 환경의 Unity / VR 프로젝트에서 co-unity 에이전트 팀을 사용하기 위한 실전 중심 가이드입니다. 팀 개요와 구성원 목록은 [README_ko.md](../README_ko.md)를, 거버넌스 및 디스패치 규칙은 [AGENTS.md](../AGENTS.md) 및 [CLAUDE.md](../CLAUDE.md) / [GEMINI.md](../GEMINI.md)를 참고하세요.

---

## 1. Quick Start

co-unity는 전적으로 **PM 게이트웨이 패턴**으로 운영됩니다. 사용자는 PM과 대화하고, PM이 계획을 수립하고, PM이 전문 에이전트를 디스패치하고, PM이 게이트를 제시하며, 게이트를 판정하는 것은 **사용자**입니다.

1. **작업을 평이한 언어로 설명합니다** — "데미지 모델 설계 주제를 시작해줘", "웨이포인트 기능을 착수해줘", "이 브랜치를 리뷰해줘", "수용하고 머지해줘". 전문 에이전트를 직접 호출하려고 하지 마세요. 전문 에이전트는 사용자의 직접 요청을 거부하고 PM으로 리다이렉트합니다.
2. **PM이 작업을 분류**(Phase Determination)하고, 다단계 작업(2개 이상 파일 또는 2단계 이상 순차 작업)에 대해서는 다른 어떤 작업보다 먼저 **실행 계획 표**를 출력합니다.

   | # | Task | Agent | Tier | Model |
   |---|------|-------|------|-------|
   | 1 | 기능이 건드리는 코드 표면을 조사 | `code-mapper` | Medium | [모델] |
   | 2 | 요구사항 문서 작성 | `architect` | High | [모델] |
   | 3 | 작업물을 체크인하고, 부기(bookkeeping)를 별도 체인지셋으로 체크인 | `vc-checkin` | Medium | [모델] |

3. **사용자가 계획을 승인**합니다(또는 수정을 요청합니다). PM은 멀티 에이전트 작업에서 이 단계 없이는 절대 전문 에이전트 디스패치로 넘어가지 않습니다.
4. **PM이 전문 에이전트를 디스패치**합니다. 표의 각 행마다 하나씩, 순차/병렬 실행 순서를 준수합니다. 읽기 전용 작업(정찰, 리뷰 앵글, 검증)은 병렬로, 쓰기 작업은 한 번에 하나씩 진행합니다.
5. **PM이 게이트를 제시하고, 사용자가 판정합니다.** G1(설계 잠금)과 G2(기능 수용)는 사용자의 몫입니다. 프리플라이트 PASS는 증거일 뿐 수용이 아닙니다.
6. **PM은 sync가 아니라 체크인으로 마무리합니다.** 모든 계획의 마지막 행은 `vc-checkin` 행입니다 — 작업물을 체크인하고, 부기는 **별도** 체인지셋으로 체크인합니다. 여기에는 `/sync`도, PR도, push도 없습니다.

**경험칙**: 에이전트 파일(`agents/code-writer.md` 등)에 직접 무언가를 시키려 하고 있다면 멈추고, 대신 PM을 통해 요청을 전달하세요. 그리고 사용자가 말한 적 없는데 게이트가 통과된 것처럼 보인다면, 그 게이트는 통과되지 않은 것입니다.

---

## 2. What Kind of Task Do You Have?

아래 표를 참고하면 PM이 어떤 에이전트와 스킬을 디스패치할지 예상할 수 있습니다. 에이전트 이름을 직접 지정할 필요는 없지만—작업을 설명하는 것만으로 충분합니다—이 매핑을 알고 있으면 요청을 더 명확하게 작성하는 데 도움이 됩니다.

| 작업 유형 | 에이전트 | 스킬 / 프로시저 | 비고 |
|-----------|----------|------------------|-------|
| 설계 주제 시작 | `architect`, `vr-ux-designer`(선택) | `system-design-doc` · 프로시저 `system-design` | 먼저 G0가 필요합니다: `design-<topic>` 브랜치가 존재하고 범위가 합의되어야 합니다. 설계 문서는 *의도*를 담으며 G1에서 잠기는 순간 불변이 됩니다 |
| 백로그에서 기능 착수 | `code-mapper` ∥ `doc-extractor`, 이후 `architect`, 이후 `plan-validator` | `feature-requirement-doc`, `architecture-doc`, `research-analysis` · 프로시저 `feature-planning` | 정찰은 항상 계획보다 먼저 실행됩니다. 빌드 계획은 아키텍처 문서의 `## Build plan`에 영속화되기 전까지 존재하지 않습니다 |
| 구현 | `code-writer` ↔ `test-runner` | `test-driven-development`, `unity-custom-package` · 프로시저 `feature-implementation` | 최대 3회 반복 후 PM이 사용자에게 에스컬레이션합니다. 모든 신규 에셋과 폴더에는 `.meta`가 필요합니다 |
| 변경 사항 리뷰 | `review-angle` ×N, 이후 생존 항목마다 `finding-verifier`, `security-monitor`(선택) | `code-review`, `security-scan` · 프로시저 `feature-review` | 임의(ad hoc)로 진행하지 않고 항상 프로시저를 따릅니다. 검증되지 않은 발견 사항은 사용자에게 도달하지 않으며, 판정 전에는 어떤 수정도 적용되지 않습니다 |
| 수용 및 머지 | `gate-preflight`, `test-runner`, `codex-reconcile`, `vc-checkin`, 이후 PM | `evidence-ledger`, `codex`, `plastic-checkin` · 프로시저 `release-verification` | G2는 사용자의 몫입니다. 코덱스는 사용자가 판정한 후에만 작성됩니다. 세 개의 체인지셋을 순서대로: 코덱스 → 머지 → 부기 |
| 프로젝트 및 바인딩 온보딩 | `stack-setup`, `test-runner`, `security-monitor` | `documentation-writing`, `test-driven-development`, `security-scan` · 프로시저 `environment-bootstrap` | `docs/verification-bindings.md`를 산출합니다. 실행할 수 없는 바인딩은 바인딩이 아닙니다 — 아무도 빌드 명령을 즉석에서 만들어내지 않습니다 |
| 코덱스 작성 | `codex-reconcile` | `codex` | 스키마 우선: 작성 전에 `docs/codex/CODEX.md`를 읽습니다. G2 이후에만 진행합니다. 설계는 코덱스 도메인이 아닙니다 |
| 세션 인계 | PM | `handoff` | 컨텍스트가 없는 새 세션이 곧바로 시작할 수 있는 브리프를 산출합니다: 하나의 작업, 정확한 경로, 호출할 워크플로우 스킬 |

---

## 3. The Standard Multi-Stage Workflow

co-unity는 **서로 분리된 두 개의 트랙**으로 운영됩니다. 설계는 한 번 잠기면 여러 기능에 공급되고, 각 기능은 자체 루프를 돕니다.

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
cm.exe status --header                        # 오리엔테이션: 워크스페이스의 실제 상태 확인
bun scripts/co-unity/plastic-bootstrap.ts     # git 기계장치 제거, ignore.conf 작성
bun scripts/audit.ts                          # QA / 문서화 게이트 (반드시 exit 0)
```

프로젝트를 스캐폴딩한 뒤 `plastic-bootstrap.ts`를 실행하고, **`upgrade-project.ts`를 실행할 때마다 다시 실행**하세요. 업그레이드가 하네스의 git 기계장치를 다시 배포하며, 부트스트랩이 그것을 다시 제거합니다.

> ### ⚠️ Never git. `/sync` is inert here.
>
> 이 variant의 버전 관리는 **Plastic SCM(Unity Version Control)**이며, WSL에서 `cm.exe`로 구동합니다. git 명령을 실행하지 말고, git 브랜치를 만들지 말고, PR을 열지 마세요.
>
> 하네스는 이 variant가 **사용하지 않는** git 형태의 항목들을 함께 배포합니다: `/sync` 및 `/commit-push-pr` 커맨드, `sync`·`source-command-commit-push-pr`·`finishing-a-development-branch` 스킬, `dev-sync.ts`, `gen-pr-body.ts`, pre-commit 훅 배터리, CI 워크플로우 파일. 이들은 그대로 두되 **inert(비활성)**로 문서화되며, 절대 호출되지 않습니다.
>
> 이들의 대체재는 `vc-checkin` 페르소나와 `plastic-checkin` 스킬입니다. `vc-checkin`은 status → categorize → re-register → add → checkin → verify를 실행하고 `cs:N` 또는 `BLOCKED`를 반환합니다. `vc-checkin`은 절대 머지하지 않습니다: **머지 의식은 PM과 함께 메인 스레드에서 실행**되며, 내용 충돌은 문서화된 클릭 경로와 함께 사용자의 Windows Mergetool로 넘어갑니다.
>
> git 훅이 없으므로 pre-commit 시크릿 게이트도 없습니다. 이를 보완하는 통제 수단은 명시적인 `gitleaks --no-git` 스캔입니다 — [SECURITY.md](../SECURITY.md)를 참고하세요.

---

## 4. Phase Structure

co-unity는 7단계 모델을 사용합니다 (`AGENTS.md` §3.5 및 `docs/phase-definitions.md` 참고).

| 단계 | 이름 | PM 역할 | 수행 주체 | 게이트 |
|-------|------|---------|-----------|--------|
| 0 | 환경 부트스트랩 | 오케스트레이터 | `stack-setup`(선택), `test-runner`, `security-monitor`(선택) | 바인딩이 존재하고 그린으로 실행됨 |
| 1 | 설계 트랙 | 게이트 키퍼 (G0, G1) | `architect`, `vr-ux-designer`(선택), `vc-checkin` | **G1 사람의 잠금** |
| 2 | 기능 계획 | 코디네이터 | `code-mapper` ∥ `doc-extractor`, `architect`, `plan-validator`, `vc-checkin` | 계획 영속화 + 감사 완료; canon 충돌은 라인을 멈춤 |
| 3 | 구현 | 코디네이터 | `code-writer` ↔ `test-runner` (최대 3회 반복, 이후 PM 에스컬레이션), `vc-checkin` | 바인딩된 모든 게이트가 그린 |
| 4 | 리뷰 사이클 | 심판 (중복 제거, 제시, 판정 적용) | `review-angle` ×N, 생존 항목마다 `finding-verifier`, `security-monitor`(선택), `code-writer`, `test-runner`, `vc-checkin` | 발견 사항마다 사람이 판정 |
| 5 | 수용 및 코덱스 | 게이트 키퍼 (G2) | `gate-preflight`, `test-runner`, `codex-reconcile`, `vc-checkin` | **G2 사람의 판정**; 코덱스는 그 이후에만 |
| 6 | 클로즈아웃 | 오너 (메인 스레드의 머지 의식) | pm, `vc-checkin` | 머지 체크인 후 부기 커밋 |

**쓰기는 직렬, 읽기는 병렬.** 읽기 전용 작업은 한 턴에 병렬로 디스패치됩니다 — 단계 2의 정찰 쌍(`code-mapper` ∥ `doc-extractor`), 단계 4의 리뷰 로스터(`review-angle` ×N). 쓰기 작업은 **한 번에 한 에이전트씩** 디스패치됩니다: 동시 쓰기는 파일 락 경합을 일으키고, Plastic에서는 절반만 등록된 작업 집합 때문에 다음 `cm.exe status`를 읽을 수 없게 됩니다.

**티어 상한 규칙**: 에이전트의 티어는 간단한 작업에 대해 낮출 수 있지만, 정의된 기준선보다 절대 높일 수 없습니다.

---

## 5. Where Your Output Goes

| 산출물 | 위치 |
|----------|----------|
| 설계 문서 (의도 — 잠기면 불변) | `docs/design/<topic>/<system>.md` |
| 설계 ADR | `docs/design/<topic>/decisions/adr-NNNN-<slug>.md` |
| 기능 백로그 (G1 이후 작성) | `docs/design/<topic>/backlog.md` |
| 요구사항 문서 | `docs/features/<feature>/requirements.md` |
| 아키텍처 문서 + 영속화된 빌드 계획 | `docs/features/<feature>/architecture.md` (`## Build plan`) |
| 코덱스 (as-built, 팀원 대상) | `docs/codex/` — `CODEX.md`(스키마), `index.md`, `log.md`, `templates/`, 도메인 폴더 `code/ art/ narrative/ audio/ production/` (`vr-ux/`는 선택) |
| 검증 바인딩 | `docs/verification-bindings.md` |
| 워크플로우 상태 및 세션 로그 | `memory/workflow.md` (활성 브랜치마다 한 행, 유일한 보드) 및 `memory/YYYY-MM-DD.md` (서사) |
| 읽기 전용 에이전트 리포트 | `memory/reports/<YYYY-MM-DD>-<agent>-<slug>.md` |
| 리뷰 브리프 | 세션 스크래치패드에 절대 경로로 — 프로젝트 트리 내부에는 절대 저장하지 않음 |
| Changelog 항목 | `CHANGELOG.md` (`[Unreleased]` 섹션, 릴리스 시 이동) |
| 에이전트 간 핸드오프 페이로드 | [handoff-spec.md](handoff-spec.md)에 따른 세션 내 JSON (기본적으로 디스크에 영구 저장되지 않음) |
| 구현 코드 및 테스트 | 영속화된 계획에 따라 프로젝트의 일반 소스 트리 |

**도메인 규칙**

- **설계와 코덱스는 절대 합쳐지지 않습니다.** 설계 문서는 *의도*를 기록하며 G1에서 잠기는 순간 불변이 됩니다. 코덱스는 시스템을 *만들어진 그대로* 기술하며 팀원 대상의 진입점입니다. **설계는 코덱스 도메인이 아닙니다.**
- **코덱스는 G2 이후에만 작성됩니다.** 그 이전에는 절대, 추측으로도 작성하지 않습니다.
- **ADR 번호는 주제 전체가 공유하는 하나의 시퀀스입니다.** `adr-NNNN`을 작성하기 전에 디스크에 이미 존재하는 가장 큰 번호를 확인하세요. `decisions/` 폴더는 해당 주제의 첫 ADR이 나올 때 지연 생성됩니다.
- **워크플로우 상태는 파일 하나에 있습니다.** `memory/workflow.md`는 활성 브랜치마다 한 행을 담습니다 — `branch | track | stage | last changeset | next action` — 각 게이트와 날짜는 `stage`에 기록되고, 브랜치가 머지되면 행은 제거되며, 일일 세션 로그가 서사를 담습니다. 오리엔테이션이란 그 파일을 읽고 `cm.exe status --header`와 교차 확인하는 것을 의미합니다. 둘이 일치하지 않으면 PM은 다른 세션이 진행 중일 수 있다고 경고하고 당신의 판단을 기다립니다 — 로그를 조용히 수정하지 않습니다.
- **부기는 항상 자체 체인지셋입니다.** 작업 체인지셋에 절대 섞지 않습니다.
- **없는 바인딩은 보고 대상이지 발명 대상이 아닙니다.** 검증 바인딩을 찾지 못한 에이전트나 스킬은 그 사실을 보고하고 멈춥니다.
- **작성된 콘텐츠에는 자동 게이트가 없습니다.** 음성 대사, 텍스트 풀, 아트는 사람이 판정합니다. 사람 전용 게이트는 추정이 아니라 기록된 사람의 진술을 증거로 요구합니다.
