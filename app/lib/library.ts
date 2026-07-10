import { db } from "./firebase";
import {
  collection,
  getDocs,
  limit as qLimit,
  orderBy,
  query,
} from "firebase/firestore";

// Shared access to the `_library` production catalog (see
// _docs/AYNI_ARCHITECTURE.md). Used by /library, the homepage carousel, and
// the admin library manager.

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

export function youtubeWatchUrl(id?: string): string {
  if (!id) return "#";
  return `https://www.youtube.com/watch?v=${id}`;
}

export async function fetchLibrary(count?: number): Promise<LibraryItem[]> {
  const parts = [orderBy("sortKey", "desc"), ...(count ? [qLimit(count)] : [])];
  const snap = await getDocs(query(collection(db, "_library"), ...parts));
  return snap.docs.map((d) => ({
    dbId: d.id,
    ...(d.data() as Omit<LibraryItem, "dbId">),
  }));
}

// The item shown in the featured hero slot on /library: the flagged item,
// falling back to the newest.
export function pickFeatured(items: LibraryItem[]): LibraryItem | null {
  return items.find((i) => i.featured) ?? items[0] ?? null;
}
