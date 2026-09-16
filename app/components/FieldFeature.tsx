import Image from "next/image";
import Link from "next/link";
import { NATURE_FOR_LIFE } from "../lib/publicContent";
import { productionMethods } from "../lib/storytellingContent";

// One full-bleed frame carries recognition and place; the four ways of
// working follow as a plain list. Replaces the separate field section,
// recognition grid and second logo row.
export default function FieldFeature() {
  return (
    <>
      <section className="field-feature" aria-labelledby="field-feature-title">
        <Image
          src="/brand/hero/hero-3-1920.webp"
          alt="A child at a sacred Andean gathering below snow-capped peaks, from The Sacred Ascent"
          fill
          sizes="100vw"
        />
        <div className="site-width field-feature-in">
          <div className="field-feature-copy">
            <p className="eyebrow accent">Stories on a global stage</p>
            <h2 id="field-feature-title">Work that travels beyond the screen.</h2>
            <p className="body-copy">
              Our BCRN programme film was shown at COP30 and at the UAE
              pavilion of the IUCN World Conservation Congress 2025.{" "}
              <em>They Live in Our World</em>, our documentary about orphaned
              monkeys and their caretakers in the Amazon, was selected for
              UNDP’s Nature for Life Hub 2024.
            </p>
            <div className="field-marks">
              <Image src="/brand/partners/cop30.webp" alt="COP30" width={160} height={90} unoptimized />
              <Image src="/brand/partners/iucn.webp" alt="IUCN World Conservation Congress" width={160} height={90} unoptimized />
              <span className="field-mark-nfl">
                <Image src="/brand/recognition/undp.webp" alt="UNDP" width={127} height={256} unoptimized />
                <Image src="/brand/recognition/nature-for-life.svg" alt="Nature for Life Hub" width={463} height={111} unoptimized />
              </span>
            </div>
            <div className="button-row mt-6">
              <Link className="text-link" href="/work/nature-and-resilience">
                Inside the BCRN programme film <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href={`/films/${NATURE_FOR_LIFE.filmSlug}`}>
                Watch They Live in Our World <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
        <span className="field-feature-cap">The Sacred Ascent · a sacred Andean event, UNESCO heritage</span>
      </section>
      <section className="methods-list section-space" aria-labelledby="methods-title">
        <div className="site-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">More ways to make it</p>
              <h2 id="methods-title">Where a crew can’t go, the story still gets made.</h2>
            </div>
            <Link className="text-link" href="/services/remote-video-production">
              Explore flexible production <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ol className="methods-row">
            {productionMethods.map((m, i) => (
              <li key={m.title}>
                <span className="svc-num">0{i + 1}</span>
                <b>{m.title}</b>
                <p className="body-copy">{m.description}</p>
                {i === 2 && (
                  <Link href="/work/audio-to-animated-legacy-film" className="text-link mt-3">
                    See a narrated example <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
          <Link className="text-link mt-8" href="/guides/affordable-video-production">
            How to plan an affordable production <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
