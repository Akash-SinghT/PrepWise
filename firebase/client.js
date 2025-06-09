// WHAT: Import Firebase functions needed to set up the app on the client (browser).
// WHY: These allow you to use Firebase Authentication, Firestore, Analytics, etc., on the frontend.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for other Firebase products if you want (e.g., Storage, Messaging)
// WHY: Firebase provides additional services — add them as needed for your project.

// WHAT: This is your Firebase project configuration object.
// WHY: Required to connect your frontend app to your Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyBR6SGEhheTW6WPFy768XTH3bjpVl1oGXQ", // Public API key (safe to expose in frontend)
  authDomain: "prepwise-43753.firebaseapp.com", // Auth domain for Firebase Auth
  projectId: "prepwise-43753", // Firebase project ID
  storageBucket: "prepwise-43753.firebasestorage.app", // (Optional) for Firebase Storage
  messagingSenderId: "753483619647", // (Optional) for push notifications
  appId: "1:753483619647:web:22529e8a6d25818631078a", // App ID for this Firebase project
  measurementId: "G-P328RHNNXR", // (Optional) for Analytics
};

// WHAT: Initialize Firebase app if it hasn't been initialized yet.
// WHY: Prevents multiple initializations during hot reload or navigation in dev mode.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// WHAT: Export Firebase Auth and Firestore instances to use throughout your frontend app.
// WHY: Reuse these instances anywhere you need to log in users or access Firestore data.
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database

// (Optional) If you want to use Analytics, you can also export:
// export const analytics = getAnalytics(app);
