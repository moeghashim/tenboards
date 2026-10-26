"""Compare the immutable e659940 captures with the blocks branch.

Full screenshots remain unmodified. Exclude only the intentionally changed desktop
sidebar (0..287px); live monitor clocks were masked by the repository capture tool.
A >16 channel delta suppresses subpixel noise; report exact and thresholded counts.
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont
import json

root = Path(__file__).resolve().parent.parent
results = []
for before in sorted((root / 'before').glob('*.png')):
    after = root / 'after' / before.name
    if not after.exists():
        raise RuntimeError(f'Missing after capture: {before.name}')
    a, b = Image.open(before).convert('RGB'), Image.open(after).convert('RGB')
    if a.size != b.size:
        raise RuntimeError(f'Size changed: {before.name}: {a.size} / {b.size}')
    shell = before.name.startswith('_dashboard') or before.name.startswith('_-')
    box = (288 if shell and 'desktop' in before.name else 0, 0, *a.size)
    diff = ImageChops.difference(a.crop(box), b.crop(box))
    counts = diff.convert('RGB').getdata()
    exact, thresholded = 0, 0
    for pixel in counts:
        exact += max(pixel) > 0
        thresholded += max(pixel) > 16
    total = diff.width * diff.height
    results.append(dict(file=before.name, region=box, exactChangedPixels=exact,
        changedPixelsOver16=thresholded, percent=100 * thresholded / total,
        fullImageIdentical=ImageChops.difference(a, b).getbbox() is None))
report = dict(base='e659940', tolerance='0.1% pixels above channel delta 16',
    exclusions='Desktop sidebar only (x < 288); live monitor clock masked in source captures', results=results)
(root / 'qa/diff.json').write_text(json.dumps(report, indent=2) + '\n')
print(f'{len(results)} existing captures compared; {sum(r["exactChangedPixels"] == 0 for r in results)} pixel-identical content regions')
for result in results:
    if result['changedPixelsOver16']:
        print(result)
assert len(results) == 144, len(results)
assert all(result['percent'] <= 0.1 for result in results)

# Every submitted capture is visible on contact sheets for capture-integrity review.
font = ImageFont.truetype('/System/Library/Fonts/Monaco.ttf', 11)
files = sorted((root / 'before').glob('*.png')) + sorted((root / 'after').glob('*.png'))
for offset in range(0, len(files), 16):
    sheet = Image.new('RGB', (1440, 1920), '#e8e8e8')
    draw = ImageDraw.Draw(sheet)
    for index, file in enumerate(files[offset:offset + 16]):
        tile = Image.open(file).convert('RGB'); tile.thumbnail((350, 438))
        x, y = index % 4 * 360, index // 4 * 480
        sheet.paste(tile, (x, y + 32))
        label = f'{file.parent.name}: {file.name}'
        draw.text((x + 3, y + 2), label[:48], fill='black', font=font)
        draw.text((x + 3, y + 16), label[48:], fill='black', font=font)
    sheet.save(root / f'qa/contact-{offset//16+1:02}.jpg', quality=85)
