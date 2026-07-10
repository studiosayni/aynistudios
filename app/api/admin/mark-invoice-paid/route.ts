import { type NextRequest } from "next/server";
import { requireAdmin } from "../../../lib/adminAuth";
import { markInvoicePaid } from "../../../lib/payments";
import type { PaymentMethod } from "../../../lib/types";

// Admin-only. Used for off-platform payments (Zelle, wire transfer) where
// the admin has external confirmation the money landed.

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      invoiceId?: string;
      paymentMethod?: PaymentMethod;
      note?: string;
    };
    if (!body.invoiceId || !body.paymentMethod) {
      return Response.json(
        { error: "invoiceId and paymentMethod are required" },
        { status: 400 }
      );
    }
    if (body.paymentMethod === "Stripe") {
      return Response.json(
        { error: "Stripe payments are confirmed via webhook, not this route" },
        { status: 400 }
      );
    }

    await markInvoicePaid({
      invoiceId: body.invoiceId,
      paymentMethod: body.paymentMethod,
      note: body.note,
    });

    // Fire confirmation emails (non-fatal if they fail).
    try {
      const { getInvoice, getProject, getClient } = await import(
        "../../../lib/payments"
      );
      const invoice = await getInvoice(body.invoiceId);
      if (invoice) {
        const [project, client] = await Promise.all([
          getProject(invoice.projectId),
          getClient(invoice.clientId),
        ]);
        if (project && client) {
          const { sendPaymentConfirmedEmails } = await import(
            "../../../lib/emailSenders"
          );
          await sendPaymentConfirmedEmails({ invoice, project, client });
        }
      }
    } catch (emailErr) {
      console.error("Email send failed (non-fatal):", emailErr);
    }

    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("mark-invoice-paid error:", err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
