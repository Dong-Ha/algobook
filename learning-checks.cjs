const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const context = { window: {} };
vm.createContext(context);
for (const file of ['content.js', 'advanced.js', 'cases.js', 'service-cases.js', 'exercises.js', 'learning.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'docs', file), 'utf8'), context, { filename: file });
}
const chapters = context.window.CHAPTERS;
const byId = new Map(chapters.map(chapter => [chapter.id, chapter]));
assert.equal(chapters.length, 45, 'the textbook should have 45 chapters');
assert.equal(byId.size, 45, 'chapter IDs should be unique');
assert.equal(chapters.filter(chapter => chapter.learning).length, 45, 'every chapter needs a learning profile');

const prompts = new Set();
let taskCount = 0;
for (const chapter of chapters) {
  const learning = chapter.learning;
  assert.ok(Array.isArray(learning.prerequisites), `${chapter.id}: prerequisites`);
  assert.ok(learning.objectives.length >= 2 && learning.objectives.length <= 3, `${chapter.id}: 2–3 objectives`);
  assert.ok(learning.applicationHint.trim(), `${chapter.id}: application hint`);
  for (const stageName of ['basic', 'transfer']) {
    const task = learning[stageName];
    for (const key of ['prompt', 'hint', 'expected', 'why']) {
      assert.equal(typeof task[key], 'string', `${chapter.id}.${stageName}.${key} should be text`);
      assert.ok(task[key].trim(), `${chapter.id}.${stageName}.${key} should not be empty`);
    }
    assert.ok(!prompts.has(task.prompt), `duplicate learning prompt: ${task.prompt}`);
    prompts.add(task.prompt);
    assert.notEqual(task.prompt, chapter.exercise.prompt, `${chapter.id}: staged tasks must differ from the existing application exercise`);
    taskCount++;
  }
  for (const prerequisite of learning.prerequisites) {
    assert.ok(byId.has(prerequisite), `${chapter.id}: unknown prerequisite ${prerequisite}`);
    assert.notEqual(chapter.id, prerequisite, `${chapter.id}: self prerequisite`);
  }
}
assert.equal(taskCount, 90, '45 chapters should provide 90 authored practice tasks');

const done = new Set();
const active = new Set();
function visit(id) {
  assert.ok(!active.has(id), `prerequisite cycle involving ${id}`);
  if (done.has(id)) return;
  active.add(id);
  for (const prerequisite of byId.get(id).learning.prerequisites) visit(prerequisite);
  active.delete(id);
  done.add(id);
}
for (const chapter of chapters) visit(chapter.id);
function closure(id, result = new Set()) {
  for (const prerequisite of byId.get(id).learning.prerequisites) {
    if (!result.has(prerequisite)) {
      result.add(prerequisite);
      closure(prerequisite, result);
    }
  }
  return result;
}
for (const [chapter, required] of [
  ['dfs', 'graph-model'], ['bfs', 'graph-model'], ['fenwick-tree', 'prefix'],
  ['mst', 'dsu'], ['mst', 'greedy']
]) assert.ok(closure(chapter).has(required), `${chapter} route should include ${required}`);

const indexHtml = fs.readFileSync(path.join(root, 'docs', 'index.html'), 'utf8');
assert.ok(indexHtml.indexOf('src="learning.js') >= 0, 'index must load learning.js');
assert.ok(indexHtml.indexOf('src="learning.js') < indexHtml.indexOf('src="app.js'), 'learning.js must load before app.js');
const app = fs.readFileSync(path.join(root, 'docs', 'app.js'), 'utf8');
for (const expression of [
  'esc(s)', 'esc(p.title)', 'esc(l.basic.prompt)', 'esc(l.transfer.prompt)',
  'esc(task.hint)', 'esc(task.expected)', 'esc(task.why)', 'esc(l.applicationHint)'
]) assert.ok(app.includes(expression), `learning content should be HTML escaped: ${expression}`);
assert.ok(!/<(?:script|img|iframe)\b/i.test(chapters.flatMap(c => [
  ...c.learning.objectives, c.learning.applicationHint,
  ...['basic', 'transfer'].flatMap(stage => Object.values(c.learning[stage]))
]).join('\n')), 'authored profile text should not contain active HTML elements');

function task(id, stage) { return byId.get(id).learning[stage]; }
function promptHas(id, stage, ...parts) {
  const prompt = task(id, stage).prompt;
  for (const part of parts) assert.ok(prompt.includes(part), `${id}.${stage} reference inputs must match current prompt; missing “${part}” in: ${prompt}`);
}
function answerHas(id, stage, phrase) {
  assert.ok(task(id, stage).expected.includes(phrase), `${id}.${stage} expected should state computed result “${phrase}”; got: ${task(id, stage).expected}`);
}
let referenceChecks = 0;
function checkAnswer(id, stage, computed, phrase, predicate = value => task(id, stage).expected.includes(value)) {
  assert.ok(predicate(String(computed)), `${id}.${stage} authored answer disagrees with independent result ${computed}: ${task(id, stage).expected}`);
  answerHas(id, stage, phrase);
  referenceChecks++;
}

// Pair queries: brute-force distinct index pairs, including a negative value.
function hasPair(values, target) {
  for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) if (values[i] + values[j] === target) return true;
  return false;
}
promptHas('thinking', 'basic', '[2,7,4]', 'K=9');
promptHas('thinking', 'transfer', '[−3,8,1]', 'K=5');
assert.equal(hasPair([2, 7, 4], 9), true); answerHas('thinking', 'basic', '2+7=9'); referenceChecks++;
assert.equal(hasPair([-3, 8, 1], 5), true); answerHas('thinking', 'transfer', '답은 참입니다'); referenceChecks++;

