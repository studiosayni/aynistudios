import { bleedSrcSet } from "../lib/bleedImage";

// Malcolm X quote — deliberately sits between the proof (library, partners)
// and the ask below it. Placed here rather than under the hero, where two
// large statements would compete; here it reads as the reason the ask matters,
// and the page no longer dead-ends on it.
//
// The backdrop still is what makes the section hold its own width. At desktop
// the text column is max-w-4xl inside a full-bleed section, leaving ~470px of
// bare page either side — measured, not estimated. The image fills exactly
// that, while the scrim keeps the middle clear for the type.
const QUOTE_STILL = "/brand/quote/quote-still";

export default function QuoteSection() {
  return (
    // isolate so the -z-10 backdrop stays inside this section instead of
    // sliding behind the sections above it. data-backdrop is moderate here:
    // the still now carries the section, so the particle field only has to
    // keep the edges alive. See ParticleField for what the number means.
    <section data-backdrop="0.5" className="relative isolate py-28 px-6">
      {/* eslint-disable-next-line @next/next/no-img-element -- see bleedImage.ts */}
      <img
        src={`${QUOTE_STILL}.jpg`}
        srcSet={bleedSrcSet(QUOTE_STILL)}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        // Cropped low: the figure that makes the frame sits below the midline.
        className="quote-still absolute inset-0 -z-10 h-full w-full object-cover object-[center_62%] opacity-[0.34] saturate-[0.8]"
      />
      <div aria-hidden="true" className="quote-scrim absolute inset-0 -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed text-[#DCE4EB]/90">
          &ldquo;The media&apos;s the most powerful entity on earth. They have
          the power to make the innocent guilty and to make the guilty innocent,
          and that&apos;s power. Because they control the minds of the
          masses.&rdquo;
        </blockquote>
        <cite className="mt-8 block text-sm font-bold uppercase tracked text-[#FEB040] not-italic">
          — Malcolm X
        </cite>
      </div>
    </section>
  );
}
