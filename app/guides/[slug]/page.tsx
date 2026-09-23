import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "../../lib/storytellingContent";
import { CONTENT_UPDATED, PAGE_UPDATED, SITE_URL, getProject, getService } from "../../lib/publicContent";
import { breadcrumbs, founder, jsonLd, pageMetadata } from "../../lib/seo";
import ProjectCard from "../../components/ProjectCard";
import InquiryCTA, { CTA_STILL } from "../../components/InquiryCTA";

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const item = guides.find((entry) => entry.slug === slug);
  return item ? pageMetadata(item.title, item.description, `/guides/${slug}`, slug) : {};
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const url = `${SITE_URL}/guides/${guide.slug}`;
  const updated = PAGE_UPDATED[`/guides/${guide.slug}`] ?? CONTENT_UPDATED;
  const updatedLabel = new Date(`${updated}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
  const article = {
    "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`,
    headline: guide.title, description: guide.description, mainEntityOfPage: url,
    image: `${SITE_URL}/share/${guide.slug}`, datePublished: "2026-09-13",
    dateModified: updated, inLanguage: "en",
    author: founder,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Ayni Studios" },
  };
  return (
    <article className="public-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([
        { name: "Home", path: "/" }, { name: "Guides", path: "/guides" },
        { name: guide.title, path: `/guides/${guide.slug}` },
      ])) }} />
      <div className="site-width">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/guides">Guides</Link><span aria-hidden="true">/</span><span>{guide.title}</span>
        </nav>
        <header className="page-heading">
          <p className="eyebrow accent">Planning your film</p>
          <h1>{guide.title}</h1>
          <p className="body-copy">{guide.summary}</p>
          <p className="small-copy mt-6">By <Link className="underline" href="/about">Noah Beilin, Ayni Studios</Link> · Updated {updatedLabel}</p>
        </header>
        <div className="guide-layout pb-20">
          <div className="editorial-copy">
            {guide.sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.title} className="guide-section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
          </div>
          <aside className="guide-aside">
            <nav aria-label="On this page">
              <p className="eyebrow accent mb-5">In this guide</p>
              {guide.sections.map((section, index) => <a key={section.title} href={`#section-${index + 1}`}>{section.title}</a>)}
            </nav>
            <nav aria-label="Related services" className="mt-10">
              <p className="eyebrow accent mb-5">Explore our services</p>
              {guide.serviceSlugs.map((slug) => <Link key={slug} href={`/services/${slug}`}>{getService(slug)?.title}</Link>)}
            </nav>
          </aside>
        </div>
        <section className="pb-20">
          <div className="section-heading"><h2>See the work.</h2></div>
          <div className="project-grid">
            {guide.projectSlugs.map((slug) => { const project = getProject(slug); return project ? <ProjectCard key={slug} project={project} /> : null; })}
          </div>
        </section>
        <nav aria-label="More guides" className="pb-20">
          {guides.filter((item) => item.slug !== guide.slug).map((item) => <Link className="text-link" key={item.slug} href={`/guides/${item.slug}`}>{item.title} ↗</Link>)}
        </nav>
      </div>
      <InquiryCTA image={CTA_STILL} />
    </article>
  );
}
