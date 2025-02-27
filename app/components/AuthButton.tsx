"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthButton = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (status === "loading") {
    return <button className="btn btn-ghost btn-sm">Loading...</button>;
  }

  if (session && session.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm hidden md:inline">
          {session.user.name || session.user.email}
        </span>
        <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => {
          setAuthMode("signin");
          setIsOpen(true);
        }}
      >
        Sign In
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <button
              className="absolute top-2 right-2 btn btn-sm btn-circle"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {authMode === "signin" ? (
              <>
                <SignInForm onSuccess={() => setIsOpen(false)} />
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Don't have an account?{" "}
                    <button
                      className="text-primary hover:underline"
                      onClick={() => setAuthMode("signup")}
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <SignUpForm onSuccess={() => setAuthMode("signin")} />
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <button
                      className="text-primary hover:underline"
                      onClick={() => setAuthMode("signin")}
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AuthButton;
