import Link from "next/link";
import { BOOKING_URL } from "../lib/publicContent";

// The closing band on every public page. Amber, used once per page at full
// width, so the page has a definite ending and the brand accent reads as
// deliberate rather than scattered.
export default function InquiryCTA({
  title = "What story do you want to tell?",
}: {
  title?: string;
}) {
  return (
    <section className="inquiry-cta">
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
    </section>
  );
}
