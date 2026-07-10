import { type NextRequest } from "next/server";

// Simple server-side admin gate for privileged API routes (mark-paid,
// send-invoice-email, etc.). The client admin UI passes ADMIN_API_KEY
// via the `x-admin-key` header. For post-scaffold deployment this should
// be replaced with Firebase Admin SDK ID-token verification against the
// _allowlist collection.

export function requireAdmin(request: NextRequest): Response | null {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return new Response("ADMIN_API_KEY not configured", { status: 500 });
  }
  const given = request.headers.get("x-admin-key");
  if (given !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}
