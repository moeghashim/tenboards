(async()=>{await new Promise((resolve,reject)=>{let n=0;const check=()=>{if(Array.from(document.querySelectorAll('body *')).some(e=>Object.keys(e).some(k=>k.startsWith('__reactFiber$'))))resolve();else if(n++>200)reject(Error('hydration timeout'));else setTimeout(check,50)};check();});
const {fontRegistry}=await import('/src/lib/fonts/registry.ts');
const {applyFont}=await import('/src/lib/fonts/font-runtime.ts');
const results=[];
const docs=[document,...Array.from(document.querySelectorAll('iframe')).map(e=>e.contentDocument).filter(Boolean)];
const visible=e=>e.getClientRects().length && getComputedStyle(e).visibility!=='hidden';
for(const [font,def] of Object.entries(fontRegistry)){
 for(const doc of docs){if(!doc.querySelector('link[data-audit-font="'+font+'"]')){
 const l=doc.createElement('link');l.rel='stylesheet';l.href=def.stylesheet;l.dataset.auditFont=font;
 await new Promise((resolve,reject)=>{l.onload=resolve;l.onerror=()=>reject(new Error(font+' stylesheet'));doc.head.append(l)});
 }
 doc.documentElement.style.setProperty('--app-font-sans','"'+def.family+'", '+def.fallback);doc.documentElement.style.setProperty('--app-font-variation-settings',def.variationSettings||'normal');await doc.fonts.load('500 13px "'+def.family+'"');await doc.fonts.ready;
 }
 applyFont(font);await document.fonts.load('500 13px "'+def.family+'"');await document.fonts.ready;
 const problems=[], controls=[];

 for(const doc of docs){
 if(doc!==document){doc.documentElement.style.setProperty('--app-font-sans','"'+def.family+'", '+def.fallback);doc.documentElement.style.setProperty('--app-font-variation-settings',def.variationSettings||'normal');}
 for(const el of doc.querySelectorAll('button,[data-slot=button],select,[role=combobox]')){
 if(!visible(el)||el.closest('[data-slot=sidebar]')||el.hasAttribute('data-mail-id'))continue;
 const name=el.getAttribute('aria-label')||el.textContent.trim().slice(0,100);
 const clipped=[];
 if(el.tagName==='SELECT'){
 const s=getComputedStyle(el),canvas=doc.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=s.font;
 const available=el.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-20;
 for(const option of el.options) if(ctx.measureText(option.text).width>available+0.75)clipped.push(option.text);
 }
 const value=el.querySelector('[data-slot=select-value]');
 if(value && !value.children.length && el.dataset.auditOptions){const nodes=[...value.childNodes];for(const label of JSON.parse(el.dataset.auditOptions)){value.textContent=label;const range=doc.createRange();range.selectNodeContents(value);if(range.getBoundingClientRect().width>value.getBoundingClientRect().width+0.75)clipped.push(label);if(el.getBoundingClientRect().width>innerWidth)clipped.push('wider than viewport: '+label);}value.replaceChildren(...nodes);}
 const walker=doc.createTreeWalker(el,NodeFilter.SHOW_TEXT);
 let n;while(n=walker.nextNode()){
 if(!n.textContent.trim()||n.parentElement.closest('svg,.sr-only,[aria-hidden=true]')||!visible(n.parentElement))continue;
 const range=doc.createRange();range.selectNodeContents(n);
 for(const rect of range.getClientRects()){let p=n.parentElement;while(p&&el.contains(p)){
 const s=getComputedStyle(p),b=p.getBoundingClientRect();
 if((p===el||/(hidden|clip|auto)/.test(s.overflowX))&&(rect.right>b.right+0.75||rect.left<b.left-0.75)) {clipped.push(n.textContent.trim());break;}
 p=p.parentElement;
 }}
 }
 controls.push({name,width:el.getBoundingClientRect().width});
 if(clipped.length)problems.push({name,clipped:[...new Set(clipped)],slot:el.dataset.slot});
 }
 }
 results.push({font,documentWidth:document.documentElement.scrollWidth,loaded:document.fonts.check('500 13px "'+def.family+'"'),count:controls.length,problems});
}
applyFont('geist');
return {route:location.pathname,width:innerWidth,results};
})()
