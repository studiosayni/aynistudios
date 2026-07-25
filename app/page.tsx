import HeroSection from "./components/HeroSection";
import PartnerLogos from "./components/PartnerLogos";
import LibraryCarousel from "./components/LibraryCarousel";
import PortalSignInCard from "./components/PortalSignInCard";
import ContactCard from "./components/ContactCard";
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

      {/* PORTAL + CONTACT CARDS */}
      <section id="portal" className="py-20 md:py-28 px-6 scroll-mt-20">
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

      {/* PARTNERS */}
      <PartnerLogos />

      {/* MALCOLM X QUOTE */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed text-[#DCE4EB]/90">
            &ldquo;The media&apos;s the most powerful entity on earth. They
            have the power to make the innocent guilty and to make the guilty
            innocent, and that&apos;s power. Because they control the minds of
            the masses.&rdquo;
          </blockquote>
          <cite className="mt-8 block text-sm font-bold uppercase tracked text-[#FEB040] not-italic">
            — Malcolm X
          </cite>
        </div>
      </section>
    </div>
  );
}
