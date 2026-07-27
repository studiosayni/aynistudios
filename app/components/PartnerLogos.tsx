import Image from "next/image";

// Matches the partner list in _docs/overview.md. Logo files go in
// public/brand/partners/ — filename convention: lowercase-with-dashes.png.
// Missing files will 404 silently (next/image) — drop assets in as available.
//
// Each logo sits on a uniform light chip. That is not decoration: 8 of the 12
// source files are dark artwork with a white background baked in, 1 is opaque
// mid-tone, and only 3 are true transparent marks. Floating that mixture
// straight onto the dark page made two-thirds of them read as stray white
// boxes at inconsistent sizes, and the white cannot simply be keyed out —
// the artwork beneath it is dark and would disappear against #080F11.
// Recolouring a partner's mark to suit us is not an option either (brand.md).
//
// A consistent chip turns the mismatch into a deliberate treatment, equalises
// optical weight regardless of a logo's aspect ratio (measured: 0.82 to 2.97),
// and lets each partner keep its real colours. If reversed-out or genuinely
// transparent variants are ever sourced for all twelve, this can go back to
// bare marks on the dark background.
const PARTNERS = [
  { name: "IFRC-WWF", file: "ifrc-wwf.png" },
  { name: "Amazon Expeditions", file: "amazon-expeditions.png" },
  { name: "AoA", file: "aoa.png" },
  { name: "ENWWF", file: "enwwf.png" },
  { name: "Goumbook", file: "goumbook.png" },
  { name: "Learning for Nature (UNDP)", file: "learning-for-nature.png" },
  { name: "IN2", file: "in2.png" },
  { name: "La Isla de los Monos", file: "la-isla.png" },
  { name: "SFS", file: "sfs.png" },
  { name: "teamLab", file: "teamlab.png" },
  { name: "COP30", file: "cop30.png" },
  { name: "IUCN World Congress", file: "iucn.png" },
];

export default function PartnerLogos() {
  return (
    <section className="py-16 border-y border-[#1b282d]">
      <div className="max-w-7xl mx-auto px-8">
        <h3 className="text-[10px] md:text-xs font-bold uppercase tracked text-[#7B878F] text-center mb-10">
          Partners &amp; Featured At
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-5">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              title={p.name}
              // White rather than a tinted panel: 8 of the files carry their own
              // white plate, so anything off-white makes that plate visible as
              // a box nested inside the chip. Matching it hides the seam.
              //
              // The softening is opacity on the chip rather than a dimmer
              // background colour, because opacity scales the chip and the
              // logo's own baked-in plate by the same factor — they stay
              // matched, so the seam cannot come back.
              className="flex h-20 items-center justify-center rounded-lg bg-white px-4 py-3 opacity-90 transition-all duration-300 hover:opacity-100 hover:scale-[1.03]"
            >
              <div className="relative h-full w-full">
                <Image
                  src={`/brand/partners/${p.file}`}
                  alt={p.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
