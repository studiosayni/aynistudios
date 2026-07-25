// Types and pure helpers for the `_library` production catalog (see
// _docs/AYNI_ARCHITECTURE.md). Deliberately free of any Firebase import so
// server components can use it without pulling the client SDK — which would
// run getAuth()/getFirestore() on the server — into their bundle.
//
// Data access lives alongside: library.ts (client SDK, browser only) and
// libraryServer.ts (Admin SDK, server only).

export type LibraryItem = {
  dbId: string;
  title: string;
  client?: string;
  year?: number;
  description?: string;
  youtubeId?: string; // e.g. "dQw4w9WgXcQ" — drives thumbnail + link/embed
  thumbnailUrl?: string; // optional override for non-YouTube sources
  category?: string;
  sortKey?: string; // ISO-date string; library sorts desc by this
  featured?: boolean; // hero slot on /library (first match wins)
};

export function youtubeThumb(
  id?: string,
  quality: "hq" | "maxres" = "hq"
): string | null {
  if (!id) return null;
  return `https://i.ytimg.com/vi/${id}/${quality === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;
}

// Ordered artwork candidates for a library item. LibraryThumbnail walks this
// list, advancing each time the current one fails to load:
//   1. an explicit thumbnailUrl override, when the item carries one
//   2. maxres on i.ytimg.com — a true 16:9 1280x720 frame
//   3. hq on the same host — only 480x360 and letterboxed, but it exists for
//      every video, whereas maxres 404s on older/short uploads
//   4-5. the same pair on img.youtube.com, a distinct hostname that often
//      survives a blocklist which catches i.ytimg.com (ad blockers and DNS
//      filters routinely carry the latter)
// Running off the end renders the branded placeholder instead of a void.
export function thumbnailChain(item: LibraryItem): string[] {
  const id = item.youtubeId;
  const hosted = id
    ? [
        `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      ]
    : [];
  return item.thumbnailUrl ? [item.thumbnailUrl, ...hosted] : hosted;
}

export function youtubeWatchUrl(id?: string): string {
  if (!id) return "#";
  return `https://www.youtube.com/watch?v=${id}`;
}

// The item shown in the featured hero slot on /library: the flagged item,
// falling back to the newest.
export function pickFeatured(items: LibraryItem[]): LibraryItem | null {
  return items.find((i) => i.featured) ?? items[0] ?? null;
}
