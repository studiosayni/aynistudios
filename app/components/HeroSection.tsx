"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PILLARS } from "../lib/pillarWords";

// Hero: full-bleed editorial stills crossfading behind the headline
// (web-optimized copies in public/brand/hero/, sourced from Noah's masters
// in public/images/), with a slow Ken Burns drift and a center gradient
// scrim that pools darkness behind the text while the edges stay vibrant.
// The rotating pillar word (photo-filled word images) runs on its own clock.

const ROTATE_MS = 2600; // pillar word
const IMAGE_MS = 7500; // background still
const HERO_IMAGES = [
  "/brand/hero/hero-7.jpg", // golden-hour community
  "/brand/hero/hero-34.jpg", // Amazon aerial
  "/brand/hero/hero-1.jpg",
  "/brand/hero/hero-10.jpg",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgReady, setBgReady] = useState(false); // defer non-first stills off the critical path

  useEffect(() => {
    const wordId = setInterval(() => {
      setIndex((i) => (i + 1) % PILLARS.length);
    }, ROTATE_MS);
    const bgId = setInterval(() => {
      setBgIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, IMAGE_MS);
    const readyId = setTimeout(() => setBgReady(true), 1500);
    return () => {
      clearInterval(wordId);
      clearInterval(bgId);
      clearTimeout(readyId);
    };
  }, []);

  const word = PILLARS[index];

  return (
    <section className="relative min-h-[calc(100svh-72px)] flex items-center justify-center px-6 py-20">
      {/* FULL-BLEED BACKGROUND — crossfading stills + scrims */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      >
        {HERO_IMAGES.map(
          (src, i) =>
            (i === 0 || bgReady) && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={src}
                src={src}
                alt=""
                fetchPriority={i === 0 ? "high" : undefined}
                className={`absolute inset-0 h-full w-full object-cover saturate-[1.12] transition-opacity duration-[1600ms] ease-in-out ${
                  i === bgIndex
                    ? `opacity-65 ${i % 2 === 0 ? "motion-safe:animate-kenburns-in" : "motion-safe:animate-kenburns-out"}`
                    : "opacity-0"
                }`}
              />
            )
        )}
        {/* Center scrim: darkness pools behind the headline, edges stay alive */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_46%,rgba(8,15,17,0.84)_0%,rgba(8,15,17,0.30)_60%,rgba(8,15,17,0.02)_100%)]" />
        {/* Top fade for navbar legibility; bottom fade blends into the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080F11]/55 via-transparent to-[#080F11]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Tagline: Bold (not Black) with wider tracking — hero-only
            treatment; the oversized word below carries the weight. */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.19em] leading-tight">
          Media forged for our<span className="text-[#FEB040]">...</span>
          {/* The rotating pillar word — hard cut between words (no fade).
              All five stack in one grid cell so the block never shifts. */}
          <span className="mt-5 md:mt-8 grid justify-items-center">
            {PILLARS.map((w, i) => (
              <span
                key={w}
                aria-hidden={i !== index}
                className={`col-start-1 row-start-1 ${i === index ? "" : "invisible"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/pillars/${w}.png`}
                  alt={w}
                  className="h-[1.35em] sm:h-[1.6em] md:h-[1.85em] w-auto brightness-[1.12] contrast-[1.03]"
                />
              </span>
            ))}
          </span>
        </h1>

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
