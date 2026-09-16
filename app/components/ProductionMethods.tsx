import Link from "next/link";
import { productionMethods } from "../lib/storytellingContent";

// The audio-led animation card is the one with a finished example behind it,
// so it carries the light "featured" treatment and gives the grid a focal
// point.
const FEATURED_INDEX = 2;

export default function ProductionMethods({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className="section-space production-methods section-glow section-glow-teal">
      <div className="section-heading">
        <div>
          <p className="eyebrow accent">Flexible ways to work together</p>
          <h2>A good story.<br />More ways to make it.</h2>
        </div>
        <p className="body-copy max-w-sm">
          Existing footage, filming kits, audio-led animation, and local filmmakers
          can reduce travel and production costs, simplify schedules, and make
          recurring content easier to produce.
        </p>
      </div>
      <div className="method-grid">
        {productionMethods.map((method, index) => (
          <article
            className={`method-card${index === FEATURED_INDEX ? " method-card-featured" : ""}`}
            key={method.title}
          >
            <span className="eyebrow accent">0{index + 1}</span>
            <h3>{method.title}</h3>
            <p className="body-copy">{method.description}</p>
            <p className="method-benefit">{method.benefit}</p>
            {detailed && <p className="small-copy">{method.consideration}</p>}
            {index === FEATURED_INDEX && (
              <Link href="/work/audio-to-animated-legacy-film" className="text-link mt-5">
                See a narrated animation example ↗
              </Link>
            )}
          </article>
        ))}
      </div>
      <p className="body-copy mt-7 max-w-3xl">
        We match the method to your story, material, budget, and deadline.
        Clear capture requirements and editorial review help protect quality;
        cost and turnaround are agreed for each project.
      </p>
      {!detailed && (
        <div className="button-row mt-6">
          <Link className="text-link" href="/services/remote-video-production">
            Explore flexible production options ↗
          </Link>
          <Link className="text-link" href="/guides/affordable-video-production">
            How to plan an affordable production ↗
          </Link>
        </div>
      )}
    </section>
  );
}
