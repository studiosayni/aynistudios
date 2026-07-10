import Stripe from "stripe";

// Server-only Stripe singleton. Never import this from a client component.
// Uses `STRIPE_SECRET_KEY` from the environment (Cloud Secret Manager in prod,
// `.env.local` in dev — must hold a `sk_test_...` key locally).

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  stripe = new Stripe(key);
  return stripe;
}
