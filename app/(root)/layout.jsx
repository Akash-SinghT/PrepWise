import { isAuthenticated } from "@/lib/Actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const RootLayout = async ({ children }) => {
  // Check if the user is authenticated using a helper function
  const isUserAuthenticated = await isAuthenticated();

  // If the user is not authenticated, redirect them to the sign-in page
  // 🔒 This protects routes/pages from unauthorized access
  if (!isUserAuthenticated) {
    redirect("/sign-in"); // Navigates to the sign-in route
  }

  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
