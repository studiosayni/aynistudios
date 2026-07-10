"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { formatCurrency } from "../../../../lib/currency";
import type { Client, Invoice, Project } from "../../../../lib/types";

export default function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { workspaceId, projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ps = await getDoc(doc(db, "_projects", projectId));
        if (!ps.exists()) {
          setError("Project not found");
          setLoading(false);
          return;
        }
        const p: Project = {
          id: ps.id,
          ...(ps.data() as Omit<Project, "id">),
        };
        if (!p.visibleToClient) {
          setError("Project is not available");
          setLoading(false);
          return;
        }
        const cs = await getDoc(doc(db, "_clients", p.clientId));
        if (!cs.exists() || (cs.data() as Client).workspaceId !== workspaceId) {
          setError("Project is not part of this workspace");
          setLoading(false);
          return;
        }
        setProject(p);
        setClient({ id: cs.id, ...(cs.data() as Omit<Client, "id">) });

        const invSnap = await getDocs(
          query(
            collection(db, "_invoices"),
            where("projectId", "==", p.id),
            // workspaceId filter lets Firestore rules verify this query.
            where("workspaceId", "==", workspaceId)
          )
        );
        setInvoices(
          invSnap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<Invoice, "id">) }))
            // Clients don't see drafts — those are admin-internal.
            .filter((inv) => inv.status !== "Draft" && inv.status !== "Void")
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId, workspaceId]);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-6 py-10 text-sm text-[#7B878F]">Loading…</main>;
  }
  if (error || !project || !client) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
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

  const pendingInvoices = invoices.filter((i) => i.status === "Sent");
  const paidInvoices = invoices.filter((i) => i.status === "Paid");

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-10">
      <header>
        <Link
          href={`/workspace/${workspaceId}`}
          className="text-xs text-[#7B878F] hover:text-[#FEB040]"
        >
          ← Back to workspace
        </Link>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#7B878F]">
          {project.projectNumber}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-2 inline-block rounded-sm bg-[#FEB040]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FEB040]">
          {project.status}
        </p>
      </header>

      <section className="rounded-md border border-white/10 bg-white/[0.02] p-5 text-sm">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
          Scope
        </p>
        <p className="mt-2 whitespace-pre-wrap text-[#DCE4EB]">{project.scope}</p>
      </section>

      {pendingInvoices.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FEB040]">
            Payment pending
          </h2>
          <ul className="space-y-2">
            {pendingInvoices.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between gap-4 rounded-md border border-[#FEB040]/40 bg-[#FEB040]/5 p-4"
              >
                <div>
                  <p className="font-semibold">{inv.milestoneLabel || inv.invoiceNumber}</p>
                  <p className="text-xs text-[#7B878F]">
                    {inv.invoiceNumber}
                    {inv.dueDate
                      ? ` · Due ${new Date(inv.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#FEB040]">
                    {formatCurrency(inv.amount, inv.currency)}
                  </p>
                  <Link
                    href={`/pay/${inv.id}`}
                    className="mt-1 inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#FEB040] hover:underline"
                  >
                    Pay invoice →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7B878F]">
          Project milestones
        </h2>
        <ul className="divide-y divide-white/5 rounded-md border border-white/10">
          {project.milestones.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span className="flex-1 truncate">{m.label}</span>
              <span className="font-semibold">
                {formatCurrency(m.amount, project.currency)}
              </span>
              <span
                className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] ${
                  m.status === "paid"
                    ? "bg-[#FEB040]/15 text-[#FEB040]"
                    : m.status === "invoiced"
                    ? "bg-white/10 text-[#DCE4EB]"
                    : "bg-white/5 text-[#7B878F]"
                }`}
              >
                {m.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {paidInvoices.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7B878F]">
            Receipts
          </h2>
          <ul className="divide-y divide-white/5 rounded-md border border-white/10">
            {paidInvoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="font-semibold">{inv.invoiceNumber}</span>
                <span className="flex-1 truncate text-[#7B878F]">
                  {inv.milestoneLabel || "—"}
                </span>
                <span className="font-semibold">
                  {formatCurrency(inv.amount, inv.currency)}
                </span>
                <a
                  href={`/api/invoice/${inv.invoiceNumber}?email=${encodeURIComponent(client.contactEmail)}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEB040] hover:underline"
                >
                  Download PDF
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
