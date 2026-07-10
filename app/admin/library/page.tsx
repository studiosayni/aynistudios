"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../lib/firebase";
import {
  fetchLibrary,
  youtubeThumb,
  type LibraryItem,
} from "../../lib/library";

// Admin manager for the `_library` catalog rendered on /library and the
// homepage carousel. Doc ID convention: the YouTube video ID.

type FormState = {
  title: string;
  youtubeId: string;
  client: string;
  year: string;
  category: string;
  description: string;
  sortKey: string;
  featured: boolean;
};

const emptyForm = (): FormState => ({
  title: "",
  youtubeId: "",
  client: "",
  year: "",
  category: "Documentary",
  description: "",
  sortKey: new Date().toISOString().slice(0, 10),
  featured: false,
});

export default function AdminLibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await fetchLibrary());
    } catch {
      toast.error("Failed to load library");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: LibraryItem) {
    setEditingId(item.dbId);
    setForm({
      title: item.title ?? "",
      youtubeId: item.youtubeId ?? "",
      client: item.client ?? "",
      year: item.year ? String(item.year) : "",
      category: item.category ?? "",
      description: item.description ?? "",
      sortKey: item.sortKey ?? new Date().toISOString().slice(0, 10),
      featured: !!item.featured,
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.youtubeId.trim() || !form.sortKey.trim()) {
      toast.error("Title, YouTube ID, and sort key are required");
      return;
    }
    setSaving(true);
    try {
      const data = {
        title: form.title.trim(),
        youtubeId: form.youtubeId.trim(),
        client: form.client.trim(),
        year: form.year ? Number(form.year) : null,
        category: form.category.trim(),
        description: form.description.trim(),
        sortKey: form.sortKey.trim(),
        featured: form.featured,
      };
      const id = editingId ?? form.youtubeId.trim();
      if (editingId) {
        await updateDoc(doc(db, "_library", id), data);
      } else {
        await setDoc(doc(db, "_library", id), data);
      }
      // Only one item should hold the featured slot.
      if (form.featured) {
        await Promise.all(
          items
            .filter((i) => i.featured && i.dbId !== id)
            .map((i) => updateDoc(doc(db, "_library", i.dbId), { featured: false }))
        );
      }
      toast.success(editingId ? "Production updated" : "Production added");
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm());
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId((c) => (c === id ? null : c)), 4000);
      return;
    }
    try {
      await deleteDoc(doc(db, "_library", id));
      toast.success("Production removed");
      setConfirmDeleteId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  async function toggleFeatured(item: LibraryItem) {
    try {
      await Promise.all([
        updateDoc(doc(db, "_library", item.dbId), { featured: !item.featured }),
        ...items
          .filter((i) => i.featured && i.dbId !== item.dbId)
          .map((i) => updateDoc(doc(db, "_library", i.dbId), { featured: false })),
      ]);
      await load();
    } catch {
      toast.error("Failed to update featured flag");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Library</h1>
        <button
          onClick={() => {
            setShowForm((s) => !s);
            setEditingId(null);
            setForm(emptyForm());
          }}
          className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] hover:bg-[#FEB040]/90"
        >
          {showForm ? "Cancel" : "+ New production"}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 gap-3 rounded-md border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-2"
        >
          <Field label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field
            label="YouTube ID *"
            value={form.youtubeId}
            onChange={(v) => setForm({ ...form, youtubeId: v })}
            disabled={!!editingId}
          />
          <Field label="Client" value={form.client} onChange={(v) => setForm({ ...form, client: v })} />
          <Field label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} type="number" />
          <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Field
            label="Sort key * (ISO date — newest shows first)"
            value={form.sortKey}
            onChange={(v) => setForm({ ...form, sortKey: v })}
          />
          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured (hero slot on /library)
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-sm border border-[#FEB040] bg-[#FEB040] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#080F11] disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Add production"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-[#7B878F]">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#7B878F]">No productions yet.</p>
      ) : (
        <ul className="divide-y divide-white/5 rounded-md border border-white/10">
          {items.map((item) => {
            const thumb = item.thumbnailUrl || youtubeThumb(item.youtubeId);
            return (
              <li key={item.dbId} className="flex items-center gap-4 px-4 py-3 text-sm">
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-sm bg-black/40">
                  {thumb && (
                    <Image src={thumb} alt="" fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B878F]">
                    {[item.category, item.client, item.year, item.sortKey]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <button
                  onClick={() => toggleFeatured(item)}
                  title={item.featured ? "Unfeature" : "Feature on /library"}
                  className={`text-lg leading-none ${item.featured ? "text-[#FEB040]" : "text-white/20 hover:text-white/60"}`}
                >
                  ★
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B878F] hover:text-[#FEB040]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.dbId)}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    confirmDeleteId === item.dbId
                      ? "text-red-400"
                      : "text-[#7B878F] hover:text-red-400"
                  }`}
                >
                  {confirmDeleteId === item.dbId ? "Confirm?" : "Delete"}
                </button>
              </li>
            );
          })}
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
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
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
        disabled={disabled}
        className="mt-1 w-full rounded-sm border border-white/10 bg-transparent p-2 text-sm disabled:opacity-50"
      />
    </div>
  );
}
