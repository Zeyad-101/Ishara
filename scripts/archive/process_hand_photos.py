import os
import glob
from rembg import remove

def process_photos():
    raw_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'raw_photos'))
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'signs'))
    
    os.makedirs(out_dir, exist_ok=True)
    images = glob.glob(os.path.join(raw_dir, "*.*"))
    
    # Filter for images
    images = [f for f in images if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    
    if not images:
        print(f"No photos found in {raw_dir}. Please add some photos of your hands.")
        print(f"Name them exactly like the letters (e.g., letter-alif.jpg, letter-baa.jpg)")
        return
        
    print(f"Processing {len(images)} photos...")
    for img_path in images:
        filename = os.path.basename(img_path)
        name, _ = os.path.splitext(filename)
        out_path = os.path.join(out_dir, f"{name}.png")
        
        print(f"Removing background: {filename} -> {name}.png")
        try:
            with open(img_path, 'rb') as i:
                input_data = i.read()
                
            output_data = remove(input_data)
            
            with open(out_path, 'wb') as o:
                o.write(output_data)
        except Exception as e:
            print(f"Failed to process {filename}: {e}")
            
    print("Done! Backgrounds removed.")

if __name__ == "__main__":
    process_photos()
