const assert=require('node:assert/strict');
global.window={};for(const file of ['content','advanced','cases','service-cases','exercises','engines','visuals','visual-advanced'])require('./docs/'+file+'.js');
const visuals=window.EXAMPLE_VISUALS;
assert.deepEqual(Object.keys(visuals).sort(),window.CHAPTERS.map(c=>c.id).sort());
let count=0;
for(const c of window.CHAPTERS){const v=visuals[c.id];assert(v.title&&v.steps.length>=2,c.id);for(const s of v.steps){assert(s.title&&s.note,c.id);assert(s.rows?.some(r=>r.values.length)||s.graph?.nodes.length||s.grid?.values.length||s.intervals?.length,'Missing diagram: '+c.id);for(const r of s.rows||[]){assert(Array.isArray(r.values));for(const key of ['active','selected'])for(const i of r[key]||[])assert(Number.isInteger(i)&&i>=0&&i<r.values.length,c.id+' '+key+' '+i);}if(s.graph){const ids=new Set(s.graph.nodes.map(n=>n.id));assert.equal(ids.size,s.graph.nodes.length);for(const n of s.graph.nodes)assert(Number.isFinite(n.x)&&Number.isFinite(n.y));for(const e of s.graph.edges)assert(ids.has(e.from)&&ids.has(e.to),c.id);}if(s.grid){assert(s.grid.values.every(r=>r.length===s.grid.values[0].length));for(const key of ['active','selected'])for(const [r,col] of s.grid[key]||[])assert(s.grid.values[r]&&col>=0&&col<s.grid.values[r].length,c.id);}const html=window.ExampleVisuals.render(s);assert(!/undefined|NaN/.test(html),c.id);count++;}}
// Validate the actual engine input behind the worked examples against explicit outputs.
const trace=(id,patch={})=>window.AlgoEngine.trace(id,{...window.EXAMPLE_INPUTS[id],...patch}).at(-1);
assert.deepEqual(trace('sort').a,[-1,-1,2,3,3]);assert.equal(trace('prefix').result,3);assert.deepEqual(trace('twopointer').result,[-1,8]);assert.equal(trace('binary').result,1);assert.equal(trace('binary',{target:10}).result,5);assert.deepEqual(trace('dfs').order,[1,2,4,3]);assert.deepEqual(trace('bfs').dist.slice(1),[0,1,1,2]);assert.equal(trace('dp').result,2);assert.equal(trace('trie').result,false);assert.equal(trace('trie',{mode:'prefix'}).result,true);assert.deepEqual(trace('backtrack').answers.map(a=>a.join(',')).sort(),['1,2','3']);

// Independently check path-based diagrams and selected subsequences, not only markup.
const allRows=id=>visuals[id].steps.flatMap(s=>s.rows||[]);
const hasValues=(id,expected)=>assert(allRows(id).some(r=>JSON.stringify(r.values)===JSON.stringify(expected)),id+' must show '+JSON.stringify(expected));
hasValues('stl',[4,7]);hasValues('math',[6,0]);assert(allRows('stl-performance').some(r=>r.values.length===5&&r.values[3]===8&&r.values[4]===9),'nth_element boundary must hold second-largest value');hasValues('monotonic-stack',[4,2,4,-1,-1]);hasValues('array-rotation',[3,4,5,1,2]);hasValues('dp-patterns',[0,0,4,5,5]);
const lcsRows=visuals.lcs.steps.flatMap(s=>s.rows||[]).filter(r=>r.values.join('')==='ABCBDAB'||r.values.join('')==='BDCABA');
for(const r of lcsRows){const highlighted=r.active||r.selected;if(highlighted?.length)assert.equal(highlighted.map(i=>r.values[i]).join(''),'BCBA','Highlighted LCS letters must match in both strings');}
const conceptIds=['state-model','local-update','candidate-filter','path-algebra','path-sensitivity','resource-state','bitset-cost','ordered-index','lazy-validity','order-statistics'];
const rowValues=(id,label)=>allRows(id).find(r=>r.label===label)?.values;
for(const id of conceptIds)assert(visuals[id].steps.every(s=>s.title&&s.note),id+' concept visualization must have an explanation per step');
assert.deepEqual(rowValues('state-model','조회 42'),[-1]);
assert.deepEqual(rowValues('local-update','변경 배열'),[6,3,4]);assert.deepEqual(rowValues('local-update','새 인접 합'),[9,7]);
assert.deepEqual(rowValues('candidate-filter','최종 결과'),[0]);
assert.deepEqual(rowValues('path-algebra','각 경로 품질'),[6,5]);assert.deepEqual(rowValues('path-algebra','선택 품질'),[6]);
assert.deepEqual(rowValues('path-sensitivity','다른 간선 삭제 후 최적값'),[7]);
assert.deepEqual(rowValues('resource-state','비용'),[4,5]);assert.deepEqual(rowValues('resource-state','자원'),[1,3]);
assert.deepEqual(rowValues('bitset-cost','차이 수'),[2]);
assert.deepEqual(rowValues('ordered-index','새 정렬 키'),['(1,2)','(3,0)']);
assert.deepEqual(rowValues('lazy-validity','유효 판정'),[false]);
assert.deepEqual(rowValues('order-statistics','개수'),[2]);

