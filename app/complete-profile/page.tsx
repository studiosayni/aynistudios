"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { getAllowlistEntry } from "../lib/allowlist";

// Completes the profile for first-time Google sign-ins. Requires an allowlist
// entry for the email. If none, the user is signed out.
export default function CompleteProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      setFullName(u.displayName || "");
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    setLoading(true);
    try {
      const allow = await getAllowlistEntry(user.email);
      if (!allow) {
        await signOut(auth);
        toast.error("Your email is not authorized.");
        router.push("/login");
        return;
      }

      await setDoc(doc(db, "_users", user.uid), {
        fullName: fullName.trim() || user.displayName || user.email,
        email: user.email,
        role: allow.role,
        workspaceId: allow.workspaceId,
        createdAt: new Date().toISOString(),
      });

      toast.success("Profile saved.");
      if (allow.role === "admin") {
        router.push("/admin");
      } else {
        router.push(`/workspace/${allow.workspaceId}`);
      }
    } catch {
      toast.error("Failed to save profile.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="p-10 bg-[#0C1619]/80 backdrop-blur-md border border-[#1b282d] shadow-2xl rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-2 text-center tracked uppercase text-white">
          Complete Profile
        </h2>
        <p className="text-[#DCE4EB]/60 text-center mb-8 text-sm">
          One step before you enter your workspace.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-4 bg-[#111A1D] border border-[#1b282d] rounded text-white focus:outline-none focus:border-[#FEB040] text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FEB040] text-[#080F11] p-4 rounded font-black uppercase tracked text-sm hover:bg-[#DCE4EB] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
