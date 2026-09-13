import Link from "next/link";
import Image from "next/image";
import HeroSection from "./components/HeroSection";
import PartnerLogos from "./components/PartnerLogos";
import ProjectCard from "./components/ProjectCard";
import InquiryCTA from "./components/InquiryCTA";
import { projects, services } from "./lib/publicContent";
import { jsonLd, organization, pageMetadata } from "./lib/seo";

export const metadata = pageMetadata(
  "Documentary & Impact Video Production",
  "Ayni Studios produces documentary films, brand and impact content, and edits for organizations changing the world. Based in Los Angeles, working globally.",
  "/",
);

export default function HomePage() {
  return (
    <div className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organization) }}
      />
      <HeroSection />
      <PartnerLogos />
      <section className="section-space site-width" id="selected-work">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">Selected work</p>
            <h2>
              Good stories.
              <br />
              Real-world purpose.
            </h2>
          </div>
          <Link href="/library" className="text-link">
            All work <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <section className="services-section section-space">
        <div className="site-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">What we do</p>
              <h2>
                From first idea
                <br />
                to final frame.
              </h2>
            </div>
            <p className="body-copy max-w-sm">
              A production partner for documentary stories, brand campaigns, and
              the footage you already have.
            </p>
          </div>
          <div className="service-list">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="service-row"
              >
                <span className="service-number">{s.number}</span>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space site-width">
        <div className="proof-layout">
          <div>
            <p className="eyebrow accent">Stories on a global stage</p>
            <h2>
              Work that travels
              <br />
              beyond the screen.
            </h2>
            <p className="body-copy mt-6">
              Our work has been showcased at COP30 and the IUCN World Congress.
              Behind each appearance is a story, and the people who made it
              possible.
            </p>
            <Link className="text-link mt-7" href="/work/nature-and-resilience">
              Inside the BCRN programme film <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="event-proof">
            <p className="eyebrow">Work showcased at</p>
            <div className="event-logos">
              <Image
                src="/brand/partners/cop30.webp"
                width={160}
                height={90}
                alt="COP30"
                unoptimized
              />
              <Image
                src="/brand/partners/iucn.webp"
                width={160}
                height={90}
                alt="IUCN World Congress"
                unoptimized
              />
            </div>
            <p>
              For BCRN, we brought footage from multiple countries into one
              story about human resilience and nature-led solutions, shown at
              both COP30 and IUCN.
            </p>
            <span className="small-copy">
              COP30 · UAE pavilion at IUCN World Congress 2025
            </span>
          </div>
        </div>
      </section>
      <section className="studio-preview">
        <div className="studio-preview-image">
          <Image
            src="/brand/hero/hero-7-1280.webp"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            alt="A gathering in the field, from Ayni Studios’ editorial photography"
          />
        </div>
        <div className="studio-preview-copy">
          <p className="eyebrow accent">The meaning behind the name</p>
          <h2>
            Give back
            <br />
            what you receive.
          </h2>
          <p className="body-copy">
            Ayni is an Andean principle of reciprocity. It shapes how we see our
            work: stories made in service of people, ecosystems, and a shared
            future.
          </p>
          <Link href="/about" className="text-link mt-7">
            Meet the studio <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <InquiryCTA />
    </div>
  );
}
