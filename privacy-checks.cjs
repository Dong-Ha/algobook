// Public files must contain independent concepts, never source case specifications.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
global.window={};
for(const file of ['content','advanced','cases','service-cases','exercises','engines','visuals','visual-advanced'])require('./docs/'+file+'.js');
const concepts=window.CHAPTERS.filter(c=>c.concept);
assert.equal(concepts.length,10);
assert(concepts.every(c=>c.part==='09 · 핵심 개념과 재사용'));
for(const c of concepts){
 for(const field of ['learn','reuse'])assert(c[field]?.length>=3&&c[field].every(s=>typeof s==='string'&&s.length),c.id+' '+field);
 assert(c.example.startsWith('독립 개념 예제:'),c.id);
 assert(window.EXAMPLE_VISUALS[c.id],c.id);
}
// Read every public asset, including files that are no longer linked in index.html.
const forbidden=/number-editor|tile-index|road-failure|ev-route|energy-route|parkingcase|loginqueuecase|dictionarycase|기계식 주차장|큰 수 에디터|화물운송|도로파괴|전기차여행|에너지운송|RESULT_E|RESULT_S|mCarNo|mEnergy|mTile/;
let assets=0;
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else{assert(!forbidden.test(fs.readFileSync(p,'utf8')),'Source case material in '+p);assets++;}}}
scan('docs');
const runtime=fs.readFileSync('docs/app.js','utf8');
assert(runtime.includes('conceptGuide(c)')&&runtime.includes('c.learn.map')&&runtime.includes('c.reuse.map'));
assert(!/fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket\s*\(/.test(runtime),'Unexpected external transport');
console.log(JSON.stringify({concepts:concepts.length,publicAssets:assets,status:'passed'}));
