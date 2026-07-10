import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// NOTE: These keys are SAFE to commit (public client config, not secrets).
// See https://firebase.google.com/docs/projects/api-keys
//
// Project display name is "aynistudios"; the actual project ID is
// aynistudios-fe09b (Firebase appended a suffix at creation).
const firebaseConfig = {
  apiKey: "AIzaSyDzNzz-g87DZurp2DdwM-lwDfJE8uZYoKo",
  authDomain: "aynistudios-fe09b.firebaseapp.com",
  projectId: "aynistudios-fe09b",
  storageBucket: "aynistudios-fe09b.firebasestorage.app",
  messagingSenderId: "60631423843",
  appId: "1:60631423843:web:e0c6b729b83a569c45d156",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();


