import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  projects,
  films,
  getProject,
  getService,
  SITE_URL,
} from "../../lib/publicContent";
import { ORGANIZATION_ID, jsonLd, pageMetadata } from "../../lib/seo";
import FilmCard from "../../components/FilmCard";
import ProjectCard from "../../components/ProjectCard";
import InquiryCTA from "../../components/InquiryCTA";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  if (!p) return {};
  return pageMetadata(
    p.seoTitle ?? (p.kind === "sample" ? p.title : `${p.client}: ${p.title}`),
    p.summary,
    `/work/${p.slug}`,
    p.slug,
  );
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const relatedFilms = films.filter((f) => p.filmIds?.includes(f.youtubeId));
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Work",
        item: `${SITE_URL}/library`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: p.title,
        item: `${SITE_URL}/work/${p.slug}`,
      },
    ],
  };
  // The project as a work Ayni made, for whom, and the films that belong to
  // it. The client is the first name in `client` ("Emirates Nature–WWF ·
  // WWF · IFRC"); a creator collaboration names a person, not an
  // organization. The films are plain CreativeWork links: full VideoObject
  // markup belongs on the watch pages, where the video plays.
  const clientName = p.client.split(" · ")[0];
  const work = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/work/${p.slug}#work`,
    name: p.title,
    description: p.summary,
    url: `${SITE_URL}/work/${p.slug}`,
    genre: p.category,
    creator: { "@id": ORGANIZATION_ID },
    ...(p.image
      ? { image: p.image.startsWith("/") ? `${SITE_URL}${p.image}` : p.image }
      : {}),
    ...(p.kind === "sample"
      ? {}
      : p.category.startsWith("Creator collaboration")
        ? { contributor: { "@type": "Person", name: clientName } }
        : { sourceOrganization: { "@type": "Organization", name: clientName } }),
    ...(relatedFilms.length
      ? {
          hasPart: relatedFilms.map((f) => ({
            "@type": "CreativeWork",
            name: f.title,
            url: `${SITE_URL}/films/${f.slug}`,
          })),
        }
      : {}),
  };
  return (
    <article className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(work) }}
      />
      <div className="site-width">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/library">Work</Link>
          <span aria-hidden="true">/</span>
          <span>{p.client}</span>
        </nav>
        <header className="page-heading">
          <p className="eyebrow accent">
            {p.client} · {p.category}
          </p>
          <h1>{p.title}</h1>
          <p className="body-copy">{p.summary}</p>
          {p.status && <span className="status-tag">{p.status}</span>}
        </header>
        <div className="project-masthead">
          {p.image ? (
            <Image
              src={p.image}
              alt={p.imageAlt || ""}
              fill
              preload
              sizes="(max-width:760px) 100vw, 1200px"
            />
          ) : (
            <div className="project-brand-panel">
              <Image
                src={p.logo!}
                width={500}
                height={180}
                alt={p.client}
                unoptimized
              />
              <span>{p.category}</span>
            </div>
          )}
        </div>
        <section className="editorial-grid section-space">
          <div className="editorial-copy">
            <p>{p.context}</p>
            <h2>{p.kind === "sample" ? "The production" : "Our role"}</h2>
            <p>{p.role}</p>
            {p.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <div className="source-links">
              {[...(p.source ? [p.source] : []), ...(p.moreSources || [])].map(
                (source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.label} ↗
                  </a>
                ),
              )}
            </div>
          </div>
          <aside>
            <dl className="detail-list">
              {p.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <p className="eyebrow mt-9">Related services</p>
            <div className="pill-list">
              {p.serviceSlugs.map((slug) => (
                <Link key={slug} href={`/services/${slug}`}>
                  {getService(slug)?.title}
                </Link>
              ))}
            </div>
          </aside>
        </section>
        {relatedFilms.length > 0 && (
          <section className="pb-20">
            <div className="section-heading">
              <div>
                <p className="eyebrow accent">Watch the work</p>
                <h2>The films</h2>
              </div>
            </div>
            <div className="film-grid">
              {relatedFilms.map((f) => (
                <FilmCard key={f.slug} film={f} />
              ))}
            </div>
          </section>
        )}
        <section className="section-space border-t border-[#28363a]">
          <h2 className="mb-10">More work</h2>
          <div className="project-grid">
            {projects
              .filter((other) => other.slug !== p.slug)
              .map((other) => (
                <ProjectCard project={other} key={other.slug} />
              ))}
          </div>
        </section>
      </div>
      <InquiryCTA title="Have a story with a similar ambition?" />
    </article>
  );
}
