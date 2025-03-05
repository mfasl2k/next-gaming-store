"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SignUpForm from "./SignUpForm";

const RegisterContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { status } = useSession();
  const encodedCallbackUrl = searchParams.get("callbackUrl") || "/";
  const callbackUrl = decodeURIComponent(encodedCallbackUrl);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSuccess = () => {
    router.push("/login?callbackUrl=" + encodeURIComponent(callbackUrl));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Use your existing SignUpForm component */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <SignUpForm
            isModal={false}
            onSuccess={handleSuccess}
            onError={(message) => setError(message)}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterContent;
