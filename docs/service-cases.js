window.CHAPTERS.push(
  {
    id: "parkingcase",
    part: "09 · 실전 문제 설계",
    title: "기계식 주차장: 시간과 우선순위 인덱스",
    short: "만료 처리 · 슬롯 힙 · 변경 가능한 set 키",
    tag: "STATEFUL API",
    lead: "한 차량의 상태가 바뀌면, 그 차량을 찾는 모든 인덱스도 함께 바뀌어야 합니다.",
    problem: "구역별 슬롯을 배정하고, 일정 시간 뒤 견인하며, 차량 번호 일부로 우선순위 검색을 수행하는 관리기를 설계하세요.",
    example: "N=2, M=2에서 12A3456은 A000, 34B3456은 B000에 입차하고 다음 차량은 빈 칸 수가 같은 A 구역의 A001을 받습니다. L=500, 시각 10에 입차한 차량을 시각 515에 출차하면 견인 뒤 5분 요금까지 포함해 −525를 반환합니다.",
    sections: [
      [
        "문제 API와 선택 규칙",
        "외부 API는 RESULT_E enter(mTime,mCarNo), int pullout(mTime,mCarNo), RESULT_S search(mTime,mStr)이며 init(N,M,L)로 초기화합니다. N은 2~26개 구역, M은 구역마다 2~1000칸, L은 500~100000분이고 mTime은 1~10000000 범위에서 매 호출 증가합니다. 입차는 빈 칸이 가장 많은 구역, 동률이면 알파벳이 빠른 구역, 그 안에서 번호가 가장 작은 빈 칸을 고릅니다. 차량 번호는 두 자리 숫자·영문 대문자·네 자리 숫자 형식입니다. enter는 성공 시 위치, 실패 시 success=0을 반환합니다. pullout은 주차 중이면 체류 시간, 견인 후면 −L−5×(체류 시간−L), 기록이 없으면 −1입니다. search는 끝 네 자리가 mStr인 우선순위 상위 다섯 대와 개수를 반환합니다.",
      ],
      [
        "하나의 차량, 여러 인덱스",
        "차량 번호에서 현재 레코드를 찾는 해시 맵, 끝 네 자리가 같은 검색 후보를 정렬하는 집합, 구역별 최소 슬롯 힙을 둡니다. 검색은 주차 차량 우선, 앞의 두 숫자 오름차순, 가운데 알파벳 오름차순입니다. 견인 시 슬롯은 반환하지만 검색에는 남습니다. 견인 상태에서 같은 번호가 다시 입차하면 이전 견인 기록을 검색 인덱스와 ID 맵에서 지운 뒤 새 입차 기록을 만듭니다. 실제 출차 차량도 검색 대상에서 빠집니다."
      ],
      [
        "비교 키를 바꾸기 전에 set에서 제거",
        "std::set은 원소를 넣을 때 비교 결과로 위치를 정합니다. 비교 함수가 차량 레코드의 가변 상태를 읽는데 set 안에서 레코드를 직접 바꾸면 트리의 물리적 위치와 새 정렬 순서가 달라져 검색·삭제가 깨질 수 있습니다. 반드시 기존 키를 erase하고, 상태를 바꾼 뒤, 새 키를 insert합니다. 정렬 우선순위와 마지막 동률 기준까지 키에 명시하면 결과가 결정적입니다.",
      ],
      [
        "시간이 흐를 때 만료를 한 번만 처리",
        "모든 API 진입 시 update(mTime)을 먼저 수행합니다. 호출 때마다 mTime이 증가하고 입차 기록도 그 순서로 쌓이므로 head 포인터가 만료 레코드를 한 번씩 처리할 수 있습니다. 입차 후 L분이 지난 시각부터 견인됩니다. 시간이 뒤섞이는 일반화된 문제라면 만료 시각 최소 힙과 재입차 세대 번호를 사용하세요."
      ],
      [
        "용량·복잡도와 경계 사례",
        "입차는 최대 70000회, 출차 40000회, 검색 50000회입니다. 빈 슬롯 힙 초기화는 O(NM log M), 차량 인덱스 갱신은 O(log A), 접미사 검색은 결과 다섯 대를 출력해 O(5)입니다. 구역 선택은 N≤26이므로 선형 비교가 충분합니다. 같은 차량 재입차 시 견인 기록을 지운 뒤 새 기록을 만들고, 슬롯 없음·정확히 만료·결과 0개·이미 견인된 차량 출차를 확인하세요."
      ]
    ],
    invariant: "각 활성 차량은 정확히 한 상태(주차·견인)에 있고, 주차 상태만 슬롯 하나를 점유한다. ID 맵과 접미사 검색 인덱스에는 활성 차량이 각각 정확히 한 번 존재한다.",
    trap: "set에 들어 있는 레코드의 우선순위 필드를 먼저 바꾸면 set 내부 순서는 자동으로 재정렬되지 않습니다.",
    check: [
      "모든 API에서 시각 만료를 먼저 반영하고 증가하는 mTime 조건을 활용하는가?",
      "상태가 바뀌는 레코드를 정렬 인덱스에서 먼저 지우는가?",
      "슬롯은 반환했고 검색 인덱스는 갱신했으며 ID 맵은 유지했는가?",
      "동률 순서와 정확히 만료되는 경계를 문제 명세대로 처리하는가?"
    ],
    complexity: "A회 입차 기준 공간 O(A+NM), 정렬 인덱스 갱신 O(log A), 접미사 검색 결과 5개 출력 O(5), 구역 선택 O(N). 만료 레코드는 head 포인터로 전체 입차 수에 걸쳐 한 번씩만 처리합니다.",
    code: "// 핵심 로직 예시: 외부 API의 구조체·문자열 변환은 별도로 연결합니다.\nstruct Car {\n    int enterTime, slot, state, frontKey, suffix, generation;\n    string number;\n};\nusing SearchKey = tuple<int,int,int>; // 상태 우선순위, 앞번호, 고유 ID\nvector<Car> cars;\nunordered_map<string,int> activeId;\nset<SearchKey> bySuffix[10000];\n\nvoid changeState(int id, int newState) {\n    Car& c = cars[id];\n    SearchKey oldKey{c.state, c.frontKey, id};\n    bySuffix[c.suffix].erase(oldKey); // 먼저 이전 키를 제거\n    c.state = newState;\n    SearchKey newKey{c.state, c.frontKey, id};\n    bySuffix[c.suffix].insert(newKey);\n}\n\n// 만료된 주차 차량 하나를 견인 상태로 전환하는 핵심\nvoid tow(int id, vector<priority_queue<int, vector<int>, greater<int>>>& freeSlots) {\n    Car& c = cars[id];\n    if (c.state != 0) return;\n    freeSlots[c.slot / 1000].push(c.slot % 1000);\n    c.slot = -1;\n    changeState(id, 1);\n}\n\n// 접미사 검색: 정렬 순서대로 최대 limit개 ID 수집\nvector<int> topCars(int suffix, int limit) {\n    vector<int> out;\n    if (limit <= 0) return out;\n    for (auto key : bySuffix[suffix]) {\n        out.push_back(get<2>(key));\n        if ((int)out.size() == limit) break;\n    }\n    return out;\n}",
    quiz: {
      q: "접미사별 std::set의 비교 키가 차량 상태를 참조합니다. 주차 차량을 견인 상태로 바꿀 때 안전한 순서는?",
      options: [
        "상태를 바꾼 뒤 set에서 erase하고 다시 insert한다",
        "이전 키로 erase한 뒤 상태를 바꾸고 새 키로 insert한다",
        "상태만 바꾸면 set이 자동으로 정렬된다"
      ],
      answer: 1,
      why: "set의 트리 구조는 삽입 당시의 비교 순서에 맞춰져 있습니다. 가변 비교 키는 기존 원소를 제거한 뒤 변경해야 합니다."
    }
  },
  {
    id: "loginqueuecase",
    part: "09 · 실전 문제 설계",
    title: "로그인 대기열: 배치와 등수",
    short: "취소 · 부분 로그인 · 서버 재정렬 · 버킷",
    tag: "ORDERED MUTATION",
    lead: "대기열에서 중요한 것은 빠른 앞 삭제만이 아니라 임의 취소와 특정 사용자의 등수입니다.",
    problem: "여러 서버 중 대기 인원이 가장 적은 곳에 ID 묶음을 추가하고, 취소·로그인·서버 장애 재등록 후 특정 ID의 대기 번호를 구하세요.",
    example: "서버 1 대기 [a,b], 서버 2 대기 [c] → d,e 추가는 서버 2 선택, 전체 순서는 [a,b,c,d,e]",
    sections: [
      [
        "API 동작과 동률 규칙",
        "외부 API는 init(N), tryAccess(K,mIDs), deAccess(K,mIDs), logIn(mCnt), reOrder(serverID), waitOrder(mID)입니다. tryAccess는 현재 대기 인원수가 가장 적은 서버를 고르고, 동률이면 서버 번호가 작은 곳을 택해 ID를 입력 순서대로 추가합니다. logIn은 전체 순서의 앞 mCnt명을, deAccess는 주어진 ID만 취소합니다. reOrder는 해당 서버의 대기자를 기존 순서대로 전체 대기열 뒤에 옮기며, waitOrder는 대기 중인 사용자의 1-based 순번을 반환하고 아니면 0입니다.",
      ],
      [
        "개별 노드 대신 추가 묶음을 저장",
        "한 번의 tryAccess로 들어온 ID는 같은 서버에 연속해서 들어오므로 하나의 Bucket으로 묶습니다. Bucket은 사용자 순서, 활성 인원수, 서버 ID, 전체 대기열 위치, 서버별 대기열 위치를 가집니다. 사용자는 ID에서 사용자 레코드를 찾고 그 레코드가 속한 Bucket을 가리킵니다. 전체와 서버별 순서는 list로 관리해 중간 삭제와 뒤로 옮기기를 상수 시간에 합니다."
      ],
      [
        "두 활성 플래그와 카운터를 함께 갱신",
        "사용자가 살아 있는 조건은 user.active && bucket.active입니다. 개별 취소나 부분 로그인은 user.active를 내리고 Bucket의 liveCount와 서버의 waitingCount를 하나씩 줄입니다. Bucket 전체를 로그인 처리하면 bucket.active를 내리고 남은 liveCount만큼 서버 수와 등수 집계에서 한 번에 뺍니다. 이미 취소된 사용자를 다시 빼거나 죽은 Bucket을 순위에 포함하지 않도록 각 전이의 카운터 효과를 한 곳에 모으세요."
      ],
      [
        "list iterator와 서버 재정렬",
        "Bucket은 전체 대기열과 서버 대기열에 각각 별도 list 노드로 존재하고, 두 iterator를 보관합니다. 전체 순서를 바꿀 때 한 list의 iterator를 다른 list에 옮길 수는 없습니다. 기존 전체 list에서 erase한 뒤 끝에 insert하고, 반환된 새 iterator를 Bucket에 저장합니다. 서버 list의 순서는 그대로 유지합니다."
      ],
      [
        "waitOrder 가속과 성능 계산",
        "가장 단순한 등수 계산은 앞 Bucket과 그 안의 활성 사용자를 모두 세므로 O(B+K)입니다. 구현 예시는 대기 인원 약 1000명 단위로 순서 그룹을 만들고, 그룹별 대기 수 합으로 앞 그룹을 건너뜁니다. 조회 비용은 앞 그룹 수, 목표 그룹 안에서 실제 순회한 Bucket 수, 목표 Bucket의 활성 사용자 수에 비례합니다. 취소된 ID나 빈 Bucket도 남을 수 있고 재정렬은 그룹을 옮기므로 B/G로 단정하지 말고 실제 방문 그룹·Bucket 수와 재분류 횟수를 계측하세요."
      ],
      [
        "혼합 상태를 검증하기",
        "한 Bucket의 앞 ID 일부만 취소한 뒤 로그인, 전부 취소된 Bucket 뒤에 다른 사용자를 추가, 이미 취소된 ID 조회, 서버가 여러 Bucket을 가진 상태에서 reOrder, 동률 서버 선택을 작은 예제로 추적합니다. 각 단계에서 전체 순서, 서버별 수, Bucket별 활성 수, 그룹 합계가 같은 활성 사용자 집합을 나타내는지 대조하세요."
      ]
    ],
    invariant: "사용자가 대기 중이면 사용자와 Bucket이 모두 활성이고 정확히 한 서버·전체 대기열에 포함된다. 서버별 대기 수, Bucket liveCount의 합, 그룹별 인원 합은 각각 활성 ID 수와 같다.",
    trap: "부분 취소 뒤 Bucket 자체를 비활성화하면 남아 있는 다른 ID까지 대기열에서 사라집니다.",
    check: [
      "서버 선택을 (대기 인원, 서버 번호) 사전식 최소로 구현했는가?",
      "부분 변경은 사용자와 모든 관련 카운터만 갱신하는가?",
      "전체 Bucket 제거와 개별 사용자 제거를 구분하는가?",
      "list에서 위치를 옮긴 뒤 저장 iterator를 새 위치로 갱신하는가?"
    ],
    complexity: "서버 선택 O(N), ID 묶음 추가·개별 취소 O(K), 전 Bucket 로그인은 제거된 Bucket 수에 비례합니다. 등수 조회는 앞 그룹 수 + 목표 그룹에서 실제 순회한 Bucket 수 + 목표 Bucket 내 사용자 수에 비례합니다. 공간은 사용자·Bucket·인덱스에 O(U+B)이며 그룹 조회·재분류 횟수도 계측해야 합니다.",
    code: "struct User { int bucket; bool active; };\nstruct Bucket {\n    int server, liveCount;\n    bool active;\n    vector<int> users;\n    list<int>::iterator allPos, serverPos;\n};\nvector<User> users;\nvector<Bucket> buckets;\nlist<int> allWaiting;\nvector<list<int>> serverBuckets;\nvector<int> serverCount;\n\nvoid moveServerBucketsToBack(int server) {\n    for (int b : serverBuckets[server]) {\n        Bucket& x = buckets[b];\n        allWaiting.erase(x.allPos);\n        x.allPos = allWaiting.insert(allWaiting.end(), b);\n        // 그룹 순위 집계를 쓰면 여기서 이전 liveCount를 빼고\n        // 새 그룹을 지정한 뒤 새 그룹에 더한다.\n    }\n}\n\nvoid cancelUser(int uid) {\n    User& u = users[uid];\n    if (!u.active) return;\n    Bucket& b = buckets[u.bucket];\n    if (!b.active) return;\n    u.active = false;\n    --b.liveCount;\n    --serverCount[b.server];\n    // 그룹별 등수 합계를 유지한다면 해당 그룹에서도 1 감소시킨다.\n}\n\nbool isWaiting(int uid) {\n    const User& u = users[uid];\n    return u.active && buckets[u.bucket].active;\n}",
    quiz: {
      q: "사용자 일부만 취소된 Bucket에서 나머지 ID는 계속 대기 중입니다. 취소된 한 명을 처리할 때 바꿔야 하는 것은?",
      options: [
        "Bucket 전체를 비활성화한다",
        "그 사용자와 liveCount, 서버 수 및 순위 집계만 갱신한다",
        "전체 대기열에서 Bucket 노드를 제거한다"
      ],
      answer: 1,
      why: "Bucket 안의 나머지 사용자는 여전히 살아 있습니다. 개별 취소는 해당 사용자와 파생 카운터만 반영합니다."
    }
  },
  {
    id: "dictionarycase",
    part: "09 · 실전 문제 설계",
    title: "단어 사전: 사전순 순위와 페이지",
    short: "Trie subtree count · k번째 단어 · 정렬 버킷",
    tag: "ORDER STATISTICS",
    lead: "페이지는 정렬된 단어들의 순위 구간이므로, 단어를 찾는 것과 순위를 세는 것을 함께 설계합니다.",
    problem: "유일한 소문자 단어를 추가·삭제하면서 한 페이지의 첫 단어를 찾고, 주어진 단어가 어느 페이지에 있는지 계산하세요.",
    example: "페이지 크기 3, 사전 [ant, ape, bat, bee, cat] → 2페이지 첫 단어 bee, cat은 2페이지",
    sections: [
      [
        "정확한 API와 순위 공식",
        "외부 API는 init(N,wordList,count), addWord(wordList,count), removeWord(wordList,count), findWord(page), findPage(word)입니다. 단어는 길이 1~10의 소문자이며 사전에 중복 없이 들어오고, 삭제·조회 단어와 요청 페이지는 유효하다는 전제입니다. 1-based 순위 r의 페이지는 (r−1)/N+1입니다. findWord(page)는 r=(page−1)N+1번째 단어를 반환합니다."
      ],
      [
        "Trie에 부분 트리 단어 수를 저장",
        "각 노드의 subtreeCount를 그 접두사 아래에 있는 단어 수로 둡니다. 삽입·삭제 때 루트부터 끝 노드까지 수를 증감하고, 끝 노드에는 실제 단어 여부를 저장합니다. 사전순 k번째 단어를 찾을 때 a부터 z까지 자식 수를 빼며 들어가고, 현재 노드가 단어 끝이면 자식보다 먼저 한 순위를 차지합니다."
      ],
      [
        "단어의 순위는 앞선 가지의 합",
        "문자열을 왼쪽부터 따라가며 현재 문자보다 작은 자식들의 subtreeCount를 더합니다. 그 경로의 접두사 자체가 단어라면 다음 문자로 내려가기 전에 그 단어도 앞 순위에 포함합니다. 마지막에 얻은 1-based 순위를 페이지 공식에 넣습니다. 접두사 자체가 단어인 경우와 더 긴 단어가 그 아래에 있는 경우가 대표 경계입니다.",
      ],
      [
        "고정 길이 접두사 정렬 버킷 대안",
        "다른 풀이에서는 처음 세 글자까지의 접두사별 단어 수를 1·2·3글자 계층 카운터로 유지하고, 같은 3글자 접두사 안의 단어 키만 정렬 vector에 저장합니다. 전체 순위는 앞선 접두사 카운터를 더한 뒤 해당 vector의 lower_bound 위치를 더합니다. k번째 검색은 계층 카운터로 접두사를 선택하고 마지막 vector에서 남은 순번을 찾습니다. 각 수정은 카운터 O(1)과 버킷의 이진 탐색에 더해 vector 이동 O(B)이므로, 실제 버킷 크기와 수정/조회 비율을 보고 Trie와 비교합니다."
      ],
      [
        "자료구조 선택과 오류 점검",
        "Trie는 길이 L에 대해 경로 갱신 O(L), 순위 질의는 각 글자에서 알파벳 26개를 검사해 O(26L)이며 노드마다 26개 자식 칸을 쓰는 메모리 비용이 있습니다. 희소 자식 표현은 메모리를 줄이는 대신 조회 비용이 달라집니다. 정렬 버킷은 앞 세 글자 분포가 고르면 작고 단순하지만 한 버킷에 단어가 몰리면 삽입·삭제의 vector 이동이 커집니다. 삭제 시 지나가는 노드 수를 줄이고 끝 표시를 내리며, 빈 자식 노드 제거는 선택적 메모리 최적화입니다.",
      ]
    ],
    invariant: "Trie의 subtreeCount는 해당 접두사를 가진 현재 단어 수이며, 모든 자식 수의 합과 현재 노드의 terminal 여부를 합한 값과 같다.",
    trap: "현재 Trie 노드가 단어 끝인지 먼저 확인하지 않으면 `a`는 `aa`보다 사전순으로 앞선다는 규칙을 놓칩니다.",
    check: [
      "노드 자체의 terminal 단어를 자식 가지보다 먼저 세는가?",
      "추가와 삭제에서 루트부터 모든 경로 카운터를 정확히 바꾸는가?",
      "1-based 순위와 페이지 변환의 빼기 1을 일관되게 적용하는가?",
      "정렬 버킷의 검색 비용뿐 아니라 vector 삽입 이동량도 계산했는가?"
    ],
    complexity: "Trie: 수정 O(L), findPage·findWord O(26L), 공간 O(26V) 칸(V는 생성 노드 수). 접두사 정렬 버킷: 1·2·3글자 고정 카운터면 순위 탐색 O(26·3+log B), 수정 O(log B+B) 이동. 아래 map 예시는 접두사 조회 O(log P)를 더해 순위 O(log P+log B), 수정 O(log P+log B+B)이며 공간 O(U+P)입니다.",
    code: "struct Node {\n    array<int,26> child;\n    int subtreeCount = 0;\n    bool terminal = false;\n    Node() { child.fill(-1); }\n};\nvector<Node> trie(1);\n\nvoid addWord(const string& s) {\n    int v = 0;\n    ++trie[v].subtreeCount;\n    for (char ch : s) {\n        int c = ch - 'a';\n        if (trie[v].child[c] == -1) {\n            trie[v].child[c] = (int)trie.size();\n            trie.emplace_back();\n        }\n        v = trie[v].child[c];\n        ++trie[v].subtreeCount;\n    }\n    trie[v].terminal = true;\n}\n\nvoid removeWord(const string& s) {\n    int v = 0;\n    --trie[v].subtreeCount;\n    for (char ch : s) {\n        v = trie[v].child[ch - 'a']; // 삭제 단어는 존재한다는 API 전제\n        --trie[v].subtreeCount;\n    }\n    trie[v].terminal = false;\n}\n\n// k는 1-based. 입력 페이지가 존재한다는 전제를 사용합니다.\nstring kthWord(int k) {\n    string out;\n    int v = 0;\n    while (true) {\n        if (trie[v].terminal && --k == 0) return out;\n        for (int c = 0; c < 26; ++c) {\n            int u = trie[v].child[c];\n            int count = (u == -1 ? 0 : trie[u].subtreeCount);\n            if (k > count) k -= count;\n            else { out.push_back(char('a' + c)); v = u; break; }\n        }\n    }\n}\n\nint oneBasedRank(const string& s) {\n    int rank = 1, v = 0;\n    for (char ch : s) {\n        if (trie[v].terminal) ++rank; // 접두사 단어가 현재 단어보다 먼저\n        int c = ch - 'a';\n        for (int x = 0; x < c; ++x) {\n            int u = trie[v].child[x];\n            if (u != -1) rank += trie[u].subtreeCount;\n        }\n        v = trie[v].child[c];\n    }\n    return rank; // 문제는 s가 존재한다고 보장\n}\n\nint pageOf(const string& s, int wordsPerPage) {\n    return (oneBasedRank(s) - 1) / wordsPerPage + 1;\n}\n\n// 대안 인덱스 핵심: 세 글자 접두사별 정렬 벡터\nmap<string, vector<string>> buckets;\nstring prefix3(const string& s) { return s.substr(0, min<size_t>(3, s.size())); }\nvoid bucketAdd(const string& s) {\n    auto& v = buckets[prefix3(s)];\n    v.insert(lower_bound(v.begin(), v.end(), s), s);\n}\nvoid bucketRemove(const string& s) {\n    auto& v = buckets[prefix3(s)];\n    v.erase(lower_bound(v.begin(), v.end(), s)); // 단어는 존재한다는 전제\n}\nint rankInsideBucket(const string& s) {\n    const auto& v = buckets.at(prefix3(s));\n    return (int)(lower_bound(v.begin(), v.end(), s) - v.begin());\n}\n// 전체 순위는 상위 접두사 계층의 카운터 합 + rankInsideBucket(s) + 1.",
    quiz: {
      q: "사전에 `a`와 `ant`가 있을 때 사전순 첫 단어는?",
      options: [
        "ant",
        "a",
        "삽입 순서에 따라 달라진다"
      ],
      answer: 1,
      why: "문자열이 접두사 관계이면 더 짧은 단어가 먼저 옵니다. k번째 Trie 탐색에서 terminal을 자식보다 먼저 세어야 합니다."
    }
  }
);
