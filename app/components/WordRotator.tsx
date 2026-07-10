"use client";

import { useEffect, useState } from "react";
import { PILLARS } from "../lib/pillarWords";

// Rotates the five brand pillars (with their amber period) using a soft
// cross-fade. All words are stacked in the same inline-grid cell, so the
// slot is always as wide as the longest word — the surrounding headline
// never reflows as words change; each word centers in the fixed slot.

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
          className={`col-start-1 row-start-1 text-center uppercase tracked text-[#FEB040] ${
            i === index ? "animate-word-in" : "invisible"
          }`}
        >
          {word}.
        </span>
      ))}
    </span>
  );
}
