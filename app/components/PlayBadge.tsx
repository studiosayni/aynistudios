// Signals that a card plays in place rather than navigating away. Sits quietly
// at rest and picks up the brand amber on hover/focus of the parent card, so it
// reads as an affordance without competing with the artwork underneath.
export default function PlayBadge() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#080F11]/55 text-white/90 backdrop-blur-[2px] ring-1 ring-white/20 transition-all duration-300 group-hover:bg-[#FEB040] group-hover:text-[#080F11] group-hover:ring-[#FEB040] group-hover:scale-110 group-focus-visible:bg-[#FEB040] group-focus-visible:text-[#080F11]">
        <svg className="ml-0.5 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}
