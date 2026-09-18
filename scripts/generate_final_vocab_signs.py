"""Generate 30 new ESL vocabulary illustrations in assets/signs/ matching existing cards.
"""
from pathlib import Path
import math
from PIL import Image, ImageDraw

CANVAS_SIZE = 800
OUTPUT_SIZE = 400
SIGNS_DIR = Path("assets/signs")

CYAN = (0, 188, 212, 255)
GOLD = (245, 158, 11, 255)
WHITE = (255, 255, 255, 255)

def create_canvas() -> Image.Image:
    return Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))

def load_base(filename: str) -> Image.Image:
    path = SIGNS_DIR / filename
    return Image.open(path).convert("RGBA")

def scale_hand(im: Image.Image, height: int) -> Image.Image:
    w, h = im.size
    new_w = max(1, int(w * (height / h)))
    return im.resize((new_w, height), Image.Resampling.LANCZOS)

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
    nx = -uy
    ny = ux
    cx = bx - ux * (head_len * 0.15)
    cy = by - uy * (head_len * 0.15)
    p1 = (x2, y2)
    p2 = (bx + nx * head_w, by + ny * head_w)
    p3 = (cx, cy)
    p4 = (bx - nx * head_w, by - ny * head_w)
    draw.polygon([p1, p2, p3, p4], fill=color)

def draw_arc_arrow(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: int, 
                   start_deg: float, end_deg: float, width: int = 14, color: tuple = CYAN) -> None:
    pts = []
    steps = 30
    rad_start = math.radians(start_deg)
    rad_end = math.radians(end_deg)
    for i in range(steps + 1):
        ang = rad_start + (rad_end - rad_start) * (i / steps)
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.line(pts, fill=color, width=width)
    if len(pts) >= 2:
        draw_arrow(draw, pts[-2], pts[-1], width=width, head_len=36, head_w=30, color=color)

def save_sign(canvas: Image.Image, filename: str) -> None:
    final = canvas.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
    out_path = SIGNS_DIR / filename
    final.save(out_path, "PNG", optimize=True)
    print(f"Generated {filename}")

