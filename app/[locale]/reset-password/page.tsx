"use client";

import { useLocale } from "next-intl";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthImageSide from "@/components/auth/AuthImageSide";

export default function ResetPasswordPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-aura-bg">
        <ResetPasswordForm />
      </div>
      <AuthImageSide screen="reset" isAr={isAr} />
    </main>
  );
}