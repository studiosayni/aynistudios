import Link from "next/link";
import Image from "next/image";
import InquiryCTA from "../components/InquiryCTA";
import PartnerLogos from "../components/PartnerLogos";
import { pageMetadata } from "../lib/seo";
export const metadata = pageMetadata(
  "About the Studio",
  "Ayni Studios is an independent media studio rooted in the Andean principle of reciprocity. Documentary production and brand storytelling from Los Angeles to the world.",
  "/about",
  "studio",
);
export default function AboutPage() {
  return (
    <div className="public-site">
      <div className="site-width">
        <header className="page-heading">
          <p className="eyebrow accent">The studio</p>
          <h1>
            Stories in service
            <br />
            of something bigger.
          </h1>
          <p className="body-copy">
            Ayni Studios is an independent media studio working across
            documentary production, brand storytelling, and impact content.
          </p>
        </header>
        <div className="project-masthead">
          <Image
            src="/brand/hero/hero-7-1920.webp"
            alt="People gathered outdoors, from Ayni Studios’ editorial photography"
            fill
            sizes="100vw"
          />
        </div>
        <section className="editorial-grid section-space">
          <div>
            <p className="eyebrow accent mb-5">Ayni / Reciprocity</p>
            <h2>
              Give back what
              <br />
              you receive.
            </h2>
          </div>
          <div className="editorial-copy">
            <p>
              Our name comes from the Andean principle of sacred reciprocity. We
              see filmmaking as a relationship with the people and places whose
              stories we help share.
            </p>
            <p>
              Our work spans conservation, climate, communities, and the
              organizations working alongside them. Based in Los Angeles, we
              bring a global perspective to both original documentaries and
              commissioned projects.
            </p>
            <Link className="text-link" href="/films/what-is-ayni">
              Watch the story behind our name ↗
            </Link>
          </div>
        </section>
        <section className="editorial-grid section-space border-t border-[#28363a]">
          <div>
            <p className="eyebrow accent mb-5">People behind the stories</p>
            <h2>
              Rooted in the field.
              <br />
              Connected across borders.
            </h2>
          </div>
          <div className="editorial-copy">
            <p>
              Founded by Noah Beilin, Ayni brings together filmmaking and a
              commitment to stories about people and the natural world.
            </p>
            <p>
              Our projects connect the perspectives of communities, researchers,
              conservation practitioners, and partner organizations. From the
              Amazon rainforest to the UAE, the work starts with listening.
            </p>
            <a
              href="https://www.linkedin.com/in/noahbeilin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Meet Noah on LinkedIn ↗
            </a>
          </div>
        </section>
      </div>
      <PartnerLogos />
      <div className="site-width section-space">
        <div className="editorial-grid">
          <div>
            <p className="eyebrow accent mb-5">Our approach</p>
            <h2>
              Human judgment.
              <br />A considered process.
            </h2>
          </div>
          <div className="editorial-copy">
            <p>
              We agree the brief, production scope, and review process at the
              start. Editorial choices and the final film remain the
              responsibility of the people making it.
            </p>
            <p>
              We are developing ways to use AI-assisted tools for the
              time-consuming parts of post-production, with human review of the
              story and the result. As that work develops, our focus is
              practical: more time for the craft, and better value for our
              clients.
            </p>
            <Link href="/services" className="text-link">
              Explore how we work ↗
            </Link>
          </div>
        </div>
      </div>
      <InquiryCTA />
    </div>
  );
}
