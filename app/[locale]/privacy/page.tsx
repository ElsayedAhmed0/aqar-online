import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "سياسة الخصوصية" : "Privacy Policy",
    description: isAr
      ? "اقرأ سياسة الخصوصية الخاصة بمنصة عقار أونلاين"
      : "Read the privacy policy for Aqar Online platform",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { ar: "/ar/privacy", en: "/en/privacy" },
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}