/* Shareable reading state. Values are written as URL parameters, never as HTML. */
(() => {
 'use strict';
 function write(patch,{push=false}={}){
  const url=new URL(location.href);
  for(const [key,value]of Object.entries(patch)){
   if(value===null||value===undefined||value==='')url.searchParams.delete(key);
   else url.searchParams.set(key,String(value));
  }
  if(url.href===location.href)return;
  history[push?'pushState':'replaceState'](null,'',url);
  window.dispatchEvent(new Event('studyurlchange'));
 }
 function chapter(id){
  const url=new URL(location.href),q=url.searchParams.get('q');
  url.search='';if(q)url.searchParams.set('q',q);url.hash=id;
  return url.pathname+url.search+url.hash;
 }
 function section(id){
  const url=new URL(location.href);url.searchParams.set('section',id);
  return url.pathname+url.search+url.hash;
 }
 window.StudyURL={write,chapter,section};
 const panelKeys=new Set(['exercise','example-code','prediction']);
 function restorePanels(root){
  const open=new Set((new URLSearchParams(location.search).get('panels')||'').split(','));
  root.querySelectorAll('details').forEach(el=>{
   const key=el.closest('.example-detail')?'example-code':el.closest('.example-scene')?'prediction':el.classList.contains('exercise-answer')?'exercise':null;
   if(key){el.dataset.panel=key;el.open=open.has(key);}
  });
 }
 document.addEventListener('toggle',event=>{
  const el=event.target,key=el.dataset?.panel;if(!el.isConnected||!panelKeys.has(key))return;
  const open=new Set((new URLSearchParams(location.search).get('panels')||'').split(',').filter(k=>panelKeys.has(k)));
  if(el.open)open.add(key);else open.delete(key);
  write({panels:[...open].sort().join(',')});
 },true);
 window.StudyPanels={restore:restorePanels};
})();
