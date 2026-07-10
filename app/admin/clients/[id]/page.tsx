"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../lib/firebase";
import type { Client, Currency } from "../../../lib/types";

// Client detail — view/edit the directory entry the list page links to.
// The workspaceId is the join key for portal access, projects, invoices,
// and review assets, so it's validated as a URL-safe slug and editing it
// after work exists is called out as dangerous.

const WORKSPACE_SLUG = /^[a-z0-9][a-z0-9-]*$/;

export default function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Client, "id" | "createdAt" | "updatedAt"> | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "_clients", id));
      if (snap.exists()) {
        const c = { id: snap.id, ...(snap.data() as Omit<Client, "id">) };
        setClient(c);
        setForm({
          name: c.name,
          shortName: c.shortName ?? "",
          contactName: c.contactName,
          contactEmail: c.contactEmail,
          contactPhone: c.contactPhone ?? "",
          billingAddress: c.billingAddress,
          taxId: c.taxId ?? "",
          preferredCurrency: c.preferredCurrency,
          workspaceId: c.workspaceId,
          notes: c.notes ?? "",
        });
      }
      setLoading(false);
    })();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (!form.name || !form.contactEmail || !form.workspaceId) {
      toast.error("Name, email, and workspace ID are required");
      return;
    }
    if (!WORKSPACE_SLUG.test(form.workspaceId)) {
      toast.error("Workspace ID must be lowercase letters, numbers, and dashes (it becomes a URL)");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "_clients", id), {
        ...form,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Client updated");
      setClient((c) => (c ? { ...c, ...form } : c));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[#7B878F]">Loading…</p>;
  }
  if (!client || !form) {
    return (
      <div>
        <p className="text-sm text-[#7B878F]">Client not found.</p>
        <Link href="/admin/clients" className="mt-3 inline-block text-xs text-[#FEB040] hover:underline">
          ← Back to clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/clients" className="text-xs text-[#7B878F] hover:text-[#FEB040]">
            ← Back to clients
          </Link>
          <h1 className="mt-1 text-3xl font-bold">{client.name}</h1>
        </div>
        <Link
          href={`/workspace/${client.workspaceId}`}
          className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] hover:bg-[#FEB040]/90"
        >
          Open workspace →
        </Link>
      </header>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 gap-3 rounded-md border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-2"
      >
        <Field label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Short name" value={form.shortName ?? ""} onChange={(v) => setForm({ ...form, shortName: v })} />
        <Field label="Contact name *" value={form.contactName} onChange={(v) => setForm({ ...form, contactName: v })} />
        <Field label="Contact email *" value={form.contactEmail} onChange={(v) => setForm({ ...form, contactEmail: v })} type="email" />
        <Field label="Contact phone" value={form.contactPhone ?? ""} onChange={(v) => setForm({ ...form, contactPhone: v })} />
        <Field label="Tax ID (VAT/TIN)" value={form.taxId ?? ""} onChange={(v) => setForm({ ...form, taxId: v })} />
        <div className="sm:col-span-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
            Billing address *
          </label>
          <textarea
            rows={3}
            value={form.billingAddress}
            onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
            className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
          />
        </div>
        <div>
          <Field
            label="Workspace ID * (lowercase-with-dashes)"
            value={form.workspaceId}
            onChange={(v) => setForm({ ...form, workspaceId: v })}
          />
          <p className="mt-1 text-[10px] leading-relaxed text-[#7B878F]">
            ⚠ Changing this after projects/invoices/review assets exist breaks
            their workspace link — those docs carry a copy of this ID.
          </p>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
            Preferred currency
          </label>
          <select
            value={form.preferredCurrency}
            onChange={(e) => setForm({ ...form, preferredCurrency: e.target.value as Currency })}
            className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
          >
            <option value="USD">USD</option>
            <option value="AED">AED</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
            Notes
          </label>
          <textarea
            rows={2}
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
      />
    </div>
  );
}
