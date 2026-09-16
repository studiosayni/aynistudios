"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";
import { isPublicPath, BOOKING_URL } from "../lib/publicContent";

const PrivateNavbar = dynamic(() => import("./PrivateNavbar"));
const links = [
  { href: "/library", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  if (!isPublicPath(pathname)) return <PrivateNavbar />;
  return (
    <header className="public-nav">
      <nav className="site-width nav-inner" aria-label="Main navigation">
        <Link href="/" aria-label="Ayni Studios home">
          <BrandLogo />
        </Link>
        <div className="nav-links">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href ||
                (href === "/library" &&
                  (pathname.startsWith("/work/") ||
                    pathname.startsWith("/films/"))) ||
                pathname.startsWith(`${href}/`)
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
          <Link href="/login" className="nav-portal">
            Client login
          </Link>
        </div>
        <a
          href={BOOKING_URL}
          className="button button-small"
          data-track="booking_click"
        >
          Start a project
          <svg
            aria-hidden="true"
            focusable="false"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M5 19 19 5M5 5h14v14" />
          </svg>
        </a>
      </nav>
    </header>
  );
}
