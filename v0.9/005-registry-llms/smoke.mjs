import { chromium } from '/Users/moeghashim/.t3/worktrees/tenboards/t3-58cb8224/node_modules/playwright/index.mjs';
import AxeBuilder from '/Users/moeghashim/.t3/worktrees/tenboards/t3-58cb8224/node_modules/@axe-core/playwright/dist/index.mjs';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch(); const errors=[];
try {
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
const page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
for (const [route,final] of [['/','/dashboard/default'],['/dashboard/home','/dashboard/home'],['/dashboard/kit','/dashboard/kit']]) {
 const response=await page.goto('http://127.0.0.1:3405'+route);assert.equal(response.status(),200);await page.waitForLoadState('networkidle');assert.equal(new URL(page.url()).pathname,final);console.log('PASS dev smoke',route,'→',final);
}
await mkdir('screenshots/005-interactions',{recursive:true});
for(const theme of ['light','dark'])for(const [size,viewport] of Object.entries({desktop:{width:1440,height:900},mobile:{width:390,height:844}})) {
 await context.addCookies([{name:'theme_mode',value:theme,url:'http://127.0.0.1:3405'}]);await page.setViewportSize(viewport);await page.reload();await page.waitForLoadState('networkidle');
 const summaries=page.locator('summary').filter({hasText:/^Install /});assert.equal(await summaries.count(),4);
 for(const summary of await summaries.all()){await summary.focus();await page.keyboard.press('Enter');}
 const links=page.getByRole('link',{name:/registry JSON$/});assert.equal(await links.count(),9);
 await page.getByRole('button',{name:'Copy StatCard command',exact:true}).click();
 assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'npx shadcn add http://127.0.0.1:3405/r/stat-card.json');
 const focus=page.getByRole('button',{name:'Copy DashboardChart command',exact:true});await page.keyboard.press('Tab');await focus.focus();assert.notEqual(await focus.evaluate(el=>getComputedStyle(el).outlineStyle),'none');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.equal(axe.violations.length,0,JSON.stringify(axe.violations));
 await page.screenshot({path:`screenshots/005-interactions/kit-${theme}-${size}.png`,fullPage:true});
 console.log('PASS expanded kit',theme,size,'9 links; keyboard disclosure; clipboard; focus; no overflow; axe clean');
}
assert.deepEqual(errors,[]);console.log('PASS no console/page errors');
}finally{await browser.close()}
