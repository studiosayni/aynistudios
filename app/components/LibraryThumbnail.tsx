"use client";

import { useState } from "react";
import Image from "next/image";
import { thumbnailChain, type LibraryItem } from "../lib/libraryShared";

// Shared artwork slot for every library surface — the /library grid, its
// featured hero, and the homepage carousel. Walks thumbnailChain() on each
// load failure, so a video without a maxres frame, or a visitor whose ad
// blocker eats i.ytimg.com, still gets a picture instead of a black hole.
// Expects a parent with `position: relative` (the aspect-video wrappers).

// YouTube answers a missing frame with a 120x90 grey placeholder. It arrives
// with a 404 status but a decodable body, so the browser fires `load` rather
// than `error` — width is the only reliable tell.
const YT_PLACEHOLDER_MAX_WIDTH = 120;

export default function LibraryThumbnail({
  item,
  sizes,
  priority = false,
  className = "",
}: {
  item: LibraryItem;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const chain = thumbnailChain(item);
  const [step, setStep] = useState(0);
  const src = chain[step];

  if (!src) return <ThumbnailFallback />;

  const advance = () => setStep((s) => s + 1);

  return (
    <Image
      // Remount on each fallback so the handlers re-arm for the new candidate.
      key={src}
      src={src}
      // Decorative: every surface renders the title adjacent to this image
      // (below it in the grid, carousel and admin list; overlaid on the
      // featured card), so alt={item.title} made screen readers announce the
      // same words twice. It was also inaccurate — these thumbnails carry
      // their own headline art, which frequently says something different
      // from the record's title.
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      // Deliberately NOT unoptimized. Routing through /_next/image means the
      // browser requests artwork from our own origin instead of i.ytimg.com,
      // which (a) serves AVIF/WebP at the slot's real width rather than a
      // 1280x720 JPEG, and (b) survives the ad blockers and DNS filters that
      // eat ytimg — the same class of failure that made the catalog itself
      // unreachable on mobile. Costs image transforms on App Hosting.
      draggable={false}
      className={`object-cover ${className}`}
      // Fires when the request itself fails — the ad-blocker / DNS-filter case,
      // where no body comes back at all.
      onError={advance}
      // Fires on a successful decode, including YouTube's grey placeholder.
      // Anything that narrow is unusable in these slots regardless of source.
      onLoad={(e) => {
        const { naturalWidth } = e.currentTarget;
        if (naturalWidth > 0 && naturalWidth <= YT_PLACEHOLDER_MAX_WIDTH) {
          advance();
        }
      }}
    />
  );
}

// Last resort: an on-brand panel carrying just the mark. Title, category and
// year all sit adjacent on every surface — below the frame in the grid and
// carousel, overlaid on the featured card — so any label here reads as a
// duplicate rather than as information.
function ThumbnailFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(160deg,#131E22_0%,#0C1619_55%,#080F11_100%)]"
    >
      <Image
        src="/brand/logo-icon-whitestroke.webp"
        alt=""
        width={44}
        height={44}
        className="opacity-20"
        unoptimized
      />
    </div>
  );
}
