"use client";

import { useState } from "react";
import Image from "next/image";
import { youtubeThumb, type LibraryItem } from "../lib/library";

// Featured hero slot on /library: a lite-YouTube facade. Shows only the
// thumbnail on load (zero YouTube JS); the embed iframe is injected on click.

export default function FeaturedVideoCard({ item }: { item: LibraryItem }) {
  const [playing, setPlaying] = useState(false);
  const [thumbQuality, setThumbQuality] = useState<"maxres" | "hq">("maxres");

  const thumb =
    item.thumbnailUrl || youtubeThumb(item.youtubeId, thumbQuality);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#1b282d] bg-[#0C1619] shadow-2xl">
      <div className="relative aspect-video">
        {playing && item.youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${item.title}`}
            className="group absolute inset-0 w-full h-full text-left"
          >
            {thumb && (
              <Image
                src={thumb}
                alt={item.title}
                fill
                priority
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 1024px"
                unoptimized
                onError={() => {
                  // Not every video has a maxres thumbnail — fall back.
                  if (thumbQuality === "maxres") setThumbQuality("hq");
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080F11]/95 via-[#080F11]/30 to-transparent" />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-20 h-20 rounded-full bg-[#FEB040] text-[#080F11] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>

            <span className="absolute bottom-0 left-0 right-0 p-6 md:p-10 block">
              <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
                Featured{item.category ? ` · ${item.category}` : ""}
              </span>
              <span className="mt-2 block text-2xl md:text-4xl font-black uppercase tracked text-white leading-tight">
                {item.title}
              </span>
              {item.description && (
                <span className="mt-3 hidden sm:block max-w-2xl text-sm text-[#DCE4EB]/70 leading-relaxed">
                  {item.description}
                </span>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
