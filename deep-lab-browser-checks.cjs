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
  async function geometry(page){return page.evaluate(()=>{
   const problems=[];
   for(const svg of document.querySelectorAll('svg')){if(!svg.getClientRects().length)continue;const box=svg.viewBox.baseVal;const ids=(svg.getAttribute('aria-labelledby')||'').split(' ');if(svg.firstElementChild?.tagName!=='title'||ids.some(id=>!document.getElementById(id)))problems.push('SVG accessible name');
    for(const t of svg.querySelectorAll('text')){const b=t.getBBox();if(b.x<0||b.y<0||b.x+b.width>box.width+1||b.y+b.height>box.height+1)problems.push('text outside canvas: '+t.textContent);if(/[가-힣]/.test(t.textContent)&&parseFloat(getComputedStyle(t).fontSize)<12)problems.push('small Hangul');}
    const wrap=svg.closest('.scroller');if(wrap&&svg.getBoundingClientRect().width>wrap.clientWidth+1){wrap.scrollLeft=wrap.scrollWidth;if(wrap.scrollLeft<1)problems.push('unreachable diagram edge');wrap.scrollLeft=0;}
   }
   if(document.documentElement.scrollWidth>innerWidth+1)problems.push('page overflow');
   return problems;
  });}
  for(const width of [1100,390]){
   await p.setViewportSize({width,height:900});
   for(const id of ['binary','grid','lis']){
    await p.goto(base+'/visual-study.html?lab='+id);await p.locator('#'+id+'.enhanced').waitFor();await p.evaluate(()=>document.fonts.ready);
    assert.deepEqual(await geometry(p),[]);await p.locator('#'+id+' [data-action=last]').click();
    assert.deepEqual(await geometry(p),[]);await p.screenshot({path:path.join(output,id+'-'+width+'.png'),fullPage:true});
    const result=await p.locator('#'+id+' .outcome').textContent();assert.match(result,id==='binary'?/정답 18/:id==='grid'?/최소 이동 5회/:/길이 3/);
    await p.locator('#'+id+' [data-action=first]').click();await p.locator('#'+id+' [data-action=next]').focus();await p.keyboard.press('Enter');assert.match(await p.locator('#'+id+' output').textContent(),/단계 1/);
    report.push({id,width,geometry:'passed',keyboard:'passed',result});
   }
  }
  await p.goto(base+'/visual-study.html?lab=binary');
  await p.locator('nav a[href="?lab=grid#grid"]').click();assert(await p.locator('#grid').isVisible());assert(!(await p.locator('#binary').isVisible()));
  await p.locator('nav a[href="?lab=binary#binary"]').click();
  for(const [preset,answer]of [['one-day',32],['each-day',10],['single',10]]){await p.locator('[data-binary-preset='+preset+']').click();const end=p.locator('#binary [data-action=last]');if(await end.isEnabled())await end.click();assert.match(await p.locator('#binary .outcome').textContent(),new RegExp('정답 '+answer));}
  await p.locator('#binary input[name=array]').fill('0');await p.locator('#binary button[type=submit]').click();assert.match(await p.locator('#binary .error').textContent(),/1~10000/);
  await p.locator('#binary input[name=array]').fill('10000,10000,10000,10000,10000,10000,10000,10000,10000');await p.locator('#binary input[name=days]').fill('1');await p.locator('#binary button[type=submit]').click();await p.locator('#binary [data-action=last]').click();assert.match(await p.locator('#binary .outcome').textContent(),/90000/);assert.deepEqual(await geometry(p),[]);
  await p.goto(base+'/visual-study.html?lab=grid');await p.locator('[data-grid-preset=blocked]').click();await p.locator('#grid [data-action=last]').click();assert.match(await p.locator('#grid .outcome').textContent(),/도달 불가/);
  await p.locator('[data-grid-preset=same]').click();await p.locator('#grid [data-action=last]').click();assert.match(await p.locator('#grid .outcome').textContent(),/최소 이동 0회/);
  await p.locator('[data-grid-preset=detour]').click();await p.locator('[data-cell="0,1"]').click();assert.equal(await p.locator('[data-cell="0,1"]').getAttribute('aria-pressed'),'true');assert(await p.locator('[data-cell="0,1"]').evaluate(e=>e===document.activeElement));
  await p.goto(base+'/visual-study.html?lab=lis');
  for(const [preset,len]of [['duplicates',1],['empty',0],['descending',1]]){await p.locator('[data-lis-preset='+preset+']').click();await p.locator('#lis [data-action=last]').click();assert.match(await p.locator('#lis .outcome').textContent(),new RegExp('길이 '+len));}
  await p.locator('#lis input[name=array]').fill('-10000,-9000,-8000,-7000,-6000,-5000,-4000,-3000,10000');await p.locator('#lis button[type=submit]').click();await p.locator('#lis [data-action=last]').click();assert.deepEqual(await geometry(p),[]);
  // Main chapter embeds resize through a scoped same-origin message and work on mobile.
  for(const [chapter,id]of [['binary','binary'],['grid-search','grid'],['lis','lis']]){
   await p.goto(base+'/#'+chapter);const iframe=p.locator('iframe[data-study-lab]');await iframe.scrollIntoViewIfNeeded();const frame=await (await iframe.elementHandle()).contentFrame();await frame.locator('#'+id+'.enhanced').waitFor();await frame.locator('#'+id+' [data-action=last]').click();
   await p.waitForFunction(()=>{const f=document.querySelector('iframe[data-study-lab]');return f&&f.style.height&&f.clientHeight>=f.contentDocument.documentElement.offsetHeight;});assert.deepEqual(await geometry(p),[]);assert.deepEqual(await geometry(frame),[]);
   report.push({chapter,embed:'passed',height:await iframe.evaluate(e=>e.clientHeight)});
  }
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),staticPage=await nojs.newPage();await staticPage.goto(base+'/visual-study.html');assert.equal(await staticPage.locator('.static-summary:visible').count(),3);assert.equal(await staticPage.locator('.interactive:visible').count(),0);assert.deepEqual(await geometry(staticPage),[]);
  await p.goto(base+'/visual-study.html');await p.emulateMedia({media:'print'});assert.equal(await p.locator('.static-summary:visible').count(),3);assert.equal(await p.locator('.interactive:visible').count(),0);assert.equal(await p.locator('svg').first().evaluate(e=>getComputedStyle(e).minWidth),'0px');
  await p.emulateMedia({media:'screen',reducedMotion:'reduce'});await p.locator('#binary [data-action=last]').click();assert.match(await p.locator('#binary .outcome').textContent(),/18/);
  await p.emulateMedia({media:'screen',reducedMotion:'no-preference'});await p.goto(base+'/visual-study-summary.html');assert.equal(await p.locator('svg').count(),3);assert.equal(await p.locator('script').count(),0);assert.deepEqual(await geometry(p),[]);
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({report,errors,requests,noJS:'passed',print:'passed',reducedMotion:'passed'},null,2));
  console.log(JSON.stringify({screens:6,embeds:3,edgeCases:'passed',noJS:'passed',print:'passed',reducedMotion:'passed',errors,externalRequests:requests,output}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
