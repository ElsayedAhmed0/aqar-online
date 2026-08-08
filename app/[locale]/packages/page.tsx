import type { Metadata } from "next";
import PackagesClient from "./PackagesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "باقات الاشتراك" : "Subscription Plans",
    description: isAr
      ? "اختار باقة الاشتراك المناسبة لك وابدأ في نشر إعلاناتك العقارية"
      : "Choose the subscription plan that fits you and start posting your real estate listings",
    alternates: {
      canonical: `/${locale}/packages`,
      languages: { ar: "/ar/packages", en: "/en/packages" },
    },
  };
}

export default function PackagesPage() {
  return <PackagesClient />;
}