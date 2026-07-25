"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LibraryThumbnail from "./LibraryThumbnail";
import { youtubeWatchUrl, type LibraryItem } from "../lib/libraryShared";

// Homepage preview of the content library: horizontal scroll-snap carousel of
// the latest productions (featured item leads). Gently auto-advances; pauses
// on hover/touch/reduced-motion; cards link out to YouTube.
//
// Items are fetched server-side by the page and passed in, so the carousel
// renders with content in the initial HTML instead of waiting on a
// client-side Firestore call that a blocked googleapis.com would stall.

const AUTO_ADVANCE_MS = 5000;
const INTERACTION_GRACE_MS = 8000;

export default function LibraryCarousel({ items }: { items: LibraryItem[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const dragRef = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null);

  // Auto-advance.
  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track || document.hidden || hoverRef.current) return;
      if (Date.now() - lastInteractionRef.current < INTERACTION_GRACE_MS) return;

      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 16;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardStride(track), behavior: "smooth" });
      }
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [items]);

  function cardStride(track: HTMLDivElement): number {
    const card = track.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + 24 : track.clientWidth;
  }

  const arrow = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    lastInteractionRef.current = Date.now();
    track.scrollBy({ left: dir * cardStride(track), behavior: "smooth" });
  };

  // Desktop mouse drag-to-scroll (touch scrolls natively).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") {
      lastInteractionRef.current = Date.now();
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { startX: e.clientX, startLeft: track.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 5) drag.moved = true;
    if (drag.moved) {
      track.scrollLeft = drag.startLeft - dx;
      lastInteractionRef.current = Date.now();
    }
  };
  const endDrag = () => {
    dragRef.current = null;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    // Swallow the click that ends a drag so it doesn't open YouTube.
    if (dragRef.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
              Non-Fiction Content
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black uppercase tracked">
              From the Library
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => arrow(-1)}
              aria-label="Previous"
              className="w-11 h-11 rounded-full border border-[#1b282d] text-[#DCE4EB]/70 hover:border-[#FEB040] hover:text-[#FEB040] transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => arrow(1)}
              aria-label="Next"
              className="w-11 h-11 rounded-full border border-[#1b282d] text-[#DCE4EB]/70 hover:border-[#FEB040] hover:text-[#FEB040] transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label="Library preview carousel"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] cursor-grab active:cursor-grabbing select-none"
      >
        {items.map((item) => (
          <Link
            key={item.dbId}
            data-card
            href={youtubeWatchUrl(item.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className="group shrink-0 snap-start w-[82vw] sm:w-[420px] rounded-2xl overflow-hidden border border-[#1b282d] bg-[#0C1619]/70 backdrop-blur-md hover:border-[#FEB040]/60 transition-colors"
          >
            <div className="relative aspect-video bg-[#080F11]">
              <LibraryThumbnail
                item={item}
                sizes="(max-width: 640px) 82vw, 420px"
                className="group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              {item.category && (
                <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
                  {item.category}
                </span>
              )}
              <h3 className="mt-2 text-lg font-bold uppercase leading-tight text-white line-clamp-2">
                {item.title}
              </h3>
              {(item.client || item.year) && (
                <p className="mt-2 text-xs font-bold uppercase tracked text-[#7B878F]">
                  {[item.client, item.year].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <Link
          href="/library"
          className="inline-block text-xs font-bold uppercase tracked text-[#DCE4EB] hover:text-[#FEB040] transition-colors"
        >
          View the full library →
        </Link>
      </div>
    </section>
  );
}
