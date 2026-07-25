import type { Metadata } from "next";
import Link from "next/link";
import FeaturedVideoCard from "../components/FeaturedVideoCard";
import LibraryThumbnail from "../components/LibraryThumbnail";
import { fetchLibraryServer } from "../lib/libraryServer";
import {
  pickFeatured,
  youtubeWatchUrl,
  type LibraryItem,
} from "../lib/libraryShared";

// Server-rendered: the catalog arrives in the HTML rather than via a
// client-side Firestore call, which a blocked googleapis.com would stall
// forever. Only the interactive leaves (FeaturedVideoCard's play facade,
// LibraryThumbnail's fallback chain) are client components.

export const metadata: Metadata = {
  title: "Library",
  description:
    "Documentary productions, brand work, and episodic series from Ayni Studios.",
  openGraph: {
    title: "Library — Ayni Studios",
    description:
      "Documentary productions, brand work, and episodic series from Ayni Studios.",
  },
};

// The catalog changes rarely; re-read it every 5 minutes rather than on
// every request.
export const revalidate = 300;

export default async function LibraryPage() {
  let items: LibraryItem[] = [];
  let failed = false;

  try {
    items = await fetchLibraryServer();
  } catch (err) {
    console.error("Library fetch error:", err);
    failed = true;
  }

  const featured = pickFeatured(items);
  const rest = featured ? items.filter((i) => i.dbId !== featured.dbId) : items;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-12">
        <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
          Non-Fiction Content
        </span>
        <h1 className="mt-3 text-5xl md:text-6xl font-black uppercase tracked">
          Library
        </h1>
        <p className="mt-6 text-lg text-[#DCE4EB]/70 max-w-2xl leading-relaxed">
          Documentary productions, brand work, and episodic series.
        </p>
      </header>

      {failed && (
        <p className="py-20 text-center text-sm font-bold uppercase tracked text-red-400/80">
          Unable to load library. Check back soon.
        </p>
      )}

      {!failed && items.length === 0 && (
        <p className="py-20 text-center text-sm font-bold uppercase tracked text-[#DCE4EB]/50">
          New work coming soon.
        </p>
      )}

      {featured && (
        <div className="mb-16">
          <FeaturedVideoCard item={featured} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((item) => (
          <Link
            key={item.dbId}
            href={youtubeWatchUrl(item.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl overflow-hidden border border-[#1b282d] bg-[#0C1619]/70 backdrop-blur-md hover:border-[#FEB040]/60 transition-colors"
          >
            <div className="relative aspect-video bg-[#080F11]">
              <LibraryThumbnail
                item={item}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              {item.category && (
                <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
                  {item.category}
                </span>
              )}
              <h2 className="mt-2 text-xl font-bold uppercase tracked-tight leading-tight text-white">
                {item.title}
              </h2>
              {(item.client || item.year) && (
                <p className="mt-2 text-xs font-bold uppercase tracked text-[#7B878F]">
                  {[item.client, item.year].filter(Boolean).join(" · ")}
                </p>
              )}
              {item.description && (
                <p className="mt-4 text-sm text-[#DCE4EB]/60 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
