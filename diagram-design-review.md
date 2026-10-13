# 통합 예제 시각화 검토 (2026-10-13)

## 현재 적용 범위

사용자 요청에 따라 PR #2의 별도 실험 구조를 교체한다. 45개 장에서 **예제 따라가기** 하나만 렌더링한다. 사용자 입력 폼·격자 편집·별도 iframe·자동 재생 컨트롤러를 제거하고 준비된 예제 선택과 수동 단계 이동만 제공한다. 기존 기본 예제와 주요 경계/반례, 용량 판정·BFS 경로·LIS 복원은 같은 레지스트리와 컨트롤러를 사용한다.

`diagram-design` v2.6의 SKILL, semantic-patterns, state, tree, flowchart, animation 지침을 읽고 기존 AlgoBook 브랜드에 적용했다. 배열은 인덱스/후보, BFS는 격자/큐/부모, LIS는 꼬리 후보/원본 인덱스/복원 순서라는 의미를 보존한다. 알고리즘의 큐를 서비스 병목 다이어그램으로 바꾸는 등 의미가 맞지 않는 패턴을 강제로 적용하지 않는다.

- 한 영역 안에서 예제 제목/조건 → 단계 이동 → 현재 판단 → 도식 순으로 읽는다.
- 기본 브랜드의 잉크색, 흰 배경, 주황 판단 강조, 청록 확정 상태를 사용한다. 새 외부 폰트를 추가하지 않는다.
- 부연 설명은 한국어 sans, 값/인덱스는 monospace를 사용하고 작은 라벨을 보강한다.
- 그림자는 제거하고 선과 여백으로 구조를 구분한다. SVG를 축소하지 않고 원래 캔버스 폭으로 로컬 스크롤한다.
- SVG에는 제목·설명과 연결된 접근성 이름을 제공한다. 방향키는 그림 자체에 초점이 있을 때만 처리하며 스크롤 영역의 방향키를 가로채지 않는다.
- 인쇄는 현재 선택 예제의 현재 상태를 표시한다. JavaScript 없는 사용자는 정적 기본 요약을 볼 수 있다.

이번 작업은 기존 알고리즘 앱의 화면 통합이다. 고정 요소를 표시/숨김하는 스킬의 애니메이션 템플릿을 복제한 결과물이 아니며, 알고리즘 상태를 렌더링하는 공통 수동 컨트롤러를 쓴다. 자동 재생과 이동 효과가 없어 reduced-motion에서도 수동 탐색을 유지한다. 기존 그래프의 간선/트리 토폴로지는 유지한다. 모든 기존 그래프가 스킬의 직교 연결선·노드 수 제한을 충족하도록 재작성했다는 의미는 아니다.

## 검증 결과

- 기존 알고리즘·본문 C++·의미별 시각화 검증 유지
- 용량/BFS/LIS의 독립 기준 풀이 632개와 표시 C++ 240개 사례 재검증
- 45장·68개 고정 예제를 1100px/390px에서 136회 방문, 해당 예제 전체 상태 수 합계 1,004개: 시각화 영역 1개, 입력창/iframe 없음, 모든 예제의 첫/다음/결과 이동
- 상세 예제의 결과 18, BFS 5/−1/0, LIS 복원 [3,5,6] 및 중복 길이 1 확인
- 키보드, 링크 호환, 인쇄, no-JS, reduced-motion, 외부 요청/콘솔 오류 검증

이하 내용은 PR #2 당시의 기록이며 위 통합 변경으로 대체되었다.

---

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
