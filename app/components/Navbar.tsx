"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { workspaceDestination } from "../lib/authRouting";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  // Signed-in users go straight to their workspace; visitors go to /login.
  const handlePortal = async () => {
    if (currentUser?.email) {
      const dest = await workspaceDestination(currentUser.email);
      router.push(dest ?? "/login");
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="bg-[#080F11]/90 backdrop-blur-md py-4 px-4 md:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-3 md:gap-4 group z-10">
          <Image
            src="/brand/logo-icon-whitestroke.png"
            alt="Ayni Studios"
            width={40}
            height={40}
            priority
            unoptimized
          />
          <span className="text-xl md:text-2xl font-black tracked uppercase text-[#DCE4EB] hidden lg:block">
            Ayni Studios
          </span>
        </Link>

        {/* RIGHT: NAV */}
        <div className="flex items-center gap-5 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracked z-10">
          <Link
            href="/library"
            className="hover:text-[#FEB040] transition-colors"
          >
            Library
          </Link>

          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-[#DCE4EB]/50 hover:text-white transition-colors"
            >
              Logout
            </button>
          )}
          <button
            onClick={handlePortal}
            className="bg-[#FEB040] text-[#080F11] px-4 md:px-5 py-2 rounded hover:bg-[#DCE4EB] transition-colors ml-2 font-bold uppercase tracked cursor-pointer"
          >
            Portal
          </button>
        </div>
      </div>

      {/* subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FEB040]/40 to-transparent"></div>
    </nav>
  );
}
