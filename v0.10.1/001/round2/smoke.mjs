import {chromium} from 'playwright';
const browser=await chromium.launch(); const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:3405/');await page.waitForLoadState('networkidle');await page.goto('http://127.0.0.1:3405/dashboard/home');await page.waitForLoadState('networkidle');if(errors.length)throw Error(JSON.stringify(errors));console.log('PASS / → /dashboard/home: zero console/page errors');await browser.close();
