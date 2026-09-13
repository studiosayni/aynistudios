import { createHash } from "node:crypto";
import { Resend } from "resend";
import { SITE_URL, STUDIO_EMAIL } from "../../lib/publicContent";
import { inquiryText, validateInquiry } from "../../lib/inquiry";

export const runtime = "nodejs";
// Bounded, per-instance abuse control. No project details or raw IPs are stored.
const attempts = new Map<string, { count: number; expires: number }>();
const WINDOW = 15 * 60 * 1000;
function limited(key: string) {
  const now = Date.now();
  for (const [k, v] of attempts) if (v.expires <= now) attempts.delete(k);
  const current = attempts.get(key);
  if (current && current.expires > now) {
    current.count++;
    return current.count > 5;
  }
  if (attempts.size >= 2000) return true;
  attempts.set(key, { count: 1, expires: now + WINDOW });
  return false;
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    ![new URL(SITE_URL).origin, new URL(request.url).origin].includes(origin)
  )
    return Response.json(
      { error: "This request must come from the Ayni Studios website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json(
      { error: "Unsupported request format." },
      { status: 415 },
    );
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 20000)
    return Response.json({ error: "Your brief is too long." }, { status: 413 });
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return Response.json(
      { error: "Unable to read your brief." },
      { status: 400 },
    );
  }
  if (Buffer.byteLength(raw) > 20000)
    return Response.json({ error: "Your brief is too long." }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json(
      { error: "Unable to read your brief." },
      { status: 400 },
    );
  }
  const result = validateInquiry(body);
  if (!result.ok)
    return Response.json({ error: result.message }, { status: 400 });
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256").update(ip).digest("hex");
  if (limited(key))
    return Response.json(
      { error: "Please try again later, or email us directly." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  if (!process.env.RESEND_API_KEY)
    return Response.json(
      {
        error:
          "The form is temporarily unavailable. Please email humanity@ayni-studios.com; your brief is still here to copy.",
      },
      { status: 503 },
    );
  try {
    const delivery = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.RESEND_FROM || `Ayni Studios <${STUDIO_EMAIL}>`,
      to: STUDIO_EMAIL,
      replyTo: result.data.email,
      subject: `New project inquiry: ${result.data.service}`,
      text: inquiryText(result.data),
    });
    if (delivery.error) throw new Error("Email provider rejected inquiry");
    return Response.json({ ok: true });
  } catch {
    // Do not log personal details or provider payloads.
    console.error("Project inquiry delivery failed.");
    return Response.json(
      {
        error:
          "We could not send your brief. Please try again or email humanity@ayni-studios.com. Your text has been kept.",
      },
      { status: 502 },
    );
  }
}
