import { Resend } from "resend";

// Lazy Resend singleton. Server-only.
// `RESEND_API_KEY` lives in Cloud Secret Manager / .env.local.

let resend: Resend | null = null;

export function getResend(): Resend {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  resend = new Resend(key);
  return resend;
}

export function resendFrom(): string {
  return (
    process.env.RESEND_FROM || "Ayni Studios <humanity@ayni-studios.com>"
  );
}

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL || "humanity@ayni-studios.com";
}
