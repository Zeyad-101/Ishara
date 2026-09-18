import os
import glob
from PIL import Image

raw_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'raw_photos'))
out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'signs'))

os.makedirs(out_dir, exist_ok=True)
images = glob.glob(os.path.join(raw_dir, "*.jpg"))

print(f"Copying {len(images)} raw images to signs folder immediately...")
for img_path in images:
    filename = os.path.basename(img_path)
    name, _ = os.path.splitext(filename)
    out_path = os.path.join(out_dir, f"{name}.png")
    
    if not os.path.exists(out_path):
        try:
            with Image.open(img_path) as img:
                img.save(out_path)
        except Exception as e:
            print(f"Error saving {filename}: {e}")
            
print("Done. Fallback images are ready.")
