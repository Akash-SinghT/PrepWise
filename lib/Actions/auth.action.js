"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { use } from "react";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// Sets a secure session cookie for the authenticated user
export async function setSessionCookie(idToken) {
  // Get the current cookie store (usually from the request context)
  const cookieStore = await cookies();

  // Create a session cookie using Firebase Auth from the given ID token
  // Session expiration is set to ONE_WEEK * 1000 milliseconds
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  // Set the session cookie in the user's browser
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK, // ⏱️ Max age of the cookie in seconds
    httpOnly: true, // 🔒 Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // 🔐 Only use HTTPS in production
    path: "/", // 🌍 Cookie is valid for the whole site
    sameSite: "lax", // ⚖️ Helps prevent CSRF (Cross-Site Request Forgery)
  });
}

// Handles the server-side sign-in process for an existing user
export async function signIn(params) {
  const { email, idToken } = params;

  try {
    // 🔍 Retrieve the user record from Firebase using the email
    const userRecord = await auth.getUserByEmail(email);

    // 🚫 If the user does not exist, return an error response
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      };
    }

    // 🍪 Set a secure session cookie for authenticated user
    await setSessionCookie(idToken);

    // ✅ No need to return success here if cookie is set silently (optional enhancement)
  } catch (error) {
    console.log(error); // Log for debugging

    // 🛑 Return failure response in case of any error
    return {
      success: false,
      message: "Failed to log into an account.",
    };
  }
}

// Retrieves the currently logged-in user's data using the session cookie
export async function getCurrentUser() {
  // Get all cookies from the current request context
  const cookieStore = await cookies();

  // Extract the session cookie value (set by backend after login)
  const sessionCookie = cookieStore.get("session")?.value;

  // If session cookie does not exist, user is not authenticated, so return null
  if (!sessionCookie) return null;

  try {
    // Verify the session cookie with Firebase Auth to ensure it is valid
    // The second argument 'true' enforces checking if the token is revoked
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Log the UID extracted from decoded token for debugging
    console.log("UID from decodedClaims:", decodedClaims.uid);

    // Use the UID from the token to fetch the user document from Firestore 'users' collection
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    // Log whether the user document exists for debugging
    console.log("User record exists:", userRecord.exists);

    // Log the user document data if it exists
    console.log("User record data:", userRecord.data());

    // If no user document exists for the UID, return null indicating no user found
    if (!userRecord.exists) return null;

    // Return an object containing the user data fields along with Firestore document ID
    return {
      ...userRecord.data(),
      id: userRecord.id,
    };
  } catch (error) {
    // Log any errors that occur during verification or Firestore fetching
    console.log("Error fetching current user:", error);

    // Return null if an error occurs (e.g., invalid token, Firestore issues)
    return null;
  }
}

// Checks if a user is currently authenticated
export async function isAuthenticated() {
  // Attempt to retrieve the current user from session
  const user = await getCurrentUser();
  console.log(user);
  // Return true if user exists, otherwise false
  return !!user;
}
