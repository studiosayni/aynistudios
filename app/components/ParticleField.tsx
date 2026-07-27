"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ALL_PILLAR_WORDS } from "../lib/pillarWords";

// Site-wide ambient backdrop: the five pillar words drift and cross-fade in
// many languages behind the page content, echoing the original hero video.
// Rendered as a fixed z-0 canvas (page content sits at z-10, navbar z-50).
//
// Behavior contract (see plan):
//  - full intensity over the Main hero, dimming as you scroll away from it
//  - below the hero, intensity is set by the section holding the viewport's
//    midline (see BACKDROP ZONES below) rather than decaying to a single floor
//  - hidden entirely on /admin and /workspace (client review surfaces)
//  - prefers-reduced-motion → a single static frame, no animation
//  - pauses when the tab is hidden; DPR capped at 2. The <canvas> renders
//    server-side as an empty element (identical markup either side, so no
//    hydration mismatch); all drawing happens in the effect.
//
// BACKDROP ZONES
// The field used to fade out once and stay there, which measured at 0.3% of
// canvas pixels carrying any ink at all — the mechanism meant to give the lower
// page some texture was drawing at roughly the perceptual threshold. It now
// rises again in the sections that have nothing else in them and stays out of
// the way behind the dense ones.
//
// A section opts in with data-backdrop="<0..1>"; anything that doesn't declare
// one gets AMBIENT. Keeping it declarative means this component stays generic —
// it never has to know the page's section order, and a new page can set its own
// rhythm without touching the canvas.
const HIDDEN_PREFIXES = ["/admin", "/workspace"];
const AMBIENT = 0.35; // intensity for anything that hasn't declared a zone

// Document-space bounds of one data-backdrop section. Measured on layout change
// rather than per frame: the animation loop must not call
// getBoundingClientRect, or every frame forces a synchronous layout.
type Zone = { top: number; bottom: number; intensity: number };

// Latin + Cyrillic words render tracked-uppercase per brand type rules;
// other scripts keep their natural casing.
// Ranges are written as explicit escapes: this literal previously began
// with a raw NUL byte where the space should have been, which made git and
// grep treat the whole file as binary (unreadable diffs, silent no-match on
// searches). Verified against all 70 pillar words: identical classification.
const UPPERCASABLE = /^[\u0020-\u024F\u0400-\u04FF\s]+$/;

// x is viewport-space, y is DOCUMENT-space. The canvas is fixed to the
// viewport, so every draw subtracts scrollY to place a word. Without that the
// words hold their screen position while the page moves underneath, which
// reads as the field being stuck to the glass rather than belonging to the
// page. Vertical scrolling does not move anything horizontally, so x needs no
// equivalent.
type WordParticle = {
  text: string;
  x: number;
  y: number; // document-space
  vx: number; // px/s
  vy: number;
  size: number;
  peak: number; // peak opacity
  color: string;
  t: number; // age in s
  fadeIn: number;
  hold: number;
  fadeOut: number;
};

// y is document-space, as above.
type Dot = { x: number; y: number; vx: number; vy: number; r: number; a: number };

