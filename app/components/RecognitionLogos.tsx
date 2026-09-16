import Image from "next/image";
import Link from "next/link";
import { NATURE_FOR_LIFE } from "../lib/publicContent";

export default function RecognitionLogos() {
  return (
    <section className="recognition-row" aria-labelledby="recognition-title">
      <h2 id="recognition-title" className="eyebrow">Work showcased at</h2>
      <div className="recognition-grid">
        <Link href="/work/nature-and-resilience" className="recognition-link" aria-label="COP30 — explore our BCRN programme film">
          <span className="recognition-art">
            <Image src="/brand/partners/cop30.webp" alt="COP30" width={160} height={90} unoptimized />
          </span>
          <span>COP30</span>
        </Link>
        <Link href="/work/nature-and-resilience" className="recognition-link" aria-label="IUCN World Conservation Congress — explore our BCRN programme film">
          <span className="recognition-art">
            <Image src="/brand/partners/iucn.webp" alt="IUCN World Conservation Congress" width={160} height={90} unoptimized />
          </span>
          <span>IUCN World Conservation Congress</span>
        </Link>
        <Link href={`/films/${NATURE_FOR_LIFE.filmSlug}`} className="recognition-link" aria-label="UNDP’s Nature for Life Hub — watch They Live in Our World">
          <span className="recognition-art recognition-art-nature">
            <span className="recognition-undp"><Image src="/brand/recognition/undp.webp" alt="UNDP" width={127} height={256} unoptimized /></span>
            <Image src="/brand/recognition/nature-for-life.svg" alt="Nature for Life Hub" width={463} height={111} unoptimized />
          </span>
          <span>UNDP’s Nature for Life Hub</span>
        </Link>
      </div>
    </section>
  );
}