// Bounded heap: independently sort the retained prefix after every insertion.
function topKTrace(values, k) {
  const kept = [];
  return values.map(value => {
    kept.push(value); kept.sort((a, b) => a - b);
    if (kept.length > k) kept.shift();
    return `{${[...kept].sort((a, b) => a - b).join(',')}}`;
  });
}
promptHas('stl', 'basic', 'K=2', '[6,1,5]');
promptHas('stl', 'transfer', '[4,9,2,8]', 'K=3');
const heapBasic = topKTrace([6, 1, 5], 2);
assert.deepEqual(heapBasic, ['{6}', '{1,6}', '{5,6}']);
answerHas('stl', 'basic', heapBasic.join(' → ')); referenceChecks++;
assert.deepEqual(topKTrace([4, 9, 2, 8], 3).at(-1), '{4,8,9}');
answerHas('stl', 'transfer', '최종 집합 {4,8,9}, K번째 큰 값은 4'); referenceChecks++;

// Prefix ranges use direct slicing as the independent reference.
const prefixBasic = [3, -2, 5];
promptHas('prefix', 'basic', 'a=[3,−2,5]', '[1,3)');
checkAnswer('prefix', 'basic', prefixBasic.slice(1, 3).reduce((a, b) => a + b, 0), '3.');
const prefixTransfer = [2, -5, 4];
promptHas('prefix', 'transfer', 'a=[2,−5,4]', '[0,2)', '[2,2)');
const prefix = [0]; prefixTransfer.forEach(value => prefix.push(prefix.at(-1) + value));
assert.deepEqual([prefix[2] - prefix[0], prefix[2] - prefix[2]], [-3, 0]);
answerHas('prefix', 'transfer', 'p=[0,2,−3,1], 구간 합은 −3과 0'); referenceChecks++;

// Minimum-coin DP reference by recursive exhaustive choice, not the authored recurrence.
function minCoins(denoms, amount) {
  const memo = new Map([[0, 0]]);
  function solve(left) {
    if (memo.has(left)) return memo.get(left);
    let best = Infinity;
    for (const coin of denoms) if (coin <= left) best = Math.min(best, solve(left - coin) + 1);
    memo.set(left, best); return best;
  }
  return Array.from({ length: amount }, (_, i) => solve(i + 1));
}
const coinAnswers = minCoins([1, 3, 4], 6);
promptHas('dp', 'basic', '동전 [1,3,4]', '목표 6');
assert.deepEqual(coinAnswers, [1, 2, 1, 1, 2, 2]);
answerHas('dp', 'basic', `dp[1..6]=[${coinAnswers.join(',')}].`); referenceChecks++;

