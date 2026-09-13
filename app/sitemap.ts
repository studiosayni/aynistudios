import type { MetadataRoute } from "next";
import {
  CONTENT_UPDATED,
  SITE_URL,
  projects,
  services,
} from "./lib/publicContent";
import { getPublicFilms } from "./lib/publicFilms";
export const revalidate = 300;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const filmPages = await getPublicFilms();
  const editorial = [
    "",
    "/library",
    "/services",
    "/about",
    "/contact",
    "/privacy",
    ...projects.map((p) => `/work/${p.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
  ];
  return [
    ...editorial.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: CONTENT_UPDATED,
    })),
    ...filmPages.map((f) => ({
      url: `${SITE_URL}/films/${f.slug}`,
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
