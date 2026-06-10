"use client";

import { useLocale } from "next-intl";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthImageSide from "@/components/auth/AuthImageSide";

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-aura-bg">
        <ForgotPasswordForm />
      </div>
      <AuthImageSide screen="forgot" isAr={isAr} />
    </main>
  );
}