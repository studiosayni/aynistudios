#!/usr/bin/env node
/**
 * Tell the IndexNow search engines that pages on ayni-studios.com changed.
 *
 * IndexNow is a ping, not a ranking signal: one POST and the participating
 * engines (Bing, Yandex, Seznam, Naver, Yep) re-fetch those URLs within days
 * instead of whenever their crawler next comes round. Bing is the one that
 * matters here: Copilot answers from it directly and ChatGPT search draws on
 * it in part. Google does not take part; Search Console and the sitemap
 * cover Google.
 *
 * Ownership is proven by the key file public/<key>.txt, which contains its
 * own name. The engines fetch it, so run this only once the deploy carrying
 * it is live; the script checks that first and stops if it is not.
 *
 * Submit only what changed. Pinging unchanged URLs teaches the engines to
 * ignore the pings.
 *
 * Usage (zero dependencies, Node 20+):
 *   node scripts/indexnow.mjs --all                    # every sitemap URL plus /llms.txt (first run, or a sitewide change)
 *   node scripts/indexnow.mjs --since 2026-09-22       # sitemap URLs whose lastmod is on or after the date
 *   node scripts/indexnow.mjs /films/x /guides/y       # just these paths
 *   add --dry-run to print the list without sending
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://ayni-studios.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const sinceAt = args.indexOf("--since");
const since = sinceAt >= 0 ? args[sinceAt + 1] : null;
const paths = args.filter((a, i) => !a.startsWith("--") && (sinceAt < 0 || i !== sinceAt + 1));

if (!all && !since && !paths.length) {
  console.error("Say what changed: --all, --since YYYY-MM-DD, or one or more paths. See the header.");
  process.exit(2);
}

// The key is whichever public/*.txt file contains exactly its own name.
const publicDir = join(import.meta.dirname, "..", "public");
const key = readdirSync(publicDir)
  .map((f) => /^([A-Za-z0-9-]{8,128})\.txt$/.exec(f)?.[1])
  .find((k) => k && readFileSync(join(publicDir, `${k}.txt`), "utf8").trim() === k);
if (!key) {
  console.error("No IndexNow key file in public/ (a <key>.txt containing its own name).");
  process.exit(2);
}
const keyLocation = `${SITE}/${key}.txt`;

async function sitemapEntries() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: /<loc>([^<]+)<\/loc>/.exec(block)?.[1],
    lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1],
  }));
}

let urlList;
if (paths.length) {
  urlList = paths.map((p) => (p.startsWith("http") ? p : `${SITE}${p.startsWith("/") ? p : `/${p}`}`));
} else {
  const entries = await sitemapEntries();
  urlList = entries
    .filter((e) => e.loc && (all || (e.lastmod && e.lastmod.slice(0, 10) >= since)))
    .map((e) => e.loc);
  if (all) urlList.push(`${SITE}/llms.txt`);
}
// The sitemap lists the homepage without its trailing slash.
urlList = [...new Set(urlList.map((u) => (u === SITE ? `${SITE}/` : u)))].filter((u) => u.startsWith(`${SITE}/`));

console.log(`${urlList.length} URL(s)${dryRun ? " (dry run, nothing sent)" : ""}:`);
for (const u of urlList) console.log(`  ${u}`);
if (dryRun || !urlList.length) process.exit(0);

const live = await fetch(keyLocation).then((r) => (r.ok ? r.text() : "")).catch(() => "");
if (live.trim() !== key) {
  console.error(`${keyLocation} is not live yet. Deploy first, then run this again.`);
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation, urlList }),
});
// 200 received; 202 received, key still being validated (normal on the first
// submission); 400 bad request; 403 key not valid; 422 URLs not on this
// host; 429 too many requests.
const meaning = { 200: "accepted", 202: "accepted, key validation pending", 400: "bad request", 403: "key not valid", 422: "URLs do not match the host or key", 429: "too many requests, slow down" };
console.log(`IndexNow: ${res.status} ${meaning[res.status] ?? res.statusText}`);
const body = await res.text();
if (body) console.log(body.slice(0, 500));
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
