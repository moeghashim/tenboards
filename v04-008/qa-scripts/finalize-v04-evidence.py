import json
from pathlib import Path
p=Path('/Users/moeghashim/tenboards/screenshots/v04-008')
key=lambda r:(r['route'],r['theme'],r['viewport'],r['phase'])
def merge(base,retries,expected):
 rows={};original=[];used=[];context=None
 for name in base:
  d=json.loads((p/name/'report.json').read_text())
  c={k:d.get(k) for k in ['baseURL','reference','preset','timezone','maskedLiveClocks','hydrationDelayMs','reload','interactions']}
  if context is None:context=c
  assert c==context,(name,c,context)
  for r in d['results']:
   assert key(r) not in rows
   rows[key(r)]={**r,'report':name+'/report.json'}
   if r['errors']:original.append(rows[key(r)])
 for name in retries:
  d=json.loads((p/name/'report.json').read_text());assert {k:d.get(k) for k in context}==context,name
  for r in d['results']:
   assert key(r) in rows
   if r['errors']:continue
   rows[key(r)]={**r,'report':name+'/report.json'};used.append({'case':key(r),'report':name+'/report.json'})
 failures=[r for r in rows.values() if r['errors']]
 assert len(rows)==expected,(len(rows),expected)
 return {'context':context,'expected':expected,'actual':len(rows),'passing':not failures,'originalFailures':original,'retries':used,'failures':failures,'results':list(rows.values())}
supp={}
for env in ['dev','db','workers']:
 supp[env]=merge([f'interactions-{env}-0',f'interactions-{env}-1'],['redirects-dev-final','system-dev-final','system-dev-recovery-retry','system-dev-keyboard-final'] if env=='dev' else (['interactions-db-register-retry'] if env=='db' else ['interactions-workers-chat-retry']),320 if env=='workers' else 160)
(p/'interaction-coverage.json').write_text(json.dumps(supp,indent=2))
hyd={}
for env in ['dev','db','workers']:
 for zone in ['Chicago','Kiritimati']:
  name=f'hydration-{env}-{zone}';hyd[name]=merge([name],['hydration-db-Chicago-invoice-retry'] if env=='db' and zone=='Chicago' else [],64)
(p/'hydration-coverage.json').write_text(json.dumps(hyd,indent=2))
for label,reports in [('interactions',supp),('hydration',hyd)]:
 print(label,sum(r['actual'] for r in reports.values()),'cases')
 for name,r in reports.items():
  print(name,'PASS' if r['passing'] else 'FAIL',len(r['originalFailures']),'original failures')
  for f in r['failures']:print(f)
 assert all(r['passing'] for r in reports.values())
