import NatureForLifeRecognition from "../../components/NatureForLifeRecognition";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicFilms } from "../../lib/publicFilms";
import { SITE_URL, films, getService, NATURE_FOR_LIFE } from "../../lib/publicContent";
import { jsonLd, pageMetadata } from "../../lib/seo";
import FilmCard from "../../components/FilmCard";
import FilmPlayer from "../../components/FilmPlayer";
import InquiryCTA from "../../components/InquiryCTA";

export const revalidate = 300;
export async function generateStaticParams() {
  return (await getPublicFilms()).map((f) => ({ slug: f.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const f = (await getPublicFilms()).find((f) => f.slug === slug);
  if (!f) return {};
  return pageMetadata(
    f.title,
    f.description,
    `/films/${f.slug}`,
    films.some((known) => known.slug === f.slug) ? f.slug : "work",
  );
}
export default async function FilmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const all = await getPublicFilms();
  const film = all.find((f) => f.slug === slug);
  if (!film) notFound();
  const video = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: film.title,
    ...(film.subtitle ? { alternateName: film.subtitle } : {}),
    ...(film.sourceUrl ? { citation: film.sourceUrl } : {}),
    description: film.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`,
    uploadDate: film.uploadDate,
    ...(film.duration ? { duration: film.duration } : {}),
    embedUrl: `https://www.youtube-nocookie.com/embed/${film.youtubeId}`,
    url: `${SITE_URL}/films/${film.slug}`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  return (
    <article className="public-site">
      <div className="site-width">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/library">Work</Link>
          <span aria-hidden="true">/</span>
          <span>Films</span>
        </nav>
        <header className="page-heading">
          <p className="eyebrow accent">
            {film.category}
            {film.client ? ` · ${film.client}` : ""}
          </p>
          <h1>{film.title}</h1>
          {film.subtitle && <p className="body-copy">{film.subtitle}</p>}
        </header>
        {film.uploadDate && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(video) }}
          />
        )}
        <div className="film-player">
          <FilmPlayer
            youtubeId={film.youtubeId}
            title={film.title}
            thumbnailUrl={film.thumbnailUrl}
          />
        </div>
        <section className="editorial-grid py-12">
          <div className="editorial-copy">
            <p>{film.description}</p>
            {film.projectSlug && (
              <Link href={`/work/${film.projectSlug}`} className="text-link">
                Read the project story ↗
              </Link>
            )}
          </div>
          <aside>
            <a
              href={`https://www.youtube.com/watch?v=${film.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Watch on YouTube ↗
            </a>
            <p className="small-copy mt-3">
              The player is provided by YouTube. Captions and playback options
              are available in the player where provided by the publisher.
            </p>
          </aside>
        </section>
        {film.slug === NATURE_FOR_LIFE.filmSlug && <NatureForLifeRecognition showFilmLink={false} />}
        {film.viewingNotes && (
          <section className="editorial-grid pb-20">
            <div className="editorial-copy">
              {film.viewingNotes.map((note) => (
                <section key={note.title}><h2>{note.title}</h2><p>{note.text}</p></section>
              ))}
            </div>
            <aside>
              <p className="eyebrow accent mb-5">Make a story like this</p>
              <div className="pill-list">{film.serviceSlugs?.map((service) => (
                <Link href={`/services/${service}`} key={service}>{getService(service)?.title}</Link>
              ))}</div>
              {film.duration && <p className="small-copy mt-5">Running time: 3 minutes 59 seconds</p>}
            </aside>
          </section>
        )}
        <section className="section-space border-t border-[#28363a]">
          <h2 className="mb-10">Keep watching</h2>
          <div className="film-grid">
            {all
              .filter((f) => f.slug !== film.slug)
              .slice(0, 3)
              .map((f) => (
                <FilmCard key={f.slug} film={f} />
              ))}
          </div>
        </section>
      </div>
      <InquiryCTA />
    </article>
  );
}
