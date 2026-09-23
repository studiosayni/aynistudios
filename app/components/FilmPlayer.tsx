"use client";

import { useState } from "react";
import LibraryThumbnail from "./LibraryThumbnail";

// Click-to-load YouTube for the watch pages. The embed pulls ~1.1 MB of
// player script and held a phone's main thread for ~0.5 s on every visit
// (Lighthouse 63 on /films/*), while most visitors read the page before they
// press play. Until then the page shows the poster frame and a real button;
// one click swaps in the iframe with autoplay. Google still finds the video
// through the VideoObject embedUrl and the video sitemap's player_loc.
export default function FilmPlayer({
  youtubeId,
  title,
  thumbnailUrl,
}: {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="film-poster"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
    >
      <LibraryThumbnail
        item={{ dbId: youtubeId, title, youtubeId, thumbnailUrl }}
        sizes="(max-width: 1240px) 100vw, 1200px"
        priority
      />
      <span className="film-play" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.5v13l10.5-6.5z" />
        </svg>
      </span>
    </button>
  );
}
