import Image from "next/image";
import Link from "next/link";
import RecognitionLogos from "./RecognitionLogos";

const partners = [
  {
    name: "Panasonic Global",
    file: "panasonic.webp",
    href: "/work/panasonic-lumix",
  },
  {
    name: "Emirates Nature–WWF",
    file: "enwwf.webp",
    href: "/work/conservation-diaries",
  },
  {
    name: "IFRC and WWF",
    file: "ifrc-wwf.webp",
    href: "/work/nature-and-resilience",
  },
  { name: "Goumbook", file: "goumbook.webp", href: "/work/goumbook-sustainability-stories" },
  { name: "Seafood Souq", file: "sfs.webp", href: "/work/seafood-souq-south-africa" },
  { name: "teamLab", file: "teamlab.webp" },
];
export default function PartnerLogos({ showRecognition = false }: { showRecognition?: boolean }) {
  return (
    <section className="partner-section" aria-labelledby="partners-title">
      <div className="site-width">
        <div className="section-topline">
          <h2 id="partners-title" className="eyebrow">
            Selected clients & collaborators
          </h2>
          <span className="small-copy">
            Different missions. A shared belief in stories.
          </span>
        </div>
        <div className="partner-grid">
          {partners.map((p) => {
            const logo = (
              <Image
                src={`/brand/partners/${p.file}`}
                alt={p.name}
                width={240}
                height={72}
                className="partner-logo"
                unoptimized
              />
            );
            return p.href ? (
              <Link
                className="partner-tile"
                href={p.href}
                key={p.name}
                aria-label={`Explore our work with ${p.name}`}
              >
                {logo}
              </Link>
            ) : (
              <div className="partner-tile" key={p.name}>
                {logo}
              </div>
            );
          })}
        </div>
        {showRecognition && <RecognitionLogos />}
      </div>
    </section>
  );
}
