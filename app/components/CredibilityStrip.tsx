import Image from "next/image";
import Link from "next/link";
import { NATURE_FOR_LIFE } from "../lib/publicContent";
import { partners } from "./PartnerLogos";

// The quiet transition out of the hero: partner marks knocked to monochrome
// on the dark ground, and the three showcases as one sentence. The tiled
// version (PartnerLogos) still runs on the about page.
export default function CredibilityStrip() {
  return (
    <section className="cred-strip" aria-label="Clients and recognition">
      <div className="site-width cred-inner">
        <ul className="cred-logos">
          {partners.map((p) => {
            const logo = (
              <Image
                src={`/brand/partners/${p.file}`}
                alt={p.name}
                width={240}
                height={72}
                className="cred-logo"
                unoptimized
              />
            );
            return (
              <li key={p.name}>
                {p.href ? (
                  <Link href={p.href} aria-label={`Explore our work with ${p.name}`}>
                    {logo}
                  </Link>
                ) : (
                  logo
                )}
              </li>
            );
          })}
        </ul>
        <p className="cred-shown">
          Shown at <Link href="/work/nature-and-resilience">COP30</Link> ·{" "}
          <Link href="/work/nature-and-resilience">IUCN World Congress 2025</Link> ·{" "}
          <Link href={`/films/${NATURE_FOR_LIFE.filmSlug}`}>UNDP Nature for Life Hub</Link>
        </p>
      </div>
    </section>
  );
}
