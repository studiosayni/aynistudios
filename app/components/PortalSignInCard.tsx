"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../lib/firebase";
import { routeUserAfterLogin, workspaceDestination } from "../lib/authRouting";
import GlassCard from "./GlassCard";
import GoogleIcon from "./GoogleIcon";

// iCloud-style inline sign-in card on the Main page. Signed-out visitors get
// the full email/Google form; signed-in clients get a straight door into
// their workspace.

export default function PortalSignInCard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await routeUserAfterLogin(router, cred.user.email!, cred.user.uid);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      toast.error(
        code === "auth/invalid-credential"
          ? "Incorrect email or password."
          : "Failed to log in."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await routeUserAfterLogin(router, cred.user.email!, cred.user.uid);
    } catch {
      toast.error("Failed to sign in with Google.");
    } finally {
      setBusy(false);
    }
  };

  const handleOpenWorkspace = async () => {
    if (!user?.email) return;
    setBusy(true);
    const dest = await workspaceDestination(user.email);
    setBusy(false);
    if (dest) {
      router.push(dest);
    } else {
      toast.error(
        "Your email is not authorized. Contact humanity@ayni-studios.com."
      );
    }
  };

  return (
    <GlassCard className="p-8 md:p-10 flex flex-col">
      <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
        Client Portal
      </span>

      {user ? (
        <div className="mt-4 flex flex-col flex-grow">
          <h3 className="text-2xl font-black uppercase tracked text-white">
            Welcome back
          </h3>
          <p className="mt-3 text-sm text-[#DCE4EB]/60 break-all">
            Signed in as {user.email}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleOpenWorkspace}
              disabled={busy}
              className="w-full bg-[#FEB040] text-[#080F11] p-4 rounded font-black uppercase tracked text-xs hover:bg-[#DCE4EB] transition-colors disabled:opacity-50"
            >
              {busy ? "Opening..." : "Open your workspace →"}
            </button>
            <button
              onClick={() => signOut(auth)}
              className="text-xs text-[#7B878F] hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col flex-grow">
          <h3 className="text-2xl font-black uppercase tracked text-white">
            Your projects, one place
          </h3>
          <p className="mt-3 text-sm text-[#DCE4EB]/60 leading-relaxed">
            Review cuts, share feedback, and track your productions.
          </p>

          <form
            onSubmit={handleEmailLogin}
            className={`mt-6 space-y-3 ${authReady ? "" : "opacity-60 pointer-events-none"}`}
          >
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3.5 bg-[#111A1D] border border-[#1b282d] rounded text-sm text-white focus:outline-none focus:border-[#FEB040] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3.5 bg-[#111A1D] border border-[#1b282d] rounded text-sm text-white focus:outline-none focus:border-[#FEB040] transition-colors"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#FEB040] text-[#080F11] p-3.5 rounded font-black uppercase tracked text-xs hover:bg-[#DCE4EB] transition-colors disabled:opacity-50"
            >
              {busy ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-4">
            <div className="h-px bg-[#1b282d] flex-1" />
            <span className="text-[10px] text-[#7B878F] font-bold uppercase tracked">
              or
            </span>
            <div className="h-px bg-[#1b282d] flex-1" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={busy || !authReady}
            className="w-full bg-white text-black p-3.5 rounded font-bold tracked text-xs hover:bg-[#DCE4EB] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-5 text-center text-xs text-[#DCE4EB]/50">
            Access is invite-only.{" "}
            <Link
              href="/signup"
              className="text-[#FEB040] hover:text-white transition-colors font-bold"
            >
              Sign up
            </Link>{" "}
            with a pre-approved email.
          </p>
        </div>
      )}
    </GlassCard>
  );
}
