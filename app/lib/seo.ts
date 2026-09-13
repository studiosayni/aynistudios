import type { Metadata } from "next";
import { SITE_URL } from "./publicContent";

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
    "Documentary production, brand and impact content, and editing from a Los Angeles studio working globally.",
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
    "https://www.linkedin.com/company/ayni-studios",
  ],
};
