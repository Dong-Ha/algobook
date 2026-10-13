# AlgoBook — 생각을 코드로

C++ 기초 문법을 아는 학습자를 위한 코딩테스트 인터랙티브 교과서입니다. 기본 알고리즘부터 심화 자료구조와 재사용 가능한 상태·자료구조 설계 개념을 다룹니다.

## 구성

- 학습 45장과 혼합 판단 연습 15문제
- 45장 모두 본문 예시의 단계별 시각화: 배열·그래프·트리·격자·시간 구간·상태 전이
- 모든 장에서 하나의 **예제 따라가기**: 준비된 기본·경계·반례를 선택하고 처음/이전/다음/결과로 이동
- 이분탐색의 용량 판정, 격자 BFS의 큐·부모·경로, LIS의 꼬리 후보·복원도 같은 영역에서 확인
- 사용자 데이터 입력·벽 편집·자동 재생 없이 고정 예제를 단계별로 학습
- 판단 문제 60개와 해설, 장별 작성 과제 45개와 접힌 기준 결과, C++17 예제, 적용 조건과 반례
- 제곱근 분할·세그먼트 트리·LCA·비트마스크·LIS·스위핑 등 심화 과정
- 상태 모델·국소 갱신·후보 필터·경로 평가·변경 영향·자원 상태·비트 집합·정렬 인덱스·지연 유효성·순위 집계의 개념 학습
- 각 개념의 학습 목표, 적용 조건, 불변식, 반례와 독립 개념 예제
- 실전 자료의 원문, API 명세, 수치 제약과 실제 예시는 공개 자료에 포함하지 않음

## 로컬 실행

별도 패키지 설치나 빌드가 필요 없는 정적 웹사이트입니다.

```bash
python3 -m http.server 8000 --directory docs
```

브라우저에서 http://localhost:8000 을 엽니다.

## 파일 구조

| 파일 | 역할 |
|---|---|
| `docs/index.html` | 기본 문서와 내비게이션 |
| `docs/style.css` | 반응형 레이아웃과 스타일 |
| `docs/content.js` | 본문, C++ 코드, 문제와 해설 |
| `docs/advanced.js` | 심화 알고리즘과 풀이 패턴 |
| `docs/cases.js` | 일반 DP 패턴과 조합 학습 보충 |
| `docs/service-cases.js` | 핵심 개념의 학습 목표·재사용 조건·독립 예제 |
| `study-checks.cjs` | 추가 학습 예제 컴파일·실행 및 기준 풀이 비교 |
| `docs/exercises.js` | 각 장의 직접 작성 과제와 검증 기준 |
| `docs/engines.js` | 단계별 알고리즘 상태 생성 |
| `docs/visuals.js` | 기초 예시 데이터와 공통 시각화·단계 조작 |
| `docs/visual-advanced.js` | 심화·개념 30장 예시 시각화 데이터 |
| `privacy-checks.cjs` | 공개 파일의 원문 식별 정보 잔존 및 개념 학습 구조 검사 |
| `visual-checks.cjs` | 전체 장 시각화 구조와 본문 입력·결과 검증 |
| `docs/worked-examples.js`, `docs/worked-details.js` | 공통 고정 예제 목록과 상세 도식 |
| `docs/example-models.js` | 용량 판정·격자 BFS·LIS의 검증된 상태 계산 |
| `docs/worked-examples.css` | 통합 시각화 디자인 |
| `docs/visual-study.html` | 이전 링크 호환 이동 및 JavaScript 없는 정적 예제 |
| `deep-lab-checks.cjs` | 확장 실험을 완전탐색·Floyd·부분집합 기준 풀이와 비교 |
| `docs/app.js` | 장 탐색과 공통 예제 시각화 연결 |
| `checks.cjs` | 알고리즘 검증 및 C++ 예제 컴파일·실행 |

## 검증

Node.js 18 이상과 C++17을 지원하는 `g++`가 필요합니다. 저장소 루트에서 실행하세요.

```bash
node checks.cjs
node visual-checks.cjs
node privacy-checks.cjs
node deep-lab-checks.cjs
```

시각화 결과를 독립적인 기준 풀이와 비교하고, 본문의 C++ 예제 45개를 입력 맥락과 함께 컴파일·실행합니다. 추가 과정의 국소 갱신, 유효성 판정, 정렬 키 변경, 구간 질의, 순위, LIS, 스택, LCA, 방문 집합 DP 등을 작은 기준 풀이와 비교합니다.

