import Image from "next/image";

// Matches the partner list in _docs/overview.md. Logo files go in
// public/brand/partners/ — filename convention: lowercase-with-dashes.png.
// Missing files will 404 silently (next/image) — drop assets in as available.
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
          Partners & Featured At
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 items-center">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="relative h-14 md:h-16 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              title={p.name}
            >
              <Image
                src={`/brand/partners/${p.file}`}
                alt={p.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
