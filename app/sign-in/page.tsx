"use client";

import { useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  // Redirect to home after sign-in
  const handleSignInComplete = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              go back to home
            </a>
          </p>
        </div>
        <div className="mt-8">
          <SignIn 
            signUpUrl="/sign-up" 
            routing="hash"
            fallbackRedirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}
