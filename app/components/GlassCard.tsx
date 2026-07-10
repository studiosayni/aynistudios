// iCloud-style translucent card — the shared surface for the Main page card
// grid, the featured Library hero, and any future dashboard tiles.
export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#1b282d] bg-[#0C1619]/70 backdrop-blur-md shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}
