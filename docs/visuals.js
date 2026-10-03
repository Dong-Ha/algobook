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
// Hand-authored chapters use the same primitives with explicit semantic roles.
for(const id of ['thinking','stl','greedy','dijkstra','dsu','math'])for(const s of visuals[id].steps){
 s.renderer={thinking:'mapping',stl:'tree',greedy:'timeline',dijkstra:'graph',dsu:'tree',math:'mapping'}[id];
 for(const r of s.rows||[])r.type=id==='thinking'&&r.label==='입력'?'array':id==='thinking'?'sequence':'state';
}
visuals.thinking.steps.forEach((s,i)=>{const x=[4,1,7,3][i];s.flow={label:'이전 위치만 조회 → 없으면 삽입',items:['현재 '+x,'짝 '+(10-x)+' 조회',i===3?'이전 위치의 7과 쌍 확정':'없음 → '+x+' 삽입']};});
visuals.stl.steps.forEach(s=>{const values=s.rows.at(-1).values;s.graph={nodes:values.map((v,i)=>({id:i,label:v,caption:i===0?'min-heap root · top':'유지 후보',x:i===0?300:200+i*100,y:i===0?60:200,selected:true})),edges:values.slice(1).map((_,i)=>({from:0,to:i+1}))};s.hiddenRows=[s.rows.at(-1).label];s.flow={label:'크기 K=2 유지',items:s.rows.length>1?['새 값 삽입','3개 → 최소 top 제거','가장 큰 2개 유지']:['최소 root = '+values[0],'K개 이하면 유지']};});
// Decisions precede their consequences on the same time axis.
const meeting=(label,start,end,extra={})=>({label,start,end,...extra});
visuals.greedy.steps=[
 {title:'종료가 가장 빠른 후보',note:'먼저 끝나는 회의를 골라야 이후 회의에 가장 많은 시간을 남깁니다.',renderer:'timeline',intervals:[meeting('[1,4)',1,4),meeting('[2,3) 검사',2,3,{active:true}),meeting('[3,5)',3,5),meeting('[4,6)',4,6)],flow:{label:'후보 → 선택 기준',items:['종료 순서 3, 4, 5, 6','가장 빠른 종료 3','[2,3) 선택 예정']}},
 {title:'[2,3) 선택 뒤 충돌 검사',note:'선택 종료 3보다 시작이 이른 [1,4)는 함께 배치할 수 없습니다.',renderer:'timeline',intervals:[meeting('[1,4) 충돌',1,4,{active:true}),meeting('[2,3) 선택',2,3,{selected:true}),meeting('[3,5)',3,5),meeting('[4,6)',4,6)],timeline:{cursor:3},flow:{label:'시작과 이전 종료 비교',items:['시작 1 < 종료 3','[1,4) 제외 예정']}},
 {title:'다음 가능한 회의',note:'반열린 구간에서는 이전 종료와 다음 시작이 같아도 겹치지 않습니다.',renderer:'timeline',intervals:[meeting('[1,4) 제외',1,4,{discarded:true}),meeting('[2,3) 선택',2,3,{selected:true}),meeting('[3,5) 검사',3,5,{active:true}),meeting('[4,6)',4,6)],timeline:{cursor:3},flow:{label:'후보 → 선택',items:['시작 3 ≥ 종료 3','[3,5) 선택','새 종료 5']}},
 {title:'선택 뒤 남은 후보 제거',note:'[4,6)의 시작 4는 새 종료 5보다 작으므로 거절합니다.',renderer:'timeline',intervals:[meeting('[1,4) 제외',1,4,{discarded:true}),meeting('[2,3) 선택',2,3,{selected:true}),meeting('[3,5) 선택',3,5,{selected:true}),meeting('[4,6) 제외',4,6,{discarded:true})],timeline:{cursor:5},flow:{label:'최종 배치',items:['[2,3)','[3,5)','최대 2개']},result:'최대 2개'}
];
visuals.dijkstra.steps.forEach((s,i)=>{
 const distances=s.rows[0].values;s.rows[0].indices=['정점 1','정점 2','정점 3'];s.rows[0].type='array';s.rows[0].active=i===1?[1,2]:i===2?[1]:[];s.rows[0].dependency=i===2?[2]:[];
 s.graph.nodes.forEach(n=>{n.active=n.id===[1,1,3,null][i];n.selected=i>0&&n.id===1||i>1&&n.id===3||i===3;n.caption='dist='+distances[n.id-1];});
 s.graph.edges.forEach(e=>{e.active=i===1&&e.from===1||i===2&&e.from===3;e.selected=i===3&&(e.to===3||e.from===3);});
 s.rows.push({...row('優先 후보 · 최소 비용 먼저',i===0?['(0,1)']:i===1?['(1,3)','(5,2)']:i===2?['(2,2)','(5,2)']:[]),label:'우선 후보 · 최소 비용 먼저',type:'queue'});
 s.flow={label:'우선 후보 → 잠정 거리 비교',items:i===0?['(거리 0, 정점 1)','출발점부터 완화']:i===1?['1→2 비용 5 / 1→3 비용 1','다음 pop: (1,3)']:i===2?['dist[3]=1','+ 간선 3→2 비용 1','후보 2 < 기존 5','dist[2] ← 2']:['pop (5,2)','현재 dist[2]=2 ≠ 5','오래된 후보 폐기']};
});
{
 const end=visuals.dijkstra.steps.at(-1),confirm=JSON.parse(JSON.stringify(end));
 confirm.title='정점 2 거리 확정';confirm.note='최소 후보 (2,2)는 현재 dist[2]=2와 같습니다. 이 값을 처리하고 나면 힙에는 오래된 (5,2)만 남습니다.';
 confirm.graph.nodes.forEach(n=>{n.active=n.id===2;n.selected=n.id!==2;});
 confirm.rows[1].values=['(5,2)'];confirm.flow={label:'최소 후보 → 확정 → 다음 후보',items:['pop (2,2)','현재 dist[2]=2 · 처리','다음 (5,2)는 현재 거리와 불일치']};
 visuals.dijkstra.steps.splice(-1,0,confirm);
}
const ds=visuals.dsu.steps;
function forest(parents,active=[],path=[]){return {nodes:parents.map((p,i)=>({id:i+1,label:i+1,caption:p===i+1?'root':'parent='+p,captionDy:p===i+1?-32:43,x:p===i+1?100+i*180:100+(p-1)*180+(i+1)*55,y:p===i+1?65:210,active:active.includes(i+1),selected:p===i+1})),edges:parents.flatMap((p,i)=>p===i+1?[]:[{from:i+1,to:p,directed:true,active:active.includes(i+1),dependency:path.includes(i+1)}])};}
ds[0].graph=forest([1,2,3]);ds[0].hiddenRows=['정점','parent'];
ds[1].graph=forest([1,1,3],[2]);ds[1].hiddenRows=['parent'];ds[1].flow={label:'대표끼리 union',items:['root(1)=1 / root(2)=2','크기가 같은 집합','2 → 1 · root 하나로']};
ds.splice(2,0,{title:'union(2,3) 전 root 탐색',note:'2를 그대로 붙이는 대신 parent를 따라 대표 1을 찾습니다. 집합끼리 합칠 때 바꾸는 것은 root의 parent입니다.',renderer:'tree',graph:forest([1,1,3],[2],[2]),rows:[{label:'find 결과',values:['find(2)=1','find(3)=3'],type:'state'}],flow:{label:'find → union 예정',items:['2 → parent 1','1은 root','root 3을 root 1에 연결']}});
ds[3].graph=forest([1,1,1],[3]);ds[3].hiddenRows=['parent'];ds[3].flow={label:'union 결과',items:['3 → 1','대표 1 · 크기 3']};
// Independent four-node forest makes path compression observable.
for(const compressed of [false,true])visuals.dsu.steps.push({
 title:compressed?'경로 압축 뒤 parent[4]=1':'경로 압축 전 find(4): 4 → 3 → 1',
 note:compressed?'대표는 그대로 1이고, 탐색한 4의 parent를 대표 1로 바꿉니다. 다음 find(4)는 중간 정점 3을 거치지 않습니다.':'독립 예제: {1,2}, {3,4}를 합쳐 root 3을 root 1에 붙인 forest입니다. 4의 parent는 아직 3이므로 대표를 찾을 때 두 간선을 따라갑니다.',renderer:'tree',
 graph:{nodes:[{id:1,label:1,caption:'root',captionDy:-32,x:300,y:45,selected:true},{id:2,label:2,caption:'parent=1',x:150,y:140},{id:3,label:3,caption:'parent=1',x:430,y:140},{id:4,label:4,caption:compressed?'parent=1':'parent=3',x:compressed?300:510,y:235,active:true}],edges:[{from:2,to:1,directed:true},{from:3,to:1,directed:true,dependency:!compressed},{from:4,to:compressed?1:3,directed:true,active:true}]},
 rows:[{label:'parent · 정점별 매핑',values:compressed?[1,1,1,1]:[1,1,1,3],type:'array',indices:['정점 1','정점 2','정점 3','정점 4'],active:[3]}],
 flow:{label:'find 경로 → parent 압축',items:compressed?['대표 1은 유지','parent[4]: 3 → 1','다음 find: 4 → 1']:['4 → parent 3','3 → parent 1','root 1을 반환하며 경로 압축']},
 ...(compressed?{result:'find(4)=1 · 같은 집합, 더 짧은 경로'}:{})
});
visuals.math.steps.forEach((s,i)=>{if(i<3)s.flow={label:'공약수 보존 전이',items:i===0?['42 = 1×30 + 12','(42,30) → (30,12)']:i===1?['30 = 2×12 + 6','(30,12) → (12,6)']:['12 = 2×6 + 0','(6,0) · gcd=6']};});
const inputs={sort:{array:'3,-1,3,2,-1'},prefix:{array:'3,-2,5,1',l:1,r:3},twopointer:{array:'-4,-1,2,5,8',target:7},binary:{array:'1,3,3,7,9',target:3},backtrack:{array:'1,2,3',target:3},dfs:{n:4,start:1,edges:'1 2\n1 3\n2 4\n3 4'},bfs:{n:4,start:1,edges:'1 2\n1 3\n2 4\n3 4'},dp:{array:'1,3,4',target:6},trie:{words:'cat,car,dog',query:'ca',mode:'word'}};
window.EXAMPLE_INPUTS=inputs;
// Trace adapters keep algorithm state separate from rendering primitives.
function traversalGraph(s){
 const key=e=>[...e].sort((a,b)=>a-b).join('-');
 return {nodes:Array.from({length:s.n},(_,j)=>{const v=j+1,t=-Math.PI/2+2*Math.PI*j/s.n;return {id:v,label:v,x:300+200*Math.cos(t),y:150+105*Math.sin(t),active:s.current===v,frontier:s.stack.includes(v)||s.queue.includes(v),selected:s.done.includes(v),caption:s.kind==='bfs'?'d='+(s.dist[v]??'∞'):s.visited.includes(v)?'방문함':'미방문'};}),edges:s.edges.map(e=>({from:e[0],to:e[1],active:s.edge&&key(e)===key(s.edge),selected:s.tree.some(t=>key(t)===key(e))}))};
}
function trieGraph(s){
 const children=s.nodes.map(()=>[]),pos={},leaf={n:0};
 s.nodes.forEach(n=>{if(n.parent!==null)children[n.parent].push(n.id);});
 children.forEach(cs=>cs.sort((a,b)=>s.nodes[a].ch.localeCompare(s.nodes[b].ch)));
 const layout=(id,d)=>{children[id].forEach(c=>layout(c,d+1));pos[id]={x:children[id].length?children[id].reduce((a,c)=>a+pos[c].x,0)/children[id].length:60+leaf.n++*90,y:40+d*80};};layout(0,0);
 return {width:Math.max(240,leaf.n*90+30),height:90+Math.max(...s.nodes.map(n=>n.prefix.length))*80,nodes:s.nodes.map(n=>({id:n.id,label:n.ch||'root',caption:n.end?'★ 단어 끝':n.prefix||'빈 접두사',...pos[n.id],active:s.current===n.id,selected:s.path.includes(n.id)})),edges:s.nodes.filter(n=>n.parent!==null).map(n=>({from:n.parent,to:n.id,label:n.ch,active:s.current===n.id&&s.path.length>1,selected:s.path.includes(n.id)}))};
}
function branchGraph(s,completed){
 const n=s.a.length,nodes=[],edges=[];
 const path=s.stack.map(f=>(2**f.i)+f.chosen.reduce((m,j)=>m+2**(f.i-1-j),0));
 function visit(depth,bits,sum){const id=2**depth+bits,x=35+(bits+.5)*530/2**depth,y=35+depth*90;
  nodes.push({id,label:String(sum),caption:depth===n?(sum===s.target?'답':'종료'):'i='+depth,x,y,active:id===path.at(-1),frontier:path.includes(id),selected:completed.has(id)&&depth===n&&sum===s.target,discarded:completed.has(id)&&!path.includes(id)&&!(depth===n&&sum===s.target)});
  if(depth<n)for(const take of [0,1]){const child=2**(depth+1)+bits*2+take;edges.push({from:id,to:child,label:take?'선택':'미선택',labelT:.72,labelDy:-5,active:child===path.at(-1),selected:path.includes(child)});visit(depth+1,bits*2+take,sum+(take?s.a[depth]:0));}
 }visit(0,0,0);return {nodes,edges,height:110+n*90};
}
function fromTrace(s,i,completed=new Set()){
 const out={title:'단계 '+i,note:s.note,renderer:{binary:'range-search',twopointer:'pointers',backtrack:'state-space',dfs:'traversal',bfs:'traversal',dp:'dependency',trie:'trie',prefix:'dependency',sort:'sequence'}[s.kind],rows:[]};
 const add=(label,values,type='state',extra={})=>out.rows.push({...row(label,values),type,...extra});
 if(s.a)add(s.kind==='dp'?'동전 종류':'배열 a',s.a,'array',{active:s.active||[],selected:s.chosen||[],discarded:s.discard||[]});
 if(s.kind==='sort')out.rows[0].selected=Array.from({length:s.sorted},(_,i)=>i);
 if(s.p){add('누적합 p',s.p.map(x=>x===null?'·':x),'array',{active:s.result!==undefined?[s.r]:s.active.map(i=>i+1),dependency:s.result!==undefined?[s.l]:s.active});out.flow={label:s.result!==undefined?'질의 ['+s.l+', '+s.r+')':'누적합 전이',items:s.result!==undefined?['p['+s.r+']='+s.p[s.r],'− p['+s.l+']='+s.p[s.l],'합 '+s.result]:s.active.length?['p['+s.active[0]+']='+s.p[s.active[0]],'+ a['+s.active[0]+']='+s.a[s.active[0]],'p['+(s.active[0]+1)+']='+s.p[s.active[0]+1]]:['p[0] = 0']};}
 if(s.kind==='binary'){
  const r=out.rows[0];r.pointers={[s.l]:'L',[s.r]:'R (경계)'};if(s.l===s.r)r.pointers[s.l]='L = R';
  r.discarded=s.a.map((_,j)=>j).filter(j=>j<s.l||j>=s.r);r.candidate=s.a.map((_,j)=>j).filter(j=>j>=s.l&&j<s.r);
  if(s.line===4){r.pointers[s.m]=(r.pointers[s.m]||'')+' MID';r.pending=s.a.map((_,j)=>j).filter(j=>s.a[s.m]<s.target?j>=s.l&&j<=s.m:j>=s.m&&j<s.r);}
  else r.active=s.result!==undefined&&s.result<s.a.length?[s.result]:[];
  add('목표 K',[s.target]);add('탐색 경계',['['+s.l+', '+s.r+')']);
  out.flow={label:'판단 → 다음 경계',items:s.line===4?['a['+s.m+']='+s.a[s.m],s.a[s.m]<s.target?'K='+s.target+' 미만':'K='+s.target+' 이상',s.a[s.m]<s.target?'l ← '+(s.m+1):'r ← '+s.m+' (mid는 답 경계 후보)']:s.result!==undefined?['l = r = '+s.result,s.result===s.a.length?'N 반환 · 해당 원소 없음':'첫 K 이상 위치']:['후보 ['+s.l+', '+s.r+')','중간 위치 비교']};
 }
 if(s.kind==='twopointer'){
  out.rows[0].pointers={[s.l]:'L',[s.r]:s.l===s.r?'L · R':'R'};add('목표 K',[s.target]);
  out.flow={label:'두 원소 → 합 → 이동',items:s.sum===undefined?['양 끝 L / R','합 비교']:['a['+s.l+']='+s.a[s.l]+' + a['+s.r+']='+s.a[s.r],'합 '+s.sum+' / K '+s.target,s.sum<s.target?'L → 오른쪽':s.sum>s.target?'R → 왼쪽':'쌍 확정']};
 }
 if(s.dp){add('최소 동전 개수 dp',s.dp.map(x=>x===null?'∞':x),'array',{active:[s.x],dependency:Number.isInteger(s.from)&&s.from>=0?[s.from]:[]});
  out.flow={label:'이전 상태 → 후보 → 선택',items:s.coin===null?['dp[0]=0','목표 금액 '+s.target]:s.from<0?['동전 '+s.coin+' > 금액 '+s.x,'후보 제외']:s.dp[s.from]===null?['dp['+s.from+']=∞','도달 불가능 · 후보 제외']:['dp['+s.from+']='+s.dp[s.from],'+ 동전 '+s.coin+' 한 개 → '+s.candidate,'기존 '+(s.old??'∞'),'min → dp['+s.x+']='+s.dp[s.x]]};
 }
 if(s.kind==='backtrack'){
  out.graph=branchGraph(s,completed);add('호출 스택 (i, sum)',s.stack.map(f=>'('+f.i+', '+f.sum+')'),'stack');add('선택한 원소',s.chosen.map(j=>s.a[j]),'sequence');add('찾은 부분집합',s.answers.map(a=>'{'+a.join(', ')+'}'),'sequence');
  out.flow={label:'현재 branch',items:s.line===11?['호출 종료','부모의 선택 / 합 복구']:['합 '+s.sum+' / 목표 '+s.target,s.active.length?'다음 원소 '+s.a[s.active[0]]+' · 미선택 / 선택':'말단 판단']};
 }
 if(s.kind==='dfs'||s.kind==='bfs'){
  out.graph=traversalGraph(s);add(s.kind==='dfs'?'호출 스택 · 오른쪽 top':'큐 · 왼쪽 front',s.kind==='dfs'?s.stack:s.queue,s.kind==='dfs'?'stack':'queue');add('방문한 정점',s.visited,'sequence');add('처리 순서',s.order,'sequence');add('처리 완료',s.done,'sequence',{selected:s.done.map((_,i)=>i)});
  out.flow={label:'현재 검사',items:s.edge?['정점 '+s.current,'간선 '+s.edge.join(' → '),s.kind==='bfs'&&s.line===8?'최초 발견 → 거리 기록 / queue 삽입':s.visited.includes(s.edge[1])?'방문 여부 확인 · 중복 호출/삽입 방지':'미방문 · 다음 탐색 후보']:['현재 '+(s.current??'없음'),s.current?'frontier / 이웃 확인':'탐색 준비 또는 종료']};
 }
 if(s.kind==='trie'){out.graph=trieGraph(s);add('검색 문자열',[s.word||'준비']);out.flow={label:'prefix path → word-end',items:[s.nodes[s.current].prefix||'빈 접두사',s.word.slice(s.path.length-1)?'다음 문자 '+s.word[s.path.length-1]:'모든 문자 경로 확인',s.nodes[s.current].end?'★ 단어 끝':'단어 끝 표시 없음']};}
 if(s.result!==undefined)out.result=typeof s.result==='boolean'?(s.result?'참':'거짓'):Array.isArray(s.result)?s.result.join(' + '):String(s.result);
 return out;
}
for(const [kind,input] of Object.entries(inputs)){
 const frames=window.AlgoEngine.trace(kind,input);
 if(kind==='binary')frames.push(...window.AlgoEngine.trace(kind,{...input,target:10}));
 if(kind==='trie')frames.push(...window.AlgoEngine.trace(kind,{...input,mode:'prefix'}));
 const completed=new Set();
 visuals[kind]={title:'본문 입력으로 따라가는 '+kind.toUpperCase(),input,steps:frames.map((s,i)=>{
  if(kind==='backtrack'&&s.line===11&&i){const f=frames[i-1].stack.at(-1);if(f)completed.add(2**f.i+f.chosen.reduce((m,j)=>m+2**(f.i-1-j),0));}
  const out=fromTrace(s,i,completed);
  if(kind==='sort'&&i===frames.length-1){const counts=[];s.a.forEach(v=>{const p=counts.at(-1);if(p&&p[0]===v)p[1]++;else counts.push([v,1]);});out.rows.push({...row('(값,빈도)',counts.map(p=>'('+p.join(',')+')')),type:'state'});out.result='(-1,2), (2,1), (3,2)';}
  return out;
 })};
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Semantic state classes are shared by diagrams, cells, edges and legends.
const stateClass=x=>x.active?'viz-active':x.dependency?'viz-dependency':x.selected?'viz-selected':x.discarded?'viz-discarded':x.frontier?'viz-frontier':'';
function graph(g,title){
 const byId=new Map(g.nodes.map(n=>[n.id,n])),w=g.width||600,h=g.height||300;
 let html='<div class="viz-graph-scroll" tabindex="0" role="group" aria-label="'+esc(title)+' · 좌우 이동 가능한 도식"><svg class="example-graph" viewBox="0 0 '+w+' '+h+'" style="min-width:'+Math.min(w,560)+'px" role="img" aria-label="'+esc(title)+'"><title>'+esc(title)+'</title>';
 for(const e of g.edges){const a=byId.get(e.from),b=byId.get(e.to),dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,x1=a.x+25*dx/d,y1=a.y+25*dy/d,x2=b.x-28*dx/d,y2=b.y-28*dy/d;
  html+='<g class="viz-edge '+stateClass(e)+'"><title>'+esc(e.from)+' → '+esc(e.to)+' · '+(e.active?'현재 검사':e.dependency?'이전 상태 참조':e.selected?'선택된 경로':e.discarded?'제외된 간선':'미처리 간선')+'</title>';
  if(a.id===b.id)html+='<circle class="viz-loop" cx="'+a.x+'" cy="'+(a.y-28)+'" r="23"/>';
  else{if(e.bend)html+='<path d="M '+x1+' '+y1+' Q '+((x1+x2)/2)+' '+((y1+y2)/2+e.bend)+' '+x2+' '+y2+'"/>';else html+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';if(e.directed){const tx=e.bend?(x2-x1)/2:dx,ty=e.bend?(y2-y1)/2-e.bend:dy,td=Math.hypot(tx,ty)||1,ux=tx/td,uy=ty/td;html+='<path d="M '+(x2-10*ux-5*uy)+' '+(y2-10*uy+5*ux)+' L '+x2+' '+y2+' L '+(x2-10*ux+5*uy)+' '+(y2-10*uy-5*ux)+'"/>';}}
  if(e.label!==undefined)html+='<text x="'+(a.x+(b.x-a.x)*(e.labelT??.5))+'" y="'+(a.y+(b.y-a.y)*(e.labelT??.5)+(e.bend||0)/2+(e.labelDy??-10))+'" text-anchor="middle">'+esc(e.label)+'</text>';html+='</g>';
 }
 for(const n of g.nodes)html+='<g class="viz-node '+stateClass(n)+'"><title>'+esc(n.label)+' · '+esc(n.caption||'')+' · '+(n.active?'현재 처리':n.frontier?'frontier':n.selected?'선택/확정':n.discarded?'제외':'미처리')+'</title><circle cx="'+n.x+'" cy="'+n.y+'" r="25"/><text x="'+n.x+'" y="'+(n.y+5)+'" text-anchor="middle">'+esc(n.label)+'</text>'+(n.caption?'<text class="viz-caption" x="'+n.x+'" y="'+(n.y+(n.captionDy??43))+'" text-anchor="middle">'+esc(n.caption)+'</text>':'')+'</g>';
 return html+'</svg></div>';
}
function sequence(r){
 const type=r.type||'state',indexed=type==='array'||type==='bitset',n=r.values.length;
 let html='<div class="viz-row viz-'+type+'"><p class="scene-label">'+esc(r.label)+'</p>';
 if(type==='stack'||type==='queue')html+='<p class="viz-endpoints">'+(type==='stack'?'bottom → top · push / pop 은 top에서':'front ← dequeue · enqueue → back')+'</p>';
 html+='<div class="viz-cells">'+(n?r.values.map((v,i)=>{
  const cls=stateClass({active:r.active?.includes(i),frontier:type==='stack'||type==='queue',dependency:r.dependency?.includes(i),selected:type==='bitset'?v===1:r.selected?.includes(i),discarded:r.discarded?.includes(i)});
  const name=r.indices?.[i]??(type==='bitset'?'bit '+i:i),bit=type==='bitset';
  return '<div class="'+(indexed?'viz-cell':'viz-token')+' '+cls+(r.pending?.includes(i)?' viz-pending':'')+(r.candidate?.includes(i)?' viz-candidate':'')+'"'+(indexed?' aria-label="'+esc(name)+' · '+esc(v)+(bit?' · '+(v===1?'ON':'OFF'):'')+'"':'')+'>'+(r.pointers?'<span class="viz-pointer">'+esc(r.pointers[i]||'\u00a0')+'</span>':'')+'<b>'+esc(v)+'</b>'+(indexed?'<small>'+esc(name)+'</small>':'')+(bit?'<span class="viz-bit-status">'+(v===1?'ON':'OFF')+'</span>':'')+'</div>';
 }).join(''):'<span class="muted">비어 있음</span>');
 if(r.pointers?.[n])html+='<span class="viz-boundary">'+esc(r.pointers[n])+'<small>'+n+' · 배열 밖 경계</small></span>';
 return html+'</div></div>';
}
function flow(f){return '<div class="viz-flow" role="group" aria-label="'+esc(f.label)+'"><p class="scene-label">'+esc(f.label)+'</p><ol>'+f.items.map((v,i)=>'<li>'+esc(v)+(i<f.items.length-1?'<span class="viz-flow-arrow" aria-hidden="true"> → </span>':'')+'</li>').join('')+'</ol></div>';}
function timeline(s){
 const min=Math.min(...s.intervals.map(x=>x.start)),max=Math.max(...s.intervals.map(x=>x.end)),span=max-min||1;
 const ticks=Array.from(new Set(s.intervals.flatMap(x=>[x.start,x.end]))).sort((a,b)=>a-b);
 let html='<div class="viz-timeline"><div class="viz-time-axis"><span>시간</span><div>'+ticks.map(t=>'<small style="left:'+((t-min)/span*100)+'%">'+t+'</small>').join('')+'</div></div>';
 for(const x of s.intervals)html+='<div class="viz-interval"><span>'+esc(x.label)+'<small>['+x.start+', '+x.end+')</small></span><div class="viz-track"><b class="'+stateClass(x)+'" style="margin-left:'+((x.start-min)/span*100)+'%;width:'+((x.end-x.start)/span*100)+'%" aria-label="'+x.start+'부터 '+x.end+' 전까지">'+(x.discarded?'제외':x.active?'검사':x.selected?'선택':'후보')+'</b>'+(s.timeline?.cursor!==undefined?'<i class="viz-cursor" style="left:'+((s.timeline.cursor-min)/span*100)+'%" aria-label="현재 시각 '+s.timeline.cursor+'"></i>':'')+'</div></div>';
 return html+'</div>';
}
function grid(g){
 return '<div class="viz-grid-wrap"><p class="scene-label">'+esc(g.label)+'</p><table class="viz-grid" aria-label="'+esc(g.label)+'">'+g.values.map((r,i)=>'<tr>'+r.map((v,j)=>{const hit=k=>g[k]?.some(p=>p[0]===i&&p[1]===j),header=g.headers&&(i===0||j===0),tag=header?'th':'td';return '<'+tag+(header?' scope="'+(i===0?'col':'row')+'"':'')+' class="'+stateClass({active:hit('active'),dependency:hit('dependency'),selected:hit('selected')})+'">'+esc(v)+'</'+tag+'>';}).join('')+'</tr>').join('')+'</table></div>';
}
function compose(s,order){
 const rows=(s.rows||[]).filter(r=>!s.hiddenRows?.includes(r.label));
 const parts={
  diagram:(s.graph?graph(s.graph,s.title):'')+(s.intervals?timeline(s):'')+(s.grid?grid(s.grid):''),
  array:rows.filter(r=>['array','bitset'].includes(r.type)).map(sequence).join(''),
  frontier:rows.filter(r=>['stack','queue'].includes(r.type)).map(sequence).join(''),
  state:rows.filter(r=>!['array','bitset','stack','queue'].includes(r.type)).map(sequence).join(''),
  flow:s.flow?flow(s.flow):''
 };
 return order.map(part=>parts[part]).join('');
}
// Families determine reading order; primitive composition does not duplicate geometry.
const renderers={
 'range-search':s=>compose(s,['array','flow','state','frontier','diagram']),
 pointers:s=>compose(s,['array','flow','state','frontier','diagram']),
 dependency:s=>compose(s,['diagram','array','flow','frontier','state']),
 traversal:s=>compose(s,['diagram','frontier','array','flow','state']),
 trie:s=>compose(s,['diagram','flow','state','array','frontier']),
 'state-space':s=>compose(s,['diagram','array','frontier','flow','state']),
 frontier:s=>compose(s,['array','frontier','flow','state','diagram']),
 tree:s=>compose(s,['diagram','array','flow','frontier','state']),
 graph:s=>compose(s,['diagram','frontier','flow','array','state']),
 timeline:s=>compose(s,['diagram','flow','state','array','frontier']),
 mapping:s=>compose(s,['diagram','flow','array','state','frontier']),
 bitset:s=>compose(s,['array','flow','state','diagram','frontier']),
 sequence:s=>compose(s,['array','state','flow','diagram','frontier'])
};
function render(s){
 const renderer=renderers[s.renderer];if(!renderer)throw Error('Unknown visual renderer: '+s.renderer);
 return '<div class="viz-view" data-renderer="'+s.renderer+'">'+renderer(s)+(s.result!==undefined?'<p class="viz-result">결과 · '+esc(s.result)+'</p>':'')+'</div>';
}
function legend(s){
 const parts=['주황: 현재 판단/처리','청록: 확정/선택'];
 const rows=(s.rows||[]).filter(r=>!s.hiddenRows?.includes(r.label));
 if(rows.some(r=>r.type==='stack'||r.type==='queue')||s.graph?.nodes.some(n=>n.frontier))parts.push('짙은색: 보존 중인 frontier');
 if(rows.some(r=>r.dependency?.length)||s.grid?.dependency?.length||s.graph?.edges.some(e=>e.dependency))parts.push('점선: 참조하는 이전 상태');
 if(rows.some(r=>r.discarded?.length)||s.graph?.nodes.some(n=>n.discarded)||s.graph?.edges.some(e=>e.discarded)||s.intervals?.some(x=>x.discarded))parts.push('흐린색: 제외/완료한 branch');
 if(rows.some(r=>r.pending?.length))parts.push('사선: 이번 비교로 미확정 영역에서 빠질 칸');
 if(rows.some(r=>r.type==='array'&&!r.indices))parts.push('배열 아래 숫자: 0-based 인덱스');
 if(rows.some(r=>r.type==='bitset'))parts.push('bit 위치 · ON=포함 / OFF=미포함');
 if(s.renderer==='trie')parts.push('★: 삽입된 단어의 끝');
 return parts.join(' · ');
}
// Small conceptual examples retain their source facts but expose their relations.
function enrichAdvanced(v){
 const graphOf=(nodes,edges)=>({nodes,edges});
 const node=(id,label,x,y,caption='',extra={})=>({id,label,x,y,caption,...extra});
 v['state-model'].steps.forEach((s,i)=>{s.graph=graphOf([
  node('42','ID 42',120,70,'',i?{discarded:true}:{}),node('81','ID 81',120,210),
  node('p0','위치 0',450,70,i?'삭제 뒤 조회 = −1':'본체 객체 42',i?{discarded:true}:{}),node('p1','위치 1',450,210,'본체 객체 81',{selected:!!i})
 ],[{from:'42',to:'p0',directed:true,discarded:!!i},{from:'81',to:'p1',directed:true,selected:!!i}]);s.flow={label:'ID → 위치 → 본체',items:i?['42 삭제','find(42) = 없음','조회만으로 새 객체를 만들지 않음']:['ID는 검색 키','위치는 본체를 찾는 경로']};});
 v['local-update'].steps.forEach((s,i)=>{const a=i?[6,3,4]:[6,1,4],sums=i?[9,7]:[7,5];s.graph=graphOf([
  ...a.map((x,j)=>node('a'+j,x,150+j*140,50,'a['+j+']',{active:i&&j===1})),
  ...sums.map((x,j)=>node('w'+j,x,210+j*160,215,'창 ['+j+','+(j+2)+')',{selected:!!i}))
 ],[{from:'a0',to:'w0',dependency:true,directed:true},{from:'a1',to:'w0',dependency:true,directed:true},{from:'a1',to:'w1',dependency:true,directed:true},{from:'a2',to:'w1',dependency:true,directed:true}]);s.flow={label:'바뀐 입력 → 영향받는 출력',items:i?['a[1]: 1 → 3','창 [0,2), [1,3)만 재계산','인접 합 [9,7]']:['각 인접 합은 두 입력 참조','p=1은 두 창에 포함']};});
 v['candidate-filter'].steps.forEach((s,i)=>{s.graph=graphOf([
  node('c0','후보 0',130,70),node('c2','후보 2',130,210),node('r0','ID 0',440,70,'활성 true',{selected:!!i}),node('r2','ID 2',440,210,'활성 false',{discarded:!!i})
 ],[{from:'c0',to:'r0',directed:true,selected:!!i},{from:'c2',to:'r2',directed:true,discarded:!!i}]);s.flow={label:'필터 후보 → 현재 본체 검사',items:['불변 특징 후보 {0,2}','현재 활성 확인',i?'2 제외 → 결과 {0}':'후보가 모두 정답은 아님']};});
 for(const id of ['path-algebra','path-sensitivity'])v[id].steps.forEach((s,i)=>{
  const algebra=id==='path-algebra';s.graph=graphOf([node('s','S',75,150),node('a','A',300,65),node('b','B',300,235),node('t','T',525,150)],algebra?[
   {from:'s',to:'a',label:9,directed:true,selected:!!i},{from:'a',to:'t',label:6,directed:true,active:!i,selected:!!i},
   {from:'s',to:'b',label:5,directed:true,active:!i},{from:'b',to:'t',label:11,directed:true}
  ]:[{from:'s',to:'a',label:3,directed:true,selected:true},{from:'a',to:'t',label:4,directed:true,selected:true},{from:'s',to:'t',label:10,directed:true,discarded:!!i}]);
  s.flow={label:algebra?'경로 안 min → 경로 사이 max':'남은 증거 경로 → 최적값 유지',items:algebra?['경로 A: min(9,6)=6','경로 B: min(5,11)=5','max(6,5)=6']:['증거 S→A→T: 3+4=7',i?'다른 비용 10 간선 삭제':'다른 간선의 비용 10','증거 경로 7 유지']};
 });
 v['resource-state'].steps.forEach((s,i)=>{
  s.graph=graphOf([node('a','A',140,90,'비용 4 · 자원 1',{discarded:i>0}),node('b','B',140,215,'비용 5 · 자원 3',{discarded:i===1}),node('c',i===1?'C':i===2?'B′':'다음',460,150,i===1?'비용 3 · 자원 3':i===2?'비용 7 · 자원 1':'소비 자원 2 · 비용 +2',{selected:i>0})],i===1?[{from:'c',to:'a',label:'지배',directed:true,selected:true},{from:'c',to:'b',label:'지배',directed:true,selected:true}]:[{from:'a',to:'c',label:'자원 부족',directed:true,discarded:true},{from:'b',to:'c',label:'자원 3 ≥ 2',directed:true,selected:i===2}]);
  s.flow={label:i===1?'지배 관계':'다음 행동의 가능 여부',items:i===1?['C 비용 3 ≤ 4,5','C 자원 3 ≥ 1,3','기존 두 상태 지배']:['같은 위치의 서로 다른 자원','A: 1 < 2 · 불가능','B: 3 − 2 = 1 · 가능']};
 });
 v['ordered-index'].steps.forEach((s,i)=>{s.flow={label:'객체 ID 2의 키 이동',items:i===0?['본체 점수 8','정렬 키 (8,2)']:['기존 (8,2) 삭제','본체 점수 8 → 1','새 (1,2) 삽입','키 순서 (1,2) < (3,0)']};});
 v['lazy-validity'].steps.forEach((s,i)=>{
  s.flow={label:'후보의 저장 상태와 현재 상태 비교',items:i===2?['최소 후보 ID7 · gen2','현재 gen3 ≠ 저장 gen2 → 폐기','다음 ID9 · gen1 = 현재1 → 반환']:i===3?['그룹 재활성화','저장 그룹 세대4 ≠ 현재5','활성이어도 무효']:['개별 활성 ∧ 그룹 활성','저장 세대2 = 현재3 ?','세대 불일치 → 무효']};
  if(i===2){s.rows.find(r=>r.label==='pop 후보').discarded=[0];s.rows.find(r=>r.label==='pop 후보').selected=[1];}
 });
 v['order-statistics'].steps.forEach((s,i)=>{
  if(i<2){s.flow={label:'rank: lower_bound 앞의 원소 수',items:['정렬 값 [2,4,7,9]','첫 7 이상 경계는 index 2','7보다 작은 원소 2개']};return;}
  const f=i===2?[2,1,1,0]:[1,1,1,0],left=f[0]+f[1],total=f.reduce((a,b)=>a+b,0);s.graph=graphOf([
   node('root',total,300,45,'전체 개수'),node('left',left,170,125,'값 2·4의 개수',{active:i===2}),node('right',f[2]+f[3],430,125,'값 7·9의 개수',{active:i===3}),
   ...f.map((x,j)=>node('v'+j,x,90+j*140,225,'값 '+[2,4,7,9][j],{selected:j===(i===2?1:2)}))
  ],[{from:'root',to:'left',active:i===2},{from:'root',to:'right',active:i===3},{from:'left',to:'v0'},{from:'left',to:'v1',selected:i===2},{from:'right',to:'v2',selected:i===3},{from:'right',to:'v3'}]);
  s.flow={label:'1-based k=3 · 개수로 내려가기',items:i===2?['왼쪽 개수3 ≥ k3','값2 개수2 건너뜀 · k←1','값4 선택']:['삭제 뒤 왼쪽 개수2 < k3','왼쪽 건너뜀 · k←1','값7 선택']};
 });
 v['tree-traversal'].steps[1].graph=JSON.parse(JSON.stringify(v['tree-traversal'].steps[0].graph));
 v['tree-traversal'].steps[1].flow={label:'출력 시점',items:['전위: 진입 때 A,B,C','중위: 왼쪽 뒤 B,A,C','후위: 복귀 때 B,C,A','레벨: queue 순서 A,B,C']};
 v['array-rotation'].steps.slice(0,2).forEach(s=>s.flow={label:'왼쪽 2칸 회전 · 구간 이동',items:['source [2,5) → destination [0,3)','source [0,2) → destination [3,5)']});
 v['cpp-essentials'].steps.forEach((s,i)=>s.flow={label:'입력 cursor',items:i?['남은 개행 ignore','getline 시작: h','공백 포함 hello world']:['정수 4 추출','cursor → 남은 개행','바로 getline 하면 빈 줄']});
 v['simulation-phases'].steps.forEach((s,i)=>{s.flow={label:'읽기 → 다음 버퍼 → 한 번에 반영',items:['오늘[1]=0 → 내일[0]','오늘[0]=10 → 내일[1]',i?'완성 버퍼 [0,10] commit':'오늘 배열은 읽는 동안 보존']};});
 v['shortest-variants'].steps[1].flow={label:'상황 → 선택 기준',items:['비음수 · 한 출발: Dijkstra','음수 간선 · 한 출발: Bellman-Ford','모든 쌍 · 작은 V: Floyd-Warshall']};
 v['sqrt-decomposition'].steps.forEach((s,i)=>{
  if(i<2){s.flow={label:'B=4 · index별 블록',items:['[0,4) · [4,8) · [8,10)','마지막 블록은 원소 2개']};return;}
  s.flow={label:'[2,9) 질의 → 자투리와 요약 결합',items:i===2?['자투리 A[2], A[3]','전체 블록 [4,8) → 요약9','자투리 A[8]','max(1,6,9,7)=9']:['A[5] 9→0','블록 [4,8) 다시 읽기 → 5','max(1,6,5,7)=7']};
 });
}
window.VisualPrimitives={graph,sequence,flow,traversalGraph,trieGraph,fromTrace,enrichAdvanced};
window.ExampleVisuals={render,legend,mount(id,root){const v=visuals[id];if(!v)return;let index=0;
 root.innerHTML='<div class="lab-title"><div><p class="eyebrow">EXAMPLE WALKTHROUGH</p><h2>'+esc(v.title)+'</h2></div><span class="lab-badge">본문 예시</span></div><div class="example-frame"><p class="viz-legend"></p><div class="example-scene"></div><div class="example-note" aria-live="polite"><h3></h3><p></p></div><div class="example-controls"><button type="button" data-action="first">처음</button><button type="button" data-action="prev">이전</button><label>실행 단계 <input type="range" min="0" max="'+(v.steps.length-1)+'" value="0"></label><button type="button" data-action="next">다음 단계</button><button type="button" data-action="last">결과</button><span class="example-count"></span></div></div>';
 const draw=()=>{const s=v.steps[index];root.querySelector('.viz-legend').textContent=legend(s);root.querySelector('.example-scene').innerHTML=render(s);root.querySelector('.example-note h3').textContent=s.title;root.querySelector('.example-note p').textContent=s.note;root.querySelector('input').value=index;root.querySelector('.example-count').textContent=(index+1)+' / '+v.steps.length;for(const action of ['first','prev'])root.querySelector('[data-action="'+action+'"]').disabled=index===0;for(const action of ['last','next'])root.querySelector('[data-action="'+action+'"]').disabled=index===v.steps.length-1;};
 root.querySelectorAll('button').forEach(b=>b.onclick=()=>{index=b.dataset.action==='first'?0:b.dataset.action==='last'?v.steps.length-1:Math.max(0,Math.min(v.steps.length-1,index+(b.dataset.action==='next'?1:-1)));draw();});root.querySelector('input').oninput=e=>{index=+e.target.value;draw();};draw();
}};
})();
