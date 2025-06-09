// WHAT: Import the function to initialize the Firebase Admin SDK.
// WHY: Needed to set up Firebase services like Firestore and Auth on the server.
import { initializeApp } from "firebase-admin/app";

// WHAT: Import cert (for authentication) and getApps (to check existing Firebase instances).
// WHY: `cert` is used to authenticate with service account credentials.
//      `getApps` is used to avoid initializing Firebase multiple times (important in server environments).
import { cert, getApps } from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// WHAT: This function sets up Firebase Admin services (Firestore, Auth) once.
// WHY: It's a reusable setup function to avoid redundant initialization and ensure secure backend access.
const initFirebaseAdmin = () => {
  // WHAT: Get the list of currently initialized Firebase Admin apps.
  // WHY: Prevents re-initializing Firebase Admin multiple times during hot reloads or multiple function calls.
  const apps = getApps();

  // WHAT: Initialize Firebase Admin only if no app has been initialized yet.
  // WHY: Calling initializeApp() more than once throws an error — this check prevents that.
  if (!apps.length) {
    initializeApp({
      // WHAT: Use service account credentials to authenticate the admin SDK.
      // WHY: This provides full access to Firebase services securely from the backend.
      credential: cert({
        // WHAT: Fetch the Firebase project ID from environment variables.
        // WHY: Keeps sensitive data secure and configurable per environment (dev, prod).
        projectId: process.env.FIREBASE_PROJECT_ID,

        // WHAT: Fetch the client email from env.
        // WHY: It's part of the service account credentials.
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

        // WHAT: Get the private key and replace escaped newline characters with actual newlines.
        // WHY: Private keys stored in `.env` files are usually in one line with `\n` — Firebase expects real line breaks.
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  // WHAT: Return Firebase Admin services (auth and firestore).
  // WHY: Makes these services accessible throughout the backend by calling this function once.
  return {
    auth: getAuth(), // WHAT: Firebase Authentication service (admin access).
    // WHY: Used for verifying ID tokens, managing users, etc.

    db: getFirestore(), // WHAT: Firestore database instance (admin access).
    // WHY: Used to securely read/write data on the server side.
  };
};

// WHAT: Immediately initialize Firebase Admin and export `auth` and `db`.
// WHY: So they can be imported and used directly in other backend files (e.g., API routes).
export const { auth, db } = initFirebaseAdmin();
