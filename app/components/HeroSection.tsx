"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PILLARS } from "../lib/pillarWords";

// Hero: "MEDIA FORGED FOR OUR ___." where the rotating word is a photo-filled
// word image (public/brand/pillars/), plus ghosted echoes of the SAME word
// scattered around the empty hero space, all driven by one shared clock so
// the swap is perfectly synchronized. Echo images reuse the rotator's URLs,
// so they cost zero extra bytes.

const ROTATE_MS = 2600;

// Echo slots: positioned in the hero's empty zones (never over the headline),
// with varied size/tilt/opacity. Mobile shows 2, tablet 4, desktop 6.
const ECHO_SLOTS = [
  { cls: "left-[6%] top-[13%] w-56 md:w-72 -rotate-6 opacity-[0.10]", delay: 0 },
  { cls: "right-[5%] bottom-[20%] w-64 md:w-80 -rotate-3 opacity-[0.11]", delay: 180 },
  { cls: "right-[7%] top-[10%] w-44 md:w-60 rotate-3 opacity-[0.08] hidden sm:block", delay: 120 },
  { cls: "left-[4%] bottom-[26%] w-40 md:w-56 rotate-2 opacity-[0.07] hidden md:block", delay: 260 },
  { cls: "left-[20%] bottom-[9%] w-44 rotate-1 opacity-[0.06] hidden lg:block", delay: 340 },
  { cls: "right-[24%] top-[22%] w-36 -rotate-2 opacity-[0.06] hidden xl:block", delay: 420 },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PILLARS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const word = PILLARS[index];

  return (
    <section className="relative min-h-[calc(100svh-72px)] flex items-center justify-center px-6 py-20">
      {/* Ghosted echoes of the active word. Remounted per rotation (key) so
          the staggered fade-in replays; aria-hidden — purely decorative. */}
      <div
        key={word}
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      >
        {ECHO_SLOTS.map((slot, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={i}
            src={`/brand/pillars/${word}.png`}
            alt=""
            style={{ animationDelay: `${slot.delay}ms` }}
            className={`absolute h-auto motion-safe:animate-echo-in ${slot.cls}`}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracked leading-tight">
          Media forged
          <br />
          for our{" "}
          <span className="inline-grid align-baseline">
            {PILLARS.map((w, i) => (
              <span
                key={w}
                aria-hidden={i !== index}
                className={`col-start-1 row-start-1 flex items-baseline justify-center whitespace-nowrap ${
                  i === index ? "animate-word-in" : "invisible"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/pillars/${w}.png`}
                  alt={w}
                  className="inline-block h-[0.78em] w-auto [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.65))_drop-shadow(0_0_4px_rgba(220,228,235,0.18))]"
                />
                <span className="text-[#FEB040]">.</span>
              </span>
            ))}
          </span>
        </h1>

        <p className="mt-10 text-lg md:text-xl text-[#DCE4EB]/70 max-w-2xl mx-auto leading-relaxed">
          A media studio producing documentary and impact content for the
          planet, humanity, and the future.
        </p>

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
