# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=11"]
# ///
"""App Store screenshots: a headline, a line of copy and the screen in an iPhone frame.

    ios/scripts/store-capture.sh            # raw screens from the simulator, English and Vietnamese
    uv run ios/scripts/store-screenshots.py # ios/StoreScreenshots/raw/<lang> -> out/<lang>

Same look as Enchat's store screenshots (fuongz/enchat scripts/store-screenshots.py). Each slide
names a raw screen and its copy per language. Slides are drawn at 1320 x 2868 and written once per
App Store Connect slot in OUTPUTS: the required "iPhone with Dynamic Island (medium display)" slot
only takes 1179 x 2556 or 1206 x 2622.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "StoreScreenshots"

SLIDES = {
    "en": [
        ("01-light", "A ring light, built in", "A warm or cool glow\nlights up your face"),
        ("02-zoom", "Zoom in on the details", "Up to 3× for brows,\nlashes and lenses"),
        ("03-freeze", "Freeze to look closer", "Then save, share\nor pin the photo"),
        ("04-delay", "See behind you", "The delayed mirror shows you\n3 seconds ago, hair and all"),
        ("05-guide", "Even on both sides", "A centre line, a grid\nor a face oval"),
        ("06-pin", "Before and after", "Pin a photo over\nthe live mirror"),
    ],
    "vi": [
        ("01-light", "Đèn viền có sẵn", "Ánh sáng ấm hoặc lạnh\nchiếu sáng gương mặt"),
        ("02-zoom", "Soi kỹ từng chi tiết", "Zoom tới 3× cho mày,\nmi và kính áp tròng"),
        ("03-freeze", "Dừng hình để soi kỹ", "Rồi lưu, chia sẻ\nhoặc ghim ảnh"),
        ("04-delay", "Xem tóc phía sau", "Gương trễ cho bạn thấy\nhình 3 giây trước"),
        ("05-guide", "Cân đều hai bên", "Đường giữa, lưới\nhoặc khung oval"),
        ("06-pin", "So trước và sau", "Ghim ảnh lên gương\nđể so khi làm"),
    ],
}

SIZE = (1320, 2868)
# App Store Connect slot -> accepted size (screenshot specifications, checked 2026-11-05).
OUTPUTS = {
    "dynamic-island-medium": (1206, 2622),  # required
    "dynamic-island-large": (1320, 2868),
}
# The app's accent yellow (AccentColor, #FFC76B) fading up to a pale cream; warm brown text on top.
BG_TOP, BG_BOTTOM = (255, 244, 219), (255, 214, 145)
TITLE, BODY = (74, 44, 8), (112, 78, 32)
BEZEL, ISLAND = (12, 11, 18), (0, 0, 0)

FONTS = Path("/Library/Fonts")
TITLE_FONT = ImageFont.truetype(str(FONTS / "SF-Pro-Display-Bold.otf"), 112)
BODY_FONT = ImageFont.truetype(str(FONTS / "SF-Pro-Display-Regular.otf"), 60)

PHONE_W, PHONE_TOP, BORDER = 1000, 780, 26
PHONE_RADIUS = 168


def wrap(draw, text, font, width):
    """Breaks at "\\n" in the copy first, then wherever a line would run past `width`."""
    if "\n" in text:
        return [part for chunk in text.split("\n") for part in wrap(draw, chunk, font, width)]
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if line and draw.textlength(trial, font=font) > width:
            lines.append(line)
            line = word
        else:
            line = trial
    return lines + [line]


def centered(draw, lines, font, top, fill, spacing):
    for line in lines:
        x = (SIZE[0] - draw.textlength(line, font=font)) / 2
        draw.text((x, top), line, font=font, fill=fill)
        top += font.size + spacing
    return top


def gradient(size):
    img = Image.new("RGB", size)
    draw = ImageDraw.Draw(img)
    for y in range(size[1]):
        t = y / (size[1] - 1)
        draw.line([(0, y), (size[0], y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(BG_TOP, BG_BOTTOM)))
    return img


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius, fill=255)
    return mask


def phone(img, screen, center_x, top, width):
    """An iPhone frame `width` wide with the screen inside; it runs off the bottom edge."""
    border, radius = round(width * BORDER / PHONE_W), round(width * PHONE_RADIUS / PHONE_W)
    screen_w = width - 2 * border
    screen = screen.convert("RGB").resize((screen_w, round(screen.height * screen_w / screen.width)), Image.LANCZOS)
    left = round(center_x - width / 2)
    draw = ImageDraw.Draw(img)
    # Side buttons first so the body covers their inner edge.
    unit = width / PHONE_W
    for x, y, h in [(-8, 330, 110), (-8, 480, 190), (PHONE_W - 4, 420, 260)]:
        bx, by = left + round(x * unit), top + round(y * unit)
        draw.rounded_rectangle([bx, by, bx + round(12 * unit), by + round(h * unit)], round(6 * unit), fill=BEZEL)
    draw.rounded_rectangle([left, top, left + width, top + screen.height + 2 * border], radius, fill=BEZEL)
    img.paste(screen, (left + border, top + border), rounded_mask(screen.size, radius - border))
    island_w, island_h = round(300 * unit), round(88 * unit)
    ix, iy = round(center_x - island_w / 2), top + border + round(30 * unit)
    draw.rounded_rectangle([ix, iy, ix + island_w, iy + island_h], island_h // 2, fill=ISLAND)


def slide(screen, title, body):
    img = gradient(SIZE)
    draw = ImageDraw.Draw(img)
    top = centered(draw, wrap(draw, title, TITLE_FONT, 1140), TITLE_FONT, 250, TITLE, 18)
    centered(draw, wrap(draw, body, BODY_FONT, 1180), BODY_FONT, top + 40, BODY, 20)
    phone(img, screen, SIZE[0] / 2, PHONE_TOP, PHONE_W)
    return img


def raw_screen(raw, name):
    return next((p for p in sorted(raw.glob(f"{name}.*")) if p.suffix.lower() in {".png", ".jpg", ".jpeg"}), None)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--raw", type=Path, default=BASE / "raw")
    parser.add_argument("--out", type=Path, default=BASE / "out")
    args = parser.parse_args()
    for lang, slides in SLIDES.items():
        for name, title, body in slides:
            source = raw_screen(args.raw / lang, name)
            if source is None:
                print(f"skip {lang}/{name}: no {args.raw / lang / name}.png")
                continue
            img = slide(Image.open(source), title, body)
            for slot, size in OUTPUTS.items():
                out = args.out / lang / slot / f"{name}.png"
                out.parent.mkdir(parents=True, exist_ok=True)
                # Same aspect within 0.1%, so a plain resize keeps the layout.
                (img if img.size == size else img.resize(size, Image.LANCZOS)).save(out, optimize=True)
                print(f"wrote {out}")


if __name__ == "__main__":
    main()
