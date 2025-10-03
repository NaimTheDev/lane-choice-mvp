
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getStorage, connectStorageEmulator, FirebaseStorage } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Check if emulators are already connected to prevent errors on Fast Refresh
    // @ts-ignore
    if (!auth.emulatorConfig) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    // @ts-ignore
    if (!db._settings.host) {
        connectFirestoreEmulator(db, 'localhost', 8080);
    }
    // @ts-ignore
    if (!storage.emulator) {
        connectStorageEmulator(storage, 'localhost', 9199);
    }
  }
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { storage, db, auth };
