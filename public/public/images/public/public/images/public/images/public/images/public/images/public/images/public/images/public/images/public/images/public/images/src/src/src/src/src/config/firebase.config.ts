import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// 1. Load Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// 2. Initialize App (Singleton Pattern)
// Prevents re-initialization during hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 4. Enable Offline Persistence (Firestore)
// Allows app to work without internet
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
      console.warn('Persistence not supported by browser');
    }
  });
} catch (e) {
  console.log('Persistence initialization skipped');
}

// 5. Initialize Analytics (Conditional)
// Only works in browser environments supported by Google Analytics
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// 6. Auth Providers
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, analytics, googleProvider };
