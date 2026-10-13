# Diagram Design 적용 및 검수

기준: 2026-10-13, AlgoBook `1052a6f72ec408b947b76eca0b999fd189953dfe`.

## 적용 범위와 선택

사용자가 지정한 [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)의 `skills/diagram-design/SKILL.md` (metadata version 2.6)와 style-guide, profiles, onboarding, semantic-patterns, output-spec, animation, flowchart, state, tree, dependency, heatmap 지침을 검토했다.

기존 사이트를 개선하는 작업이므로 AlgoBook의 `docs/style.css`를 디자인 기준으로 사용한다. 새 기본 스킨이나 외부 폰트를 설치하지 않았다. 인라인 자료는 콘텐츠에 맞춘 `fit` 캔버스로 구성하고 정적 요약은 폭 640px을 사용한다. 기존 장/예제는 삭제하지 않고 추가 사례를 붙인다.

| 의미 | 표현과 이유 |
|---|---|
| 용량 판정 | 답 후보 범위와 검사 지점을 분리하고 날짜별 분할을 함께 표시. 전체 알고리즘 흐름도보다 실제 판정 상태를 읽는 것이 목적 |
| 격자 BFS | 좌표 격자, FIFO 큐, 발견 거리, 부모, 복원 경로. 일반 정량 heatmap으로 바꾸지 않고 벽/대기/현재/경로를 글자로 표시 |
| LIS 복원 | 원본 배열, 길이별 후보, 부모 표, 복원 순서. 전체 부모 forest를 한 화면에 그리지 않고 필요한 한 경로만 표시 |

범위/좌표/순서가 이미 관계를 나타내는 곳에는 장식용 연결선을 넣지 않는다. 복원 순서의 연결선은 수평이며 노드 전에 그린다. 각 그림의 현재 판단만 주황으로 강조하고, 선택된 경로는 청록과 글자·인덱스로 구분한다. 긴 입력은 글꼴을 줄이지 않고 그림 안에서만 좌우로 스크롤한다. 한글 SVG 라벨의 최소 크기는 12px이다.

| 역할 | 프로젝트 토큰 |
|---|---|
| paper / paper-2 | `#ffffff` / `#f4f7fa` |
| ink / muted | `#112235` / `#526579` |
| accent / accent-tint | `#a74414` / `#fff0e5` (기존 주황 계열의 명도 조정) |
| confirmed | `#0f766e` / `#e8f5f2` |
| 본문 글꼴 | 기존 Inter, Pretendard, Noto Sans KR, OS 한글 sans fallback |
| 기술 값 | Consolas, Liberation Mono, monospace |

## 산출물과 운영 범위

- `docs/visual-study.html`: 자체 포함 HTML. 입력으로 알고리즘 상태를 재계산하는 실험 3종. 외부 자원 요청이나 데이터 전송 없음.
- `docs/visual-study-summary.html`: 스크립트 없는 자체 포함 정적 요약. `scripts/build-diagram-summary.cjs`로 같은 기본 예제에서 생성한다.
- `docs/app.js`: 이분탐색·격자 BFS·LIS 장에서 확장 실험을 같은 출처 iframe으로 삽입한다. 높이 메시지는 출처, 발신 창, 실험 ID, 유한한 높이를 확인한다.
- `docs/visual-advanced.js`: 기존 격자 BFS와 LIS 본문에 반례/복원 6단계를 추가한다. 전체 walkthrough는 253→259단계.

스킬의 presentation-animation 템플릿은 고정된 항목의 표시/숨김에 쓰는 컨트롤러이다. 이번 입력 편집과 알고리즘 재계산은 기존 앱 기능의 확장이므로 별도의 수동 단계 컨트롤을 사용한다. 자동 재생, CSS 이동 효과, 타이머는 추가하지 않는다. 따라서 reduced-motion에서도 입력·수동 탐색은 사용 가능하다. JavaScript가 없거나 인쇄할 때는 **문서의 기본 예제**를 보여 주며, 사용자 입력을 인쇄한 결과로 오해하지 않도록 안내한다.

정적 HTML에는 스킬의 원본 `self_check.py`와 `verify-geometry.py`를 적용했다. 인터랙티브 HTML은 사용자 요청에 따른 일반 애플리케이션 스크립트를 포함하므로 원본 스킬의 고정 애니메이션 컨트롤러 전용 self-check 대상이 아니다. 해당 파일은 아래 독립 모델·브라우저 검사로 검증한다.

## 검증

- 기존 `checks.cjs`: 5,423 assertions, 기초 C++ 15개 및 추가 C++ 30개 통과.
- 기존 `visual-checks.cjs`: 45장, 259단계, 의미별 renderer·트리 합·lowbit·점프·스택 검사 통과.
- `privacy-checks.cjs`: 기존 독립 개념 구조와 공개 자료 조건 유지.
- `deep-lab-checks.cjs`: 632개 독립 기준 사례. 용량은 모든 연속 분할 열거, BFS는 Floyd-Warshall, LIS는 모든 부분집합과 비교. HTML에 표시된 C++ 판정/탐색 코드도 240개 사례로 컴파일·실행.
- `deep-lab-browser-checks.cjs`: 1100px/390px 각 3개 화면, 버튼·키보드·입력 오류·경계 프리셋·벽 편집·원본 인덱스 복원·목차 전환 확인. 본문 iframe 3곳 높이와 모바일 overflow 확인. no-JS, print, reduced-motion, SVG 접근성/문자 경계, 외부 요청 0건 확인.
- 정적 summary: 원본 스킬 `self_check.py` 통과, `verify-geometry.py` finding 0.

화면 검증은 로컬 Chromium과 Noto Sans KR 환경에서 수행한다. 폰트는 사이트에 추가하지 않고 기존 시스템 fallback을 유지한다. 별도 SVG/PNG를 출판용 산출물로 추가하지 않는다.
