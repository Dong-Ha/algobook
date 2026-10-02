(() => {
'use strict';
const visuals=window.EXAMPLE_VISUALS=window.EXAMPLE_VISUALS||{};
const row=(label,values,active=[],selected=[])=>({label,values,active,selected});
const step=(title,note,rows,result)=>({title,note,rows,result});
Object.assign(visuals,{
 thinking:{title:'조회한 뒤 삽입하기 · K=10',steps:[
 step('4 처리','짝 6이 없으므로 4를 저장합니다.',[row('입력',[4,1,7,3],[0]),row('이전 위치의 값',[4])]),
 step('1 처리','짝 9가 없으므로 1을 저장합니다.',[row('입력',[4,1,7,3],[1]),row('이전 위치의 값',[4,1])]),
 step('7 처리','짝 3은 아직 집합에 없습니다. 7을 저장합니다.',[row('입력',[4,1,7,3],[2]),row('이전 위치의 값',[4,1,7])]),
 step('3 처리','짝 7이 이전 위치에 있으므로 종료합니다. 현재 3을 먼저 삽입하지 않습니다.',[row('입력',[4,1,7,3],[3],[2]),row('이전 위치의 값',[4,1,7],[],[2])],'7 + 3 = 10 → 존재')]},
 stl:{title:'가장 큰 2개를 유지하는 최소 힙',steps:[
 step('4 삽입','후보가 2개 이하여서 모두 유지합니다.',[row('유지 후보 · 정렬해서 표시',[4])]),
 step('1 삽입','최소 힙의 top은 1입니다.',[row('유지 후보 · 정렬해서 표시',[1,4],[0])]),
 step('7 삽입 후 1 제거','3개가 되어 최솟값 1을 제거합니다. 도식의 정렬 순서는 실제 힙 내부 배열과 다를 수 있습니다.',[row('삽입 직후',[1,4,7],[0]),row('유지 후보',[4,7],[],[0,1])]),
 step('3 삽입 후 3 제거','새 원소가 현재 후보보다 작으므로 후보는 그대로입니다.',[row('삽입 직후',[3,4,7],[0]),row('유지 후보',[4,7],[],[0,1])],'두 번째로 큰 값 = top = 4')]},
 greedy:{title:'종료가 빠른 회의부터 선택',steps:[
 {title:'종료 시각으로 정렬',note:'검사 순서는 [2,3), [1,4), [3,5), [4,6)입니다.',intervals:[{label:'[1,4)',start:1,end:4},{label:'[2,3)',start:2,end:3},{label:'[3,5)',start:3,end:5},{label:'[4,6)',start:4,end:6}]},
 {title:'[2,3) 선택',note:'종료 3을 기억합니다. [1,4)는 시작 1 < 3이므로 거절합니다.',intervals:[{label:'[1,4) 거절',start:1,end:4},{label:'[2,3) 선택',start:2,end:3,selected:true},{label:'[3,5)',start:3,end:5},{label:'[4,6)',start:4,end:6}]},
 {title:'[3,5) 선택',note:'시작 3은 이전 종료 3과 같아서 선택할 수 있습니다. [4,6)는 시작 4 < 5이므로 거절합니다.',intervals:[{label:'[1,4) 거절',start:1,end:4},{label:'[2,3) 선택',start:2,end:3,selected:true},{label:'[3,5) 선택',start:3,end:5,selected:true},{label:'[4,6) 거절',start:4,end:6}],result:'최대 2개'}]},
 dijkstra:{title:'첫 발견 비용은 잠정값',steps:[
 {title:'시작 정점 1',note:'1만 거리 0, 나머지는 미발견입니다.',rows:[row('dist · 정점 1,2,3',[0,'∞','∞'])]},
 {title:'1의 간선 완화',note:'2에 비용 5, 3에 비용 1인 후보를 넣습니다.',rows:[row('dist · 정점 1,2,3',[0,5,1],[1,2])]},
 {title:'정점 3 처리',note:'1→3→2의 비용 1+1=2가 기존 5보다 작아 개선합니다.',rows:[row('dist · 정점 1,2,3',[0,2,1],[1],[0,2])],result:'정점 2 최단거리 = 2'},
 {title:'오래된 후보 건너뛰기',note:'2의 비용 2 후보를 처리한 뒤 비용 5 후보는 dist[2]와 달라 버립니다.',rows:[row('dist · 정점 1,2,3',[0,2,1],[],[0,1,2])],result:'거리 [0,2,1]'}].map(s=>({...s,graph:{nodes:[{id:1,label:'1',x:80,y:150},{id:2,label:'2',x:510,y:150},{id:3,label:'3',x:300,y:60}],edges:[{from:1,to:2,label:'5',directed:true},{from:1,to:3,label:'1',directed:true},{from:3,to:2,label:'1',directed:true,selected:s.title==='정점 3 처리'}]}}))},
 dsu:{title:'대표끼리 합치기',steps:[
 step('초기 집합','각 정점이 자신의 대표입니다.',[row('정점',[1,2,3]),row('parent',[1,2,3])]),
 step('union(1,2)','크기가 같은 두 집합에서 2의 루트를 1 아래에 붙입니다.',[row('parent',[1,1,3],[1]),row('집합',['{1,2}','{3}'])]),
 step('union(2,3)','find(2)=1이므로 대표 1과 3을 합칩니다.',[row('parent',[1,1,1],[2]),row('집합',['{1,2,3}'],[],[0])],'find(1) = find(3) = 1')]},
 math:{title:'공약수를 보존하며 나머지로 줄이기',steps:[
 step('42와 30','42 = 1×30 + 12',[row('(a,b)',[42,30]),row('다음 (b,a%b)',[30,12],[1])]),
 step('30과 12','30 = 2×12 + 6',[row('(a,b)',[30,12]),row('다음 (b,a%b)',[12,6],[1])]),
 step('12와 6','12 = 2×6 + 0. b가 0이면 a를 반환합니다.',[row('종료 (a,b)',[6,0],[],[0])],'gcd(42,30)=6'),
 step('0의 경계','(0,7)은 (7,0)으로 한 번 전이합니다. (0,0)은 반복 없이 0을 반환합니다.',[row('gcd(0,7)',[0,7,'→',7,0]),row('gcd(0,0)',[0,0])],'gcd(0,7)=7 / gcd(0,0)=0')]}
});
const inputs={sort:{array:'3,-1,3,2,-1'},prefix:{array:'3,-2,5,1',l:1,r:3},twopointer:{array:'-4,-1,2,5,8',target:7},binary:{array:'1,3,3,7,9',target:3},backtrack:{array:'1,2,3',target:3},dfs:{n:4,start:1,edges:'1 2\n1 3\n2 4\n3 4'},bfs:{n:4,start:1,edges:'1 2\n1 3\n2 4\n3 4'},dp:{array:'1,3,4',target:6},trie:{words:'cat,car,dog',query:'ca',mode:'word'}};
window.EXAMPLE_INPUTS=inputs;
for(const [kind,input] of Object.entries(inputs)){
 const frames=window.AlgoEngine.trace(kind,input);
 if(kind==='binary')frames.push(...window.AlgoEngine.trace(kind,{...input,target:10}));
 if(kind==='trie')frames.push(...window.AlgoEngine.trace(kind,{...input,mode:'prefix'}));
 visuals[kind]={title:'본문 입력으로 따라가는 '+kind.toUpperCase(),input,steps:frames.map((s,i)=>{
  const out={title:'단계 '+i,note:s.note,rows:[]};
  if(s.a)out.rows.push(row('배열 a',s.a,s.active||[],s.chosen||[]));
  if(s.p)out.rows.push(row('누적합 p',s.p.map(x=>x===null?'·':x),s.result!==undefined?[s.l,s.r]:[]));
  if(s.dp)out.rows.push(row('최소 동전 개수 dp',s.dp.map(x=>x===null?'∞':x),[s.x,s.from].filter(x=>Number.isInteger(x)&&x>=0)));
  if(kind==='binary')out.rows.push(row('목표 K · 미확정 [l,r) · mid',[s.target,s.l,s.r,s.m??'—']));
  if(kind==='twopointer')out.rows.push(row('L · R · 현재 합',[s.l,s.r,s.sum??'—']));
  if(kind==='backtrack'){out.rows.push(row('선택한 원소',s.chosen.map(j=>s.a[j])));out.rows.push(row('찾은 부분집합',s.answers.map(a=>'{'+a.join(', ')+'}')));}
  if(kind==='dfs'||kind==='bfs'){
   out.graph={nodes:Array.from({length:s.n},(_,j)=>{const v=j+1,t=-Math.PI/2+2*Math.PI*j/s.n;return {id:v,label:v+(kind==='bfs'?' · d='+(s.dist[v]??'∞'):''),x:300+200*Math.cos(t),y:150+100*Math.sin(t),active:s.current===v,selected:s.visited.includes(v)};}),edges:s.edges.map(e=>({from:e[0],to:e[1],selected:s.tree.some(t=>t.includes(e[0])&&t.includes(e[1]))}))};
   out.rows.push(row(kind==='dfs'?'호출 스택 · 오른쪽 top':'큐 · 왼쪽 front',kind==='dfs'?s.stack:s.queue));out.rows.push(row('순서',s.order));
  }
  if(kind==='trie'){
   const children=s.nodes.map(()=>[]),pos={},count={n:0};s.nodes.forEach(n=>{if(n.parent!==null)children[n.parent].push(n.id);});
   const layout=(id,d)=>{children[id].forEach(c=>layout(c,d+1));pos[id]={x:children[id].length?children[id].reduce((a,c)=>a+pos[c].x,0)/children[id].length:60+count.n++*90,y:35+d*65};};layout(0,0);
   out.graph={nodes:s.nodes.map(n=>({id:n.id,label:(n.prefix||'root')+(n.end?' ★':''),...pos[n.id],active:s.current===n.id,selected:s.path.includes(n.id)})),edges:s.nodes.filter(n=>n.parent!==null).map(n=>({from:n.parent,to:n.id,selected:s.path.includes(n.id)}))};
   out.rows.push(row('현재 문자열',[s.word||'준비']));
  }
  if(s.result!==undefined)out.result=typeof s.result==='boolean'?(s.result?'참':'거짓'):Array.isArray(s.result)?s.result.join(' + '):String(s.result);
  if(kind==='sort'&&i===frames.length-1){const counts=[];s.a.forEach(v=>{const p=counts.at(-1);if(p&&p[0]===v)p[1]++;else counts.push([v,1]);});out.rows.push(row('(값,빈도)',counts.map(p=>'('+p.join(',')+')')));out.result='(-1,2), (2,1), (3,2)';}
  return out;
 })};
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(s){
 let html='';
 if(s.graph){const g=s.graph,byId=new Map(g.nodes.map(n=>[n.id,n]));html+='<svg class="example-graph" viewBox="0 0 600 300" role="img" aria-label="'+esc(s.title)+'"><defs><marker id="example-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs>';
 for(const e of g.edges){const a=byId.get(e.from),b=byId.get(e.to),dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;html+='<line x1="'+(a.x+25*dx/d)+'" y1="'+(a.y+25*dy/d)+'" x2="'+(b.x-28*dx/d)+'" y2="'+(b.y-28*dy/d)+'" stroke="'+(e.selected?'#0f766e':'#9aabba')+'" stroke-width="'+(e.selected?4:2)+'" '+(e.directed?'marker-end="url(#example-arrow)"':'')+'/>';if(e.label!==undefined)html+='<text x="'+((a.x+b.x)/2)+'" y="'+((a.y+b.y)/2-10)+'" text-anchor="middle">'+esc(e.label)+'</text>';}
 for(const n of g.nodes)html+='<g class="'+(n.active?'viz-active':n.selected?'viz-selected':'')+'"><circle cx="'+n.x+'" cy="'+n.y+'" r="25"/><text x="'+n.x+'" y="'+(n.y+5)+'" text-anchor="middle">'+esc(n.label)+'</text></g>';
 html+='</svg>';
 }
 if(s.intervals){const min=Math.min(...s.intervals.map(x=>x.start)),max=Math.max(...s.intervals.map(x=>x.end)),span=max-min||1;html+='<div class="viz-timeline">'+s.intervals.map(x=>'<div class="viz-interval"><span>'+esc(x.label)+'<small>['+x.start+', '+x.end+')</small></span><div class="viz-track"><b class="'+(x.selected?'viz-selected':'')+'" style="margin-left:'+((x.start-min)/span*100)+'%;width:'+((x.end-x.start)/span*100)+'%" aria-label="'+x.start+'부터 '+x.end+' 전까지">&nbsp;</b></div></div>').join('')+'</div>';}
 if(s.grid)html+='<div class="viz-grid-wrap"><p class="scene-label">'+esc(s.grid.label)+'</p><table class="viz-grid" aria-label="'+esc(s.grid.label)+'">'+s.grid.values.map((r,i)=>'<tr>'+r.map((v,j)=>'<td class="'+(s.grid.active?.some(p=>p[0]===i&&p[1]===j)?'viz-active':s.grid.selected?.some(p=>p[0]===i&&p[1]===j)?'viz-selected':'')+'">'+esc(v)+'</td>').join('')+'</tr>').join('')+'</table></div>';
 html+=(s.rows||[]).map(r=>'<div class="viz-row"><p class="scene-label">'+esc(r.label)+'</p><div class="viz-cells">'+(r.values.length?r.values.map((v,i)=>'<div class="viz-cell '+(r.active?.includes(i)?'viz-active':r.selected?.includes(i)?'viz-selected':'')+'"><b>'+esc(v)+'</b><small>'+i+'</small></div>').join(''):'<span class="muted">비어 있음</span>')+'</div></div>').join('');
 if(s.result!==undefined)html+='<p class="viz-result">결과 · '+esc(s.result)+'</p>';
 return html;
}
window.ExampleVisuals={render,mount(id,root){const v=visuals[id];if(!v)return;let index=0;
 root.innerHTML='<div class="lab-title"><div><p class="eyebrow">EXAMPLE WALKTHROUGH</p><h2>'+esc(v.title)+'</h2></div><span class="lab-badge">본문 예시</span></div><div class="example-frame"><p class="viz-legend">주황: 현재 처리 · 청록: 선택 또는 확인한 값 · 칸 아래 숫자: 0-based 인덱스</p><div class="example-scene"></div><div class="example-note" aria-live="polite"><h3></h3><p></p></div><div class="example-controls"><button type="button" data-action="first">처음</button><button type="button" data-action="prev">이전</button><label>실행 단계 <input type="range" min="0" max="'+(v.steps.length-1)+'" value="0"></label><button type="button" data-action="next">다음 단계</button><button type="button" data-action="last">결과</button><span class="example-count"></span></div></div>';
 const draw=()=>{const s=v.steps[index];root.querySelector('.example-scene').innerHTML=render(s);root.querySelector('.example-note h3').textContent=s.title;root.querySelector('.example-note p').textContent=s.note;root.querySelector('input').value=index;root.querySelector('.example-count').textContent=(index+1)+' / '+v.steps.length;for(const action of ['first','prev'])root.querySelector('[data-action="'+action+'"]').disabled=index===0;for(const action of ['last','next'])root.querySelector('[data-action="'+action+'"]').disabled=index===v.steps.length-1;};
 root.querySelectorAll('button').forEach(b=>b.onclick=()=>{index=b.dataset.action==='first'?0:b.dataset.action==='last'?v.steps.length-1:Math.max(0,Math.min(v.steps.length-1,index+(b.dataset.action==='next'?1:-1)));draw();});root.querySelector('input').oninput=e=>{index=+e.target.value;draw();};draw();
}};
})();
