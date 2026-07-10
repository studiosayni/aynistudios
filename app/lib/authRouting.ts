import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "./firebase";
import { getAllowlistEntry } from "./allowlist";

// Post-sign-in routing shared by /login and the homepage portal card:
// verify allowlist membership, ensure the profile doc exists, then land the
// user in their workspace (or /admin for the Ayni team).

type Router = { push: (href: string) => void };

export async function routeUserAfterLogin(
  router: Router,
  userEmail: string,
  uid: string
): Promise<void> {
  const allow = await getAllowlistEntry(userEmail);
  if (!allow) {
    await signOut(auth);
    toast.error(
      "Your email is not authorized. Contact humanity@ayni-studios.com."
    );
    return;
  }

  // First-time Google users don't have a profile doc yet.
  const snap = await getDoc(doc(db, "_users", uid));
  if (!snap.exists()) {
    router.push("/complete-profile");
    return;
  }

  router.push(allow.role === "admin" ? "/admin" : `/workspace/${allow.workspaceId}`);
}

// Where an already-signed-in user's portal lives (null = not allowlisted).
export async function workspaceDestination(
  email: string
): Promise<string | null> {
  const allow = await getAllowlistEntry(email);
  if (!allow) return null;
  return allow.role === "admin" ? "/admin" : `/workspace/${allow.workspaceId}`;
}
