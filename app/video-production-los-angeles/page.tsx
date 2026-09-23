import Image from "next/image";
import Link from "next/link";
import BusinessAddress from "../components/BusinessAddress";
import InquiryCTA, { CTA_STILL } from "../components/InquiryCTA";
import ProjectCard from "../components/ProjectCard";
import ServiceShowcase from "../components/ServiceShowcase";
import {
  BOOKING_URL,
  LOCATION_PATH,
  LOCATION_STATEMENT,
  STUDIO_EMAIL,
  STUDIO_MAPS_URL,
  projects,
  services,
} from "../lib/publicContent";
import {
  ORGANIZATION_ID,
  breadcrumbs,
  faqPage,
  jsonLd,
  pageMetadata,
  LOCATION_URL,
} from "../lib/seo";

export const metadata = pageMetadata(
  "Los Angeles Video Production, Valencia CA",
  "Documentary and impact video production in Valencia, California, serving Los Angeles County and worldwide: documentaries, NGO and brand films, and editing.",
  LOCATION_PATH,
  "los-angeles",
);

// Every answer here is written to stand alone: search engines and AI
// assistants quote these verbatim when someone asks who makes documentary
// or nonprofit video in Los Angeles.
const faq = [
  {
    question: "Where is Ayni Studios located?",
    answer:
      "Ayni Studios is at 28130 Avenue Crocker, Unit 318, Valencia, CA 91355. Valencia is part of the city of Santa Clarita in Los Angeles County, north of the San Fernando Valley off Interstate 5. Meetings are by appointment, in person or online.",
  },
  {
    question: "Which areas of Los Angeles does Ayni Studios serve?",
    answer:
      "We film across Los Angeles County: the Santa Clarita Valley, the San Fernando Valley, downtown Los Angeles, the Westside, and the South Bay, as well as Ventura and Orange County by arrangement. Our client work has also taken us to the United Arab Emirates, Peru, and South Africa, and we produce remotely with existing footage, filming kits, and local filmmakers.",
  },
  {
    question: "What kinds of video does Ayni Studios produce?",
    answer:
      "Documentary films and series, NGO and nonprofit programme films, environmental and conservation stories, brand and impact content, editing and post-production from footage you already have, and legacy films that preserve a person’s or an organization’s story.",
  },
  {
    question: "Is Ayni Studios a documentary company or a brand video agency?",
    answer:
      "Both, with a documentary approach. We bring interviews, field production, and editorial judgment to every project, whether the result is an independent documentary, a nonprofit campaign film, or a brand story such as our collaboration with Panasonic Global for the LUMIX channel.",
  },
  {
    question: "How do we start a video project with Ayni Studios in Los Angeles?",
    answer:
      "Book a 15-minute conversation through the booking link on this site, or email humanity@ayni-studios.com. Tell us what you are making, who it should reach, and any dates that matter. A finished brief is not required.",
  },
];

