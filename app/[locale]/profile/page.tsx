import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "الصفحة الشخصية" : "My Profile",
    description: isAr
      ? "إدارة حسابك الشخصي في عقار أونلاين"
      : "Manage your Aqar Online account",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/profile`,
      languages: { ar: "/ar/profile", en: "/en/profile" },
    },
  };
}

export default function ProfilePage() {
  return <ProfileClient />;
}