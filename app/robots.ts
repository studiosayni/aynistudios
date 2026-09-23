import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/publicContent";

// Paths no crawler should fetch, shared by both groups below. A crawler obeys
// the ONE most specific group that names it and ignores `*` entirely, so the
// AI group has to repeat this list or those agents are let into it.
//   /api/  JSON endpoints; nothing to read.
//   /pay/  invoice pages behind unguessable IDs. They carry noindex too, but
//          the point here is that no crawler fetches an invoice at all.
// The portal and sign-in pages (/admin, /workspace, /login, /signup,
// /complete-profile) are deliberately NOT here: they send an X-Robots-Tag
// noindex header (next.config.ts), and a crawler only sees that header on a
// path it is allowed to fetch. Disallowing them as well would hide the
// noindex, and the Client login link on every page would keep /login in the
// index as a bare URL.
const DISALLOW = ["/api/", "/pay/"];

// AI crawlers and assistants, named explicitly. `*` already allows them, so
// this changes no behaviour today. It states an intent that was only
// implicit: we want the studio, its films and its guides in AI answers,
// because someone asking an assistant for a documentary or NGO film partner is
// a prospective client. Left implicit, a future "tighten robots.txt" edit
// blocks them as a side effect and nothing reports it.
//
// Google-Extended and Applebot-Extended fetch nothing: they are permission
// tokens for using already-crawled pages in Gemini and Apple Intelligence.
// Googlebot stays under `*` for normal search. Grouped by operator, so
// pulling one vendor is one edit. (Same list as rinkproducts.com; see
// Noah95/rink-products/ai-seo-playbook-2026-09.md section 4.1.)
const AI_AGENTS = [
  // OpenAI: training crawler, ChatGPT search index, live user-initiated fetch.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic: the same three roles.
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Google: permission token for Gemini.
  "Google-Extended",
  // Apple: permission token for Apple Intelligence.
  "Applebot-Extended",
  // Perplexity: index crawler and live user-initiated fetch.
  "PerplexityBot",
  "Perplexity-User",
  // Meta AI.
  "meta-externalagent",
  // Common Crawl: its corpus feeds many open training sets, the cheapest
  // route into what models know about the studio without searching.
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_AGENTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
