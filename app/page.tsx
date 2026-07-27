import HeroSection from "./components/HeroSection";
import PartnerLogos from "./components/PartnerLogos";
import LibraryCarousel from "./components/LibraryCarousel";
import PortalSignInCard from "./components/PortalSignInCard";
import ContactCard from "./components/ContactCard";
import QuoteSection from "./components/QuoteSection";
import { fetchLibraryServer } from "./lib/libraryServer";
import type { LibraryItem } from "./lib/libraryShared";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://ayni-studios.com";

// Organization structured data (schema.org) for search engines.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ayni Studios",
  url: BASE_URL,
  logo: `${BASE_URL}/brand/logo-icon-whitestroke.png`,
  description:
    "Ayni Studios is a media studio producing documentary and impact content for the planet, humanity, and the future.",
  email: "humanity@ayni-studios.com",
  telephone: "+1-818-527-5760",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.youtube.com/@Ayni.Studios",
    "https://www.instagram.com/ayni_studios",
    "https://www.tiktok.com/@ayni_studios",
  ],
};

// Matches /library: the catalog changes rarely, so re-read it every 5 minutes
// rather than on every request.
export const revalidate = 300;

export default async function HomePage() {
  // Fetched here rather than in the carousel so the cards ship in the HTML —
  // a client-side Firestore call stalls indefinitely behind a network filter,
  // leaving the carousel on its skeletons forever.
  let carouselItems: LibraryItem[] = [];
  try {
    const all = await fetchLibraryServer(12);
    carouselItems = [
      ...all.filter((i) => i.featured),
      ...all.filter((i) => !i.featured),
    ].slice(0, 8);
  } catch (err) {
    console.error("Library carousel fetch error:", err);
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO — the ParticleField backdrop (layout-level) runs at full
          intensity behind this viewport and dims as you scroll; HeroSection
          adds ghosted word-image echoes synchronized with the rotator. */}
      <HeroSection />

      {/* LIBRARY PREVIEW */}
      <div id="library-preview">
        <LibraryCarousel items={carouselItems} />
      </div>

      {/* PARTNERS */}
      <PartnerLogos />

      {/* MALCOLM X QUOTE */}
      <QuoteSection />

      {/* PORTAL + CONTACT CARDS — the page's closer. The hero's "Client
          Portal" button anchors here, so this stays #portal.
          data-backdrop: loud. This is the emptiest section on the page — two
          cards in a 1024px column with ~400px of bare page either side — and
          the only one with nothing of its own competing for attention, so it
          is where the particle field earns its keep. See ParticleField. */}
      <section
        id="portal"
        data-backdrop="0.9"
        className="pb-24 md:pb-32 px-6 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
              Work with us
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black uppercase tracked">
              Clients &amp; Contact
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <PortalSignInCard />
            <ContactCard />
          </div>
        </div>
      </section>
    </div>
  );
}
