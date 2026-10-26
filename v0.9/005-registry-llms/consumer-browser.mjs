import {chromium} from '/Users/moeghashim/.t3/worktrees/tenboards/t3-58cb8224/node_modules/playwright/index.mjs';
import AxeBuilder from '/Users/moeghashim/.t3/worktrees/tenboards/t3-58cb8224/node_modules/@axe-core/playwright/dist/index.mjs';
import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const results=[];await mkdir('screenshots/005-consumer',{recursive:true});
try{for(const theme of ['light','dark'])for(const [size,viewport] of Object.entries({desktop:{width:1440,height:900},mobile:{width:390,height:844}})){
const ctx=await browser.newContext({viewport,colorScheme:theme,reducedMotion:'reduce'});const p=await ctx.newPage();const errors=[];p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:3406');await p.evaluate(dark=>document.documentElement.classList.toggle('dark',dark),theme==='dark');await p.waitForLoadState('networkidle');await p.getByText('Open requests',{exact:true}).waitFor();await p.locator('.recharts-line-curve').first().waitFor();
const styles=await p.evaluate(()=>{const c=getComputedStyle(document.documentElement);const card=getComputedStyle(document.querySelector('[data-slot=card]'));return {primary:c.getPropertyValue('--primary').trim(),card:card.backgroundColor,bodyFont:getComputedStyle(document.body).fontSize,spacing:c.getPropertyValue('--spacing').trim(),chart:getComputedStyle(document.querySelector('.recharts-line-curve')).stroke,overflow:document.documentElement.scrollWidth>innerWidth}});
assert.equal(styles.primary,theme==='light'?'#1e40af':'#a9c2ff');assert.equal(styles.card,theme==='light'?'rgb(255, 255, 255)':'rgb(25, 29, 37)');assert.equal(styles.bodyFont,'13px');assert.equal(styles.spacing,size==='desktop'?'0.21875rem':'0.25rem');assert.equal(styles.overflow,false);
assert.equal(await p.locator('.recharts-line-curve').count(),2);assert.equal(await p.getByRole('table').count(),1);
const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.equal(axe.violations.length,0,JSON.stringify(axe.violations));assert.deepEqual(errors,[]);
await p.screenshot({path:`screenshots/005-consumer/${theme}-${size}.png`,fullPage:true});results.push({theme,size,styles,errors,axeViolations:axe.violations.length});console.log('PASS external render',theme,size,JSON.stringify(styles));await ctx.close();
}}finally{await browser.close();await writeFile('screenshots/005-consumer/report.json',JSON.stringify(results,null,2))}
