import { db } from "./firebase";
import { doc, runTransaction } from "firebase/firestore";

// Year-keyed serial counters. Two sequences:
//   _serialCounters/projects-<year>
//   _serialCounters/invoices-<year>
// Each doc: { value: number }

async function nextSerial(counterName: string): Promise<number> {
  return runTransaction(db, async (tx) => {
    const ref = doc(db, "_serialCounters", counterName);
    const snap = await tx.get(ref);
    const next = (snap.exists() ? (snap.data().value as number) : 0) + 1;
    tx.set(ref, { value: next }, { merge: true });
    return next;
  });
}

function currentYear(): number {
  return new Date().getFullYear();
}

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

export async function nextProjectNumber(): Promise<string> {
  const year = currentYear();
  const n = await nextSerial(`projects-${year}`);
  return `AS-PRJ-${year}-${pad4(n)}`;
}

export async function nextInvoiceNumber(): Promise<string> {
  const year = currentYear();
  const n = await nextSerial(`invoices-${year}`);
  return `AS-INV-${year}-${pad4(n)}`;
}