export default function LosAngelesPage() {
  const featured = projects.filter((p) => p.kind !== "sample").slice(0, 3);
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": LOCATION_URL,
    url: LOCATION_URL,
    name: "Los Angeles video production company — Ayni Studios, Valencia CA",
    about: { "@id": ORGANIZATION_ID },
    mainEntity: { "@id": ORGANIZATION_ID },
  };
  return (
    <article className="public-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPage(faq)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Video production in Los Angeles", path: LOCATION_PATH },
            ]),
          ),
        }}
      />
      <div className="site-width">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Los Angeles</span>
        </nav>
        <header className="page-heading">
          <p className="eyebrow accent">Valencia, CA · Los Angeles County</p>
          <h1>
            Documentary and impact
            <br />
            video production in Los Angeles.
          </h1>
          <p className="body-copy">{LOCATION_STATEMENT}</p>
        </header>
        <div className="project-masthead">
          <Image
            src="/brand/hero/hero-1-1920.webp"
            alt="Women listening to a political candidate speak at night, from Ayni Studios’ documentary The Bridge to Nowhere"
            fill
            priority
            sizes="100vw"
          />
        </div>

        <section className="editorial-grid section-space" aria-labelledby="la-intro">
          <div>
            <p className="eyebrow accent mb-5">A Los Angeles studio with a global record</p>
            <h2 id="la-intro">
              Made here.
              <br />
              Shown around the world.
            </h2>
          </div>
          <div className="editorial-copy">
            <p>
              Ayni Studios is an independent production company in Valencia,
              at the northern edge of Los Angeles County. From here we produce
              documentaries, films for NGOs and conservation organizations,
              brand and impact content, and legacy films, and we edit footage
              that clients already have.
            </p>
            <p>
              Our work has been shown at COP30 and the IUCN World Conservation
              Congress 2025, and our documentary <em>They Live in Our World</em>{" "}
              was selected for UNDP’s Nature for Life Hub. Clients include
              Panasonic Global, Emirates Nature–WWF, Seafood Souq, Goumbook,
              and Amazonia Expeditions.
            </p>
            <p>
              In Los Angeles we can meet in person, scout and film on
              location, and bring the same documentary approach to a nonprofit
              programme film, a founder’s story, or a brand campaign.
            </p>
            <Link href="/about" className="text-link">
              Meet the studio <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="pb-20" aria-labelledby="la-services">
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">What we make</p>
              <h2 id="la-services">
                Video production services
                <br />
                for Los Angeles organizations.
              </h2>
            </div>
            <p className="body-copy max-w-sm">
              For nonprofits, NGOs, universities and institutions, conservation
              groups, brands, and families and founders preserving a legacy.
            </p>
          </div>
          <ServiceShowcase items={services.slice(0, 6)} />
        </section>

        <section className="section-space border-t border-[#28363a]" aria-labelledby="la-facts">
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">Where to find us</p>
              <h2 id="la-facts">Valencia, California.</h2>
            </div>
          </div>
          <div className="location-facts">
            <div className="location-fact">
              <p className="eyebrow accent">Studio address</p>
              <BusinessAddress />
              <a
                href={STUDIO_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Open in Google Maps ↗
              </a>
            </div>
            <div className="location-fact">
              <p className="eyebrow accent">Service area</p>
              <ul>
                <li>Santa Clarita Valley and Valencia</li>
                <li>San Fernando Valley</li>
                <li>Los Angeles and Los Angeles County</li>
                <li>Ventura and Orange County by arrangement</li>
                <li>Worldwide, on location or remotely</li>
              </ul>
            </div>
            <div className="location-fact">
              <p className="eyebrow accent">Talk to the studio</p>
              <p>
                <a href={`mailto:${STUDIO_EMAIL}`} data-track="email_click">
                  {STUDIO_EMAIL}
                </a>
                <br />
                <a href="tel:+18185275760" data-track="phone_click">
                  +1 818 527 5760
                </a>
              </p>
              <a href={BOOKING_URL} className="text-link" data-track="booking_click">
                Book a 15-minute meeting ↗
              </a>
            </div>
          </div>
        </section>

        <section className="pb-20" aria-labelledby="la-work">
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">Selected work</p>
              <h2 id="la-work">Films we have made.</h2>
            </div>
            <Link href="/library" className="text-link">
              All work <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="project-grid">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        <section className="pb-24 faq-list" aria-labelledby="la-faq">
          <h2 id="la-faq" className="mb-8">
            Questions about working with us in Los Angeles
          </h2>
          {faq.map((item) => (
            <div className="question-block" key={item.question}>
              <h3>{item.question}</h3>
              <p className="body-copy">{item.answer}</p>
            </div>
          ))}
        </section>
      </div>
      <InquiryCTA title="Making something in Los Angeles?" image={CTA_STILL} />
    </article>
  );
}
