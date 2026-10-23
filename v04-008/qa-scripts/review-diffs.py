from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
import json,math
p=Path('screenshots/v04-008');rows=[r for r in json.loads((p/'image-comparison.json').read_text()) if r['bbox']]
sheet=Image.new('RGB',(1800,math.ceil(len(rows)/3)*150),'#ddd');d=ImageDraw.Draw(sheet)
for i,r in enumerate(rows):
 a=Image.open(p/r['a']).convert('RGB');b=Image.open(p/r['b']).convert('RGB');diff=ImageChops.difference(a,b);x,y,xx,yy=diff.getbbox();crop=(max(0,x-12),max(0,y-12),min(a.width,x+68),min(a.height,y+68));ox=(i%3)*600;oy=(i//3)*150
 d.text((ox,oy),str(i)+' '+r['preset']+' '+r['from']+'>'+r['to']+' '+r['file'],fill='black')
 for k,img in enumerate([a,b,diff.point(lambda p:min(255,p*60))]):sheet.paste(img.crop(crop).resize((120,120)),(ox+k*150,oy+25))
sheet.save(p/'pixel-diff-review.jpg',quality=95)
