import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInvoice, getProject, getClient } from "../../lib/payments";
import { formatCurrency } from "../../lib/currency";
import PayActions from "./PayActions";

export const metadata: Metadata = {
  title: "Pay invoice — Ayni Studios",
  robots: { index: false, follow: false },
};

export default async function PayInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ paid?: string; canceled?: string }>;
}) {
  const { invoiceId } = await params;
  const { paid, canceled } = await searchParams;

  const invoice = await getInvoice(invoiceId);
  if (!invoice) notFound();
  const [project, client] = await Promise.all([
    getProject(invoice.projectId),
    getClient(invoice.clientId),
  ]);
  if (!project || !client) notFound();

  const isPaid = invoice.status === "Paid";
  const issueDate = invoice.issuedAt ?? invoice.createdAt;
  const zelleEmail =
    process.env.NEXT_PUBLIC_ZELLE_CONTACT || "studiosayni@gmail.com";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-2xl flex-col gap-8 px-6 py-14">
      {paid && !isPaid && (
        <div className="rounded-md border border-[#FEB040]/40 bg-[#FEB040]/10 p-4 text-sm text-[#DCE4EB]">
          Thank you — your payment is processing. This page will update once
          we’ve confirmed it.
        </div>
      )}
      {canceled && (
        <div className="rounded-md border border-white/15 bg-white/5 p-4 text-sm text-[#7B878F]">
          Checkout canceled. You can try again below.
        </div>
      )}

      <header className="flex items-start justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#7B878F]">
            {isPaid ? "Receipt" : "Invoice"}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-sm text-[#7B878F]">
            Issued {new Date(issueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {isPaid && (
          <span className="inline-flex items-center rounded-sm bg-[#FEB040] px-3 py-1 text-xs font-bold tracking-[0.3em] text-[#080F11]">
            PAID
          </span>
        )}
      </header>

      <section className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7B878F]">
          Project
        </p>
        <p className="text-lg font-semibold">{project.title}</p>
        <p className="text-sm text-[#7B878F]">
          {project.projectNumber}
          {invoice.milestoneLabel ? ` · ${invoice.milestoneLabel}` : ""}
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7B878F]">
          Bill to
        </p>
        <p className="font-semibold">{client.name}</p>
        <p className="text-sm text-[#DCE4EB]">{client.contactName}</p>
        <p className="text-sm text-[#7B878F]">{client.contactEmail}</p>
      </section>

      <section className="border-y border-white/10 py-5">
        <ul className="divide-y divide-white/5">
          {invoice.lineItems.map((li, i) => (
            <li key={i} className="flex justify-between gap-6 py-3 text-sm">
              <span className="text-[#DCE4EB]">{li.description}</span>
              <span className="font-semibold">
                {formatCurrency(li.amount, invoice.currency)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-[#FEB040]/40 pt-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#7B878F]">
            {isPaid ? "Total paid" : "Amount due"}
          </span>
          <span className="text-2xl font-bold text-[#FEB040]">
            {formatCurrency(invoice.amount, invoice.currency)}
          </span>
        </div>
      </section>

      {!isPaid ? (
        <section className="space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#7B878F]">
            Payment options
          </p>
          <PayActions invoiceId={invoice.id} />
          <div className="space-y-4 rounded-md border border-white/10 bg-white/[0.02] p-5 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FEB040]">
                Zelle (USD)
              </p>
              <p className="mt-1 text-[#DCE4EB]">{zelleEmail}</p>
              <p className="mt-1 text-[#7B878F]">
                Include invoice number {invoice.invoiceNumber} in the memo.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FEB040]">
                Bank transfer
              </p>
              <p className="mt-1 text-[#7B878F]">
                US and UAE bank details on request. Email{" "}
                <a
                  className="text-[#DCE4EB] underline decoration-dotted underline-offset-4"
                  href={`mailto:humanity@ayni-studios.com?subject=Bank%20transfer%20details%20for%20${invoice.invoiceNumber}`}
                >
                  humanity@ayni-studios.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <a
            href={`/api/invoice/${invoice.invoiceNumber}`}
            className="inline-flex items-center gap-2 rounded-sm border border-[#FEB040] bg-[#FEB040] px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#080F11] transition hover:bg-[#FEB040]/90"
          >
            Download receipt PDF
          </a>
        </section>
      )}
    </main>
  );
}
