"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { bleedSrcSet } from "../lib/bleedImage";

// Hero: full-bleed editorial stills crossfading behind the headline
// (web-optimized copies in public/brand/hero/), with a slow Ken Burns drift
// and a center gradient scrim. Beneath the tagline, the original brand
// word-cloud animation (multilingual pillar words) plays as a transparent
// video — VP9-alpha WebM for Chrome/Firefox, HEVC-alpha MP4 for Safari,
// both encoded from brand_assets' Main_2-4.mov.

const IMAGE_MS = 7500; // background still
const HERO_IMAGES = [
  "/brand/hero/hero-7", // golden-hour community
  "/brand/hero/hero-34", // Amazon aerial
  "/brand/hero/hero-1",
  "/brand/hero/hero-10",
];

export default function HeroSection() {
  const [bgIndex, setBgIndex] = useState(0);
  // Highest still index allowed to have a src yet. Stills used to be deferred
  // as one batch 1.5s after mount, which kept them off the critical path but
  // still pulled all 382KB of them before the second one was needed at 7.5s —
  // wasted entirely on anyone who bounced first. Now each is fetched shortly
  // before its turn: the batch at 1.5s becomes 294KB at 3.5s, 26KB at 7.5s and
  // 62KB at 15s. Monotonic, so a wrap back to 0 never drops a loaded image.
  const [loadedThrough, setLoadedThrough] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // The rotation index also drives which still may load next, and both have to
  // move together on the same tick. Mirrored into a ref so the interval can
  // read it without a second effect — advancing them from an effect body trips
  // react-hooks/set-state-in-effect.
  const bgIndexRef = useRef(0);

  useEffect(() => {
    const bgId = setInterval(() => {
      const next = (bgIndexRef.current + 1) % HERO_IMAGES.length;
      bgIndexRef.current = next;
      setBgIndex(next);
      // Warm the one after this, giving it a full IMAGE_MS before its turn.
      setLoadedThrough((n) => Math.max(n, next + 1));
    }, IMAGE_MS);
    // The second still is the only one without a rotation tick to warm it, so
    // it gets its own timer — 4s of lead on a 1.6s crossfade, comfortably
    // enough for 294KB, while still sparing it entirely from an early bounce.
    const readyId = setTimeout(() => setLoadedThrough((n) => Math.max(n, 1)), 3500);
    // Respect reduced motion: hold the word-cloud on its first frame.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }

    // Dev check: confirm the engine landed on the source it can render with
    // alpha (see the <source> order below). WebKit — Safari and every iOS
    // browser — must get the HEVC file; everything else takes the WebM.
    // Open the console on the homepage in each browser to verify.
    let checkId: ReturnType<typeof setTimeout> | undefined;
    if (process.env.NODE_ENV !== "production") {
      checkId = setTimeout(() => {
        const v = videoRef.current;
        if (!v) return;
        const webkit = /apple/i.test(navigator.vendor);
        const want = webkit ? "words.mp4" : "words.webm";
        const got = v.currentSrc.split("/").pop() || "(none)";
        const line = `[hero] ${webkit ? "WebKit" : "non-WebKit"} → ${got} (expected ${want}), readyState=${v.readyState}`;
        if (got !== want) {
          console.warn(`${line} — WRONG SOURCE: alpha will not render`);
        } else if (v.readyState === 0) {
          console.warn(`${line} — source selected but no metadata; not decoding`);
        } else {
          console.info(line);
        }
      }, 3000);
    }

    return () => {
      clearInterval(bgId);
      clearTimeout(readyId);
      clearTimeout(checkId);
    };
  }, []);

  return (
    <section className="hero-shell relative min-h-[calc(100svh-72px)] flex items-center justify-center px-6">
      {/* FULL-BLEED BACKGROUND — crossfading stills + scrims */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      >
        {HERO_IMAGES.map(
          (base, i) =>
            i <= loadedThrough && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={base}
                src={`${base}.jpg`}
                srcSet={bleedSrcSet(base)}
                sizes="100vw"
                alt=""
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover saturate-[1.12] transition-opacity duration-[1600ms] ease-in-out ${
                  i === bgIndex
                    ? `opacity-45 ${i % 2 === 0 ? "motion-safe:animate-kenburns-in" : "motion-safe:animate-kenburns-out"}`
                    : "opacity-0"
                }`}
              />
            )
        )}
        {/* Center scrim: darkness pools behind the headline, edges stay alive.
            Deepened alongside the drop from opacity-65 to 45 so the word-cloud
            animation reads clearly against the stills rather than competing. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_46%,rgba(8,15,17,0.90)_0%,rgba(8,15,17,0.42)_60%,rgba(8,15,17,0.08)_100%)]" />
        {/* Top fade for navbar legibility; bottom fade blends into the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080F11]/55 via-transparent to-[#080F11]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Tagline: Bold with wider tracking — hero-only treatment. */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.19em] leading-tight">
          Media forged for our<span className="text-[#FEB040]">...</span>
        </h1>

        {/* The original brand word-cloud animation, transparent over the
            stills. Source order matters, and HEVC must come first: WebKit
            plays VP9/WebM but silently ignores its alpha channel, so listing
            the WebM first made Safari (and every iOS browser, all WebKit)
            render the word-cloud as an opaque block. Engines that can't
            decode hvc1 skip that source and fall through to the WebM. */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          poster="/brand/hero/words-poster.webp"
          aria-label="Planet, humanity, future, wonder, truth — in many languages"
          className="hero-wordcloud mx-auto mt-2 md:mt-4 w-full h-auto pointer-events-none"
        >
          <source src="/brand/hero/words.mp4" type='video/mp4; codecs="hvc1"' />
          <source src="/brand/hero/words.webm" type="video/webm" />
        </video>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/library"
            className="px-10 py-4 bg-[#FEB040] text-[#080F11] font-black uppercase tracked text-xs md:text-sm hover:bg-[#DCE4EB] transition-colors rounded"
          >
            View the Library
          </Link>
          <a
            href="#portal"
            className="px-10 py-4 border border-[#DCE4EB]/30 text-[#DCE4EB] font-black uppercase tracked text-xs md:text-sm hover:border-[#FEB040] hover:text-[#FEB040] transition-colors rounded"
          >
            Client Portal
          </a>
        </div>
      </div>

      <a
        href="#library-preview"
        aria-label="Scroll to library preview"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#7B878F] hover:text-[#FEB040] transition-colors motion-safe:animate-bounce"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </a>
    </section>
  );
}
