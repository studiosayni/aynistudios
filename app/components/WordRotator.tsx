"use client";

import { useEffect, useState } from "react";
import { PILLARS } from "../lib/pillarWords";

// Rotates the five pillar words in the hero as photo-filled word images
// (documentary footage masked into the letterforms — assets in
// public/brand/pillars/, trimmed from Noah's originals in public/images/).
// All words stack in one inline-grid cell so the slot is as wide as the
// longest word (HUMANITY) and the surrounding headline never reflows.
// Each word carries its own amber period; a faint glow lifts dark footage
// off the near-black background.

export default function WordRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PILLARS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-grid align-baseline">
      {PILLARS.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 flex items-baseline justify-center whitespace-nowrap ${
            i === index ? "animate-word-in" : "invisible"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/brand/pillars/${word}.png`}
            alt={word}
            className="inline-block h-[0.78em] w-auto [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.65))_drop-shadow(0_0_4px_rgba(220,228,235,0.18))]"
          />
          <span className="text-[#FEB040]">.</span>
        </span>
      ))}
    </span>
  );
}
