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
          Start a project <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
