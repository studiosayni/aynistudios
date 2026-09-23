"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";
import BusinessAddress from "./BusinessAddress";
import { isPublicPath, BOOKING_URL, LOCATION_PATH, STUDIO_MAPS_URL } from "../lib/publicContent";

const PrivateFooter = dynamic(() => import("./PrivateFooter"));
export default function Footer() {
  const path = usePathname();
  if (!isPublicPath(path)) return <PrivateFooter />;
  return (
    <footer className="public-footer">
      <div className="site-width">
        <div className="footer-grid">
          <div>
            <Link href="/" aria-label="Ayni Studios home">
              <BrandLogo />
            </Link>
            <p className="body-copy mt-5 max-w-xs">
              Stories for our planet, our humanity, and the future we share.
            </p>
            <p className="eyebrow mt-6">Valencia, CA · Los Angeles County · Working globally</p>
            <Link href={LOCATION_PATH} className="small-copy footer-location-link">
              Video production in Los Angeles ↗
            </Link>
          </div>
          <nav aria-label="Footer navigation">
            <p className="eyebrow">Explore</p>
            <Link href="/library">Our work</Link>
            <Link href="/services">Services</Link>
            <Link href="/guides">Production guides</Link>
            <Link href="/about">The studio</Link>
            <Link href="/contact">Contact</Link>
            <a href={BOOKING_URL} data-track="booking_click">Start a project</a>
            <Link href="/login" prefetch={false}>Client login</Link>
          </nav>
          <div>
            <p className="eyebrow">Let’s talk</p>
            <a href="mailto:humanity@ayni-studios.com" data-track="email_click">
              humanity@ayni-studios.com
            </a>
            <a href="tel:+18185275760" data-track="phone_click">
              +1 818 527 5760
            </a>
            <a
              href="https://wa.me/18185275760"
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_click"
            >
              WhatsApp ↗
            </a>
            <div className="small-copy mt-6"><BusinessAddress /></div>
            <a
              href={STUDIO_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="small-copy"
            >
              Open in Google Maps ↗
            </a>
          </div>
          <nav aria-label="Social profiles">
            <p className="eyebrow">Elsewhere</p>
            <a
              href="https://www.linkedin.com/company/ayni-studios"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://www.youtube.com/@Ayni.Studios"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube ↗
            </a>
            <a
              href="https://www.instagram.com/ayni_studios"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Ayni Studios</p>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
