import { BOOKING_URL } from "../../lib/publicContent";

// Our own address for the booking calendar. Machine-readable surfaces
// (llms.txt) publish /book/ai, never the calendar link behind it, so a copy an
// assistant cached stays correct if the scheduler ever moves, and so those
// arrivals are countable: a bare calendar link would reach Google Calendar
// with no trace of where it came from. Each hit writes one log line to App
// Hosting's Cloud Logging; filter on jsonPayload.event="book_redirect".
// Read the count as a floor. It only sees assistants that pass the link
// through verbatim to a person who then clicks it. `bot` separates the
// assistants' own fetches of the link from people.
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ source?: string[] }> },
) {
  const { source } = await params;
  const ua = request.headers.get("user-agent") || "";
  console.log(
    JSON.stringify({
      event: "book_redirect",
      source: source?.join("/").slice(0, 40) || "direct",
      bot: /bot|crawl|spider|-user\b|preview|fetch|curl|wget|python/i.test(ua),
      ua: ua.slice(0, 120),
    }),
  );
  return Response.redirect(BOOKING_URL, 307);
}
