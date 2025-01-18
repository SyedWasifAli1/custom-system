// lib/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Retrieve Firebase config from localStorage
const savedConfig = localStorage.getItem('firebaseConfig');
if (!savedConfig) {
  throw new Error('Firebase config not found in localStorage');
}

const firebaseConfig = JSON.parse(savedConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
