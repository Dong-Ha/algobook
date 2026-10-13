(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
function sequence(text,positive=false){
 const parts=String(text).trim().split(/[\s,]+/).filter(Boolean);
 if(parts.length>9||positive&&!parts.length)throw Error('정수를 '+(positive?'1~9':'0~9')+'개 입력하세요.');
 if(parts.some(x=>!/^[-]?\d+$/.test(x)))throw Error('정수만 쉼표 또는 공백으로 구분해 주세요.');
 const a=parts.map(Number);
 if(a.some(x=>!Number.isSafeInteger(x)||Math.abs(x)>10000||positive&&x<=0))throw Error(positive?'작업량은 1~10000이어야 합니다.':'각 값은 −10000~10000이어야 합니다.');
 return a;
}
function pack(a,cap){
 const groups=[];let load=0,group=[];
 for(const x of a){if(x>cap)return {groups:[],days:Infinity};if(load+x>cap){groups.push(group);group=[];load=0;}group.push(x);load+=x;}
 if(group.length)groups.push(group);return {groups,days:groups.length};
}
function capacity(a,days){
 if(!a.length||a.length>9||a.some(x=>!Number.isInteger(x)||x<=0||x>10000))throw Error('양의 작업량 1~9개가 필요합니다.');
 if(!Number.isInteger(days)||days<1||days>9)throw Error('D는 1~9 정수여야 합니다.');
 const min=Math.max(...a),max=a.reduce((s,x)=>s+x,0),frames=[];let lo=min,hi=max;
 while(lo<hi){const mid=lo+Math.floor((hi-lo)/2),p=pack(a,mid),ok=p.days<=days,nextLo=ok?lo:mid+1,nextHi=ok?mid:hi;frames.push({lo,hi,mid,...p,ok,nextLo,nextHi,min,max,done:false});lo=nextLo;hi=nextHi;}
 frames.push({lo,hi,mid:lo,...pack(a,lo),ok:true,nextLo:lo,nextHi:hi,min,max,done:true});return {a:[...a],days,frames,result:lo};
}
function parseGrid(text){
 const g=String(text).trim().split(/\r?\n/).map(s=>s.trim());
 if(!g.length||g.length>5||!g[0].length||g[0].length>7||g.some(r=>r.length!==g[0].length||!/^[01]+$/.test(r)))throw Error('같은 길이의 0/1 행을 입력하세요 (1~5행, 1~7열).');
 return g;
}
function bfs(g){
 g=parseGrid(g.join('\n'));const n=g.length,m=g[0].length,dist=Array.from({length:n},()=>Array(m).fill(-1)),parent=Array.from({length:n},()=>Array(m).fill(null)),q=[],frames=[],done=[],path=[];
 const snapshot=(note,current=null,edge=null)=>frames.push(clone({dist,parent,queue:q,done,current,edge,path,note}));
 if(g[0][0]==='0'||g[n-1][m-1]==='0'){snapshot('출발점 또는 도착점이 벽이므로 도달할 수 없습니다.');return {g,frames,result:-1,path};}
 dist[0][0]=0;q.push([0,0]);snapshot('S를 큐에 넣습니다. dist[S]=0, 부모는 없습니다.');
 while(q.length){const [r,c]=q.shift();snapshot('('+r+','+c+')를 큐 앞에서 꺼냅니다. 거리 '+dist[r][c]+'인 칸의 이웃을 살핍니다.',[r,c]);
  for(const [dr,dc] of [[-1,0],[0,1],[1,0],[0,-1]]){const nr=r+dr,nc=c+dc;if(nr<0||nr>=n||nc<0||nc>=m||g[nr][nc]==='0'||dist[nr][nc]!==-1)continue;dist[nr][nc]=dist[r][c]+1;parent[nr][nc]=[r,c];q.push([nr,nc]);snapshot('('+nr+','+nc+') 첫 발견: 거리 '+dist[nr][nc]+', 부모 ('+r+','+c+'). 큐 뒤에 추가합니다.',[r,c],[[r,c],[nr,nc]]);}
  done.push([r,c]);
 }
 if(dist[n-1][m-1]!==-1){let at=[n-1,m-1];while(at){path.push(at);at=parent[at[0]][at[1]];}path.reverse();}
 snapshot(path.length?'전체 탐색 완료. T에서 parent를 따라 되짚고 뒤집으면 '+(path.length-1)+'회 이동 경로를 얻습니다.':'큐가 비었습니다. T의 거리가 −1이므로 도달할 수 없습니다.');return {g,frames,result:dist[n-1][m-1],path};
}
function lis(a){
 if(a.length>9||a.some(x=>!Number.isSafeInteger(x)||Math.abs(x)>10000))throw Error('−10000~10000 정수를 최대 9개 입력하세요.');
 const tails=[],tailIndex=[],parent=Array(a.length).fill(-1),frames=[];
 const snapshot=(i,pos,old,note,done=false)=>{const chain=[];let at=tailIndex.length?tailIndex[tailIndex.length-1]:-1;while(at!==-1){chain.push(at);at=parent[at];}chain.reverse();frames.push(clone({i,pos,old,tails,tailIndex,parent,chain,note,done}));};
 snapshot(-1,-1,null,'아직 처리한 원소가 없습니다. tails와 parent는 서로 다른 정보를 저장합니다.');
 for(let i=0;i<a.length;i++){let l=0,r=tails.length;while(l<r){const m=l+Math.floor((r-l)/2);if(tails[m]<a[i])l=m+1;else r=m;}const p=l,old=tails[p]??null;if(p>0)parent[i]=tailIndex[p-1];tails[p]=a[i];tailIndex[p]=i;snapshot(i,p,old,'a['+i+']='+a[i]+': 첫 tails ≥ '+a[i]+' 위치 '+p+'. '+(old===null?'새 길이 '+(p+1)+'을 추가합니다.':old+'을 '+a[i]+'로 교체합니다. 길이는 늘지 않습니다.'));}
 snapshot(a.length,-1,null,'입력 처리 완료. 마지막 길이의 tailIndex부터 parent를 역추적한 뒤 뒤집습니다.',true);const final=frames[frames.length-1];return {a:[...a],frames,result:final.chain.map(i=>a[i]),indices:final.chain};
}
root.LabModels={sequence,pack,capacity,parseGrid,bfs,lis};
})(window);
