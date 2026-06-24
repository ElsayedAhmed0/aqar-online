import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "لوحة الإدارة" : "Admin Panel",
    description: isAr ? "إدارة موقع عقار أونلاين" : "Manage Aqar Online",
    robots: { index: false, follow: false },
  };
}

export default function AdminPage() {
  return <AdminClient />;
}