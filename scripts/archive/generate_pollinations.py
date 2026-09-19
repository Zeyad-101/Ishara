import os
import urllib.request
import urllib.parse
import time
import glob

# All possible tasks (including the ones we already tried)
tasks = {
    "num-1000": "right hand holding up 1 finger and waving it",
    "sign-ana": "right hand pointing index finger at own chest",
    "sign-enta": "right hand pointing index finger directly at camera",
    "sign-ehna": "right hand pointing index finger circling in front of chest",
    "sign-eh": "right hand palm facing up shaking side to side",
    "sign-ahlan": "right hand flat salute from forehead",
    "sign-shokran": "right hand moving away from chin flat palm",
    "sign-aasef": "right hand rubbing chest in a circle",
    "sign-men-fadlak": "two hands clasped together begging",
    "sign-salam": "two hands shaking in a greeting peace",
    "sign-abb": "right hand touching chin with index finger",
    "sign-omm": "right hand touching cheek with flat palm",
    "sign-akh": "two index fingers tapping together side by side",
    "sign-okht": "right index finger sliding down cheek",
    "sign-gedd": "right hand stroking an imaginary long beard",
    "sign-yakol": "right hand fingers bunched together pointing to mouth",
    "sign-yashrab": "right hand holding an imaginary cup tilting to mouth",
    "sign-mayya": "right index finger tapping chin",
    "sign-eish": "two hands clapping flat palms together bread",
    "sign-shai": "right hand holding imaginary teacup saucer dipping tea bag",
    "sign-beit": "two flat hands forming a roof shape house",
    "sign-baab": "two flat hands opening like a door",
    "sign-sareer": "two hands flat together next to cheek sleeping",
    "sign-madrasa": "two flat hands clapping together horizontally school",
    "sign-ketaab": "two flat hands opening like a book",
    "sign-qalam": "right hand holding an imaginary pen writing",
    "sign-mabsoot": "two flat hands brushing up on chest smiling happy",
    "sign-hazeen": "right hand pulling face downwards sad",
    "sign-baheb": "two hands crossed over heart love",
    "sign-ghadbaan": "two claw hands tearing at chest angry",
    "sign-qotta": "right hand pinching imaginary whiskers on cheek cat",
    "sign-kalb": "right hand patting leg calling dog",
    "sign-asfoora": "two fingers forming a beak at mouth bird",
    "sign-elyoum": "two flat hands pushing downwards today",
    "sign-bokra": "right thumb pointing backwards over shoulder tomorrow",
    "sign-embareh": "right flat hand slicing backwards past head yesterday"
}

base_prompt = "Extreme macro close up of ONLY hands on pure white background. NO FACE. NO BODY. NO PERSON. Just isolated hands doing sign language gesture: "

out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'raw_photos'))
signs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'signs'))
os.makedirs(out_dir, exist_ok=True)

print("Scanning for missing or deleted images...")
existing_signs = [os.path.basename(p).replace('.png', '') for p in glob.glob(f"{signs_dir}/*.png")]

needed_tasks = []
for filename, desc in tasks.items():
    if filename not in existing_signs:
        needed_tasks.append((filename, desc))
        raw_path = os.path.join(out_dir, f"{filename}.jpg")
        if os.path.exists(raw_path):
            os.remove(raw_path)

print(f"Need to generate {len(needed_tasks)} images.")

for filename, desc in needed_tasks:
    prompt = base_prompt + desc
    url = "https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt) + "?width=512&height=512&nologo=true"
    out_path = os.path.join(out_dir, f"{filename}.jpg")
    
    print(f"Generating {filename} (NO FACE)...")
    attempts = 3
    for i in range(attempts):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as response, open(out_path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Success: {filename}")
            time.sleep(3)
            break
        except Exception as e:
            print(f"Attempt {i+1} failed for {filename}: {e}")
            time.sleep(5)

print("Finished generation sweep.")
