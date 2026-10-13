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
  const ids=await (async()=>{await p.goto(base);return p.evaluate(()=>CHAPTERS.map(c=>c.id));})();
  let examples=0,frames=0;
  for(const width of [1100,390]){
   await p.setViewportSize({width,height:900});
   for(const id of ids){
    await p.goto(base+'/index.html#'+id);await p.locator('.example-frame').waitFor();
    assert.equal(await p.locator('.example-frame').count(),1,id+' one figure');
    assert.equal(await p.locator('.example-frame input,.example-frame textarea,.example-frame select,main form,main iframe').count(),0,id+' no data input or duplicate embed');
    assert(!/EXAMPLE WALKTHROUGH|INTERACTIVE LAB|EXTENDED VISUAL LAB/.test(await p.locator('main').innerText()));
    const n=await p.locator('[data-example]').count();
    for(let j=0;j<n;j++){
     await p.locator('[data-example="'+j+'"]').click();
     const control=p.locator('.example-controls'),note=p.locator('.example-note');
     assert.equal(await control.locator('[data-action=prev]').isDisabled(),true);
     const before=await note.innerText();
     await control.locator('[data-action=next]').click();assert.notEqual(await note.innerText(),before);
     if(await control.locator('[data-action=last]').isEnabled())await control.locator('[data-action=last]').click();assert.equal(await control.locator('[data-action=next]').isDisabled(),true);
     const issues=await p.locator('.example-frame').evaluate(root=>{
      const issues=[];
      if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflow');
      for(const svg of root.querySelectorAll('svg')){
       const box=svg.viewBox.baseVal,ids=(svg.getAttribute('aria-labelledby')||'').split(' ');
       if(svg.firstElementChild?.tagName!=='title'||ids.length!==2||ids.some(id=>!document.getElementById(id)))issues.push('SVG accessibility');
       for(const t of svg.querySelectorAll('text')){const b=t.getBBox();if(b.x< -1||b.y< -1||b.x+b.width>box.width+1||b.y+b.height>box.height+1)issues.push('text outside '+t.textContent);if(/[가-힣]/.test(t.textContent)&&parseFloat(getComputedStyle(t).fontSize)<12)issues.push('small Hangul');}
      }
      return issues;
     });
     assert.deepEqual(issues,[],id+' example '+j+' width '+width);
     examples++;frames+=Number((await p.locator('.example-count').innerText()).split('/')[1]);
    }
    report.push({width,id,examples:n});
   }
  }
  for(const [id,example,expected]of [['binary','capacity','정답 18'],['grid-search','detour','최소 이동 5회'],['grid-search','blocked','도달 불가'],['grid-search','same','최소 이동 0회'],['lis','reconstruct','[3, 5, 6]'],['lis','duplicates','길이 1']]){
   await p.goto(base+'/index.html?example='+example+'#'+id);await p.locator('.example-frame').waitFor();
   await p.locator('.example-scene').focus();await p.keyboard.press('End');assert((await p.locator('.example-scene').innerText()).includes(expected),expected);
   await p.keyboard.press('Home');assert((await p.locator('.example-count').innerText()).startsWith('1 /'));
   await p.keyboard.press('ArrowRight');assert((await p.locator('.example-count').innerText()).startsWith('2 /'));
   await p.setViewportSize({width:1100,height:900});await p.locator('#example-visual').screenshot({animations:'disabled',style:'.topbar,.skip{visibility:hidden!important}.example-scene{outline:none!important}.example-controls{position:static!important}',path:path.join(output,id+'-'+example+'-desktop.png')});
   await p.setViewportSize({width:390,height:900});await p.locator('#example-visual').screenshot({animations:'disabled',style:'.topbar,.skip{visibility:hidden!important}.example-scene{outline:none!important}.example-controls{position:static!important}',path:path.join(output,id+'-'+example+'-mobile.png')});
  }
  for(const [old,id,key]of [['binary','binary','capacity'],['grid','grid-search','detour'],['lis','lis','reconstruct']]){
   await p.goto(base+'/visual-study.html?lab='+old);await p.waitForURL('**/index.html?example='+key+'#'+id);await p.locator('.example-frame').waitFor();
  }
  await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-action=next]').click();assert((await p.locator('.example-count').innerText()).startsWith('2 /'));
  await p.emulateMedia({media:'print'});assert.equal(await p.locator('.example-controls').isVisible(),false);assert.equal(await p.locator('.example-scene').isVisible(),true);
  const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();await fallback.goto(base+'/index.html');assert(await fallback.locator('noscript a[href="visual-study-summary.html"]').isVisible());await fallback.goto(base+'/visual-study-summary.html');assert.equal(await fallback.locator('svg').count(),3);assert.equal(await fallback.locator('input,textarea,form').count(),0);await nojs.close();
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({report,examples,frames,errors,externalRequests:requests},null,2));
  console.log(JSON.stringify({chapters:ids.length,widths:[1100,390],exampleVisits:examples,framesRepresented:frames,errors,externalRequests:requests,output,status:'passed'}));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
