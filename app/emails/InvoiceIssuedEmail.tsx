import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
  Row,
  Column,
} from "@react-email/components";
import type { Client, Invoice, Project } from "../lib/types";
import { formatCurrency } from "../lib/currency";

// Client-facing email sent when an invoice moves from Draft → Sent.
// Light background per brand.md — email clients are unreliable with dark mode
// so we lean on the white/amber print palette.

const AMBER = "#FEB040";
const INK = "#080F11";
const MUTED = "#7B878F";

export default function InvoiceIssuedEmail({
  invoice,
  project,
  client,
  payUrl,
  zelleContact,
}: {
  invoice: Invoice;
  project: Project;
  client: Client;
  payUrl: string;
  zelleContact: string;
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

          <Section style={section}>
            <Heading style={h1}>New invoice — {invoice.invoiceNumber}</Heading>
            <Text style={p}>Hi {client.contactName.split(" ")[0]},</Text>
            <Text style={p}>
              A new invoice is ready for <strong>{project.title}</strong>
              {invoice.milestoneLabel
                ? ` — ${invoice.milestoneLabel}`
                : ""}
              .
            </Text>
          </Section>

          <Section style={amountBox}>
            <Text style={amountLabel}>AMOUNT DUE</Text>
            <Text style={amountValue}>
              {formatCurrency(invoice.amount, invoice.currency)}
            </Text>
            {invoice.dueDate && (
              <Text style={amountDue}>
                Due{" "}
                {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            )}
          </Section>

          <Section style={{ textAlign: "center", padding: "8px 24px 4px" }}>
            <Button href={payUrl} style={button}>
              Pay invoice
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Alternate payment methods</Heading>
            <Row>
              <Column>
                <Text style={label}>ZELLE (USD)</Text>
                <Text style={p}>{zelleContact}</Text>
                <Text style={small}>
                  Reference {invoice.invoiceNumber} in the memo.
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>BANK TRANSFER</Text>
                <Text style={small}>
                  US + UAE details on request — reply to this email.
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={small}>
              Questions? Reply to this email or write to{" "}
              <a style={link} href="mailto:humanity@ayni-studios.com">
                humanity@ayni-studios.com
              </a>
              .
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>Ayni Studios · ayni-studios.com</Text>
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
  padding: 0,
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
const section = { padding: "20px 24px" };
const h1 = {
  fontSize: 20,
  fontWeight: 700,
  color: INK,
  margin: "0 0 12px",
};
const h2 = {
  fontSize: 13,
  fontWeight: 700,
  color: INK,
  letterSpacing: 1.5,
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};
const p = {
  fontSize: 14,
  color: INK,
  lineHeight: 1.6,
  margin: "0 0 10px",
};
const small = {
  fontSize: 12,
  color: MUTED,
  lineHeight: 1.5,
  margin: "0 0 6px",
};
const label = {
  fontSize: 10,
  color: AMBER,
  letterSpacing: 2,
  fontWeight: 700,
  margin: "12px 0 4px",
};
const amountBox = {
  padding: "18px 24px",
  margin: "12px 24px",
  backgroundColor: "#FAFAF7",
  borderLeft: `3px solid ${AMBER}`,
};
const amountLabel = {
  fontSize: 10,
  letterSpacing: 2,
  color: MUTED,
  fontWeight: 700,
  margin: "0 0 4px",
};
const amountValue = {
  fontSize: 28,
  fontWeight: 700,
  color: INK,
  margin: 0,
};
const amountDue = {
  fontSize: 12,
  color: MUTED,
  margin: "4px 0 0",
};
const button = {
  backgroundColor: AMBER,
  color: INK,
  padding: "12px 28px",
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: 2,
  textTransform: "uppercase" as const,
  textDecoration: "none",
  borderRadius: 2,
  display: "inline-block",
};
const hr = {
  border: "none",
  borderTop: "1px solid #E5E7EB",
  margin: "0 24px",
};
const footer = { padding: "20px 24px", textAlign: "center" as const };
const footerText = { fontSize: 11, color: MUTED, margin: 0 };
const link = { color: INK, textDecoration: "underline" };
