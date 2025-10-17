
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import 'server-only';

// Helper function to memoize Firebase Admin SDK initialization
function memoize(fn: () => App) {
  let app: App;
  return () => {
    if (!app) {
      app = fn();
    }
    return app;
  };
}

// Function to initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountString) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set. Please add it to your .env file.');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (e) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it is a valid JSON string.');
  }
  

  return initializeApp(
    {
      credential: cert(serviceAccount),
    },
    'firebase-admin-app'
  );
}

// Check if Firebase Admin SDK has already been initialized
const getAdminApp = memoize(() => {
  const apps = getApps();
  const adminApp = apps.find(app => app.name === 'firebase-admin-app');
  return adminApp || initializeFirebaseAdmin();
});

// Export a function to get Firebase services
export async function getFirebaseAdmin() {
  const app = getAdminApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  return { app, auth, db };
}
