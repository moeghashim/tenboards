import { chromium } from '../../node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const base='http://127.0.0.1:3396';
const results=[];
try {
 for (const theme of ['light','dark']) for (const [viewportName,viewport] of Object.entries({desktop:{width:1440,height:900},mobile:{width:390,height:844}})) {
  const context=await browser.newContext({viewport,colorScheme:theme,reducedMotion:'reduce'});
  await context.addCookies([{name:'theme_mode',value:theme,url:base}]);
  const page=await context.newPage();const errors=[];
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForURL('**/dashboard/default');await page.waitForLoadState('networkidle');
  if(viewportName==='mobile')await page.getByRole('button',{name:'Toggle Sidebar',exact:true}).click();
  await page.getByRole('link',{name:'Home',exact:true}).first().click();await page.waitForURL('**/dashboard/home');await page.getByRole('heading',{level:1}).waitFor();
  for(const [route,name] of [['/dashboard/analytics','Page Performance, scroll horizontally'],['/dashboard/projects/sample-operations/timeline','Schedule table, scroll horizontally']]) {
   await page.goto(base+route);await page.waitForLoadState('networkidle');
   if(route.includes('timeline'))await page.getByRole('button',{name:'Table',exact:true}).click();
   const region=page.getByRole('region',{name,exact:true});await page.keyboard.press("Tab");await region.focus();
   const before=await region.evaluate(e=>({left:e.scrollLeft,width:e.clientWidth,scroll:e.scrollWidth,outline:getComputedStyle(e).outlineStyle,outlineWidth:getComputedStyle(e).outlineWidth}));
   if(before.outline==='none'||before.outlineWidth==='0px')throw Error('Missing focus outline '+route);
   await page.keyboard.press('ArrowRight');await page.waitForTimeout(250);
   const after=await region.evaluate(e=>e.scrollLeft);
   if(before.scroll>before.width&&after<=before.left)throw Error('ArrowRight did not scroll '+route);
   await page.keyboard.press('Tab');if(await region.evaluate(e=>e===document.activeElement))throw Error('Focus trapped '+route);
   results.push({theme,viewportName,route,before,after,tabExits:true});
  }
  if(errors.length)throw Error(JSON.stringify(errors));
  console.log('PASS smoke and keyboard',theme,viewportName);await context.close();
 }
 console.log(JSON.stringify(results,null,2));
}finally{await browser.close()}
