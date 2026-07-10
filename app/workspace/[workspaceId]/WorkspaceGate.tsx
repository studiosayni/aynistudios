"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { getAllowlistEntry } from "../../lib/allowlist";

// Client-side guard — only renders children if the logged-in user is on the
// allowlist AND their workspaceId matches the URL's workspaceId. Admins can
// view any workspace. Non-matches bounce to /login or their own workspace.

export default function WorkspaceGate({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      if (!u?.email) {
        router.replace(`/login?next=/workspace/${workspaceId}`);
        return;
      }
      const entry = await getAllowlistEntry(u.email);
      if (!entry) {
        router.replace("/login?reason=not-allowlisted");
        return;
      }
      if (entry.role !== "admin" && entry.workspaceId !== workspaceId) {
        router.replace(`/workspace/${entry.workspaceId}`);
        return;
      }
      setState("ok");
    });
    return () => unsub();
  }, [router, workspaceId]);

  if (state === "checking") {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl items-center justify-center px-6 text-sm text-[#7B878F]">
        Loading your workspace…
      </main>
    );
  }
  return <>{children}</>;
}
