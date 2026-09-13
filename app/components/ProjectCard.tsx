import Link from "next/link";
import Image from "next/image";
import type { Project } from "../lib/publicContent";
import LibraryThumbnail from "./LibraryThumbnail";

export default function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card"
      data-track="project_view"
    >
      <div className={`project-art ${project.logo ? "project-art-brand" : ""}`}>
        {project.image ? (
          <LibraryThumbnail
            item={{
              dbId: project.slug,
              title: project.title,
              youtubeId: project.filmIds?.[0],
              thumbnailUrl: project.image,
            }}
            sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="project-brand-panel">
            <Image
              src={project.logo!}
              alt=""
              width={400}
              height={144}
              unoptimized
            />
            <span>
              {project.slug === "panasonic-lumix"
                ? "LUMIX channel collaboration"
                : "Nature. People. Resilience."}
            </span>
          </div>
        )}
        <span className="project-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="project-caption">
        <p className="eyebrow accent">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="project-client">{project.client}</p>
        <p className="body-copy">{project.summary}</p>
        {project.status && <span className="status-tag">{project.status}</span>}
      </div>
    </Link>
  );
}
