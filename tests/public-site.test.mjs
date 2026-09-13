import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
    if (f.projectSlug)
      assert.ok(content.projects.some((p) => p.slug === f.projectSlug));
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
