import React from "react";
import { getResend, resendFrom, adminEmail } from "./email";
import { generateInvoicePDF } from "./generateInvoicePDF";
import type { Client, Invoice, Project } from "./types";
import { formatCurrency } from "./currency";
import InvoiceIssuedEmail from "../emails/InvoiceIssuedEmail";
import PaymentConfirmedEmail from "../emails/PaymentConfirmedEmail";
import AdminPaymentAlertEmail from "../emails/AdminPaymentAlertEmail";

// Server-only. These wrap Resend + PDF + React email together so route handlers
// don't have to juggle all three.

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const ZELLE = process.env.NEXT_PUBLIC_ZELLE_CONTACT || "studiosayni@gmail.com";

type Ctx = { invoice: Invoice; project: Project; client: Client };

async function renderInvoicePdfAttachment(ctx: Ctx): Promise<{
  filename: string;
  content: string;
} | null> {
  try {
    const pdf = await generateInvoicePDF(ctx);
    const label = ctx.invoice.status === "Paid" ? "receipt" : "invoice";
    return {
      filename: `${label}-${ctx.invoice.invoiceNumber}.pdf`,
      content: pdf.toString("base64"),
    };
  } catch (err) {
    console.error("PDF generation failed (non-fatal):", err);
    return null;
  }
}

export async function sendInvoiceIssuedEmail(ctx: Ctx): Promise<void> {
  const attachment = await renderInvoicePdfAttachment(ctx);
  const payUrl = `${BASE_URL}/pay/${ctx.invoice.id}`;

  await getResend().emails.send({
    from: resendFrom(),
    to: ctx.client.contactEmail,
    subject: `Invoice ${ctx.invoice.invoiceNumber} — ${formatCurrency(
      ctx.invoice.amount,
      ctx.invoice.currency
    )} due`,
    react: React.createElement(InvoiceIssuedEmail, {
      invoice: ctx.invoice,
      project: ctx.project,
      client: ctx.client,
      payUrl,
      zelleContact: ZELLE,
    }),
    ...(attachment ? { attachments: [attachment] } : {}),
  });
}

export async function sendPaymentConfirmedEmails(ctx: Ctx): Promise<void> {
  const attachment = await renderInvoicePdfAttachment(ctx);

  await Promise.all([
    getResend().emails.send({
      from: resendFrom(),
      to: ctx.client.contactEmail,
      subject: `Payment received — ${ctx.invoice.invoiceNumber}`,
      react: React.createElement(PaymentConfirmedEmail, {
        invoice: ctx.invoice,
        project: ctx.project,
        client: ctx.client,
      }),
      ...(attachment ? { attachments: [attachment] } : {}),
    }),
    getResend().emails.send({
      from: resendFrom(),
      to: adminEmail(),
      subject: `${formatCurrency(
        ctx.invoice.amount,
        ctx.invoice.currency
      )} received — ${ctx.invoice.invoiceNumber} (${ctx.invoice.paymentMethod})`,
      react: React.createElement(AdminPaymentAlertEmail, {
        invoice: ctx.invoice,
        project: ctx.project,
        client: ctx.client,
      }),
    }),
  ]);
}
