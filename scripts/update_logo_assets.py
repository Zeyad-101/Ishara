import base64
import os
from PIL import Image

im = Image.open('logo.png')
bbox = im.getbbox()
print('Full Bbox:', bbox)

# 1. Full cropped logo (emblem + text ISHARA)
pad = 16
left = max(0, bbox[0] - pad)
top = max(0, bbox[1] - pad)
right = min(im.width, bbox[2] + pad)
bottom = min(im.height, bbox[3] + pad)
cropped_full = im.crop((left, top, right, bottom))
os.makedirs('assets/images', exist_ok=True)
cropped_full.save('assets/images/logo.png', 'PNG', optimize=True)
print('Saved assets/images/logo.png, size:', cropped_full.size)

# 2. Circular emblem only (without text)
emblem_top = bbox[1]
emblem_size = bbox[2] - bbox[0]
emblem_bottom = emblem_top + emblem_size
cropped_emblem = im.crop((bbox[0], emblem_top, bbox[2], emblem_bottom))
cropped_emblem.save('assets/images/logo-emblem.png', 'PNG', optimize=True)
print('Saved assets/images/logo-emblem.png, size:', cropped_emblem.size)

# 3. Favicon PNGs
for size in [16, 32, 48, 64, 128, 192, 512]:
    resized = cropped_emblem.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'assets/images/favicon-{size}.png', 'PNG')
    if size == 32:
        resized.save('assets/images/favicon.png', 'PNG')
    if size == 192:
        resized.save('assets/images/apple-touch-icon.png', 'PNG')

# 4. SVG Favicon with dark backdrop + subtle gold halo so it pops on dark/light tabs
with open('assets/images/favicon-64.png', 'rb') as f:
    b64_fav = base64.b64encode(f.read()).decode('utf-8')

svg_fav = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <defs>
    <radialGradient id="goldAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0f766e" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#0f172a" />
  <circle cx="32" cy="32" r="30" fill="url(#goldAura)" />
  <image href="data:image/png;base64,{b64_fav}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet" />
</svg>'''

with open('assets/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_fav)

# 5. SVG wrapper for logo.svg so existing tests also pass smoothly
with open('assets/images/logo.png', 'rb') as f:
    b64_logo = base64.b64encode(f.read()).decode('utf-8')

svg_logo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1192 1398" width="100%" height="100%">
  <image href="data:image/png;base64,{b64_logo}" x="0" y="0" width="1192" height="1398" preserveAspectRatio="xMidYMid meet" />
</svg>'''

with open('assets/images/logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_logo)

print('Updated assets/favicon.svg and assets/images/logo.svg successfully!')
