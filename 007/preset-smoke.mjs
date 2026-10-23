import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base=process.argv[2]||'http://127.0.0.1:3000';
const browser=await chromium.launch();
const results=[];
try {
 for(const preset of ['brutalist','neo-brutalism','soft-pop','tangerine','default','graphite','pine','iris']) {
  for(const mode of ['light','dark']) {
   const context=await browser.newContext({reducedMotion:'reduce'});
   await context.addCookies([{name:'theme_preset',value:preset,url:base},{name:'theme_mode',value:mode,url:base}]);
   const page=await context.newPage();const errors=[];
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(`${base}/dashboard/default`);
   const ssr=await response.text();assert.match(ssr,/data-theme-preset="default"/);
   await page.waitForLoadState('networkidle');
   const expected=['brutalist','neo-brutalism','soft-pop','tangerine'].includes(preset)?'default':preset;
   await page.waitForFunction(expected=>document.documentElement.dataset.themePreset===expected,expected);
   assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('dark')),mode==='dark');
   assert.equal((await context.cookies()).find(x=>x.name==='theme_preset')?.value,expected);
   await page.locator('button').filter({has:page.locator('svg.lucide-settings')}).click();
   const chooser=page.getByRole('combobox').filter({hasText:expected==='default'?'Default':expected[0].toUpperCase()+expected.slice(1)});
   await chooser.waitFor();
   await chooser.click();
   await page.getByRole('option').first().waitFor();
   assert.deepEqual((await page.getByRole('option').allTextContents()).map(x=>x.trim()),['Default','Graphite','Iris','Pine']);
   await page.getByRole('option',{name:'Pine',exact:true}).click();
   await page.waitForFunction(()=>document.documentElement.dataset.themePreset==='pine');
   await page.getByRole('combobox').filter({hasText:'Geist'}).click();
   await page.getByRole('option',{name:'Geist Mono',exact:true}).waitFor();
   assert.equal(await page.getByRole('option').count(),18);
   await page.getByRole('option',{name:'Geist Mono',exact:true}).click();
   await page.reload();await page.waitForLoadState('networkidle');
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.themePreset),'pine');
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.font),'geistMono');
   const button=page.getByRole('button',{name:'Toggle Sidebar',exact:true});await page.keyboard.press('Tab');await button.focus();
   const focus=await button.evaluate(el=>({outline:getComputedStyle(el).outlineWidth,visible:el.matches(':focus-visible'),color:getComputedStyle(el).outlineColor,duration:getComputedStyle(el).transitionDuration}));
   assert.equal(focus.visible,true);assert.ok(parseFloat(focus.outline)>=2);assert.equal(focus.duration,'1e-05s');
   assert.deepEqual(errors,[]);
   results.push({preset,mode,migratedTo:expected,ssrDefault:true,customizer:true,fontRegistry:18,reloadPreserved:true,focus,reducedMotion:true,errors});
   await context.close();
  }
 }
 console.log(JSON.stringify(results,null,2));
}finally{await browser.close()}
