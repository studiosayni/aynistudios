"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { services, serviceArt } from "../lib/publicContent";

// The numbered service list with one still beside it that follows the
// pointer down the list. Hover, focus or tap a row to change the frame;
// every row is still a plain link to its service page.
const captions: Record<string, string> = {
  "documentary-production": "Amazonia Expeditions · Peruvian Amazon",
  "brand-and-impact-content": "Leaders of Change · Emirates Nature–WWF",
  "editing-and-post-production": "teamLab · Tokyo",
  "ngo-video-production": "La Isla de los Monos · Peruvian Amazon",
  "environmental-conservation-filmmaking": "Logging on the riverbank · Peruvian Amazon",
  "legacy-films": "The Surgeon Who Crossed the Sea · Legacy film",
};

// `variant="wide"` flips the balance: the still becomes the wider column at
// 3:2 (landscape footage crops natively) and the list tightens to match its
// height, so nothing needs to be sticky.
export default function ServiceReveal({
  count = 6,
  variant = "portrait",
}: {
  count?: number;
  variant?: "portrait" | "wide";
}) {
  const items = services.slice(0, count);
  const [active, setActive] = useState(0);
  const wide = variant === "wide";
  return (
    <div className={`svc-grid${wide ? " svc-grid-wide" : ""}`}>
      <div className="svc-stage" aria-hidden="true">
        {items.map((s, i) => {
          const art = serviceArt[s.slug];
          return art ? (
            <Image
              key={s.slug}
              src={wide ? (art.wide ?? art.image) : art.image}
              alt=""
              fill
              sizes={wide ? "(max-width: 860px) 100vw, 700px" : "(max-width: 860px) 100vw, 560px"}
              className={i === active ? "on" : undefined}
              priority={i === 0}
            />
          ) : null;
        })}
        <span className="svc-cap">{captions[items[active].slug] ?? items[active].title}</span>
      </div>
      <div className="svc-list">
        {items.map((s, i) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className={`svc-row${i === active ? " on" : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onTouchStart={() => setActive(i)}
            data-track="service_view"
          >
            <span className="svc-num">{s.number}</span>
            <span>
              <b>{s.title}</b>
              <span className="svc-desc">{s.short}</span>
            </span>
            <span className="svc-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
