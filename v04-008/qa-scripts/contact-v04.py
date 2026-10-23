from pathlib import Path
from PIL import Image,ImageDraw,ImageStat
import json,sys
p=Path('/Users/moeghashim/tenboards/screenshots/v04-008');env,preset=sys.argv[1:3];f=p/env/preset/'report.json';r=json.loads(f.read_text());rows=r['results'];routes=list(dict.fromkeys(x['route'] for x in rows));retries=json.loads((p/'retries.json').read_text());out=p/'contact-sheets';out.mkdir(exist_ok=True);audit=[]
for chunk in range(2):
 subset=routes[chunk*19:(chunk+1)*19];sheet=Image.new('RGB',(1440,len(subset)*265),'#ddd');d=ImageDraw.Draw(sheet)
 for ri,route in enumerate(subset):
  for ci,(theme,viewport) in enumerate([('light','desktop'),('light','mobile'),('dark','desktop'),('dark','mobile')]):
   row=next(x for x in rows if x['route']==route and x['theme']==theme and x['viewport']==viewport);folder=f.parent
   for entry in retries:
    if entry['environment']==env and entry['preset']==preset:
     q=p/entry['report'];v=json.loads(q.read_text());match=next((x for x in v['results'] if (x['route'],x['theme'],x['viewport'])==(route,theme,viewport) and not x['errors']),None)
     if match:row=match;folder=q.parent
   if row['errors']:raise Exception(row)
   file=folder/row['file'];im=Image.open(file).convert('RGB');variance=max(ImageStat.Stat(im).var);assert variance>1 or (route=='/auth/v2' and viewport=='mobile'),file
   audit.append({'file':str(file.relative_to(p)),'size':im.size,'variance':variance});im.thumbnail((350,240));sheet.paste(im,(ci*360+(350-im.width)//2,ri*265+23));d.text((ci*360+2,ri*265+2),route+' '+theme+'/'+viewport,fill='#000')
 sheet.save(out/f'{env}-{preset}-{chunk+1}.jpg',quality=90)
(p/f'image-integrity-{env}-{preset}.json').write_text(json.dumps(audit,indent=2));print(env,preset,len(audit),'decoded/checked')
