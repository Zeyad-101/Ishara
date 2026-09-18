"""Generate the 22 new ESL vocabulary sign illustrations using transparent base hands.
Uses only high-resolution transparent cutouts (num-1 through num-5).
"""
from pathlib import Path
import math
from PIL import Image, ImageDraw

CANVAS_SIZE = 800
OUTPUT_SIZE = 400
SIGNS_DIR = Path("assets/signs")

CYAN = (0, 188, 212, 255)
GOLD = (245, 158, 11, 255)

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
    out = canvas.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
    out_path = SIGNS_DIR / filename
    out.save(out_path, "PNG", optimize=True)
    print(f"Generated clean sign {filename}")

def generate_all():
    h1 = load_base("num-1.png")
    h2 = load_base("num-2.png")
    h3 = load_base("num-3.png")
    h4 = load_base("num-4.png")
    h5 = load_base("num-5.png")

    # 1. ahmar (أحمر)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, -25), 500), 400, 420)
    draw_arrow(d, (420, 240), (420, 420), width=16, head_len=45, head_w=36)
    save_sign(c, "sign-ahmar.png")

    # 2. azraq (أزرق)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, 90), 460), 380, 400)
    draw_arrow(d, (240, 600), (560, 600), width=16, head_len=45, head_w=36)
    save_sign(c, "sign-azraq.png")

    # 3. asfar (أصفر)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h2, -15), 480), 420, 410)
    draw_arrow(d, (260, 300), (360, 300), width=14, head_len=40, head_w=32)
    save_sign(c, "sign-asfar.png")

    # 4. akhdar (أخضر)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(h5, 500), 400, 450)
    draw_arrow(d, (400, 620), (400, 200), width=16, head_len=50, head_w=40)
    save_sign(c, "sign-akhdar.png")

    # 5. abyad (أبيض)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, -25), 480), 400, 420)
    draw_arrow(d, (480, 520), (320, 240), width=16, head_len=48, head_w=38)
    save_sign(c, "sign-abyad.png")

    # 6. aswad (أسود)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, 65), 460), 400, 400)
    draw_arc_arrow(d, 400, 400, 180, 180, 320, width=15)
    save_sign(c, "sign-aswad.png")

    # 7. doctor (دكتور)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_wrist = scale_hand(rotate_hand(h5, 90), 380)
    h_tap = scale_hand(rotate_hand(h2, -45), 420)
    paste_hand(c, h_wrist, 320, 500)
    paste_hand(c, h_tap, 480, 340)
    draw_arrow(d, (520, 240), (440, 380), width=15, head_len=42, head_w=34)
    save_sign(c, "sign-doctor.png")

    # 8. mostashfa (مستشفى)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(h1, 480), 400, 420)
    draw_arrow(d, (400, 190), (400, 360), width=16, head_len=45, head_w=36)
    draw_arrow(d, (250, 270), (550, 270), width=16, head_len=45, head_w=36)
    save_sign(c, "sign-mostashfa.png")

    # 9. taaban (تعبان)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, 45), 460), 400, 400)
    draw_arrow(d, (400, 220), (400, 560), width=16, head_len=48, head_w=38)
    save_sign(c, "sign-taaban.png")

    # 10. wagaa (وجع)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_left = scale_hand(rotate_hand(h1, -30), 400)
    h_right = mirror_hand(h_left)
    paste_hand(c, h_left, 280, 400)
    paste_hand(c, h_right, 520, 400)
    draw_arrow(d, (280, 540), (280, 440), width=14, head_len=36, head_w=30)
    draw_arrow(d, (520, 440), (520, 540), width=14, head_len=36, head_w=30)
    save_sign(c, "sign-wagaa.png")

    # 11. dawa (دوا)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, -30), 460), 400, 420)
    draw_arrow(d, (460, 440), (320, 260), width=16, head_len=45, head_w=36)
    save_sign(c, "sign-dawa.png")

    # 12. esaaf (إسعاف)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(h5, 440), 400, 460)
    draw_arc_arrow(d, 400, 280, 140, 30, 240, width=16)
    save_sign(c, "sign-esaaf.png")

    # 13. qamees (قميص)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_l = scale_hand(rotate_hand(h1, -15), 380)
    h_r = mirror_hand(h_l)
    paste_hand(c, h_l, 300, 400)
    paste_hand(c, h_r, 500, 400)
    draw_arrow(d, (300, 480), (220, 480), width=14, head_len=38, head_w=30)
    draw_arrow(d, (500, 480), (580, 480), width=14, head_len=38, head_w=30)
    save_sign(c, "sign-qamees.png")

    # 14. bantalon (بنطلون)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_l = scale_hand(rotate_hand(h5, 180), 400)
    h_r = mirror_hand(h_l)
    paste_hand(c, h_l, 310, 380)
    paste_hand(c, h_r, 490, 380)
    draw_arrow(d, (310, 340), (310, 600), width=15, head_len=44, head_w=34)
    draw_arrow(d, (490, 340), (490, 600), width=15, head_len=44, head_w=34)
    save_sign(c, "sign-bantalon.png")

    # 15. fostan (فستان)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_l = scale_hand(rotate_hand(h5, 140), 400)
    h_r = mirror_hand(h_l)
    paste_hand(c, h_l, 310, 360)
    paste_hand(c, h_r, 490, 360)
    draw_arrow(d, (310, 380), (200, 620), width=15, head_len=45, head_w=36)
    draw_arrow(d, (490, 380), (600, 620), width=15, head_len=45, head_w=36)
    save_sign(c, "sign-fostan.png")

    # 16. tarha (طرحة)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_l = scale_hand(rotate_hand(h5, -30), 380)
    h_r = mirror_hand(h_l)
    paste_hand(c, h_l, 280, 380)
    paste_hand(c, h_r, 520, 380)
    draw_arc_arrow(d, 400, 480, 160, 180, 0, width=15)
    save_sign(c, "sign-tarha.png")

    # 17. saaa (ساعة)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_wrist = scale_hand(rotate_hand(h5, 90), 380)
    h_tap = scale_hand(rotate_hand(h1, -60), 420)
    paste_hand(c, h_wrist, 320, 480)
    paste_hand(c, h_tap, 460, 340)
    draw_arrow(d, (480, 240), (420, 380), width=15, head_len=42, head_w=34)
    save_sign(c, "sign-saaa.png")

    # 18. aamel-eh (عامل إيه؟)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    h_l = scale_hand(h5, 400)
    h_r = mirror_hand(h_l)
    paste_hand(c, h_l, 290, 420)
    paste_hand(c, h_r, 510, 420)
    draw_arrow(d, (240, 580), (340, 580), width=14, head_len=36, head_w=28)
    draw_arrow(d, (560, 580), (460, 580), width=14, head_len=36, head_w=28)
    save_sign(c, "sign-aamel-eh.png")

    # 19. tamam (تمام)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, -10), 480), 400, 430)
    draw_arrow(d, (400, 600), (400, 240), width=16, head_len=50, head_w=40)
    save_sign(c, "sign-tamam.png")

    # 20. alhamdulillah (الحمد لله)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h5, -20), 480), 400, 420)
    draw_arrow(d, (420, 260), (420, 520), width=16, head_len=48, head_w=38)
    save_sign(c, "sign-alhamdulillah.png")

    # 21. mesh-faahem (مش فاهم)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, -40), 480), 400, 420)
    draw_arrow(d, (380, 360), (560, 280), width=16, head_len=46, head_w=36)
    save_sign(c, "sign-mesh-faahem.png")

    # 22. wahda-wahda (واحدة واحدة)
    c = create_canvas()
    d = ImageDraw.Draw(c)
    paste_hand(c, scale_hand(rotate_hand(h1, 20), 470), 400, 400)
    draw_arrow(d, (400, 240), (400, 380), width=14, head_len=36, head_w=30)
    draw_arrow(d, (400, 440), (400, 580), width=14, head_len=36, head_w=30)
    save_sign(c, "sign-wahda-wahda.png")

    print("Generated all 22 clean signs successfully!")

if __name__ == "__main__":
    generate_all()
