/* Optional browser QA: npm-installed Playwright, plus ALGOBOOK_BROWSER if needed. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os');
const root=path.resolve('docs'),output=process.env.ALGOBOOK_QA_DIR||fs.mkdtempSync(path.join(os.tmpdir(),'algobook-ui-'));
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{const body=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript');res.end(body);}catch{res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.ALGOBOOK_BROWSER||undefined,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote']});
 const errors=[],requests=[],report=[];
 try{
  const ctx=await browser.newContext({viewport:{width:1100,height:900}});
  ctx.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  await ctx.route('**/*',r=>{if(!r.request().url().startsWith(base)){requests.push(r.request().url());return r.abort();}return r.continue();});
  const p=await ctx.newPage();

  await ctx.grantPermissions(['clipboard-read','clipboard-write']);
  await p.goto(base+'/index.html#home');
  await p.locator('#chapter-query').fill('BFS');
  assert.equal(await p.locator('#chapters .nav-item:visible').count(),2);
  assert.equal(new URL(p.url()).searchParams.get('q'),'BFS');
  await p.reload();assert.equal(await p.locator('#chapter-query').inputValue(),'BFS');
  await p.locator('#chapter-query').fill('<script>');assert.equal(await p.locator('#chapters .nav-item:visible').count(),0);assert((await p.locator('#search-status').innerText()).includes('다른 검색어'));
  await p.locator('#clear-query').click();assert.equal(await p.locator('#chapter-query').inputValue(),'');assert.equal(await p.locator('#chapters .nav-item:visible').count(),46);
  await p.locator('.study-start a[href$="#binary"]').click();await p.waitForURL('**#binary');assert.equal(await p.locator('h1').evaluate(el=>el===document.activeElement),true);
  const c=p.locator('.example-controls');
  await p.locator('[data-example="3"]').click();assert.equal(new URL(p.url()).searchParams.get('example'),'capacity');
  await c.locator('[data-action=next]').click();assert.equal(new URL(p.url()).searchParams.get('step'),'2');
  const shared=p.url();await p.reload();assert((await p.locator('.example-count').innerText()).startsWith('2 /'));
  await p.locator('[data-share]').click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),p.url());
  await p.locator('[data-action=last]').click();assert.equal(await p.locator('[data-action=last]').evaluate(el=>el===document.activeElement),true);assert.equal(await p.locator('[data-action=next]').getAttribute('aria-disabled'),'true');
  await p.locator('[data-action=prev]').click();assert.equal(await p.locator('[data-action=next]').getAttribute('aria-disabled'),'false');
  await p.locator('[data-example="4"]').click();const other=p.url();assert.notEqual(other,shared);
  await p.goBack();assert.equal(new URL(p.url()).searchParams.get('example'),'capacity');assert(!(await p.locator('.example-count').innerText()).startsWith('1 /'));
  await p.goForward();assert.equal(new URL(p.url()).searchParams.get('example'),'one-day');
  await p.locator('.lesson-jumps [data-section="code"]').click();assert.equal(new URL(p.url()).searchParams.get('section'),'code');assert.equal(await p.locator('#code').evaluate(el=>el===document.activeElement),true);
  await p.locator('#copy-code').click();await p.waitForFunction(()=>document.getElementById('copy-status').textContent.length>0);assert((await p.locator('#copy-status').innerText()).includes('복사했습니다'));
  await p.reload();assert.equal(new URL(p.url()).searchParams.get('section'),'code');
  await p.setViewportSize({width:390,height:844});await p.goto(base+'/index.html?example=reconstruct#lis');
  assert.equal(await p.locator('#sidebar').evaluate(el=>el.inert),true);
  await p.locator('#menu').click();assert.equal(await p.locator('#menu').getAttribute('aria-expanded'),'true');assert.equal(await p.locator('.shell').evaluate(el=>el.inert),true);assert.equal(await p.locator('#menu-close').evaluate(el=>el===document.activeElement),true);
  await p.keyboard.press('Shift+Tab');assert.equal(await p.locator('#chapters .nav-item').last().evaluate(el=>el===document.activeElement),true);
  await p.keyboard.press('Tab');assert.equal(await p.locator('#menu-close').evaluate(el=>el===document.activeElement),true);
  await p.locator('#chapter-query').fill('Dijkstra');await p.locator('#chapters [data-chapter="dijkstra"]').click();assert.equal(await p.locator('#menu').getAttribute('aria-expanded'),'false');assert.equal(await p.locator('#sidebar').evaluate(el=>el.inert),true);assert.equal(await p.locator('h1').evaluate(el=>el===document.activeElement),true);
  await p.locator('#menu').click();await p.keyboard.press('Escape');assert.equal(await p.locator('#menu').evaluate(el=>el===document.activeElement),true);
  await p.locator('#menu').click();await p.locator('#menu-backdrop').click({position:{x:380,y:400}});assert.equal(await p.locator('#menu').getAttribute('aria-expanded'),'false');
  await p.locator('#menu').click();await p.locator('#clear-query').click();await p.locator('#menu-close').click();
  for(const width of [320,390,768,1100]){
   await p.setViewportSize({width,height:900});await p.goto(base+'/index.html?example=reconstruct#lis');
   await p.locator('[data-action=next]').click();
   const frame=p.locator('.example-frame');
   const scroller=frame.locator('.scroller').first();await scroller.evaluate(el=>el.scrollLeft=80);const before=await scroller.evaluate(el=>el.scrollLeft);
   await p.locator('[data-action=next]').click();assert.equal(await scroller.evaluate(el=>el.scrollLeft),before);
   await p.locator('.viz-legend').scrollIntoViewIfNeeded();await p.locator('[data-action=next]').click();await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const geometry=await p.evaluate(()=>{
    const bar=document.querySelector('.example-controls').getBoundingClientRect(),note=document.querySelector('.example-note').getBoundingClientRect(),header=document.querySelector('.topbar').getBoundingClientRect();
    return {barHeight:bar.height,noteTop:note.top,barBottom:bar.bottom,headerBottom:header.bottom,overflow:document.documentElement.scrollWidth>innerWidth+1};
   });assert.equal(geometry.overflow,false,'width '+width);assert(geometry.barHeight<=64);assert(geometry.noteTop>=geometry.barBottom-1,'note must clear controls');
   await p.screenshot({animations:'disabled',path:path.join(output,'ux-lis-'+width+'.png')});
  }
  // A focused scroll region stays usable; chapter navigation uses real links.
  await p.goto(base+'/index.html?example=capacity&step=3&section=example-visual#binary');
  await p.locator('.example-detail summary').click();await p.waitForFunction(()=>new URLSearchParams(location.search).get('panels')?.includes('example-code'));await p.reload();assert.equal(await p.locator('.example-detail details').getAttribute('open'),'');await p.locator('[data-action=next]').click();assert.equal(await p.locator('.example-detail details').getAttribute('open'),'');
  await p.locator('.example-scene').focus();await p.keyboard.press('End');assert((await p.locator('.example-scene').innerText()).includes('정답 18'));
  await p.emulateMedia({reducedMotion:'reduce'});await p.keyboard.press('Home');assert((await p.locator('.example-count').innerText()).startsWith('1 /'));
  await p.emulateMedia({media:'print'});assert.equal(await p.locator('.example-controls').isVisible(),false);assert.equal(await p.locator('.topbar').isVisible(),false);assert.equal(await p.locator('.example-note').isVisible(),true);
  await p.emulateMedia({media:'screen',reducedMotion:'no-preference'});await p.goto(base+'/index.html?section=example-visual#binary');
  await p.evaluate(()=>navigator.clipboard.writeText=async()=>{throw Error('Clipboard denied');});
  await p.locator('[data-share]').click();assert(await p.locator('.share-status a').isVisible());assert.equal(await p.locator('.share-status a').getAttribute('href'),p.url());
  await p.locator('#copy-code').click();await p.waitForFunction(()=>document.getElementById('copy-status').textContent.length>0);assert((await p.locator('#copy-status').innerText()).includes('선택'));
  await p.goto(base+'/index.html#home');const link=p.locator('.intro-actions .secondary');assert(new URL(await link.getAttribute('href'),base).searchParams.get('section')==='example-visual');
  await link.click();await p.waitForURL('**#dfs');assert.equal(new URL(p.url()).searchParams.get('section'),'example-visual');
  // Malformed and out-of-range links keep the interface usable.
  await p.goto(base+'/index.html?example=unknown&step=NaN#lis');assert((await p.locator('.example-count').innerText()).startsWith('1 /'));
  await p.goto(base+'/index.html?example=reconstruct&step=999#lis');assert.equal(await p.locator('[data-action=next]').getAttribute('aria-disabled'),'true');
  await p.setViewportSize({width:390,height:844});await p.goto(base+'/index.html#home');await p.locator('#menu').click();assert.equal(await p.locator('.skip').evaluate(el=>el.inert),true);await p.screenshot({animations:'disabled',path:path.join(output,'ux-drawer.png')});
  await p.setViewportSize({width:1100,height:900});assert.equal(await p.locator('#sidebar').evaluate(el=>el.inert),false);assert.equal(await p.locator('.shell').evaluate(el=>el.inert),false);await p.screenshot({animations:'disabled',path:path.join(output,'ux-home.png')});
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  console.log(JSON.stringify({search:'passed',drawer:'passed',urlHistory:'passed',focus:'passed',clipboard:'passed',scrollRetention:'passed',stickyControls:'passed',widths:[320,390,768,1100],print:'passed',reducedMotion:'passed',errors,externalRequests:requests,status:'passed'}));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
