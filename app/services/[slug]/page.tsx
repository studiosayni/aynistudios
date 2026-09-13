import Link from "next/link";
import { notFound } from "next/navigation";
import {
  services,
  getService,
  getProject,
  SITE_URL,
  BOOKING_URL,
} from "../../lib/publicContent";
import { jsonLd, pageMetadata } from "../../lib/seo";
import ProjectCard from "../../components/ProjectCard";
import InquiryCTA from "../../components/InquiryCTA";
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
    name: s.title,
    description: s.description,
    url: `${SITE_URL}/services/${s.slug}`,
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Ayni Studios",
      url: SITE_URL,
    },
  };
  return (
    <article className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
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
        <section className="editorial-grid pb-20">
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
        <section className="pb-20">
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
        </section>
        <section className="question-block mb-20">
          <h3>{s.question}</h3>
          <p className="body-copy">{s.answer}</p>
        </section>
      </div>
      <InquiryCTA />
    </article>
  );
}
