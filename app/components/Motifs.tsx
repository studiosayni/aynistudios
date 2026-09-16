// Line-drawn motifs for the two light bands: terraces, a stepped diamond, a
// river zigzag, a sun, a fern, and the aperture spiral from the mark. They are
// abstract references to Andean weaving and the landscapes we film in, drawn
// generically on purpose: no specific community's iconography is reproduced.
// Everything strokes with currentColor so the parent sets tone and opacity.

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Terrace() {
  return (
    <g {...stroke}>
      <path d="M0 48h16v-8h16v-8h16v-8h16v-8h16v-8h16" />
      <path d="M0 64h16v-8h16v-8h16v-8h16v-8h16v-8h16" />
    </g>
  );
}
function StepDiamond() {
  return (
    <g {...stroke}>
      <path d="M30 0h8v6h6v6h6v6h6v8h-6v6h-6v6h-6v6h-8v-6h-6v-6h-6v-6h-6v-8h6v-6h6v-6h6z" />
      <path d="M31 16h6v6h6v6h-6v6h-6v-6h-6v-6h6z" />
    </g>
  );
}
function River() {
  return (
    <g {...stroke}>
      <path d="M0 10l12-8 12 8 12-8 12 8 12-8 12 8 12-8 12 8 12-8 12 8" />
      <path d="M0 24l12-8 12 8 12-8 12 8 12-8 12 8 12-8 12 8 12-8 12 8" />
    </g>
  );
}
function Sun() {
  return (
    <g {...stroke}>
      <circle cx="24" cy="24" r="9" />
      <path d="M24 3v7M24 38v7M3 24h7M38 24h7M9 9l5 5M34 34l5 5M39 9l-5 5M14 34l-5 5" />
    </g>
  );
}
function Fern() {
  return (
    <g {...stroke} strokeWidth={1.5}>
      <path d="M20 90C20 60 22 30 30 4" />
      <path d="M22 70c-8-2-14-8-16-16M23 56c-8-3-12-9-13-17M25 42c-7-3-10-9-10-16M27 30c-6-3-8-8-7-14" />
      <path d="M22 70c8 0 14-5 18-12M23 56c8 0 13-5 16-12M25 42c7-1 11-5 13-11M27 30c6-1 9-4 10-9" />
    </g>
  );
}
function Spiral() {
  return (
    <g {...stroke}>
      <path d="M30 30c0-6 5-9 10-8 7 1 11 8 9 15-2 9-12 14-21 11-11-3-16-15-12-26 5-13 20-19 33-13 15 7 21 25 13 40" />
    </g>
  );
}
function Ridge() {
  return (
    <g {...stroke}>
      <path d="M0 40l22-22 14 12 20-26 18 20 12-10 26 26" />
      <path d="M0 52l22-14 14 8 20-16 18 12 12-6 26 16" />
    </g>
  );
}

const at = (x: number, y: number, scale = 1) =>
  `translate(${x} ${y})${scale !== 1 ? ` scale(${scale})` : ""}`;

// A loose cluster: terraces and a ridge along the edges, the sun, diamond,
// fern and spiral in between. Sized to sit in a panel corner.
export function MotifCluster({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 420 420" aria-hidden="true" focusable="false">
      <g transform={at(220, 20)}><Terrace /></g>
      <g transform={at(320, 20)}><Terrace /></g>
      <g transform={at(172, 84, 1.3)}><StepDiamond /></g>
      <g transform={at(330, 150)}><Sun /></g>
      <g transform={at(180, 240)}><River /></g>
      <g transform={at(300, 240)}><River /></g>
      <g transform={at(250, 280)}><Fern /></g>
      <g transform={at(330, 300)}><Spiral /></g>
      <g transform={at(60, 360)}><Ridge /></g>
      <g transform={at(200, 360)}><Ridge /></g>
    </svg>
  );
}

// A repeating terrace strip for the bottom edge of a full-width band.
export function MotifBand({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="ayni-terrace" width="96" height="70" patternUnits="userSpaceOnUse">
          <Terrace />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ayni-terrace)" />
    </svg>
  );
}
