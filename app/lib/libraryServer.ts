import "server-only";
import { adminDb } from "./firebaseAdmin";
import type { LibraryItem } from "./libraryShared";

// Server-side read of the `_library` catalog through the Admin SDK, so the
// public surfaces ship their content in the HTML. The client SDK talks to
// firestore.googleapis.com from the visitor's device, which a DNS filter or
// content blocker can stall indefinitely — the SDK is offline-first and waits
// rather than erroring, leaving the page on its loading state forever. Reading
// here moves that call server-side, where it always succeeds.

export async function fetchLibraryServer(
  count?: number
): Promise<LibraryItem[]> {
  const base = adminDb().collection("_library").orderBy("sortKey", "desc");
  const snap = await (count ? base.limit(count) : base).get();
  return snap.docs.map((d) => ({
    dbId: d.id,
    ...(d.data() as Omit<LibraryItem, "dbId">),
  }));
}
