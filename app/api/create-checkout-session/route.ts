import { NextRequest } from "next/server";
import { getStripe } from "../../lib/stripe";
import { getInvoice, getClient, getProject } from "../../lib/payments";
import { toStripeAmount } from "../../lib/currency";

// Creates a Stripe Checkout session for a pending invoice.
// The invoice ID (Firestore auto-ID) acts as the secret payment token —
// anyone with the link can initiate payment, but the invoice amount is fixed.

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = (await request.json()) as { invoiceId?: string };
    if (!invoiceId) {
      return Response.json({ error: "invoiceId required" }, { status: 400 });
    }

    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }
    if (invoice.status === "Paid") {
      return Response.json({ error: "Invoice already paid" }, { status: 409 });
    }
    if (invoice.status === "Void") {
      return Response.json({ error: "Invoice is void" }, { status: 410 });
    }

    const [project, client] = await Promise.all([
      getProject(invoice.projectId),
      getClient(invoice.clientId),
    ]);
    if (!project || !client) {
      return Response.json({ error: "Project or client missing" }, { status: 500 });
    }

    const stripe = getStripe();
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // One line item covering the full invoice amount. Line-item descriptions
    // are snapshotted into the invoice itself — Stripe just needs a total.
    const productName = invoice.milestoneLabel
      ? `${project.title} — ${invoice.milestoneLabel}`
      : project.title;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: client.contactEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: invoice.currency.toLowerCase(),
            unit_amount: toStripeAmount(invoice.amount),
            product_data: {
              name: productName,
              description: `Invoice ${invoice.invoiceNumber}`,
            },
          },
        },
      ],
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        projectId: project.id,
        clientId: client.id,
      },
      success_url: `${baseUrl}/pay/${invoice.id}?paid=1`,
      cancel_url: `${baseUrl}/pay/${invoice.id}?canceled=1`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout session error:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}
