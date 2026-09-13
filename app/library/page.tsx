import Link from "next/link";
import ProjectCard from "../components/ProjectCard";
import FilmCard from "../components/FilmCard";
import InquiryCTA from "../components/InquiryCTA";
import { projects } from "../lib/publicContent";
import { getPublicFilms } from "../lib/publicFilms";
import { pageMetadata } from "../lib/seo";

export const revalidate = 300;
export const metadata = pageMetadata(
  "Documentary Films & Selected Client Work",
  "Explore Ayni Studios’ documentary films and client work for Panasonic Global, Emirates Nature–WWF, and global conservation and humanitarian initiatives.",
  "/library",
  "work",
);
export default async function LibraryPage() {
  const films = await getPublicFilms();
  return (
    <div className="public-site">
      <div className="site-width">
        <header className="page-heading">
          <p className="eyebrow accent">The work</p>
          <h1>
            Stories with
            <br />
            something at stake.
          </h1>
          <p className="body-copy">
            Documentary films, brand collaborations, and stories that connect
            people with the world around them.
          </p>
          <div className="pill-list">
            <a href="#client-work">Client work</a>
            <a href="#films">Films & series</a>
          </div>
        </header>
        <section
          id="client-work"
          className="pb-20 scroll-mt-36"
          aria-labelledby="client-work-title"
        >
          <h2 id="client-work-title" className="mb-9">
            Selected collaborations
          </h2>
          <div className="project-grid">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
        <section
          id="films"
          className="section-space border-t border-[#28363a] scroll-mt-28"
          aria-labelledby="films-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow accent">The library</p>
              <h2 id="films-title">Films & series</h2>
            </div>
            <Link href="/services" className="text-link">
              Our services ↗
            </Link>
          </div>
          <div className="film-grid">
            {films.map((f) => (
              <FilmCard film={f} key={f.youtubeId} />
            ))}
          </div>
        </section>
      </div>
      <InquiryCTA />
    </div>
  );
}
