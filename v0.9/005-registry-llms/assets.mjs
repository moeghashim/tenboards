import {readFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const origin='https://8dfbffb6-tenboards-preview.mohanadgh.workers.dev';
const r=JSON.parse(await readFile('registry.json','utf8'));
for(const path of ['/llms.txt','/llms-full.txt',...r.items.map(i=>`/r/${i.name}.json`)]) {
 const response=await fetch(origin+path);assert.equal(response.status,200);const content=await response.text();assert.equal(content,await readFile('public'+path,'utf8'));console.log('PASS',response.status,response.headers.get('content-type'),origin+path,'exact source-generation match');
 if(path.startsWith('/r/')) {const prior=await fetch('https://73e0c13c-tenboards-preview.mohanadgh.workers.dev'+path);assert.equal(await prior.text(),content);console.log('PASS registry identical to externally installed version',path)}
}
const llms=await readFile('public/llms.txt','utf8');for (const [,path] of llms.matchAll(/\]\((\/agent-docs\/[^)]+)\)/g)) {const r=await fetch(origin+path);assert.equal(r.status,200);assert.equal(await r.text(),await readFile('public'+path,'utf8'));console.log('PASS linked document',path)}