// Breadth-first distances via an independently built adjacency list.
function bfsDistances(n, undirectedEdges, start) {
  const adj = Array.from({ length: n }, () => []);
  undirectedEdges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const dist = Array(n).fill(-1); dist[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) for (const next of adj[queue[head]]) if (dist[next] < 0) {
    dist[next] = dist[queue[head]] + 1; queue.push(next);
  }
  return dist;
}
const bfs = bfsDistances(4, [[0,1],[0,2],[1,3],[2,3]], 0);
promptHas('bfs', 'basic', '0-1,0-2,1-3,2-3', 'BFS(0)');
assert.deepEqual(bfs, [0,1,1,2]); answerHas('bfs', 'basic', '거리 [0,1,1,2]'); referenceChecks++;

// Bellman-Ford reference for Dijkstra's nonnegative example and its negative-edge counterexample.
function bellmanFord(n, edges, start) {
  const dist = Array(n).fill(Infinity); dist[start] = 0;
  for (let pass = 1; pass < n; pass++) {
    let changed = false;
    for (const [from, to, weight] of edges) if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
      dist[to] = dist[from] + weight; changed = true;
    }
    if (!changed) break;
  }
  return dist;
}
const dijEdges = [[0,1,4],[0,2,1],[2,1,2],[1,3,1]];
promptHas('dijkstra', 'basic', '0→1(4)', '0→2(1)', '2→1(2)', '1→3(1)', '처리한 직후');
const afterSourceRelax = [0, ...Array(3).fill(Infinity)];
for (const [from,to,weight] of dijEdges) if (from === 0) afterSourceRelax[to] = Math.min(afterSourceRelax[to], afterSourceRelax[from] + weight);
assert.deepEqual(afterSourceRelax, [0,4,1,Infinity]);
assert.match(task('dijkstra', 'basic').expected, /^\[0,4,1,∞\]/); referenceChecks++;
const negativeReference = bellmanFord(3, [[0,1,1],[0,2,2],[2,1,-3]], 0);
promptHas('dijkstra', 'transfer', '0→1 비용 1', '0→2 비용 2', '2→1 비용 −3');
assert.equal(negativeReference[1], -1);
assert.match(task('dijkstra', 'transfer').expected, /-1|−1/, 'negative counterexample answer should give distance −1'); referenceChecks++;

// Kruskal reference: enumerate all edge subsets of size V-1 and keep connected trees.
function bruteMst(n, edges) {
  let best = Infinity;
  for (let mask = 0; mask < (1 << edges.length); mask++) {
    const chosen = edges.filter((_, i) => mask & (1 << i));
    if (chosen.length !== n - 1) continue;
    const parent = Array.from({ length: n }, (_, i) => i);
    const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
    let valid = true;
    for (const [u, v, w] of chosen) { const a = find(u), b = find(v); if (a === b) { valid = false; break; } parent[a] = b; }
    if (valid && parent.slice(1).every((_, i) => find(i + 1) === find(0))) best = Math.min(best, chosen.reduce((sum, edge) => sum + edge[2], 0));
  }
  return best;
}
const mstCost = bruteMst(4, [[0,1,1],[1,2,2],[0,2,4],[2,3,3]]);
promptHas('mst', 'basic', '(0,1,1),(1,2,2),(0,2,4),(2,3,3)');
assert.equal(mstCost, 6); answerHas('mst', 'basic', '총 비용 6'); referenceChecks++;

// LIS lengths via exhaustive subsequence enumeration; duplicates distinguish strict/nondecreasing.
function bruteLis(values, strict) {
  let best = 0;
  for (let mask = 0; mask < (1 << values.length); mask++) {
    const sequence = values.filter((_, i) => mask & (1 << i));
    if (sequence.every((value, i) => i === 0 || (strict ? sequence[i - 1] < value : sequence[i - 1] <= value))) best = Math.max(best, sequence.length);
  }
  return best;
}
promptHas('lis', 'basic', '[3,1,2,2,5]', '엄격 증가');
assert.equal(bruteLis([3,1,2,2,5], true), 3); answerHas('lis', 'basic', '길이 3'); referenceChecks++;
promptHas('lis', 'transfer', '[2,2,2]', '엄격 증가', '비감소');
const duplicateLis = [bruteLis([2,2,2], true), bruteLis([2,2,2], false)];
assert.deepEqual(duplicateLis, [1,3]); answerHas('lis', 'transfer', '엄격 증가 1, 비감소 3'); referenceChecks++;

