"use client";

import { useRef, useState, useSyncExternalStore } from "react";

const MOTION_QUERY = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(MOTION_QUERY).matches;
const getServerSnapshot = () => false;

export default function HeroAnimation() {
  const motionAllowed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="hero-brand-film">
      <figcaption>Media forged for our<span>…</span></figcaption>
      <div className="hero-brand-frame">
        {motionAllowed ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            poster="/brand/hero/words-poster.webp"
            width={1280}
            height={720}
            aria-label="Planet, humanity, future, wonder, truth — in many languages"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            {/* HEVC first preserves transparency in Safari; other engines use WebM. */}
            <source src="/brand/hero/words.mp4" type='video/mp4; codecs="hvc1"' />
            <source src="/brand/hero/words.webm" type="video/webm" />
          </video>
        ) : (
          // No video sources are mounted on small screens or with reduced motion.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/brand/hero/words-poster.webp"
            alt="Ayni’s five pillars: planet, humanity, future, wonder, truth"
            width={1280}
            height={720}
            decoding="async"
          />
        )}
      </div>
      {motionAllowed && (
        <button
          type="button"
          className="hero-motion-toggle"
          aria-label={playing ? "Pause hero animation" : "Play hero animation"}
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) void video.play().catch(() => setPlaying(false));
            else video.pause();
          }}
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
          {playing ? "Pause motion" : "Play motion"}
        </button>
      )}
    </figure>
  );
}
