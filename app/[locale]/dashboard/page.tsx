import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "لوحة التحكم" : "Dashboard",
    description: isAr
      ? "إدارة إعلاناتك العقارية في عقار أونلاين"
      : "Manage your property listings on Aqar Online",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/dashboard`,
      languages: { ar: "/ar/dashboard", en: "/en/dashboard" },
    },
  };
}

export default function DashboardPage() {
  return <DashboardClient />;
}