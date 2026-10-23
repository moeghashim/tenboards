from pathlib import Path
from PIL import Image,ImageChops
import json
p=Path('/Users/moeghashim/tenboards/screenshots/v04-008')
retries=json.loads((p/'retries.json').read_text());records=[]
for preset in ['default','graphite','pine','iris']:
 for left,right in [('before','dev'),('dev','db')]:
  for first in sorted((p/left/preset).glob('*.png')):
   if '-failed' in first.name:continue
   a=first;b=p/right/preset/first.name
   for env in [left,right]:
    for r in retries:
     if r['environment']==env and r['preset']==preset:
      q=p/r['report']
      if q.exists():
       report=json.loads(q.read_text());match=next((x for x in report['results'] if x['file']==first.name and not x['errors']),None)
       if match:
        if env==left:a=q.parent/match['file']
        else:b=q.parent/match['file']
   if not b.exists():continue
   im,jm=Image.open(a).convert('RGB'),Image.open(b).convert('RGB')
   row={'preset':preset,'from':left,'to':right,'file':first.name,'a':str(a.relative_to(p)),'b':str(b.relative_to(p)),'sameSize':im.size==jm.size}
   if im.size!=jm.size:row.update({'bbox':'size','sizes':[im.size,jm.size]})
   else:
    diff=ImageChops.difference(im,jm);bbox=diff.getbbox();row.update({'bbox':bbox,'changedPixels':sum(any(v) for v in diff.getdata()) if bbox else 0,'maximumChannelDelta':max(v[1] for v in diff.getextrema())})
    if bbox:
     out=p/'pixel-diffs'/preset;out.mkdir(parents=True,exist_ok=True);diff.save(out/(left+'-'+right+'-'+first.name))
   records.append(row)
(p/'image-comparison.json').write_text(json.dumps(records,indent=2))
print(len(records),'pairs;',sum(not r['bbox'] for r in records),'exact;',sum(bool(r['bbox']) for r in records),'nonzero')
print(json.dumps([r for r in records if r['bbox'] and (not r['sameSize'] or r.get('maximumChannelDelta',0)>4)],indent=2))
