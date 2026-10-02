const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),os=require('node:os'),path=require('node:path');
global.window={};vm.runInThisContext(fs.readFileSync('docs/engines.js','utf8'));for(const file of ['content','advanced','cases','service-cases','exercises'])vm.runInThisContext(fs.readFileSync('docs/'+file+'.js','utf8'));
const {trace}=window.AlgoEngine,cs=window.CHAPTERS;
const last=(kind,input)=>trace(kind,input).at(-1);
let tests=0;const eq=(a,b)=>{assert.deepEqual(a,b);tests++};
let seed=518;const rng=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};
for(let z=0;z<150;z++){
 const a=Array.from({length:1+rng(10)},()=>rng(21)-10),k=rng(31)-15,sorted=[...a].sort((a,b)=>a-b),input={array:a.join(','),target:k};
 eq(last('sort',input).a,sorted);
 const expected=a.some((x,i)=>a.some((y,j)=>i<j&&x+y===k)),t=last('twopointer',input);
 eq(t.result!==false,expected);if(expected)eq(t.result[0]+t.result[1],k);
 let index=sorted.findIndex(x=>x>=k);if(index<0)index=sorted.length;
 eq(last('binary',input).result,index);
 const l=rng(a.length+1),r=l+rng(a.length-l+1);
 eq(last('prefix',{array:a.join(','),l,r}).result,a.slice(l,r).reduce((s,x)=>s+x,0));
 const coins=[1+rng(5),1+rng(5)],target=rng(15),queue=[[0,0]],visited=new Set([0]);let ans=-1;
 while(queue.length){const [x,d]=queue.shift();if(x===target){ans=d;break;}for(const c of coins)if(x+c<=target&&!visited.has(x+c)){visited.add(x+c);queue.push([x+c,d+1]);}}
 eq(last('dp',{array:coins.join(','),target}).result,ans);
 if(z<40){
  const b=a.slice(0,5),frames=trace('backtrack',{array:b.join(','),target:k});
  let count=0;for(let mask=0;mask<(1<<b.length);mask++){let sum=0;for(let i=0;i<b.length;i++)if(mask&(1<<i))sum+=b[i];if(sum===k)count++;}
  eq(frames.at(-1).answers.length,count);
  for(const f of frames)eq(f.chosen.reduce((s,i)=>s+b[i],0),f.sum);
 }
}
for(let z=0;z<45;z++){
 const n=2+rng(8),start=1+rng(n),adj=Array.from({length:n+1},()=>[]),edges=[];
 for(let a=1;a<=n;a++)for(let b=a+1;b<=n;b++)if(rng(4)===0){edges.push([a,b]);adj[a].push(b);adj[b].push(a);}
 const order=[],seen=new Set();function dfs(v){seen.add(v);order.push(v);for(const u of adj[v])if(!seen.has(u))dfs(u);}dfs(start);
 const input={n,start,edges:edges.map(x=>x.join(' ')).join('\n')},df=trace('dfs',input);
 eq(df.at(-1).order,order);eq(df.at(-1).stack,[]);
 const dist=Array(n+1).fill(null),q=[start];dist[start]=0;while(q.length){const v=q.shift();for(const u of adj[v])if(dist[u]===null){dist[u]=dist[v]+1;q.push(u);}}
 eq(last('bfs',input).dist,dist);
 for(const f of df){eq(new Set(f.stack).size,f.stack.length);eq(f.stack.every(v=>f.visited.includes(v)),true);}
}
for(const words of [['cat','car','cart','dog'],['a','ab','abc'],['x','x','y']]){
 for(const query of ['a','ab','abc','ca','cat','car','can','x','dog','z']){
  eq(last('trie',{words:words.join(','),query,mode:'word'}).result,words.includes(query));
  eq(last('trie',{words:words.join(','),query,mode:'prefix'}).result,words.some(w=>w.startsWith(query)));
 }
 const f=last('trie',{words:words.join(','),mode:'insert'});eq(f.nodes.filter(n=>n.end).length,new Set(words).size);
}
for(const [kind,input] of [['dfs',{n:2,start:3,edges:''}],['trie',{words:'CAT',mode:'insert'}],['dp',{array:'0,1',target:3}],['prefix',{array:'1,2',l:2,r:1}],['sort',{array:'1,hello'}]]){
 assert.throws(()=>trace(kind,input));tests++;
}
eq(cs.length,45);eq(new Set(cs.map(c=>c.id)).size,cs.length);assert(window.MIXED.length>=15);eq(cs.filter(c=>c.lab).length,9);
for(const c of cs){assert(c.code&&c.sections.length>=3&&c.quiz.options[c.quiz.answer]);for(const field of ['id','title','part','short','tag','lead','problem','example','invariant','trap','complexity'])assert(typeof c[field]==='string'&&c[field].length);for(const field of ['prompt','expected','why'])assert(typeof c.exercise?.[field]==='string'&&c.exercise[field].length,c.id+' exercise '+field);assert(c.check.length>=3&&c.quiz.why&&c.quiz.answer>=0&&c.quiz.answer<c.quiz.options.length);tests++;}
// Compile the actual displayed snippets inside explicit input contexts.
const pieces={
 thinking:cs.find(c=>c.id==='thinking').code+'\nvoid test(){assert(hasPair({4,1,7,3},10));assert(!hasPair({5},10));}',
 stl:'void test(){vector<int> a={4,1,7,3};int k=2;'+cs.find(c=>c.id==='stl').code+'\nassert(pq.top()==4);}',
 sort:'void test(){vector<int> a={3,-1,3,2,-1};'+cs.find(c=>c.id==='sort').code+'\nassert(counts.size()==3 && counts[0].second==2);}',
 prefix:'void test(){vector<int> a={3,-2,5,1};'+cs.find(c=>c.id==='prefix').code+'\nassert(sum(1,3)==3);}',
 twopointer:cs.find(c=>c.id==='twopointer').code+'\nvoid test(){assert(pairSum({-4,-1,2,5,8},7));assert(!pairSum({5},10));}',
 binary:cs.find(c=>c.id==='binary').code+'\nvoid test(){assert(lowerBound({1,3,3,7,9},3)==1);assert(lowerBound({},3)==0);}',
 backtrack:'vector<int> a={5,-2};long long k=3;\n'+cs.find(c=>c.id==='backtrack').code+'\nvoid test(){go(0,0);assert(answers.size()==1);assert(path.empty());}',
 dfs:cs.find(c=>c.id==='dfs').code+'\nvoid test(){adj={{},{2},{1,3},{2}};visited.assign(4,false);dfs(1);assert(visited[3]);}',
 bfs:'void test(){int n=3,start=1;vector<vector<int>> adj={{},{2},{1,3},{2}};'+cs.find(c=>c.id==='bfs').code+'\nassert(dist[3]==2);}',
 greedy:'void test(){vector<pair<long long,long long>> meetings={{1,10},{2,3},{3,4}};'+cs.find(c=>c.id==='greedy').code+'\nassert(count==2);}',
 dp:'void test(){vector<int> coins={1,3,4};int target=6;'+cs.find(c=>c.id==='dp').code+'\nassert(answer==2);}',
 dijkstra:'void test(){int n=3,start=1;vector<vector<pair<int,long long>>> adj={ {},{{2,5},{3,1}}, {},{{2,1}} };'+cs.find(c=>c.id==='dijkstra').code+'\nassert(dist[2]==2);}',
 dsu:cs.find(c=>c.id==='dsu').code+'\nvoid test(){DSU d(5);d.unite(1,2);d.unite(2,3);assert(d.find(1)==d.find(3));assert(d.find(1)!=d.find(4));}',
 trie:cs.find(c=>c.id==='trie').code+'\nvoid test(){insertWord("cat");insertWord("car");assert(searchWord("cat"));assert(!searchWord("ca"));assert(searchWord("ca",true));assert(!searchWord("can",true));}',
 math:cs.find(c=>c.id==='math').code+'\nvoid test(){assert(gcdNonnegative(42,30)==6);assert(gcdNonnegative(0,7)==7);}'
};
let cpp='#include <bits/stdc++.h>\nusing namespace std;\n';
for(const [id,body]of Object.entries(pieces))cpp+='namespace chapter_'+id+' {\n'+body+'\n}\n';
cpp+='int main(){'+Object.keys(pieces).map(id=>'chapter_'+id+'::test();').join('')+'}\n';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'algobook-check-'));fs.writeFileSync(temp+'/check.cpp',cpp);
cp.execFileSync('g++',['-std=c++17','-O2',temp+'/check.cpp','-o',temp+'/check']);cp.execFileSync(temp+'/check');
fs.rmSync(temp,{recursive:true,force:true});
console.log(JSON.stringify({assertions:tests,cppSnippets:15,chapters:cs.length,status:'passed'}));
require('./study-checks.cjs');

