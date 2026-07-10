// Shared types for the billing + projects system.
// Mirror the Firestore schema documented in _docs/AYNI_ARCHITECTURE.md.

export type Currency = "USD" | "AED";

// ---- Clients ---------------------------------------------------------------

export type Client = {
  id: string; // Firestore doc ID
  name: string; // legal/display name, e.g. "Emirates Nature–WWF"
  shortName?: string; // optional, e.g. "ENWWF"
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  billingAddress: string; // multiline, rendered on PDF
  taxId?: string; // VAT/TIN for UAE invoices etc.
  preferredCurrency: Currency;
  workspaceId: string; // matches _allowlist.workspaceId for portal access
  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// ---- Projects --------------------------------------------------------------

// Client-facing project statuses (admin sets; client sees read-only).
export const PROJECT_STATUSES = [
  "Payment pending",
  "Planning",
  "Filming",
  "Editing",
  "Revisions",
  "Complete",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Milestone = {
  id: string; // short random ID, stable across edits
  label: string; // e.g. "50% Deposit — Pre-Production"
  amount: number; // in project currency, not cents
  status: "pending" | "invoiced" | "paid";
  invoiceId?: string; // set when an invoice is generated from this milestone
};

export type LineItem = {
  description: string;
  amount: number;
};

export type Project = {
  id: string;
  projectNumber: string; // "AS-PRJ-2026-0001"
  clientId: string;
  workspaceId: string; // denormalized from the client — lets Firestore rules verify client queries without joins
  title: string;
  scope: string; // careful output-focused quote wording
  status: ProjectStatus;
  currency: Currency;
  scopeAmount: number; // total contract value; sum of milestones should equal this
  milestones: Milestone[];
  visibleToClient: boolean;
  createdAt: string;
  updatedAt: string;
};

// ---- Invoices --------------------------------------------------------------

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Void";
export type PaymentMethod = "Stripe" | "Zelle" | "Bank Transfer";

export type Invoice = {
  id: string; // Firestore auto-ID — ALSO acts as the secret pay-link token
  invoiceNumber: string; // "AS-INV-2026-0001"
  projectId: string;
  clientId: string;
  workspaceId: string; // denormalized from the project — lets Firestore rules verify client queries without joins
  milestoneId?: string; // which milestone this invoice covers
  milestoneLabel?: string; // snapshot of milestone label at issue time
  amount: number;
  currency: Currency;
  lineItems: LineItem[];
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  issuedAt?: string; // set when moved out of Draft
  dueDate?: string; // ISO yyyy-mm-dd
  paidAt?: string; // ISO
  paidNote?: string; // admin-visible note when manually marked paid (Zelle ref etc.)
  createdAt: string;
  updatedAt: string;
};
