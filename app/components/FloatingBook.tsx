"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BOOKING_URL, isPublicPath } from "../lib/publicContent";

// A booking pill pinned to the bottom-right of every public page. It stays
// out of the way until the reader has scrolled past the first screen, and
// steps aside where a booking button is already on screen (the closing
// CTA band) or where the consent prompt sits in the same corner on phones.
export default function FloatingBook() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const cta = document.querySelector(".inquiry-cta");
    if (!cta) return;
    const io = new IntersectionObserver(
      ([e]) => setCtaVisible(e.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(cta);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const check = () => setConsentOpen(!!document.querySelector(".analytics-choice"));
    check();
    window.addEventListener("ayni-consent", check);
    const t = setTimeout(check, 500);
    return () => {
      window.removeEventListener("ayni-consent", check);
      clearTimeout(t);
    };
  }, [pathname]);

  if (!isPublicPath(pathname)) return null;
  const show = past && !ctaVisible && !consentOpen;
  return (
    <a
      href={BOOKING_URL}
      className={`floating-book${show ? " on" : ""}`}
      data-track="booking_click"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      Book 15 minutes <span aria-hidden="true">↗</span>
    </a>
  );
}
