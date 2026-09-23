import Link from "next/link";
import InquiryCTA, { CTA_STILL } from "../components/InquiryCTA";
import ServiceShowcase from "../components/ServiceShowcase";
import { BOOKING_URL, LOCATION_PATH, services } from "../lib/publicContent";
import { collectionPage, jsonLd, pageMetadata } from "../lib/seo";
const TITLE = "Video Production, NGO Films & Storytelling Services";
const DESCRIPTION =
  "Documentary production, brand and impact content, and editing. See how Ayni Studios can develop your story, produce a film, or work with existing footage.";
export const metadata = pageMetadata(TITLE, DESCRIPTION, "/services", "services");
const schema = collectionPage({
  path: "/services",
  name: TITLE,
  description: DESCRIPTION,
  items: services.map((s) => ({ name: s.title, path: `/services/${s.slug}` })),
});
export default function ServicesPage() {
  return (
    <div className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <div className="site-width">
        <header className="page-heading">
          <p className="eyebrow accent">Our services</p>
          <h1>
            Your story.
            <br />
            Our shared craft.
          </h1>
          <p className="body-copy">
            Documentaries, NGO and conservation stories, brand content, and legacy
            films. Work with us through new filming, existing footage, filming
            kits, audio-led animation, or local filmmakers.
          </p>
        </header>
        <div className="mb-16">
          <ServiceShowcase />
          <p className="small-copy mt-6">
            Studio in Valencia, California.{" "}
            <Link href={LOCATION_PATH} className="underline">
              Video production across Los Angeles
            </Link>{" "}
            and worldwide.
          </p>
        </div>
        <section className="editorial-grid section-space">
          <div>
            <p className="eyebrow accent mb-5">
              A practical production partnership
            </p>
            <h2>
              Clear scope.
              <br />
              Thoughtful delivery.
            </h2>
          </div>
          <div className="editorial-copy">
            <p>
              We start with the audience, the story, and what a successful
              result looks like for you. Then we agree the deliverables,
              timeline, and review process.
            </p>
            <p>
              Projects can include an individual film, a documentary series, a
              brand collaboration, or editing from existing material. The
              approach should fit the story and your resources.
            </p>
            <p>For an affordable approach, we can explore using your footage,
              sending filming kits, building animation around audio, or working
              with filmmakers in local communities. We scope the production
              around your material, audience, and budget.</p>
            <p><Link href="/guides/affordable-video-production" className="text-link">Compare production and budget options ↗</Link></p>
            <a
              href={BOOKING_URL}
              className="text-link"
              data-track="booking_click"
            >
              Talk through your brief ↗
            </a>
          </div>
        </section>
      </div>
      <InquiryCTA image={CTA_STILL} />
    </div>
  );
}