시각화는 미리 구현된 알고리즘을 단계별로 보여 줍니다. 임의의 C++ 코드를 실행하거나 채점하는 서비스는 아닙니다. 학습 진도는 저장하지 않습니다.

## 검토 결과 (2026-10-03)

expert_astra가 45장 전체 본문, 코드, 불변식·반례, 시각화와 원자료 9개를 대조했습니다. C++ 기초 문법을 아는 학습자의 독학·복습에 충분한 구성으로 판단했습니다. 코드를 직접 작성하고 작은 기준 입력으로 검증하는 연습을 함께 하세요.

Bellman-Ford 완화와 음수 사이클, Floyd 중간 정점, 제곱근 분할의 질의와 최대값 감소, 배낭 갱신 방향, 경우의 수, 방문 집합 DP, LCS 셀 의존 관계, LCA 점프, 자원 전이, 비트 집합과 순위·선택 등에 20단계를 보충했습니다. 총 246단계이며, 혼합 연습은 장별 확인 문제와 다른 입력·조건을 사용합니다. 모듈러 역원 조건, 정수 중간값 전제와 MST 목표도 명확하게 했습니다.

현재 게시 파일에는 원문 고유 업무 규칙·API 계약·수치 제약·원문 예시가 직접 실려 있지 않음을 원자료 텍스트와 문제·API 페이지 이미지로 확인했습니다. 일반 알고리즘 원리와 독립 예제는 유지합니다. **이 검토는 현재 게시 파일에 대한 것이며, 과거 Git 커밋에는 이전 상세 자료가 남아 있습니다.** 저장소 이력까지 지워진다는 의미는 아닙니다.

## 편집

본문·문제를 수정하려면 `docs/content.js`, `docs/advanced.js`, `docs/cases.js`, `docs/service-cases.js`, 알고리즘 동작을 수정하려면 `docs/engines.js`, 시각화·화면을 수정하려면 `docs/app.js`를 편집합니다.

사이트: https://dong-ha.github.io/algobook/

GitHub Pages는 `main` 브랜치의 `/docs` 폴더를 게시 원본으로 사용합니다. `main`에 푸시하면 사이트가 자동으로 배포됩니다.

## 통합 예제 시각화 (2026-10-13)

45개 장의 `EXAMPLE WALKTHROUGH`, `INTERACTIVE LAB`, 확장 iframe을 **예제 따라가기** 한 영역으로 통합했습니다. 한 번에 예제 하나만 표시하고, 예제를 바꾸면 첫 단계로 돌아갑니다. 사용자 데이터 입력과 자동 재생은 제공하지 않습니다. 이분탐색의 lower_bound와 용량 판정처럼 서로 다른 학습 목적은 예제 선택 버튼으로 구분합니다.

그림 영역에 초점을 두고 방향키로 앞뒤 이동, Home/End로 처음/결과 이동이 가능합니다. 스마트폰에서는 긴 그림 안에서만 가로로 스크롤합니다. 인쇄는 선택한 예제의 현재 단계와 설명을 표시합니다.

이전 `visual-study.html?lab=binary|grid|lis` 링크는 해당 장의 상세 예제로 이동합니다. JavaScript가 꺼진 경우 정적 그림을 제공하며, 메인 페이지에도 정적 요약 링크가 있습니다. 인쇄용 기본 요약은 `docs/visual-study-summary.html`입니다. `visual-study.html`의 정적 그림을 편집하면 `node scripts/build-diagram-summary.cjs`로 다시 생성합니다.

- `docs/worked-examples.js`: 기본 예제와 기존 실험의 경계·반례 목록
- `docs/worked-details.js`: 용량 판정, BFS 경로 복원, LIS 복원 상세 예제
- `docs/visuals.js`: 모든 예제에서 사용하는 하나의 화면/단계 컨트롤러
- `docs/worked-examples.css`: diagram-design의 정보 위계, 제한된 강조, 읽기 크기, 로컬 스크롤 적용

디자인 적용 범위는 [diagram-design-review.md](diagram-design-review.md)를 참고하세요. 알고리즘 계산은 브라우저 안에서 수행하며 외부 자원을 요청하지 않습니다.

선택적 화면 검증은 Playwright 환경에서 `node deep-lab-browser-checks.cjs`로 실행합니다. Chromium 경로는 `ALGOBOOK_BROWSER`, 검수 이미지 출력 위치는 `ALGOBOOK_QA_DIR`로 지정합니다. 45장 전체의 단일 시각화, 예제 전환, 데스크톱/모바일, 키보드, 인쇄, 이전 링크와 no-JS 대체 경로를 확인합니다.
