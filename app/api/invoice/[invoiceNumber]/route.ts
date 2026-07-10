import { type NextRequest } from "next/server";
import { getInvoiceByNumber, getProject, getClient } from "../../../lib/payments";
import { generateInvoicePDF } from "../../../lib/generateInvoicePDF";

// Public download endpoint for invoice / receipt PDFs.
// Email is required + must match the invoice's client.contactEmail to prevent
// enumeration via sequential invoice numbers.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  const { invoiceNumber } = await params;
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return new Response("Missing email parameter", { status: 400 });
  }

  try {
    const invoice = await getInvoiceByNumber(invoiceNumber.toUpperCase());
    if (!invoice) return new Response("Invoice not found", { status: 404 });

    const [project, client] = await Promise.all([
      getProject(invoice.projectId),
      getClient(invoice.clientId),
    ]);
    if (!project || !client) {
      return new Response("Project or client missing", { status: 500 });
    }

    if (client.contactEmail.toLowerCase() !== email.toLowerCase()) {
      return new Response("Unauthorized", { status: 403 });
    }

    const pdfBuffer = await generateInvoicePDF({ invoice, project, client });

    const label = invoice.status === "Paid" ? "receipt" : "invoice";
    const filename = `${label}-${invoice.invoiceNumber}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err) {
    console.error("Invoice PDF generation error:", err);
    return new Response("Failed to generate invoice", { status: 500 });
  }
}
