import Link from "next/link";
import HeroSection from "./components/HeroSection";
import CredibilityStrip from "./components/CredibilityStrip";
import FeaturedWork from "./components/FeaturedWork";
import ServiceReveal from "./components/ServiceReveal";
import FieldFeature from "./components/FieldFeature";
import InquiryCTA from "./components/InquiryCTA";
import { LOCATION_PATH } from "./lib/publicContent";
import { jsonLd, organization, pageMetadata, website } from "./lib/seo";

export const metadata = pageMetadata(
  "Documentary & Impact Video Production, Los Angeles",
  "Documentary, NGO, conservation, brand, and legacy films from Ayni Studios, a Valencia, California production company serving Los Angeles and working worldwide. Showcased at COP30 and IUCN; selected for UNDP’s Nature for Life Hub.",
  "/",
);

// The "cinema cut" (2026-09-16): the hero's rules carried down the page.
// One image per section, type set over it, lists instead of cards, amber
// only. Each band draws one soft amber glow at the position it sets.
// Order (2026-09-18): proof first (selected work, recognition, remote
// methods), then what we do, then the ask. The "meaning behind the name"
// panel moved off the homepage; the about page carries it.
export default function HomePage() {
  return (
    <div className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organization) }}
      />
      <HeroSection />
      <CredibilityStrip />
      <FeaturedWork />

      <FieldFeature />

      <section
        className="band band-two services-showcase section-space"
        aria-labelledby="services-title"
        style={{ "--glow-x": "8%", "--glow-y": "28%" } as React.CSSProperties}
      >
        <div className="site-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">What we do</p>
              <h2 id="services-title">From first idea to final frame.</h2>
            </div>
            <p className="body-copy max-w-sm">
              A Valencia, California video production company serving Los
              Angeles and working globally with NGOs, conservation
              organizations, brands, and people preserving a legacy.
            </p>
          </div>
          <ServiceReveal variant="wide" />
          <div className="services-foot">
            <Link href="/services" className="text-link">
              All services <span aria-hidden="true">↗</span>
            </Link>
            <Link href={LOCATION_PATH} className="text-link">
              Video production in Los Angeles <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <InquiryCTA
        image={{
          src: "/brand/services/seafood-souq-boat-1920.webp",
          alt: "A fishing boat under the cliffs off Cape Town, filmed for Seafood Souq",
          caption: "Seafood Souq · Cape Town",
        }}
      />
    </div>
  );
}
