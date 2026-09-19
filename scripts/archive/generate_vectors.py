import os
import urllib.request
import urllib.parse
import time
import glob

tasks = {
    "num-1000": "hand holding up 1 finger and waving it",
    "sign-ana": "hand pointing index finger at own chest",
    "sign-enta": "hand pointing index finger forward",
    "sign-ehna": "hand pointing index finger circling",
    "sign-eh": "hand palm facing up shaking side to side",
    "sign-ahlan": "hand flat salute from forehead",
    "sign-shokran": "hand moving away from chin flat palm",
    "sign-aasef": "hand rubbing chest in a circle",
    "sign-men-fadlak": "two hands clasped together begging",
    "sign-salam": "two hands shaking in a greeting peace",
    "sign-abb": "hand touching chin with index finger",
    "sign-omm": "hand touching cheek with flat palm",
    "sign-akh": "two index fingers tapping together side by side",
    "sign-okht": "index finger sliding down cheek",
    "sign-gedd": "hand stroking an imaginary long beard",
    "sign-yakol": "fingers bunched together pointing to mouth",
    "sign-yashrab": "hand holding an imaginary cup tilting to mouth",
    "sign-mayya": "index finger tapping chin",
    "sign-eish": "two hands clapping flat palms together bread",
    "sign-shai": "hand holding imaginary teacup saucer",
    "sign-beit": "two flat hands forming a roof shape house",
    "sign-baab": "two flat hands opening like a door",
    "sign-sareer": "two hands flat together next to cheek sleeping",
    "sign-madrasa": "two flat hands clapping together horizontally school",
    "sign-ketaab": "two flat hands opening like a book",
    "sign-qalam": "hand holding an imaginary pen writing",
    "sign-mabsoot": "two flat hands brushing up on chest smiling happy",
    "sign-hazeen": "hand pulling face downwards sad",
    "sign-baheb": "two hands crossed over heart love",
    "sign-ghadbaan": "two claw hands tearing at chest angry",
    "sign-qotta": "hand pinching imaginary whiskers on cheek cat",
    "sign-kalb": "hand patting leg calling dog",
    "sign-asfoora": "two fingers forming a beak at mouth bird",
    "sign-elyoum": "two flat hands pushing downwards today",
    "sign-bokra": "thumb pointing backwards over shoulder tomorrow",
    "sign-embareh": "flat hand slicing backwards past head yesterday"
}

# Add missing numbers to vector style tasks
for num in [1, 2, 3, 4, 5, 10, 20, 50, 100]:
    tasks[f"num-{num}"] = f"hand showing number {num}"

base_prompt = "Clean flat vector illustration of an isolated hand, colored in teal green with gold outlines, sign language gesture, pure cream background, vintage educational poster style, minimal, no text. Gesture: "

signs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'signs'))
os.makedirs(signs_dir, exist_ok=True)

print("Starting vector style generation...")
for filename, desc in tasks.items():
    prompt = base_prompt + desc
    url = "https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt) + "?width=512&height=512&nologo=true"
    out_path = os.path.join(signs_dir, f"{filename}.png")
    
    if not os.path.exists(out_path):
        print(f"Generating {filename} in vector style...")
        attempts = 3
        for i in range(attempts):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=15) as response, open(out_path, 'wb') as out_file:
                    out_file.write(response.read())
                time.sleep(2)
                break
            except Exception as e:
                print(f"Attempt {i+1} failed for {filename}: {e}")
                time.sleep(4)

print("Finished generation sweep.")
