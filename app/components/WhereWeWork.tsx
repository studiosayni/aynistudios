import Image from "next/image";
import Link from "next/link";

// Moved off the homepage in the cinema cut: the two remaining film frames
// and the six-still grid, now a "where we work" block on the about page.
const frames = [
  {
    src: "/brand/hero/hero-1-1920.webp",
    alt: "Women listening to a political candidate speak at night, from The Bridge to Nowhere",
    title: "The Bridge to Nowhere",
    detail: "Women listen to a candidate promise a new future",
    position: "center 45%",
    href: "/films/the-bridge-to-nowhere",
  },
  {
    src: "/brand/hero/hero-10-1920.webp",
    alt: "The family of an oyster diver seated together at a doorway, from Casting New Lines",
    title: "Casting New Lines",
    detail: "An oyster diver’s family in the Gulf",
    position: "center 30%",
  },
];
const stills = [
  { src: "/brand/hero/hero-18-960.webp", alt: "Masked dancers in woven ponchos at an Andean festival", position: "center 40%" },
  { src: "/brand/hero/hero-5-960.webp", alt: "Aerial view of mangrove channels and turquoise water", position: "center" },
  { src: "/brand/hero/hero-2-960.webp", alt: "A farmer holding papaya fruit beneath broad green leaves", position: "center 40%" },
  { src: "/brand/hero/hero-9-960.webp", alt: "A woman resting beside bundles of woven cloth in the Andes", position: "center 45%" },
  { src: "/brand/hero/hero-26-960.webp", alt: "A marine researcher in a sun hat looking out over the sea", position: "center 30%" },
  { src: "/brand/hero/hero-6-960.webp", alt: "A man in a kandura standing in a young palm plantation", position: "center 55%" },
];

export default function WhereWeWork() {
  return (
    <section className="section-space border-t border-[#28363a]" aria-labelledby="where-we-work">
      <div className="section-heading">
        <div>
          <p className="eyebrow accent">Where we work</p>
          <h2 id="where-we-work">The Amazon, the Andes, the Gulf.</h2>
        </div>
        <p className="body-copy max-w-sm">
          Frames from the field: Peru, the United Arab Emirates, and the
          communities and ecosystems between them.
        </p>
      </div>
      <div className="field-frames">
        {frames.map((f) => (
          <figure key={f.src} className="field-frame">
            <Image src={f.src} alt={f.alt} fill sizes="(max-width: 760px) 100vw, 640px" style={{ objectPosition: f.position }} />
            <figcaption>
              <span className="field-frame-text">
                <b>{f.title}</b>
                <span>{f.detail}</span>
              </span>
              {f.href && <span className="field-frame-watch">Watch the film ↗</span>}
            </figcaption>
            {f.href && <Link href={f.href} className="field-frame-link" aria-label={`Watch ${f.title}`} />}
          </figure>
        ))}
      </div>
      <div className="still-strip" role="group" aria-label="Stills from the field">
        {stills.map((s) => (
          <div className="still-cell" key={s.src}>
            <Image src={s.src} alt={s.alt} fill sizes="(max-width: 760px) 33vw, 200px" style={{ objectPosition: s.position }} />
          </div>
        ))}
      </div>
    </section>
  );
}
