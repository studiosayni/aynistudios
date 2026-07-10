"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../lib/firebase";
import { nextProjectNumber } from "../../lib/serial";
import { formatCurrency } from "../../lib/currency";
import {
  PROJECT_STATUSES,
  type Client,
  type Currency,
  type Milestone,
  type Project,
  type ProjectStatus,
} from "../../lib/types";

type MilestoneDraft = { label: string; amount: string };

function shortId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [scope, setScope] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [status, setStatus] = useState<ProjectStatus>("Payment pending");
  const [visibleToClient, setVisibleToClient] = useState(true);
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([
    { label: "50% Deposit", amount: "" },
    { label: "50% Delivery", amount: "" },
  ]);

  async function load() {
    setLoading(true);
    const [projSnap, clientSnap] = await Promise.all([
      getDocs(query(collection(db, "_projects"), orderBy("createdAt", "desc"))),
      getDocs(query(collection(db, "_clients"), orderBy("name"))),
    ]);
    setProjects(
      projSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
    );
    setClients(
      clientSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Client, "id">) }))
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !title || !scope) {
      toast.error("Client, title, and scope are required");
      return;
    }
    const parsedMs: Milestone[] = milestones
      .filter((m) => m.label.trim() && m.amount.trim())
      .map((m) => ({
        id: shortId(),
        label: m.label.trim(),
        amount: Number(m.amount),
        status: "pending",
      }));
    const scopeAmount = parsedMs.reduce((s, m) => s + m.amount, 0);
    if (parsedMs.length === 0) {
      toast.error("Add at least one milestone");
      return;
    }

    setSaving(true);
    try {
      const client = clients.find((c) => c.id === clientId);
      if (!client) {
        toast.error("Selected client not found");
        setSaving(false);
        return;
      }
      const projectNumber = await nextProjectNumber();
      const now = new Date().toISOString();
      const ref = await addDoc(collection(db, "_projects"), {
        projectNumber,
        clientId,
        workspaceId: client.workspaceId,
        title,
        scope,
        status,
        currency,
        scopeAmount,
        milestones: parsedMs,
        visibleToClient,
        createdAt: now,
        updatedAt: now,
      });
      // Write projectNumber → id reverse lookup in case we need it later.
      await setDoc(doc(db, "_projectNumberIndex", projectNumber), {
        projectId: ref.id,
      });
      toast.success(`Created ${projectNumber}`);
      setShowForm(false);
      setClientId("");
      setTitle("");
      setScope("");
      setMilestones([
        { label: "50% Deposit", amount: "" },
        { label: "50% Delivery", amount: "" },
      ]);
      await load();
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
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] hover:bg-[#FEB040]/90"
        >
          {showForm ? "Cancel" : "+ New project"}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-md border border-white/10 bg-white/[0.02] p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                Client *
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
              >
                <option value="">Select a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
              >
                <option value="USD">USD</option>
                <option value="AED">AED</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                Project title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                Scope *
              </label>
              <textarea
                rows={3}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Careful output-focused wording — deliverables, not promises."
                className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#DCE4EB]">
              <input
                type="checkbox"
                checked={visibleToClient}
                onChange={(e) => setVisibleToClient(e.target.checked)}
              />
              Visible to client
            </label>
          </div>

          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
              Milestones
            </p>
            <div className="space-y-2">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Label — e.g. 50% Deposit"
                    value={m.label}
                    onChange={(e) =>
                      setMilestones(
                        milestones.map((x, j) =>
                          j === i ? { ...x, label: e.target.value } : x
                        )
                      )
                    }
                    className="flex-1 rounded-sm border border-white/10 bg-transparent p-2 text-sm"
                  />
                  <input
                    placeholder="Amount"
                    value={m.amount}
                    onChange={(e) =>
                      setMilestones(
                        milestones.map((x, j) =>
                          j === i ? { ...x, amount: e.target.value } : x
                        )
                      )
                    }
                    className="w-32 rounded-sm border border-white/10 bg-transparent p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMilestones(milestones.filter((_, j) => j !== i))
                    }
                    className="px-2 text-[#7B878F] hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setMilestones([...milestones, { label: "", amount: "" }])
                }
                className="text-xs text-[#FEB040] hover:underline"
              >
                + Add milestone
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create project"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-[#7B878F]">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-[#7B878F]">No projects yet.</p>
      ) : (
        <ul className="divide-y divide-white/5 rounded-md border border-white/10">
          {projects.map((p) => (
            <li key={p.id} className="px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="font-semibold hover:text-[#FEB040]"
                >
                  {p.projectNumber}
                </Link>
                <span className="flex-1 truncate text-[#DCE4EB]">{p.title}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                  {p.status}
                </span>
                <span className="font-semibold">
                  {formatCurrency(p.scopeAmount, p.currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
