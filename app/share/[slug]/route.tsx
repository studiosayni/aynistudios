import { readFile } from "node:fs/promises";
import path from "node:path";
import { guides } from "../../lib/storytellingContent";
import { ImageResponse } from "next/og";
import { films, projects, services } from "../../lib/publicContent";

// Share cards carry a still behind the title. stills/<slug>.jpg is a
// 1200x630 crop made for the card; a page without one uses the home still.
// Keep build-time reads out of public/: file tracing copies whatever this
// route reads into .next/standalone, and App Hosting's adapter then skips
// copying any top-level folder that already exists there. Reading
// public/brand/og once left production with only those files and 404s for
// every other image under /brand (2026-09-22).
const OG_DIR = path.join(process.cwd(), "app", "share", "stills");
// Satori ships no font; Barlow (OFL) sits beside the route so the card
// matches the site.
const FONT_DIR = path.join(process.cwd(), "app", "share", "fonts");
async function fonts() {
  const [regular, bold] = await Promise.all([
    readFile(path.join(FONT_DIR, "Barlow-Regular.ttf")),
    readFile(path.join(FONT_DIR, "Barlow-Bold.ttf")),
  ]);
  return [
    { name: "Barlow", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Barlow", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}
async function stillFor(slug: string) {
  for (const name of [slug, "home"]) {
    try {
      const buf = await readFile(path.join(OG_DIR, `${name}.jpg`));
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

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
// Prerendered for every known slug at build, so the file reads above run
// where public/ and app/share/fonts exist; unknown slugs 404 at the edge.
export const dynamic = "force-static";
export const dynamicParams = false;
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
  const [still, fontData] = await Promise.all([stillFor(slug), fonts()]);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#080F11",
        color: "#DCE4EB",
        fontFamily: "Barlow",
      }}
    >
      {still && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={still}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          background:
            "linear-gradient(0deg, rgba(8,15,17,0.92) 0%, rgba(8,15,17,0.55) 45%, rgba(8,15,17,0.15) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          background:
            "linear-gradient(90deg, rgba(8,15,17,0.55) 0%, rgba(8,15,17,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 12,
          background: "#FEB040",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "56px 76px 64px",
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
          <span style={{ fontSize: 18, color: "#FEB040", letterSpacing: 2 }}>
            VALENCIA, CA · GLOBAL
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 22, color: "#FEB040", letterSpacing: 2 }}>
            {page.label.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: page.title.length > 55 ? 58 : 76,
              fontWeight: 700,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {page.title}
          </span>
          <span style={{ fontSize: 20, color: "#C5CED2", marginTop: 6 }}>
            ayni-studios.com
          </span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: fontData },
  );
}
