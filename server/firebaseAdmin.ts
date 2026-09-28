import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase Admin SDK for server-side verification and audit logging
if (!getApps().length) {
  try {
    initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
    });
  } catch (e) {
    console.warn('Firebase Admin already initialized or initializing with default credential:', e);
  }
}

export const adminDb = getFirestore();
export const db = adminDb;
export const adminAuth = getAuth();
export const auth = adminAuth;


