"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../lib/firebase";
import { createInvoiceFromMilestone } from "../../../lib/payments";
import { formatCurrency } from "../../../lib/currency";
import {
  PROJECT_STATUSES,
  type Client,
  type Invoice,
  type Project,
  type ProjectStatus,
} from "../../../lib/types";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "_projects", id), async (snap) => {
      if (!snap.exists()) {
        setProject(null);
        return;
      }
      const p: Project = { id: snap.id, ...(snap.data() as Omit<Project, "id">) };
      setProject(p);
      if (!client || client.id !== p.clientId) {
        const cs = await getDoc(doc(db, "_clients", p.clientId));
        if (cs.exists()) {
          setClient({ id: cs.id, ...(cs.data() as Omit<Client, "id">) });
        }
      }
    });
    return () => unsub();
  }, [id, client]);

  useEffect(() => {
    const q = query(collection(db, "_invoices"), where("projectId", "==", id));
    const unsub = onSnapshot(q, (snap) => {
      setInvoices(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Invoice, "id">) }))
      );
    });
    return () => unsub();
  }, [id]);

  async function generateInvoice(milestoneId: string) {
    if (!project) return;
    setBusy(milestoneId);
    try {
      const inv = await createInvoiceFromMilestone({ project, milestoneId });
      toast.success(`Created ${inv.invoiceNumber}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  }

  async function updateStatus(next: ProjectStatus) {
    if (!project) return;
    await updateDoc(doc(db, "_projects", project.id), {
      status: next,
      updatedAt: new Date().toISOString(),
    });
  }

  if (project === null) {
    return <p className="text-sm text-[#7B878F]">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-6">
        <div>
          <Link
            href="/admin/projects"
            className="text-xs text-[#7B878F] hover:text-[#FEB040]"
          >
            ← Back
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{project.title}</h1>
          <p className="mt-1 text-sm text-[#7B878F]">
            {project.projectNumber} · {client?.name || "—"}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B878F]">
            Scope
          </p>
          <p className="text-2xl font-bold text-[#FEB040]">
            {formatCurrency(project.scopeAmount, project.currency)}
          </p>
        </div>
      </header>

      <section className="rounded-md border border-white/10 bg-white/[0.02] p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
          Scope
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-[#DCE4EB]">
          {project.scope}
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
            Status
          </p>
          <select
            value={project.status}
            onChange={(e) => updateStatus(e.target.value as ProjectStatus)}
            className="rounded-sm border border-white/10 bg-transparent p-2 text-sm"
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7B878F]">
          Milestones
        </h2>
        <ul className="divide-y divide-white/5 rounded-md border border-white/10">
          {project.milestones.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span className="flex-1 truncate">{m.label}</span>
              <span className="font-semibold">
                {formatCurrency(m.amount, project.currency)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                {m.status}
              </span>
              {m.status === "pending" ? (
                <button
                  disabled={busy === m.id}
                  onClick={() => generateInvoice(m.id)}
                  className="rounded-sm border border-[#FEB040] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEB040] hover:bg-[#FEB040] hover:text-[#080F11] disabled:opacity-50"
                >
                  {busy === m.id ? "…" : "Invoice"}
                </button>
              ) : m.invoiceId ? (
                <Link
                  href={`/admin/invoices/${m.invoiceId}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEB040] hover:underline"
                >
                  View invoice →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7B878F]">
          Invoices
        </h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-[#7B878F]">No invoices yet.</p>
        ) : (
          <ul className="divide-y divide-white/5 rounded-md border border-white/10">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <Link
                  href={`/admin/invoices/${inv.id}`}
                  className="font-semibold hover:text-[#FEB040]"
                >
                  {inv.invoiceNumber}
                </Link>
                <span className="flex-1 truncate text-[#7B878F]">
                  {inv.milestoneLabel || "—"}
                </span>
                <span className="font-semibold">
                  {formatCurrency(inv.amount, inv.currency)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                  {inv.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
