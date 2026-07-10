import type { Currency } from "./types";

// Format a number as a currency string appropriate for the chosen currency.
// Used by the Invoice PDF, payment page, and admin UI.
export function formatCurrency(amount: number, currency: Currency): string {
  const locale = currency === "AED" ? "en-AE" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Stripe expects the smallest currency unit (cents for USD, fils for AED).
// Both USD and AED are 2-decimal currencies, so multiply by 100.
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}

export function fromStripeAmount(amount: number): number {
  return amount / 100;
}
