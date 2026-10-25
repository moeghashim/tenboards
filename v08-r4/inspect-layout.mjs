import {chromium} from 'playwright';
import {cacheCaptureFonts} from '../../scripts/screenshot-assets.ts';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='screenshots/v08-r4/layout';await mkdir(out,{recursive:true});
const browser=await chromium.launch();const results=[];
try {for(const width of [1280,1440])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme,reducedMotion:'reduce'});await cacheCaptureFonts(context);
 await context.addCookies([{name:'theme_mode',value:theme,url:'http://127.0.0.1:3140'}]);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://127.0.0.1:3140/dashboard/home',{waitUntil:'networkidle'});await page.getByText('My tasks',{exact:true}).waitFor();
 const rects=await page.evaluate(()=>Object.fromEntries(['My tasks','Upcoming deadlines','Recent activity'].map(label=>{const h=[...document.querySelectorAll('h2,h3')].find(n=>n.textContent===label); const r=h.closest('[data-slot="card"]').getBoundingClientRect(); return [label,{x:r.x,y:r.y,width:r.width,height:r.height}]})));
 assert.ok(rects['Recent activity'].y>rects['My tasks'].y);assert.equal(rects['Recent activity'].x,rects['My tasks'].x);assert.ok(rects['Upcoming deadlines'].x>rects['My tasks'].x);
 await page.screenshot({path:`${out}/home-${theme}-${width}.png`,fullPage:true});
 await page.goto('http://127.0.0.1:3140/dashboard/projects/sample-operations/overview',{waitUntil:'networkidle'});
 const crumbs=page.getByRole('navigation',{name:'Breadcrumb'});assert.equal(await crumbs.getByRole('link').count(),2);assert.equal(await crumbs.locator('[aria-current="page"]').innerText(),'Overview');
 await crumbs.getByRole('link',{name:'Projects',exact:true}).focus(); assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'/dashboard/projects');
 assert.deepEqual(errors,[]);results.push({width,theme,rects,errors});await context.close();
}}finally{await browser.close();await writeFile(`${out}/report.json`,JSON.stringify(results,null,2));}
