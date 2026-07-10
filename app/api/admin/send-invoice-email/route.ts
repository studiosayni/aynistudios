import { type NextRequest } from "next/server";
import { requireAdmin } from "../../../lib/adminAuth";
import { getInvoice, getProject, getClient, markInvoiceSent } from "../../../lib/payments";

// Admin-only. Emails the invoice to the client with the Stripe pay-link +
// Zelle/bank fallback, and flips the invoice from Draft → Sent.

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { invoiceId } = (await request.json()) as { invoiceId?: string };
    if (!invoiceId) {
      return Response.json({ error: "invoiceId required" }, { status: 400 });
    }

    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }
    const [project, client] = await Promise.all([
      getProject(invoice.projectId),
      getClient(invoice.clientId),
    ]);
    if (!project || !client) {
      return Response.json({ error: "Project or client missing" }, { status: 500 });
    }

    const { sendInvoiceIssuedEmail } = await import("../../../lib/emailSenders");
    await sendInvoiceIssuedEmail({ invoice, project, client });

    if (invoice.status === "Draft") {
      await markInvoiceSent(invoice.id);
    }

    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("send-invoice-email error:", err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
