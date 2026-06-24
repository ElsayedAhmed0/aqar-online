import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "الشروط والأحكام" : "Terms of Service",
    description: isAr
      ? "اقرأ الشروط والأحكام الخاصة باستخدام منصة عقار أونلاين"
      : "Read the terms and conditions for using Aqar Online platform",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { ar: "/ar/terms", en: "/en/terms" },
    },
  };
}

export default function TermsPage() {
  return <TermsClient />;
}