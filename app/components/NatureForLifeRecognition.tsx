import Image from "next/image";
import Link from "next/link";
import { NATURE_FOR_LIFE } from "../lib/publicContent";

export default function NatureForLifeRecognition({ showFilmLink = true }: { showFilmLink?: boolean }) {
  return (
    <section className="nature-recognition editorial-grid section-space border-t border-[#28363a]">
      <div>
        <p className="eyebrow accent mb-5">International recognition</p>
        <h2>Selected for UNDP’s Nature for Life Hub.</h2>
        <div className="nature-recognition-logos mt-8">
          <a href="https://www.undp.org/nature/our-flagship-initiatives/nature-development" aria-label="UNDP — Nature for Development">
            <Image src="/brand/recognition/undp.webp" alt="United Nations Development Programme (UNDP)" width={127} height={256} className="undp-recognition-logo" unoptimized />
          </a>
          <a href={NATURE_FOR_LIFE.sourceUrl} className="nature-event-logo" aria-label="Nature for Life Hub 2024 official programme">
            <Image src="/brand/recognition/nature-for-life.svg" alt="Nature for Life Hub" width={463} height={111} unoptimized />
          </a>
        </div>
      </div>
      <div className="editorial-copy">
        <p>Ayni Studios’ documentary <em>They Live in Our World</em> was selected
          to be featured at the United Nations Development Programme’s (UNDP)
          Nature for Life Hub 2024 virtual event.</p>
        <p>The film follows orphaned monkeys and their caretakers in the Amazon
          rainforest. The official Day 3 programme lists the film under
          “Behavioral Change and Environmental Impact” and credits Ayni Studios.</p>
        {showFilmLink && <p><Link href={`/films/${NATURE_FOR_LIFE.filmSlug}`} className="text-link">Watch They Live in Our World ↗</Link></p>}
        <a href={NATURE_FOR_LIFE.sourceUrl} className="text-link">View the official event listing ↗</a>
      </div>
    </section>
  );
}
