import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "../lib/publicContent";
import { MotifBand, MotifCluster } from "./Motifs";

// The closing band on every public page. Amber, used once per page at full
// width, with the motif set drawn in near-black at low opacity: a terrace
// strip along the bottom edge and a cluster in the top-right corner, both
// kept clear of the headline and the button.
//
// With `image`, the band splits: amber copy panel on the left, a full-height
// still on the right with a small caption. The homepage uses it; every other
// page keeps the plain amber band.
export default function InquiryCTA({
  title = "What story do you want to tell?",
  image,
}: {
  title?: string;
  image?: { src: string; alt: string; caption: string };
}) {
  return (
    <section className={`inquiry-cta${image ? " has-image" : ""}`}>
      <div className="cta-panel">
        <MotifCluster className="cta-motif-corner" />
        <MotifBand className="cta-motif-band" />
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
            <a href={BOOKING_URL} className="button button-dark" data-track="booking_click">
              Start a project <span aria-hidden="true">↗</span>
            </a>
            <Link href="/contact" className="text-link">
              Other ways to reach us <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
      {image && (
        <figure className="cta-image">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
          />
          <figcaption>{image.caption}</figcaption>
        </figure>
      )}
    </section>
  );
}
