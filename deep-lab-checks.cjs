/* Compare the displayed lab models with independent exhaustive reference solvers. */
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), cp = require('node:child_process');
const os = require('node:os'), path = require('node:path');
const html = fs.readFileSync('docs/visual-study.html', 'utf8');
const source = fs.readFileSync('docs/example-models.js', 'utf8');
const sandbox = { window: {} }; vm.runInNewContext(source, sandbox);
const M = sandbox.window.LabModels;
const plain = x => JSON.parse(JSON.stringify(x));
let seed = 13026, cases = 0;
const rand = n => { seed = (Math.imul(seed,1664525)+1013904223)>>>0; return seed%n; };
// Enumerate all contiguous partitions, without using the greedy feasibility predicate.
function capacityOracle(a, days) {
 let best = Infinity;
 for(let mask=0; mask<(1<<(a.length-1)); mask++) {
  let used=1, sum=0, peak=0;
  for(let i=0;i<a.length;i++) { sum+=a[i]; if(i===a.length-1 || mask&(1<<i)) { peak=Math.max(peak,sum); sum=0; if(i<a.length-1)used++; } }
  if(used<=days)best=Math.min(best,peak);
 }
 return best;
}
const cppCases=[];
for(let z=0;z<240;z++) {
 const a=Array.from({length:1+rand(8)},()=>1+rand(30)),days=1+rand(9),want=capacityOracle(a,days),got=M.capacity(a,days);
 assert.equal(got.result,want); cppCases.push({a,days,want});
 for(const f of got.frames) {
  assert(f.lo<=want&&want<=f.hi); assert.deepEqual(plain(f.groups.flat()),a);
  assert(f.groups.every(g=>g.reduce((s,x)=>s+x,0)<=f.mid));
  if(!f.done)assert(f.nextHi-f.nextLo<f.hi-f.lo);
 } cases++;
}
assert.equal(M.capacity([7,2,5,10,8],2).result,18);
assert.equal(M.pack([10],9).days,Infinity);
assert.throws(()=>M.capacity([],2));assert.throws(()=>M.capacity([1],0));
assert.throws(()=>M.sequence('1, NaN'));assert.throws(()=>M.sequence('0',true));
assert.throws(()=>M.sequence('10001'));assert.throws(()=>M.sequence('<svg>'));
assert.deepEqual(plain(M.sequence('')),[]);
// Floyd-Warshall over the cell graph is independent of queue discovery/parents.
function gridOracle(g) {
 const n=g.length,m=g[0].length,N=n*m,D=Array.from({length:N},()=>Array(N).fill(Infinity));
 for(let r=0;r<n;r++)for(let c=0;c<m;c++)if(g[r][c]==='1') {
  const u=r*m+c;D[u][u]=0;
  for(let rr=0;rr<n;rr++)for(let cc=0;cc<m;cc++)if(g[rr][cc]==='1'&&Math.abs(rr-r)+Math.abs(cc-c)===1)D[u][rr*m+cc]=1;
 }
 for(let k=0;k<N;k++)for(let i=0;i<N;i++)for(let j=0;j<N;j++)D[i][j]=Math.min(D[i][j],D[i][k]+D[k][j]);
 return D[0].map(x=>Number.isFinite(x)?x:-1);
}
const grids=[['1110','0101','1111'],['1'],['0']];
for(let mask=0;mask<64;mask++)grids.push([0,1].map(r=>[0,1,2].map(c=>(mask&(1<<(r*3+c)))?'1':'0').join('')));
for(let z=0;z<80;z++)grids.push(Array.from({length:3},()=>Array.from({length:4},()=>rand(3)?'1':'0').join('')));
for(const g of grids){
 const want=gridOracle(g),got=M.bfs(g),n=g.length,m=g[0].length;
 assert.equal(got.result,want.at(-1));
 if(g[0][0]==='1'&&g[n-1][m-1]==='1')assert.deepEqual(plain(got.frames.at(-1).dist.flat()),want);
 for(const f of got.frames){
  assert.equal(new Set(f.queue.map(p=>p.join(','))).size,f.queue.length);
  const ds=f.queue.map(([r,c])=>f.dist[r][c]);assert(ds.every((d,i)=>i===0||d>=ds[i-1]));
  for(let r=0;r<n;r++)for(let c=0;c<m;c++)if(f.parent[r][c]){const [pr,pc]=f.parent[r][c];assert.equal(Math.abs(r-pr)+Math.abs(c-pc),1);assert.equal(f.dist[r][c],f.dist[pr][pc]+1);}
 }
 if(got.result>=0){assert.equal(got.path.length,got.result+1);assert.deepEqual(plain(got.path[0]),[0,0]);assert.deepEqual(plain(got.path.at(-1)),[n-1,m-1]);}
 cases++;
}
for(const bad of ['', '12', '11\n1', '11111111','1\n1\n1\n1\n1\n1'])assert.throws(()=>M.parseGrid(bad));
// Enumerate all subsets in original order to verify strict LIS length and reconstruction.
function lisOracle(a){let best=0;for(let mask=0;mask<(1<<a.length);mask++){const b=a.filter((_,i)=>mask&(1<<i));if(b.every((x,i)=>!i||b[i-1]<x))best=Math.max(best,b.length);}return best;}
for(const a of [[],[3,5,6,2,4],[2,2,2],[9,8,7],[-10000,0,10000],...Array.from({length:240},()=>Array.from({length:rand(10)},()=>rand(13)-6))]){
 const d=M.lis(a);assert.equal(d.result.length,lisOracle(a));assert(d.indices.every((v,i)=>!i||d.indices[i-1]<v));assert(d.result.every((v,i)=>!i||d.result[i-1]<v));assert.deepEqual(plain(d.indices.map(i=>a[i])),plain(d.result));
 for(const f of d.frames){const count=Math.min(f.i+1,a.length);assert.equal(f.tails.length,lisOracle(a.slice(0,count)));for(let i=0;i<count;i++)if(f.parent[i]>=0){assert(f.parent[i]<i);assert(a[f.parent[i]]<a[i]);}}
 cases++;
}
const counter=M.lis([3,5,6,2,4]);assert.deepEqual(plain(counter.frames.at(-1).tails),[2,4,6]);assert.deepEqual(plain(counter.result),[3,5,6]);
// Compile the exact new C++ snippet shown in the HTML, including its early cap rejection.
sandbox.window.WorkedExamples={catalogue:{binary:[], 'grid-search':[], lis:[]}};
vm.runInNewContext(fs.readFileSync('docs/worked-details.js','utf8'),sandbox);
const displayed=sandbox.window.WorkedExamples.catalogue.binary[0].detail;
assert.equal(displayed,html.match(/<details class="code">[\s\S]*?<\/details>/)[0],'Static and main-page C++ must match');
const snippet=displayed.match(/<pre><code>([\s\S]*?)<\/code>/)[1].replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'algobook-deep-'));
try {
 const assertions=cppCases.map(({a,days,want})=>'assert(minimumCapacity({'+a.join(',')+'},'+days+')=='+want+');').join('\n');
 fs.writeFileSync(path.join(dir,'test.cpp'),'#include <bits/stdc++.h>\nusing namespace std;\n'+snippet+'\nint main(){assert(!feasible({10},1,9));\n'+assertions+'\n}');
 cp.execFileSync('g++',['-std=c++17','-O2',path.join(dir,'test.cpp'),'-o',path.join(dir,'test')]);cp.execFileSync(path.join(dir,'test'));
} finally {fs.rmSync(dir,{recursive:true,force:true});}
assert(!/\bfetch\s*\(|\bXMLHttpRequest\b/.test(source),'Example models must remain local');
console.log(JSON.stringify({independentCases:cases,displayedCppCases:cppCases.length,status:'passed'}));
