// Responsive srcset for the full-bleed background stills.
//
// Deliberately a plain <img> with a hand-built srcset rather than next/image.
// Firebase App Hosting does not serve the Next image optimizer (/_next/image
// 404s in production), so next/image silently degrades to emitting the raw src
// with no srcset at all and every device downloads the full 1920px original.
// These pre-built WebP variants deliver real responsive sizing independent of
// the host; the original .jpg stays as the src fallback.
//
// Widths are emitted by scripts/build-brand-assets.py — keep the two in sync.
export const BLEED_WIDTHS = [640, 960, 1280, 1920];

/** `base` is the path without extension, e.g. "/brand/hero/hero-7". */
export const bleedSrcSet = (base: string) =>
  BLEED_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
