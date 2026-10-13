(() => {
'use strict';
const defaults=window.EXAMPLE_INPUTS;
const presets={
 dfs:[['사이클',defaults.dfs],['연결되지 않은 그래프',{n:7,start:1,edges:'1 2\n2 3\n3 1\n4 5\n5 6'}],['깊은 경로',{n:7,start:1,edges:'1 2\n2 3\n3 4\n4 5\n5 6\n6 7'}]],
 bfs:[['기본',defaults.bfs],['서로 다른 경로',{n:6,start:1,edges:'1 2\n2 3\n3 4\n1 5\n5 4\n4 6'}]],
 trie:[['삽입 과정',{...defaults.trie,mode:'insert'}],['접두사 ≠ 단어',{words:'cat, car, dog',query:'ca',mode:'word'}],['접두사 검색',{words:'cat, car, dog',query:'ca',mode:'prefix'}],['없는 경로',{words:'cat, car, dog',query:'can',mode:'word'}]],
 twopointer:[['기본',defaults.twopointer],['정답 없음',{array:'1, 2, 4, 8',target:6+1}],['중복 값',{array:'1, 3, 3, 5',target:6}]],
 binary:[['중복 값',defaults.binary],['모두 작음',{array:'1, 3, 3, 7, 9',target:10}],['모두 큼',{array:'1, 3, 3, 7, 9',target:0}]],
 prefix:[['음수 포함',defaults.prefix],['빈 구간',{array:'3, -2, 5, 1',l:2,r:2}]],
 dp:[['그리디 반례',defaults.dp],['불가능한 금액',{array:'2, 4',target:7}],['목표 0',{array:'2, 3',target:0}]],
 sort:[['중복 값',defaults.sort],['역순',{array:'6, 5, 4, 3, 2, 1'}]],
 backtrack:[['기본',defaults.backtrack],['가지치기 반례',{array:'5, -2',target:3}],['빈 집합',{array:'1, 2',target:0}]]
};

const catalogue={};
const titles={sort:'중복 값을 정렬하고 빈도 세기',prefix:'누적합으로 [1, 3) 구간 합 구하기',twopointer:'양 끝에서 합 7 찾기',binary:'중복 원소에서 첫 3 이상 찾기',backtrack:'합이 3인 부분집합 찾기',dfs:'방문과 복귀를 구분하는 DFS',bfs:'큐 순서와 최단거리',dp:'동전 1·3·4로 금액 6 만들기',trie:'경로가 있어도 단어가 아닐 수 있다'};
function traced(kind,input){
 const frames=window.AlgoEngine.trace(kind,input),completed=new Set();
 return frames.map((s,i)=>{
  if(kind==='backtrack'&&s.line===11&&i){const f=frames[i-1].stack.at(-1);if(f)completed.add(2**f.i+f.chosen.reduce((m,j)=>m+2**(f.i-1-j),0));}
  return window.VisualPrimitives.fromTrace(s,i,completed);
 });
}
for(const [id,v] of Object.entries(window.EXAMPLE_VISUALS)){
 const steps=['binary','trie'].includes(id)?traced(id,defaults[id]):v.steps;
 catalogue[id]=[{key:'basic',label:'본문 예제',title:titles[id]||v.title,steps,description:window.CHAPTERS.find(c=>c.id===id).example}];
 for(const [i,[label,input]] of (presets[id]||[]).entries()){
  if(i===0&&id!=='trie')continue;
  if(id==='trie'&&input.mode==='word'&&input.query==='ca')continue;
  const description=Object.entries(input).map(([k,v])=>k+' = '+String(v).replaceAll('\n',' / ')).join(' · ');
  catalogue[id].push({key:'case-'+i,label,title:label,description,steps:traced(id,input)});
 }
}
window.WorkedExamples={catalogue};
})();