def generate_all():
    h1 = load_base("num-1.png")
    h2 = load_base("num-2.png")
    h3 = load_base("num-3.png")
    h4 = load_base("num-4.png")
    h5 = load_base("num-5.png")

    # --- Questions & Answers ---
    # 1. feen (أين / فين؟) - Two open palms rocking
    c = create_canvas()
    d = ImageDraw.Draw(c)
    hl = scale_hand(rotate_hand(h5, 20), 400)
    hr = mirror_hand(hl)
    paste_hand(c, hl, 280, 420)
    paste_hand(c, hr, 520, 420)
    draw_arrow(d, (240, 300), (320, 300), width=14, color=CYAN)
    draw_arrow(d, (560, 300), (480, 300), width=14, color=CYAN)
    save_sign(c, "sign-feen.png")

    # 2. emta (متى / إمتى؟) - Index circular query at wrist
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, -15), 460), 400, 430)
    draw_arc_arrow(d, 400, 260, 90, 0, 300, width=15, color=GOLD)
    save_sign(c, "sign-emta.png")

    # 3. leh (لماذا / ليه؟) - Open hand outward inquiry
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, -10), 480), 400, 430)
    draw_arrow(d, (400, 460), (400, 220), width=16, color=CYAN)
    draw_arrow(d, (300, 360), (180, 260), width=14, color=CYAN)
    draw_arrow(d, (500, 360), (620, 260), width=14, color=CYAN)
    save_sign(c, "sign-leh.png")

    # 4. meen (من / مين؟) - Index finger inquiring circle
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, 10), 480), 400, 420)
    draw_arc_arrow(d, 420, 240, 70, 45, 330, width=14, color=CYAN)
    save_sign(c, "sign-meen.png")

    # 5. kam (كم / كام؟) - Fingers flicking upward
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(h4, 460), 400, 430)
    draw_arrow(d, (300, 400), (300, 200), width=14, color=GOLD)
    draw_arrow(d, (400, 380), (400, 180), width=15, color=GOLD)
    draw_arrow(d, (500, 400), (500, 200), width=14, color=GOLD)
    save_sign(c, "sign-kam.png")

    # 6. aiwa (أيوة / نعم) - Nodding fist
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, -35), 450), 400, 420)
    draw_arrow(d, (400, 200), (400, 380), width=16, head_len=45, color=GOLD)
    draw_arrow(d, (440, 380), (440, 220), width=14, head_len=40, color=CYAN)
    save_sign(c, "sign-aiwa.png")

    # 7. laa (لا / رفض) - Index finger wagging left-right
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(h1, 480), 400, 430)
    draw_arrow(d, (240, 240), (560, 240), width=16, head_len=45, color=GOLD)
    draw_arrow(d, (560, 280), (240, 280), width=16, head_len=45, color=CYAN)
    save_sign(c, "sign-laa.png")

    # --- Food & Kitchen ---
    # 8. qahwa (قهوة) - Coffee sipping or cup holding
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h2, 45), 440), 370, 410)
    draw_arc_arrow(d, 400, 380, 120, 180, 340, width=15, color=GOLD)
    save_sign(c, "sign-qahwa.png")

    # 9. laban (لبن / حليب) - Squeezing milking motion
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, -15), 440), 400, 370)
    draw_arrow(d, (400, 320), (400, 560), width=16, head_len=48, color=CYAN)
    save_sign(c, "sign-laban.png")

    # 10. sukkar (سكر) - Fingers brushing chin
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h2, -25), 460), 400, 410)
    draw_arrow(d, (450, 220), (370, 360), width=15, color=GOLD)
    draw_arrow(d, (370, 360), (450, 220), width=13, color=CYAN)
    save_sign(c, "sign-sukkar.png")

    # 11. mattebakh (مطبخ) - Pan and stirring
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_pan = scale_hand(rotate_hand(h5, 90), 380)
    h_stir = scale_hand(rotate_hand(h1, -30), 400)
    paste_hand(c, h_pan, 320, 490)
    paste_hand(c, h_stir, 480, 340)
    draw_arc_arrow(d, 480, 340, 80, 0, 320, width=14, color=GOLD)
    save_sign(c, "sign-mattebakh.png")

    # 12. malh (ملح) - Sprinkling pinch
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h3, -40), 440), 400, 380)
    draw_arrow(d, (400, 340), (400, 560), width=15, color=CYAN)
    d.ellipse((360, 580, 375, 595), fill=GOLD)
    d.ellipse((400, 610, 415, 625), fill=GOLD)
    d.ellipse((440, 580, 455, 595), fill=GOLD)
    save_sign(c, "sign-malh.png")

    # --- Family ---
    # 13. gadda (جدة) - Gentle chin stroke forward
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, 20), 460), 400, 420)
    draw_arc_arrow(d, 400, 340, 110, 200, 340, width=15, color=GOLD)
    save_sign(c, "sign-gadda.png")

    # 14. walad (ولد / ابن) - Cap brim forward
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, 75), 450), 380, 380)
    draw_arrow(d, (300, 240), (520, 240), width=16, color=CYAN)
    save_sign(c, "sign-walad.png")

    # 15. bent (بنت / ابنة) - Cheek earring slide
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, 40), 460), 400, 400)
    draw_arrow(d, (460, 220), (360, 380), width=16, head_len=45, color=GOLD)
    save_sign(c, "sign-bent.png")

    # 16. tifl (طفل / رضيع) - Cradling baby
    c = create_canvas()
    d = ImageDraw.Draw(c)
    hl = scale_hand(rotate_hand(h5, 45), 380)
    hr = mirror_hand(hl)
    paste_hand(c, hl, 300, 420)
    paste_hand(c, hr, 500, 420)
    draw_arc_arrow(d, 400, 420, 130, 200, 340, width=15, color=CYAN)
    save_sign(c, "sign-tifl.png")

    # 17. aela (عائلة / أسرة) - Family circle connection
    c = create_canvas()
    d = ImageDraw.Draw(c)
    hl = scale_hand(rotate_hand(h5, -20), 400)
    hr = mirror_hand(hl)
    paste_hand(c, hl, 300, 420)
    paste_hand(c, hr, 500, 420)
    draw_arc_arrow(d, 400, 420, 160, 20, 160, width=15, color=GOLD)
    draw_arc_arrow(d, 400, 420, 160, 200, 340, width=15, color=CYAN)
    save_sign(c, "sign-aela.png")

    # --- Home ---
    # 18. kursi (كرسي) - Two bent fingers sitting on two bent fingers
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_base = scale_hand(rotate_hand(h2, 90), 380)
    h_top = scale_hand(rotate_hand(h2, -45), 380)
    paste_hand(c, h_base, 330, 490)
    paste_hand(c, h_top, 470, 340)
    draw_arrow(d, (480, 220), (410, 390), width=16, head_len=45, color=CYAN)
    save_sign(c, "sign-kursi.png")

    # 19. hammam (حمام) - Knocking gesture
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, -30), 460), 400, 420)
    draw_arrow(d, (330, 300), (430, 300), width=15, color=GOLD)
    draw_arrow(d, (430, 330), (330, 330), width=15, color=CYAN)
    save_sign(c, "sign-hammam.png")

    # 20. shobbak (شباك / نافذة) - Sliding window up/down
    c = create_canvas()
    d = ImageDraw.Draw(c)
    hl = scale_hand(rotate_hand(h5, 90), 360)
    hr = scale_hand(rotate_hand(h5, 90), 360)
    paste_hand(c, hl, 380, 310)
    paste_hand(c, hr, 420, 510)
    draw_arrow(d, (260, 390), (260, 230), width=16, color=CYAN)
    draw_arrow(d, (540, 430), (540, 590), width=16, color=GOLD)
    save_sign(c, "sign-shobbak.png")

    # --- School ---
    # 21. moallem (معلم / مدرس) - Temple forward teaching gesture
    c = create_canvas()
    d = ImageDraw.Draw(c)
    hl = scale_hand(rotate_hand(h5, -25), 400)
    hr = mirror_hand(hl)
    paste_hand(c, hl, 300, 430)
    paste_hand(c, hr, 500, 430)
    draw_arrow(d, (300, 440), (300, 220), width=15, color=GOLD)
    draw_arrow(d, (500, 440), (500, 220), width=15, color=GOLD)
    save_sign(c, "sign-moallem.png")

    # 22. waagib (واجب مدرسي) - Write on palm + commitment
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_palm = scale_hand(rotate_hand(h5, 90), 390)
    h_pen = scale_hand(rotate_hand(h1, -40), 400)
    paste_hand(c, h_palm, 330, 470)
    paste_hand(c, h_pen, 470, 340)
    draw_arrow(d, (520, 240), (390, 380), width=16, head_len=45, color=CYAN)
    save_sign(c, "sign-waagib.png")

    # 23. fasl (فصل دراسي / قاعة) - Room perimeter square
    c = create_canvas()
    d = ImageDraw.Draw(c)
    hl = scale_hand(rotate_hand(h5, -15), 400)
    hr = mirror_hand(hl)
    paste_hand(c, hl, 300, 420)
    paste_hand(c, hr, 500, 420)
    draw_arrow(d, (300, 240), (500, 240), width=15, color=CYAN)
    draw_arrow(d, (500, 580), (300, 580), width=15, color=GOLD)
    save_sign(c, "sign-fasl.png")

    # --- Animals ---
    # 24. samaka (سمكة) - Undulating swimming hand
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, 90), 460), 400, 400)
    draw_arc_arrow(d, 350, 470, 90, 180, 320, width=15, color=CYAN)
    draw_arc_arrow(d, 450, 330, 90, 0, 140, width=15, color=GOLD)
    save_sign(c, "sign-samaka.png")

    # 25. hosaan (حصان) - Two fingers twitching at temple
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h2, 25), 480), 400, 420)
    draw_arc_arrow(d, 400, 230, 80, 210, 330, width=16, color=GOLD)
    save_sign(c, "sign-hosaan.png")

    # 26. asad (أسد) - Mane stroke around head
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, -30), 470), 400, 410)
    draw_arc_arrow(d, 400, 400, 160, 160, 340, width=16, color=GOLD)
    save_sign(c, "sign-asad.png")

    # --- Time ---
    # 27. osboua (أسبوع) - Sliding index across flat palm
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_palm = scale_hand(rotate_hand(h5, 90), 380)
    h_idx = scale_hand(rotate_hand(h1, -15), 400)
    paste_hand(c, h_palm, 320, 470)
    paste_hand(c, h_idx, 480, 350)
    draw_arrow(d, (240, 450), (560, 450), width=16, head_len=45, color=GOLD)
    save_sign(c, "sign-osboua.png")

    # 28. shahr (شهر) - Index sliding down index
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_vert = scale_hand(h1, 440)
    h_slide = scale_hand(rotate_hand(h1, -55), 400)
    paste_hand(c, h_vert, 340, 440)
    paste_hand(c, h_slide, 470, 340)
    draw_arrow(d, (460, 220), (360, 480), width=16, head_len=46, color=CYAN)
    save_sign(c, "sign-shahr.png")

    # 29. sana (سنة) - Orbiting fists
    c = create_canvas()
    d = ImageDraw.Draw(c)
    hl = scale_hand(rotate_hand(h1, -30), 390)
    hr = scale_hand(rotate_hand(h1, 30), 390)
    paste_hand(c, hl, 320, 460)
    paste_hand(c, hr, 480, 360)
    draw_arc_arrow(d, 400, 410, 140, 30, 200, width=15, color=GOLD)
    draw_arc_arrow(d, 400, 410, 140, 210, 380, width=15, color=CYAN)
    save_sign(c, "sign-sana.png")

    # --- Greetings ---
    # 30. sabah-el-kheir (صباح الخير) - Sun rising from forearm
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_arm = scale_hand(rotate_hand(h5, 90), 380)
    h_sun = scale_hand(h5, 420)
    paste_hand(c, h_arm, 330, 520)
    paste_hand(c, h_sun, 460, 330)
    draw_arrow(d, (450, 460), (450, 180), width=16, head_len=48, color=GOLD)
    save_sign(c, "sign-sabah-el-kheir.png")

    print("All 30 signs successfully generated!")

if __name__ == "__main__":
    generate_all()
