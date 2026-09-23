import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const nativeRequire = createRequire(import.meta.url);
function load(relative, dependencies = {}, env = {}) {
  const path = new URL(relative, import.meta.url);
  const js = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(
    js,
    {
      module: testModule,
      exports: testModule.exports,
      require: (id) =>
        id in dependencies ? dependencies[id] : nativeRequire(id),
      process: { env },
      console: { error() {}, warn() {} },
      Request,
      Response,
      URL,
      Buffer,
      Date,
      Set,
      Map,
    },
    { filename: path.pathname },
  );
  return testModule.exports;
}
const inquiry = load("../app/lib/inquiry.ts");
const content = load("../app/lib/publicContent.ts");
const storytelling = load("../app/lib/storytellingContent.ts");
const good = {
  name: "Test producer",
  email: "producer@example.com",
  organization: "Example organization",
  service: "Documentary production",
  timeline: "Autumn",
  budget: "USD 5,000–10,000",
  brief: "We would like to discuss a documentary about local conservation.",
  website: "",
};
function route({ key = "test-key", providerError = false } = {}) {
  const sent = [];
  class FakeResend {
    emails = {
      send: async (message) => {
        sent.push(message);
        return providerError
          ? { error: { message: "Provider unavailable" } }
          : { data: { id: "test-message" } };
      },
    };
  }
  const api = load(
    "../app/api/inquiry/route.ts",
    {
      resend: { Resend: FakeResend },
      "../../lib/inquiry": inquiry,
      "../../lib/publicContent": content,
    },
    { RESEND_API_KEY: key },
  );
  return { sent, POST: api.POST };
}
function request(body = good, headers = {}) {
  return new Request("https://ayni-studios.com/api/inquiry", {
    method: "POST",
    headers: {
      origin: "https://ayni-studios.com",
      "content-type": "application/json",
      "x-forwarded-for": "192.0.2.5",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("all project/service/film references resolve and public slugs are unique", () => {
  for (const list of [content.projects, content.services, content.films])
    assert.equal(new Set(list.map((i) => i.slug)).size, list.length);
  for (const p of content.projects) {
    for (const slug of p.serviceSlugs)
      assert.ok(content.services.some((s) => s.slug === slug));
    for (const id of p.filmIds || [])
      assert.ok(content.films.some((f) => f.youtubeId === id));
  }
  for (const service of content.services) {
    for (const slug of service.projectSlugs)
      assert.ok(content.projects.some((project) => project.slug === slug));
  }
  for (const guide of storytelling.guides) {
    assert.ok(content.isPublicPath(`/guides/${guide.slug}`));
    for (const slug of guide.serviceSlugs)
      assert.ok(content.services.some((service) => service.slug === slug));
    for (const slug of guide.projectSlugs)
      assert.ok(content.projects.some((project) => project.slug === slug));
  }
  for (const slug of Object.keys(storytelling.serviceQuestions))
    assert.ok(content.services.some((service) => service.slug === slug));
  for (const f of content.films) {
    assert.match(f.youtubeId, /^[\w-]{11}$/);
    if (f.uploadDate) assert.ok(Number.isFinite(Date.parse(f.uploadDate)));
    for (const slug of f.serviceSlugs || [])
      assert.ok(content.services.some((service) => service.slug === slug));
    if (f.projectSlug)
      assert.ok(content.projects.some((p) => p.slug === f.projectSlug));
  }
});
test("location, dates, and service artwork are consistent", () => {
  assert.ok(content.isPublicPath(content.LOCATION_PATH));
  assert.ok(content.isPublicPath(`${content.LOCATION_PATH}/`));
  for (const [path, date] of Object.entries(content.PAGE_UPDATED)) {
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, path);
    assert.ok(Number.isFinite(Date.parse(date)), path);
    assert.ok(content.isPublicPath(path), path);
  }
  for (const service of content.services)
    assert.ok(content.PAGE_UPDATED[`/services/${service.slug}`], service.slug);
  for (const project of content.projects)
    assert.ok(content.PAGE_UPDATED[`/work/${project.slug}`], project.slug);
  for (const guide of storytelling.guides)
    assert.ok(content.PAGE_UPDATED[`/guides/${guide.slug}`], guide.slug);
  for (const service of content.services) {
    const art = content.serviceArt[service.slug];
    assert.ok(art?.image && art?.alt, service.slug);
    if (art.image.startsWith("/"))
      assert.ok(existsSync(new URL(`../public${art.image}`, import.meta.url)), art.image);
  }
  assert.ok(content.STUDIO_GEO.latitude > 34 && content.STUDIO_GEO.latitude < 35);
  assert.ok(content.STUDIO_GEO.longitude < -118 && content.STUDIO_GEO.longitude > -119);
  assert.match(content.LOCATION_STATEMENT, /Valencia, California/);
  assert.match(content.LOCATION_STATEMENT, /Los Angeles/);
});
test("organization schema is a local business with a founder and a map", () => {
  const seo = load("../app/lib/seo.ts", { "./publicContent": content });
  // Cross-realm arrays are never reference-equal; compare the serialization.
  assert.equal(JSON.stringify(seo.organization["@type"]), JSON.stringify(["Organization", "LocalBusiness"]));
  assert.equal(seo.organization.geo["@type"], "GeoCoordinates");
  assert.equal(seo.organization.founder["@type"], "Person");
  assert.match(seo.organization.hasMap, /google\.com\/maps/);
  assert.ok(seo.organization.areaServed.some((a) => a.name === "Los Angeles"));
  assert.equal(seo.website["@type"], "WebSite");
  const faq = seo.faqPage([{ question: "Q?", answer: "A." }]);
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, "A.");
});
test("www and /work redirect permanently", async () => {
  const config = load("../next.config.ts");
  const redirects = await (config.default ?? config).redirects();
  const www = redirects.find((r) => r.has?.some((h) => h.value === "www.ayni-studios.com"));
  assert.ok(www?.permanent);
  assert.match(www.destination, /^https:\/\/ayni-studios\.com\//);
  const work = redirects.find((r) => r.source === "/work");
  assert.equal(work?.destination, "/library");
  assert.ok(work?.permanent);
});
test("titles and descriptions fit the search result budget", () => {
  const seo = load("../app/lib/seo.ts", { "./publicContent": content });
  // Brand kept when it fits, dropped (never cut) when it does not.
  assert.equal(seo.fitTitle("Documentary production"), "Documentary production | Ayni Studios");
  const long = "Soaring Through the Amazon Rainforest: Canopy Zipline Experience";
  assert.equal(seo.fitTitle(long), long);
  assert.ok(seo.titleWidth("Documentary & Impact Video Production, LA | Ayni Studios") <= seo.TITLE_BUDGET_PX);
  // Short copy passes through untouched, never padded.
  assert.equal(seo.clampDescription("Ships flat."), "Ships flat.");
  // A sentence end at or past 60% of the budget wins.
  const twoSentences = `${"a".repeat(100)}. ${"b".repeat(80)}.`;
  assert.equal(seo.clampDescription(twoSentences), `${"a".repeat(100)}.`);
  // An early sentence end does not; cut at a word with an ellipsis instead.
  const early = `Short one. ${"word ".repeat(40)}`;
  const cut = seo.clampDescription(early);
  assert.ok(cut.length <= seo.DESCRIPTION_BUDGET && cut.endsWith("…") && !cut.endsWith(" …"));
  // A period the budget only appears to end on is not a sentence end.
  const dotted = `${"x".repeat(150)} U.S.A. ${"y ".repeat(20)}`;
  assert.ok(!seo.clampDescription(dotted).endsWith("U."));
  // The metadata carries the clamped values; social cards get the looser budget.
  const meta = seo.pageMetadata("Test", `${"word ".repeat(50)}`, "/test");
  assert.ok(meta.description.length <= seo.DESCRIPTION_BUDGET);
  assert.ok(meta.openGraph.description.length > meta.description.length);
  assert.ok(meta.openGraph.description.length <= seo.SOCIAL_DESCRIPTION_BUDGET);
});

test("AI agents get their own robots group with the full disallow list", () => {
  const robots = load("../app/robots.ts", { "./lib/publicContent": content });
  const rules = (robots.default ?? robots)().rules;
  const all = rules.find((r) => r.userAgent === "*");
  const ai = rules.find((r) => Array.isArray(r.userAgent));
  for (const agent of ["GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "PerplexityBot"]) {
    assert.ok(ai.userAgent.includes(agent), agent);
  }
  assert.ok(!ai.userAgent.includes("Googlebot"));
  // A crawler obeys only its most specific group, so the lists must match.
  assert.deepEqual([...ai.disallow], [...all.disallow]);
  // Portal pages rely on a noindex header, which a Disallow would hide.
  assert.ok(!all.disallow.some((p) => /login|admin|workspace/.test(p)));
});

test("exactly one IndexNow key file, containing its own name", async () => {
  const { readdirSync } = await import("node:fs");
  const dir = new URL("../public/", import.meta.url);
  const keys = readdirSync(dir).filter((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  assert.equal(keys.length, 1);
  assert.equal(readFileSync(new URL(keys[0], dir), "utf8").trim(), keys[0].replace(".txt", ""));
});

test("portal and sign-in pages send a noindex header", async () => {
  const config = load("../next.config.ts");
  const headers = await (config.default ?? config).headers();
  for (const prefix of ["/admin", "/workspace", "/login", "/signup", "/complete-profile"]) {
    const rule = headers.find((h) => h.source === `${prefix}/:path*`);
    assert.ok(rule?.headers.some((h) => h.key === "X-Robots-Tag" && /noindex/.test(h.value)), prefix);
  }
});

test("inquiry validation rejects malformed, oversized, and automated submissions", () => {
  for (const payload of [
    null,
    {},
    { ...good, email: "bad\r\nBcc: victim@example.com" },
    { ...good, brief: "Too short" },
    { ...good, brief: "a".repeat(5001) },
    { ...good, service: "Arbitrary service" },
    { ...good, website: "spam.example" },
    { ...good, name: "a".repeat(101) },
  ])
    assert.equal(inquiry.validateInquiry(payload).ok, false);
  assert.equal(inquiry.validateInquiry(good).ok, true);
});
test("inquiry rejects foreign origins before contacting email provider", async () => {
  const api = route();
  const res = await api.POST(
    request(good, { origin: "https://unrelated.example" }),
  );
  assert.equal(res.status, 403);
  assert.equal(api.sent.length, 0);
});
test("inquiry rejects oversized and invalid bodies without sending email", async () => {
  const api = route();
  assert.equal(
    (await api.POST(request({ ...good, brief: "x".repeat(21000) }))).status,
    413,
  );
  assert.equal((await api.POST(request({}))).status, 400);
  assert.equal(api.sent.length, 0);
});
test("successful inquiry goes only to the studio and uses the validated reply address", async () => {
  const api = route();
  const res = await api.POST(request({ ...good, to: "attacker@example.com" }));
  assert.equal(res.status, 200);
  assert.equal(api.sent.length, 1);
  assert.equal(api.sent[0].to, "humanity@ayni-studios.com");
  assert.equal(api.sent[0].replyTo, good.email);
  assert.match(api.sent[0].text, /local conservation/);
});
test("missing configuration and provider failure never report success", async () => {
  const absent = route({ key: "" });
  assert.equal((await absent.POST(request())).status, 503);
  assert.equal(absent.sent.length, 0);
  const failed = route({ providerError: true });
  const res = await failed.POST(request());
  assert.equal(res.status, 502);
  assert.ok((await res.json()).error);
});
test("repeated submissions are rate limited before another send", async () => {
  const api = route();
  for (let i = 0; i < 5; i++)
    assert.equal((await api.POST(request())).status, 200);
  const res = await api.POST(request());
  assert.equal(res.status, 429);
  assert.equal(res.headers.get("retry-after"), "900");
  assert.equal(api.sent.length, 5);
});
