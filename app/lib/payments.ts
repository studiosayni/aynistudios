import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  query,
  getDocs,
  limit,
} from "firebase/firestore";
import type {
  Client,
  Invoice,
  Milestone,
  PaymentMethod,
  Project,
} from "./types";
import { nextInvoiceNumber } from "./serial";

// ---- Reads -----------------------------------------------------------------

export async function getInvoice(id: string): Promise<Invoice | null> {
  const snap = await getDoc(doc(db, "_invoices", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Invoice, "id">) };
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "_projects", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Project, "id">) };
}

export async function getClient(id: string): Promise<Client | null> {
  const snap = await getDoc(doc(db, "_clients", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Client, "id">) };
}

export async function getInvoiceByNumber(
  invoiceNumber: string
): Promise<Invoice | null> {
  const q = query(
    collection(db, "_invoices"),
    where("invoiceNumber", "==", invoiceNumber),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Invoice, "id">) };
}

// ---- Invoice creation ------------------------------------------------------

export async function createInvoiceFromMilestone(args: {
  project: Project;
  milestoneId: string;
  dueDate?: string;
  lineItemsOverride?: { description: string; amount: number }[];
}): Promise<Invoice> {
  const { project, milestoneId, dueDate, lineItemsOverride } = args;
  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);
  if (milestone.invoiceId) {
    throw new Error(
      `Milestone already has invoice ${milestone.invoiceId}`
    );
  }

  const invoiceNumber = await nextInvoiceNumber();
  const now = new Date().toISOString();

  const lineItems =
    lineItemsOverride && lineItemsOverride.length > 0
      ? lineItemsOverride
      : [{ description: milestone.label, amount: milestone.amount }];

  const amount = lineItems.reduce((sum, li) => sum + li.amount, 0);

  const docRef = await addDoc(collection(db, "_invoices"), {
    invoiceNumber,
    projectId: project.id,
    clientId: project.clientId,
    workspaceId: project.workspaceId,
    milestoneId,
    milestoneLabel: milestone.label,
    amount,
    currency: project.currency,
    lineItems,
    status: "Draft",
    dueDate,
    createdAt: now,
    updatedAt: now,
  });

  // Link the milestone to the new invoice.
  await updateDoc(doc(db, "_projects", project.id), {
    milestones: project.milestones.map((m) =>
      m.id === milestoneId
        ? ({ ...m, invoiceId: docRef.id, status: "invoiced" } as Milestone)
        : m
    ),
    updatedAt: now,
  });

  return {
    id: docRef.id,
    invoiceNumber,
    projectId: project.id,
    clientId: project.clientId,
    workspaceId: project.workspaceId,
    milestoneId,
    milestoneLabel: milestone.label,
    amount,
    currency: project.currency,
    lineItems,
    status: "Draft",
    dueDate,
    createdAt: now,
    updatedAt: now,
  };
}

// ---- Mark paid -------------------------------------------------------------

export async function markInvoicePaid(args: {
  invoiceId: string;
  paymentMethod: PaymentMethod;
  note?: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
}): Promise<void> {
  const {
    invoiceId,
    paymentMethod,
    note,
    stripeCheckoutSessionId,
    stripePaymentIntentId,
  } = args;

  await runTransaction(db, async (tx) => {
    const invRef = doc(db, "_invoices", invoiceId);
    const invSnap = await tx.get(invRef);
    if (!invSnap.exists()) throw new Error("Invoice not found");
    const invoice = invSnap.data() as Omit<Invoice, "id">;

    if (invoice.status === "Paid") return; // idempotent — already handled

    const projRef = doc(db, "_projects", invoice.projectId);
    const projSnap = await tx.get(projRef);
    if (!projSnap.exists()) throw new Error("Project not found");
    const project = projSnap.data() as Omit<Project, "id">;

    const now = new Date().toISOString();

    tx.update(invRef, {
      status: "Paid",
      paymentMethod,
      paidAt: now,
      paidNote: note ?? null,
      stripeCheckoutSessionId: stripeCheckoutSessionId ?? null,
      stripePaymentIntentId: stripePaymentIntentId ?? null,
      updatedAt: now,
    });

    if (invoice.milestoneId) {
      tx.update(projRef, {
        milestones: project.milestones.map((m) =>
          m.id === invoice.milestoneId
            ? { ...m, status: "paid" }
            : m
        ),
        updatedAt: now,
      });
    }
  });
}

// ---- Mark sent (moves invoice from Draft → Sent, stamps issuedAt) ----------

export async function markInvoiceSent(invoiceId: string): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, "_invoices", invoiceId), {
    status: "Sent",
    issuedAt: now,
    updatedAt: now,
  });
}

// Server-timestamp alias — used if we ever need server clock instead of client.
export const serverNow = serverTimestamp;
