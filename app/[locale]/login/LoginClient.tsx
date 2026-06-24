"use client";

import { useLocale } from "next-intl";
import LoginForm from "@/components/auth/LoginForm";
import AuthImageSide from "@/components/auth/AuthImageSide";

export default function LoginPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen flex">
      {/* الفورم */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-aura-bg">
        <LoginForm />
      </div>

      {/* الصورة الجانبية */}
      <AuthImageSide screen="login" isAr={isAr} />
    </main>
  );
}