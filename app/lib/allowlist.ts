import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Admin-managed email allowlist lives at Firestore `_allowlist/{lowercaseEmail}`.
// Doc shape:
//   {
//     email: string,            // original casing, for display
//     workspaceId: string,      // which client workspace this user belongs to
//     role: "admin" | "client", // "admin" = Ayni team; "client" = client portal user
//     addedAt: ISO timestamp
//   }
//
// To grant access: an admin creates the allowlist doc (via console for now).
// Only allowlisted emails can sign up or sign in via Google/email-password.

export type AllowlistEntry = {
  email: string;
  workspaceId: string;
  role: "admin" | "client";
  addedAt: string;
};

export async function getAllowlistEntry(
  email: string
): Promise<AllowlistEntry | null> {
  const key = email.trim().toLowerCase();
  if (!key) return null;
  const snap = await getDoc(doc(db, "_allowlist", key));
  if (!snap.exists()) return null;
  return snap.data() as AllowlistEntry;
}
