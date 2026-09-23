import Link from "next/link";
import { guides } from "../lib/storytellingContent";
import { collectionPage, jsonLd, pageMetadata } from "../lib/seo";
import InquiryCTA from "../components/InquiryCTA";

const TITLE = "Video Production Planning Guides";
const DESCRIPTION =
  "Plan an affordable video production and choose a storytelling partner. Practical advice from Ayni Studios on footage, filming kits, animation, and local filmmakers.";
export const metadata = pageMetadata(TITLE, DESCRIPTION, "/guides", "guides");
const schema = collectionPage({
  path: "/guides",
  name: TITLE,
  description: DESCRIPTION,
  items: guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })),
});
export default function GuidesPage() {
  return (
    <div className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <div className="site-width">
        <header className="page-heading">
          <p className="eyebrow accent">Planning your film</p>
          <h1>Good questions.<br />A clearer brief.</h1>
          <p className="body-copy">Practical guidance from Ayni Studios on choosing a
            production partner, making the most of your budget, and finding the
            right way to tell your story.</p>
        </header>
        <div className="guide-grid pb-24">
          {guides.map((guide) => (
            <article className="method-card" key={guide.slug}>
              <p className="eyebrow accent">Ayni Studios guide</p>
              <h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2>
              <p className="body-copy">{guide.description}</p>
              <Link className="text-link mt-6" href={`/guides/${guide.slug}`}>Read the guide ↗</Link>
            </article>
          ))}
        </div>
      </div>
      <InquiryCTA />
    </div>
  );
}