// How far past an edge something must go before it is recycled. Comfortably
// clears the largest glyph so nothing is seen vanishing.
const CULL_MARGIN = 60;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function ParticleField() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathRef = useRef(pathname);
  const remeasureRef = useRef<(() => void) | null>(null);

  // Mirrored into a ref so the animation loop can read the current route
  // without being torn down and restarted on every navigation. Assigned in an
  // effect rather than during render — writing a ref while rendering is not
  // safe under concurrent rendering.
  //
  // Navigation swaps the whole section list out, so the zones are re-measured
  // here too. Effects run after commit, so the incoming DOM is already live.
  useEffect(() => {
    pathRef.current = pathname;
    remeasureRef.current?.();
  }, [pathname]);

  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden) return;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const canvas = canvasEl;
    const ctx = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // next/font registers Barlow under a hashed family name — read it off the
    // body so canvas text matches the page (non-Latin scripts fall through to
    // system fonts in the stack).
    const fontFamily = getComputedStyle(document.body).fontFamily || "sans-serif";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let intensity = 0; // fades up from 0 on mount
    const words: WordParticle[] = [];
    const dots: Dot[] = [];
    let bag: number[] = []; // shuffled indices into ALL_PILLAR_WORDS
    let zones: Zone[] = [];

    // Raised ~30% alongside the zone work: opacity alone could not fix a
    // backdrop that only covered 0.3% of its own canvas.
    const counts = () =>
      w < 640
        ? { words: 16, dots: 36 }
        : w < 1024
          ? { words: 24, dots: 56 }
          : { words: 32, dots: 78 };

    function refillBag() {
      bag = ALL_PILLAR_WORDS.map((_, i) => i);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }

    function nextWordText(): string {
      const active = new Set(words.map((p) => p.text));
      for (let tries = 0; tries < 30; tries++) {
        if (bag.length === 0) refillBag();
        const entry = ALL_PILLAR_WORDS[bag.pop()!];
        const text = UPPERCASABLE.test(entry.word)
          ? entry.word.toUpperCase()
          : entry.word;
        if (!active.has(text)) return text;
      }
      return ALL_PILLAR_WORDS[0].word.toUpperCase();
    }

    function spawnWord(initial: boolean): WordParticle {
      const amber = Math.random() < 0.11;
      // Peaks are the per-word ceiling; the zone intensity scales them down
      // from there. At the original 0.05–0.11 a word in the ambient zone
      // composited to a ~7/255 lift over #080F11 — invisible unless the
      // display was at full brightness, which is how it was actually caught.
      const peak = rand(0.1, 0.19);
      const fadeIn = rand(1.8, 2.6);
      const hold = rand(4, 8);
      return {
        text: nextWordText(),
        x: rand(0.06, 0.94) * w,
        // Into the band the reader is actually looking at, not the top of the
        // document — the field only ever needs to populate one viewport.
        y: window.scrollY + rand(0.08, 0.92) * h,
        vx: rand(-3, 3),
        vy: rand(-4.5, -1),
        size: rand(11, w < 640 ? 15 : 17),
        peak: amber ? Math.min(0.28, peak * 1.8) : peak,
        color: amber ? "#FEB040" : Math.random() < 0.25 ? "#7B878F" : "#DCE4EB",
        // Reduced motion is redrawn only on scroll, never continuously, so a
        // word has to arrive already at full strength — a fade it will never
        // be given the frames to finish would just leave it invisible.
        t: reduced ? fadeIn + hold / 2 : initial ? rand(0, 8) : 0,
        fadeIn,
        hold,
        fadeOut: rand(2, 3),
      };
    }

    function spawnDot(): Dot {
      return {
        x: Math.random() * w,
        y: window.scrollY + Math.random() * h,
        vx: rand(-4, 4),
        vy: rand(-6, -1.5),
        r: rand(0.6, 1.6),
        a: rand(0.08, 0.16),
      };
    }

    function measureZones() {
      zones = [...document.querySelectorAll<HTMLElement>("[data-backdrop]")]
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            intensity: Number(el.dataset.backdrop),
          };
        })
        .filter((z) => Number.isFinite(z.intensity));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const c = counts();
      while (words.length < c.words) words.push(spawnWord(true));
      words.length = Math.min(words.length, c.words);
      while (dots.length < c.dots) dots.push(spawnDot());
      dots.length = Math.min(dots.length, c.dots);
      measureZones();
    }

    function alphaFor(p: WordParticle): number {
      if (p.t < p.fadeIn) return (p.t / p.fadeIn) * p.peak;
      if (p.t < p.fadeIn + p.hold) return p.peak;
      const out = p.t - p.fadeIn - p.hold;
      return Math.max(0, (1 - out / p.fadeOut) * p.peak);
    }

    function targetIntensity(): number {
      // The hero owns the top of the home page and fades on its own curve —
      // it is the only stretch where the field competes with real artwork.
      if (pathRef.current === "/" && window.scrollY < h) {
        return 1 - (1 - AMBIENT) * (window.scrollY / Math.max(h, 1));
      }
      // Below it, whichever zone holds the viewport's midline wins. Stepping
      // rather than interpolating between zones is fine: the easing in draw()
      // turns a step target into a ~0.4s ramp, which reads as a slow swell.
      const mid = window.scrollY + h / 2;
      const zone = zones.find((z) => mid >= z.top && mid < z.bottom);
      return zone ? zone.intensity : AMBIENT;
    }

    function draw(dt: number) {
      // Read once per frame and reuse: every position below is document-space
      // and has to be converted, and a mid-frame change would tear the field.
      const scroll = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      intensity += (targetIntensity() - intensity) * Math.min(dt * 2.5, 1);

      for (const d of dots) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        let sy = d.y - scroll;
        // Recycle at whichever edge it left — its own drift off the top, or
        // the page scrolling out from under it in either direction — so
        // density holds however far the reader has travelled.
        if (sy < -4) {
          Object.assign(d, spawnDot(), { y: scroll + h + 4 });
          sy = h + 4;
        } else if (sy > h + 4) {
          Object.assign(d, spawnDot(), { y: scroll - 4 });
          sy = -4;
        }
        if (d.x < -4) d.x = w + 4;
        if (d.x > w + 4) d.x = -4;
        ctx.globalAlpha = d.a * intensity;
        ctx.fillStyle = "#DCE4EB";
        ctx.beginPath();
        ctx.arc(d.x, sy, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (let i = 0; i < words.length; i++) {
        const p = words[i];
        p.t += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const sy = p.y - scroll;
        const expired = p.t > p.fadeIn + p.hold + p.fadeOut;
        const offscreen = sy < -CULL_MARGIN || sy > h + CULL_MARGIN;
        // Lived out its fade cycle, or the page has carried it clear of the
        // viewport. Either way nobody can see it, so recycle it into view.
        //
        // Scrolled-away words come back mid-life rather than at t=0. A fast
        // scroll retires the entire population at once, and starting all of
        // them from zero would blank the field for a whole fade-in — the
        // faster you scrolled, the emptier the page would look. Reusing the
        // same desync the initial population gets keeps it populated.
        if (expired || offscreen) {
          words[i] = spawnWord(offscreen && !expired);
          continue;
        }
        ctx.globalAlpha = alphaFor(p) * intensity;
        ctx.fillStyle = p.color;
        ctx.font = `500 ${p.size}px ${fontFamily}`;
        ctx.fillText(p.text, p.x, sy);
      }
      ctx.globalAlpha = 1;
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(tick);
    }

    resize();
    remeasureRef.current = measureZones;

    if (reduced) {
      // Static composition: words at rest, no animation loop. spawnWord puts
      // them at mid-hold in this mode, so they need no priming here.
      intensity = targetIntensity();
      draw(0);
      const onResizeStatic = () => {
        resize();
        draw(0);
      };
      // Redrawn on scroll so the words stay put relative to the page. Skipping
      // this would leave them pinned to the viewport, which is the parallax
      // this mode should least want. dt=0 keeps every particle at rest — the
      // only thing that changes between frames is the scroll offset. Coalesced
      // through rAF so a flick of the wheel cannot queue a redraw per event.
      let pending = 0;
      const onScrollStatic = () => {
        if (pending) return;
        pending = requestAnimationFrame(() => {
          pending = 0;
          draw(0);
        });
      };
      window.addEventListener("resize", onResizeStatic);
      window.addEventListener("scroll", onScrollStatic, { passive: true });
      return () => {
        cancelAnimationFrame(pending);
        window.removeEventListener("resize", onResizeStatic);
        window.removeEventListener("scroll", onScrollStatic);
        remeasureRef.current = null;
      };
    }

    // Zone bounds move whenever the document reflows — a lazy image landing,
    // a font swapping in, the carousel filling. Watching the body catches all
    // of it without the loop having to re-measure per frame.
    const layoutObserver = new ResizeObserver(measureZones);
    layoutObserver.observe(document.body);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      layoutObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      remeasureRef.current = null;
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // h/w-full are load-bearing: <canvas> is a replaced element, so under
      // position:fixed with width:auto the insets do NOT stretch it — it takes
      // its intrinsic size, i.e. the width/height attributes, which are set to
      // viewport x DPR. It was therefore being displayed at 2x on a retina
      // screen with only its top-left quarter on screen, while the context is
      // scaled by DPR on the assumption of a viewport-sized box.
      className="fixed inset-0 h-full w-full z-0 pointer-events-none"
    />
  );
}
