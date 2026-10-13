# Web Design Guidelines UX 검토

2026-10-13 · 검토 기준 커밋 `14c27def47624b9eb51464fa14cae04c6ea5338b`.

사용자 지정 스킬: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines

읽은 SKILL metadata: author vercel, version 1.0.0. 스킬 지시에 따라 검토 당일 다음 원문을 새로 가져왔다.
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

스킬은 UI 감사 도구다. 이번 요청은 개선 구현까지 포함하므로 코드 및 실제 화면의 문제를 확인한 뒤 수정했다. 아래 `file:line`은 **기준 커밋에서 발견한 위치**이며 새 코드의 줄 번호가 아니다.

## 주요 발견 사항과 수정

- docs/app.js:84 - 모바일의 닫힌 목차가 초점 대상 → 닫힌 목차 inert/aria-hidden, 열린 메뉴 dialog/aria-modal, 본문/skip link inert, Tab 순환·Escape·닫기·배경 클릭·초점 복원.
- docs/app.js:75 - 장 이동 후 이전 링크/숨겨진 목차에 초점 잔존 → 장 제목 또는 요청한 본문 위치로 초점 이동; 초기 진입에서 초점 강제 이동 없음.
- docs/app.js:64 - 섹션 이동이 버튼 → 실제 링크와 URL의 section. 새 탭/수정키 클릭 보존, 제목 앵커 scroll-margin.
- docs/index.html:12 - 45장 목차에 빠른 찾기 없음 → 이름·짧은 설명·tag·ID 검색, 결과 수/빈 결과 안내, 검색어 지우기, URL q 복원.
- docs/visuals.js:284 - 예제/단계가 주소에 반영되지 않음 → example·step·section 복원과 공유 링크. 예제 전환 pushState, 단계 이동 replaceState.
- docs/visuals.js:297 - 단계마다 상세 코드/그림 DOM 재생성으로 열린 코드와 스크롤 초기화 → 상세 코드는 예제 전환 때만 생성, 그림 가로 스크롤 보존, 펼친 패널 panels 복원.
- docs/worked-examples.css:7 - 모바일 단계 바 실측 91px, 두 줄 → 약 62px 한 줄 컨트롤. 수치 고정폭, 진행 표시, 44px 터치 영역.
- docs/visuals.js:298 - 마지막 단계에서 현재 초점 버튼이 native disabled → aria-disabled와 실행 차단을 함께 사용해 초점 보존. 완료 안내 추가.
- docs/app.js:66 - 코드 복사 결과가 버튼 문구에만 의존 → live status, 실패 시 선택/복사 방법 안내. 단계 링크 복사도 실패 시 실제 링크 제공.
- docs/index.html:4 - 테마/안전 영역 정보 없음 → theme-color, color-scheme, viewport-fit 및 safe-area CSS. 브랜드·코드 translate=no.
- docs/style.css:2 - 전체 reduced-motion 대응과 앵커 가림 보완 필요 → 전역 reduced-motion, 헤더/단계 바를 고려한 초점·스크롤 여백, 단계 변경 후 현재 판단이 가려지면 위치 보정.

새 UX 스타일은 `docs/ux.css`, 주소 및 펼침 상태는 `docs/study-navigation.js`에 모았다. 사이트 전체의 색·서체와 기존 알고리즘 설명/결과는 유지하면서 읽기 흐름, 조작과 피드백을 개선했다. 알고리즘 입력 편집과 자동 재생은 도입하지 않았다.

## 적용 판단

접근성, 초점, 입력/빈 상태, reduced-motion, 수치 폭·긴 문장, URL 상태, 터치와 안전 영역, hover/disabled 피드백을 확인했다. 새 검색 입력은 label/name/type/inputmode/autocomplete/spellcheck를 지정하며 붙여넣기를 막지 않는다. 링크와 버튼은 native 요소로 유지한다. 비동기 복사 결과를 live region으로 알린다. SVG는 접근성 이름/설명을 유지하며 홈 도식도 보강했다.

서버 hydration, 결제/파괴적 작업, 날짜·가격, 사진/동영상/GIF, 드래그는 현재 기능에 없어 관련 규칙의 적용 대상이 아니다. 표시 목록은 45장과 혼합 연습 항목이며 외부 글꼴이나 서비스가 없다. 계산 및 렌더링은 기존 정적 앱 안에서 처리한다. 전체 Web Interface Guidelines 또는 WCAG 인증을 받았다는 의미는 아니다.

## 검증 결과

- 기존 checks: 5,423 assertions, 표시 C++ 45개 통과.
- visual-checks, privacy-checks 통과; 용량/BFS/LIS 독립 기준 632개 및 표시 C++ 240개 사례 유지.
- 전체 시각화: 45장·68개 고정 예제를 1100/390px에서 136회 방문. 단일 예제 영역, 입력 편집/iframe 없음, 접근성 이름·라벨·overflow 검증 통과.
- UX 브라우저 검증: 320/390/768/1100px. 검색 및 빈 상태/재진입, 메뉴 inert/Tab 순환/Escape/배경 닫기/크기 전환, 장·섹션 초점, 예제/단계/패널 새로고침과 방문 기록, 잘못된 상태 값, 복사 성공/실패, 가로 스크롤과 펼친 코드 보존, 고정 바에 가려지지 않는 설명, reduced-motion, 인쇄 통과.
- 콘솔 오류 및 외부 요청 0건. 모바일 메뉴·예제와 홈 화면 직접 검수.

검증은 로컬 Chromium에서 수행했다. 실제 Android/iOS, Safari 및 화면 낭독기 테스트를 완료했다는 의미는 아니다.
