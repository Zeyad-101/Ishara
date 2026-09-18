"""Generate all 35 ESL vocabulary sign photographic composite illustrations.
Adheres strictly to the Egyptian Sign Language (ESL) phonological rules from Ishara.md.
Composites real high-resolution transparent hand photos with crisp cyan motion arrows.
"""
from pathlib import Path
import math
from PIL import Image, ImageDraw

CANVAS_SIZE = 800  # Generate at 800x800, downsample to 400x400 for super-sampling anti-aliasing
OUTPUT_SIZE = 400
SIGNS_DIR = Path("assets/signs")

CYAN = (0, 188, 212, 255)
CYAN_GLOW = (0, 188, 212, 120)

def create_canvas() -> Image.Image:
    return Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))

def load_base(filename: str) -> Image.Image:
    path = SIGNS_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Base hand not found: {path}")
    return Image.open(path).convert("RGBA")

def scale_hand(im: Image.Image, height: int) -> Image.Image:
    w, h = im.size
    new_w = int(w * (height / h))
    return im.resize((new_w, height), Image.Resampling.LANCZOS)

def scale_hand_w(im: Image.Image, width: int) -> Image.Image:
    w, h = im.size
    new_h = int(h * (width / w))
    return im.resize((width, new_h), Image.Resampling.LANCZOS)

def rotate_hand(im: Image.Image, angle: float) -> Image.Image:
    return im.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)

def mirror_hand(im: Image.Image) -> Image.Image:
    return im.transpose(Image.FLIP_LEFT_RIGHT)

def paste_hand(canvas: Image.Image, hand: Image.Image, cx: int, cy: int) -> None:
    hw, hh = hand.size
    x = int(cx - hw / 2)
    y = int(cy - hh / 2)
    canvas.alpha_composite(hand, (x, y))

def draw_arrow(draw: ImageDraw.ImageDraw, start: tuple[float, float], end: tuple[float, float], 
               width: int = 14, head_len: int = 40, head_w: int = 34, color: tuple = CYAN) -> None:
    x1, y1 = start
    x2, y2 = end
    dx = x2 - x1
    dy = y2 - y1
    dist = math.hypot(dx, dy)
    if dist < 1:
        return
    ux = dx / dist
    uy = dy / dist
    bx = x2 - ux * head_len
    by = y2 - uy * head_len
    draw.line([(x1, y1), (bx, by)], fill=color, width=width)
    perp_x = -uy * (head_w / 2)
    perp_y = ux * (head_w / 2)
    draw.polygon([(x2, y2), (bx + perp_x, by + perp_y), (bx - perp_x, by - perp_y)], fill=color)

def draw_arc_arrow(draw: ImageDraw.ImageDraw, bbox: tuple[float, float, float, float], 
                   start_deg: float, end_deg: float, width: int = 14, head_len: int = 36, 
                   head_w: int = 30, color: tuple = CYAN, arrow_at_end: bool = True) -> None:
    draw.arc(bbox, start_deg, end_deg, fill=color, width=width)
    cx = (bbox[0] + bbox[2]) / 2
    cy = (bbox[1] + bbox[3]) / 2
    rx = (bbox[2] - bbox[0]) / 2
    ry = (bbox[3] - bbox[1]) / 2
    deg = end_deg if arrow_at_end else start_deg
    rad = math.radians(deg)
    px = cx + rx * math.cos(rad)
    py = cy + ry * math.sin(rad)
    tang_x = -rx * math.sin(rad)
    tang_y = ry * math.cos(rad)
    if not arrow_at_end:
        tang_x = -tang_x
        tang_y = -tang_y
    tdist = math.hypot(tang_x, tang_y)
    if tdist > 0:
        ux = tang_x / tdist
        uy = tang_y / tdist
        bx = px - ux * head_len
        by = py - uy * head_len
        perp_x = -uy * (head_w / 2)
        perp_y = ux * (head_w / 2)
        draw.polygon([(px, py), (bx + perp_x, by + perp_y), (bx - perp_x, by - perp_y)], fill=color)

def draw_bidirectional_arrow(draw: ImageDraw.ImageDraw, start: tuple[float, float], end: tuple[float, float], 
                             width: int = 14, head_len: int = 36, head_w: int = 30, color: tuple = CYAN) -> None:
    draw_arrow(draw, start, end, width, head_len, head_w, color)
    draw_arrow(draw, end, start, width, head_len, head_w, color)

