(function (root) {
"use strict";
const copy=x=>JSON.parse(JSON.stringify(x));
function numbers(text,max=14) {
 const xs=String(text).trim().split(/[\s,]+/).filter(Boolean);
 if(!xs.length||xs.length>max) throw Error('정수를 1~'+max+'개 입력하세요.');
 if(xs.some(x=>! /^-?\d+$/.test(x))) throw Error('정수만 쉼표 또는 공백으로 구분해 주세요.');
 const a=xs.map(Number);
 if(a.some(x=>!Number.isSafeInteger(x)||Math.abs(x)>10000)) throw Error('각 값은 −10000~10000 정수로 입력하세요.');
 return a;
}
function integer(x,min,max,label) {
 if(!/^-?\d+$/.test(String(x).trim())) throw Error(label+'을(를) 정수로 입력하세요.');
 const n=Number(x);
 if(n<min||n>max) throw Error(label+'은(는) '+min+'~'+max+' 범위입니다.');
 return n;
}
function trace(kind, input) {
 const frames=[]; const push=s=>frames.push(copy(s));
 if(kind==='dfs'||kind==='bfs') {
  const n=integer(input.n,2,10,'정점 수'), start=integer(input.start,1,n,'시작점');
  const raw=String(input.edges).trim();
  const edges=[], seen=new Set(), adj=Array.from({length:n+1},()=>[]);
  if(raw) for(const line of raw.split(/[\n;]+/)) {
   const p=line.trim().split(/[\s,]+/);
   if(p.length!==2) throw Error('간선은 한 줄에 두 정점으로 입력하세요. 예: 1 2');
   const a=integer(p[0],1,n,'간선 정점'),b=integer(p[1],1,n,'간선 정점');
   const id=[Math.min(a,b),Math.max(a,b)].join('-');
   if(!seen.has(id)){seen.add(id);edges.push([a,b]);adj[a].push(b);if(a!==b)adj[b].push(a);}
  }
  adj.forEach(a=>a.sort((a,b)=>a-b));
  const s={kind,n,edges,current:null,edge:null,stack:[],queue:[],visited:[],done:[],order:[],dist:Array(n+1).fill(null),tree:[],note:'시작점 '+start+'에서 탐색합니다. 이웃은 번호가 작은 순서입니다.',line:0};
  push(s);
  if(kind==='dfs') {
   function go(v,parent) {
    s.stack.push(v);s.visited.push(v);s.order.push(v);s.current=v;s.edge=parent?[parent,v]:null;
    if(parent)s.tree.push([parent,v]);
    s.note=v+'에 진입하고 방문 표시합니다. 호출 스택 깊이 '+s.stack.length+'.';s.line=3;push(s);
    for(const u of adj[v]){
     s.current=v;s.edge=[v,u];
     if(s.visited.includes(u)){s.note=u+'은(는) 이미 방문했습니다. 재귀 호출하지 않습니다.';s.line=6;push(s);}
     else {s.note=v+'에서 미방문 이웃 '+u+'로 내려갑니다. '+v+'의 남은 일은 스택에서 기다립니다.';s.line=6;push(s);go(u,v);}
    }
    s.done.push(v);s.stack.pop();s.current=s.stack.length?s.stack[s.stack.length-1]:null;s.edge=null;
    s.note=v+'의 모든 이웃을 확인했습니다. '+(s.current?s.current+' 호출로 돌아갑니다.':'시작점 호출이 끝났습니다.');s.line=8;push(s);
   }
   go(start,null);
  } else {
   s.queue=[start];s.visited=[start];s.dist[start]=0;s.note='시작점 '+start+'의 거리를 0으로 기록하고 큐에 넣습니다.';s.line=3;push(s);
   while(s.queue.length){
    const v=s.queue.shift();s.current=v;s.order.push(v);s.edge=null;s.note='큐 맨 앞의 '+v+'을(를) 꺼냅니다. 거리 '+s.dist[v]+'.';s.line=5;push(s);
    for(const u of adj[v]){
     s.edge=[v,u];
     if(s.dist[u]!==null){s.note=u+'은(는) 이미 발견했습니다. 중복 삽입하지 않습니다.';s.line=7;push(s);}
     else {s.dist[u]=s.dist[v]+1;s.visited.push(u);s.queue.push(u);s.tree.push([v,u]);s.note=u+'을(를) 처음 발견: 거리 '+s.dist[u]+'. 큐에 넣기 전에 방문 처리합니다.';s.line=8;push(s);}
    }
    s.done.push(v);
   }
  }
  s.current=null;s.edge=null;s.line=0;
  const rest=Array.from({length:n},(_,i)=>i+1).filter(v=>!s.visited.includes(v));
  s.note=rest.length?'탐색 종료. '+rest.join(', ')+'은(는) 시작점과 연결되지 않아 미방문입니다.':'탐색 종료. 시작점에서 모든 정점에 도달했습니다.';push(s);
 } else if(kind==='trie') {
  const words=String(input.words).trim().split(/[\s,]+/).filter(Boolean);
  if(!words.length||words.length>8||words.some(w=>!/^[a-z]{1,8}$/.test(w)))throw Error('a~z 소문자 단어를 1~8개, 단어당 1~8글자로 입력하세요.');
  const mode=input.mode||'insert', query=String(input.query||'').trim();
  if(!['insert','word','prefix'].includes(mode))throw Error('올바른 검색 방식을 선택하세요.');
  if(mode!=='insert'&&!/^[a-z]{1,8}$/.test(query))throw Error('검색어는 a~z 소문자 1~8글자입니다.');
  const nodes=[{id:0,parent:null,ch:'',prefix:'',end:false}], children=[{}];
  const s={kind,nodes,current:0,path:[0],word:'',mode,query,note:'루트는 빈 접두사입니다. 별표는 단어의 끝을 나타냅니다.',line:0};
  if(mode==='insert')push(s);
  for(const word of words) {
   let v=0;s.word=word;s.current=0;s.path=[0];s.note='"'+word+'" 삽입 시작. 루트로 돌아옵니다.';s.line=8;if(mode==='insert')push(s);
   for(const ch of word) {
    let added=false;
    if(children[v][ch]===undefined){const id=nodes.length;children[v][ch]=id;nodes.push({id,parent:v,ch,prefix:nodes[v].prefix+ch,end:false});children.push({});added=true;}
    v=children[v][ch];s.current=v;s.path.push(v);
    s.note=added?'"'+nodes[v].prefix+'" 접두사 노드를 새로 만듭니다.':'"'+nodes[v].prefix+'"는 기존 경로를 공유합니다.';
    s.line=added?11:16;if(mode==='insert')push(s);
   }
   nodes[v].end=true;s.note='"'+word+'"의 마지막 노드에 단어 종료 표시 ★를 남깁니다.';s.line=18;if(mode==='insert')push(s);
  }
  if(mode==='insert'){s.note='삽입 완료. 같은 접두사는 같은 경로를 공유하고, ★만 실제 단어의 끝입니다.';s.line=0;push(s);}
  else {
   let v=0;s.current=0;s.path=[0];s.word=query;s.note='단어들을 삽입한 상태에서 "'+query+'" '+(mode==='word'?'완전 일치':'접두사')+' 검색을 시작합니다.';s.line=21;push(s);
   for(const ch of query){
    if(children[v][ch]===undefined){s.note='"'+nodes[v].prefix+'"에서 "'+ch+'" 간선이 없습니다. 검색 결과: 거짓.';s.result=false;s.line=24;push(s);return frames;}
    v=children[v][ch];s.current=v;s.path.push(v);s.note='"'+nodes[v].prefix+'"까지의 경로가 존재합니다. 아직 단어 종료 여부와는 별개입니다.';s.line=25;push(s);
   }
   s.result=mode==='prefix'||nodes[v].end;s.line=27;
   s.note='결과: '+(s.result?'참':'거짓')+'. '+(mode==='prefix'?'모든 문자의 경로가 존재하므로 접두사입니다.':nodes[v].end?'마지막 노드에 ★가 있으므로 삽입된 단어입니다.':'경로는 있지만 ★가 없어 완전한 단어가 아닙니다.');push(s);
  }
 } else {
  const a=numbers(input.array,kind==='backtrack'?6:kind==='dp'?8:14);
  const s={kind,a:[...a],active:[],discard:[],note:'입력을 확인하고 초기 상태를 만듭니다.',line:0};
  if(['twopointer','binary','backtrack'].includes(kind))s.target=integer(input.target,-20000,20000,'목표값');
  if(kind==='sort'){
   s.sorted=1;push(s);
   for(let i=1;i<a.length;i++){
    s.active=[i];s.note=i+'번 원소를 왼쪽 정렬 구간의 알맞은 자리에 넣습니다.';push(s);
    let j=i;
    while(j>0&&s.a[j-1]>s.a[j]){[s.a[j-1],s.a[j]]=[s.a[j],s.a[j-1]];s.active=[j-1,j];s.note='순서가 뒤집힌 이웃을 교환합니다.';push(s);j--;}
    s.sorted=i+1;s.active=[j];s.note='앞의 '+s.sorted+'개 원소가 정렬되었습니다.';push(s);
   }
   s.active=[];s.note='삽입 정렬 완료. 동일한 값이 이웃합니다. 이 시각화는 O(N²), 본문의 std::sort는 O(N log N)입니다.';push(s);
  }
  if(kind==='prefix'){
   const l=integer(input.l,0,a.length,'l'),r=integer(input.r,0,a.length,'r');
   if(l>r)throw Error('반열린 구간은 l ≤ r이어야 합니다.');
   s.p=Array(a.length+1).fill(null);s.p[0]=0;s.l=l;s.r=r;push(s);
   for(let i=0;i<a.length;i++){s.p[i+1]=s.p[i]+a[i];s.active=[i];s.note='p['+(i+1)+'] = p['+i+'] + a['+i+'] = '+s.p[i]+' + ('+a[i]+') = '+s.p[i+1];s.line=3;push(s);}
   s.active=Array.from({length:r-l},(_,i)=>l+i);s.result=s.p[r]-s.p[l];s.note='['+l+','+r+')의 합 = p['+r+'] − p['+l+'] = '+s.p[r]+' − ('+s.p[l]+') = '+s.result;s.line=5;push(s);
  }
  if(kind==='twopointer'){
   s.a.sort((a,b)=>a-b);let l=0,r=a.length-1;s.l=l;s.r=r;
   s.note='정렬 후 양 끝에서 시작합니다. 정렬 비용도 전체 복잡도에 포함됩니다.';s.line=2;push(s);
   let found=false;
   while(l<r){
    s.l=l;s.r=r;s.active=[l,r];s.sum=s.a[l]+s.a[r];s.line=5;
    s.note=s.a[l]+' + '+s.a[r]+' = '+s.sum+'. 목표는 '+s.target+'.';push(s);
    if(s.sum===s.target){found=true;s.result=[s.a[l],s.a[r]];s.note='목표 합을 찾았습니다. 서로 다른 두 위치입니다.';s.line=6;push(s);break;}
    if(s.sum<s.target){s.note='합이 작습니다. 현재 왼쪽 값은 남은 최댓값과 더해도 부족하므로 버립니다.';s.discard.push(l);s.line=7;l++;}
    else{s.note='합이 큽니다. 현재 오른쪽 값은 남은 최솟값과 더해도 넘치므로 버립니다.';s.discard.push(r);s.line=8;r--;}
    push(s);
   }
   if(!found){s.active=[];s.l=l;s.r=r;s.result=false;s.note='서로 다른 두 위치가 남지 않았습니다. 조건을 만족하는 쌍이 없습니다.';s.line=10;push(s);}
  }
  if(kind==='binary'){
   s.a.sort((a,b)=>a-b);let l=0,r=a.length;s.l=l;s.r=r;s.note='오름차순으로 정렬합니다. a[i] ≥ K인 첫 위치를 찾습니다.';s.line=2;push(s);
   while(l<r){
    const m=l+Math.floor((r-l)/2);s.l=l;s.r=r;s.m=m;s.active=[m];s.line=4;s.note='미확정 구간 ['+l+','+r+'), mid='+m+', 값='+s.a[m]+'.';push(s);
    if(s.a[m]<s.target){s.note='mid의 값이 K 미만이므로 mid까지 제외합니다. l=mid+1.';s.line=5;l=m+1;}
    else {s.note='mid는 답일 수 있으므로 경계 후보로 남깁니다. r=mid.';s.line=6;r=m;}
    s.l=l;s.r=r;s.discard=Array.from({length:a.length},(_,i)=>i).filter(i=>i<l||i>=r);push(s);
   }
   s.active=l<a.length?[l]:[];s.result=l;s.note='l=r='+l+'. '+(l===a.length?'K 이상인 원소가 없어 N을 반환합니다.':'K 이상인 첫 값은 '+s.a[l]+'입니다.');s.line=8;push(s);
  }
  if(kind==='backtrack'){
   s.stack=[];s.chosen=[];s.answers=[];s.sum=0;push(s);
   function go(i,sum,chosen,reason){
    s.stack.push({i,sum,chosen:[...chosen]});s.sum=sum;s.chosen=[...chosen];s.active=i<a.length?[i]:[];s.note=reason+' go('+i+','+sum+') 진입.';s.line=3;push(s);
    if(i===a.length){
     if(sum===s.target){s.answers.push(chosen.map(j=>a[j]));s.note='목표 합입니다. 현재 선택을 답으로 저장합니다.';s.line=5;}
     else{s.note='모든 선택이 끝났지만 합 '+sum+'은(는) 목표와 다릅니다.';s.line=4;}push(s);
    } else{
     go(i+1,sum,chosen,a[i]+'을(를) 선택하지 않고');
     go(i+1,sum+a[i],[...chosen,i],a[i]+'을(를) 선택하고');
    }
    s.stack.pop();const parent=s.stack[s.stack.length-1];s.chosen=parent?[...parent.chosen]:[];s.sum=parent?parent.sum:0;s.active=parent&&parent.i<a.length?[parent.i]:[];s.note='go('+i+','+sum+') 종료. 호출자 상태로 복구합니다.';s.line=11;push(s);
   }
   go(0,0,[],'시작:');s.active=[];s.chosen=[];s.sum=0;s.note='완전탐색 종료. 합이 목표인 위치 부분집합 '+s.answers.length+'개를 찾았습니다. 중복 값 입력 시 위치별로 셉니다.';s.line=0;push(s);
  }
  if(kind==='dp'){
   if(a.some(x=>x<=0))throw Error('동전은 양의 정수여야 합니다.');
   const target=integer(input.target,0,24,'목표 금액');
   s.target=target;s.dp=Array(target+1).fill(null);s.dp[0]=0;s.x=0;s.coin=null;s.from=null;s.note='dp[0]=0, 다른 금액은 아직 불가능(∞)입니다.';s.line=3;push(s);
   for(let x=1;x<=target;x++){
    s.x=x;
    for(const c of a){
     s.coin=c;s.from=x-c;s.active=[a.indexOf(c)];
     if(c>x){s.note='금액 '+x+'보다 동전 '+c+'이 커서 사용할 수 없습니다.';s.line=6;push(s);continue;}
     if(s.dp[x-c]===null){s.note='금액 '+(x-c)+'를 만들 수 없어 동전 '+c+' 후보를 제외합니다.';s.line=6;push(s);continue;}
     const candidate=s.dp[x-c]+1,old=s.dp[x];
     s.candidate=candidate;s.old=old;
     s.dp[x]=old===null?candidate:Math.min(old,candidate);
     s.note='dp['+(x-c)+']+1 = '+candidate+'. dp['+x+'] '+(old===null?'∞':old)+' → '+s.dp[x]+'. 마지막 동전 '+c+'을(를) 비교합니다.';s.line=7;push(s);
    }
   }
   s.result=s.dp[target]===null?-1:s.dp[target];s.active=[];s.from=null;s.coin=null;s.note=s.result===-1?'목표 금액을 만들 수 없습니다. 결과 −1.':'최소 동전 개수는 '+s.result+'개입니다.';s.line=8;push(s);
  }
 }
 return frames;
}
root.AlgoEngine={trace,numbers,integer};
})(typeof window!=='undefined'?window:globalThis);

