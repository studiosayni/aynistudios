import { guides } from "./lib/storytellingContent";
import type { MetadataRoute } from "next";
import {
  CONTENT_UPDATED,
  LOCATION_PATH,
  PAGE_UPDATED,
  SITE_URL,
  projects,
  services,
} from "./lib/publicContent";
import { getPublicFilms } from "./lib/publicFilms";
export const revalidate = 300;
// Each editorial page reports the date its content last changed
// (PAGE_UPDATED), not the build date — Google ignores lastmod once every
// URL carries the same value. Film pages use the film's publication date.
const lastModified = (path: string) => PAGE_UPDATED[path] ?? CONTENT_UPDATED;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const filmPages = await getPublicFilms();
  const editorial = [
    "",
    "/library",
    "/services",
    LOCATION_PATH,
    "/guides",
    ...guides.map((guide) => `/guides/${guide.slug}`),
    "/about",
    "/contact",
    "/privacy",
    ...projects.map((p) => `/work/${p.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
  ];
  return [
    ...editorial.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: lastModified(path || "/"),
    })),
    ...filmPages.map((f) => ({
      url: `${SITE_URL}/films/${f.slug}`,
      lastModified: f.uploadDate ? f.uploadDate.slice(0, 10) : CONTENT_UPDATED,
      ...(f.uploadDate
        ? {
            videos: [
              {
                title: f.title,
                description: f.description,
                thumbnail_loc: `https://i.ytimg.com/vi/${f.youtubeId}/hqdefault.jpg`,
                player_loc: `https://www.youtube-nocookie.com/embed/${f.youtubeId}`,
                publication_date: f.uploadDate,
              },
            ],
          }
        : {}),
    })),
  ];
}