// Next-greater reference scans to the right for each position.
function nextGreater(values) {
  return values.map((value, i) => values.slice(i + 1).find(next => next > value) ?? -1);
}
promptHas('monotonic-stack', 'basic', '[2,1,4,3]', '오른쪽의 첫 큰 값');
assert.deepEqual(nextGreater([2,1,4,3]), [4,4,-1,-1]);
answerHas('monotonic-stack', 'basic', '답 [4,4,−1,−1]'); referenceChecks++;
assert.deepEqual(nextGreater([5,5,6]), [6,6,-1]);
// The revised transfer asks for amortized cost on a descending run plus one large value.
promptHas('monotonic-stack', 'transfer', '길이 N의 내림차순', '전체 길이가 N');
function stackPushPopCounts(descendingLength) {
  const stack = [], counts = { pushes: 0, pops: 0 };
  for (let value = descendingLength; value >= 1; value--) { stack.push(value); counts.pushes++; }
  const large = descendingLength + 1;
  while (stack.length && stack.at(-1) < large) { stack.pop(); counts.pops++; }
  stack.push(large); counts.pushes++;
  return { ...counts, total: counts.pushes + counts.pops };
}
const stackCosts = stackPushPopCounts(5);
assert.deepEqual(stackCosts, { pushes: 6, pops: 5, total: 11 });
answerHas('monotonic-stack', 'transfer', '각 인덱스는 한 번 push되고 최대 한 번 pop됩니다'); referenceChecks++;

// LCS by exhaustive subsequence sets / independent order-preserving membership.
function lcsBrute(a, b) {
  const subsequences = new Set();
  for (let mask = 0; mask < (1 << a.length); mask++) subsequences.add([...a].filter((_, i) => mask & (1 << i)).join(''));
  function isSubsequence(candidate, source) {
    let i = 0; for (const ch of source) if (ch === candidate[i]) i++;
    return i === candidate.length;
  }
  return Math.max(...[...subsequences].filter(candidate => isSubsequence(candidate, b)).map(candidate => candidate.length));
}
promptHas('lcs', 'basic', 'a="ABC"', 'b="AC"');
assert.equal(lcsBrute('ABC', 'AC'), 2); answerHas('lcs', 'basic', '2.'); referenceChecks++;
promptHas('lcs', 'transfer', 'a="AB"', 'b="BA"');
assert.equal(lcsBrute('AB', 'BA'), 1); answerHas('lcs', 'transfer', '길이 1'); referenceChecks++;

// Candidate filtering and dominance use literal input semantics.
const activeCandidates = [3,0,2,1].filter(index => [true,false,true,true][index]);
promptHas('candidate-filter', 'basic', '[3,0,2,1]', '[true,false,true,true]');
assert.deepEqual(activeCandidates, [3,0,2]); answerHas('candidate-filter', 'basic', '[3,0,2].'); referenceChecks++;
promptHas('candidate-filter', 'transfer', '[4,1,4]', 'active[4]=true', 'active[1]=false');
assert.deepEqual([4,1,4].filter(index => index === 4), [4,4]);
answerHas('candidate-filter', 'transfer', '[4,4].'); referenceChecks++;
const dominates = (a, b) => a.cost <= b.cost && a.resource >= b.resource;
promptHas('resource-state', 'basic', 'A=(비용 4, 자원 6)', 'B=(비용 5, 자원 3)');
assert.equal(dominates({cost:4,resource:6},{cost:5,resource:3}), true);
answerHas('resource-state', 'basic', 'A가 B를 지배합니다'); referenceChecks++;
promptHas('resource-state', 'transfer', 'A=(4,1)', 'B=(5,3)');
assert.equal(dominates({cost:4,resource:1},{cost:5,resource:3}), false);
assert.equal(dominates({cost:5,resource:3},{cost:4,resource:1}), false);
answerHas('resource-state', 'transfer', '서로 지배하지 않습니다'); referenceChecks++;

