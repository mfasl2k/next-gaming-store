"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SignInFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  isModal = true,
  onSuccess,
  onError,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false, // Always handle redirects manually for both modal and page
        email,
        password,
      });

      if (result?.error) {
        const errorMessage = "Invalid email or password";
        setError(errorMessage);

        // Call the onError prop if provided
        if (onError) {
          onError(errorMessage);
        }

        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // If it's a page (not a modal) and no specific success handler,
        // refresh the page to reflect the authenticated state
        if (!isModal && !onSuccess) {
          router.refresh();

          // Get the callback URL from the query parameters if available
          const urlParams = new URLSearchParams(window.location.search);
          const callbackUrl = urlParams.get("callbackUrl") || "/";

          // Navigate to the callback URL
          router.push(decodeURIComponent(callbackUrl));
        } else {
          // Just refresh the page data in the background for modal case
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);

      // Call the onError prop if provided
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isModal && <h2 className="text-2xl font-bold mb-2">Sign In</h2>}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="email"
          className="grow"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="password"
          className="grow"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
