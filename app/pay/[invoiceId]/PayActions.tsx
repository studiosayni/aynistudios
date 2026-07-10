"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function PayActions({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  async function payWithStripe() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast.error(msg);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={payWithStripe}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[#FEB040] bg-[#FEB040] px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#080F11] transition hover:bg-[#FEB040]/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Redirecting…" : "Pay with card (Stripe)"}
    </button>
  );
}
