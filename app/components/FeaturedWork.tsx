import Image from "next/image";
import Link from "next/link";
import { getProject } from "../lib/publicContent";

// One project hero-sized, the other two as rows. Same three projects the
// card grid showed; one image that matters.
const FEATURED = "nature-and-resilience";
const OTHERS = ["conservation-diaries", "panasonic-lumix"];

export default function FeaturedWork() {
  const featured = getProject(FEATURED);
  if (!featured?.image) return null;
  const others = OTHERS.map(getProject).filter((p) => p !== undefined);
  return (
    <section
      className="band section-space"
      id="selected-work"
      aria-labelledby="selected-work-title"
      style={{ "--glow-x": "12%", "--glow-y": "34%" } as React.CSSProperties}
    >
      <div className="site-width">
        <p className="eyebrow accent" id="selected-work-title">Selected work</p>
        <Link href={`/work/${featured.slug}`} className="feature-frame" data-track="project_view">
          <Image
            src={featured.image}
            alt={featured.imageAlt || ""}
            fill
            sizes="(max-width: 760px) 100vw, 1280px"
          />
          <span className="feature-copy">
            <span className="eyebrow">{featured.category}</span>
            <span className="feature-title">{featured.title}</span>
            <span className="feature-client">{featured.client}</span>
            <span className="feature-summary">{featured.summary}</span>
            <span className="text-link">
              Inside the film <span aria-hidden="true">↗</span>
            </span>
          </span>
        </Link>
        <div className="feature-rows">
          {others.map((p) => (
            <Link href={`/work/${p.slug}`} key={p.slug} className="feature-row" data-track="project_view">
              <span className={`feature-thumb${p.image ? "" : " feature-thumb-brand"}`}>
                {p.image ? (
                  <Image src={p.image} alt="" fill sizes="132px" />
                ) : (
                  <Image src={p.logo!} alt="" width={200} height={72} unoptimized />
                )}
              </span>
              <span>
                <b>{p.title}</b>
                <span>
                  {p.client} · {p.category}
                  {p.status ? ` · ${p.status}` : ""}
                </span>
              </span>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <div className="feature-foot">
          <p className="small-copy">Eight case studies and nineteen films in the library.</p>
          <Link href="/library" className="text-link">
            All work <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
