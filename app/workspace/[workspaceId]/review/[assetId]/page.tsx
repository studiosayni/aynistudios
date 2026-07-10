"use client";

import { useEffect, useRef, useState, use, useCallback } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../../../lib/firebase";
import { getAllowlistEntry } from "../../../../lib/allowlist";
import {
  ASSET_STATUS_META,
  addComment,
  fetchAsset,
  fetchComments,
  fetchVersions,
  formatBytes,
  formatTimecode,
  notifyPortalEvent,
  setAssetStatus,
  setCommentResolved,
  type AssetComment,
  type AssetStatus,
  type AssetVersion,
  type ReviewAsset,
} from "../../../../lib/reviewAssets";
import UploadAssetModal from "../../../../components/portal/UploadAssetModal";

// The review room: watch a cut, leave time-coded comments (click a comment to
// jump the playhead), switch versions, and approve / request changes.
// Gated by WorkspaceGate via the [workspaceId] layout.

export default function ReviewRoomPage({
  params,
}: {
  params: Promise<{ workspaceId: string; assetId: string }>;
}) {
  const { workspaceId, assetId } = use(params);

  const [asset, setAsset] = useState<ReviewAsset | null>(null);
  const [versions, setVersions] = useState<AssetVersion[]>([]);
  const [comments, setComments] = useState<AssetComment[]>([]);
  const [selectedN, setSelectedN] = useState<number | null>(null);
  const [role, setRole] = useState<"admin" | "client">("client");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [attachTime, setAttachTime] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const reload = useCallback(async () => {
    const [a, vs, cs] = await Promise.all([
      fetchAsset(assetId),
      fetchVersions(assetId),
      fetchComments(assetId),
    ]);
    if (!a || a.workspaceId !== workspaceId) {
      setError("This asset isn't available in this workspace.");
      setLoading(false);
      return;
    }
    setAsset(a);
    setVersions(vs);
    setComments(cs);
    setSelectedN((cur) => cur ?? a.currentVersion);
    setLoading(false);
  }, [assetId, workspaceId]);

  useEffect(() => {
    reload().catch((err) => {
      console.error("Review room load error:", err);
      setError("Unable to load this asset.");
      setLoading(false);
    });
  }, [reload]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      if (!u?.email) return;
      setUserName(u.displayName || u.email);
      const entry = await getAllowlistEntry(u.email);
      if (entry) setRole(entry.role);
    });
    return () => unsub();
  }, []);

  const version =
    versions.find((v) => v.n === selectedN) ?? versions[0] ?? null;
  const isVideo = version?.contentType.startsWith("video/") ?? false;
  const isImage = version?.contentType.startsWith("image/") ?? false;
  const visibleComments = comments.filter(
    (c) => c.versionN === version?.n || c.tSeconds === null
  );

  const seekTo = (t: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = t;
    el.focus();
  };

  const handlePost = async () => {
    if (!body.trim() || !asset || !version) return;
    const user = auth.currentUser;
    if (!user) return;
    setPosting(true);
    try {
      const t =
        attachTime && isVideo && videoRef.current
          ? videoRef.current.currentTime
          : null;
      await addComment({
        assetId: asset.id,
        versionN: version.n,
        tSeconds: t,
        body: body.trim(),
        authorUid: user.uid,
        authorName: userName || user.email || "Unknown",
        authorRole: role,
      });
      notifyPortalEvent({
        event: "comment_added",
        workspaceId,
        assetId: asset.id,
        assetTitle: asset.title,
        versionN: version.n,
        commentBody: body.trim(),
        tSeconds: t,
      });
      setBody("");
      await reload();
    } catch (err) {
      console.error("Comment failed:", err);
      toast.error("Couldn't post the comment.");
    } finally {
      setPosting(false);
    }
  };

  const handleStatus = async (status: AssetStatus) => {
    if (!asset) return;
    try {
      await setAssetStatus(asset.id, status);
      notifyPortalEvent({
        event: "status_changed",
        workspaceId,
        assetId: asset.id,
        assetTitle: asset.title,
        newStatus: status,
      });
      toast.success(ASSET_STATUS_META[status].label);
      await reload();
    } catch {
      toast.error("Couldn't update the status.");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 text-sm text-[#7B878F]">
        Loading review room…
      </main>
    );
  }
  if (error || !asset) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-[#7B878F]">{error ?? "Unavailable."}</p>
        <Link
          href={`/workspace/${workspaceId}`}
          className="mt-4 inline-block text-xs text-[#FEB040] hover:underline"
        >
          ← Back to workspace
        </Link>
      </main>
    );
  }

  const meta = ASSET_STATUS_META[asset.status] ?? ASSET_STATUS_META.in_review;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={`/workspace/${workspaceId}`}
            className="text-xs text-[#7B878F] hover:text-[#FEB040]"
          >
            ← Back to workspace
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight truncate">
            {asset.title}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${meta.classes}`}
            >
              {meta.label}
            </span>
            {versions.length > 0 && (
              <select
                value={version?.n ?? ""}
                onChange={(e) => setSelectedN(Number(e.target.value))}
                className="rounded-sm border border-white/10 bg-[#111A1D] px-2 py-1 text-xs text-[#DCE4EB]"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.n}>
                    v{v.n} · {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {role === "client" ? (
            <>
              <button
                onClick={() => handleStatus("approved")}
                className="rounded-sm border border-emerald-400/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 hover:bg-emerald-400/10"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatus("changes_requested")}
                className="rounded-sm border border-[#FEB040]/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEB040] hover:bg-[#FEB040]/10"
              >
                Request changes
              </button>
            </>
          ) : (
            <>
              <select
                value={asset.status}
                onChange={(e) => handleStatus(e.target.value as AssetStatus)}
                className="rounded-sm border border-white/10 bg-[#111A1D] px-2 py-2 text-xs text-[#DCE4EB]"
              >
                {(Object.keys(ASSET_STATUS_META) as AssetStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {ASSET_STATUS_META[s].label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowUpload(true)}
                className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#080F11] hover:bg-[#FEB040]/90"
              >
                + New version
              </button>
            </>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* PLAYER */}
        <div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
            {!version ? (
              <div className="flex aspect-video items-center justify-center text-sm text-[#7B878F]">
                No file uploaded yet.
              </div>
            ) : isVideo ? (
              <video
                ref={videoRef}
                key={version.id}
                src={version.downloadUrl}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full"
              />
            ) : isImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={version.downloadUrl}
                alt={asset.title}
                className="max-h-[70vh] w-full object-contain"
              />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 text-sm text-[#7B878F]">
                <p>{version.contentType}</p>
                <a
                  href={version.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-[#FEB040] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEB040]"
                >
                  Open file →
                </a>
              </div>
            )}
          </div>
          {version && (
            <p className="mt-2 text-xs text-[#7B878F]">
              v{version.n} · {formatBytes(version.size)} · uploaded by{" "}
              {version.uploadedByName}
              {version.note ? ` — "${version.note}"` : ""}
              {" · "}
              <a
                href={version.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FEB040] hover:underline"
              >
                Download
              </a>
            </p>
          )}
        </div>

        {/* COMMENT RAIL */}
        <aside className="flex min-h-[320px] flex-col rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-4 py-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B878F]">
              Comments{version ? ` — v${version.n}` : ""}
            </h2>
          </div>

          <ul className="flex-1 space-y-3 overflow-y-auto p-4">
            {visibleComments.length === 0 && (
              <li className="text-sm text-[#7B878F]">
                No comments yet. Pause the video where you want to leave a note
                and post — the timecode travels with it.
              </li>
            )}
            {visibleComments.map((c) => (
              <li
                key={c.id}
                className={`rounded-md border p-3 text-sm ${
                  c.resolved
                    ? "border-white/5 bg-white/[0.01] opacity-60"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[#DCE4EB]">
                    {c.authorName}
                    <span className="ml-2 font-normal uppercase tracking-[0.15em] text-[10px] text-[#7B878F]">
                      {c.authorRole}
                    </span>
                  </p>
                  {c.tSeconds !== null && (
                    <button
                      onClick={() => seekTo(c.tSeconds!)}
                      className="rounded bg-[#FEB040]/15 px-2 py-0.5 text-[11px] font-bold text-[#FEB040] hover:bg-[#FEB040]/30"
                      title="Jump to this moment"
                    >
                      {formatTimecode(c.tSeconds)}
                    </button>
                  )}
                </div>
                <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-[#DCE4EB]/90">
                  {c.body}
                </p>
                <button
                  onClick={() =>
                    setCommentResolved(asset.id, c.id, !c.resolved).then(reload)
                  }
                  className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B878F] hover:text-[#FEB040]"
                >
                  {c.resolved ? "Reopen" : "Resolve"}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 p-4">
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Leave a note…"
              className="w-full rounded-sm border border-white/10 bg-[#111A1D] p-2.5 text-sm text-white focus:outline-none focus:border-[#FEB040]"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              {isVideo ? (
                <label className="flex items-center gap-2 text-xs text-[#7B878F]">
                  <input
                    type="checkbox"
                    checked={attachTime}
                    onChange={(e) => setAttachTime(e.target.checked)}
                  />
                  Attach current timecode
                </label>
              ) : (
                <span />
              )}
              <button
                onClick={handlePost}
                disabled={posting || !body.trim()}
                className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#080F11] disabled:opacity-50 hover:bg-[#FEB040]/90"
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showUpload && (
        <UploadAssetModal
          workspaceId={workspaceId}
          existingAsset={asset}
          onClose={() => setShowUpload(false)}
          onDone={() => {
            setShowUpload(false);
            setSelectedN(null); // snap to the new current version on reload
            reload();
          }}
        />
      )}
    </main>
  );
}
