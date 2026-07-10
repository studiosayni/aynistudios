"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../lib/firebase";
import { formatCurrency } from "../../../lib/currency";
import type { Client, Invoice, PaymentMethod, Project } from "../../../lib/types";

// The admin UI calls admin APIs with ADMIN_API_KEY. In dev the key comes from
// .env.local; in prod it's a Cloud Secret. This keeps privileged actions gated
// server-side even when the admin page itself is just client-rendered.

function getAdminKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ayni_admin_key");
}

function promptAdminKey(): string | null {
  const existing = getAdminKey();
  if (existing) return existing;
  const entered = window.prompt("Enter admin API key (stored locally):");
  if (!entered) return null;
  window.localStorage.setItem("ayni_admin_key", entered);
  return entered;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Zelle");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "_invoices", id), async (snap) => {
      if (!snap.exists()) {
        setInvoice(null);
        return;
      }
      const inv: Invoice = {
        id: snap.id,
        ...(snap.data() as Omit<Invoice, "id">),
      };
      setInvoice(inv);
      const [ps, cs] = await Promise.all([
        getDoc(doc(db, "_projects", inv.projectId)),
        getDoc(doc(db, "_clients", inv.clientId)),
      ]);
      if (ps.exists())
        setProject({ id: ps.id, ...(ps.data() as Omit<Project, "id">) });
      if (cs.exists())
        setClient({ id: cs.id, ...(cs.data() as Omit<Client, "id">) });
    });
    return () => unsub();
  }, [id]);

  async function sendEmail() {
    const key = promptAdminKey();
    if (!key) return;
    setBusy("send");
    try {
      const res = await fetch("/api/admin/send-invoice-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({ invoiceId: id }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      toast.success("Invoice emailed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  async function markPaid() {
    const key = promptAdminKey();
    if (!key) return;
    setBusy("paid");
    try {
      const res = await fetch("/api/admin/mark-invoice-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({
          invoiceId: id,
          paymentMethod: method,
          note: note || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      toast.success("Marked paid");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  if (invoice === null) {
    return <p className="text-sm text-[#7B878F]">Loading…</p>;
  }

  const payUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/pay/${invoice.id}`
      : `/pay/${invoice.id}`;
  const pdfUrl = client
    ? `/api/invoice/${invoice.invoiceNumber}?email=${encodeURIComponent(client.contactEmail)}`
    : "#";

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-6">
        <div>
          <Link
            href={project ? `/admin/projects/${project.id}` : "/admin"}
            className="text-xs text-[#7B878F] hover:text-[#FEB040]"
          >
            ← Back
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-[#7B878F]">
            {project?.title || "—"}
            {invoice.milestoneLabel ? ` · ${invoice.milestoneLabel}` : ""}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B878F]">
            {invoice.status === "Paid" ? "Paid" : "Due"}
          </p>
          <p className="text-2xl font-bold text-[#FEB040]">
            {formatCurrency(invoice.amount, invoice.currency)}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
            Status · {invoice.status}
          </p>
        </div>
      </header>

      {client && (
        <section className="rounded-md border border-white/10 bg-white/[0.02] p-5 text-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
            Bill to
          </p>
          <p className="mt-2 font-semibold">{client.name}</p>
          <p className="text-[#DCE4EB]">{client.contactName}</p>
          <p className="text-[#7B878F]">{client.contactEmail}</p>
          <p className="mt-2 whitespace-pre-wrap text-[#7B878F]">
            {client.billingAddress}
          </p>
        </section>
      )}

      <section className="space-y-2 rounded-md border border-white/10 bg-white/[0.02] p-5 text-sm">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
          Line items
        </p>
        <ul className="mt-2 divide-y divide-white/5">
          {invoice.lineItems.map((li, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-2">
              <span>{li.description}</span>
              <span className="font-semibold">
                {formatCurrency(li.amount, invoice.currency)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-md border border-white/10 bg-white/[0.02] p-5 text-sm">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
          Pay link (share with client)
        </p>
        <code className="block break-all rounded-sm bg-black/30 p-2 text-xs text-[#DCE4EB]">
          {payUrl}
        </code>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(payUrl);
              toast.success("Copied");
            }}
            className="rounded-sm border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#FEB040] hover:text-[#FEB040]"
          >
            Copy link
          </button>
          <a
            href={pdfUrl}
            className="rounded-sm border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#FEB040] hover:text-[#FEB040]"
          >
            Download PDF
          </a>
        </div>
      </section>

      {invoice.status !== "Paid" && invoice.status !== "Void" && (
        <section className="space-y-4 rounded-md border border-white/10 bg-white/[0.02] p-5 text-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
            Admin actions
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={sendEmail}
              disabled={busy !== null}
              className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] disabled:opacity-60"
            >
              {busy === "send" ? "Sending…" : "Email invoice to client"}
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
              Mark paid manually (Zelle / bank transfer)
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="rounded-sm border border-white/10 bg-transparent p-2 text-sm"
              >
                <option value="Zelle">Zelle</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reference / memo (optional)"
                className="flex-1 rounded-sm border border-white/10 bg-transparent p-2 text-sm"
              />
              <button
                onClick={markPaid}
                disabled={busy !== null}
                className="rounded-sm border border-[#FEB040] px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FEB040] hover:bg-[#FEB040] hover:text-[#080F11] disabled:opacity-60"
              >
                {busy === "paid" ? "Saving…" : "Mark paid"}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
