import Link from "next/link";
import WordRotator from "./components/WordRotator";
import PartnerLogos from "./components/PartnerLogos";
import LibraryCarousel from "./components/LibraryCarousel";
import PortalSignInCard from "./components/PortalSignInCard";
import ContactCard from "./components/ContactCard";

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

export default function HomePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO — the ParticleField backdrop (layout-level) runs at full
          intensity behind this viewport and dims as you scroll. */}
      <section className="relative min-h-[calc(100svh-72px)] flex items-center justify-center px-6 py-20">
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracked leading-tight">
            Media forged
            <br />
            for our <WordRotator />
          </h1>

          <p className="mt-10 text-lg md:text-xl text-[#DCE4EB]/70 max-w-2xl mx-auto leading-relaxed">
            A media studio producing documentary and impact content for the
            planet, humanity, and the future.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/library"
              className="px-10 py-4 bg-[#FEB040] text-[#080F11] font-black uppercase tracked text-xs md:text-sm hover:bg-[#DCE4EB] transition-colors rounded"
            >
              View the Library
            </Link>
            <a
              href="#portal"
              className="px-10 py-4 border border-[#DCE4EB]/30 text-[#DCE4EB] font-black uppercase tracked text-xs md:text-sm hover:border-[#FEB040] hover:text-[#FEB040] transition-colors rounded"
            >
              Client Portal
            </a>
          </div>
        </div>

        <a
          href="#library-preview"
          aria-label="Scroll to library preview"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#7B878F] hover:text-[#FEB040] transition-colors motion-safe:animate-bounce"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </a>
      </section>

      {/* LIBRARY PREVIEW */}
      <div id="library-preview">
        <LibraryCarousel />
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
