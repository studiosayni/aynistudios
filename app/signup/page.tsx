"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { getAllowlistEntry } from "../lib/allowlist";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return toast.error("Please fill out all required fields.");
    }
    setIsLoading(true);

    try {
      // Create the account first — Firestore rules only allow reading your
      // own allowlist entry once you're authenticated. If the email turns out
      // not to be invited, the fresh account is deleted immediately.
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = cred.user;

      const allow = await getAllowlistEntry(email);
      if (!allow) {
        await user.delete().catch(() => signOut(auth));
        toast.error(
          "Your email is not authorized. Contact humanity@ayni-studios.com to request access."
        );
        setIsLoading(false);
        return;
      }

      await setDoc(doc(db, "_users", user.uid), {
        fullName: fullName.trim(),
        email: email.trim(),
        role: allow.role,
        workspaceId: allow.workspaceId,
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created.");
      if (allow.role === "admin") {
        router.push("/admin");
      } else {
        router.push(`/workspace/${allow.workspaceId}`);
      }
    } catch (err: unknown) {
      // If we created the auth user but the Firestore write failed, roll back.
      await signOut(auth).catch(() => {});
      const msg =
        err instanceof Error ? err.message : "Failed to create account.";
      toast.error(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 relative z-10">
      <div className="p-8 md:p-10 bg-[#0C1619]/80 backdrop-blur-md border border-[#1b282d] shadow-2xl rounded-xl w-full max-w-lg">
        <h2 className="text-3xl font-black mb-2 text-center tracked uppercase text-white">
          Create Account
        </h2>
        <p className="text-[#DCE4EB]/60 text-center mb-8 text-sm">
          Access is invite-only. Your email must be pre-approved by Ayni.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-4 bg-[#111A1D] border border-[#1b282d] rounded text-white focus:outline-none focus:border-[#FEB040] text-sm"
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-4 bg-[#111A1D] border border-[#1b282d] rounded text-white focus:outline-none focus:border-[#FEB040] text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Create Password"
            required
            className="w-full p-4 bg-[#111A1D] border border-[#1b282d] rounded text-white focus:outline-none focus:border-[#FEB040] text-sm"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FEB040] text-[#080F11] p-4 rounded font-black uppercase tracked text-sm hover:bg-[#DCE4EB] transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[#DCE4EB]/60 pt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#FEB040] hover:text-white font-bold"
            >
              Sign in.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
