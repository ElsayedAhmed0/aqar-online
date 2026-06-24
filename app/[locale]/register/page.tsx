import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "إنشاء حساب" : "Create Account",
    description: isAr
      ? "أنشئ حسابك في عقار أونلاين وابدأ في البحث عن عقارك المثالي"
      : "Create your Aqar Online account and start searching for your perfect property",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/register`,
      languages: { ar: "/ar/register", en: "/en/register" },
    },
  };
}

export default function RegisterPage() {
  return <RegisterClient />;
}