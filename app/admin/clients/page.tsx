"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../lib/firebase";
import type { Client, Currency } from "../../lib/types";

const emptyForm = {
  name: "",
  shortName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  billingAddress: "",
  taxId: "",
  preferredCurrency: "USD" as Currency,
  workspaceId: "",
  notes: "",
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadClients() {
    setLoading(true);
    const snap = await getDocs(
      query(collection(db, "_clients"), orderBy("createdAt", "desc"))
    );
    setClients(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Client, "id">) }))
    );
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.contactEmail || !form.workspaceId) {
      toast.error("Name, email, and workspace ID are required");
      return;
    }
    // The workspace ID becomes a URL segment and the join key across
    // projects/invoices/assets — keep it a clean slug.
    if (!/^[a-z0-9][a-z0-9-]*$/.test(form.workspaceId)) {
      toast.error("Workspace ID must be lowercase letters, numbers, and dashes");
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await addDoc(collection(db, "_clients"), {
        ...form,
        createdAt: now,
        updatedAt: now,
      });
      toast.success("Client created");
      setForm(emptyForm);
      setShowForm(false);
      await loadClients();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] hover:bg-[#FEB040]/90"
        >
          {showForm ? "Cancel" : "+ New client"}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-3 rounded-md border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-2"
        >
          <Field label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Short name" value={form.shortName} onChange={(v) => setForm({ ...form, shortName: v })} />
          <Field label="Contact name *" value={form.contactName} onChange={(v) => setForm({ ...form, contactName: v })} />
          <Field label="Contact email *" value={form.contactEmail} onChange={(v) => setForm({ ...form, contactEmail: v })} type="email" />
          <Field label="Contact phone" value={form.contactPhone} onChange={(v) => setForm({ ...form, contactPhone: v })} />
          <Field label="Tax ID (VAT/TIN)" value={form.taxId} onChange={(v) => setForm({ ...form, taxId: v })} />
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
          <Field label="Workspace ID *" value={form.workspaceId} onChange={(v) => setForm({ ...form, workspaceId: v })} />
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
              Preferred currency
            </label>
            <select
              value={form.preferredCurrency}
              onChange={(e) =>
                setForm({ ...form, preferredCurrency: e.target.value as Currency })
              }
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
              value={form.notes}
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
              {saving ? "Saving…" : "Create client"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-[#7B878F]">Loading…</p>
      ) : clients.length === 0 ? (
        <p className="text-sm text-[#7B878F]">No clients yet.</p>
      ) : (
        <ul className="divide-y divide-white/5 rounded-md border border-white/10">
          {clients.map((c) => (
            <li key={c.id} className="px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="font-semibold hover:text-[#FEB040]"
                >
                  {c.name}
                </Link>
                <span className="text-[#7B878F]">{c.contactEmail}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                  {c.preferredCurrency} · {c.workspaceId}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
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