const a='ABCBDAB',b='BDCABA',dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
const lcsGrid=visuals.lcs.steps.find(s=>s.grid?.values.length===9)?.grid;assert(lcsGrid,'LCS must show the whole DP table');assert.deepEqual(lcsGrid.values.slice(1).map(r=>r.slice(1)),dp);assert.deepEqual(lcsGrid.values[0].slice(2),[...b]);assert.deepEqual(lcsGrid.values.slice(2).map(r=>r[0]),[...a]);assert.deepEqual(visuals.lcs.steps.find(s=>s.title.includes('마지막')).grid.selected,[[1,7]]);
// Verify supplemental transitions with independent small calculations.
const scene=(id,title)=>{const s=visuals[id].steps.find(s=>s.title===title);assert(s,id+' '+title);return s;};
const vals=(s,label)=>{const r=s.rows.find(r=>r.label===label);assert(r,label);return r.values;};

const sqBefore=scene('sqrt-decomposition','질의 [2,9): 자투리와 완전 블록'),sqAfter=scene('sqrt-decomposition','최대 원소 감소: 블록 재계산');
const input=vals(sqBefore,'배열'),updated=vals(sqAfter,'변경 배열');
for(const [s,a,label] of [[sqBefore,input,'블록 최대'],[sqAfter,updated,'새 블록 최대']]){
 assert.deepEqual(vals(s,label),[0,4,8].map(l=>Math.max(...a.slice(l,l+4))));
 assert.equal(Math.max(...vals(s,s===sqBefore?'읽은 요약':'질의 후보')),Math.max(...a.slice(2,9)));
}
const countWays=(ordered)=>{const d=[1,0,0,0];if(ordered){for(let x=1;x<=3;x++)for(const c of [1,2])if(x>=c)d[x]+=d[x-c];}else{for(const c of [1,2])for(let x=c;x<=3;x++)d[x]+=d[x-c];}return d;};
const counts=scene('dp-patterns','조합과 순서 있는 경우의 수');
assert.deepEqual(vals(counts,'조합 DP'),countWays(false));assert.deepEqual(vals(counts,'순서 있는 DP'),countWays(true));
const bitUnion=scene('bitset-cost','OR는 합집합, AND는 중복');
const aa=vals(bitUnion,'A bits · 왼쪽부터 3,2,1,0'),bb=vals(bitUnion,'B bits · 왼쪽부터 3,2,1,0');
assert.deepEqual(vals(bitUnion,'OR'),aa.map((x,i)=>Number(Boolean(x||bb[i]))));
assert.deepEqual(vals(bitUnion,'AND'),aa.map((x,i)=>Number(Boolean(x&&bb[i]))));
assert.equal(vals(bitUnion,'합집합 개수')[0],vals(bitUnion,'OR').reduce((a,b)=>a+b,0));
const same=scene('lcs','문자가 같음: 대각선 + 1').grid,different=scene('lcs','문자가 다름: 위·왼쪽 max').grid;
assert.equal(same.values[4][4],same.values[3][3]+1);assert.deepEqual(same.selected,[[3,3]]);
assert.equal(different.values[4][5],Math.max(different.values[3][5],different.values[4][4]));assert.deepEqual(different.selected,[[3,5],[4,4]]);
const lcaTable=scene('lca','2의 거듭제곱 조상 표');assert.deepEqual(vals(lcaTable,'up[k][8]'),[1,2,4,8].map(j=>Math.max(1,8-j)));
const kth=scene('order-statistics','개수로 k번째 찾기'),deleted=scene('order-statistics','삭제와 중복 순위');
for(const [s,label]of [[kth,'빈도'],[deleted,'갱신 빈도']]){let sum=0;const cumulative=vals(s,label).map(x=>sum+=x);assert.deepEqual(vals(s,s===kth?'누적 개수':'갱신 누적 개수'),cumulative);}
const sortedAfter=[2,4,7];assert.deepEqual(vals(deleted,'rank(4) · select(3)'),[sortedAfter.filter(x=>x<4).length,sortedAfter[2]]);
assert(window.MIXED.every(q=>!window.CHAPTERS.some(c=>c.quiz.q===q.q)),'Mixed practice must use independent questions');
console.log(JSON.stringify({chapters:window.CHAPTERS.length,visualSteps:count,engineExamples:11,conceptDiagrams:conceptIds.length,lcsTable:'passed',status:'passed'}));
