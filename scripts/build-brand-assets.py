#!/usr/bin/env python3
"""Generate web-optimised WebP copies of the brand assets in public/brand/.

Why this exists rather than next/image: Firebase App Hosting does not serve the
Next image optimizer — /_next/image returns 404 in production, so next/image
silently falls back to emitting the raw src with no srcset, and every device
downloads the full-size original. Pre-building the variants gives real
optimisation independent of the hosting platform.

Run after adding or replacing anything in public/brand/, then commit the
generated .webp files:

    python3 scripts/build-brand-assets.py

Requires Pillow (pip install Pillow).

Note: originals are kept, deliberately. The hero JPEGs remain as the <img src>
fallback, and the full-size logo PNG is still what the schema.org Organization
markup points search engines at — crawlers want a large, universally supported
file, not a 160px WebP.
"""

from pathlib import Path

from PIL import Image

BRAND = Path(__file__).resolve().parent.parent / "public" / "brand"

# Hero stills are full-bleed backgrounds, so they need a real srcset. They also
# sit at 45% opacity behind a heavy scrim, which is why q65 is fine here where
# the logos below need q82.
HERO_WIDTHS = [640, 960, 1280, 1920]
HERO_QUALITY = 65

# Logos are line art and type: sharp edges cost more bits and artefacts show.
LOGO_QUALITY = 82
# Largest UI use of the mark is 44px (the thumbnail placeholder), so 160 covers
# it past 3x.
LOGO_MAX = 160
# Partner chips give each logo a ~154x56 content box; 480 covers that past 3x.
PARTNER_MAX = 480


def open_preserving_alpha(path: Path) -> Image.Image:
    im = Image.open(path)
    return im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")


def fit(im: Image.Image, max_w: int) -> Image.Image:
    """Downscale to max_w. Never upscales — most partner logos are already smaller."""
    if im.width <= max_w:
        return im
    return im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)


def report(name: str, before: int, after: int) -> None:
    pct = 100 - round(100 * after / before)
    print(f"  {name:<32}{before // 1024:>5}KB -> {after // 1024:>4}KB  ({pct}% smaller)")


def main() -> None:
    total_before = total_after = 0

    # Reported as smallest..largest variant, not their sum: a browser picks
    # exactly one from the srcset, so summing them would overstate the cost.
    print("hero stills (srcset variants — a device downloads ONE of these):")
    for src in sorted((BRAND / "hero").glob("hero-*.jpg")):
        im = open_preserving_alpha(src).convert("RGB")
        made = []
        for w in HERO_WIDTHS:
            if w > im.width:
                continue
            out = src.parent / f"{src.stem}-{w}.webp"
            fit(im, w).save(out, "WEBP", quality=HERO_QUALITY, method=6)
            made.append(out.stat().st_size)
        before = src.stat().st_size
        print(
            f"  {src.name:<32}{before // 1024:>5}KB -> "
            f"{min(made) // 1024}..{max(made) // 1024}KB  "
            f"({100 - round(100 * max(made) / before)}-"
            f"{100 - round(100 * min(made) / before)}% smaller)"
        )
        total_before += before
        total_after += max(made)  # worst case: the largest variant

    print("\nbrand mark (1080px original kept for schema.org):")
    logo = BRAND / "logo-icon-whitestroke.png"
    if logo.exists():
        out = logo.with_suffix(".webp")
        fit(open_preserving_alpha(logo), LOGO_MAX).save(
            out, "WEBP", quality=LOGO_QUALITY, method=6
        )
        report(logo.name, logo.stat().st_size, out.stat().st_size)
        total_before += logo.stat().st_size
        total_after += out.stat().st_size

    print("\npartner logos:")
    for src in sorted((BRAND / "partners").glob("*.png")):
        out = src.with_suffix(".webp")
        fit(open_preserving_alpha(src), PARTNER_MAX).save(
            out, "WEBP", quality=LOGO_QUALITY, method=6
        )
        report(src.name, src.stat().st_size, out.stat().st_size)
        total_before += src.stat().st_size
        total_after += out.stat().st_size

    print(
        f"\ntotal: {total_before // 1024}KB -> {total_after // 1024}KB "
        f"({100 - round(100 * total_after / total_before)}% smaller)"
    )


if __name__ == "__main__":
    main()
