import "server-only";
import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Server-side Firebase Admin SDK (bypasses security rules; verifies ID tokens).
// On App Hosting, Application Default Credentials come from the backend's
// service account automatically. For local dev, run:
//   gcloud auth application-default login

const PROJECT_ID = "aynistudios-fe09b";

function adminApp() {
  return (
    getApps()[0] ??
    initializeApp({
      credential: applicationDefault(),
      projectId: PROJECT_ID,
    })
  );
}

export function adminAuth() {
  return getAuth(adminApp());
}

export function adminDb() {
  return getFirestore(adminApp());
}
