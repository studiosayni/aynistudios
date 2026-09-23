import type { Metadata } from "next";
import {
  GOOGLE_PROFILE_URLS,
  LOCATION_PATH,
  NATURE_FOR_LIFE,
  SERVICE_AREAS,
  SITE_URL,
  STUDIO_ADDRESS,
  STUDIO_GEO,
  STUDIO_MAPS_URL,
  services,
} from "./publicContent";

// ── Title and description budget ──────────────────────────────────────
// Google cuts a result title at roughly 600px and a snippet at roughly 155
// characters. What gets cut is always the end, so the rules below decide
// what the end is, instead of leaving it to a mid-word "…".
// See Noah95/rink-products/ai-seo-playbook-2026-09.md section 4.4.

// Advance widths of printable ASCII (32 to 126) in Arial at 20px, the face
// and size of a desktop result title, measured once with PIL. Characters
// outside the table count as 11px, about a lowercase letter.
const ARIAL_20 = [
  6, 6, 7, 11, 11, 18, 13, 4, 7, 7, 8, 12, 6, 7, 6, 6, 11, 11, 11, 11, 11, 11,
  11, 11, 11, 11, 6, 6, 12, 12, 12, 11, 20, 13, 13, 14, 14, 13, 12, 16, 14, 6,
  10, 13, 11, 17, 14, 16, 13, 16, 14, 13, 12, 14, 13, 19, 13, 13, 12, 6, 6, 6,
  9, 11, 7, 11, 11, 10, 11, 11, 6, 11, 11, 4, 4, 10, 4, 17, 11, 11, 11, 11, 7,
  10, 6, 11, 10, 14, 10, 10, 10, 7, 5, 7, 12,
];
const WIDE: Record<string, number> = { "’": 4, "‘": 4, "“": 7, "”": 7, "–": 11, "—": 20, "·": 7, "×": 12, "…": 20 };
export function titleWidth(text: string): number {
  let px = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    px += code >= 32 && code <= 126 ? ARIAL_20[code - 32] : (WIDE[ch] ?? 11);
  }
  return px;
}

export const TITLE_BUDGET_PX = 600;
const BRAND_SUFFIX = " | Ayni Studios";
// Name plus brand when both fit; otherwise the name alone. Better to drop
// the brand than have Google cut the title mid-word: the site name already
// shows above every result (the WebSite schema) and in the URL.
export function fitTitle(title: string): string {
  const full = `${title}${BRAND_SUFFIX}`;
  return titleWidth(full) <= TITLE_BUDGET_PX ? full : title;
}

export const DESCRIPTION_BUDGET = 155;
export const SOCIAL_DESCRIPTION_BUDGET = 200;
// Cut at the last sentence end inside the budget when one falls at or past
// 60% of it (so "Ships flat." never becomes the whole description),
// otherwise at a word boundary with an ellipsis. Short copy is never padded:
// the fix for a thin description is better copy, not appended boilerplate.
export function clampDescription(text: string, budget = DESCRIPTION_BUDGET): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= budget) return t;
  const floor = Math.ceil(budget * 0.6);
  let sentenceEnd = -1;
  // Matched on the whole text: a period that only looks final because the
  // budget cut the word after it must not count.
  for (const m of t.matchAll(/[.!?](?=\s|$)/g)) {
    const end = m.index! + 1;
    if (end > budget) break;
    if (end >= floor) sentenceEnd = end;
  }
  if (sentenceEnd > 0) return t.slice(0, sentenceEnd);
  const cut = t.lastIndexOf(" ", budget - 1);
  return `${t.slice(0, cut > 0 ? cut : budget - 1).replace(/[\s,;:–—-]+$/, "")}…`;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  imageSlug = "home",
): Metadata {
  const image = {
    // ?v= busts the caches at LinkedIn, WhatsApp, Slack and iMessage, which
    // key on the image URL. Bump it whenever the card design changes.
    url: `${SITE_URL}/share/${imageSlug}?v=2`,
    width: 1200,
    height: 630,
    alt: `${title} — Ayni Studios`,
  };
  // Social cards show more text than a result snippet, so they get their
  // own, looser budget rather than the search one.
  const social = clampDescription(description, SOCIAL_DESCRIPTION_BUDGET);
  return {
    title: { absolute: fitTitle(title) },
    description: clampDescription(description),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Ayni Studios",
      title: `${title} — Ayni Studios`,
      description: social,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Ayni Studios`,
      description: social,
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
    ...GOOGLE_PROFILE_URLS,
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

// Index pages (/library, /services, /guides): what the page is, who
// publishes it, and the pages it lists in the order they appear on screen.
// List only what is visible on the page.
export function collectionPage(opts: {
  path: string;
  name: string;
  description: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}${opts.path}#page`,
    url: `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: opts.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${SITE_URL}${item.path}`,
      })),
    },
  };
}

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
