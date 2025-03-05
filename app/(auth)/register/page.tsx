import RegisterContent from "@/app/components/RegisterContent";
import { Suspense } from "react";

const RegisterPage = () => {
  <Suspense
    fallback={<div className="flex justify-center p-8">Loading...</div>}
  >
    <RegisterContent />
  </Suspense>;
};

export default RegisterPage;
