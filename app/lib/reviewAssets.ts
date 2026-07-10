import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Review-portal data layer (Phase 2 — frame.io-style review loop).
// Firestore: `_assets/{id}` + `versions` + `comments` subcollections;
// files in Storage under workspaces/{workspaceId}/assets/{assetId}/v{n}/.
// Schema documented in _docs/AYNI_ARCHITECTURE.md.

export type AssetStatus = "in_review" | "approved" | "changes_requested";

export const ASSET_STATUS_META: Record<
  AssetStatus,
  { label: string; classes: string }
> = {
  in_review: {
    label: "In review",
    classes: "bg-white/10 text-[#DCE4EB]",
  },
  approved: {
    label: "Approved",
    classes: "bg-emerald-400/15 text-emerald-300",
  },
  changes_requested: {
    label: "Changes requested",
    classes: "bg-[#FEB040]/15 text-[#FEB040]",
  },
};

export type ReviewAsset = {
  id: string;
  workspaceId: string;
  projectId?: string;
  title: string;
  status: AssetStatus;
  currentVersion: number;
  createdBy: string; // uid
  createdByName: string;
  createdAt: string;
  lastActivityAt: string;
};

export type AssetVersion = {
  id: string;
  n: number;
  storagePath: string;
  downloadUrl: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  uploadedByName: string;
  note?: string;
  createdAt: string;
};

export type AssetComment = {
  id: string;
  versionN: number;
  tSeconds: number | null; // null = general comment (not time-coded)
  body: string;
  authorUid: string;
  authorName: string;
  authorRole: "admin" | "client";
  resolved: boolean;
  createdAt: string;
};

// ---- Reads -----------------------------------------------------------------

export async function fetchWorkspaceAssets(
  workspaceId: string
): Promise<ReviewAsset[]> {
  // Equality-only query (rules-provable); sorted client-side so no
  // composite index is needed.
  const snap = await getDocs(
    query(collection(db, "_assets"), where("workspaceId", "==", workspaceId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<ReviewAsset, "id">) }))
    .sort((a, b) => (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? ""));
}

export async function fetchAsset(assetId: string): Promise<ReviewAsset | null> {
  const snap = await getDoc(doc(db, "_assets", assetId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<ReviewAsset, "id">) };
}

export async function fetchVersions(assetId: string): Promise<AssetVersion[]> {
  const snap = await getDocs(
    query(collection(db, "_assets", assetId, "versions"), orderBy("n", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AssetVersion, "id">),
  }));
}

export async function fetchComments(assetId: string): Promise<AssetComment[]> {
  const snap = await getDocs(
    query(
      collection(db, "_assets", assetId, "comments"),
      orderBy("createdAt", "asc")
    )
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AssetComment, "id">),
  }));
}

// ---- Writes ----------------------------------------------------------------

export async function createAssetDoc(args: {
  workspaceId: string;
  title: string;
  createdBy: string;
  createdByName: string;
}): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, "_assets"), {
    workspaceId: args.workspaceId,
    title: args.title,
    status: "in_review" satisfies AssetStatus,
    currentVersion: 0, // bumped when the first version finishes uploading
    createdBy: args.createdBy,
    createdByName: args.createdByName,
    createdAt: now,
    lastActivityAt: now,
  });
  return ref.id;
}

export async function addVersionDoc(args: {
  assetId: string;
  n: number;
  storagePath: string;
  downloadUrl: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  uploadedByName: string;
  note?: string;
}): Promise<void> {
  const now = new Date().toISOString();
  await addDoc(collection(db, "_assets", args.assetId, "versions"), {
    n: args.n,
    storagePath: args.storagePath,
    downloadUrl: args.downloadUrl,
    size: args.size,
    contentType: args.contentType,
    uploadedBy: args.uploadedBy,
    uploadedByName: args.uploadedByName,
    note: args.note ?? "",
    createdAt: now,
  });
  await updateDoc(doc(db, "_assets", args.assetId), {
    currentVersion: args.n,
    status: "in_review" satisfies AssetStatus, // new cut restarts the review
    lastActivityAt: now,
  });
}

export async function addComment(args: {
  assetId: string;
  versionN: number;
  tSeconds: number | null;
  body: string;
  authorUid: string;
  authorName: string;
  authorRole: "admin" | "client";
}): Promise<void> {
  const now = new Date().toISOString();
  await addDoc(collection(db, "_assets", args.assetId, "comments"), {
    versionN: args.versionN,
    tSeconds: args.tSeconds,
    body: args.body,
    authorUid: args.authorUid,
    authorName: args.authorName,
    authorRole: args.authorRole,
    resolved: false,
    createdAt: now,
  });
  await updateDoc(doc(db, "_assets", args.assetId), { lastActivityAt: now });
}

export async function setCommentResolved(
  assetId: string,
  commentId: string,
  resolved: boolean
): Promise<void> {
  await updateDoc(doc(db, "_assets", assetId, "comments", commentId), {
    resolved,
  });
}

export async function setAssetStatus(
  assetId: string,
  status: AssetStatus
): Promise<void> {
  await updateDoc(doc(db, "_assets", assetId), {
    status,
    lastActivityAt: new Date().toISOString(),
  });
}

// ---- Notifications ----------------------------------------------------------

export type PortalEvent = {
  event: "asset_uploaded" | "version_uploaded" | "comment_added" | "status_changed";
  workspaceId: string;
  assetId: string;
  assetTitle: string;
  versionN?: number;
  commentBody?: string;
  tSeconds?: number | null;
  newStatus?: AssetStatus;
};

// Fire-and-forget email notification via /api/portal/notify (server verifies
// the ID token and emails the counterpart). Never blocks or throws.
export function notifyPortalEvent(payload: PortalEvent): void {
  const user = auth.currentUser;
  if (!user) return;
  user
    .getIdToken()
    .then((token) =>
      fetch("/api/portal/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
    )
    .catch((err) => console.warn("portal notify failed:", err));
}

// ---- Formatting ---------------------------------------------------------------

export function formatTimecode(tSeconds: number): string {
  const t = Math.max(0, Math.floor(tSeconds));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}
