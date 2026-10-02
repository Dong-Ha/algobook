const assert=require('node:assert/strict');
global.window={};for(const file of ['content','advanced','cases','service-cases','engines','visuals','visual-advanced'])require('./docs/'+file+'.js');
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
console.log(JSON.stringify({chapters:window.CHAPTERS.length,visualSteps:count,engineExamples:11,conceptDiagrams:conceptIds.length,lcsTable:'passed',status:'passed'}));
