import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "تسجيل الدخول" : "Login",
    description: isAr
      ? "سجّل دخولك إلى حسابك في عقار أونلاين"
      : "Sign in to your Aqar Online account",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/login`,
      languages: { ar: "/ar/login", en: "/en/login" },
    },
  };
}

export default function LoginPage() {
  return <LoginClient />;
}