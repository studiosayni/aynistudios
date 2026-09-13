import Link from "next/link";
import LibraryThumbnail from "./LibraryThumbnail";
import type { Film } from "../lib/publicContent";

export default function FilmCard({
  film,
}: {
  film: Film & { thumbnailUrl?: string };
}) {
  return (
    <Link href={`/films/${film.slug}`} className="film-card">
      <div className="film-card-art">
        <LibraryThumbnail
          item={{ dbId: film.slug, ...film }}
          sizes="(max-width: 440px) 100vw, (max-width: 760px) 50vw, 33vw"
        />
        <span className="project-arrow" aria-hidden="true">
          ▷
        </span>
      </div>
      <p className="eyebrow accent">{film.category}</p>
      <h3>{film.title}</h3>
      <p className="small-copy">
        {[film.client, film.year].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}
