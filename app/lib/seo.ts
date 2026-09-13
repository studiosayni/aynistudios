import type { Metadata } from "next";
import { SITE_URL, services, STUDIO_ADDRESS } from "./publicContent";

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

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Ayni Studios",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/marks/ayni-icon.png`,
  description:
    "A Valencia, California media production company serving Los Angeles and working globally on documentaries, NGO and conservation stories, brand films, and legacy videos. Flexible options include existing footage, filming kits, audio-led animation, and local filmmakers.",
  founder: { "@type": "Person", name: "Noah Beilin", sameAs: "https://www.linkedin.com/in/noahbeilin" },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog", name: "Video production and storytelling services",
    itemListElement: services.map((service) => ({
      "@type": "Offer", itemOffered: {
        "@type": "Service", "@id": `${SITE_URL}/services/${service.slug}#service`,
        name: service.title, url: `${SITE_URL}/services/${service.slug}`,
      },
    })),
  },
  email: "humanity@ayni-studios.com",
  telephone: "+1-818-527-5760",
  address: {
    "@type": "PostalAddress",
    ...STUDIO_ADDRESS,
  },
  sameAs: [
    "https://www.youtube.com/@Ayni.Studios",
    "https://www.instagram.com/ayni_studios",
    "https://www.tiktok.com/@ayni_studios",
    "https://www.linkedin.com/company/ayni-studios",
  ],
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
