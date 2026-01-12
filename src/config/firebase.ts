import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA_9Ez0-d91GNf1CizvJcJ2P-miCBgf1Ko",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "blog-s-huy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "blog-s-huy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "blog-s-huy.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "589278909822",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:589278909822:web:2dc0b1efa74a4f93764f2f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZQXELY1103"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;

