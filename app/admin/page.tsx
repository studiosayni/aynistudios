"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { formatCurrency } from "../lib/currency";
import type { Invoice, Project } from "../lib/types";

export default function AdminDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [invSnap, projSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, "_invoices"),
            orderBy("createdAt", "desc"),
            limit(10)
          )
        ),
        getDocs(
          query(
            collection(db, "_projects"),
            orderBy("createdAt", "desc"),
            limit(10)
          )
        ),
      ]);
      setInvoices(
        invSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Invoice, "id">) }))
      );
      setProjects(
        projSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
      );
      setLoading(false);
    })();
  }, []);

  const outstanding = invoices
    .filter((i) => i.status !== "Paid" && i.status !== "Void")
    .reduce((sum, i) => sum + i.amount, 0);
  const paidThisList = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-[#7B878F]">
          Recent billing activity across all clients.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Outstanding (recent 10)" value={outstanding} />
        <Stat label="Paid (recent 10)" value={paidThisList} />
        <Stat label="Active projects" value={projects.length} isCount />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7B878F]">
            Recent invoices
          </h2>
        </div>
        {loading ? (
          <p className="text-sm text-[#7B878F]">Loading…</p>
        ) : invoices.length === 0 ? (
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
                <span className="text-[#7B878F]">{inv.milestoneLabel || "—"}</span>
                <span className="font-semibold">
                  {formatCurrency(inv.amount, inv.currency)}
                </span>
                <StatusPill status={inv.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7B878F]">
            Recent projects
          </h2>
          <Link
            href="/admin/projects"
            className="text-xs text-[#FEB040] hover:underline"
          >
            View all →
          </Link>
        </div>
        {loading ? null : projects.length === 0 ? (
          <p className="text-sm text-[#7B878F]">No projects yet.</p>
        ) : (
          <ul className="divide-y divide-white/5 rounded-md border border-white/10">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="font-semibold hover:text-[#FEB040]"
                >
                  {p.projectNumber}
                </Link>
                <span className="truncate text-[#DCE4EB]">{p.title}</span>
                <span className="text-[#7B878F]">{p.status}</span>
                <span className="font-semibold">
                  {formatCurrency(p.scopeAmount, p.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  isCount = false,
}: {
  label: string;
  value: number;
  isCount?: boolean;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.02] p-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B878F]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold">
        {isCount ? value : formatCurrency(value, "USD")}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "Paid"
      ? "bg-[#FEB040]/15 text-[#FEB040]"
      : status === "Void"
      ? "bg-white/5 text-[#7B878F]"
      : "bg-white/10 text-[#DCE4EB]";
  return (
    <span
      className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] ${color}`}
    >
      {status}
    </span>
  );
}
