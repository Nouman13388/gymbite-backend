import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug log to check if Firebase config is loaded
console.log("🔥 Firebase configuration loaded:", {
  apiKey: firebaseConfig.apiKey ? "[API_KEY_PROVIDED]" : "[MISSING]",
  authDomain: firebaseConfig.authDomain || "[MISSING]",
  projectId: firebaseConfig.projectId || "[MISSING]",
  storageBucket: firebaseConfig.storageBucket || "[MISSING]",
  messagingSenderId: firebaseConfig.messagingSenderId || "[MISSING]",
  appId: firebaseConfig.appId ? "[APP_ID_PROVIDED]" : "[MISSING]",
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

console.log("✅ Firebase app initialized successfully");