def draw_tap_ripples(draw: ImageDraw.ImageDraw, center: tuple[float, float], base_r: float = 30, 
                     count: int = 2, width: int = 8, color: tuple = CYAN) -> None:
    cx, cy = center
    for i in range(count):
        r = base_r + i * 22
        bbox = (cx - r, cy - r, cx + r, cy + r)
        draw.arc(bbox, -45, 45, fill=color, width=width)
        draw.arc(bbox, 135, 225, fill=color, width=width)

def save_sign(canvas: Image.Image, filename: str) -> None:
    out = canvas.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
    out_path = SIGNS_DIR / filename
    out.save(out_path)
    print(f"Generated {filename}")

def main() -> None:
    # Preload base hands
    h1 = load_base("num-1.png")
    h2 = load_base("num-2.png")
    h3 = load_base("num-3.png")
    h4 = load_base("num-4.png")
    h5 = load_base("num-5.png")
    h_hamza = load_base("letter-hamza.png")
    h_laam_alif = load_base("letter-laam-alif.png")
    h_taa_marbuta = load_base("letter-taa-marbuta.png")

    # 1. sign-ana (I / Me) - Keep existing high quality or ensure present
    if not (SIGNS_DIR / "sign-ana.png").exists():
        c = create_canvas()
        hand = scale_hand(rotate_hand(h1, 35), 520)
        paste_hand(c, hand, 480, 480)
        d = ImageDraw.Draw(c)
        draw_arrow(d, (380, 240), (380, 440), width=18, head_len=45, head_w=38)
        save_sign(c, "sign-ana.png")

    # 2. sign-enta (You) - Index finger pointing straight forward at viewer
    c = create_canvas()
    hand = scale_hand(h1, 560)
    paste_hand(c, hand, 400, 450)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (400, 260), (400, 110), width=18, head_len=45, head_w=38)
    # Circle target at tip
    d.ellipse((360, 60, 440, 140), outline=CYAN, width=8)
    save_sign(c, "sign-enta.png")

    # 3. sign-ehna (We) - Index finger horizontal sweep across chest
    c = create_canvas()
    hand = scale_hand(rotate_hand(h1, 20), 520)
    paste_hand(c, hand, 400, 470)
    d = ImageDraw.Draw(c)
    draw_arc_arrow(d, (160, 130, 640, 390), 200, 340, width=16, head_len=40, head_w=34, arrow_at_end=True)
    save_sign(c, "sign-ehna.png")

    # 4. sign-eh (What?) - Open hand palm up shaking side to side
    c = create_canvas()
    hand = scale_hand(rotate_hand(h5, -15), 520)
    paste_hand(c, hand, 400, 460)
    d = ImageDraw.Draw(c)
    draw_bidirectional_arrow(d, (200, 160), (600, 160), width=16, head_len=40, head_w=34)
    save_sign(c, "sign-eh.png")

    # 5. sign-ahlan (Hello) - Salute from forehead outward
    c = create_canvas()
    hand = scale_hand(rotate_hand(h5, 30), 520)
    paste_hand(c, hand, 350, 460)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (450, 260), (680, 140), width=18, head_len=45, head_w=38)
    save_sign(c, "sign-ahlan.png")

    # 6. sign-shokran (Thank You) - Hand wave outward from chin toward receiver
    c = create_canvas()
    hand = scale_hand(rotate_hand(h5, 15), 520)
    paste_hand(c, hand, 380, 460)
    d = ImageDraw.Draw(c)
    draw_arc_arrow(d, (260, 140, 680, 440), 210, 330, width=16, head_len=40, head_w=34, arrow_at_end=True)
    save_sign(c, "sign-shokran.png")

    # 7. sign-aasef (Sorry) - Fist rubbing in circle over heart
    c = create_canvas()
    hand = scale_hand(rotate_hand(h1, 30), 500)  # Knuckles clenched over chest
    paste_hand(c, hand, 400, 470)
    d = ImageDraw.Draw(c)
    draw_arc_arrow(d, (250, 180, 550, 480), 30, 330, width=16, head_len=42, head_w=34, arrow_at_end=True)
    save_sign(c, "sign-aasef.png")

    # 8. sign-men-fadlak (Please) - Open flat hand over heart tapped twice
    c = create_canvas()
    hand = scale_hand(rotate_hand(h5, 25), 520)
    paste_hand(c, hand, 400, 460)
    d = ImageDraw.Draw(c)
    draw_tap_ripples(d, (400, 400), base_r=90, count=2, width=12)
    save_sign(c, "sign-men-fadlak.png")

    # 9. sign-salam (Peace / Goodbye) - Open hand waving side to side
    c = create_canvas()
    hand = scale_hand(h5, 540)
    paste_hand(c, hand, 400, 450)
    d = ImageDraw.Draw(c)
    # Waving curved indicators
    draw_arc_arrow(d, (150, 130, 350, 310), 120, 240, width=14, head_len=30, head_w=26, arrow_at_end=True)
    draw_arc_arrow(d, (450, 130, 650, 310), -60, 60, width=14, head_len=30, head_w=26, arrow_at_end=True)
    save_sign(c, "sign-salam.png")

    # 10. sign-abb (Father) - Index finger touching temple (traditional tarboush line)
    c = create_canvas()
    hand = scale_hand(rotate_hand(h1, -25), 540)
    paste_hand(c, hand, 440, 450)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (180, 140), (320, 220), width=18, head_len=45, head_w=38)
    draw_tap_ripples(d, (330, 225), base_r=30, count=2, width=10)
    save_sign(c, "sign-abb.png")

    # 11. sign-omm (Mother) - Index finger touching lower cheek / chin (veil line)
    c = create_canvas()
    hand = scale_hand(rotate_hand(h1, 15), 540)
    paste_hand(c, hand, 380, 470)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (580, 260), (450, 290), width=18, head_len=45, head_w=38)
    draw_tap_ripples(d, (440, 295), base_r=30, count=2, width=10)
    save_sign(c, "sign-omm.png")

    # 12. sign-akh (Brother) - Two index fingers held side-by-side touching (equality/brother)
    c = create_canvas()
    hand_r = scale_hand(h1, 520)
    hand_l = scale_hand(mirror_hand(h1), 520)
    paste_hand(c, hand_r, 470, 470)
    paste_hand(c, hand_l, 330, 470)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (200, 260), (310, 260), width=16, head_len=36, head_w=30)
    draw_arrow(d, (600, 260), (490, 260), width=16, head_len=36, head_w=30)
    save_sign(c, "sign-akh.png")

    # 13. sign-okht (Sister) - Female sign + two index fingers parallel touching
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h1, -10), 510)
    hand_l = scale_hand(rotate_hand(mirror_hand(h1), 10), 510)
    paste_hand(c, hand_r, 470, 480)
    paste_hand(c, hand_l, 330, 480)
    d = ImageDraw.Draw(c)
    # Contact ring over tips
    d.ellipse((350, 160, 450, 260), outline=CYAN, width=12)
    save_sign(c, "sign-okht.png")

    # 14. sign-gedd (Grandfather) - C-handshape pulling down from chin (long beard)
    c = create_canvas()
    hand = scale_hand(rotate_hand(h_hamza, -45), 520)
    paste_hand(c, hand, 400, 430)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (400, 360), (400, 680), width=20, head_len=50, head_w=40)
    save_sign(c, "sign-gedd.png")

    # 15. sign-yakol (Eat) - Bunched fingertips tapping lips twice
    c = create_canvas()
    hand = scale_hand(h_hamza, 520)
    paste_hand(c, hand, 400, 470)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (400, 130), (400, 250), width=18, head_len=45, head_w=38)
    draw_tap_ripples(d, (400, 270), base_r=40, count=2, width=10)
    save_sign(c, "sign-yakol.png")

    # 16. sign-yashrab (Drink) - C-handshape (cup) tilting upward to mouth
    c = create_canvas()
    hand = scale_hand(rotate_hand(h_hamza, -30), 520)
    paste_hand(c, hand, 380, 460)
    d = ImageDraw.Draw(c)
    draw_arc_arrow(d, (240, 150, 580, 450), 220, 330, width=18, head_len=45, head_w=38, arrow_at_end=True)
    save_sign(c, "sign-yashrab.png")

    # 17. sign-mayya (Water) - Index finger tapping chin
    c = create_canvas()
    hand = scale_hand(rotate_hand(h1, 10), 540)
    paste_hand(c, hand, 400, 470)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (400, 120), (400, 220), width=18, head_len=45, head_w=38)
    draw_tap_ripples(d, (400, 230), base_r=36, count=2, width=10)
    save_sign(c, "sign-mayya.png")

    # 18. sign-eish (Bread) - Two flat hands patting alternately (flattening dough)
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h5, -70), 400)
    hand_l = scale_hand(rotate_hand(mirror_hand(h5), 70), 400)
    paste_hand(c, hand_r, 520, 460)
    paste_hand(c, hand_l, 280, 480)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (280, 260), (280, 360), width=16, head_len=36, head_w=30)
    draw_arrow(d, (520, 360), (520, 260), width=16, head_len=36, head_w=30)
    save_sign(c, "sign-eish.png")

    # 19. sign-shai (Tea) - Pinching teabag and dipping up and down
    c = create_canvas()
    hand = scale_hand(rotate_hand(h_hamza, 180), 520)
    paste_hand(c, hand, 400, 380)
    d = ImageDraw.Draw(c)
    draw_bidirectional_arrow(d, (400, 520), (400, 710), width=18, head_len=45, head_w=38)
    save_sign(c, "sign-shai.png")

    # 20. sign-beit (House) - Keep existing roof
    if not (SIGNS_DIR / "sign-beit.png").exists():
        c = create_canvas()
        hand_r = scale_hand(rotate_hand(h5, 30), 460)
        hand_l = scale_hand(rotate_hand(mirror_hand(h5), -30), 460)
        paste_hand(c, hand_r, 520, 460)
        paste_hand(c, hand_l, 280, 460)
        save_sign(c, "sign-beit.png")

    # 21. sign-baab (Door) - Two flat hands, one swinging open on hinge
    c = create_canvas()
    hand_l = scale_hand(rotate_hand(mirror_hand(h5), 90), 380)
    hand_r = scale_hand(rotate_hand(h5, 45), 380)
    paste_hand(c, hand_l, 290, 450)
    paste_hand(c, hand_r, 510, 430)
    d = ImageDraw.Draw(c)
    draw_arc_arrow(d, (360, 200, 680, 480), 220, 330, width=16, head_len=40, head_w=34, arrow_at_end=True)
    save_sign(c, "sign-baab.png")

    # 22. sign-sareer (Bed) - Hands pressed together tilted beside head (sleeping)
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h5, 40), 480)
    hand_l = scale_hand(rotate_hand(mirror_hand(h5), 40), 480)
    paste_hand(c, hand_l, 370, 440)
    paste_hand(c, hand_r, 430, 460)
    d = ImageDraw.Draw(c)
    # Gentle sleep indicator lines
    draw_arc_arrow(d, (460, 160, 620, 300), 20, 100, width=12, head_len=24, head_w=20, arrow_at_end=False)
    save_sign(c, "sign-sareer.png")

    # 23. sign-madrasa (School) - Flat hands clapping together horizontally
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h5, -75), 420)
    hand_l = scale_hand(rotate_hand(mirror_hand(h5), 75), 420)
    paste_hand(c, hand_r, 530, 460)
    paste_hand(c, hand_l, 270, 460)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (180, 300), (320, 300), width=18, head_len=45, head_w=38)
    draw_arrow(d, (620, 300), (480, 300), width=18, head_len=45, head_w=38)
    # Clap burst at center
    draw_tap_ripples(d, (400, 300), base_r=30, count=2, width=10)
    save_sign(c, "sign-madrasa.png")

    # 24. sign-ketaab (Book) - Keep existing book open
    if not (SIGNS_DIR / "sign-ketaab.png").exists():
        c = create_canvas()
        hand_r = scale_hand(rotate_hand(h5, 10), 480)
        hand_l = scale_hand(rotate_hand(mirror_hand(h5), -10), 480)
        paste_hand(c, hand_r, 520, 470)
        paste_hand(c, hand_l, 280, 470)
        d = ImageDraw.Draw(c)
        draw_arc_arrow(d, (200, 100, 600, 350), 30, 150, width=16, head_len=40, head_w=34, arrow_at_end=True)
        draw_arc_arrow(d, (200, 100, 600, 350), 30, 150, width=16, head_len=40, head_w=34, arrow_at_end=False)
        save_sign(c, "sign-ketaab.png")

    # 25. sign-qalam (Pen) - Pinched pen hand writing over flat palm
    c = create_canvas()
    paper = scale_hand(rotate_hand(mirror_hand(h5), 70), 380)
    pen = scale_hand(rotate_hand(h_hamza, -45), 420)
    paste_hand(c, paper, 310, 520)
    paste_hand(c, pen, 480, 380)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (380, 470), (560, 470), width=16, head_len=40, head_w=34)
    save_sign(c, "sign-qalam.png")

    # 26. sign-mabsoot (Happy) - Flat hands brushing upward on chest
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h5, -15), 460)
    hand_l = scale_hand(rotate_hand(mirror_hand(h5), 15), 460)
    paste_hand(c, hand_r, 520, 480)
    paste_hand(c, hand_l, 280, 480)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (280, 360), (280, 160), width=18, head_len=45, head_w=38)
    draw_arrow(d, (520, 360), (520, 160), width=18, head_len=45, head_w=38)
    save_sign(c, "sign-mabsoot.png")

    # 27. sign-hazeen (Sad) - Index fingers tracing tears down cheeks
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h1, 170), 480)
    hand_l = scale_hand(rotate_hand(mirror_hand(h1), -170), 480)
    paste_hand(c, hand_r, 520, 430)
    paste_hand(c, hand_l, 280, 430)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (280, 380), (280, 640), width=18, head_len=45, head_w=38)
    draw_arrow(d, (520, 380), (520, 640), width=18, head_len=45, head_w=38)
    save_sign(c, "sign-hazeen.png")

    # 28. sign-baheb (Love) - Hands crossed over chest/heart in embrace
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h5, -35), 480)
    hand_l = scale_hand(rotate_hand(mirror_hand(h5), 35), 480)
    paste_hand(c, hand_l, 360, 460)
    paste_hand(c, hand_r, 440, 460)
    d = ImageDraw.Draw(c)
    # Heart shaped subtle accent
    draw_arc_arrow(d, (280, 200, 420, 340), 140, 340, width=12, head_len=24, head_w=20, arrow_at_end=True)
    draw_arc_arrow(d, (380, 200, 520, 340), 200, 40, width=12, head_len=24, head_w=20, arrow_at_end=True)
    save_sign(c, "sign-baheb.png")

    # 29. sign-ghadbaan (Angry) - Claws pulled up sharply
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h_hamza, -10), 480)
    hand_l = scale_hand(rotate_hand(mirror_hand(h_hamza), 10), 480)
    paste_hand(c, hand_r, 520, 480)
    paste_hand(c, hand_l, 280, 480)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (280, 400), (280, 160), width=20, head_len=50, head_w=40)
    draw_arrow(d, (520, 400), (520, 160), width=20, head_len=50, head_w=40)
    save_sign(c, "sign-ghadbaan.png")

    # 30. sign-qotta (Cat) - Whiskers pulled outward from cheeks
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h_hamza, 45), 460)
    hand_l = scale_hand(rotate_hand(mirror_hand(h_hamza), -45), 460)
    paste_hand(c, hand_r, 500, 460)
    paste_hand(c, hand_l, 300, 460)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (240, 340), (80, 340), width=18, head_len=45, head_w=38)
    draw_arrow(d, (560, 340), (720, 340), width=18, head_len=45, head_w=38)
    save_sign(c, "sign-qotta.png")

    # 31. sign-kalb (Dog) - Flat hand patting side of thigh
    c = create_canvas()
    hand = scale_hand(rotate_hand(h5, 175), 520)
    paste_hand(c, hand, 400, 430)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (400, 380), (400, 600), width=18, head_len=45, head_w=38)
    draw_tap_ripples(d, (400, 610), base_r=35, count=2, width=10)
    save_sign(c, "sign-kalb.png")

    # 32. sign-asfoora (Bird) - Beak opening/closing near mouth
    c = create_canvas()
    hand = scale_hand(rotate_hand(h_hamza, -90), 540)
    paste_hand(c, hand, 400, 450)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (400, 210), (400, 310), width=14, head_len=30, head_w=26)
    draw_arrow(d, (400, 430), (400, 330), width=14, head_len=30, head_w=26)
    save_sign(c, "sign-asfoora.png")

    # 33. sign-elyoum (Today) - Both flat hands palms up downward together
    c = create_canvas()
    hand_r = scale_hand(rotate_hand(h5, 15), 480)
    hand_l = scale_hand(rotate_hand(mirror_hand(h5), -15), 480)
    paste_hand(c, hand_r, 520, 430)
    paste_hand(c, hand_l, 280, 430)
    d = ImageDraw.Draw(c)
    draw_arrow(d, (280, 460), (280, 680), width=18, head_len=45, head_w=38)
    draw_arrow(d, (520, 460), (520, 680), width=18, head_len=45, head_w=38)
    save_sign(c, "sign-elyoum.png")

    # 34. sign-bokra (Tomorrow) - Pointing forward into future space
    c = create_canvas()
    hand = scale_hand(rotate_hand(h1, 30), 540)
    paste_hand(c, hand, 370, 470)
    d = ImageDraw.Draw(c)
    draw_arc_arrow(d, (300, 120, 700, 420), 200, 340, width=18, head_len=45, head_w=38, arrow_at_end=True)
    save_sign(c, "sign-bokra.png")

    # 35. sign-embareh (Yesterday) - Pointing backward over shoulder into past space
    c = create_canvas()
    hand = scale_hand(rotate_hand(h1, -40), 540)
    paste_hand(c, hand, 430, 470)
    d = ImageDraw.Draw(c)
    draw_arc_arrow(d, (100, 120, 500, 420), 200, 340, width=18, head_len=45, head_w=38, arrow_at_end=False)
    save_sign(c, "sign-embareh.png")

    print("All 35 vocabulary sign illustrations successfully generated!")

if __name__ == "__main__":
    main()
