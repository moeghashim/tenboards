from pathlib import Path
import json,itertools
root=Path('/Users/moeghashim/tenboards/screenshots/v05-005')
routes=['/dashboard/calendar','/dashboard/finance','/dashboard/invoice','/dashboard/patient-monitoring','/dashboard/productivity','/dashboard/finance-v1','/auth/v2/login','/auth/v2/register']
key=lambda r: (r['route'],r['theme'],r['viewport'],r['phase'])
expected=set(itertools.product(routes,['light','dark'],['desktop','mobile'],['direct','refresh']))
out={'environments':{},'originalFailures':[],'passing':True,'total':0,'hydrationCases':0}
retryfile=root/'matrix/retries/dev-calendar-Chicago/report.json'
retry=json.loads(retryfile.read_text())
assert len(retry['results'])==8 and not any(r['errors'] for r in retry['results'])
for env in ['dev','db','workers']:
 groups={}
 for name,count in [('variants',48),('clocks-motion',20),('hydration-Chicago',64),('hydration-Kiritimati',64)]:
  file=root/'matrix/supplement'/env/name/'report.json'
  d=json.loads(file.read_text());rows=d['results']
  assert len(rows)==count and len({key(r) for r in rows})==count,(env,name,'count')
  assert d['maskedLiveClocks'] is False
  if name.startswith('hydration'):
   assert {key(r) for r in rows}==expected
   assert d['reload'] and d['hydrationDelayMs']==1800
   assert d['timezone']==('America/Chicago' if name.endswith('Chicago') else 'Pacific/Kiritimati')
   out['hydrationCases']+=len(rows)
  else: assert d['interactions']
  for r in rows:
   if not r['errors']: continue
   assert env=='dev' and name=='hydration-Chicago' and key(r)==('/dashboard/calendar','dark','desktop','direct'),(env,name,r)
   replacement=next(x for x in retry['results'] if key(x)==key(r))
   assert not replacement['errors']
   out['originalFailures'].append({'environment':env,'group':name,'case':key(r),'errors':r['errors'],'retry':str(retryfile.relative_to(root))})
  groups[name]={'cases':count,'passing':True,'report':str(file.relative_to(root))}
  out['total']+=count
 out['environments'][env]=groups
assert out['total']==588 and out['hydrationCases']==384
(root/'supplemental-coverage.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
