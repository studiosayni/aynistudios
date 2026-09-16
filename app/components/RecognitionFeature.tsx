import Image from "next/image";
import Link from "next/link";
import { NATURE_FOR_LIFE } from "../lib/publicContent";

// One recognition section for the homepage, replacing the separate
// "Work that travels" and "Selected for UNDP" blocks: a still from They Live
// in Our World, the three event marks, and a link into each story.
const gridStills = [
  {
    src: "/brand/hero/hero-18-960.webp",
    alt: "Masked dancers in woven ponchos at an Andean festival",
    position: "center 40%",
  },
  {
    src: "/brand/hero/hero-5-960.webp",
    alt: "Aerial view of mangrove channels and turquoise water",
    position: "center",
  },
  {
    src: "/brand/hero/hero-2-960.webp",
    alt: "A farmer holding papaya fruit beneath broad green leaves",
    position: "center 40%",
  },
  {
    src: "/brand/hero/hero-9-960.webp",
    alt: "A woman resting beside bundles of woven cloth in the Andes",
    position: "center 45%",
  },
  {
    src: "/brand/hero/hero-26-960.webp",
    alt: "A marine researcher in a sun hat looking out over the sea",
    position: "center 30%",
  },
  {
    src: "/brand/hero/hero-6-960.webp",
    alt: "A man in a kandura standing in a young palm plantation",
    position: "center 55%",
  },
];

export default function RecognitionFeature() {
  return (
    <section
      className="band recognition-feature section-space"
      aria-labelledby="recognition-feature-title"
    >
      <div className="site-width recognition-feature-inner">
        {/* Six editorial stills as a 2×3 grid: the range of places the work
            comes from, rather than one frame. Cells are ~300px wide, so the
            640/960 variants do the work. */}
        <div className="recognition-feature-art" role="group" aria-label="Stills from the field">
          {gridStills.map((still) => (
            <div className="recognition-cell" key={still.src}>
              <Image
                src={still.src}
                alt={still.alt}
                fill
                sizes="(max-width: 760px) 50vw, 300px"
                style={{ objectPosition: still.position }}
              />
            </div>
          ))}
        </div>
        <div className="recognition-feature-copy">
          <p className="eyebrow accent">Stories on a global stage</p>
          <h2 id="recognition-feature-title">
            Work that travels
            <br />
            beyond the screen.
          </h2>
          <p className="body-copy mt-6">
            Our BCRN programme film, made with Emirates Nature–WWF, WWF, and
            IFRC, brought footage from multiple countries into one story about
            nature-led resilience. It was shown at COP30 and at the UAE
            pavilion of the IUCN World Conservation Congress 2025.
          </p>
          <p className="body-copy mt-4">
            Our documentary <em>They Live in Our World</em>, about orphaned
            monkeys and their caretakers in the Amazon, was selected for the
            United Nations Development Programme’s Nature for Life Hub 2024.
          </p>
          <div className="recognition-marks">
            <Link
              href="/work/nature-and-resilience"
              className="recognition-link"
              aria-label="COP30 — explore our BCRN programme film"
            >
              <span className="recognition-art">
                <Image src="/brand/partners/cop30.webp" alt="COP30" width={160} height={90} unoptimized />
              </span>
              <span>COP30</span>
            </Link>
            <Link
              href="/work/nature-and-resilience"
              className="recognition-link"
              aria-label="IUCN World Conservation Congress — explore our BCRN programme film"
            >
              <span className="recognition-art">
                <Image src="/brand/partners/iucn.webp" alt="IUCN World Conservation Congress" width={160} height={90} unoptimized />
              </span>
              <span>IUCN World Congress 2025</span>
            </Link>
            <Link
              href={`/films/${NATURE_FOR_LIFE.filmSlug}`}
              className="recognition-link"
              aria-label="UNDP’s Nature for Life Hub — watch They Live in Our World"
            >
              <span className="recognition-art recognition-art-nature">
                <span className="recognition-undp">
                  <Image src="/brand/recognition/undp.webp" alt="UNDP" width={127} height={256} unoptimized />
                </span>
                <Image src="/brand/recognition/nature-for-life.svg" alt="Nature for Life Hub" width={463} height={111} unoptimized />
              </span>
              <span>UNDP Nature for Life Hub 2024</span>
            </Link>
          </div>
          <div className="button-row mt-8">
            <Link className="text-link" href="/work/nature-and-resilience">
              Inside the BCRN programme film <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href={`/films/${NATURE_FOR_LIFE.filmSlug}`}>
              Watch They Live in Our World <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
