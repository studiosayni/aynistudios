import Image from "next/image";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup">
      <Image
        src="/brand/marks/ayni-mark.svg"
        width={36}
        height={42}
        alt=""
        unoptimized
      />
      {!compact && (
        <span>
          Ayni <span className="font-normal">Studios</span>
        </span>
      )}
    </span>
  );
}
