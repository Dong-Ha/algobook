(() => {
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const main=$('#main');
let renderedURL='';
const mobile=matchMedia('(max-width:700px)'),sidebar=$('#sidebar'),shell=$('.shell');
function nav(){
 let html='<a class="nav-home" href="#home">전체 목차</a>',part='';
 CHAPTERS.forEach((c,i)=>{
  if(c.part!==part){if(part)html+='</section>';part=c.part;html+='<section class="nav-group-block"><h2 class="nav-group">'+esc(part)+'</h2>';}
  html+='<a class="nav-item" href="#'+c.id+'" data-search="'+esc((c.id+' '+c.title+' '+c.short+' '+c.tag).toLocaleLowerCase('ko-KR'))+'"><span>'+pad(i+1)+'</span><span>'+esc(c.title.split(':')[0])+'</span></a>';
 });
 html+='</section><section class="nav-group-block"><h2 class="nav-group">10 · 스스로 판단하기</h2><a class="nav-item" href="#practice" data-search="practice 혼합 문제 풀이 복기 판단 연습"><span>'+pad(CHAPTERS.length+1)+'</span><span>혼합 문제와 풀이 복기</span></a></section>';
 $('#chapters').innerHTML=html;
}
function updateLinks(){
 document.querySelectorAll('a[href]').forEach(a=>{
  const hash=new URL(a.href,location.href).hash.slice(1);
  if(a.dataset.section){a.href=window.StudyURL.section(a.dataset.section);return;}
  if(hash==='home'||hash==='practice'||CHAPTERS.some(c=>c.id===hash)){a.dataset.chapter=hash;const url=new URL(window.StudyURL.chapter(hash),location.href);if(a.dataset.entrySection)url.searchParams.set('section',a.dataset.entrySection);a.href=url.pathname+url.search+url.hash;}
 });
}
function filterChapters(){
 const q=$('#chapter-query').value.trim().toLocaleLowerCase('ko-KR'),terms=q.split(/\s+/).filter(Boolean);let count=0;
 $('#chapters').querySelectorAll('.nav-item').forEach(a=>{a.hidden=!terms.every(t=>a.dataset.search.includes(t));if(!a.hidden)count++;});
 $('#chapters').querySelectorAll('.nav-group-block').forEach(group=>{group.hidden=![...group.querySelectorAll('.nav-item')].some(a=>!a.hidden);});
 $('#clear-query').hidden=!q;
 $('#search-status').textContent=q?(count?count+'개 항목을 찾았습니다.':'일치하는 주제가 없습니다. 다른 검색어를 입력하거나 검색어를 지우세요.'):CHAPTERS.length+'개 장 · 혼합 판단 연습';
}
function setMenu(open,{returnFocus=true}={}){
 open=Boolean(open&&mobile.matches);
 const wasOpen=document.body.classList.contains('menu-open');
 document.body.classList.toggle('menu-open',open);
 $('#menu').setAttribute('aria-expanded',String(open));
 $('#menu-backdrop').hidden=!open;
 shell.inert=open;$('.skip').inert=open;sidebar.inert=mobile.matches&&!open;
 if(mobile.matches&&!open)sidebar.setAttribute('aria-hidden','true');else sidebar.removeAttribute('aria-hidden');
 if(open){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');$('#menu-close').focus();}
 else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');if(wasOpen&&returnFocus){if(mobile.matches)$('#menu').focus();else main.querySelector('h1')?.focus({preventScroll:true});}}
}
function scrollToSection(id,{focus=false,behavior='auto'}={}){
 const target=document.getElementById(id);if(!target)return;
 target.scrollIntoView({behavior,block:'start'});
 if(focus){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
}
function card(c,i){
 return '<a class="chapter-card" href="#'+c.id+'"><span class="chapter-no">'+pad(i+1)+'</span><div><h3>'+esc(c.title)+'</h3><p>'+esc(c.short)+'</p></div><span class="card-tag">'+'예제 따라가기'+'</span></a>';
}
function home(){
 document.title='AlgoBook — 생각을 코드로';
 $('#breadcrumb').textContent='나의 알고리즘 교과서';
 let html='<div class="home"><section class="book-intro"><div><p class="eyebrow">INTERACTIVE C++ TEXTBOOK</p><h1 tabindex="-1">생각을 코드로.<br><span>과정을 눈으로.</span></h1><p class="intro-text">왜 이 알고리즘일까요?<br>예제를 보고, 한 단계씩 따라가며<br>풀이를 선택하는 근거를 익힙니다.</p><div class="intro-actions"><a class="button primary" href="#thinking">첫 장 읽기</a><a class="button secondary" href="?section=example-visual#dfs" data-entry-section="example-visual">DFS 예제 보기</a></div></div><div class="cover-diagram" aria-label="DFS 호출 스택과 탐색 경로 예"><div class="diagram-caption"><span>DEPTH FIRST SEARCH</span><span>01 / 07</span></div>'+miniGraph()+'<div class="mini-stack"><span>CALL STACK</span><b>1</b><b>2</b><b class="orange">4</b><small>다음 이웃이 없으면<br>이전 호출로 돌아갑니다.</small></div></div></section><div class="book-meta"><span><b>'+CHAPTERS.length+'</b> 학습 챕터</span><span><b>'+CHAPTERS.length+'</b> 예제 따라가기</span><span><b>'+(CHAPTERS.length+MIXED.length)+'</b> 판단 문제</span><span>C++17 · 기초부터 개념 재사용까지</span></div>';
 html+='<section class="featured"><div class="section-head"><div><p class="eyebrow">SEE THE PROCESS</p><h2>지금, 움직여 보세요</h2></div><p>진입부터 복귀까지. 문자에서 단어까지.</p></div><div class="feature-grid"><a href="#dfs" class="feature-card"><span class="feature-num">08 / GRAPH</span><h3>DFS의 다음 한 걸음</h3><p>호출 스택과 현재 간선을 따라가며<br>방문과 탐색 종료를 구분하세요.</p><span class="text-link">DFS 예제 열기 ↗</span></a><a href="#trie" class="feature-card trie-feature"><span class="feature-num">14 / STRING</span><h3>Trie에 단어 심기</h3><p>공유되는 접두사를 관찰하고<br>단어 검색과 접두사 검색을 비교하세요.</p><span class="text-link">Trie 예제 열기 ↗</span></a></div></section>';
 html+='<section class="study-start" aria-label="빠르게 시작하기"><h2>어디부터 볼까요?</h2><p>처음이라면 기초부터, 복습 중이라면 목차에서 주제를 찾아보세요.</p><div><a href="#thinking"><b>기초 판단</b><span>제약과 시간 복잡도</span></a><a href="#binary"><b>탐색과 단조성</b><span>후보를 버리는 근거</span></a><a href="#dp"><b>DP 상태 정의</b><span>이전 답으로 다음 답 만들기</span></a><a href="#practice"><b>혼합 판단 연습</b><span>유형 이름 없이 풀이 고르기</span></a></div></section>';
 html+='<section><div class="section-head"><div><p class="eyebrow">CONTENTS</p><h2>문제 해석에서 최적해까지</h2></div><span class="muted">C++ 기초 문법을 아는 분을 위한 구성</span></div><div class="contents-grid">';
 let part='';
 CHAPTERS.forEach((c,i)=>{if(c.part!==part){if(part)html+='</div>';part=c.part;html+='<div class="chapter-group"><h3 class="group-title">'+esc(part)+'</h3>'+(c.concept?'<p class="concept-intro">원문 문제 대신 핵심 원리를 학습합니다. 배워야 할 내용과 다른 문제에서 쓸 조건을 확인하고, 독립 개념 예제로 검증하세요.</p>':'');}html+=card(c,i);});
 html+='</div><div class="chapter-group"><h3 class="group-title">10 · 스스로 판단하기</h3><a class="chapter-card" href="#practice"><span class="chapter-no">'+pad(CHAPTERS.length+1)+'</span><div><h3>혼합 문제와 풀이 복기</h3><p>유형 이름 없이 접근법 고르기</p></div><span class="card-tag">'+MIXED.length+'문제</span></a></div></div></section>';
 html+='<section class="reading-guide"><p class="eyebrow">EXAM STUDY PATH</p><h2>실전까지 이어지는 학습 순서</h2><div class="guide-grid"><div><b>01</b><h3><a href="#thinking">기초 판단 익히기</a></h3><p>제약과 복잡도, STL 연산 비용부터 확인합니다.</p></div><div><b>02</b><h3><a href="#sqrt-decomposition">심화 구조 연습하기</a></h3><p>격자 탐색, 최단경로 변형, 구간 갱신을 연결합니다.</p></div><div><b>03</b><h3><a href="#state-model">재사용할 개념 정리하기</a></h3><p>상태·갱신·인덱스의 적용 조건을 정리합니다.</p></div><div><b>04</b><h3><a href="#practice">조건으로 풀이 고르기</a></h3><p>판단 문제를 풀고 작은 반례로 선택을 검증합니다.</p></div></div></section>';
 html+='<section class="reading-guide"><p class="eyebrow">HOW TO STUDY</p><h2>한 장을 읽는 네 번의 질문</h2><div class="guide-grid"><div><b>01</b><h3>어떤 조건인가?</h3><p>제약과 필요한 출력을 먼저 적습니다.</p></div><div><b>02</b><h3>왜 움직이는가?</h3><p>다음 상태를 예상한 뒤 한 단계 실행합니다.</p></div><div><b>03</b><h3>언제 틀리는가?</h3><p>음수·중복·경계 예제로 반례를 확인합니다.</p></div><div><b>04</b><h3>무엇을 남길까?</h3><p>다음 문제에도 쓸 판단 기준을 정리합니다.</p></div></div></section></div>';
 main.innerHTML=html;
}
function miniGraph(){
 return '<svg viewBox="0 0 440 250" role="img" aria-labelledby="cover-title cover-desc"><title id="cover-title">DFS의 방문과 호출 스택</title><desc id="cover-desc">정점 1에서 2를 거쳐 4를 방문했습니다. 다음 이웃이 없으면 스택에서 꺼내 이전 호출로 돌아갑니다.</desc><g fill="none" stroke="#bac7d0" stroke-width="2" stroke-linecap="round"><line x1="220" y1="45" x2="110" y2="120"/><line x1="110" y1="120" x2="60" y2="210"/><line x1="110" y1="120" x2="165" y2="210"/><line x1="220" y1="45" x2="330" y2="120"/><line x1="330" y1="120" x2="350" y2="210"/></g><path d="M220 45L110 120L60 210" fill="none" stroke="#0f766e" stroke-width="4"/>'+[[220,45,'1'],[110,120,'2'],[330,120,'3'],[60,210,'4'],[165,210,'5'],[350,210,'6']].map(([x,y,t])=>'<circle cx="'+x+'" cy="'+y+'" r="22" fill="'+(t==='4'?'#c65d22':+t<3?'#112235':'#fff')+'" stroke="'+(+t<3?'#112235':'#bac7d0')+'"/><text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" fill="'+(+t<3||t==='4'?'#fff':'#425365')+'" font-size="16" font-family="monospace">'+t+'</text>').join('')+'</svg>';
}
function quizHTML(q,i){
 return '<div class="quiz" data-quiz="'+i+'"><p class="quiz-label">CHECK '+pad(i+1)+'</p><h3>'+esc(q.q)+'</h3><div class="quiz-options" role="group" aria-label="답 선택">'+q.options.map((o,j)=>'<button type="button" data-answer="'+j+'" aria-pressed="false"><span>'+String.fromCharCode(65+j)+'</span>'+esc(o)+'</button>').join('')+'</div><div class="quiz-feedback" aria-live="polite" aria-atomic="true"></div><button class="quiet explain-toggle" type="button">해설 보기</button></div>';
}
function wireQuizzes(qs){
 document.querySelectorAll('.quiz').forEach(el=>{
  const q=qs[+el.dataset.quiz],feedback=el.querySelector('.quiz-feedback');
  el.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{
   const answer=+btn.dataset.answer;
   el.querySelectorAll('[data-answer]').forEach(b=>{b.classList.remove('correct','wrong');b.setAttribute('aria-pressed','false');});
   btn.classList.add(answer===q.answer?'correct':'wrong');btn.setAttribute('aria-pressed','true');
   feedback.className='quiz-feedback '+(answer===q.answer?'correct':'wrong');
   feedback.textContent=(answer===q.answer?'맞았습니다. ':'다시 생각해 보세요. ')+q.why;
  }));
  el.querySelector('.explain-toggle').addEventListener('click',()=>{
   feedback.className='quiz-feedback correct';feedback.textContent='정답 '+String.fromCharCode(65+q.answer)+'. '+q.why;
  });
 });
}
function conceptGuide(c){
 if(!c.concept)return '';
 return '<section class="concept-guide" aria-label="학습 목표와 재사용 조건"><div><p class="eyebrow">LEARN</p><h2>배워야 할 부분</h2><ul>'+c.learn.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div><p class="eyebrow">REUSE</p><h2>다른 문제에 적용하는 조건</h2><ul>'+c.reuse.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div></section>';
}
function exerciseHTML(c){
 if(!c.exercise)return "";
 const e=c.exercise;
 return '<section class="workflow" id="exercise"><p class="eyebrow">WRITE & VERIFY</p><h2>직접 작성하고 검증하기</h2><p>'+esc(e.prompt)+'</p><details class="exercise-answer"><summary>작성한 뒤 기준 결과와 비교하기</summary><p><b>기준 결과</b> · '+esc(e.expected)+'</p><p>'+esc(e.why)+'</p></details></section>';
}
function lesson(c){
 const i=CHAPTERS.indexOf(c);document.title=c.title+' · AlgoBook';$('#breadcrumb').textContent=pad(i+1)+' / '+c.title;
 main.innerHTML='<article class="lesson"><div class="lesson-heading"><p class="eyebrow">CHAPTER '+pad(i+1)+' <span>/ '+esc(c.tag)+'</span></p><h1 tabindex="-1">'+esc(c.title)+'</h1><p class="lead">'+esc(c.lead)+'</p><div class="lesson-jumps"><a href="'+window.StudyURL.section('concept')+'" data-section="concept">원리 읽기</a><a href="'+window.StudyURL.section('example-visual')+'" data-section="example-visual">예제 따라가기</a>'+'<a href="'+window.StudyURL.section('code')+'" data-section="code">C++ 코드</a><a href="'+window.StudyURL.section('check')+'" data-section="check">판단 연습</a></div></div><section class="problem-box"><span class="eyebrow">'+(c.concept?'개념을 확인하는 질문':'먼저 생각해 볼 문제')+'</span><h2>'+esc(c.problem)+'</h2><p class="example">'+esc(c.example)+'</p></section>'+conceptGuide(c)+'<section id="example-visual" class="example-visual"></section>'+'<div class="reading-layout"><div class="prose"><section id="concept"><p class="eyebrow">UNDERSTAND THE IDEA</p>'+c.sections.map(([h,p],j)=>'<section class="explanation"><h2><span>'+pad(j+1)+'</span>'+esc(h)+'</h2><p>'+esc(p)+'</p></section>').join('')+'</section><aside class="invariant"><p class="eyebrow">변하지 않는 사실 · INVARIANT</p><p>'+esc(c.invariant)+'</p></aside><aside class="counterexample"><p class="eyebrow">조건을 바꿔 보면</p><p>'+esc(c.trap)+'</p></aside><section id="code" class="code-section"><div class="section-head"><h2>'+ (c.concept?'개념을 구현하는 최소 코드':'C++로 옮기기') +'</h2><button type="button" class="quiet" id="copy-code">코드 복사</button><span id="copy-status" class="sr-only" role="status" aria-live="polite"></span></div><p class="code-hint">'+(c.concept?'독립 개념 예제 · C++17 · 개념 하나를 확인하는 코드입니다. 필요한 표준 헤더와 std 네임스페이스를 포함하세요.':'핵심 로직 발췌 · C++17 · 필요한 표준 헤더와 std 네임스페이스를 포함하고, 문제 입력에 맞는 변수·인접 리스트를 준비합니다.')+'</p><pre tabindex="0" aria-label="C++ 코드 · 좌우 스크롤 가능"><code translate="no">'+c.code.split('\n').map((l,k)=>'<span class="code-row"><span class="line-no" aria-hidden="true">'+(k+1)+'</span><span>'+esc(l)+'</span></span>').join('')+'</code></pre><div class="complexity"><b>복잡도</b>'+esc(c.complexity)+'</div></section><section id="check"><p class="eyebrow">CHOOSE & EXPLAIN</p><h2>조건으로 판단하기</h2>'+quizHTML(c.quiz,0)+'</section>'+exerciseHTML(c)+'<section class="workflow"><p class="eyebrow">다음 문제에 가져갈 질문</p><h2>나의 풀이 워크플로우</h2><ol>'+c.check.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></section></div><aside class="reading-rail"><span class="eyebrow">이 장에서</span><a href="'+window.StudyURL.section('concept')+'" data-section="concept">원리와 적용 조건</a><a href="'+window.StudyURL.section('example-visual')+'" data-section="example-visual">예제 따라가기</a>'+'<a href="'+window.StudyURL.section('code')+'" data-section="code">C++ 구현과 복잡도</a><a href="'+window.StudyURL.section('check')+'" data-section="check">반례와 판단 연습</a><div class="rail-note">다음 단계를 누르기 전에<br><b>어떤 값이 바뀔지</b><br>먼저 예상해 보세요.</div></aside></div><nav class="chapter-pagination">'+(i>0?'<a href="#'+CHAPTERS[i-1].id+'"><small>이전 장</small>'+esc(CHAPTERS[i-1].title)+'</a>':'<a href="#home"><small>목차</small>교과서 펼치기</a>')+'<a href="#'+(CHAPTERS[i+1]?.id||'practice')+'"><small>다음 장</small>'+esc(CHAPTERS[i+1]?.title||'혼합 문제와 풀이 복기')+'</a></nav></article>';
 $('#copy-code').addEventListener('click',async()=>{
  const button=$('#copy-code'),status=$('#copy-status');
  try{await navigator.clipboard.writeText(c.code);button.textContent='복사 완료';status.textContent='C++ 코드를 복사했습니다.';}
  catch{button.textContent='코드 선택';status.textContent='클립보드에 접근할 수 없습니다. 선택된 코드를 복사해 주세요.';const range=document.createRange();range.selectNodeContents($('#code pre code'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}
 });
 wireQuizzes([c.quiz]);
 window.ExampleVisuals.mount(c.id,$('#example-visual'));
}
function practice(){
 document.title='혼합 문제와 풀이 복기 · AlgoBook';$('#breadcrumb').textContent=pad(CHAPTERS.length+1)+' / 혼합 문제와 풀이 복기';
 main.innerHTML='<article class="lesson practice"><div class="lesson-heading"><p class="eyebrow">CHAPTER '+pad(CHAPTERS.length+1)+' / TRANSFER</p><h1 tabindex="-1">유형 이름 없이,<br>스스로 판단하기.</h1><p class="lead">정답을 고르기 전에, 선택을 결정한 조건을 한 문장으로 말해 보세요.</p></div>'+MIXED.map(quizHTML).join('')+'<section class="workflow"><p class="eyebrow">AFTER SOLVING</p><h2>풀이를 끝내고 남길 네 줄</h2><ol><li>처음 놓친 조건은 무엇이었나?</li><li>완전탐색의 어떤 반복을 줄였나?</li><li>정확성을 보장하는 불변식 또는 논증은 무엇인가?</li><li>조건 하나가 바뀌면 이 풀이가 언제 실패하나?</li></ol><p>문제마다 정답 코드만 모으기보다, 다음 문제에 적용할 질문 하나를 남겨 보세요.</p></section><a class="button primary" href="#home">전체 목차로</a></article>';
 wireQuizzes(MIXED);
}
function route({focus=false}={}){
 const id=location.hash.slice(1)||'home';
 setMenu(false,{returnFocus:false});
 $('#chapter-query').value=new URLSearchParams(location.search).get('q')||'';filterChapters();
 document.querySelectorAll('#chapters a').forEach(a=>{const on=new URL(a.href,location.href).hash==='#'+id;a.classList.toggle('selected',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(id==='home')home();else if(id==='practice')practice();else{const c=CHAPTERS.find(x=>x.id===id);if(c)lesson(c);else{main.innerHTML='<div class="lesson"><h1 tabindex="-1">해당 장을 찾을 수 없습니다.</h1><p>전체 목차에서 학습할 장을 다시 선택해 주세요.</p><a href="#home">전체 목차로</a></div>';}}
 const n=CHAPTERS.findIndex(c=>c.id===id);$('#page-position').textContent=n>=0?(n+1)+' / '+CHAPTERS.length:id==='practice'?'판단 연습':'목차';
 window.StudyPanels.restore(main);updateLinks();renderedURL=location.href;
 const section=new URLSearchParams(location.search).get('section');
 if(['concept','example-visual','code','check','exercise'].includes(section))requestAnimationFrame(()=>scrollToSection(section,{focus}));
 else{window.scrollTo({top:0,behavior:'instant'});if(focus)main.querySelector('h1')?.focus({preventScroll:true});}
}
$('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView({block:'start'});});
nav();route();setMenu(false,{returnFocus:false});
function restoreRoute(){if(location.href!==renderedURL)route({focus:true});}
window.addEventListener('hashchange',restoreRoute);window.addEventListener('popstate',restoreRoute);
window.addEventListener('studyurlchange',()=>{renderedURL=location.href;updateLinks();});
$('#chapter-query').addEventListener('input',()=>{filterChapters();window.StudyURL.write({q:$('#chapter-query').value.trim()});});
$('#clear-query').onclick=()=>{$('#chapter-query').value='';filterChapters();window.StudyURL.write({q:null});$('#chapter-query').focus();};
$('#menu').onclick=()=>setMenu(!document.body.classList.contains('menu-open'));
$('#menu-close').onclick=$('#menu-backdrop').onclick=()=>setMenu(false);
mobile.addEventListener('change',()=>setMenu(false));
document.addEventListener('click',e=>{
 const a=e.target.closest('a[data-chapter],a[data-section]');if(!a||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 e.preventDefault();
 if(a.dataset.section){window.StudyURL.write({section:a.dataset.section},{push:true});scrollToSection(a.dataset.section,{focus:true,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 else{const url=new URL(a.href,location.href);history.pushState(null,'',url);route({focus:true});}
});
document.addEventListener('keydown',e=>{
 if(!document.body.classList.contains('menu-open'))return;
 if(e.key==='Escape'){e.preventDefault();setMenu(false);return;}
 if(e.key!=='Tab')return;
 const items=[...sidebar.querySelectorAll('a,button,input')].filter(el=>!el.hidden&&!el.closest('[hidden]')&&!el.disabled&&el.tabIndex>=0);
 const first=items[0],last=items.at(-1);
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
})();
