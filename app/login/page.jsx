"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import NavbarComponent from "@/components/Navbar";
export default function LoginPage() {
    // State variables for form fields and error message
    const router = useRouter();
    const { status } = useSession();

    // Redirect authenticated users to home page
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    // Show loading indicator while session status is loading
    if (status === "loading") {
        return (
            <>
                <NavbarComponent />
            <div className="flex items-center justify-center min-h-screen">
                <span>Loading...</span>
            </div>
            </>
        );
    }

    // Prevent rendering the login form for authenticated users
    if (status === "authenticated") {
        return null;
    }

    // Handle form submission for login

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">

            {/* Uncomment the button below to enable Google sign-in */}
            <Button
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => signIn("google")}
            >
                Sign in with Google
            </Button>
        </div>
    );
}
