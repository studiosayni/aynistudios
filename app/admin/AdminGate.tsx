"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getAllowlistEntry } from "../lib/allowlist";

// Client-side guard — only renders children if the logged-in user is on the
// allowlist with role "admin". Non-admins bounce to /login or /workspace.
// Note: this is defense-in-depth; actual write paths are gated server-side
// (admin API routes check ADMIN_API_KEY).

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      if (!u?.email) {
        router.replace("/login?next=/admin");
        return;
      }
      setEmail(u.email);
      const entry = await getAllowlistEntry(u.email);
      if (!entry) {
        router.replace("/login?reason=not-allowlisted");
        return;
      }
      if (entry.role !== "admin") {
        router.replace(`/workspace/${entry.workspaceId}`);
        return;
      }
      setState("ok");
    });
    return () => unsub();
  }, [router]);

  if (state === "checking") {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl items-center justify-center px-6 text-sm text-[#7B878F]">
        Checking access…
      </main>
    );
  }
  if (state === "denied") return null;
  return (
    <AdminContext.Provider value={{ email }}>{children}</AdminContext.Provider>
  );
}

import { createContext, useContext } from "react";
const AdminContext = createContext<{ email: string | null }>({ email: null });
export function useAdminEmail() {
  return useContext(AdminContext).email;
}
