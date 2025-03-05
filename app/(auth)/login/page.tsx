import LoginContent from "@/app/components/LoginContent";
import React, { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense
      fallback={<div className="flex justify-center p-8">Loading...</div>}
    >
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
