"use client";

import { useRef, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
  type UploadTask,
} from "firebase/storage";
import toast from "react-hot-toast";
import { auth, db, storage } from "../../lib/firebase";
import {
  addVersionDoc,
  createAssetDoc,
  notifyPortalEvent,
  formatBytes,
  type ReviewAsset,
} from "../../lib/reviewAssets";

// Upload a review cut — either a brand-new asset (v1) or the next version of
// an existing one. Resumable upload with progress + cancel; accepts
// browser-playable video, images, and PDFs up to 2 GB (mirrors storage.rules).

const MAX_BYTES = 2 * 1024 * 1024 * 1024;
const ACCEPT = "video/mp4,video/quicktime,video/webm,image/*,application/pdf";

export default function UploadAssetModal({
  workspaceId,
  existingAsset,
  onClose,
  onDone,
}: {
  workspaceId: string;
  existingAsset?: ReviewAsset | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(existingAsset?.title ?? "");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pct, setPct] = useState<number | null>(null);
  const taskRef = useRef<UploadTask | null>(null);

  const uploading = pct !== null;

  const handleFile = (f: File | null) => {
    if (!f) return setFile(null);
    if (f.size > MAX_BYTES) {
      toast.error("File is over the 2 GB limit.");
      return;
    }
    setFile(f);
    if (!existingAsset && !title.trim()) {
      setTitle(f.name.replace(/\.[^.]+$/, ""));
    }
  };

  const cancel = () => {
    taskRef.current?.cancel();
    setPct(null);
  };

  const handleUpload = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (!file) return toast.error("Choose a file first.");
    if (!existingAsset && !title.trim()) return toast.error("Give the asset a title.");

    const displayName = user.displayName || user.email || "Unknown";
    let assetId = existingAsset?.id ?? null;
    const versionN = (existingAsset?.currentVersion ?? 0) + 1;
    const isNewAsset = !existingAsset;

    setPct(0);
    try {
      if (!assetId) {
        assetId = await createAssetDoc({
          workspaceId,
          title: title.trim(),
          createdBy: user.uid,
          createdByName: displayName,
        });
      }

      const path = `workspaces/${workspaceId}/assets/${assetId}/v${versionN}/${file.name}`;
      const task = uploadBytesResumable(storageRef(storage, path), file, {
        contentType: file.type || "application/octet-stream",
      });
      taskRef.current = task;

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => setPct(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          () => resolve()
        );
      });

      const downloadUrl = await getDownloadURL(task.snapshot.ref);
      await addVersionDoc({
        assetId,
        n: versionN,
        storagePath: path,
        downloadUrl,
        size: file.size,
        contentType: file.type || "application/octet-stream",
        uploadedBy: user.uid,
        uploadedByName: displayName,
        note: note.trim() || undefined,
      });

      notifyPortalEvent({
        event: isNewAsset ? "asset_uploaded" : "version_uploaded",
        workspaceId,
        assetId,
        assetTitle: existingAsset?.title ?? title.trim(),
        versionN,
      });

      toast.success(isNewAsset ? "Asset uploaded" : `v${versionN} uploaded`);
      onDone();
    } catch (err: unknown) {
      const canceled = (err as { code?: string })?.code === "storage/canceled";
      if (!canceled) {
        console.error("Upload failed:", err);
        toast.error("Upload failed. Try again.");
      }
      // Don't leave an empty asset shell behind if v1 never landed.
      if (isNewAsset && assetId) {
        await deleteDoc(doc(db, "_assets", assetId)).catch(() => {});
      }
      setPct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1b282d] bg-[#0C1619] p-6 shadow-2xl">
        <h2 className="text-lg font-black uppercase tracked text-white">
          {existingAsset
            ? `Upload v${(existingAsset.currentVersion ?? 0) + 1}`
            : "Upload a cut"}
        </h2>
        {existingAsset && (
          <p className="mt-1 text-sm text-[#7B878F] truncate">{existingAsset.title}</p>
        )}

        <div className="mt-5 space-y-4">
          {!existingAsset && (
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                className="mt-1 w-full rounded-sm border border-white/10 bg-[#111A1D] p-2.5 text-sm text-white focus:outline-none focus:border-[#FEB040]"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
              File * <span className="normal-case">(video, image, or PDF — max 2 GB)</span>
            </label>
            <input
              type="file"
              accept={ACCEPT}
              disabled={uploading}
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm text-[#DCE4EB] file:mr-3 file:rounded file:border-0 file:bg-[#FEB040] file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:text-[#080F11]"
            />
            {file && (
              <p className="mt-1 text-xs text-[#7B878F]">
                {file.name} · {formatBytes(file.size)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
              Note (optional — what changed?)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={uploading}
              className="mt-1 w-full rounded-sm border border-white/10 bg-[#111A1D] p-2.5 text-sm text-white focus:outline-none focus:border-[#FEB040]"
            />
          </div>

          {uploading && (
            <div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10">
                <div
                  className="h-full bg-[#FEB040] transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-[#7B878F]">{pct}% uploaded</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {uploading ? (
              <button
                onClick={cancel}
                className="rounded-sm border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#DCE4EB] hover:border-red-400 hover:text-red-400"
              >
                Cancel upload
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="rounded-sm border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#DCE4EB] hover:border-white/50"
                >
                  Close
                </button>
                <button
                  onClick={handleUpload}
                  className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] hover:bg-[#FEB040]/90"
                >
                  Upload
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
