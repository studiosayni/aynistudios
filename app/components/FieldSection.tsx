import Image from "next/image";
import Link from "next/link";
import { productionMethods } from "../lib/storytellingContent";

// Replaces the plain methods grid on the homepage: the three strongest
// editorial stills open the section as anamorphic frames, the four ways of
// working sit in one row beneath. ProductionMethods still renders the
// detailed version on the remote-production service page.

// Captions: place and occasion for each frame. Confirm with the studio
// before changing; anything not certain is left out rather than guessed.
const frames = [
  {
    src: "/brand/hero/hero-3-1920.webp",
    alt: "A child in a snowsuit at a high-altitude gathering below snow-capped Andean peaks",
    place: "The high Andes",
    detail: "A gathering below the snowline",
    tint: "#3d8f9c",
    position: "center 55%",
    wide: true,
  },
  {
    src: "/brand/hero/hero-1-1920.webp",
    alt: "Three women watching a screening at night, their faces lit by the screen",
    place: "After dark",
    detail: "A community screening",
    tint: "#d8497e",
    position: "center 45%",
    wide: false,
  },
  {
    src: "/brand/hero/hero-10-1920.webp",
    alt: "An Emirati family of four generations seated together at a doorway",
    place: "United Arab Emirates",
    detail: "A family portrait",
    tint: "#c9453b",
    position: "center 30%",
    wide: false,
  },
];

const labels = ["Existing footage", "Filming kit", "Audio-led animation", "Local filmmakers"];
const FEATURED_INDEX = 2;

export default function FieldSection() {
  return (
    <section
      className="band field-section section-space"
      style={{ "--accent": "#8fb6d6", "--glow-x": "88%", "--glow-y": "18%" } as React.CSSProperties}
      aria-labelledby="field-title"
    >
      <div className="site-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">In the field</p>
            <h2 id="field-title">
              A good story.
              <br />
              More ways to make it.
            </h2>
          </div>
          <p className="body-copy max-w-sm">
            Where a crew can go, we go. Where it can’t, existing footage,
            filming kits, audio-led animation, and local filmmakers get the
            story made.
          </p>
        </div>
        <div className="field-frames">
          {frames.map((frame, index) => (
            <figure
              key={frame.src}
              className={`field-frame${frame.wide ? " field-frame-wide" : ""}`}
              style={{ "--tint": frame.tint } as React.CSSProperties}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                priority={index === 0}
                sizes={frame.wide ? "(max-width: 760px) 100vw, 1280px" : "(max-width: 760px) 100vw, 640px"}
                style={{ objectPosition: frame.position }}
              />
              <figcaption>
                <b>{frame.place}</b>
                <span>{frame.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="method-row">
          {productionMethods.map((method, index) => (
            <article
              className={`method-card method-card-compact${index === FEATURED_INDEX ? " method-card-featured" : ""}`}
              key={method.title}
            >
              <span className="eyebrow accent">{labels[index]}</span>
              <h3>{method.title}</h3>
              <p className="body-copy">{method.description}</p>
              {index === FEATURED_INDEX ? (
                <Link href="/work/audio-to-animated-legacy-film" className="method-benefit method-link">
                  See a narrated animation example ↗
                </Link>
              ) : (
                <p className="method-benefit">{method.benefit}</p>
              )}
            </article>
          ))}
        </div>
        <div className="button-row mt-8">
          <Link className="text-link" href="/services/remote-video-production">
            Explore flexible production options ↗
          </Link>
          <Link className="text-link" href="/guides/affordable-video-production">
            How to plan an affordable production ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
