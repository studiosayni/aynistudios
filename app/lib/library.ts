import { db } from "./firebase";
import {
  collection,
  getDocs,
  limit as qLimit,
  orderBy,
  query,
} from "firebase/firestore";
import type { LibraryItem } from "./libraryShared";

// Browser-side access to the `_library` catalog via the Firebase client SDK.
// Only the admin library manager still reads this way; the public /library
// page and the homepage carousel are server-rendered through
// libraryServer.ts, so a visitor whose network blocks googleapis.com still
// gets the catalog.
//
// Types and pure helpers live in libraryShared.ts and are re-exported here so
// existing imports keep resolving.
export * from "./libraryShared";

export async function fetchLibrary(count?: number): Promise<LibraryItem[]> {
  const parts = [orderBy("sortKey", "desc"), ...(count ? [qLimit(count)] : [])];
  const snap = await getDocs(query(collection(db, "_library"), ...parts));
  return snap.docs.map((d) => ({
    dbId: d.id,
    ...(d.data() as Omit<LibraryItem, "dbId">),
  }));
}
