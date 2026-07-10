"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import toast from "react-hot-toast";
import { routeUserAfterLogin } from "../lib/authRouting";
import GoogleIcon from "../components/GoogleIcon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
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
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await routeUserAfterLogin(router, cred.user.email!, cred.user.uid);
    } catch {
      toast.error("Failed to sign in with Google.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative z-10">
      <div className="p-10 bg-[#0C1619]/80 backdrop-blur-md border border-[#1b282d] shadow-2xl rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-2 text-center tracked uppercase text-white">
          Ayni Portal
        </h2>
        <p className="text-[#DCE4EB]/60 text-center mb-8 text-sm">
          Sign in to access your project workspace.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="w-full bg-white text-black p-4 rounded font-bold tracked text-xs hover:bg-[#DCE4EB] transition-colors mb-6 flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-[#1b282d] flex-1"></div>
          <span className="text-[10px] text-[#7B878F] font-bold uppercase tracked">
            OR
          </span>
          <div className="h-px bg-[#1b282d] flex-1"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 bg-[#111A1D] border border-[#1b282d] rounded text-white focus:outline-none focus:border-[#FEB040] transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 bg-[#111A1D] border border-[#1b282d] rounded text-white focus:outline-none focus:border-[#FEB040] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-[#FEB040] text-[#080F11] p-4 rounded font-black uppercase tracked text-xs hover:bg-[#DCE4EB] transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#DCE4EB]/60 mt-6">
          First time? Your email must be pre-approved.{" "}
          <Link
            href="/signup"
            className="text-[#FEB040] hover:text-white transition-colors font-bold"
          >
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