// Enumerate simple paths to show a non-path edge increase/deletion preserves the stored optimum.
function shortestSimplePath(n, edges, start, end, excludedId = -1) {
  let best = Infinity;
  function walk(node, seen, cost) {
    if (node === end) { best = Math.min(best, cost); return; }
    edges.forEach(([u, v, w, id]) => {
      if (id === excludedId || u !== node || seen.has(v)) return;
      const next = new Set(seen); next.add(v); walk(v, next, cost + w);
    });
  }
  walk(start, new Set([start]), 0); return best;
}
const pathEdges = [[0,1,3,3],[1,2,4,8],[0,2,10,9],[2,3,1,12]];
promptHas('path-sensitivity', 'basic', '[3,8,12]', 'ID 8 제거');
const bestBefore = shortestSimplePath(4, pathEdges, 0, 3);
const bestWithoutNonPath = shortestSimplePath(4, pathEdges, 0, 3, 9);
assert.equal(bestBefore, 8); assert.equal(bestWithoutNonPath, 8);
answerHas('path-sensitivity', 'basic', '예.'); referenceChecks++;
const raised = pathEdges.map(([u,v,w,id]) => [u,v,id === 9 ? w + 20 : w,id]);
promptHas('path-sensitivity', 'transfer', '[3,8,12]', 'ID 9의 가중치만 증가');
assert.equal(shortestSimplePath(4, raised, 0, 3), 8);
assert.match(task('path-sensitivity', 'transfer').expected, /최적 거리도 유지/); referenceChecks++;

// Lower-bound and half-open range boundaries are checked against direct scans/slices.
function lowerBound(values, target) { let i = 0; while (i < values.length && values[i] < target) i++; return i; }
promptHas('binary', 'basic', '[1,3,3,7]', 'lower_bound(4)', '[0,4)');
assert.equal(lowerBound([1,3,3,7], 4), 3); answerHas('binary', 'basic', '반환 위치 3'); referenceChecks++;
promptHas('binary', 'transfer', '[2,2,5,9]', 'K=2', 'K=10');
assert.deepEqual([lowerBound([2,2,5,9],2), lowerBound([2,2,5,9],10)], [0,4]);
answerHas('binary', 'transfer', 'K=2 → 0, K=10 → 4'); referenceChecks++;
const range = [2,1,4,3];
promptHas('segment-tree', 'basic', 'a=[2,1,4,3]', 'index 2를 7', '[1,4)');
assert.equal(range.slice(1,4).reduce((a,b)=>a+b,0), 8);
answerHas('segment-tree', 'basic', '1+7+3=11'); // Updated array boundary case is in this profile.
// Segment-tree prompt's concrete update is verified with a direct array mutation.
const updatedRange = [...range]; updatedRange[2] = 7;
assert.equal(updatedRange.slice(1,4).reduce((a,b)=>a+b,0), 11); referenceChecks++;
promptHas('segment-tree', 'transfer', '빈 구간 [2,2)', '전체 [0,4)');
assert.equal(range.slice(2,2).reduce((a,b)=>a+b,0), 0);
answerHas('segment-tree', 'transfer', '0과 10'); referenceChecks++;

// Revised transfer tasks: calculations are bound to their exact authored inputs.
promptHas('trie', 'transfer', '노드가 100,000개', '26개', '각 4바이트');
const trieChildBytes = 100_000 * 26 * 4;
assert.equal(trieChildBytes, 10_400_000);
assert.match(task('trie', 'transfer').expected, /10,400,000바이트/);
assert.match(task('trie', 'transfer').expected, /희소 map|\(문자,자식\) 목록/); referenceChecks++;

promptHas('graph-model', 'transfer', 'N=100,000', 'M=200,000', '칸당 1바이트');
const graphN = 100_000, graphM = 200_000;
const adjacencyMatrixBytes = graphN * graphN;
assert.equal(adjacencyMatrixBytes, 10_000_000_000);
assert.match(task('graph-model', 'transfer').expected, /10,000,000,000바이트/);
assert.match(task('graph-model', 'transfer').expected, /O\(N\+M\)/);
assert.match(task('graph-model', 'transfer').why, /O\(N\+M\).*O\(N²\)/); referenceChecks++;

