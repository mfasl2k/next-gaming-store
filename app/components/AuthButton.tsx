"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { FaRegCircleUser } from "react-icons/fa6";
import Image from "next/image";

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
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="User Avatar" fill />
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-400 text-primary-content">
                <FaRegCircleUser size="1.8rem" />
              </div>
            )}
          </div>
        </div>

        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] p-2 shadow bg-sky-500 rounded-box w-52 mt-4"
        >
          <li className="menu-title px-4 py-2 text-lg text-black">
            <span className="font-bold ">
              Hi,{" "}
              {session.user.name || session.user.email?.split("@")[0] || "User"}
            </span>
          </li>
          <li className="px-2">
            <button onClick={handleSignOut} className="py-2 text-red-600">
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <button
        className="btn btn-ghost bg-slate-500 btn-sm"
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
                    Don&apos;t have an account?{" "}
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
