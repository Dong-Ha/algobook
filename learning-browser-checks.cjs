/* Browser verification for textbook readiness and all chapter practice stages. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),os=require('node:os');
const root=path.resolve('docs'),ctx={window:{}};vm.createContext(ctx);
for(const f of ['content','advanced','cases','service-cases','exercises','learning'])vm.runInContext(fs.readFileSync(path.join(root,f+'.js'),'utf8'),ctx);
const chapters=ctx.window.CHAPTERS,output=process.env.ALGOBOOK_QA_DIR||fs.mkdtempSync(path.join(os.tmpdir(),'algobook-learning-'));
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':decodeURIComponent(pathname)));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.ALGOBOOK_BROWSER||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port;
  await page.goto(base+'/#home');
  assert((await page.locator('.learning-start').innerText()).includes('반복문'));
  const paths=await page.locator('.learning-path').evaluateAll(els=>els.map(el=>[...el.querySelectorAll('a')].map(a=>new URL(a.href).hash.slice(1))));
  const covered=new Set();
  for(const route of paths){
   const seen=new Set();
   for(const id of route){if(id==='practice')continue;const c=chapters.find(c=>c.id===id);assert(c,'route id '+id);for(const p of c.learning.prerequisites)assert(seen.has(p),`${p} must precede ${id}`);assert(!seen.has(id));seen.add(id);covered.add(id);}
  }
  assert.equal(covered.size,45,'learning routes cover entire book');
  for(const c of chapters){
   await page.goto(base+'/#'+c.id);
   assert.equal(await page.locator('.learning-guide li').count(),c.learning.objectives.length+c.learning.prerequisites.length);
   assert.equal(await page.locator('.practice-stage').count(),3);
   assert.equal(await page.locator('.practice-stage details[open]').count(),0,'no answers revealed on entry');
   assert.equal(await page.locator('[data-panel=application]').evaluate(el=>el.open),false);
   assert.equal(await page.locator('[data-panel=transfer]').evaluate(el=>el.open),false);
   assert.equal(await page.locator('#example-visual').count(),1);
   const prereqs=await page.locator('.learning-guide a').evaluateAll(els=>els.map(a=>new URL(a.href).hash.slice(1)));
   assert.deepEqual(prereqs,Array.from(c.learning.prerequisites));
   await page.locator('[data-panel=basic-hint]>summary').click();
   assert.equal(await page.locator('[data-panel=basic-answer]').evaluate(el=>el.open),false);
   assert((await page.locator('[data-panel=basic-hint]').innerText()).includes(c.learning.basic.hint));
   await page.locator('[data-panel=transfer]>summary').click();
   await page.locator('[data-panel=transfer-answer]>summary').click();
   assert((await page.locator('[data-panel=transfer-answer]').innerText()).includes(c.learning.transfer.expected));
  }
  await page.goto(base+'/?section=exercise#candidate-filter');
  const hint=page.locator('[data-panel=basic-hint]>summary');await hint.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-panel=basic-hint]').evaluate(el=>el.open),true);
  const stage=page.locator('[data-panel=application]>summary');await stage.focus();await page.keyboard.press('Space');
  await page.locator('.exercise-answer>summary').click();
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('panels')?.includes('exercise'));
  const shared=page.url();await page.reload();
  assert.equal(await page.locator('[data-panel=basic-hint]').evaluate(el=>el.open),true);
  assert.equal(await page.locator('[data-panel=application]').evaluate(el=>el.open),true);
  assert.equal(await page.locator('.exercise-answer').evaluate(el=>el.open),true);
  assert.equal(page.url(),shared);
  await page.goto(base+'/?section=exercise&panels=exercise#binary');
  assert.equal(await page.locator('[data-panel=application]').evaluate(el=>el.open),true,'legacy answer link exposes stage');
  assert.equal(await page.locator('.exercise-answer').evaluate(el=>el.open),true);
  await page.locator('[data-panel=application]>summary').click();
  await page.waitForFunction(()=>!new URLSearchParams(location.search).get('panels')?.includes('exercise'));
  await page.reload();assert.equal(await page.locator('[data-panel=application]').evaluate(el=>el.open),false,'closing stage survives reload');
  await page.goto(base+'/?section=exercise&panels=transfer-answer#binary');
  assert.equal(await page.locator('[data-panel=transfer]').evaluate(el=>el.open),true,'answer-only link exposes advanced stage');
  await page.goto(base+'/#bfs');await page.locator('.learning-guide a[href$="#graph-model"]').click();
  await page.waitForURL('**#graph-model');assert.equal(await page.locator('h1').evaluate(el=>el===document.activeElement),true);
  await page.goBack();await page.waitForURL('**#bfs');
  for(const width of [320,390,768,1100]){
   await page.setViewportSize({width,height:900});
   for(const id of ['home','binary','resource-state']){
    await page.goto(base+'/#'+id);
    if(id==='home')await page.locator('.learning-path>summary').first().click();
    else{await page.locator('[data-panel=transfer]>summary').click();await page.locator('[data-panel=transfer-answer]>summary').click();}
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${width}px ${id} overflow`);
   }
  }
  await page.setViewportSize({width:1100,height:900});await page.goto(base+'/#home');await page.screenshot({path:path.join(output,'learning-home.png')});
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/?section=exercise#binary');await page.screenshot({path:path.join(output,'learning-practice-mobile.png')});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({chapters:45,routeCoverage:45,stages:135,keyboard:'passed',disclosures:'passed',shareRestore:'passed',widths:[320,390,768,1100],errors,status:'passed',output}));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
