# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=11"]
# ///
"""App Store creative assets: the product page header and the search results image.

    uv run ios/scripts/store-creative.py

One idea per asset (asset best practices): the tagline over the hand mirror of the app icon,
between two real screens. The focal point stays in the centre so device crops don't clip it.
Screens come from ios/StoreScreenshots/raw/<lang> (ios/scripts/store-capture.sh). Output per
language, one per accepted size (creative assets specifications, 2026-11-05):

    universal-5244x2950.png   16:9, accepted by both the header and search results
    header-3840x1646.png      21:9 product page header
    search-3840x2560.png      3:2 search results
"""

import importlib.util
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "StoreScreenshots"
MIRROR = ROOT / "EnMirror/AppIcon.icon/Assets/hand-mirror.png"

# Colours, fonts and the phone frame from the screenshot script, so both sets match.
_spec = importlib.util.spec_from_file_location("shots", Path(__file__).with_name("store-screenshots.py"))
shots = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(shots)

TAGLINES = {"en": "A clearer view. A little light.", "vi": "Soi rõ, sáng đủ."}
SCREENS = ("01-light", "03-freeze")
OUTPUTS = {
    "universal-5244x2950": (5244, 2950),
    "header-3840x1646": (3840, 1646),
    "search-3840x2560": (3840, 2560),
}


def creative(size, tagline, screens, mirror):
    w, h = size
    img = shots.gradient(size)
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(shots.TITLE_FONT.path, round(h * 0.075))
    draw.text(((w - draw.textlength(tagline, font=font)) / 2, h * 0.08), tagline, font=font, fill=shots.TITLE)

    art_w, phone_w = round(h * 0.46), round(h * 0.36)
    offset = art_w / 2 + h * 0.05 + phone_w / 2
    for screen, cx in zip(screens, (w / 2 - offset, w / 2 + offset)):
        shots.phone(img, screen, cx, round(h * 0.28), phone_w)
    art = mirror.resize((art_w, round(mirror.height * art_w / mirror.width)), Image.LANCZOS)
    img.paste(art, (round((w - art.width) / 2), round(h * 0.60 - art.height / 2)), art)
    return img


def main():
    mirror = Image.open(MIRROR).convert("RGBA")
    for lang, tagline in TAGLINES.items():
        raw = BASE / "raw" / lang
        screens = [Image.open(shots.raw_screen(raw, name)) for name in SCREENS]
        out = BASE / "out" / lang / "creative"
        out.mkdir(parents=True, exist_ok=True)
        for name, size in OUTPUTS.items():
            path = out / f"{name}.png"
            creative(size, tagline, screens, mirror).save(path, optimize=True)
            print(f"wrote {path}")


if __name__ == "__main__":
    main()
