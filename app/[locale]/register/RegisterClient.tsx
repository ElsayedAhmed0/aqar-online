"use client";

import { useLocale } from "next-intl";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthImageSide from "@/components/auth/AuthImageSide";

export default function RegisterPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-aura-bg">
        <RegisterForm />
      </div>
      <AuthImageSide screen="register" isAr={isAr} />
    </main>
  );
}