promptHas('bitset-cost', 'transfer', 'N=1,000개', 'Q=100개', 'Q=1,000,000개', '4바이트');
const objects = 1_000, pairCount = objects * (objects - 1) / 2;
const pairTableBytes = pairCount * 4;
const queryCounts = [100, 1_000_000];
assert.equal(pairCount, 499_500); assert.equal(pairTableBytes, 1_998_000);
assert.ok(queryCounts[0] < pairCount && queryCounts[1] > pairCount);
assert.match(task('bitset-cost', 'transfer').expected, /499,500쌍/);
assert.match(task('bitset-cost', 'transfer').expected, /1,998,000바이트/);
assert.match(task('bitset-cost', 'transfer').expected, /자동으로 유리하지 않/); referenceChecks++;

promptHas('sqrt-decomposition', 'transfer', 'B=1', 'B=N', 'B≈√N', '최대값이 감소');
function sqrtCosts(n, b) { return { query: b + n / b, endpointAndBlocks: [b, n / b], update: b }; }
const unitBlock = sqrtCosts(10_000, 1), fullBlock = sqrtCosts(10_000, 10_000), balancedBlock = sqrtCosts(10_000, 100);
assert.equal(unitBlock.query, 10_001); assert.equal(fullBlock.query, 10_001); assert.equal(balancedBlock.query, 200);
assert.equal(balancedBlock.update, 100);
assert.match(task('sqrt-decomposition', 'transfer').expected, /B=1과 B=N의 질의는 O\(N\)/);
assert.match(task('sqrt-decomposition', 'transfer').expected, /B≈√N이면 O\(√N\)/);
assert.match(task('sqrt-decomposition', 'transfer').expected, /O\(B\)에 재계산/); referenceChecks++;

promptHas('array-rotation', 'transfer', '2×3 행렬 [[1,2,3],[4,5,6]]', '시계 방향 90도');
function rotateClockwise(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  return Array.from({ length: cols }, (_, newRow) =>
    Array.from({ length: rows }, (_, newCol) => matrix[rows - 1 - newCol][newRow]));
}
const rotated = rotateClockwise([[1,2,3],[4,5,6]]);
assert.deepEqual(rotated, [[4,1],[5,2],[6,3]]);
assert.deepEqual([rotated.length, rotated[0].length], [3,2]);
assert.match(task('array-rotation', 'transfer').expected, /3×2 행렬 \[\[4,1\],\[5,2\],\[6,3\]\]/);
assert.match(task('array-rotation', 'transfer').expected, /새 \(c,N−1−r\)/); referenceChecks++;

promptHas('dp-patterns', 'transfer', '도시 0..3', '방문 집합이 {0,2}', '{0,1,2}', 'dp[2]');
const firstMask = (1 << 0) | (1 << 2), secondMask = (1 << 0) | (1 << 1) | (1 << 2);
function unvisitedCities(mask, n) { return Array.from({ length: n }, (_, city) => city).filter(city => !(mask & (1 << city))); }
const firstOptions = unvisitedCities(firstMask, 4), secondOptions = unvisitedCities(secondMask, 4);
assert.equal(firstMask, 0b0101); assert.equal(secondMask, 0b0111);
assert.deepEqual(firstOptions, [1,3]); assert.deepEqual(secondOptions, [3]);
assert.notDeepEqual(firstOptions, secondOptions);
assert.match(task('dp-patterns', 'transfer').expected, /0101₂와 0111₂/);
assert.match(task('dp-patterns', 'transfer').expected, /dp\[mask\]\[last\]/); referenceChecks++;

assert.ok(referenceChecks >= 25, `expected broad independent reference coverage, got ${referenceChecks}`);
console.log(`Learning checks passed: ${chapters.length} chapters, ${taskCount} staged tasks, ${referenceChecks} independent answer checks, prerequisite DAG and safe rendering.`);
