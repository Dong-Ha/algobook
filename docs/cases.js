// 실전 설계 과정: 기본 알고리즘을 반복 호출되는 문제에 연결합니다.
(() => {
const part='09 · 실전 문제 설계';
function add(id,title,short,lead,problem,example,sections,invariant,trap,complexity,code,q,options,answer,why,check){
 window.CHAPTERS.push({id,part,title,short,tag:'PRACTICAL DESIGN',lead,problem,example,sections,invariant,trap,complexity,code,quiz:{q,options,answer,why},check:check||['연산별 입력·출력·갱신 대상을 적었는가?','모든 보조 인덱스가 본체와 일치하는가?','작은 입력에서 느린 기준 풀이와 비교했는가?']});
}
window.CHAPTERS.push({
 id:'dp-patterns',part:'08 · 풀이 패턴 확장',title:'DP 확장: 선택 횟수와 방문 집합',short:'0/1 배낭 · 경우의 수 · 방문 집합 상태',tag:'DP PATTERNS',
 lead:'같은 배열 갱신도 반복 순서에 따라 다른 문제를 풀게 됩니다.',
 problem:'각 물건을 최대 한 번 사용해 용량 W 안에서 가치 합을 최대화하세요. 이어서 모든 도시를 한 번씩 방문하고 출발 도시로 돌아오는 최소 비용의 상태를 설계해 보세요.',
 example:'무게 [2,3], 가치 [4,5], W=4 → 한 번씩만 사용하면 최댓값 5. 무게 2를 두 번 사용한 가치 8은 허용되지 않습니다.',
 sections:[
 ['0/1 배낭은 용량을 역순으로','dp[c]를 용량 c 이하로 얻는 최대 가치로 정하면 처음은 모두 0입니다. 물건 무게 w, 가치 v에 대해 c를 W부터 w까지 내려가며 dp[c]=max(dp[c],dp[c−w]+v)를 수행합니다. 이때 dp[c−w]는 현재 물건을 쓰기 전 상태입니다. 오름차순으로 갱신하면 방금 같은 물건을 넣은 상태를 재사용하므로 무제한 배낭이 됩니다. 정확히 무게 c를 채워야 한다면 0 외의 상태를 불가능 값으로 초기화해야 합니다.'],
 ['최솟값과 경우의 수는 다른 전이','동전 최소 개수는 min으로 후보를 비교하지만 경우의 수는 더합니다. dp[0]=1로 두고 동전을 바깥, 금액을 안쪽 오름차순으로 돌면 순서를 무시한 조합을 셉니다. 금액을 바깥에서 돌고 모든 동전을 마지막 선택으로 더하면 순서가 다른 수열도 따로 셉니다. 동전 [1,2], 금액 3은 조합 2개(1+1+1,1+2), 순서 있는 경우 3개(1+1+1,1+2,2+1)입니다. 중복 동전 종류와 나머지 연산 규칙도 확인하세요.'],
 ['방문 집합과 마지막 위치','모든 도시를 한 번씩 방문하는 경로는 현재 도시만 저장하면 이전에 방문한 도시가 사라집니다. dp[mask][v]를 0번에서 시작해 mask의 도시를 방문하고 v에서 끝나는 최소 비용으로 둡니다. 방문하지 않은 u로 이동해 dp[mask|(1<<u)][u]를 완화합니다. 모두 방문한 상태에서는 v→0 간선까지 더해야 순회가 완성됩니다. 간선이 없으면 이동하지 않습니다.'],
 ['상태 수와 출력 요구','N개 도시의 방문 집합은 2^N개이고 마지막 도시가 N개이므로 O(N2^N) 공간, 각 전이를 모두 보면 O(N²2^N) 시간입니다. N이 조금만 커져도 불가능할 수 있습니다. 실제 순서까지 출력하려면 이전 상태를 기록하고, 경우의 수라면 비용의 min 대신 목적에 맞는 합 전이를 씁니다. 작은 N에서 모든 순열의 비용과 비교해 검증합니다.']
 ],
 invariant:'역순 배낭의 전이는 현재 물건을 쓰기 전 상태만 읽는다. 방문 집합 DP는 사용한 도시와 마지막 위치를 함께 보존한다.',
 trap:'0/1 배낭을 오름차순으로 갱신하면 한 물건을 여러 번 쓸 수 있습니다. dp[0]=0으로 경우의 수를 세면 아무 경우도 생성되지 않습니다.',
 check:['한 번만 사용하는가, 무제한인가?','정확한 용량인가, 용량 이하인가?','순서가 다른 경우를 별개로 세는가?','미래 결정을 위해 방문 집합이 필요한가?'],
 complexity:'0/1 배낭 O(NW) 시간·O(W) 공간, 순회 DP O(N²2^N) 시간·O(N2^N) 공간',
 code:`long long knapsack01(const vector<int>& w,const vector<int>& value,int cap) {
    vector<long long> dp(cap+1,0);
    for(int i=0;i<(int)w.size();++i)
        for(int c=cap;c>=w[i];--c) dp[c]=max(dp[c],dp[c-w[i]]+value[i]);
    return dp[cap];
}
long long shortestTour(const vector<vector<int>>& cost) { // -1: 없는 간선, 1<=N<=20
    int n=cost.size(); if(n==1) return 0;
    const long long INF=1LL<<60;
    vector<vector<long long>> dp(1<<n,vector<long long>(n,INF));
    dp[1][0]=0;
    for(int mask=1;mask<(1<<n);++mask) for(int v=0;v<n;++v)
        if(dp[mask][v]!=INF) for(int u=0;u<n;++u)
            if(!(mask&(1<<u))&&cost[v][u]>=0)
                dp[mask|(1<<u)][u]=min(dp[mask|(1<<u)][u],dp[mask][v]+cost[v][u]);
    long long ans=INF;
    for(int v=1;v<n;++v) if(cost[v][0]>=0&&dp.back()[v]!=INF)
        ans=min(ans,dp.back()[v]+cost[v][0]);
    return ans==INF?-1:ans;
}`,
 quiz:{q:'각 물건을 한 번만 쓰는 한 줄 배낭 DP의 용량 갱신 방향은?',options:['큰 용량부터 작은 용량으로','작은 용량부터 큰 용량으로','항상 같은 용량만'],answer:0,why:'역순으로 진행하면 현재 물건을 추가하기 전 상태를 읽어 같은 물건의 재사용을 막습니다.'}
});
add('api-design','API 문제: 한 번의 풀이에서 상태 설계로','초기화 · ID 매핑 · 다중 인덱스 · 호출량',
'함수 하나가 아니라, 긴 호출 순서 전체를 정확하고 빠르게 처리합니다.',
'init으로 초기화한 뒤 add, remove, query가 반복됩니다. 외부 ID는 최대 10억이지만 실제 등록 건수는 수천 개입니다. 어떻게 저장하고 검증할까요?',
'init → add(900000001) → query → remove → query → init: 마지막 초기화 뒤에는 이전 기록이 보이면 안 됩니다.',
[['시험 코드의 경계','제공되는 main은 입력을 읽고 API를 호출하며 반환값을 검사합니다. 제출할 user.cpp에는 요구된 함수 이름, 매개변수, 반환 타입을 정확히 맞춥니다. 직접 main을 추가하거나 진단 출력을 정답 출력에 섞지 않습니다. RESULT 구조체가 이미 제공되는지 확인하고 문자열 반환 버퍼의 수명과 널 종료도 점검합니다.'],
['외부 ID와 내부 저장 위치','큰 ID를 배열 인덱스로 쓰지 말고 unordered_map으로 연속 내부 인덱스에 매핑합니다. 조회에 operator[]를 사용하면 없는 ID가 0번으로 생길 수 있습니다. find로 존재를 확인합니다. 삭제된 ID를 재사용할 수 있다면 새 내부 레코드나 세대 번호를 부여하여 오래된 힙·버킷 항목과 구분합니다.'],
['본체 하나, 필요한 조회 인덱스 여러 개','레코드 본체는 vector, ID 조회는 해시, 우선순위 검색은 set·heap, 시간 만료는 시간 순서 큐처럼 역할을 분리합니다. 추가·삭제·상태 변경마다 무엇을 갱신하는지 표 대신 문장으로라도 적습니다. 비교 키를 변경할 때에는 set에서 먼저 지우고 수정 후 다시 넣습니다. 힙에서 중간 삭제가 어렵다면 활성 여부와 세대 번호를 검사하는 지연 삭제를 사용합니다.'],
['호출량까지 곱하기','한 번 O(N)인 함수도 N=10만, 호출 3만 번이면 수십억 번의 검사가 됩니다. 초기화 비용, 총 추가 수, 질의 횟수, 최대 살아 있는 원소 수를 따로 계산합니다. 삭제 플래그만 남기는 구현은 살아 있는 원소보다 누적 삽입 수에 비용이 의존합니다. 모든 만료 레코드를 한 번씩 처리하면 한 호출이 느려 보여도 전체로는 선형일 수 있습니다.'],
['검증은 호출 시나리오로','단일 질의가 맞는 것만 확인하지 않습니다. 초기화를 두 번 호출하고, 없는 ID 조회, 삭제 뒤 조회, 같은 우선순위, 빈 자료구조, 시간 경계, 재등록을 시험합니다. 작은 크기의 단순 vector 구현을 기준으로 난수 호출 순서를 만들어 모든 반환값을 비교하면 다중 인덱스의 누락을 찾기 좋습니다.']],
'조회 인덱스의 살아 있는 항목은 본체의 유효한 레코드를 정확히 가리킨다. init은 전체 상태를 새 시험으로 되돌린다.',
'없는 ID를 table[id]로 조회하면 기본값이 생성되어 다른 레코드를 삭제하거나 반환할 수 있습니다.',
'해시 조회 평균 O(1), 최악 O(R) · 레코드와 인덱스 공간 O(R)',
`struct Records {
    struct Item { int external; bool alive; };
    vector<Item> data;
    unordered_map<int,int> index;
    void init() { data.clear(); index.clear(); }
    void add(int id) {
        if (index.count(id)) return; // 중복을 무시하는 예제 정책
        index[id]=(int)data.size();
        data.push_back({id,true});
    }
    bool remove(int id) {
        auto it=index.find(id);
        if (it==index.end()) return false;
        data[it->second].alive=false;
        index.erase(it); return true;
    }
    bool contains(int id) const { return index.find(id)!=index.end(); }
};`,
'삭제 뒤 같은 외부 ID로 재등록할 수 있습니다. 오래된 힙 항목을 구별하는 안전한 방법은?',
['외부 ID만 같으면 그대로 사용','내부 레코드 번호 또는 세대 번호와 유효 여부 검사','힙의 크기만 비교'],1,'외부 ID가 같아도 등록 사건은 다릅니다. 현재 등록을 가리키는지 확인해야 합니다.');

add('number-editor','두 개의 큰 수 에디터','deque · 3자리 빈도 · 연결 경계',
'문자열 전체를 다시 읽지 않고, 새로 생긴 짧은 부분만 셉니다.',
'A와 B의 앞 또는 뒤에 각각 1~4자리 수를 붙입니다. 숫자 0은 등장하지 않습니다. 이어 붙인 A+B에서 주어진 3자리 수의 등장 횟수를 반환하세요. 초기 길이는 각각 최대 30,000, 붙이기와 질의는 각각 최대 30,000회입니다.',
'A=12121, B=21122 → A+B=1212121122: 121은 3회, 212는 2회. A+B는 산술 덧셈이 아니라 문자열 연결입니다.',
[['API와 기준 풀이','init(an,A,bn,B)는 자릿수 배열을 받습니다. append(dir,num1,num2)는 dir=0이면 두 줄 앞, 1이면 뒤에 수를 붙입니다. countNum(num)는 겹치는 등장도 셉니다. 매 질의마다 A+B 전체를 훑으면 누적 문자열 길이 × 질의 횟수가 병목입니다. 3자리 종류는 1000개 이하이므로 빈도 배열로 직접 관리할 수 있습니다.'],
['각 줄 안쪽과 두 줄 사이를 분리','A 내부 빈도와 B 내부 빈도의 합을 유지합니다. 질의 시 A 끝 두 자리와 B 처음 두 자리로 생기는 경계 창 두 개만 더합니다. 길이 3의 창은 A 내부, B 내부, A/B 경계 중 정확히 하나에 속합니다. 경계 빈도를 영구 저장하지 않으면 append마다 이전 경계를 빼는 실수도 줄어듭니다.'],
['붙이기로 새로 생기는 창','앞에 x를 붙이면 x+기존 첫 두 자리, 뒤에 x를 붙이면 기존 끝 두 자리+x만 훑습니다. 기존 부분만으로 된 3자리 창은 이 짧은 문자열에 없으므로 모두 새 창입니다. 한 자리 붙이기에서 1개, 두 자리에서 2개, 네 자리에서 4개의 새 창이 생깁니다. deque를 써서 앞 삽입 시 전체 이동을 피합니다.'],
['실행 예와 확인 순서','A=123, B=456이면 내부 123,456과 경계 234,345가 각각 1회입니다. A 앞에 7을 붙이면 내부 712가 새로 생기고 경계는 그대로입니다. B 앞에 8을 붙이면 B 내부 845가 늘고, 질의 때 경계는 238,384로 바뀝니다. 234,345를 이전 경계로 계속 더하지 않도록 확인하세요.']],
'cnt에는 두 줄 각각의 내부 창만 있다. countNum은 현재 A/B 경계 창을 별도로 센다.',
'앞에 123을 붙이면서 push_front(1), push_front(2), push_front(3) 순서로 실행하면 321이 됩니다. 역순으로 넣어야 합니다.',
'초기화 O(|A|+|B|), 붙이기 O(붙이는 자릿수), 질의 O(1) · 공간 O(누적 길이+1000)',
`struct NumberEditor {
    deque<char> a,b;
    array<int,1000> cnt{};
    static int key(char x,char y,char z) { return (x-'0')*100+(y-'0')*10+z-'0'; }
    void scan(const string& s) {
        for (int i=0;i+2<(int)s.size();++i) ++cnt[key(s[i],s[i+1],s[i+2])];
    }
    void init(const string& x,const string& y) {
        a=deque<char>(x.begin(),x.end()); b=deque<char>(y.begin(),y.end());
        cnt.fill(0); scan(x); scan(y);
    }
    void attach(deque<char>& d,const string& x,bool front) {
        string edge;
        if(front) { edge=x; for(int i=0;i<min(2,(int)d.size());++i) edge+=d[i]; }
        else { for(int i=max(0,(int)d.size()-2);i<(int)d.size();++i) edge+=d[i]; edge+=x; }
        scan(edge);
        if(front) for(auto it=x.rbegin();it!=x.rend();++it) d.push_front(*it);
        else for(char c:x) d.push_back(c);
    }
    void append(int dir,int x,int y) { attach(a,to_string(x),dir==0); attach(b,to_string(y),dir==0); }
    int countNum(int k) const {
        int ans=cnt[k]; string edge;
        for(int i=max(0,(int)a.size()-2);i<(int)a.size();++i) edge+=a[i];
        for(int i=0;i<min(2,(int)b.size());++i) edge+=b[i];
        for(int i=0;i+2<(int)edge.size();++i) ans+=key(edge[i],edge[i+1],edge[i+2])==k;
        return ans;
    }
};`,
'3자리 패턴을 셀 때 A/B 경계를 가로지르는 시작 위치는 최대 몇 개인가요?',
['1개','2개','문자열 길이만큼'],1,'A의 마지막 두 자리에서 시작하거나 마지막 한 자리에서 시작하는 두 경우입니다.');

add('tile-index','네모타일: 모양으로 후보 위치 좁히기','모양 인코딩 · 역색인 · 점유와 제거',
'모든 위치를 확인하기 전에, 정적 조건으로 후보를 모아 둡니다.',
'홀수 N(9~999)의 벽에 3×3 타일을 회전 없이 붙입니다. 다섯 돌출 위치 중 볼트가 최소 4개입니다. 타일 볼트는 같은 모양 벽 너트에, 타일 너트는 같은 모양 벽 볼트 또는 임의 모양 벽 너트에 맞아야 합니다. 다른 타일과 겹칠 수 없습니다.',
'벽 너트 모양 [1,2,3,4,5]에 타일 볼트 [1,2,3,4,5]는 맞습니다. 마지막 볼트가 모양 1이면 그 위치의 너트 5와 맞지 않습니다.',
[['API와 탐색 순서','init(N,info)는 변하지 않는 벽을 준비합니다. addRectTile(id,tile)는 가능한 위치를 행 우선·열 우선으로 선택해 row×10000+col을 반환하고, 실패하면 −1입니다. removeRectTile(id)는 붙어 있는 타일을 제거하며 없으면 무시합니다. 추가는 최대 20,000회여서 매번 약 N²/2개의 후보를 모두 검사하는 설계는 비쌉니다.'],
['다섯 모양을 하나의 키로','벽의 각 가능한 3×3 시작 위치를 다섯 돌출 위치의 값 순서로 인코딩하고 같은 키끼리 좌표 목록에 저장합니다. 값 1~15를 16진법 다섯 자리처럼 누적하면 충돌 없는 20비트 키입니다. 네 모서리와 중심의 순서를 고정하세요. 해시값처럼 우연한 충돌을 허용하는 표현이 아니라 작은 튜플의 정확한 인코딩입니다.'],
['왜 후보 모양이 최대 여섯 개인가','볼트가 5개인 타일은 벽 너트 모양이 모두 정해져 후보 키가 하나입니다. 볼트가 4개라면 나머지 타일 너트 위치에 같은 모양 벽 볼트 1종 또는 벽 너트 5종이 가능하여 키가 6개입니다. 이 목록의 좌표만 확인하고, 여러 키에서 얻은 후보 중 가장 작은 (row,col)을 고릅니다. 키 하나의 첫 빈 위치를 바로 반환하면 다른 키에 더 이른 좌표가 있을 수 있습니다.'],
['정적 적합성과 동적 점유','벽 모양 인덱스는 init에서 한 번 만듭니다. 붙인 타일의 실제 3×3 아홉 칸은 점유 배열과 id→좌표로 관리합니다. 후보의 다섯 돌출 칸만 비어 있다고 안전하지 않습니다. 제거할 때 그 타일의 아홉 칸만 해제하고 정적 모양 목록은 지우지 않습니다. 실패한 ID와 이미 제거한 ID는 점유를 바꾸지 않습니다.'],
['성능의 한계도 계산','후보 키가 적다는 사실이 좌표 수가 적다는 뜻은 아닙니다. 같은 모양이 벽 전체에 반복되면 한 버킷이 커질 수 있습니다. 먼저 역색인으로 불가능한 모양 검사를 제거한 뒤, 실제 제약에서 버킷 스캔 비용을 계산합니다. 필요하면 비어 있는 후보를 별도 관리하되 한 타일의 추가·제거가 겹치는 후보 위치에 미치는 영향을 모두 갱신해야 합니다.']],
'모양 인덱스는 벽의 정적 적합성을 보존하고, 점유 배열은 현재 붙인 모든 타일의 아홉 칸을 표시한다.',
'타일 제거 시 모양 버킷에서 위치를 영구 삭제하면, 그 위치에 다음 타일을 붙이지 못합니다.',
'전처리 O(N²), 추가 O(해당 키의 후보 수×9), 제거 O(9) · 공간 O(N²)',
`int shapeKey(const array<int,5>& a) {
    int key=0; for(int x:a) key=key*16+x; return key;
}
struct TileOccupancy {
    int n; vector<vector<int>> owner;
    unordered_map<int,pair<int,int>> placed;
    TileOccupancy(int n):n(n),owner(n,vector<int>(n,0)) {}
    bool freeAt(int r,int c) const {
        if(r<0||c<0||r+2>=n||c+2>=n) return false;
        for(int y=r;y<r+3;++y) for(int x=c;x<c+3;++x) if(owner[y][x]) return false;
        return true;
    }
    bool place(int id,int r,int c) { // 모양 검사를 통과한 후보에 호출, id>=1
        if(placed.count(id)||!freeAt(r,c)) return false;
        placed[id]={r,c};
        for(int y=r;y<r+3;++y) for(int x=c;x<c+3;++x) owner[y][x]=id;
        return true;
    }
    void remove(int id) {
        auto it=placed.find(id); if(it==placed.end()) return;
        auto [r,c]=it->second;
        for(int y=r;y<r+3;++y) for(int x=c;x<c+3;++x) owner[y][x]=0;
        placed.erase(it);
    }
};`,
'서로 다른 후보 모양 목록이 각각 (4,0)과 (2,8)을 반환했습니다. 무엇을 선택해야 하나요?',
['먼저 검색한 목록의 위치','행 우선 기준으로 (2,8)','열이 작은 (4,0)'],1,'후보 키 사이에서도 문제의 위치 우선순위를 적용해야 합니다.');

add('freight','화물운송: 경로의 가장 약한 간선','최대 병목 경로 · max-min 다익스트라',
'더하는 최단거리와, 가장 작은 용량을 최대화하는 경로를 구분합니다.',
'도시 0~N−1 사이의 단방향 도로에는 최대 중량 제한이 있습니다. 도로를 추가하면서 두 도시 사이 운송 가능한 최대 중량을 구하세요. N≤1000, 초기 도로≤4000, 추가≤2000, 질의≤300입니다.',
'0→1(20),0→2(50),2→1(40),1→3(30): 0→2→1→3의 병목은 min(50,40,30)=30입니다.',
[['API와 목표 함수','init(N,K,sCity,eCity,limit), add(sCity,eCity,limit), calculate(sCity,eCity)를 구현합니다. 같은 방향의 같은 도시 쌍 도로는 중복되지 않습니다. 경로가 감당하는 중량은 도로 제한의 최솟값이고, 정답은 모든 경로의 그 최솟값 중 최댓값입니다. 제한을 합하거나 가장 큰 간선 하나를 찾는 문제가 아닙니다.'],
['max-min 완화','best[v]를 시작점에서 v까지 가능한 최대 중량으로 둡니다. v→u의 제한이 w라면 후보는 min(best[v],w)이고 best[u]가 작을 때 갱신합니다. 최솟값 대신 최댓값 후보를 꺼내는 최대 힙을 사용합니다. 시작점은 병목을 제한하지 않도록 무한대로, 미도달은 0으로 둡니다. 제한은 양수이므로 여기의 핵심 예제는 도달 불가를 0으로 표현합니다. 실제 제출 반환 규약은 문제의 계약을 따릅니다.'],
['왜 큰 후보를 먼저 확정하나','어떤 경로를 연장해도 병목은 커질 수 없습니다. 아직 처리하지 않은 후보의 중량이 현재보다 작다면 그 후보에서 출발한 경로가 현재 값을 이길 수 없습니다. 이 단조성이 일반 다익스트라의 비음수 가중치 역할을 합니다. 최신 best와 다른 오래된 후보는 건너뜁니다.'],
['다른 풀이와 적용 조건','중량 C 이상 도로만 남긴 뒤 BFS로 연결 여부를 확인할 수 있습니다. C가 커질수록 도달 가능성은 줄어드므로 이분탐색도 가능합니다. 반복 질의에서 무방향 그래프라면 최대 신장 트리와 경로 최소값 질의가 대안이지만, 이 문제의 단방향 도로에 DSU만 적용하면 방향 조건을 잃습니다.']],
'best[v]는 실제 경로로 가능한 병목값이다. 가장 큰 최신 후보를 꺼내면 그 값은 최적이다.',
'0→1(100),1→2(1) 경로의 합은 101이지만 운송 한도는 1입니다.',
'질의 O((V+E) log(V+E)), 추가 O(1) 상각 · 공간 O(V+E)',
`int widest(const vector<vector<pair<int,int>>>& adj,int s,int t) {
    vector<int> best(adj.size(),0); priority_queue<pair<int,int>> pq;
    best[s]=INT_MAX; pq.push({best[s],s});
    while(!pq.empty()) {
        auto [cap,v]=pq.top(); pq.pop();
        if(cap!=best[v]) continue;
        if(v==t) return cap;
        for(auto [u,w]:adj[v]) {
            int next=min(cap,w);
            if(next>best[u]) { best[u]=next; pq.push({next,u}); }
        }
    }
    return 0; // 이 예제의 미도달 규약
}`,
'제한 50,40,30의 세 도로를 지나는 경로의 운송 한도는?',
['120','50','30'],2,'모든 도로를 통과해야 하므로 가장 작은 제한인 30입니다.');

add('road-failure','도로파괴: 최단경로의 민감도','경로 복원 · 간선 ID · 삭제 가정',
'하나의 도로가 사라질 때 얼마나 늦어지는지, 필요한 경우만 재계산합니다.',
'도시 수 5~1000, 초기 도로 수 7~5000, 이동 시간 1~1000인 단방향 그래프에서 도로를 추가·삭제합니다. 서로 다른 출발·도착 도시 사이에 한 도로를 파괴했을 때 출발~도착 최단거리 증가의 최댓값을 구하세요. 파괴로 이동할 수 없게 되는 경우 −1을 반환합니다.',
'0→1(2),1→3(2),0→2(3),2→3(3): 원래 4, 최단경로의 도로 하나를 막으면 6, 증가량은 2입니다.',
[['원래 최단경로 하나를 복원','init, add, remove는 영구적인 그래프 변경입니다. calculate의 도로 파괴는 질의 안에서만 가정합니다. 다익스트라 완화 성공 때 이전 정점뿐 아니라 이전 간선 ID도 기록합니다. 도착점에서 시작점까지 추적하면 한 개의 최단경로를 얻습니다. 미도달일 때는 경로 복원을 시작하지 않습니다.'],
['왜 그 경로의 간선만 검사하나','선택한 최단경로 밖의 간선을 파괴하면 그 경로가 그대로 남아 원래 거리로 갈 수 있습니다. 삭제는 거리를 줄이지 못하므로 증가량은 0입니다. 따라서 증가량이 양수이거나 단절을 일으키는 간선은 선택한 경로 안에 있어야 합니다. 다른 최단경로가 있어도 이 논리는 성립합니다.'],
['간선 ID로 제외하기','선택한 경로의 각 간선 ID를 하나씩 금지하고 다익스트라를 다시 실행합니다. 영구 삭제는 alive=false 또는 인접 목록 삭제로 처리하고 가정 삭제는 banned ID와의 비교로 처리합니다. 출발·도착 정점 쌍만 비교하면 평행 간선을 모두 막을 수 있으므로 재사용 가능한 설계에는 ID가 안전합니다. 같은 ID 재등록 여부와 삭제 입력 보장은 API 계약에서 확인합니다.'],
['단절과 증가량','한 번이라도 재계산이 미도달이면 −1입니다. 그 외에는 max(재계산 거리−원래 거리)를 취합니다. 원래 경로가 없으면 −1, 도로가 없는 길이 0 경로의 증가는 0으로 처리하는 식으로 경계 의미를 먼저 정합니다. 그래프 갱신 이후 이전 경로 캐시를 그대로 사용하지 않습니다.']],
'선택한 최단경로 밖의 도로가 없어져도 선택 경로는 남는다. 질의의 가정 삭제는 영구 그래프를 바꾸지 않는다.',
'한 번 금지한 간선을 되돌리지 않고 다음 재계산까지 계속 막으면 “도로 하나 파괴”가 아니라 여러 도로 파괴가 됩니다.',
'경로 간선 수 L에 대해 O((L+1)(V+E) log(V+E)) · 공간 O(V+E)',
`struct Road { int from,to; long long time; bool alive=true; };
long long maxDelay(int n,const vector<Road>& roads,int s,int t) {
    const long long INF=1LL<<62;
    vector<vector<int>> adj(n); vector<int> parent(n,-1);
    for(int i=0;i<(int)roads.size();++i) adj[roads[i].from].push_back(i);
    auto run=[&](int banned,bool record) {
        vector<long long> d(n,INF);
        priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<pair<long long,int>>> pq;
        d[s]=0; pq.push({0,s});
        while(!pq.empty()) {
            auto [cost,v]=pq.top(); pq.pop(); if(cost!=d[v]) continue;
            if(v==t) return cost;
            for(int id:adj[v]) {
                const auto& e=roads[id]; if(id==banned||!e.alive) continue;
                if(cost+e.time<d[e.to]) {
                    d[e.to]=cost+e.time; if(record) parent[e.to]=id;
                    pq.push({d[e.to],e.to});
                }
            }
        }
        return INF;
    };
    long long base=run(-1,true); if(base==INF) return -1;
    vector<int> path;
    for(int v=t;v!=s;) { int id=parent[v]; path.push_back(id); v=roads[id].from; }
    long long answer=0;
    for(int id:path) { long long d=run(id,false); if(d==INF) return -1; answer=max(answer,d-base); }
    return answer;
}`,
'선택한 최단경로 밖의 간선을 파괴했는데 거리가 증가할 수 있나요?',
['증가할 수 없다','항상 증가한다','간선 가중치가 클 때만 증가한다'],0,'선택한 최단경로가 그대로 남으므로 원래 거리로 갈 수 있습니다.');

add('ev-route','전기차여행: 배터리와 시간 제약','다중 시작점 · (도시,배터리) · 안전 시각',
'같은 도시라도 남은 자원이 다르면 다른 상태입니다.',
'단방향 도로에는 이동 시간과 전력 소모가 있고 도시는 1시간마다 일정량을 충전합니다. 용량 B의 배터리를 가득 채워 출발해, 감염된 도시에 도착하거나 머물지 않으면서 목적지까지 가는 최소 시간을 구하세요.',
'용량 3, 0→1 시간 2·소모 3, 1→2 시간 2·소모 2, 도시 1 충전량 2: 감염이 없다면 이동 2+충전 1+이동 2=5입니다.',
[['두 번의 최단경로','init(N,charge,K,id,s,e,time,power), add, remove로 도로를 관리하고 cost(B,s,e,M,seedCity,seedTime)로 질의합니다. 먼저 여러 감염 시작 도시와 각 시작 시간을 힙에 넣어 다중 시작점 다익스트라로 spread[v]를 구합니다. 감염도 현재 도로의 이동 시간을 따라 단방향으로 전파됩니다. 같은 감염 도시가 여러 번 주어지면 초기 시각의 최솟값을 취합니다.'],
['상태는 도시와 잔여 배터리','dist[v][b]는 배터리 b로 v에 안전하게 도착하는 가장 빠른 시간입니다. 도로 이동은 b≥소모량일 때만 가능하고, 다음 상태는 (u,b−소모량), 시간은 t+이동시간입니다. 충전은 (v,min(B,b+charge[v]))로 시간이 1 증가합니다. 위치만 방문 표시하면 빠르지만 배터리가 부족한 도착이, 조금 늦고 충분히 충전된 도착을 지워 버립니다.'],
['감염 경계는 엄격하게','안전하려면 도착시간<spread[u]이며 충전 완료 시각<spread[v]여야 합니다. 감염과 동시에 도착하는 상태는 허용하지 않습니다. 시작 도시가 시각 0에 감염되었다면 출발 상태도 안전하지 않습니다. 목표를 처음 발견했을 때가 아니라 최신 최소시간 상태를 힙에서 꺼냈을 때 종료합니다.'],
['지배 관계는 별도 최적화','같은 도시에서 더 이른 시각에 더 많은 배터리를 가진 상태는 더 늦고 배터리가 적은 상태를 지배할 수 있습니다. 그러나 dist를 “정확히 b”가 아닌 “적어도 b”로 바꿔 사용한다면 그 의미와 가지치기 규칙을 함께 증명해야 합니다. 먼저 명확한 2차원 상태 풀이로 정답을 만들고 필요할 때 최적화하세요. 아래 핵심 코드는 정확한 배터리 상태를 유지합니다.']],
'힙에 들어가는 모든 상태는 현재 시각에 안전하고 배터리가 0~B 사이이며, dist의 각 값은 실제 가능한 경로의 시간이다.',
'도시 1의 감염 시각이 3이면 시각 2 도착은 안전하지만 시각 3까지 충전하는 행동은 불가능합니다.',
'감염 O((V+E) log(V+E)), 차량 O((VB+EB) log(VB+EB)) · 공간 O(VB+E)',
`struct EVRoad { int to,time,power; };
vector<long long> infectionTimes(const vector<vector<EVRoad>>& adj,
                                const vector<pair<int,long long>>& seeds) {
    const long long INF=1LL<<62;
    vector<long long> d(adj.size(),INF);
    using P=pair<long long,int>;
    priority_queue<P,vector<P>,greater<P>> pq;
    for(auto [v,t]:seeds) if(t<d[v]) { d[v]=t; pq.push({t,v}); }
    while(!pq.empty()) {
        auto [t,v]=pq.top(); pq.pop(); if(t!=d[v]) continue;
        for(auto e:adj[v]) if(t+e.time<d[e.to]) {
            d[e.to]=t+e.time; pq.push({d[e.to],e.to});
        }
    }
    return d;
}
long long safeTrip(const vector<vector<EVRoad>>& adj,const vector<int>& charge,
                   const vector<long long>& spread,int B,int s,int goal) {
    const long long INF=1LL<<62;
    if(spread[s]<=0) return -1;
    vector<vector<long long>> d(adj.size(),vector<long long>(B+1,INF));
    using State=tuple<long long,int,int>;
    priority_queue<State,vector<State>,greater<State>> pq;
    d[s][B]=0; pq.push({0,s,B});
    auto relax=[&](int v,int b,long long t) {
        if(t<spread[v]&&t<d[v][b]) { d[v][b]=t; pq.push({t,v,b}); }
    };
    while(!pq.empty()) {
        auto [t,v,b]=pq.top(); pq.pop(); if(t!=d[v][b]) continue;
        if(v==goal) return t;
        for(auto e:adj[v]) if(b>=e.power) relax(e.to,b-e.power,t+e.time);
        if(b<B) relax(v,min(B,b+charge[v]),t+1);
    }
    return -1;
}`,
'시각 7에 감염되는 도시에 시각 7에 도착하는 상태는?',
['안전하다','불가능하다','배터리가 가득 차면 안전하다'],1,'도착시간은 감염 시각보다 엄격히 작아야 합니다.');

add('energy-route','에너지운송: 속성을 한 번 바꾸는 경로','비트 표현 · 비용 전처리 · 상태 확장',
'미래 비용을 바꾸는 정보까지 상태에 넣습니다.',
'양방향 파이프와 에너지는 각각 M개(6~50)의 P/W/D 속성을 가지며 D는 정확히 하나입니다. 서로 다른 속성 위치마다 비용 1, 어느 한쪽이 D인 위치는 항상 비용 1입니다. 운송 도중 한 번 에너지 전체 속성을 지나갈 파이프의 속성으로 바꿀 수 있습니다. 최소 운송 비용을 구하세요.',
'에너지 PWD와 파이프 PWD의 비용은 0이 아니라 1입니다. D 위치가 같아도 해당 위치에서는 반드시 비용이 듭니다.',
[['API와 변경 시점','init(N,M,K,id,a,b,attr), add, remove, transport(start,end,energyAttr)를 구현합니다. 속성 변경은 임의 문자열로 하는 것이 아니라 현재 지나갈 파이프의 속성을 채택하는 행동입니다. 채택 후에도 그 파이프를 통과하는 D 비용은 발생합니다. 변경하지 않은 채 끝까지 가는 경로도 후보입니다. 파이프 삭제는 양방향 탐색에서 모두 반영되어야 합니다.'],
['0번 상태와 변경한 파이프 번호','상태 (v,0)은 아직 변경하지 않았고 초기 속성을 유지합니다. 상태 (v,k), k>0은 k번 파이프의 속성으로 이미 변경했다는 뜻입니다. 파이프 e로 u에 갈 때 유지 전이는 (u,k)에 cost(attr[k],attr[e])를 더합니다. k=0일 때만 변경 전이 (u,e)에 cost(attr[e],attr[e])=1을 더할 수 있습니다. 번호 k는 마지막에 지나온 파이프가 아니라 현재 에너지 속성을 결정한 파이프입니다.'],
['비트로 비용 구하기','W 위치를 1, P 위치를 0으로 나타내고 D 위치는 따로 보관합니다. 두 W 마스크를 XOR하면 P/W 불일치이고, 양쪽 D 위치 비트를 OR로 켜면 D의 강제 비용까지 표현됩니다. 같은 D 위치를 두 번 세지 않도록 OR를 사용합니다. M≤50이면 uint64_t 한 개에 들어가며 C++17에서는 __builtin_popcountll을 사용할 수 있습니다. 1ULL<<pos로 부호 없는 넓은 시프트를 합니다.'],
['전처리와 새 간선','파이프 속성 쌍 비용을 전처리하면 탐색 중 매번 M글자를 비교할 필요가 없습니다. 간선 추가 시 새 파이프와 기존 파이프의 비용만 채우고, 질의 때 초기 속성과 모든 현재 파이프의 비용을 계산합니다. 삭제된 파이프를 실제로 이용할 수 없지만 그 속성 상태 캐시의 의미는 구분해서 관리합니다. 모든 비용이 0 이상이라 확장 상태 그래프에 다익스트라를 적용할 수 있습니다.'],
['실행 예와 반례','초기 PWD로 PWD 파이프를 지나면 유지와 변경 모두 첫 비용 1입니다. 뒤의 WPD 파이프를 유지하면 P/W 두 불일치와 D 비용으로 3을 냅니다. 첫 구간에서 속성을 바꾸는 선택과 다음 구간에서 바꾸는 선택의 후속 비용이 달라질 수 있으므로 도시별 거리 하나만 남기면 안 됩니다. 변경 상태는 한 번 정하면 다른 파이프로 다시 바꿀 수 없습니다.']],
'k=0은 변경 전, k>0은 해당 파이프의 속성으로 한 번 변경한 상태이다. 변경 전이의 허용 여부를 상태가 보존한다.',
'현재 도시와 마지막으로 통과한 파이프만 저장하고 매번 에너지 속성을 바꾸면 한 번 변경 제한을 위반합니다.',
'속성 비용 전처리 O(E²) 비트 연산, 질의 상태 수 O(VE), 전이 상한 O(E²), 공간 O(VE+E²)',
`struct Attr { unsigned long long w; int d; };
Attr encode(const string& s) {
    Attr a{0,-1};
    for(int i=0;i<(int)s.size();++i) {
        if(s[i]=='W') a.w|=1ULL<<i;
        if(s[i]=='D') a.d=i;
    }
    return a; // 입력은 D가 정확히 하나, 길이<=50
}
int attrCost(Attr a,Attr b) {
    return __builtin_popcountll((a.w^b.w)|(1ULL<<a.d)|(1ULL<<b.d));
}
int energyCost(int n,const vector<pair<int,int>>& ends,
               const vector<Attr>& pipes,const vector<bool>& alive,
               int s,int goal,Attr initial) {
    int m=pipes.size(),INF=1000000000;
    vector<Attr> attr{initial}; attr.insert(attr.end(),pipes.begin(),pipes.end());
    vector<vector<pair<int,int>>> adj(n);
    for(int i=0;i<m;++i) if(alive[i]) {
        auto [a,b]=ends[i]; adj[a].push_back({b,i+1}); adj[b].push_back({a,i+1});
    }
    vector<vector<int>> d(n,vector<int>(m+1,INF));
    using S=tuple<int,int,int>; priority_queue<S,vector<S>,greater<S>> pq;
    d[s][0]=0; pq.push({0,s,0});
    auto relax=[&](int v,int k,int c) { if(c<d[v][k]) { d[v][k]=c; pq.push({c,v,k}); } };
    while(!pq.empty()) {
        auto [c,v,k]=pq.top(); pq.pop(); if(c!=d[v][k]) continue;
        if(v==goal) return c;
        for(auto [u,e]:adj[v]) {
            relax(u,k,c+attrCost(attr[k],attr[e]));
            if(k==0) relax(u,e,c+attrCost(attr[e],attr[e]));
        }
    }
    return -1;
}`,
'같은 속성 PWD를 가진 에너지와 파이프 사이 비용은?',
['0','1','3'],1,'D는 비교 대상이 무엇이든 비용 1이고 나머지 두 위치는 같습니다.');
window.CHAPTERS.find(c=>c.id==='backtrack').sections.push(['순열과 조합을 구분하기','순서가 중요하면 순열, 고른 원소의 집합만 중요하면 조합입니다. N개 중 K개를 고르는 조합 재귀는 다음 위치를 이전보다 크게 하여 같은 집합의 순서만 다른 중복을 막습니다. 서로 다른 N개 전체 순열은 N!개여서 작은 N에만 가능합니다. 정렬한 배열에서 next_permutation을 반복하면 사전순 순열을 만들 수 있고 같은 값의 중복 순열도 피할 수 있습니다. 원본 값이 같아도 위치를 별개로 세는 문제인지 먼저 정하세요.']);
window.MIXED.push(
 {q:'새로 등록한 객체가 1000개인데 외부 ID는 최대 10억입니다. 가장 직접적인 저장 설계는?',options:['ID 크기의 배열','해시로 외부 ID를 연속 내부 인덱스에 매핑','매번 전체 ID 정렬'],answer:1,why:'실제 레코드 수에 비례하는 메모리를 쓰면서 외부 ID를 빠르게 조회할 수 있습니다.'},
 {q:'앞뒤에 문자열을 붙이고 고정 길이 패턴을 반복 질의합니다. 줄일 수 있는 반복은?',options:['매 질의마다 전체 검색','새로 생긴 짧은 경계 창만 빈도 갱신','모든 문자열을 정수로 변환'],answer:1,why:'기존 내부 창은 그대로 유지되며 새 창만 추가됩니다. 전체 연결 경계는 별도로 처리합니다.'},
 {q:'벽의 모양은 고정이고 타일은 반복해서 붙였다 뗍니다. 무엇을 분리해야 하나요?',options:['정적 모양 후보와 동적 점유','벽을 매번 초기화','타일 ID와 벽 크기를 같은 인덱스로 사용'],answer:0,why:'모양으로 후보를 좁힌 후 현재 겹침을 확인합니다. 제거는 점유만 되돌립니다.'},
 {q:'도로의 중량 제한을 지키며 최대 화물을 운송합니다. 경로 연장의 후보 값은?',options:['현재 중량+도로 제한','max(현재 중량,도로 제한)','min(현재 중량,도로 제한)'],answer:2,why:'경로의 가장 약한 도로가 한도를 결정합니다. 이 병목값을 가능한 경로 사이에서 최대화합니다.'},
 {q:'감염 전까지 도착해야 하고 도시마다 충전 속도가 다릅니다. 최단경로에서 보존할 정보는?',options:['도시만','도시와 배터리, 각 상태의 최소 시각','도착 순서만'],answer:1,why:'배터리는 미래 이동 가능성을 바꾸며 시각은 안전 조건을 결정합니다.'},
 {q:'에너지 속성을 한 번만 바꿀 수 있습니다. 변경 뒤 상태에 필요한 것은?',options:['현재 속성을 정한 파이프 번호','마지막으로 지나온 도시만','현재 비용만'],answer:0,why:'변경한 속성이 다음 파이프의 통과 비용을 결정합니다. 변경 여부도 함께 보존합니다.'},
 {q:'같은 접미사 차량 검색에 set을 쓰고 견인 시 검색 우선순위가 바뀝니다. 갱신 순서는?',options:['키 변경 후 erase','이전 키 erase → 상태 변경 → 새 키 insert','상태만 수정'],answer:1,why:'트리 내부의 정렬은 가변 필드를 바꾸어도 자동으로 다시 만들어지지 않습니다.'},
 {q:'대기열 묶음 전체가 로그인됐지만 개별 사용자 플래그는 그대로입니다. 대기 여부는?',options:['사용자 플래그만 확인','사용자와 묶음의 활성 여부를 함께 확인','사용자 번호의 크기만 확인'],answer:1,why:'묶음 단위 제거와 개별 취소가 섞이므로 두 조건이 모두 필요합니다.'},
 {q:'삭제 가능한 사전의 k번째 단어를 빠르게 찾고 싶습니다. Trie에 추가할 정보는?',options:['노드의 깊이만','각 노드의 활성 하위 단어 수','부모 문자만'],answer:1,why:'앞에 있는 하위 트리의 단어 수만큼 건너뛰어 k번째 단어가 속한 가지를 고릅니다.'}
);
})();
