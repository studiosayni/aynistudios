import type { Metadata } from "next";
import {
  LOCATION_PATH,
  NATURE_FOR_LIFE,
  SERVICE_AREAS,
  SITE_URL,
  STUDIO_ADDRESS,
  STUDIO_GEO,
  STUDIO_MAPS_URL,
  services,
} from "./publicContent";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  imageSlug = "home",
): Metadata {
  const image = {
    url: `${SITE_URL}/share/${imageSlug}`,
    width: 1200,
    height: 630,
    alt: `${title} — Ayni Studios`,
  };
  return {
    title: { absolute: `${title} | Ayni Studios` },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Ayni Studios",
      title: `${title} — Ayni Studios`,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Ayni Studios`,
      description,
      images: [image.url],
    },
  };
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/about#noah-beilin`;

// The founder as a first-class entity. Referenced from the organization,
// the about page, and every guide byline so search engines and AI answers
// can connect the studio to a named, verifiable person.
export const founder = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Noah Beilin",
  jobTitle: "Founder and filmmaker",
  worksFor: { "@id": ORGANIZATION_ID },
  url: `${SITE_URL}/about`,
  sameAs: ["https://www.linkedin.com/in/noahbeilin"],
  knowsAbout: [
    "Documentary filmmaking",
    "Conservation storytelling",
    "NGO video production",
    "Video editing and post-production",
  ],
};

// Organization AND LocalBusiness: the first keeps every existing @id
// reference valid, the second is what Google's local results and Gemini's
// place grounding actually key on — geo, service area, map, hours-free
// contact details. Everything here is visible somewhere on the site.
export const organization = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": ORGANIZATION_ID,
  name: "Ayni Studios",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/marks/ayni-icon.png`,
  image: [`${SITE_URL}/share/home`, `${SITE_URL}/brand/hero/hero-34.jpg`],
  slogan: "Real stories. Lasting impact.",
  description:
    "Ayni Studios is a documentary and impact video production company based in Valencia, California, in the Santa Clarita Valley of Los Angeles County. It produces documentaries, NGO and conservation films, brand and impact content, editing and post-production, and legacy films for clients in Los Angeles and worldwide. Its documentary They Live in Our World was selected for UNDP’s Nature for Life Hub 2024, and its BCRN programme film was showcased at COP30 and the IUCN World Conservation Congress 2025.",
  subjectOf: {
    "@type": "WebPage",
    name: "Nature for Life Hub 2024 — Day 3: They Live in Our World by Ayni Studios",
    url: NATURE_FOR_LIFE.sourceUrl,
  },
  founder,
  address: {
    "@type": "PostalAddress",
    ...STUDIO_ADDRESS,
  },
  geo: { "@type": "GeoCoordinates", ...STUDIO_GEO },
  hasMap: STUDIO_MAPS_URL,
  areaServed: SERVICE_AREAS,
  knowsAbout: [
    "Documentary production",
    "NGO and nonprofit video production",
    "Environmental and conservation filmmaking",
    "Brand and impact content",
    "Video editing and post-production",
    "Legacy films and life stories",
    "Remote and flexible video production",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Video production and storytelling services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": `${SITE_URL}/services/${service.slug}#service`,
        name: service.title,
        url: `${SITE_URL}/services/${service.slug}`,
      },
    })),
  },
  email: "humanity@ayni-studios.com",
  telephone: "+1-818-527-5760",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "humanity@ayni-studios.com",
    telephone: "+1-818-527-5760",
    url: `${SITE_URL}/contact`,
    availableLanguage: "English",
    areaServed: "Worldwide",
  },
  sameAs: [
    "https://www.youtube.com/@Ayni.Studios",
    "https://www.instagram.com/ayni_studios",
    "https://www.tiktok.com/@ayni_studios",
    "https://www.linkedin.com/company/ayni-studios",
  ],
};

// Site-level entity: lets Google show the studio name (not the URL) as the
// site name in results and ties every page to one publisher.
export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Ayni Studios",
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION_ID },
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// Plain-language question/answer pairs. Google no longer shows FAQ rich
// results for most sites, but the markup still gives AI answer engines a
// clean, quotable statement of who we are and where we work.
export function faqPage(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export const LOCATION_URL = `${SITE_URL}${LOCATION_PATH}`;
