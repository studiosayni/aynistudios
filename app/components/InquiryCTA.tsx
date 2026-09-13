import { BOOKING_URL } from "../lib/publicContent";
export default function InquiryCTA({
  title = "What story do you want to tell?",
}: {
  title?: string;
}) {
  return (
    <section className="inquiry-cta">
      <div className="site-width cta-inner">
        <div>
          <p className="eyebrow accent">Make something meaningful</p>
          <h2>{title}</h2>
          <p className="body-copy">
            Book a 15-minute conversation about your idea, your brief, or the
            footage you already have.
          </p>
        </div>
        <a href={BOOKING_URL} className="button" data-track="booking_click">
          Start a project <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
