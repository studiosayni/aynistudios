"use client";

import { useLightbox } from "./VideoLightbox";
import { youtubeWatchUrl, type LibraryItem } from "../lib/libraryShared";

// Card wrapper for library items. Deliberately still a real anchor pointing at
// the YouTube watch URL — plain clicks are intercepted to open the lightbox,
// but modified clicks (cmd/ctrl/shift/middle) fall through to the browser, and
// crawlers plus no-JS visitors keep a working outbound link.

export default function PlayLink({
  item,
  className,
  children,
  // Forwarded to the anchor so callers can attach their own hooks — the
  // carousel tags each card with data-card and measures it for scroll stride.
  ...rest
}: {
  item: LibraryItem;
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const lightbox = useLightbox();
  const playable = Boolean(item.youtubeId) && lightbox !== null;

  return (
    <a
      {...rest}
      href={youtubeWatchUrl(item.youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      className={className}
      onClick={(e) => {
        if (!playable) return;
        // Let the browser handle anything the user meant as "open elsewhere".
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        lightbox!.open(item);
      }}
    >
      {children}
    </a>
  );
}
