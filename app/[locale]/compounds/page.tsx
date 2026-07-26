import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompoundsClient from "./CompoundsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "دليل الكمبوندات والمشاريع العقارية في مصر" : "Compounds & Projects Directory in Egypt",
    description: isAr
      ? "تصفح أحدث الكمبوندات والمشاريع العقارية في مصر، فلترة حسب المنطقة وحالة الإنشاء والسعر"
      : "Browse the latest compounds and real estate projects in Egypt",
    alternates: {
      canonical: `/${locale}/compounds`,
      languages: { ar: `/ar/compounds`, en: `/en/compounds` },
    },
  };
}

export default async function CompoundsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*, developers(id, name, name_en, logo_url, slug)")
    .eq("status", "approved")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <CompoundsClient projects={projects || []} isAr={isAr} locale={locale} />
      <Footer />
    </main>
  );
}