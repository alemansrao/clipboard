"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span>Signing out...</span>
    </div>
  );
}
