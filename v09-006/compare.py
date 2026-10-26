from pathlib import Path
from PIL import Image,ImageChops
import json
root=Path(__file__).parent
results=[]
for p in sorted((root/'before').glob('*/*.png')):
 q=root/'after'/p.relative_to(root/'before')
 if not q.exists():continue
 a,b=Image.open(p).convert('RGB'),Image.open(q).convert('RGB')
 result={'preset':p.parent.name,'file':p.name,'before':a.size,'after':b.size}
 if a.size==b.size:
  diff=ImageChops.difference(a,b);bbox=diff.getbbox();result['differenceBounds']=bbox
  result['changedPixels']=sum(1 for rgb in diff.getdata() if rgb!=(0,0,0))
 else: result['sizeChanged']=True
 results.append(result)
(root/'visual-comparison.json').write_text(json.dumps(results,indent=2)+'\n')
print('Compared',len(results),'identical',sum(r.get('changedPixels')==0 for r in results),'size changes',sum(r.get('sizeChanged',False) for r in results))
