import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../lib/stripe";

// Stripe requires the raw body for signature verification.
// Must NOT use any middleware/parsing — keep this route minimal.

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Stripe webhook signature failed:", msg);
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("OK", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const invoiceId = session.metadata?.invoiceId;
  if (!invoiceId) {
    console.warn("Webhook: missing invoiceId metadata");
    return new Response("OK", { status: 200 });
  }

  try {
    const { markInvoicePaid, getInvoice, getProject, getClient } = await import(
      "../../lib/payments"
    );
    await markInvoicePaid({
      invoiceId,
      paymentMethod: "Stripe",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
    });

    // Fire confirmation emails (non-fatal if they fail).
    try {
      const [invoice, project, client] = await Promise.all([
        getInvoice(invoiceId),
        getInvoice(invoiceId).then((inv) =>
          inv ? getProject(inv.projectId) : null
        ),
        getInvoice(invoiceId).then((inv) =>
          inv ? getClient(inv.clientId) : null
        ),
      ]);
      if (invoice && project && client) {
        const { sendPaymentConfirmedEmails } = await import(
          "../../lib/emailSenders"
        );
        await sendPaymentConfirmedEmails({ invoice, project, client });
      }
    } catch (emailErr) {
      console.error("Email send failed (non-fatal):", emailErr);
    }
  } catch (err) {
    console.error("markInvoicePaid failed:", err);
    return new Response("Failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
