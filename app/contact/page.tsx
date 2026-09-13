import { BOOKING_URL } from "../lib/publicContent";
import { pageMetadata } from "../lib/seo";
export const metadata = pageMetadata(
  "Start a Project",
  "Tell Ayni Studios about your documentary, brand film, or editing project. Contact our Los Angeles studio for productions and collaborations worldwide.",
  "/contact",
  "contact",
);
export default function ContactPage() {
  return (
    <div className="public-site site-width">
      <header className="page-heading">
        <p className="eyebrow accent">Let’s make something meaningful</p>
        <h1>
          It starts with
          <br />a conversation.
        </h1>
        <p className="body-copy">
          Book a 15-minute meeting to talk about your project. A first idea is
          enough to get started.
        </p>
      </header>
      <div className="editorial-grid pb-24">
        <section className="editorial-copy">
          <p className="eyebrow accent">15 minutes with Ayni Studios</p>
          <h2>Let’s talk about your story.</h2>
          <p>
            Choose a time on our Google Calendar booking page. We’ll discuss what
            you’re making, who it’s for, and how we can help.
          </p>
          <a href={BOOKING_URL} className="button" data-track="booking_click">
            Book a 15-minute meeting <span aria-hidden="true">↗</span>
          </a>
        </section>
        <aside>
          <p className="eyebrow accent mb-5">Talk to the studio</p>
          <a
            href="mailto:humanity@ayni-studios.com"
            className="text-link break-all"
            data-track="email_click"
          >
            humanity@ayni-studios.com
          </a>
          <br />
          <a
            href="tel:+18185275760"
            className="text-link"
            data-track="phone_click"
          >
            +1 818 527 5760
          </a>
          <br />
          <a
            href="https://wa.me/18185275760"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            data-track="whatsapp_click"
          >
            WhatsApp ↗
          </a>
          <p className="eyebrow mt-8">Los Angeles · Working globally</p>
          <div className="question-block mt-10">
            <h2 style={{ fontSize: 25 }}>What happens next?</h2>
            <p className="body-copy mt-4">
              Choose an available time and follow the booking steps in Google
              Calendar. Bring your idea, any useful references, and questions
              for the studio.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
