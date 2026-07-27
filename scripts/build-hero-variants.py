#!/usr/bin/env python3
"""Generate responsive WebP variants of the hero stills.

Why this exists rather than next/image: Firebase App Hosting does not serve the
Next image optimizer — /_next/image returns 404 in production, so next/image
silently falls back to emitting the raw src with no srcset, and every device
downloads the full 1920px JPEG. These pre-built variants give real responsive
delivery independent of the hosting platform.

Run after adding or replacing anything in public/brand/hero/, then commit the
generated .webp files:

    python3 scripts/build-hero-variants.py

Requires Pillow (pip install Pillow).
"""

from pathlib import Path

from PIL import Image

HERO_DIR = Path(__file__).resolve().parent.parent / "public" / "brand" / "hero"
WIDTHS = [640, 960, 1280, 1920]
# The stills sit at 45% opacity behind a heavy scrim, so they tolerate more
# compression than foreground imagery would.
QUALITY = 65


def main() -> None:
    sources = sorted(HERO_DIR.glob("hero-*.jpg"))
    if not sources:
        raise SystemExit(f"no hero-*.jpg found in {HERO_DIR}")

    total_src = total_out = 0
    for src in sources:
        im = Image.open(src).convert("RGB")
        total_src += src.stat().st_size
        made = []
        for w in WIDTHS:
            if w > im.width:
                continue
            out = HERO_DIR / f"{src.stem}-{w}.webp"
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(
                out, "WEBP", quality=QUALITY, method=6
            )
            total_out += out.stat().st_size
            made.append(f"{w}px {out.stat().st_size // 1024}KB")
        print(f"{src.name:16} {src.stat().st_size // 1024:>4}KB  ->  " + ", ".join(made))

    print(
        f"\n{len(sources)} sources ({total_src // 1024}KB) -> "
        f"{total_out // 1024}KB across {len(WIDTHS)} widths"
    )


if __name__ == "__main__":
    main()
