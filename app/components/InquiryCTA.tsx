import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "../lib/publicContent";
import { MotifBand, MotifCluster } from "./Motifs";

// The still every public page shares for the closing band.
export const CTA_STILL = {
  src: "/brand/services/seafood-souq-boat-1920.webp",
  alt: "A fishing boat under the cliffs off Cape Town, filmed for Seafood Souq",
  caption: "Seafood Souq · Cape Town",
};

// The closing band on every public page. Amber, used once per page at full
// width, with the motif set drawn in near-black at low opacity: a terrace
// strip along the bottom edge and a cluster in the top-right corner, both
// kept clear of the headline and the button.
//
// With `image`, the band becomes a full-bleed still with the copy set over
// a dark scrim on the left and amber kept for the accents only, the same
// rule as the rest of the homepage. Since 2026-09-22 every public page
// passes CTA_STILL; the amber band is the fallback when no still is given.
export default function InquiryCTA({
  title = "What story do you want to tell?",
  image,
}: {
  title?: string;
  image?: { src: string; alt: string; caption: string };
}) {
  return (
    <section className={`inquiry-cta${image ? " has-image" : ""}`}>
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            // On phones the band is ~750px tall, so a 3:2 still set to cover
            // it draws ~1,110 CSS px wide whatever the screen width; "100vw"
            // fetched a 1,200px file for a 3x screen and the boat went soft.
            sizes="(max-width: 640px) 1160px, (max-width: 860px) 1020px, 100vw"
            className="cta-bg"
          />
          <div className="cta-scrim" aria-hidden="true" />
        </>
      ) : (
        <>
          <MotifCluster className="cta-motif-corner" />
          <MotifBand className="cta-motif-band" />
        </>
      )}
      <div className="cta-panel">
        <div className="site-width cta-inner">
          <div>
            <p className="eyebrow">Make something meaningful</p>
            <h2>{title}</h2>
            <p className="body-copy">
              Book a 15-minute conversation about your idea, your brief, or the
              footage you already have. Based in Valencia, California, working
              with Los Angeles and the world.
            </p>
          </div>
          <div className="cta-actions">
            <a
              href={BOOKING_URL}
              className={`button${image ? "" : " button-dark"}`}
              data-track="booking_click"
            >
              Start a project <span aria-hidden="true">↗</span>
            </a>
            <Link href="/contact" className="text-link">
              Other ways to reach us <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
      {image && <span className="cta-cap">{image.caption}</span>}
    </section>
  );
}
