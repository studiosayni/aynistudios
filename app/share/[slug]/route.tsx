import { guides } from "../../lib/storytellingContent";
import { ImageResponse } from "next/og";
import { films, projects, services } from "../../lib/publicContent";

const pages = [
  {
    slug: "home",
    title: "Real stories. Lasting impact.",
    label: "Documentary films & impact content",
  },
  {
    slug: "work",
    title: "Stories with something at stake.",
    label: "Selected work",
  },
  {
    slug: "services",
    title: "From first idea to final frame.",
    label: "Production · Brand content · Editing",
  },
  { slug: "studio", title: "Give back what you receive.", label: "The studio" },
  {
    slug: "contact",
    title: "What story do you want to tell?",
    label: "Start a project",
  },
  { slug: "privacy", title: "Your privacy matters.", label: "Ayni Studios" },
  {
    slug: "los-angeles",
    title: "Video production in Los Angeles.",
    label: "Valencia, CA · Los Angeles County",
  },
  { slug: "guides", title: "Good questions. A clearer brief.", label: "Video production planning" },
  ...guides.map((guide) => ({ slug: guide.slug, title: guide.title, label: "Ayni Studios guide" })),
  ...projects.map((p) => ({ slug: p.slug, title: p.title, label: p.client })),
  ...services.map((s) => ({
    slug: s.slug,
    title: s.title,
    label: "Our services",
  })),
  ...films.map((f) => ({
    slug: f.slug,
    title: f.title,
    label: f.client || f.category,
  })),
];
export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.slug }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = (await params).slug;
  const page = pages.find((p) => p.slug === slug);
  if (!page) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "65px 76px",
        background: "#080F11",
        color: "#DCE4EB",
        borderBottom: "12px solid #FEB040",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 34, fontWeight: 700 }}>Ayni Studios</span>
        <span style={{ fontSize: 18, color: "#FEB040" }}>
          VALENCIA, CA · GLOBAL
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <span style={{ fontSize: 23, color: "#FEB040" }}>{page.label}</span>
        <span
          style={{
            fontSize: page.title.length > 55 ? 64 : 83,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          {page.title}
        </span>
      </div>
      <span style={{ fontSize: 20, color: "#A7B2B8" }}>ayni-studios.com</span>
    </div>,
    { width: 1200, height: 630 },
  );
}
