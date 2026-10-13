(() => {
'use strict';
const M=window.LabModels,C=window.WorkedExamples.catalogue;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const has=(a,p)=>a.some(x=>x[0]===p[0]&&x[1]===p[1]);
function svg(id,title,desc,body,w=640,h=200){return '<div class="scroller" role="region" tabindex="0" aria-label="'+esc(title)+' · 가로 스크롤 가능"><svg style="--canvas:'+w+'px" viewBox="0 0 '+w+' '+h+'" role="img" aria-labelledby="'+id+'-title '+id+'-desc"><title id="'+id+'-title">'+esc(title)+'</title><desc id="'+id+'-desc">'+esc(desc)+'</desc>'+body+'</svg></div>';}
function text(x,y,s,cls=''){return '<text x="'+x+'" y="'+y+'" class="'+cls+'">'+esc(s)+'</text>';}
function rect(x,y,w,h,cls='cell'){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" class="'+cls+'"/>';}
function cells(a,{active=-1,selected=[],labels=[],id='cells',title='배열',desc='값과 인덱스'}={}){const w=Math.max(360,80+a.length*80);let b='';if(!a.length)b=text(40,76,'비어 있음');a.forEach((v,i)=>{let x=40+i*80;b+=rect(x,40,72,56,i===active?'active':selected.includes(i)?'selected':'cell')+text(x+4,75,v,'value')+text(x,124,labels[i]??('i='+i),'caption');});return svg(id,title,desc,b,w,156);}
function binaryView(d,f){
 const width=560,span=f.max-f.min||1,x=v=>40+(v-f.min)/span*width;
 let b=text(40,28,'후보 범위 · 양 끝 포함 [lo, hi]');
 b+='<rect x="40" y="56" width="560" height="24" fill="#e3e9ee" rx="4"/>';
 b+='<rect x="'+x(f.lo)+'" y="56" width="'+Math.max(3,x(f.hi)-x(f.lo))+'" height="24" fill="#0f766e" rx="2"/>';
 b+='<line x1="'+x(f.mid)+'" x2="'+x(f.mid)+'" y1="44" y2="96" stroke="#a74414" stroke-width="3"/>';
 b+=text(40,116,'전체 하한 '+f.min,'caption')+'<text x="600" y="116" text-anchor="end" class="caption">전체 상한 '+f.max+'</text>';
 b+=text(40,148,'lo = '+f.lo+'     mid = '+f.mid+'     hi = '+f.hi,'value');
 let html='<h3>01 · 답 후보와 검사할 용량</h3>'+svg('capacity-range','용량 후보 구간','현재 답 후보 '+f.lo+'부터 '+f.hi+', 검사 용량 '+f.mid,b,640,176)+'<p class="legend"><b>초록 막대</b> 답 후보 · <b>세로선</b> 검사할 mid · 회색은 이미 제외한 범위</p><h3>02 · C = '+f.mid+'로 작업을 나누면</h3>';
 html+=f.groups.map((g,i)=>'<div class="pack"><strong>'+(i+1)+'일차</strong>'+g.map(v=>'<span class="token">'+v+'</span>').join('')+'<span>합 '+g.reduce((s,x)=>s+x,0)+' / 용량 '+f.mid+'</span></div>').join('');
 html+='<p class="outcome">'+(f.done?'정답 '+f.mid+' · ':'')+'필요 '+f.days+'일 '+(f.ok?'≤':' >')+' 허용 '+d.days+'일 → '+(f.ok?'가능':'불가능')+'</p>';
 html+=f.done?'<p class="note">lo = hi에서 종료합니다. 최소 가능한 용량을 반환합니다.</p>':'<details class="question"><summary>다음 범위를 먼저 예상한 뒤 확인하기</summary><p>'+(f.ok?'가능한 mid는 답일 수 있어 남깁니다. hi = mid.':'mid 이하도 불가능합니다. lo = mid + 1.')+' 다음 후보는 ['+f.nextLo+', '+f.nextHi+']입니다.</p></details>';
 return html;
}
function gridView(d,f){
 const n=d.g.length,m=d.g[0].length,w=Math.max(360,80+m*72),h=72+n*72;let b='';
 for(let c=0;c<m;c++)b+=text(62+c*72,28,'c='+c,'caption');
 for(let r=0;r<n;r++){b+=text(8,74+r*72,'r='+r,'caption');for(let c=0;c<m;c++){const x=40+c*72,y=40+r*72,p=[r,c],wall=d.g[r][c]==='0',current=f.current&&has([f.current],p),onPath=has(f.path,p),queued=has(f.queue,p),start=r===0&&c===0,target=r===n-1&&c===m-1;let role=wall?'벽':current?'현재':onPath?'경로':queued?'대기':f.dist[r][c]>=0?'방문':'미방문';b+=rect(x,y,64,64,wall?'wall':current?'active':onPath?'selected':'cell');b+=text(x+10,y+26,wall?'#':f.dist[r][c]===-1?'·':f.dist[r][c],'value'+(wall?' wall-text':''));b+=text(x+7,y+50,start&&target?'S/T':start?'S · '+role:target?'T · '+role:role,'caption'+(wall?' wall-text':''));}}
 let html='<h3>01 · 격자와 최소 거리</h3>'+svg('bfs-grid','격자 BFS 상태',f.note,b,w,h)+'<p class="legend"><b>숫자</b> 시작부터 이동 수 · <b>#</b> 벽 · <b>·</b> 미발견 · 현재/대기/경로를 글자로 구분</p><h3>02 · 큐 앞에서 꺼내고 뒤에 넣기</h3><div class="state-line"><b>앞</b>'+f.queue.map(p=>'<span class="token">('+p.join(',')+')</span>').join('')+(f.queue.length?'':'<span>비어 있음</span>')+'<b>뒤</b></div>';
 if(f.edge){const [a,z]=f.edge;html+='<p class="note">새 부모 연결: parent['+z.join('][')+'] = ('+a.join(',')+'). 거리 '+f.dist[a[0]][a[1]]+' + 1 = '+f.dist[z[0]][z[1]]+'.</p>';}
 if(f.path.length)html+='<h3>03 · parent를 역추적해 복원한 경로</h3><div class="subsequence">'+f.path.map((p,i)=>'<span>'+(i?'→ ':'')+'('+p.join(',')+')</span>').join('')+'</div><p class="outcome">최소 이동 '+d.result+'회 · 경로의 칸 수 '+f.path.length+'개</p>';
 if(f===d.frames.at(-1)&&d.result<0)html+='<p class="outcome">도달 불가 · 결과 −1</p>';
 return html;
}
function lisView(d,f){
 const processed=Math.min(f.i+1,d.a.length),chain=f.chain;
 let html='<h3>01 · 원본 순서를 유지하는 입력</h3>'+cells(d.a,{id:'lis-input',title:'원본 배열',active:f.i,selected:f.done?chain:[],desc:f.note})+'<h3>02 · 길이별 최소 끝값 후보</h3>'+cells(f.tails,{id:'lis-tails',title:'길이별 최소 끝값',active:f.pos,labels:f.tails.map((_,i)=>'길이 '+(i+1)),desc:'tails는 실제 부분수열이 아닐 수 있습니다.'});
 html+='<p class="note">tailIndex = ['+f.tailIndex.join(', ')+'] · 각 꼬리 값이 나온 원본 위치입니다.</p><div class="table-wrap"><table><caption>처리 당시 기록한 parent</caption><thead><tr><th>원본 i</th><th>a[i]</th><th>parent[i]</th></tr></thead><tbody>'+d.a.slice(0,processed).map((a,i)=>'<tr><td>'+i+'</td><td>'+a+'</td><td>'+f.parent[i]+(f.parent[i]<0?' · 시작':' · 값 '+d.a[f.parent[i]])+'</td></tr>').join('')+'</tbody></table></div><h3>03 · 현재까지 복원 가능한 실제 수열</h3>';
 const w=Math.max(360,80+chain.length*104);let b='';
 chain.forEach((i,j)=>{const x=40+j*104;if(j<chain.length-1)b+='<path class="arrow" d="M '+(x+80)+' 68 H '+(x+104)+'"/><path class="arrow" d="M '+(x+96)+' 64 L '+(x+104)+' 68 L '+(x+96)+' 72"/>';});
 chain.forEach((i,j)=>{const x=40+j*104;b+=rect(x,40,80,56,'selected')+text(x+8,74,d.a[i],'value')+text(x,124,'원본 i='+i,'caption');});if(!chain.length)b=text(40,76,'아직 비어 있음');
 html+=svg('lis-chain','부모로 복원한 실제 부분수열','원본 인덱스 '+chain.join(', ')+', 값 '+chain.map(i=>d.a[i]).join(', '),b,w,156)+'<p class="legend">연결선은 복원한 수열 순서입니다. 원본 인덱스와 값이 모두 증가해야 합니다.</p>';
 if(f.done){const ordered=f.tailIndex.every((v,i)=>!i||f.tailIndex[i-1]<v);html+='<p class="outcome">엄격 증가 LIS 길이 '+chain.length+' · ['+chain.map(i=>d.a[i]).join(', ')+']</p><p class="note">'+(ordered?'이번 입력은 tails의 원본 위치도 순서대로입니다. 항상 그런 것은 아니므로 ‘tails 반례’를 눌러 비교하세요.':'tails의 원본 인덱스 ['+f.tailIndex.join(', ')+']는 증가하지 않습니다. 각 길이의 끝값은 별개의 후보이며, 이 위치들을 그대로 이어 붙일 수 없습니다.')+'</p>';}
 return html;
}

const capacityCode="<details class=\"code\"><summary>C++17 · 판정 함수에서 정답까지</summary><pre><code>bool feasible(const vector&lt;long long&gt;&amp; a, int days, long long cap) {\n    int used = 1;\n    long long load = 0;\n    for (long long x : a) {\n        if (x &gt; cap) return false; // 하나의 작업도 쪼갤 수 없음\n        if (load &gt; cap - x) { ++used; load = 0; }\n        load += x;\n    }\n    return used &lt;= days;\n}\nlong long minimumCapacity(const vector&lt;long long&gt;&amp; a, int days) {\n    // a는 비어 있지 않은 양수 배열, days &gt;= 1, sum(a)는 long long 범위\n    long long lo = *max_element(a.begin(), a.end());\n    long long hi = accumulate(a.begin(), a.end(), 0LL);\n    while (lo &lt; hi) {\n        long long mid = lo + (hi - lo) / 2;\n        if (feasible(a, days, mid)) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}</code></pre><p class=\"note\">필요 헤더: vector, algorithm, numeric · std 이름 공간 사용. 시간 O(N log R), 공간 O(1), R = sum(a) − max(a) + 1.</p></details>";

function add(chapter,key,label,title,description,kind,data){
 const view={binary:binaryView,grid:gridView,lis:lisView}[kind];
 C[chapter].push({key,label,title,description,detail:kind==='binary'?capacityCode:'',steps:data.frames.map((f,i)=>({
  title:kind==='binary'?(f.done?'최소 용량 확정':'용량 '+f.mid+'의 가능 여부 판정'):'상태 '+(i+1),
  note:kind==='binary'?(f.done?'lo = hi = '+f.mid+'에서 종료합니다.':'용량 '+f.mid+': '+f.days+'일 필요 → '+(f.ok?'가능. hi = mid로 답 후보를 남깁니다.':'불가능. lo = mid + 1로 제외합니다.')):f.note,
  html:'<div class="worked-detail">'+view(data,f)+'</div>'
 }))});
}
add('binary','capacity','최소 용량','가능한 최소 용량 찾기','작업량 [7, 2, 5, 10, 8] · D = 2 · 작업 순서 유지, 분할 불가','binary',M.capacity([7,2,5,10,8],2));
add('binary','one-day','하루에 모두','하루에 모두 처리하는 경계','같은 작업량 · D = 1 → 전체 합이 최소 용량','binary',M.capacity([7,2,5,10,8],1));
add('grid-search','detour','벽 우회와 경로','큐·거리·부모를 함께 따라가기','격자 1110 / 0101 / 1111 · 상하좌우 비용 1 · 이웃 순서: 위, 오른쪽, 아래, 왼쪽','grid',M.bfs(['1110','0101','1111']));
add('grid-search','blocked','도달 불가','큐가 비어도 목적지에 못 갈 수 있다','격자 110 / 000 / 011 · T의 거리는 끝까지 −1','grid',M.bfs(['110','000','011']));
add('grid-search','same','출발 = 도착','한 칸 격자의 이동 횟수','격자 1 · 출발 칸을 이동 횟수에 포함하지 않는다','grid',M.bfs(['1']));
add('lis','reconstruct','tails 반례·복원','tails와 실제 LIS는 다르다','배열 [3, 5, 6, 2, 4] · 엄격 증가 · 원본 인덱스도 증가해야 한다','lis',M.lis([3,5,6,2,4]));
add('lis','duplicates','같은 값','중복 값으로 길이를 늘리지 않기','배열 [2, 2, 2] · lower_bound로 같은 끝값을 교체','lis',M.lis([2,2,2]));
})();
