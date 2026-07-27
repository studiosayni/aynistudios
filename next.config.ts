import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },

  async headers() {
    return [
      {
        // Everything under public/ ships with `Cache-Control: public,
        // max-age=0` by default, because Next cannot fingerprint filenames it
        // does not control — so every visit re-downloaded the hero stills, the
        // ~1.4MB word-cloud video and all twelve partner logos. (Hashed
        // /_next/static assets already get a year + immutable in production,
        // which is how we know App Hosting honours these headers.)
        //
        // Deliberately not `immutable`: these filenames are stable, so a
        // year-long immutable cache would strand returning visitors on an old
        // hero image long after it was replaced. A day of freshness plus a
        // week of stale-while-revalidate keeps repeat visits instant while
        // still picking up swapped artwork quickly. If this ever needs harder
        // caching, give the assets content-hashed filenames first.
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
