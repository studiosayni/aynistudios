"use client";

import { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { formatCurrency } from "../../lib/currency";
import {
  ASSET_STATUS_META,
  fetchWorkspaceAssets,
  type ReviewAsset,
} from "../../lib/reviewAssets";
import UploadAssetModal from "../../components/portal/UploadAssetModal";
import type { Client, Project } from "../../lib/types";

export default function WorkspaceHomePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [assets, setAssets] = useState<ReviewAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const loadAssets = useCallback(
    () => fetchWorkspaceAssets(workspaceId).then(setAssets),
    [workspaceId]
  );

  useEffect(() => {
    (async () => {
      // All queries filter on workspaceId so Firestore rules can verify
      // access from the query shape alone (projects/assets carry a
      // denormalized workspaceId for exactly this reason).
      const [cs, ps] = await Promise.all([
        getDocs(
          query(collection(db, "_clients"), where("workspaceId", "==", workspaceId))
        ),
        getDocs(
          query(
            collection(db, "_projects"),
            where("workspaceId", "==", workspaceId),
            where("visibleToClient", "==", true)
          )
        ),
        loadAssets(),
      ]);
      setClients(
        cs.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Client, "id">) }))
      );
      setProjects(
        ps.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
      );
      setLoading(false);
    })();
  }, [workspaceId, loadAssets]);

  const clientName = clients[0]?.name;

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7B878F]">
          Client workspace
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {clientName || "Your projects"}
        </h1>
      </header>

      {/* REVIEW — cuts shared for feedback (Phase 2 portal) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FEB040]">
            Review
          </h2>
          <button
            onClick={() => setShowUpload(true)}
            className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#080F11] hover:bg-[#FEB040]/90"
          >
            + Upload
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-[#7B878F]">Loading…</p>
        ) : assets.length === 0 ? (
          <p className="rounded-md border border-white/10 bg-white/[0.02] p-5 text-sm text-[#7B878F]">
            Nothing in review yet. New cuts appear here the moment they&apos;re
            uploaded — you&apos;ll be able to watch, leave time-coded comments,
            and approve.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {assets.map((a) => {
              const meta = ASSET_STATUS_META[a.status] ?? ASSET_STATUS_META.in_review;
              return (
                <li key={a.id}>
                  <Link
                    href={`/workspace/${workspaceId}/review/${a.id}`}
                    className="block rounded-md border border-white/10 bg-white/[0.02] p-5 transition hover:border-[#FEB040]/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-tight">{a.title}</h3>
                      <span
                        className={`shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${meta.classes}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#7B878F]">
                      v{a.currentVersion} ·{" "}
                      {new Date(a.lastActivityAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {showUpload && (
        <UploadAssetModal
          workspaceId={workspaceId}
          onClose={() => setShowUpload(false)}
          onDone={() => {
            setShowUpload(false);
            loadAssets();
          }}
        />
      )}

      {/* PROJECTS & BILLING */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7B878F]">
          Projects &amp; billing
        </h2>
      {loading ? (
        <p className="text-sm text-[#7B878F]">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-[#7B878F]">
          No projects are visible in this workspace yet. Ayni will notify you
          once your project kicks off.
        </p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => {
            const paid = p.milestones
              .filter((m) => m.status === "paid")
              .reduce((s, m) => s + m.amount, 0);
            const outstanding = p.milestones
              .filter((m) => m.status !== "paid")
              .reduce((s, m) => s + m.amount, 0);
            return (
              <li key={p.id}>
                <Link
                  href={`/workspace/${workspaceId}/projects/${p.id}`}
                  className="block rounded-md border border-white/10 bg-white/[0.02] p-5 transition hover:border-[#FEB040]/50"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                        {p.projectNumber}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold">{p.title}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#FEB040]">
                        {p.status}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                        Paid
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(paid, p.currency)}
                      </p>
                      {outstanding > 0 && (
                        <>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                            Outstanding
                          </p>
                          <p className="font-semibold text-[#FEB040]">
                            {formatCurrency(outstanding, p.currency)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      </section>
    </main>
  );
}
