"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { formatCurrency } from "../../lib/currency";
import type { Client, Project } from "../../lib/types";

export default function WorkspaceHomePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Both queries filter on workspaceId so Firestore rules can verify
      // access from the query shape alone (projects carry a denormalized
      // workspaceId for exactly this reason).
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
      ]);
      setClients(
        cs.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Client, "id">) }))
      );
      setProjects(
        ps.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
      );
      setLoading(false);
    })();
  }, [workspaceId]);

  const clientName = clients[0]?.name;

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7B878F]">
          Client workspace
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {clientName || "Your projects"}
        </h1>
      </header>

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
    </main>
  );
}
