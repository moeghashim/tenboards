import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { ensureVerifyServer } from '../../scripts/verify-page-server.ts';
import { mkdir } from 'node:fs/promises';
const phase=process.argv[2];
const server=await ensureVerifyServer(new URL('http://127.0.0.1:3405'));
const browser=await chromium.launch();
for(const preset of ['default','graphite','pine','iris']) for(const mode of ['light','dark']) for(const [size,viewport] of Object.entries({desktop:{width:1440,height:900},mobile:{width:390,height:844}})) {
 const context=await browser.newContext({viewport,reducedMotion:'reduce'});
 await context.addCookies([{name:'theme_preset',value:preset,url:'http://127.0.0.1:3405'},{name:'theme_mode',value:mode,url:'http://127.0.0.1:3405'}]);
 const page=await context.newPage(); await page.goto('http://127.0.0.1:3405/dashboard/users'); await page.waitForLoadState('networkidle');
 await page.getByRole('combobox',{name:'Role',exact:true}).click();
 await page.getByRole('option',{name:/Admin/}).first().click();
 await page.mouse.move(0,0); await page.getByRole('combobox',{name:'Role: Admin',exact:true}).blur();
 const folder=`verify/round2/${phase}/${preset}`; await mkdir(folder,{recursive:true});
 const frame=page.getByRole('combobox',{name:'Role: Admin',exact:true}).locator('..');
 const metrics=await frame.evaluate(el=>({height:el.getBoundingClientRect().height,fill:getComputedStyle(el).backgroundColor,edge:getComputedStyle(el).borderColor,clearWidth:el.querySelector('[aria-label="Clear Role filter"]').getBoundingClientRect().width,clearHeight:el.querySelector('[aria-label="Clear Role filter"]').getBoundingClientRect().height}));
 if(metrics.height!==(size==='desktop'?28:32)||metrics.clearWidth<24||metrics.clearHeight<24) throw Error(JSON.stringify(metrics));
 console.log(preset,mode,size,JSON.stringify(metrics));
 await frame.screenshot({path:`${folder}/active-${mode}-${size}.png`});
 await page.getByRole('combobox',{name:'Role: Admin',exact:true}).click();
 await page.locator('[data-slot=combobox-content]').screenshot({path:`${folder}/menu-${mode}-${size}.png`});
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze(); if(axe.violations.length) throw Error(JSON.stringify(axe.violations));
 await page.getByRole('combobox',{name:'Search Role options'}).fill('no-matching-role'); await page.getByText('No matches.',{exact:true}).waitFor();
 await page.keyboard.press('Escape');
 if(phase==='after') {
  const clear=page.getByRole('button',{name:'Clear Role filter'}); await clear.focus(); await page.keyboard.press('Enter');
  if(!await page.getByRole('combobox',{name:'Role',exact:true}).evaluate(el=>el===document.activeElement)) throw Error('Focus did not return');
 }
 await context.close();
}
await browser.close(); await server.stop();
