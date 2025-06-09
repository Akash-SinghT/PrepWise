import { isAuthenticated } from "@/lib/Actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout = async ({ children }) => {
  // ✅ Check if the user is already authenticated (e.g., already signed in)
  const isUserAuthenticated = await isAuthenticated();

  // 🔁 If authenticated, redirect the user to the homepage
  // 🚫 Prevents logged-in users from accessing pages like sign-in or sign-up again
  if (isUserAuthenticated) {
    redirect("/"); // Automatically navigates to the home page
  }

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
