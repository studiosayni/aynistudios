import { pageMetadata } from "../lib/seo";
export const metadata = pageMetadata(
  "Website Privacy",
  "How Ayni Studios handles project inquiries, optional website measurement, and embedded video players.",
  "/privacy",
  "privacy",
);
export default function PrivacyPage() {
  return (
    <article className="public-site site-width pb-24">
      <header className="page-heading">
        <p className="eyebrow accent">Public website</p>
        <h1>Your privacy.</h1>
        <p className="body-copy">
          How information is used when you browse this site or get in touch.
        </p>
      </header>
      <div className="editorial-copy max-w-3xl">
        <h2>Project inquiries</h2>
        <p>
          Our project booking links open Google Calendar, where you can arrange
          a 15-minute meeting. Information you provide there is handled by Google
          under its privacy practices and shared with us to organize your meeting.
          If you contact us by email, phone, or WhatsApp, we use the information
          you share to respond and discuss your project.
        </p>
        <h2>Website measurement</h2>
        <p>
          When optional analytics is enabled, we ask before loading Google
          Analytics. You can decline or change your choice through Analytics
          preferences. Measurement covers public page visits, contact actions,
          and website performance. We do not include your booking details or messages in
          analytics events. Your choice is stored in this browser.
        </p>
        <h2>Video and external links</h2>
        <p>
          Individual film pages load YouTube’s privacy-enhanced player. Your
          browser connects to YouTube when the player loads, and playback is
          subject to YouTube’s policies. Links to social profiles, WhatsApp, or
          other sites take you to services with their own privacy practices.
        </p>
        <h2>Questions</h2>
        <p>
          For questions about your inquiry or information you have shared with
          us, email{" "}
          <a className="underline" href="mailto:humanity@ayni-studios.com">
            humanity@ayni-studios.com
          </a>
          .
        </p>
        <p className="small-copy">
          Updated September 13, 2026. This page describes the public marketing
          website.
        </p>
      </div>
    </article>
  );
}
