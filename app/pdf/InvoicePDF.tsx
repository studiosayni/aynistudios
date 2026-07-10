import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { formatCurrency } from "../lib/currency";
import type { Client, Invoice, Project } from "../lib/types";

// Ayni Studios Invoice PDF.
// White background + amber #FEB040 accent per brand.md.
// Uses built-in Helvetica for cross-platform reliability — Barlow is used on
// web surfaces, but registering TTFs server-side adds a fragile runtime fetch.
// The visual identity still reads as Ayni through color, layout, and tracking.

const AMBER = "#FEB040";
const INK = "#080F11";
const MUTED = "#7B878F";
const BORDER = "#E5E7EB";
const SOFT_BG = "#FAFAF7";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 48,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: AMBER,
    borderBottomStyle: "solid",
  },
  brandName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: INK,
    letterSpacing: 4,
  },
  brandTagline: {
    fontSize: 8,
    color: MUTED,
    marginTop: 4,
    letterSpacing: 1.5,
  },
  brandContact: {
    fontSize: 8,
    color: MUTED,
    marginTop: 10,
  },
  docLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: INK,
    textAlign: "right",
    letterSpacing: 2,
  },
  docNumber: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: AMBER,
    textAlign: "right",
    marginTop: 4,
    letterSpacing: 1,
  },
  docDate: {
    fontSize: 9,
    color: MUTED,
    textAlign: "right",
    marginTop: 3,
  },
  // PAID badge
  paidBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: AMBER,
    borderRadius: 2,
    alignSelf: "flex-end",
  },
  paidBadgeText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INK,
    letterSpacing: 3,
  },
  // Info grid
  infoGrid: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 24,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: SOFT_BG,
    padding: 12,
    borderLeftWidth: 2,
    borderLeftColor: AMBER,
    borderLeftStyle: "solid",
  },
  infoLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  infoTextBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INK,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 9,
    color: INK,
    lineHeight: 1.5,
  },
  // Project / milestone strip
  projectStrip: {
    backgroundColor: SOFT_BG,
    padding: 12,
    marginBottom: 22,
  },
  projectStripLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  projectStripTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: INK,
  },
  projectStripMeta: {
    fontSize: 9,
    color: MUTED,
    marginTop: 3,
  },
  // Items table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: INK,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: "solid",
  },
  colDescription: { flex: 5 },
  colAmount: { flex: 2, textAlign: "right" },
  itemDescription: {
    fontSize: 10,
    color: INK,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  itemAmount: {
    fontSize: 10,
    color: INK,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  // Totals
  totalsSection: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalFinalRow: {
    flexDirection: "row",
    width: 260,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: AMBER,
  },
  totalFinalLabel: {
    flex: 1,
    fontSize: 11,
    color: INK,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  totalFinalValue: {
    fontSize: 12,
    color: INK,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  // Pay instructions
  paySection: {
    marginTop: 28,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "solid",
  },
  paySectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: INK,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  payMethodRow: {
    marginBottom: 6,
  },
  payMethodLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: AMBER,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  payMethodText: {
    fontSize: 9,
    color: INK,
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 26,
    left: 48,
    right: 48,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: MUTED,
  },
  footerBrand: {
    fontSize: 8,
    color: INK,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InvoicePDF({
  invoice,
  project,
  client,
}: {
  invoice: Invoice;
  project: Project;
  client: Client;
}) {
  const isPaid = invoice.status === "Paid";
  const issueDate = invoice.issuedAt ?? invoice.createdAt;
  const docLabel = isPaid ? "RECEIPT" : "INVOICE";

  return (
    <Document
      title={`${docLabel} ${invoice.invoiceNumber} — Ayni Studios`}
      author="Ayni Studios"
      creator="Ayni Studios"
    >
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>AYNI STUDIOS</Text>
            <Text style={styles.brandTagline}>MEDIA FORGED FOR OUR...</Text>
            <Text style={styles.brandContact}>humanity@ayni-studios.com</Text>
            <Text style={styles.brandContact}>ayni-studios.com</Text>
          </View>
          <View>
            <Text style={styles.docLabel}>{docLabel}</Text>
            <Text style={styles.docNumber}>{invoice.invoiceNumber}</Text>
            <Text style={styles.docDate}>Issued {formatDate(issueDate)}</Text>
            {invoice.dueDate && !isPaid && (
              <Text style={styles.docDate}>Due {formatDate(invoice.dueDate)}</Text>
            )}
            {isPaid && invoice.paidAt && (
              <Text style={styles.docDate}>Paid {formatDate(invoice.paidAt)}</Text>
            )}
            {isPaid && (
              <View style={styles.paidBadge}>
                <Text style={styles.paidBadgeText}>PAID</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bill To + Payment */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoTextBold}>{client.name}</Text>
            <Text style={styles.infoText}>{client.contactName}</Text>
            <Text style={styles.infoText}>{client.contactEmail}</Text>
            {client.contactPhone && (
              <Text style={styles.infoText}>{client.contactPhone}</Text>
            )}
            <Text style={[styles.infoText, { marginTop: 6 }]}>
              {client.billingAddress}
            </Text>
            {client.taxId && (
              <Text style={[styles.infoText, { marginTop: 6, color: MUTED }]}>
                Tax ID: {client.taxId}
              </Text>
            )}
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Payment</Text>
            <Text style={styles.infoTextBold}>
              {formatCurrency(invoice.amount, invoice.currency)}
            </Text>
            <Text style={styles.infoText}>Status: {invoice.status}</Text>
            {invoice.paymentMethod && (
              <Text style={styles.infoText}>Method: {invoice.paymentMethod}</Text>
            )}
            {invoice.paidNote && isPaid && (
              <Text style={[styles.infoText, { marginTop: 6, color: MUTED }]}>
                {invoice.paidNote}
              </Text>
            )}
          </View>
        </View>

        {/* Project context */}
        <View style={styles.projectStrip}>
          <Text style={styles.projectStripLabel}>Project</Text>
          <Text style={styles.projectStripTitle}>{project.title}</Text>
          <Text style={styles.projectStripMeta}>
            {project.projectNumber}
            {invoice.milestoneLabel ? `  ·  ${invoice.milestoneLabel}` : ""}
          </Text>
        </View>

        {/* Line items */}
        <View style={styles.tableHeader}>
          <View style={styles.colDescription}>
            <Text style={styles.tableHeaderText}>Description</Text>
          </View>
          <View style={styles.colAmount}>
            <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>
              Amount
            </Text>
          </View>
        </View>

        {invoice.lineItems.map((li, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.colDescription}>
              <Text style={styles.itemDescription}>{li.description}</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.itemAmount}>
                {formatCurrency(li.amount, invoice.currency)}
              </Text>
            </View>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalFinalRow}>
            <Text style={styles.totalFinalLabel}>
              {isPaid ? "TOTAL PAID" : "AMOUNT DUE"}
            </Text>
            <Text style={styles.totalFinalValue}>
              {formatCurrency(invoice.amount, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Payment instructions — hidden on receipts */}
        {!isPaid && (
          <View style={styles.paySection}>
            <Text style={styles.paySectionTitle}>Payment Options</Text>
            <View style={styles.payMethodRow}>
              <Text style={styles.payMethodLabel}>Card (Stripe)</Text>
              <Text style={styles.payMethodText}>
                Pay securely online using the link sent with this invoice.
              </Text>
            </View>
            <View style={styles.payMethodRow}>
              <Text style={styles.payMethodLabel}>Zelle (USD)</Text>
              <Text style={styles.payMethodText}>
                studiosayni@gmail.com — include invoice number {invoice.invoiceNumber}{" "}
                in the memo.
              </Text>
            </View>
            <View style={styles.payMethodRow}>
              <Text style={styles.payMethodLabel}>Bank Transfer</Text>
              <Text style={styles.payMethodText}>
                US and UAE bank details available on request —
                contact humanity@ayni-studios.com.
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for supporting work made for the planet, humanity, and the
            future.
          </Text>
          <Text style={styles.footerBrand}>AYNI STUDIOS</Text>
        </View>
      </Page>
    </Document>
  );
}
