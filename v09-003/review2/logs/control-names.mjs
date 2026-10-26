import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser = await chromium.launch();
try {
  for (const theme of ['light', 'dark']) {
    for (const [size, viewport] of Object.entries({desktop:{width:1440,height:900},mobile:{width:390,height:844}})) {
      const context = await browser.newContext({viewport,colorScheme:theme,reducedMotion:'reduce'});
      await context.addCookies([{name:'theme_mode',value:theme,url:'http://127.0.0.1:3078'}]);
      const page = await context.newPage();
      const errors=[];
      page.on('pageerror', e=>errors.push(e.message));
      page.on('console', m=>{if(m.type()==='error')errors.push(m.text());});
      await page.goto('http://127.0.0.1:3078/dashboard/default');
      await page.waitForLoadState('networkidle');
      const period=page.getByRole('combobox',{name:'Period 3 months',exact:true});
      await period.focus();
      await page.keyboard.press('Space');
      await page.getByRole('option',{name:'3 months',exact:true}).waitFor();
      await page.keyboard.press('Escape');
      assert(await period.evaluate(el=>el===document.activeElement));
      await page.getByRole('combobox',{name:'Segment All segments',exact:true}).click();
      await page.getByRole('option',{name:'Paid',exact:true}).click();
      await page.getByRole('combobox',{name:'Segment Paid',exact:true}).waitFor();
      const account = page.getByRole('button',{name:/Demo account:/});
      assert((await account.getAttribute('aria-label')).includes((await account.innerText()).trim()));
      await account.click();
      const identities = page.getByRole('menuitem').filter({has:page.locator('[data-slot="avatar"]')});
      await identities.nth(1).click();
      assert((await account.getAttribute('aria-label')).includes((await account.innerText()).trim()));
      const search=page.getByRole('button',{name:'Search ⌘K — pages (Command or Control K)',exact:true}).filter({visible:true});
      await search.click();
      await page.getByRole('dialog').waitFor();
      await page.keyboard.press('Escape');
      assert.deepEqual(errors,[]);
      console.log(`PASS ${theme}/${size}: named selects, keyboard Escape/focus return, changed selected value, switched account initials, search dialog; no console/page errors`);
      await context.close();
    }
  }
} finally {await browser.close();}
