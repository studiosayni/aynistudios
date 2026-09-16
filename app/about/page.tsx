import NatureForLifeRecognition from "../components/NatureForLifeRecognition";
import Link from "next/link";
import Image from "next/image";
import InquiryCTA from "../components/InquiryCTA";
import PartnerLogos from "../components/PartnerLogos";
import BusinessAddress from "../components/BusinessAddress";
import { LOCATION_PATH, LOCATION_STATEMENT, STUDIO_MAPS_URL } from "../lib/publicContent";
import { founder, jsonLd, pageMetadata } from "../lib/seo";
export const metadata = pageMetadata(
  "About the Studio",
  "Meet Ayni Studios, an independent documentary and storytelling company in Valencia, California, serving Los Angeles and working worldwide. Our film They Live in Our World was selected for UNDP’s Nature for Life Hub.",
  "/about",
  "studio",
);
export default function AboutPage() {
  return (
    <div className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...founder }) }}
      />
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
            documentary production, brand storytelling, NGO and conservation films,
            and personal and organizational legacy videos.
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
              organizations working alongside them. Based in Valencia, California, we
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
        <section className="editorial-grid section-space border-t border-[#28363a]" aria-labelledby="where-title">
          <div>
            <p className="eyebrow accent mb-5">Where we are</p>
            <h2 id="where-title">
              Valencia, California.
              <br />
              Los Angeles and the world.
            </h2>
          </div>
          <div className="editorial-copy">
            <p>{LOCATION_STATEMENT}</p>
            <p>
              Our client work has taken us to the United Arab Emirates, the
              Peruvian Amazon, and South Africa. When a story is far from a
              crew, we work with existing footage, filming kits, audio-led
              animation, and local filmmakers.
            </p>
            <div className="small-copy mb-6">
              <BusinessAddress />
              <a href={STUDIO_MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline">
                Open in Google Maps ↗
              </a>
            </div>
            <Link href={LOCATION_PATH} className="text-link">
              Video production in Los Angeles ↗
            </Link>
          </div>
        </section>
      </div>
      <div className="site-width"><NatureForLifeRecognition /></div>
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
            <p>
              Flexible production is already part of how we work. Clients can send
              existing footage, receive filming kits, supply audio for animated
              narratives, or work with filmmakers in local communities around the
              world. These options can reduce travel and production costs and make
              repeat content easier to produce, with scope and quality reviewed
              for each project.
            </p>
            <Link href="/services/remote-video-production" className="text-link">
              Explore how we work ↗
            </Link>
          </div>
        </div>
      </div>
      <InquiryCTA />
    </div>
  );
}
