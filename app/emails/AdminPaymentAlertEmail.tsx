import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components";
import type { Client, Invoice, Project } from "../lib/types";
import { formatCurrency } from "../lib/currency";

// Internal alert for Noah — lands in humanity@ayni-studios.com when a
// payment clears. Keeps admin in the loop for Zelle/Stripe conf.

export default function AdminPaymentAlertEmail({
  invoice,
  project,
  client,
}: {
  invoice: Invoice;
  project: Project;
  client: Client;
}) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={{ padding: "20px 24px" }}>
            <Heading style={h1}>
              {formatCurrency(invoice.amount, invoice.currency)} received
            </Heading>
            <Text style={meta}>
              {invoice.invoiceNumber} · {invoice.paymentMethod}
            </Text>
            <Text style={p}>
              <strong>{client.name}</strong> paid{" "}
              <strong>{project.title}</strong>
              {invoice.milestoneLabel ? ` — ${invoice.milestoneLabel}` : ""}.
            </Text>
            <Text style={p}>
              <strong>Project:</strong> {project.projectNumber}
              <br />
              <strong>Client contact:</strong> {client.contactEmail}
              <br />
              <strong>Paid at:</strong>{" "}
              {invoice.paidAt
                ? new Date(invoice.paidAt).toLocaleString("en-US")
                : "—"}
            </Text>
            {invoice.paidNote && (
              <Text style={note}>Note: {invoice.paidNote}</Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#F5F3EE", margin: 0, padding: 0, fontFamily: "Arial, sans-serif" };
const container = {
  backgroundColor: "#FFFFFF",
  maxWidth: 560,
  margin: "24px auto",
  borderLeft: "3px solid #FEB040",
};
const h1 = { fontSize: 18, fontWeight: 700, color: "#080F11", margin: "0 0 6px" };
const meta = { fontSize: 12, color: "#7B878F", margin: "0 0 14px", letterSpacing: 1 };
const p = { fontSize: 14, color: "#080F11", lineHeight: 1.6, margin: "0 0 8px" };
const note = {
  fontSize: 12,
  color: "#7B878F",
  margin: "10px 0 0",
  padding: "8px 10px",
  backgroundColor: "#FAFAF7",
};
