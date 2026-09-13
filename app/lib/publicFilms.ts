import "server-only";
import { cache } from "react";
import { films, type Film } from "./publicContent";
import { fetchLibraryServer } from "./libraryServer";
import type { LibraryItem } from "./libraryShared";

export type PublicFilm = Film & { thumbnailUrl?: string };

export const getPublicFilms = cache(async (): Promise<PublicFilm[]> => {
  try {
    const catalog = await fetchLibraryServer();
    const knownIds = new Set(films.map((f) => f.youtubeId));
    // Editorial descriptions take precedence over old catalog copy; artwork
    // overrides remain managed through the existing library.
    const existing = films.map((f) => ({
      ...f,
      thumbnailUrl: catalog.find((i) => i.youtubeId === f.youtubeId)
        ?.thumbnailUrl,
    }));
    const additional = catalog.filter(
      (i): i is LibraryItem & { youtubeId: string } =>
        !!i.youtubeId &&
        /^[\w-]{11}$/.test(i.youtubeId) &&
        !knownIds.has(i.youtubeId),
    );
    return [
      ...existing,
      ...additional.map((i) => ({
        slug: `video-${i.youtubeId}`,
        youtubeId: i.youtubeId,
        title: i.title,
        description:
          i.description || `Watch ${i.title}, a film from Ayni Studios.`,
        category: i.category || "Film",
        client: i.client,
        year: i.year,
        thumbnailUrl: i.thumbnailUrl,
      })),
    ];
  } catch {
    // Public editorial pages remain useful if the catalog is unavailable.
    console.warn("Public catalog unavailable; using published film records.");
    return films;
  }
});
