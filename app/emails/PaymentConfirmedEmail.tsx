import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";
import type { Client, Invoice, Project } from "../lib/types";
import { formatCurrency } from "../lib/currency";

const AMBER = "#FEB040";
const INK = "#080F11";
const MUTED = "#7B878F";

export default function PaymentConfirmedEmail({
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
          <Section style={header}>
            <Heading style={brand}>AYNI STUDIOS</Heading>
            <Text style={tagline}>MEDIA FORGED FOR OUR...</Text>
          </Section>

          <Section style={{ padding: "24px 24px 8px", textAlign: "center" }}>
            <Text style={paidBadge}>PAID</Text>
            <Heading style={h1}>Payment received</Heading>
            <Text style={p}>Thank you, {client.contactName.split(" ")[0]}.</Text>
          </Section>

          <Section style={receiptBox}>
            <Text style={receiptRow}>
              <span style={rowLabel}>Receipt</span>
              <span style={rowValue}>{invoice.invoiceNumber}</span>
            </Text>
            <Text style={receiptRow}>
              <span style={rowLabel}>Project</span>
              <span style={rowValue}>{project.title}</span>
            </Text>
            {invoice.milestoneLabel && (
              <Text style={receiptRow}>
                <span style={rowLabel}>Milestone</span>
                <span style={rowValue}>{invoice.milestoneLabel}</span>
              </Text>
            )}
            <Text style={receiptRow}>
              <span style={rowLabel}>Method</span>
              <span style={rowValue}>{invoice.paymentMethod}</span>
            </Text>
            <Hr style={innerHr} />
            <Text style={receiptRow}>
              <span style={rowLabel}>Amount paid</span>
              <span style={totalValue}>
                {formatCurrency(invoice.amount, invoice.currency)}
              </span>
            </Text>
          </Section>

          <Section style={section}>
            <Text style={p}>
              A PDF receipt is attached for your records. We’ll keep you posted
              on the next phase of <strong>{project.title}</strong>.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Ayni Studios · humanity@ayni-studios.com · ayni-studios.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#F5F3EE", margin: 0, padding: 0 };
const container = {
  backgroundColor: "#FFFFFF",
  maxWidth: 600,
  margin: "32px auto",
};
const header = {
  padding: "28px 24px 20px",
  borderBottom: `2px solid ${AMBER}`,
};
const brand = {
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: 4,
  color: INK,
  margin: 0,
};
const tagline = {
  fontSize: 10,
  letterSpacing: 2,
  color: MUTED,
  margin: "6px 0 0",
};
const section = { padding: "16px 24px" };
const h1 = {
  fontSize: 22,
  fontWeight: 700,
  color: INK,
  margin: "12px 0 10px",
};
const p = {
  fontSize: 14,
  color: INK,
  lineHeight: 1.6,
  margin: "0 0 10px",
};
const paidBadge = {
  display: "inline-block",
  padding: "6px 14px",
  backgroundColor: AMBER,
  color: INK,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 3,
  borderRadius: 2,
  margin: 0,
};
const receiptBox = {
  margin: "12px 24px",
  padding: "16px 18px",
  backgroundColor: "#FAFAF7",
  borderLeft: `3px solid ${AMBER}`,
};
const receiptRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
  margin: "6px 0",
  color: INK,
};
const rowLabel = { color: MUTED };
const rowValue = { color: INK, fontWeight: 600 };
const totalValue = { color: INK, fontWeight: 700, fontSize: 15 };
const innerHr = {
  border: "none",
  borderTop: "1px solid #E5E7EB",
  margin: "10px 0",
};
const footer = { padding: "20px 24px", textAlign: "center" as const };
const footerText = { fontSize: 11, color: MUTED, margin: 0 };
