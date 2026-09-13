import { BOOKING_URL } from "../lib/publicContent";
import Link from "next/link";
import { bleedSrcSet } from "../lib/bleedImage";
import HeroAnimation from "./HeroAnimation";

export default function HeroSection() {
  return (
    <section className="public-hero">
      {/* The still backdrop keeps the brand film as the hero's only motion. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-photograph"
        src="/brand/hero/hero-34.jpg"
        srcSet={bleedSrcSet("/brand/hero/hero-34")}
        sizes="100vw"
        fetchPriority="high"
        decoding="async"
        alt=""
        width={1920}
        height={1080}
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="site-width hero-content">
        <div className="hero-main">
          <div className="hero-copy">
            <p className="eyebrow accent">
              Independent studio · Global perspective
            </p>
            <h1>
              Real stories.
              <br />
              Lasting <em>impact.</em>
            </h1>
            <p className="hero-description">
              Documentary films and impact videos for organizations changing the
              world.
            </p>
            <p className="hero-detail">
              From field production to the final edit, we help conservation
              organizations, institutions, and brands tell stories that move people.
            </p>
            <div className="button-row">
              <a href={BOOKING_URL} className="button" data-track="booking_click">
                Start a project <span aria-hidden="true">↗</span>
              </a>
              <Link href="/library" className="text-link">
                Explore our work <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
          <HeroAnimation />
        </div>
        <div className="hero-baseline">
          <span>From the field to the final frame.</span>
          <span>Planet · Humanity · Future · Wonder · Truth</span>
        </div>
      </div>
    </section>
  );
}
