import NatureForLifeRecognition from "../../components/NatureForLifeRecognition";
import ProductionMethods from "../../components/ProductionMethods";
import { serviceQuestions } from "../../lib/storytellingContent";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  services,
  serviceArt,
  getService,
  getProject,
  LOCATION_PATH,
  SERVICE_AREAS,
  SITE_URL,
  BOOKING_URL,
} from "../../lib/publicContent";
import { ORGANIZATION_ID, breadcrumbs, faqPage, jsonLd, pageMetadata } from "../../lib/seo";
import ProjectCard from "../../components/ProjectCard";
import InquiryCTA, { CTA_STILL } from "../../components/InquiryCTA";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = getService((await params).slug);
  return s
    ? pageMetadata(s.title, s.description, `/services/${s.slug}`, s.slug)
    : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${s.slug}#service`,
    areaServed: SERVICE_AREAS,
    serviceType: s.title,
    name: s.title,
    description: s.description,
    url: `${SITE_URL}/services/${s.slug}`,
    ...(serviceArt[s.slug]
      ? { image: serviceArt[s.slug].wide ?? serviceArt[s.slug].image }
      : {}),
    provider: {
      "@type": ["Organization", "LocalBusiness"],
      "@id": ORGANIZATION_ID,
      name: "Ayni Studios",
      url: SITE_URL,
    },
  };
  const art = serviceArt[s.slug];
  // The same pairs the "Planning your project" section shows, in order.
  const questions = [
    { question: s.question, answer: s.answer },
    ...(serviceQuestions[s.slug] || []),
  ];
  return (
    <article className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPage(questions)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([
        { name: "Home", path: "/" }, { name: "Services", path: "/services" },
        { name: s.title, path: `/services/${s.slug}` },
      ])) }} />
      <div className="site-width">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/services">Services</Link>
          <span aria-hidden="true">/</span>
          <span>{s.title}</span>
        </nav>
        <header className="page-heading">
          <p className="eyebrow accent">{s.number} / What we do</p>
          <h1>{s.title}</h1>
          <p className="body-copy">{s.short}</p>
        </header>
        {art && (
          <div className="project-masthead">
            <Image src={art.wide ?? art.image} alt={art.alt} fill priority sizes="(max-width:760px) 100vw, 1200px" />
          </div>
        )}
        <section className="editorial-grid section-space pb-20">
          <div className="editorial-copy">
            <p>{s.intro}</p>
            <p>{s.audience}</p>
            <a
              href={BOOKING_URL}
              className="button mt-3"
              data-track="booking_click"
            >
              Discuss a project ↗
            </a>
          </div>
          <div>
            <p className="eyebrow accent mb-5">What we can help with</p>
            <ul className="offer-list">
              {s.offerings.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="small-copy mt-6">
              Studio in Valencia, California.{" "}
              <Link href={LOCATION_PATH} className="underline">
                Filming across Los Angeles
              </Link>{" "}
              and working worldwide.
            </p>
          </div>
        </section>
        <section className="editorial-grid section-space border-t border-[#28363a]">
          <div>
            <p className="eyebrow accent mb-5">How it works</p>
            <h2>
              A clear path
              <br />
              through the process.
            </h2>
          </div>
          <ol className="numbered-list">
            {s.process.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        {s.slug === "remote-video-production" && <ProductionMethods detailed />}
        {s.projectSlugs.length > 0 && <section className="pb-20">
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">In practice</p>
              <h2>Related work</h2>
            </div>
          </div>
          <div className="project-grid">
            {s.projectSlugs.map((slug) => {
              const p = getProject(slug);
              return p ? <ProjectCard key={slug} project={p} /> : null;
            })}
          </div>
        </section>}
        {["environmental-conservation-filmmaking", "documentary-production", "ngo-video-production"].includes(s.slug) && <NatureForLifeRecognition />}
        <section className="pb-20 service-questions">
          <h2 className="mb-8">Planning your project</h2>
          {questions.map((item) => (
            <div className="question-block" key={item.question}>
              <h3>{item.question}</h3><p className="body-copy">{item.answer}</p>
            </div>
          ))}
        </section>
        <section className="editorial-grid pb-20">
          <div><h2>A scope that fits.</h2></div>
          <div className="editorial-copy">
            <p>Looking for an affordable media company? We can discuss existing footage,
              filming kits, audio-led animation, and local filmmakers alongside new
              field production. The right approach depends on your story, material,
              budget, and deadline.</p>
            <Link href="/guides/affordable-video-production" className="text-link">Plan your production budget ↗</Link>
            <br /><Link href="/guides/choosing-a-storytelling-company" className="text-link mt-5">Choosing a storytelling partner ↗</Link>
          </div>
        </section>
      </div>
      <InquiryCTA image={CTA_STILL} />
    </article>
  );
}
