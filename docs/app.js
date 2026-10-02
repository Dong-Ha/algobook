(() => {
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const main=$('#main');
let lab=null,timer=null;
const defaults={
 dfs:{n:7,start:1,edges:'1 2\n1 3\n2 4\n2 5\n3 6\n5 6\n6 7'},
 bfs:{n:7,start:1,edges:'1 2\n1 3\n2 4\n2 5\n3 6\n5 6\n6 7'},
 trie:{words:'cat, car, cart, dog, dot',query:'ca',mode:'insert'},
 sort:{array:'5, 2, 4, 2, 1'},
 prefix:{array:'3, -2, 5, 1, 4',l:1,r:4},
 twopointer:{array:'-4, -1, 2, 5, 8',target:7},
 binary:{array:'1, 3, 3, 7, 9',target:3},
 backtrack:{array:'1, 2, 3',target:3},
 dp:{array:'1, 3, 4',target:6}
};
const presets={
 dfs:[['사이클',defaults.dfs],['연결되지 않은 그래프',{n:7,start:1,edges:'1 2\n2 3\n3 1\n4 5\n5 6'}],['깊은 경로',{n:7,start:1,edges:'1 2\n2 3\n3 4\n4 5\n5 6\n6 7'}]],
 bfs:[['기본',defaults.bfs],['서로 다른 경로',{n:6,start:1,edges:'1 2\n2 3\n3 4\n1 5\n5 4\n4 6'}]],
 trie:[['삽입 과정',defaults.trie],['접두사 ≠ 단어',{words:'cat, car, dog',query:'ca',mode:'word'}],['접두사 검색',{words:'cat, car, dog',query:'ca',mode:'prefix'}],['없는 경로',{words:'cat, car, dog',query:'can',mode:'word'}]],
 twopointer:[['기본',defaults.twopointer],['정답 없음',{array:'1, 2, 4, 8',target:6+1}],['중복 값',{array:'1, 3, 3, 5',target:6}]],
 binary:[['중복 값',defaults.binary],['모두 작음',{array:'1, 3, 3, 7, 9',target:10}],['모두 큼',{array:'1, 3, 3, 7, 9',target:0}]],
 prefix:[['음수 포함',defaults.prefix],['빈 구간',{array:'3, -2, 5, 1',l:2,r:2}]],
 dp:[['그리디 반례',defaults.dp],['불가능한 금액',{array:'2, 4',target:7}],['목표 0',{array:'2, 3',target:0}]],
 sort:[['중복 값',defaults.sort],['역순',{array:'6, 5, 4, 3, 2, 1'}]],
 backtrack:[['기본',defaults.backtrack],['가지치기 반례',{array:'5, -2',target:3}],['빈 집합',{array:'1, 2',target:0}]]
};
function nav(){
 let html='<a class="nav-home" href="#home">교과서 펼치기</a>',part='';
 CHAPTERS.forEach((c,i)=>{
  if(c.part!==part){part=c.part;html+='<p class="nav-group">'+esc(part)+'</p>';}
  html+='<a class="nav-item" href="#'+c.id+'"><span>'+pad(i+1)+'</span><span>'+esc(c.title.split(':')[0])+'</span>'+(c.lab?'<i title="시각화 실험 포함">◈</i>':'')+'</a>';
 });
 html+='<p class="nav-group">07 · 스스로 판단하기</p><a class="nav-item" href="#practice"><span>16</span><span>혼합 문제와 풀이 복기</span></a>';
 $('#chapters').innerHTML=html;
}
function card(c,i){
 return '<a class="chapter-card" href="#'+c.id+'"><span class="chapter-no">'+pad(i+1)+'</span><div><h3>'+esc(c.title)+'</h3><p>'+esc(c.short)+'</p></div><span class="card-tag">'+(c.lab?'시각화':'개념·판단')+'</span></a>';
}
function home(){
 document.title='AlgoBook — 생각을 코드로';
 $('#breadcrumb').textContent='나의 알고리즘 교과서';
 let html='<div class="home"><section class="book-intro"><div><p class="eyebrow">INTERACTIVE C++ TEXTBOOK</p><h1>생각을 코드로.<br><span>과정을 눈으로.</span></h1><p class="intro-text">왜 이 알고리즘일까요?<br>입력을 바꾸고, 한 단계씩 따라가며<br>풀이를 선택하는 근거를 익힙니다.</p><div class="intro-actions"><a class="button primary" href="#thinking">첫 장 읽기</a><a class="button secondary" href="#dfs">DFS 실험 시작</a></div></div><div class="cover-diagram" aria-label="DFS 호출 스택과 탐색 경로 예"><div class="diagram-caption"><span>DEPTH FIRST SEARCH</span><span>01 / 07</span></div>'+miniGraph()+'<div class="mini-stack"><span>CALL STACK</span><b>1</b><b>2</b><b class="orange">4</b><small>다음 이웃이 없으면<br>이전 호출로 돌아갑니다.</small></div></div></section><div class="book-meta"><span><b>15</b> 핵심 챕터</span><span><b>9</b> 단계별 실험</span><span><b>21</b> 판단 문제</span><span>C++17 · 실버~골드 핵심</span></div>';
 html+='<section class="featured"><div class="section-head"><div><p class="eyebrow">SEE THE PROCESS</p><h2>지금, 움직여 보세요</h2></div><p>진입부터 복귀까지. 문자에서 단어까지.</p></div><div class="feature-grid"><a href="#dfs" class="feature-card"><span class="feature-num">08 / GRAPH</span><h3>DFS의 다음 한 걸음</h3><p>간선을 바꾸고 호출 스택을 따라가며<br>방문과 탐색 종료를 구분하세요.</p><span class="text-link">DFS 실험실 열기 ↗</span></a><a href="#trie" class="feature-card trie-feature"><span class="feature-num">14 / STRING</span><h3>Trie에 단어 심기</h3><p>공유되는 접두사를 관찰하고<br>단어 검색과 접두사 검색을 비교하세요.</p><span class="text-link">Trie 실험실 열기 ↗</span></a></div></section>';
 html+='<section><div class="section-head"><div><p class="eyebrow">CONTENTS</p><h2>문제 해석에서 최적해까지</h2></div><span class="muted">C++ 기초 문법을 아는 분을 위한 구성</span></div><div class="contents-grid">';
 let part='';
 CHAPTERS.forEach((c,i)=>{if(c.part!==part){if(part)html+='</div>';part=c.part;html+='<div class="chapter-group"><h3 class="group-title">'+esc(part)+'</h3>';}html+=card(c,i);});
 html+='</div><div class="chapter-group"><h3 class="group-title">07 · 스스로 판단하기</h3><a class="chapter-card" href="#practice"><span class="chapter-no">16</span><div><h3>혼합 문제와 풀이 복기</h3><p>유형 이름 없이 접근법 고르기</p></div><span class="card-tag">6문제</span></a></div></div></section>';
 html+='<section class="reading-guide"><p class="eyebrow">HOW TO STUDY</p><h2>한 장을 읽는 네 번의 질문</h2><div class="guide-grid"><div><b>01</b><h3>어떤 조건인가?</h3><p>제약과 필요한 출력을 먼저 적습니다.</p></div><div><b>02</b><h3>왜 움직이는가?</h3><p>다음 상태를 예상한 뒤 한 단계 실행합니다.</p></div><div><b>03</b><h3>언제 틀리는가?</h3><p>음수·중복·경계를 바꿔 반례를 찾습니다.</p></div><div><b>04</b><h3>무엇을 남길까?</h3><p>다음 문제에도 쓸 판단 기준을 정리합니다.</p></div></div></section></div>';
 main.innerHTML=html;
}
function miniGraph(){
 return '<svg viewBox="0 0 440 250" role="img" aria-label="정점 1에서 2를 거쳐 4까지 방문한 DFS"><g fill="none" stroke="#bac7d0" stroke-width="2" stroke-linecap="round"><line x1="220" y1="45" x2="110" y2="120"/><line x1="110" y1="120" x2="60" y2="210"/><line x1="110" y1="120" x2="165" y2="210"/><line x1="220" y1="45" x2="330" y2="120"/><line x1="330" y1="120" x2="350" y2="210"/></g><path d="M220 45L110 120L60 210" fill="none" stroke="#0f766e" stroke-width="4"/>'+[[220,45,'1'],[110,120,'2'],[330,120,'3'],[60,210,'4'],[165,210,'5'],[350,210,'6']].map(([x,y,t])=>'<circle cx="'+x+'" cy="'+y+'" r="22" fill="'+(t==='4'?'#c65d22':+t<3?'#112235':'#fff')+'" stroke="'+(+t<3?'#112235':'#bac7d0')+'"/><text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" fill="'+(+t<3||t==='4'?'#fff':'#425365')+'" font-size="16" font-family="monospace">'+t+'</text>').join('')+'</svg>';
}
function quizHTML(q,i){
 return '<div class="quiz" data-quiz="'+i+'"><p class="quiz-label">CHECK '+pad(i+1)+'</p><h3>'+esc(q.q)+'</h3><div class="quiz-options">'+q.options.map((o,j)=>'<button type="button" data-answer="'+j+'"><span>'+String.fromCharCode(65+j)+'</span>'+esc(o)+'</button>').join('')+'</div><div class="quiz-feedback" aria-live="polite"></div><button class="quiet explain-toggle" type="button">해설 보기</button></div>';
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
function lesson(c){
 const i=CHAPTERS.indexOf(c);document.title=c.title+' · AlgoBook';$('#breadcrumb').textContent=pad(i+1)+' / '+c.title;
 main.innerHTML='<article class="lesson"><div class="lesson-heading"><p class="eyebrow">CHAPTER '+pad(i+1)+' <span>/ '+esc(c.tag)+'</span></p><h1>'+esc(c.title)+'</h1><p class="lead">'+esc(c.lead)+'</p><div class="lesson-jumps"><button data-jump="concept">원리 읽기</button>'+(c.lab?'<button data-jump="lab">직접 실험</button>':'')+'<button data-jump="code">C++ 코드</button><button data-jump="check">판단 연습</button></div></div><section class="problem-box"><span class="eyebrow">먼저 생각해 볼 문제</span><h2>'+esc(c.problem)+'</h2><p class="example">'+esc(c.example)+'</p></section>'+(c.lab?'<section id="lab"></section>':'')+'<div class="reading-layout"><div class="prose"><section id="concept"><p class="eyebrow">UNDERSTAND THE IDEA</p>'+c.sections.map(([h,p],j)=>'<section class="explanation"><h2><span>'+pad(j+1)+'</span>'+esc(h)+'</h2><p>'+esc(p)+'</p></section>').join('')+'</section><aside class="invariant"><p class="eyebrow">변하지 않는 사실 · INVARIANT</p><p>'+esc(c.invariant)+'</p></aside><aside class="counterexample"><p class="eyebrow">조건을 바꿔 보면</p><p>'+esc(c.trap)+'</p></aside><section id="code" class="code-section"><div class="section-head"><h2>C++로 옮기기</h2><button class="quiet" id="copy-code">코드 복사</button></div><p class="code-hint">핵심 로직 발췌 · C++17 · 필요한 표준 헤더와 std 네임스페이스를 포함하고, 문제 입력에 맞는 변수·인접 리스트를 준비합니다.</p><pre><code>'+c.code.split('\n').map((l,k)=>'<span class="code-row"><span class="line-no">'+(k+1)+'</span><span>'+esc(l)+'</span></span>').join('')+'</code></pre><div class="complexity"><b>복잡도</b>'+esc(c.complexity)+'</div></section><section id="check"><p class="eyebrow">CHOOSE & EXPLAIN</p><h2>조건으로 판단하기</h2>'+quizHTML(c.quiz,0)+'</section><section class="workflow"><p class="eyebrow">다음 문제에 가져갈 질문</p><h2>나의 풀이 워크플로우</h2><ol>'+c.check.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></section></div><aside class="reading-rail"><span class="eyebrow">이 장에서</span><button data-jump="concept">원리와 적용 조건</button>'+(c.lab?'<button data-jump="lab">입력 바꾸고 실험</button>':'')+'<button data-jump="code">C++ 구현과 복잡도</button><button data-jump="check">반례와 판단 연습</button><div class="rail-note">다음 단계를 누르기 전에<br><b>어떤 값이 바뀔지</b><br>먼저 예상해 보세요.</div></aside></div><nav class="chapter-pagination">'+(i>0?'<a href="#'+CHAPTERS[i-1].id+'"><small>이전 장</small>'+esc(CHAPTERS[i-1].title)+'</a>':'<a href="#home"><small>목차</small>교과서 펼치기</a>')+'<a href="#'+(CHAPTERS[i+1]?.id||'practice')+'"><small>다음 장</small>'+esc(CHAPTERS[i+1]?.title||'혼합 문제와 풀이 복기')+'</a></nav></article>';
 document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})));
 $('#copy-code').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(c.code);$('#copy-code').textContent='복사했습니다';}catch{$('#copy-code').textContent='코드를 선택해 복사해 주세요';}});
 wireQuizzes([c.quiz]);
 if(c.lab)mountLab(c.lab,defaults[c.lab]);
}
function practice(){
 document.title='혼합 문제와 풀이 복기 · AlgoBook';$('#breadcrumb').textContent='16 / 혼합 문제와 풀이 복기';
 main.innerHTML='<article class="lesson practice"><div class="lesson-heading"><p class="eyebrow">CHAPTER 16 / TRANSFER</p><h1>유형 이름 없이,<br>스스로 판단하기.</h1><p class="lead">정답을 고르기 전에, 선택을 결정한 조건을 한 문장으로 말해 보세요.</p></div>'+MIXED.map(quizHTML).join('')+'<section class="workflow"><p class="eyebrow">AFTER SOLVING</p><h2>풀이를 끝내고 남길 네 줄</h2><ol><li>처음 놓친 조건은 무엇이었나?</li><li>완전탐색의 어떤 반복을 줄였나?</li><li>정확성을 보장하는 불변식 또는 논증은 무엇인가?</li><li>조건 하나가 바뀌면 이 풀이가 언제 실패하나?</li></ol><p>문제마다 정답 코드만 모으기보다, 다음 문제에 적용할 질문 하나를 남겨 보세요.</p></section><a class="button primary" href="#home">전체 목차로</a></article>';
 wireQuizzes(MIXED);
}
function field(label,name,value,type='text',extra=''){
 return '<label class="field"><span>'+label+'</span><input name="'+name+'" value="'+esc(value)+'" type="'+type+'" '+extra+'></label>';
}
function mountLab(kind,values){
 let fields='';
 if(kind==='dfs'||kind==='bfs'){
  fields='<div class="short-fields">'+field('정점 수 · 2~10','n',values.n,'number','min="2" max="10"')+field('시작 정점','start',values.start,'number','min="1" max="10"')+'</div><label class="field"><span>무방향 간선 · 한 줄에 두 정점</span><textarea name="edges" rows="4" spellcheck="false">'+esc(values.edges)+'</textarea></label>';
 }else if(kind==='trie'){
  fields=field('삽입할 단어 · a~z, 쉼표 구분','words',values.words)+field('검색할 문자열','query',values.query)+'<label class="field"><span>실험 종류</span><select name="mode"><option value="insert">단어 삽입 과정</option><option value="word">완전 일치 검색</option><option value="prefix">접두사 검색</option></select></label>';
 }else{
  fields=field(kind==='dp'?'동전 종류 · 양의 정수':kind==='backtrack'?'원소 · 최대 6개':'배열 · 최대 14개','array',values.array);
  if(kind==='prefix')fields+='<div class="short-fields">'+field('l · 포함','l',values.l,'number','min="0"')+field('r · 제외','r',values.r,'number','min="0"')+'</div>';
  if(['twopointer','binary','backtrack','dp'].includes(kind))fields+=field(kind==='dp'?'목표 금액 · 0~24':'목표값 K','target',values.target,'number');
 }
 $('#lab').innerHTML='<div class="lab-title"><div><p class="eyebrow">INTERACTIVE LAB</p><h2>한 단계씩, 직접 확인하기</h2></div><span class="lab-badge">입력 변경 가능</span></div><div class="lab-frame"><details class="lab-settings" open><summary>입력과 예제</summary><form id="lab-form"><div class="lab-fields">'+fields+'</div><div class="form-bottom"><div class="presets">'+(presets[kind]||[]).map(([label],i)=>'<button type="button" data-preset="'+i+'">'+label+'</button>').join('')+'</div><button class="button primary" type="submit">입력 적용</button></div><p class="form-error" id="lab-error" role="alert"></p></form></details><div class="lab-visual"><div class="scene" id="scene"></div><aside class="state-panel" id="state-panel"></aside></div><div class="trace-note" aria-live="polite" aria-atomic="true"><span class="step-marker" id="step-marker"></span><p id="trace-note"></p></div><div class="playback"><div class="transport"><button id="reset" aria-label="처음으로">처음</button><button id="prev" aria-label="이전 단계">이전</button><button id="play" class="play-button">자동 재생</button><button id="next" class="next-button">다음 단계</button></div><label class="speed">속도 <select id="speed"><option value="1500">느리게</option><option value="850" selected>보통</option><option value="350">빠르게</option></select></label><label class="seek-label"><span class="sr-only">실행 단계</span><input id="seek" type="range" min="0" value="0" aria-label="실행 단계"></label><span id="step-count" class="step-count"></span></div></div><p class="lab-caption">'+(kind==='dfs'||kind==='bfs'?'● 주황: 현재 정점 · 짙은색: 스택/큐 · 청록: 탐색 종료 · 선 강조: 현재 확인하는 간선':kind==='trie'?'★ 단어 종료 · 주황: 현재 접두사 · 청록 경로: 이번 작업에서 따라간 문자':'주황: 현재 비교·처리 중 · 청록: 확정·선택한 값 · 흐린 값: 제외된 후보')+'</p>';
 const form=$('#lab-form');
 if(kind==='trie')form.elements.mode.value=values.mode;
 form.addEventListener('submit',e=>{e.preventDefault();applyInput(kind,Object.fromEntries(new FormData(form)));});
 form.addEventListener('input',()=>{pause();$('#lab-error').textContent='입력을 수정했습니다. ‘입력 적용’을 누르면 새 실험이 시작됩니다.';});
 document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{
  const vals=presets[kind][+b.dataset.preset][1];for(const [key,value]of Object.entries(vals))if(form.elements[key])form.elements[key].value=value;
  applyInput(kind,vals);
 }));
 $('#reset').onclick=()=>{pause();lab.index=0;draw();};
 $('#prev').onclick=()=>{pause();lab.index=Math.max(0,lab.index-1);draw();};
 $('#next').onclick=()=>{pause();lab.index=Math.min(lab.frames.length-1,lab.index+1);draw();};
 $('#seek').oninput=e=>{pause();lab.index=+e.target.value;draw();};
 $('#play').onclick=()=>timer?pause():play();
 $('#speed').onchange=()=>{if(timer){pause();play();}};
 applyInput(kind,values);
}
function applyInput(kind,input){
 try{
  const frames=AlgoEngine.trace(kind,input);pause();lab={kind,input,frames,index:0};$('#lab-error').textContent='';$('#seek').max=frames.length-1;draw();return {kind,steps:frames.length};
 }catch(e){$('#lab-error').textContent=e.message;return {error:e.message};}
}
function pause(){if(timer){clearInterval(timer);timer=null;}if($('#play'))$('#play').textContent='자동 재생';}
function play(){
 if(!lab)return;
 if(lab.index===lab.frames.length-1)lab.index=0;
 $('#play').textContent='일시 정지';draw();
 timer=setInterval(()=>{lab.index++;draw();if(lab.index>=lab.frames.length-1)pause();},+$('#speed').value);
}
function cells(values,active=[],discard=[],prefix='a',extraClass=()=>'',labels={}){
 return '<div class="array-scroll"><div class="array-row">'+values.map((v,i)=>'<div class="array-cell '+(active.includes(i)?'active ':'')+(discard.includes(i)?'discard ':'')+extraClass(i)+'"><span class="cell-label">'+esc(labels[i]||'')+'</span><b>'+esc(v===null?(prefix==='p'?'·':'∞'):v)+'</b><small>'+prefix+'['+i+']</small></div>').join('')+'</div></div>';
}
function stat(label,value){return '<div class="stat"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>';}
function tokens(label,values){return '<div class="state-block"><span>'+esc(label)+'</span><div class="tokens">'+(values.length?values.map(v=>'<b>'+esc(typeof v==='object'?'('+v.i+','+v.sum+')':v)+'</b>').join(''):'<small>비어 있음</small>')+'</div></div>';}
function graphSVG(s){
 const coords={};for(let i=1;i<=s.n;i++){const t=-Math.PI/2+2*Math.PI*(i-1)/s.n;coords[i]=[270+185*Math.cos(t),195+150*Math.sin(t)];}
 const edgekey=e=>[...e].sort((a,b)=>a-b).join('-');
 let svg='<svg viewBox="0 0 540 390" role="img" aria-label="'+(s.kind==='dfs'?'DFS':'BFS')+' 그래프. 현재 정점 '+(s.current??'없음')+'">';
 for(const e of s.edges){
  const [x1,y1]=coords[e[0]],[x2,y2]=coords[e[1]],on=s.edge&&edgekey(e)===edgekey(s.edge),tree=s.tree.some(t=>edgekey(t)===edgekey(e));
  if(e[0]===e[1])svg+='<circle cx="'+x1+'" cy="'+(y1-28)+'" r="24" fill="none" stroke="'+(on?'#c65d22':'#c1cbd4')+'" stroke-width="2"/>';
  else svg+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(on?'#c65d22':tree?'#0f766e':'#c7d1db')+'" stroke-width="'+(on?4:tree?3:1.5)+'"/>';
 }
 for(let v=1;v<=s.n;v++){
  const [x,y]=coords[v],current=s.current===v,infront=s.stack.includes(v)||s.queue.includes(v),done=s.done.includes(v);
  const fill=current?'#c65d22':infront?'#112235':done?'#0f766e':'#fff';
  svg+='<g><circle cx="'+x+'" cy="'+y+'" r="24" fill="'+fill+'" stroke="'+(s.visited.includes(v)?fill:'#aab9c6')+'" stroke-width="2"/><text x="'+x+'" y="'+(y+6)+'" fill="'+(s.visited.includes(v)?'#fff':'#36485b')+'" text-anchor="middle" font-size="18" font-weight="600">'+v+'</text>';
  if(s.kind==='bfs')svg+='<text x="'+x+'" y="'+(y+43)+'" text-anchor="middle" fill="#596b7a" font-size="13">d='+ (s.dist[v]===null?'∞':s.dist[v])+'</text>';
  svg+='</g>';
 }
 return svg+'</svg>';
}
function trieSVG(s){
 const children=s.nodes.map(()=>[]);
 s.nodes.forEach(n=>{if(n.parent!==null)children[n.parent].push(n.id);});
 children.forEach(a=>a.sort((x,y)=>s.nodes[x].ch.localeCompare(s.nodes[y].ch)));
 const pos={},leaf={count:0};
 function layout(id,depth){const cs=children[id];let x;if(!cs.length)x=55+leaf.count++*88;else{cs.forEach(c=>layout(c,depth+1));x=(pos[cs[0]][0]+pos[cs[cs.length-1]][0])/2;}pos[id]=[x,40+depth*78];}
 layout(0,0);const w=Math.max(240,leaf.count*88+22),h=80+Math.max(...s.nodes.map(n=>n.prefix.length))*78;
 let svg='<svg viewBox="0 0 '+w+' '+h+'" style="min-width:'+Math.min(w,760)+'px;min-height:'+Math.min(h,520)+'px" role="img" aria-label="Trie，当前接두사 '+esc(s.nodes[s.current]?.prefix||'루트')+'">';
 s.nodes.forEach(n=>{if(n.parent!==null){const [x,y]=pos[n.id],[px,py]=pos[n.parent],on=s.path.includes(n.id);svg+='<line x1="'+px+'" y1="'+py+'" x2="'+x+'" y2="'+y+'" stroke="'+(on?'#0f766e':'#c2cdd7')+'" stroke-width="'+(on?3:1.5)+'"/><text x="'+((x+px)/2+10)+'" y="'+((y+py)/2)+'" fill="#596b7a" font-size="13">'+n.ch+'</text>';}});
 s.nodes.forEach(n=>{const [x,y]=pos[n.id],cur=n.id===s.current,on=s.path.includes(n.id),fill=cur?'#c65d22':on?'#0f766e':'#fff';svg+='<g><circle cx="'+x+'" cy="'+y+'" r="22" fill="'+fill+'" stroke="'+(cur||on?fill:'#aab9c6')+'" stroke-width="2"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="'+(n.id===0?11:16)+'" fill="'+(cur||on?'#fff':'#112235')+'">'+(n.id===0?'root':n.ch)+'</text>'+(n.end?'<text x="'+(x+19)+'" y="'+(y-18)+'" font-size="18" fill="#0f766e">★</text>':'')+'</g>';});
 return '<div class="trie-scroll">'+svg+'</svg></div>';
}
function draw(){
 if(!lab||!$('#scene'))return;
 const s=lab.frames[lab.index];let html='',stats='';
 if(s.kind==='dfs'||s.kind==='bfs'){
  html=graphSVG(s);stats=stat('현재 정점',s.current??'—')+tokens(s.kind==='dfs'?'호출 스택 · 오른쪽이 top':'대기 큐 · 왼쪽이 front',s.kind==='dfs'?s.stack:s.queue)+tokens(s.kind==='dfs'?'방문 순서':'처리 순서',s.order)+tokens('탐색 종료',s.done);
  if(s.kind==='bfs')stats+='<p class="state-tip">각 정점의 d는 시작점부터의 최단 이동 횟수입니다. ∞는 미발견입니다.</p>';
  else stats+='<p class="state-tip">진입하면 push, 모든 이웃을 확인하면 return하며 pop합니다.</p>';
 }else if(s.kind==='trie'){
  html=trieSVG(s);stats=stat('현재 접두사',s.nodes[s.current]?.prefix||'빈 접두사')+stat('현재 작업',s.word||'준비')+stat('단어 종료 ★',s.nodes[s.current]?.end?'있음':'없음')+stat('노드 수',s.nodes.length);
  if(s.result!==undefined)stats+=stat('검색 결과',s.result?'참':'거짓');
 }else{
  const labels={};
  if(s.kind==='twopointer'){labels[s.l]='L';labels[s.r]=labels[s.r]?'L · R':'R';}
  if(s.kind==='binary'){labels[s.l]='L';if(s.r<s.a.length)labels[s.r]='R · 제외';if(s.m!==undefined)labels[s.m]=(labels[s.m]?labels[s.m]+' · ':'')+'MID';}
  html='<div class="array-stage"><p class="scene-label">'+(s.kind==='dp'?'동전 종류':s.kind==='binary'||s.kind==='twopointer'?'정렬한 배열':'입력 배열')+'</p>'+cells(s.a,s.active,s.discard,'a',i=>s.chosen?.includes(i)?'chosen':s.kind==='sort'&&i<s.sorted?'sorted':'',labels);
  if(s.kind==='prefix'){html+='<p class="scene-label">누적합 p · p[i] = 앞의 i개 원소의 합</p>'+cells(s.p,s.result!==undefined?[s.l,s.r]:s.active.map(i=>i+1),[],'p');stats=stat('질의 구간','['+s.l+', '+s.r+')')+stat('구간 합',s.result??'계산 중');}
  if(s.kind==='twopointer')stats=stat('목표 K',s.target)+stat('현재 합',s.sum??'—')+stat('왼쪽 / 오른쪽',(s.l??0)+' / '+(s.r??0))+(s.result!==undefined?stat('결과',s.result===false?'쌍 없음':s.result.join(' + ')):'');
  if(s.kind==='binary')stats=stat('목표 K',s.target)+stat('미확정 구간','['+s.l+', '+s.r+')')+stat('mid',s.m??'—')+(s.result!==undefined?stat('반환 인덱스',s.result):'');
  if(s.kind==='sort')stats=stat('정렬된 앞부분',s.sorted+'개')+'<p class="state-tip">이 실험은 삽입 정렬입니다. 왼쪽 정렬 구간에 원소 하나씩 넣습니다.</p>';
  if(s.kind==='dp'){html+='<p class="scene-label">dp[x] · 금액 x를 만드는 최소 동전 개수</p>'+cells(s.dp,[s.x,s.from].filter(x=>x>=0),[],'dp',i=>i<s.x?'sorted':'');stats=stat('목표 금액',s.target)+stat('현재 금액 x',s.x)+stat('마지막 동전 후보',s.coin??'—')+(s.result!==undefined?stat('최소 개수',s.result===-1?'불가능':s.result):'');}
  if(s.kind==='backtrack'){html+='<div class="branch-strip"><span>선택하지 않기</span><span>↔</span><span>선택하기</span></div><p class="scene-label">발견한 부분집합</p><div class="solutions">'+(s.answers.length?s.answers.map(x=>'<span>{ '+esc(x.join(', '))+' }</span>').join(''):'아직 없습니다.')+'</div>';stats=stat('목표 합',s.target)+stat('현재 합',s.sum)+tokens('호출 스택 (i, sum)',s.stack)+tokens('고른 원소',s.chosen.map(i=>s.a[i]));}
  html+='</div>';
 }
 $('#scene').innerHTML=html;$('#state-panel').innerHTML=stats;
 $('#trace-note').textContent=s.note;$('#step-marker').textContent=pad(lab.index);
 $('#step-count').textContent=lab.index+' / '+(lab.frames.length-1);$('#seek').value=lab.index;
 $('#prev').disabled=lab.index===0;$('#reset').disabled=lab.index===0;$('#next').disabled=lab.index===lab.frames.length-1;
}
function route(){
 pause();lab=null;
 const id=location.hash.slice(1)||'home';
 document.querySelectorAll('#chapters a').forEach(a=>{const on=a.getAttribute('href')==='#'+id;a.classList.toggle('selected',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.body.classList.remove('menu-open');$('#menu').setAttribute('aria-expanded','false');
 if(id==='home')home();else if(id==='practice')practice();else{const c=CHAPTERS.find(x=>x.id===id);if(c)lesson(c);else{main.innerHTML='<div class="lesson"><h1>해당 장을 찾을 수 없습니다.</h1><a href="#home">전체 목차로</a></div>';}}
 window.scrollTo(0,0);
}
nav();route();window.addEventListener('hashchange',route);
$('#menu').onclick=()=>{const open=document.body.classList.toggle('menu-open');$('#menu').setAttribute('aria-expanded',String(open));};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('menu-open');$('#menu').setAttribute('aria-expanded','false');}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
const mc=document.modelContext;
if(mc?.registerTool){
 const specs=[
  {name:'read_algorithm_state',title:'알고리즘 실행 상태 읽기',description:'현재 장과 시각화의 현재 단계를 읽습니다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({chapter:location.hash.slice(1)||'home',step:lab?.index,state:lab?lab.frames[lab.index]:null})},
  {name:'configure_algorithm_lab',title:'실험 입력 적용',description:'현재 장의 시각화에 입력을 적용하고 첫 단계로 초기화합니다. 해당 장을 먼저 여세요.',inputSchema:{type:'object',properties:{input:{type:'object'}},required:['input'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({input})=>{if(!lab)throw Error('시각화 실험이 있는 장을 먼저 여세요.');if(!input||typeof input!=='object')throw Error('입력 객체가 필요합니다.');const kind=lab.kind;const merged={...lab.input,...input};const result=applyInput(kind,merged);if(result.error)throw Error(result.error);for(const [k,v]of Object.entries(merged)){const el=$('#lab-form').elements[k];if(el)el.value=v;}return result;}},
  {name:'set_algorithm_step',title:'실행 단계 이동',description:'현재 실험에서 지정한 단계로 이동합니다.',inputSchema:{type:'object',properties:{step:{type:'integer',minimum:0}},required:['step'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({step})=>{if(!lab||!Number.isInteger(step)||step<0||step>=lab.frames.length)throw Error('유효한 실행 단계가 필요합니다.');pause();lab.index=step;draw();return {step,state:lab.frames[step]};}}
 ];
 for(const tool of specs)try{Promise.resolve(mc.registerTool(tool)).catch(()=>{});}catch{}
}
})();

