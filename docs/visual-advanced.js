// Step-by-step visuals for every non-core chapter. Small examples follow each
// chapter's published example and code; they are deliberately hand-computed.
window.EXAMPLE_VISUALS = window.EXAMPLE_VISUALS || {};
Object.assign(window.EXAMPLE_VISUALS, {
  "stl-performance": {title:"K번째 큰 값 찾기",steps:[
    {title:"원본 배열과 K",note:"[8,2,9,1,7]에서 K=2이므로 정렬 위치는 N-K=3입니다.",rows:[{label:"a",values:[8,2,9,1,7],active:[3]}]},
    {title:"nth_element 뒤 경계",note:"nth_element 뒤 인덱스 3에는 네 번째로 작은 값 8이 놓이며, 이것이 두 번째 큰 값입니다.",rows:[{label:"배치 예",values:[2,1,7,8,9],active:[3],selected:[4]}],result:"a[N-K] = 8"}]},
  "grid-search": {title:"한 번 이동하는 BFS",steps:[
    {title:"시작 칸 거리 0",note:"도착점은 바로 오른쪽이므로 아직 이웃을 확인하기 전입니다.",grid:{label:"이동 가능 칸",values:[["S","T"]],active:[[0,0]]},rows:[{label:"dist",values:[0,"∞"],active:[0]}]},
    {title:"이웃을 한 번 방문",note:"(0,1)은 처음 발견한 이웃이라 dist=dist[S]+1=1로 기록합니다.",grid:{label:"최단 거리",values:[["0","1"]],selected:[[0,1]]},result:"최소 이동 횟수 = 1"}]},
  "graph-model": {title:"무방향 간선의 양방향 인접",steps:[
    {title:"간선 (1,2) 하나",note:"무방향 간선은 양 끝에서 서로를 이웃으로 기록합니다.",graph:{nodes:[{id:"1",label:"1",x:200,y:150},{id:"2",label:"2",x:400,y:150}],edges:[{from:"1",to:"2",selected:true}]},rows:[{label:"adj[1]",values:[2],selected:[0]},{label:"adj[2]",values:[1],selected:[0]}]},
    {title:"인접 리스트 완성",note:"각 정점의 이웃에서 같은 간선을 확인할 수 있습니다.",graph:{nodes:[{id:"1",label:"1",x:200,y:150},{id:"2",label:"2",x:400,y:150}],edges:[{from:"1",to:"2",label:"무방향"}]},result:"adj[1]={2}, adj[2]={1}"}]},
  "shortest-variants": {title:"최단 경로 상황 고르기",steps:[
    {title:"한 출발점에서 여러 목적지",note:"비음수 간선이면 한 번의 Dijkstra로 출발점의 모든 거리를 얻습니다.",graph:{nodes:[{id:"s",label:"출발",x:100,y:150},{id:"a",label:"A",x:300,y:70},{id:"b",label:"B",x:300,y:230},{id:"t",label:"목적지",x:500,y:150}],edges:[{from:"s",to:"a",label:"2",directed:true},{from:"s",to:"b",label:"5",directed:true},{from:"a",to:"t",label:"3",directed:true},{from:"b",to:"t",label:"1",directed:true}]},rows:[{label:"거리",values:["s:0","A:2","B:5","t:5"]}]},
    {title:"모든 쌍 거리",note:"출발점마다 반복하지 않고 작은 그래프에서 Floyd-Warshall을 사용합니다.",rows:[{label:"목표",values:["각 i → 모든 j"]}],result:"선택 기준: 출발점 수 · 음수 간선 · V 크기"}]},
  "sqrt-decomposition": {title:"N=10, 블록 크기 4",steps:[
    {title:"인덱스 나누기",note:"B=⌈√10⌉=4이므로 반열린 구간 세 블록입니다.",rows:[{label:"index",values:[0,1,2,3,4,5,6,7,8,9],active:[0,1,2,3],selected:[4,5,6,7]}]},
    {title:"마지막 블록은 짧음",note:"마지막 블록은 인덱스 8,9 두 개만 포함하고 끝은 N=10에서 자릅니다.",rows:[{label:"블록",values:["[0,4)","[0,4)","[0,4)","[0,4)","[4,8)","[4,8)","[4,8)","[4,8)","[8,10)","[8,10)"],active:[8,9]}],result:"[0,4), [4,8), [8,10)"}]},
  "mst": {title:"Kruskal 간선 선택",steps:[
    {title:"가중치 오름차순 선택",note:"먼저 (1,2,1), (2,3,2)를 선택합니다. 다음 선택은 (3,4,3)입니다.",graph:{nodes:[{id:"1",label:"1",x:100,y:150},{id:"2",label:"2",x:280,y:70},{id:"3",label:"3",x:460,y:150},{id:"4",label:"4",x:460,y:250}],edges:[{from:"1",to:"2",label:"1",selected:true},{from:"2",to:"3",label:"2",selected:true},{from:"1",to:"3",label:"4"},{from:"3",to:"4",label:"3"}]},rows:[{label:"누적 비용",values:[1,3],active:[1]}]},
    {title:"가중치 3 선택 뒤 4 거절",note:"(3,4,3)을 먼저 선택해 4개 정점을 잇고, 다음 (1,3,4)는 이미 연결된 정점 사이여서 버립니다.",graph:{nodes:[{id:"1",label:"1",x:100,y:150},{id:"2",label:"2",x:280,y:70},{id:"3",label:"3",x:460,y:150},{id:"4",label:"4",x:460,y:250}],edges:[{from:"1",to:"2",label:"1",selected:true},{from:"2",to:"3",label:"2",selected:true},{from:"1",to:"3",label:"4"},{from:"3",to:"4",label:"3",selected:true}]},result:"1+2+3 = 6"}]},
  "bitmask-subsets": {title:"mask=01010₂ 해석",steps:[
    {title:"각 비트는 작업 상태",note:"배열의 왼쪽부터 작업 0~4입니다. 작업 1과 3의 비트가 켜져 있습니다.",rows:[{label:"작업 번호",values:[0,1,2,3,4]},{label:"mask",values:[0,1,0,1,0],active:[1,3]}]},
    {title:"완료 집합",note:"켜진 비트의 작업만 완료 상태로 읽습니다.",rows:[{label:"작업",values:["0","1 완료","2","3 완료","4"],selected:[1,3]}],result:"완료 작업 {1,3}"}]},
  "lis": {title:"LIS 꼬리 배열",steps:[
    {title:"수열을 왼쪽부터 처리",note:"10,20,10,30을 처리하면 최소 꼬리 후보는 [10,20,30]입니다.",rows:[{label:"입력",values:[10,20,10,30,20,50],active:[3]},{label:"tails",values:[10,20,30],selected:[0,1,2]}]},
    {title:"마지막 20과 50",note:"20은 기존 20 꼬리를 대체하고, 50은 새 길이를 늘립니다.",rows:[{label:"최종 tails",values:[10,20,30,50],selected:[0,1,2,3]}],result:"LIS 길이 4, 예: 10,20,30,50"}]},
  "sweep-line": {title:"반열린 구간 이벤트",steps:[
    {title:"시작과 끝 이벤트",note:"[1,4), [2,5), [4,7)의 끝은 시작보다 먼저 반영합니다.",intervals:[{label:"A",start:1,end:4},{label:"B",start:2,end:5},{label:"C",start:4,end:7}]},
    {title:"시각 4의 동시 변화",note:"A가 끝나고 C가 시작하므로 겹침 수는 2를 넘지 않습니다.",intervals:[{label:"A 끝",start:1,end:4},{label:"B",start:2,end:5,selected:true},{label:"C 시작",start:4,end:7,selected:true}],rows:[{label:"시각 4 처리",values:["끝 A: −1","시작 C: +1","활성 2"],active:[2]}],result:"최대 동시 구간 수 = 2"}]},
  "monotonic-stack": {title:"다음 큰 값 찾기",steps:[
    {title:"왼쪽부터 후보를 유지",note:"두 번째 2를 처리해 인덱스 1의 답을 2로 확정하고, 아직 미해결인 두 2의 인덱스 0,2를 스택에 둡니다.",rows:[{label:"값",values:[2,1,2,4,3],active:[2]},{label:"스택 인덱스",values:[0,2],selected:[0,1]},{label:"결과",values:["?",2,"?","?","?"],selected:[1]}]},
    {title:"작은 후보 제거",note:"두 번째 2가 1의 답을 2로 확정합니다. 이어 4가 앞의 두 2의 답을 확정하고, 마지막 3은 미해결로 남습니다.",rows:[{label:"값",values:[2,1,2,4,3]},{label:"다음 큰 값",values:[4,2,4,-1,-1],selected:[0,1,2,3,4]}],result:"[4,2,4,-1,-1]"}]},
  "simulation-phases": {title:"동시 갱신은 별도 배열에",steps:[
    {title:"오늘 상태에서 계산",note:"예시 격자 [[10,0]]에서 각 칸의 다음 값은 오늘 상태만 읽어 계산합니다.",rows:[{label:"오늘",values:[10,0],active:[0]},{label:"다음 버퍼",values:["?","?"]}]},
    {title:"계산을 마친 뒤 반영",note:"왼쪽 칸은 오른쪽의 0을 읽고, 오른쪽 칸은 왼쪽의 10을 읽어 결과를 한 번에 반영합니다.",rows:[{label:"오늘",values:[10,0]},{label:"내일",values:[0,10],selected:[1]}],result:"한 단계 결과 [[0,10]]"}]},
  "modular-math": {title:"3¹³ mod 7",steps:[
    {title:"지수를 이진 분해",note:"13=8+4+1이므로 제곱한 거듭제곱 중 세 항을 곱합니다.",rows:[{label:"bit",values:[1,0,1,1]},{label:"제곱 값 mod 7",values:[3,2,4,2],active:[0,2,3]}]},
    {title:"선택 항 곱하기",note:"3¹ mod7=3, 3⁴ mod7=4, 3⁸ mod7=2입니다.",rows:[{label:"누적",values:[3, (3*4)%7, ((3*4)%7*2)%7],selected:[2]}],result:"3×4×2 mod 7 = 3"}]},
  "fenwick-tree": {title:"점 갱신과 구간 합",steps:[
    {title:"index 2에 +5",note:"0-based index 2는 1-based Fenwick index 3입니다. 값 4→9에 따라 bit[3], bit[4]에 5를 더합니다.",rows:[{label:"원본 A",values:[2,1,4,3],active:[2]},{label:"Fenwick bit",values:[2,3,4,10],active:[2,3]}]},
    {title:"[1,4) 합",note:"반열린 구간은 인덱스 1,2,3입니다. prefix(4)=15, prefix(1)=2이므로 15−2=13입니다.",rows:[{label:"bit",values:[2,3,9,15],selected:[2,3]},{label:"prefix",values:["prefix(4)=15","prefix(1)=2"],active:[0,1]},{label:"range sum",values:[13],active:[0]}],result:"13"}]},
  "lcs": {title:"LCS 표본 DP 테이블",steps:[
    {title:"행 A, 열 B의 접두사 DP",note:"같은 문자는 대각선+1, 다르면 위·왼쪽 최댓값을 복사합니다. 행/열 첫 칸은 빈 접두사 0입니다.",grid:{label:"ABCBDAB × BDCABA",values:[["A/B","ε","B","D","C","A","B","A"],["ε",0,0,0,0,0,0,0],["A",0,0,0,0,1,1,1],["B",0,1,1,1,1,2,2],["C",0,1,1,2,2,2,2],["B",0,1,1,2,2,3,3],["D",0,1,2,2,2,3,3],["A",0,1,2,2,3,3,4],["B",0,1,2,2,3,4,4]],active:[[8,7]]}},
    {title:"마지막 셀에서 길이 읽기",note:"두 문자열 전체 접두사의 답은 DP 마지막 셀입니다.",grid:{label:"최종 DP 행 (B 접두사 열 포함)",values:[["B","ε","B","D","C","A","B","A"],["B",0,1,2,2,3,4,4]],selected:[[1,7]]},result:"LCS 길이 4"}]},
  "cpp-essentials": {title:"getline 전 개행 처리",steps:[
    {title:"정수 입력 뒤 개행이 남음",note:"cin >> n은 숫자만 소비하므로 줄 끝 개행이 입력 버퍼에 남습니다.",rows:[{label:"입력 버퍼",values:["4","\\n","hello world"] ,active:[1]}]},
    {title:"개행을 버린 뒤 한 줄 읽기",note:"ignore로 남은 줄을 비우면 getline이 실제 문자열 전체를 읽습니다.",rows:[{label:"읽기 결과",values:["hello world"],selected:[0]}],result:"공백을 포함해 한 줄 입력"}]},
  "tree-traversal": {title:"루트 A, 자식 B와 C",steps:[
    {title:"트리 구조",note:"A의 왼쪽 자식은 B, 오른쪽 자식은 C입니다.",graph:{nodes:[{id:"A",label:"A",x:300,y:65},{id:"B",label:"B",x:190,y:220},{id:"C",label:"C",x:410,y:220}],edges:[{from:"A",to:"B"},{from:"A",to:"C"}]}},
    {title:"방문 시점별 출력",note:"전위는 루트 먼저, 중위는 왼쪽 사이, 후위는 자식 뒤, 레벨은 너비 순서입니다.",rows:[{label:"전위",values:[..."ABC"]},{label:"중위",values:[..."BAC"]},{label:"후위",values:[..."BCA"]},{label:"레벨",values:[..."ABC"]}],result:"전 A-B-C · 중 B-A-C · 후 B-C-A · 레벨 A-B-C"}]},
  "array-rotation": {title:"왼쪽으로 두 칸 회전",steps:[
    {title:"앞의 두 원소를 분리",note:"[1,2]가 뒤로 이동하고 [3,4,5]가 앞에 옵니다.",rows:[{label:"입력",values:[1,2,3,4,5],active:[0,1]}]},
    {title:"두 구간 이어 붙이기",note:"배열을 두 구간으로 나누어 뒤 구간 다음에 앞 구간을 둡니다.",rows:[{label:"결과",values:[3,4,5,1,2],selected:[0,1,2,3,4]}],result:"[3,4,5,1,2]"},
    {title:"2×3 행렬 90° 시계 회전",note:"열이 행이 되고 기존 열 순서는 아래에서 위로 읽습니다.",grid:{label:"회전 결과",values:[[4,1],[5,2],[6,3]],selected:[[0,0],[2,1]]},result:"[[1,2,3],[4,5,6]] → [[4,1],[5,2],[6,3]]"}]},
  "segment-tree": {title:"실제 세그먼트 트리 노드 합",steps:[
    {title:"원본과 트리 구축",note:"리프 [2,1,4,3]에서 부모 합은 3, 7, 루트 합은 10입니다.",rows:[{label:"레벨 0",values:[10]},{label:"레벨 1",values:[3,7]},{label:"리프",values:[2,1,4,3]}],result:"[1,4) 질의 = 1 + (4+3) = 8"},
    {title:"index 2를 7로 대입",note:"리프 4→7, 부모 [2,4)의 합 7→10, 루트 10→13으로 다시 계산합니다.",rows:[{label:"레벨 0",values:[13],active:[0]},{label:"레벨 1",values:[3,10],active:[1]},{label:"리프",values:[2,1,7,3],active:[2]}],result:"[1,4) 질의 = 1 + 10 = 11"}]},
  "lca": {title:"두 LCA 질의",steps:[
    {title:"루트 1, 자식 2·3",note:"정점 2의 자식은 4와 5입니다.",graph:{nodes:[{id:"1",label:"1",x:300,y:45},{id:"2",label:"2",x:200,y:140},{id:"3",label:"3",x:420,y:140},{id:"4",label:"4",x:140,y:245},{id:"5",label:"5",x:260,y:245}],edges:[{from:"1",to:"2"},{from:"1",to:"3"},{from:"2",to:"4"},{from:"2",to:"5"}]}},
    {title:"질의 1: LCA(4,5)",note:"4와 5는 같은 깊이에서 부모 2를 공유합니다.",graph:{nodes:[{id:"1",label:"1",x:300,y:45},{id:"2",label:"2",x:200,y:140,selected:true},{id:"3",label:"3",x:420,y:140},{id:"4",label:"4",x:140,y:245},{id:"5",label:"5",x:260,y:245}],edges:[{from:"1",to:"2"},{from:"1",to:"3"},{from:"2",to:"4"},{from:"2",to:"5"}]},result:"LCA(4,5)=2"},
    {title:"질의 2: LCA(4,3)",note:"4를 깊이 1까지 올리면 2와 3의 공통 부모는 루트 1입니다.",graph:{nodes:[{id:"1",label:"1",x:300,y:45,selected:true},{id:"2",label:"2",x:200,y:140},{id:"3",label:"3",x:420,y:140},{id:"4",label:"4",x:140,y:245},{id:"5",label:"5",x:260,y:245}],edges:[{from:"1",to:"2"},{from:"1",to:"3"},{from:"2",to:"4"},{from:"2",to:"5"}]},result:"LCA(4,3)=1"}]},
  "dp-patterns": {title:"0/1 배낭: 무게 [2,3], 가치 [4,5]",steps:[
    {title:"첫 물건을 한 번 반영",note:"무게 2, 가치 4를 역순 갱신하면 용량 2~4에 가치 4를 만들 수 있습니다.",rows:[{label:"capacity",values:[0,1,2,3,4]},{label:"dp",values:[0,0,4,4,4],active:[2,3,4]}]},
    {title:"둘째 물건은 무게 3",note:"용량 4에서는 이전 dp[1]=0에서 가치 5가 됩니다. 무게 2 물건을 재사용해 8은 만들 수 없습니다.",rows:[{label:"dp final",values:[0,0,4,5,5],selected:[4]}],result:"W=4 최댓값 5"}]},
});
Object.assign(window.EXAMPLE_VISUALS, {
  "state-model": {
    "title": "독립 개념 예제: ID 42 → 위치 0, ID 81 → 위치 1. 42 삭제 뒤 조회하면 미등록입니다.",
    "steps": [
      {
        "title": "변경 전",
        "note": "본체에는 객체의 상태를 저장하고 인덱스에는 그 객체를 찾는 경로만 저장합니다. 같은 값을 여러 곳에 복사해 수정하면 불일치가 생기기 쉽습니다.",
        "rows": [
          {
            "label": "ID",
            "values": [
              42,
              81
            ]
          },
          {
            "label": "저장 위치",
            "values": [
              0,
              1
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "find는 없는 키를 추가하지 않아 조회가 본체와 인덱스의 관계를 바꾸지 않습니다.",
        "rows": [
          {
            "label": "삭제 뒤 ID",
            "values": [
              81
            ],
            "selected": [
              0
            ]
          },
          {
            "label": "조회 42",
            "values": [
              -1
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  },
  "local-update": {
    "title": "독립 개념 예제: [6,1,4] → [6,3,4]. 인접 합 [7,5] → [9,7].",
    "steps": [
      {
        "title": "변경 전",
        "note": "길이 k인 창의 시작 i는 i≤p<i+k일 때만 위치 p의 변경에 영향을 받습니다. 시작 범위 [p−k+1,p]를 실제 배열 경계로 잘라 사용합니다.",
        "rows": [
          {
            "label": "배열",
            "values": [
              6,
              1,
              4
            ]
          },
          {
            "label": "인접 합",
            "values": [
              7,
              5
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "결과가 어떤 입력을 읽는지 알면 영향을 받은 항목만 정확히 재계산할 수 있습니다.",
        "rows": [
          {
            "label": "변경 배열",
            "values": [
              6,
              3,
              4
            ],
            "selected": [
              0,
              1,
              2
            ]
          },
          {
            "label": "새 인접 합",
            "values": [
              9,
              7
            ],
            "selected": [
              0,
              1
            ]
          }
        ]
      }
    ]
  },
  "candidate-filter": {
    "title": "독립 개념 예제: 분류 후보 [0,2], 활성 [true,true,false] → 결과 [0].",
    "steps": [
      {
        "title": "변경 전",
        "note": "반복 조회에 쓰는 특징이 변하지 않는다면 한 번 분류해 후보 목록을 만듭니다. 후보 수가 줄지 않는 분포에서는 큰 이득이 없으므로 최악의 후보 수도 계산합니다.",
        "rows": [
          {
            "label": "후보",
            "values": [
              0,
              2
            ]
          },
          {
            "label": "활성",
            "values": [
              true,
              true,
              false
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "필터는 일부 조건만 보장하므로 변할 수 있는 조건을 현재 본체에서 확인해야 합니다.",
        "rows": [
          {
            "label": "최종 결과",
            "values": [
              0
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  },
  "path-algebra": {
    "title": "독립 개념 예제: min(9,6)=6, min(5,11)=5 → 첫 경로의 품질이 큽니다.",
    "steps": [
      {
        "title": "변경 전",
        "note": "한 경로를 연장하는 연산과 서로 다른 경로의 후보를 선택하는 연산은 다릅니다. 최소 합은 연장에 +, 선택에 min을 쓰고 최대 병목은 연장에 min, 선택에 max를 씁니다.",
        "rows": [
          {
            "label": "경로 A",
            "values": [
              9,
              6
            ]
          },
          {
            "label": "경로 B",
            "values": [
              5,
              11
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "가장 작은 간선이 한 경로의 품질을 정하고, 경로 사이에서는 그 품질이 가장 큰 것을 고릅니다.",
        "rows": [
          {
            "label": "각 경로 품질",
            "values": [
              6,
              5
            ],
            "selected": [
              0,
              1
            ]
          },
          {
            "label": "선택 품질",
            "values": [
              6
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  },
  "path-sensitivity": {
    "title": "독립 개념 예제: s→a→t 비용 3+4=7. 사용하지 않은 직접 간선 s→t 비용 10 제거 뒤에도 7.",
    "steps": [
      {
        "title": "변경 전",
        "note": "기존 최적 경로에 없는 간선을 제거해도 그 경로는 유효합니다. 삭제는 더 짧은 경로를 새로 만들 수 없으므로 최적 거리도 그대로입니다. 하나의 최적 경로를 저장하는 것만으로 이 주장이 성립합니다.",
        "rows": [
          {
            "label": "증거 경로 비용",
            "values": [
              3,
              4
            ]
          },
          {
            "label": "다른 경로 비용",
            "values": [
              10
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "남아 있는 증거가 기존 값을 달성하고, 삭제로 가능한 경로 집합은 줄어들기만 합니다.",
        "rows": [
          {
            "label": "증거 경로 유지",
            "values": [
              7
            ],
            "selected": [
              0
            ]
          },
          {
            "label": "다른 간선 삭제 후 최적값",
            "values": [
              7
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  },
  "resource-state": {
    "title": "독립 개념 예제: (비용 4, 자원 1)과 (비용 5, 자원 3)은 서로 지배하지 않습니다.",
    "steps": [
      {
        "title": "변경 전",
        "note": "두 상태를 합치려면 이후 가능한 행동과 그 추가 비용이 동일해야 합니다. 단순히 현재 위치가 같다는 이유로 한 상태를 지우면 자원이 부족해 필요한 전이를 놓칠 수 있습니다.",
        "rows": [
          {
            "label": "비용",
            "values": [
              4,
              5
            ]
          },
          {
            "label": "자원",
            "values": [
              1,
              3
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "추가 상태는 비용이 더 작고 자원도 두 기존 상태 이상입니다. 같은 위치이며 자원이 많아 불리해지지 않는 모델에서 두 상태를 지배합니다.",
        "rows": [
          {
            "label": "비용 3·자원 3 상태 추가",
            "values": [
              "두 기존 상태를 지배"
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  },
  "bitset-cost": {
    "title": "독립 개념 예제: 0101 XOR 0011 = 0110 → 켜진 비트 2개.",
    "steps": [
      {
        "title": "변경 전",
        "note": "한 비트가 한 이진 특징을 의미할 때 XOR는 서로 다른 위치, AND는 공통 위치, OR는 어느 쪽에든 있는 위치를 나타냅니다. 부호 없는 정수와 1ULL 시프트를 쓰며 비트 위치가 타입의 폭보다 작아야 합니다.",
        "rows": [
          {
            "label": "특징",
            "values": [
              "0101",
              "0011"
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "XOR=0110에서 켜진 두 비트가 서로 다른 위치입니다. OR로 합집합을 세는 것과 구분합니다.",
        "rows": [
          {
            "label": "XOR",
            "values": [
              "0110"
            ],
            "selected": [
              0
            ]
          },
          {
            "label": "차이 수",
            "values": [
              2
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  },
  "ordered-index": {
    "title": "독립 개념 예제: {(3,0),(8,2)} → {(1,2),(3,0)}.",
    "steps": [
      {
        "title": "변경 전",
        "note": "set의 트리 위치는 삽입 당시 비교 결과로 결정됩니다. 비교자가 외부 가변 상태를 읽는다면 본체를 먼저 수정하는 순간 순서가 깨집니다. 키를 값으로 저장하면 이전 키를 명확히 보존할 수 있습니다.",
        "rows": [
          {
            "label": "정렬 키",
            "values": [
              "(3,0)",
              "(8,2)"
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "이전 키가 유효할 때 제거해야 삽입 당시 정렬 순서와 삭제 탐색이 일치합니다.",
        "rows": [
          {
            "label": "새 정렬 키",
            "values": [
              "(1,2)",
              "(3,0)"
            ],
            "selected": [
              0,
              1
            ]
          }
        ]
      }
    ]
  },
  "lazy-validity": {
    "title": "독립 개념 예제: 활성=true, 그룹 활성=true, 항목 세대=2, 현재 세대=3 → 무효.",
    "steps": [
      {
        "title": "변경 전",
        "note": "유효성은 개별 활성, 그룹 활성, 세대 일치처럼 필요한 모든 조건의 논리곱으로 정의합니다. 조건을 여러 조회에 복사하면 누락되기 쉬우므로 하나의 함수로 모읍니다.",
        "rows": [
          {
            "label": "활성",
            "values": [
              true
            ]
          },
          {
            "label": "그룹 활성",
            "values": [
              true
            ]
          },
          {
            "label": "세대",
            "values": [
              2,
              3
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "같은 ID라도 등록 시점이 다르면 다른 항목이므로 세대가 맞아야 사용할 수 있습니다.",
        "rows": [
          {
            "label": "유효 판정",
            "values": [
              false
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  },
  "order-statistics": {
    "title": "독립 개념 예제: lower_bound(7)의 위치는 2 → 7보다 작은 값 2개.",
    "steps": [
      {
        "title": "변경 전",
        "note": "rank를 값보다 작은 원소 수로 정의하면 0부터 시작합니다. 중복 원소를 개별로 셀지 서로 다른 값만 셀지도 정합니다. lower_bound는 작은 원소 수, upper_bound는 작거나 같은 원소 수를 줍니다.",
        "rows": [
          {
            "label": "정렬 배열",
            "values": [
              2,
              4,
              7,
              9
            ]
          }
        ]
      },
      {
        "title": "핵심 원리 적용",
        "note": "lower_bound는 x 이상인 첫 위치여서 그 앞에는 x보다 작은 원소만 있습니다.",
        "rows": [
          {
            "label": "7보다 작은 값",
            "values": [
              2,
              4
            ],
            "selected": [
              0,
              1
            ]
          },
          {
            "label": "개수",
            "values": [
              2
            ],
            "selected": [
              0
            ]
          }
        ]
      }
    ]
  }
});

// 본문에서 설명한 핵심 전이와 경계 조건을 독립 입력으로 보충합니다.
for (const [id, steps] of Object.entries({
  "sqrt-decomposition": [
    {
      "title": "질의 [2,9): 자투리와 완전 블록",
      "note": "독립 입력 [2,8,1,6,3,9,4,5,7,0], B=4입니다. 인덱스 2·3을 읽고 [4,8) 요약 9와 인덱스 8을 합칩니다.",
      "rows": [
        {
          "label": "배열",
          "values": [
            2,
            8,
            1,
            6,
            3,
            9,
            4,
            5,
            7,
            0
          ],
          "active": [
            2,
            3,
            8
          ],
          "selected": [
            4,
            5,
            6,
            7
          ]
        },
        {
          "label": "블록 최대",
          "values": [
            8,
            9,
            7
          ],
          "active": [
            1
          ],
          "selected": []
        },
        {
          "label": "읽은 요약",
          "values": [
            1,
            6,
            9,
            7
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "max(1,6,9,7) = 9"
    },
    {
      "title": "최대 원소 감소: 블록 재계산",
      "note": "A[5]=9를 0으로 낮추면 기존 최댓값 9만 빼서 복구할 수 없습니다. [4,8)의 네 원소를 다시 읽어 최대 5를 얻습니다.",
      "rows": [
        {
          "label": "변경 배열",
          "values": [
            2,
            8,
            1,
            6,
            3,
            0,
            4,
            5,
            7,
            0
          ],
          "active": [
            5
          ],
          "selected": []
        },
        {
          "label": "새 블록 최대",
          "values": [
            8,
            5,
            7
          ],
          "active": [
            1
          ],
          "selected": []
        },
        {
          "label": "질의 후보",
          "values": [
            1,
            6,
            5,
            7
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "같은 [2,9) 질의 = 7"
    }
  ],
  "shortest-variants": [
    {
      "title": "음수 간선: 반복 완화",
      "note": "정점 0→1 비용 4, 0→2 비용 5, 1→2 비용 −3입니다. 이 순서로 한 번 완화하면 dist[2]는 5에서 1로 개선됩니다.",
      "rows": [
        {
          "label": "시작 거리",
          "values": [
            0,
            "∞",
            "∞"
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "0→1 뒤",
          "values": [
            0,
            4,
            "∞"
          ],
          "active": [
            1
          ],
          "selected": []
        },
        {
          "label": "0→2 뒤",
          "values": [
            0,
            4,
            5
          ],
          "active": [
            2
          ],
          "selected": []
        },
        {
          "label": "1→2 뒤",
          "values": [
            0,
            4,
            1
          ],
          "active": [
            2
          ],
          "selected": []
        }
      ],
      "result": "0→1→2 비용 = 1"
    },
    {
      "title": "한 번 더 개선되면 음수 사이클",
      "note": "2→1 비용 1을 추가하면 1→2→1의 합은 −2입니다. 3개 정점의 V−1회 뒤에도 이 사이클의 거리 개선이 계속되어 유한한 최단값이 없습니다.",
      "rows": [
        {
          "label": "사이클 비용",
          "values": [
            -3,
            1
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "1의 비용 반복",
          "values": [
            4,
            2,
            0,
            -2
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "출발점에서 도달 가능한 음수 사이클"
    },
    {
      "title": "Floyd: 중간 정점 1을 허용",
      "note": "0→1=4, 1→2=−3, 0→2=5인 원래 그래프입니다. k=1에서 dist[0][2]=min(5,4−3)=1로 바뀝니다. k는 바깥 반복입니다.",
      "rows": [],
      "grid": {
        "label": "행 출발 · 열 도착: k=1 이후",
        "values": [
          [
            "i/j",
            0,
            1,
            2
          ],
          [
            0,
            0,
            4,
            1
          ],
          [
            1,
            "∞",
            0,
            -3
          ],
          [
            2,
            "∞",
            "∞",
            0
          ]
        ],
        "active": [
          [
            1,
            3
          ]
        ]
      },
      "result": "dist[0][2] = 1"
    }
  ],
  "dp-patterns": [
    {
      "title": "오름차순 갱신이 만드는 반례",
      "note": "첫 물건 (무게 2, 가치 4)만 오름차순으로 처리하면 dp[4]가 방금 바꾼 dp[2]=4를 읽습니다. 한 물건을 두 번 쓴 8이 만들어집니다.",
      "rows": [
        {
          "label": "용량",
          "values": [
            0,
            1,
            2,
            3,
            4
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "올바른 역순",
          "values": [
            0,
            0,
            4,
            4,
            4
          ],
          "active": [],
          "selected": [
            4
          ]
        },
        {
          "label": "잘못된 오름차순",
          "values": [
            0,
            0,
            4,
            4,
            8
          ],
          "active": [
            4
          ],
          "selected": []
        }
      ],
      "result": "0/1 배낭에는 역순 필요"
    },
    {
      "title": "조합과 순서 있는 경우의 수",
      "note": "동전 [1,2], 금액 3입니다. 동전 바깥 루프는 1+2와 2+1을 같은 조합으로 세고, 금액 바깥 루프는 둘을 따로 셉니다.",
      "rows": [
        {
          "label": "금액",
          "values": [
            0,
            1,
            2,
            3
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "조합 DP",
          "values": [
            1,
            1,
            2,
            2
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "순서 있는 DP",
          "values": [
            1,
            1,
            2,
            3
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "순서 있는 결과",
          "values": [
            "1+1+1",
            "1+2",
            "2+1"
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "조합 2개 · 순서 있는 경우 3개"
    },
    {
      "title": "방문 집합과 마지막 정점 전이",
      "note": "독립 방향 순회 0→1→2→0의 각 비용을 2,3,4로 둡니다. 비트 문자열은 오른쪽 비트가 정점 0입니다. 방문한 0으로 중간에 되돌아가지 않습니다.",
      "rows": [
        {
          "label": "(mask, 마지막, 비용)",
          "values": [
            "(001,0,0)",
            "(011,1,2)",
            "(111,2,5)"
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "복귀 간선",
          "values": [
            4
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "모두 방문한 비용 5 + 복귀 4 = 9"
    }
  ],
  "resource-state": [
    {
      "title": "다음 행동이 상태 차이를 드러냄",
      "note": "같은 위치의 A=(비용 4, 자원 1), B=(비용 5, 자원 3)에서 다음 이동은 자원 2를 소비하고 비용 2를 더합니다. 비용이 낮은 A만 남기면 유효한 전이를 잃습니다.",
      "rows": [
        {
          "label": "시작 상태",
          "values": [
            "A: (4,1)",
            "B: (5,3)"
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "이동 가능 여부",
          "values": [
            false,
            true
          ],
          "active": [],
          "selected": [
            1
          ]
        },
        {
          "label": "다음 상태",
          "values": [
            "A: 불가능",
            "B: (7,1)"
          ],
          "active": [],
          "selected": [
            1
          ]
        }
      ],
      "result": "위치만 같은 두 상태를 합칠 수 없음"
    }
  ],
  "bitset-cost": [
    {
      "title": "OR는 합집합, AND는 중복",
      "note": "0101과 0011은 오른쪽 비트 0에서 겹칩니다. 개수를 각각 더한 4에서 중복 하나를 빼면 합집합 3입니다.",
      "rows": [
        {
          "label": "A bits · 왼쪽부터 3,2,1,0",
          "values": [
            0,
            1,
            0,
            1
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "B bits · 왼쪽부터 3,2,1,0",
          "values": [
            0,
            0,
            1,
            1
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "OR",
          "values": [
            0,
            1,
            1,
            1
          ],
          "active": [],
          "selected": [
            1,
            2,
            3
          ]
        },
        {
          "label": "AND",
          "values": [
            0,
            0,
            0,
            1
          ],
          "active": [
            3
          ],
          "selected": []
        },
        {
          "label": "합집합 개수",
          "values": [
            3
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "popcount(A OR B) = 3"
    }
  ],
  "ordered-index": [
    {
      "title": "제거와 재삽입 사이",
      "note": "기존 (8,2)를 제거한 직후에는 {(3,0)}만 남습니다. 본체의 점수를 1로 바꾸고 (1,2)를 넣으면 새 순서가 완성됩니다.",
      "rows": [
        {
          "label": "삭제 직후",
          "values": [
            "(3,0)"
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "본체 ID 2의 점수",
          "values": [
            8,
            "→",
            1
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "재삽입 후",
          "values": [
            "(1,2)",
            "(3,0)"
          ],
          "active": [],
          "selected": [
            0
          ]
        }
      ],
      "result": "한 객체당 현재 키 하나"
    }
  ],
  "lazy-validity": [
    {
      "title": "오래된 top 제거 후 다시 검사",
      "note": "힙 top 순서가 (우선순위 1, ID 7, 세대 2), (2, ID 9, 세대 1)입니다. ID 7의 현재 세대는 3, ID 9는 1이며 모두 활성입니다.",
      "rows": [
        {
          "label": "pop 후보",
          "values": [
            "ID 7 · gen 2",
            "ID 9 · gen 1"
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "현재 세대",
          "values": [
            3,
            1
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "유효 여부",
          "values": [
            false,
            true
          ],
          "active": [],
          "selected": [
            1
          ]
        }
      ],
      "result": "첫 항목 폐기 → 다음 유효 항목 ID 9 반환"
    },
    {
      "title": "그룹 재활성화의 경계",
      "note": "그룹 활성 여부만 false→true로 바꾸면 과거 항목도 다시 유효해질 수 있습니다. 새 그룹 수명은 그룹 세대로 구분하고 저장 세대와 현재 세대도 비교합니다.",
      "rows": [
        {
          "label": "저장 그룹 세대",
          "values": [
            4
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "현재 그룹 세대",
          "values": [
            5
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "그룹 활성",
          "values": [
            true
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "최종 유효",
          "values": [
            false
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "그룹이 활성이어도 세대 불일치는 무효"
    }
  ],
  "order-statistics": [
    {
      "title": "개수로 k번째 찾기",
      "note": "값 영역 [2,4,7,9]의 빈도 [2,1,1,0]에서 1-based k=3을 찾습니다. 앞 두 개를 건너뛰면 남은 k=1이 값 4 영역 안에 있습니다.",
      "rows": [
        {
          "label": "값 영역",
          "values": [
            2,
            4,
            7,
            9
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "빈도",
          "values": [
            2,
            1,
            1,
            0
          ],
          "active": [],
          "selected": []
        },
        {
          "label": "누적 개수",
          "values": [
            2,
            3,
            4,
            4
          ],
          "active": [
            1
          ],
          "selected": []
        },
        {
          "label": "선택 값",
          "values": [
            4
          ],
          "active": [],
          "selected": [
            0
          ]
        }
      ],
      "result": "누적 개수가 처음 3 이상인 값 = 4"
    },
    {
      "title": "삭제와 중복 순위",
      "note": "값 2를 하나 지우면 빈도는 [1,1,1,0]이 됩니다. 4보다 작은 원소 수는 2에서 1로 줄고, 세 번째 원소는 7이 됩니다.",
      "rows": [
        {
          "label": "갱신 빈도",
          "values": [
            1,
            1,
            1,
            0
          ],
          "active": [
            0
          ],
          "selected": []
        },
        {
          "label": "갱신 누적 개수",
          "values": [
            1,
            2,
            3,
            3
          ],
          "active": [
            2
          ],
          "selected": []
        },
        {
          "label": "rank(4) · select(3)",
          "values": [
            1,
            7
          ],
          "active": [],
          "selected": []
        }
      ],
      "result": "유효 원소 수와 집계를 함께 갱신"
    }
  ]
})) {
  window.EXAMPLE_VISUALS[id].steps.push(...steps);
}

// 결과뿐 아니라 해당 셀·점프를 만드는 의존 관계를 따라갑니다.
{
  const full = window.EXAMPLE_VISUALS.lcs.steps[0].grid.values;
  function cellStep(i, j, title, note, dependencies) {
    const values = full.map((r, ri) => r.map((v, ci) =>
      ri <= 1 || ci <= 1 || ri < i || (ri === i && ci <= j) ? v : '·'));
    return {title, note, grid: {label: '행 우선 계산 · 주황은 현재 셀, 청록은 읽는 셀',
      values, active: [[i,j]], selected: dependencies}};
  }
  window.EXAMPLE_VISUALS.lcs.steps.splice(1, 0,
    cellStep(4,4,'문자가 같음: 대각선 + 1',
      'A의 세 번째 문자 C와 B의 세 번째 문자 C가 같습니다. 빈 접두사와 제목 칸을 제외한 dp[3][3]은 dp[2][2]+1=1+1=2입니다. 아직 계산하지 않은 칸은 ·입니다.', [[3,3]]),
    cellStep(4,5,'문자가 다름: 위·왼쪽 max',
      'C와 A는 다릅니다. dp[3][4]=max(dp[2][4],dp[3][3])=max(1,2)=2입니다. 현재 문자를 둘 다 답에 넣지 않고 한쪽 접두사를 줄인 두 후보를 비교합니다.', [[3,5],[4,4]]),
    {title:'답 수열과 원래 인덱스', note:'길이 4인 공통 부분수열 BCBA의 한 선택입니다. 두 문자열에서 선택 인덱스가 각각 증가해야 합니다. DP 길이와 실제 수열은 별개 정보입니다.',
      rows:[{label:'ABCBDAB',values:[...'ABCBDAB'],selected:[1,2,3,5]},
        {label:'BDCABA',values:[...'BDCABA'],selected:[0,2,4,5]}],result:'공통 부분수열 BCBA · 길이 4'});
  window.EXAMPLE_VISUALS.lca.steps.push(
    {title:'2의 거듭제곱 조상 표',note:'독립 예제는 1→2→3→4→5→6→7→8인 일자 트리, 루트 1의 깊이 0입니다. up[k][v]는 2^k칸 위 조상이고 루트 위 조상은 루트로 둡니다. up[k][v]=up[k−1][up[k−1][v]]로 채웁니다.',
      rows:[{label:'정점 8의 점프 길이',values:[1,2,4,8]},
        {label:'up[k][8]',values:[7,6,4,1]},
        {label:'4칸 점프의 의존',values:['up[1][8]=6','up[1][6]=4']}]},
    {title:'깊이 차 5 = 4 + 1',note:'LCA(8,3)를 구할 때 깊이 차는 7−2=5입니다. 정점 8을 4칸 올려 4, 1칸 더 올려 3이 됩니다. 두 정점이 같아졌으므로 즉시 반환합니다.',
      rows:[{label:'점프 경로',values:[8,4,3],selected:[2]},
        {label:'깊이',values:[7,3,2]},
        {label:'사용 점프 길이',values:[4,1]}],result:'LCA(8,3) = 3'});
}
