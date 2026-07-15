import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompaniesGrid from "./CompaniesGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "كل المطورين العقاريين" : "All Developers",
    description: isAr
      ? "تصفح كل شركات التطوير العقاري ومشاريعها على عقار أونلاين"
      : "Browse all real estate development companies and their projects on Aqar Online",
    alternates: {
      canonical: `/${locale}/companies`,
      languages: { ar: `/ar/companies`, en: `/en/companies` },
    },
  };
}

export default async function CompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: developers } = await supabase
    .from("developers")
    .select("*")
    .eq("active", true)
    .order("order_num", { ascending: true });

  const { data: projectCounts } = await supabase
    .from("projects")
    .select("developer_id")
    .eq("status", "approved")
    .eq("active", true);

  const countsMap: Record<string, number> = {};
  (projectCounts || []).forEach((p: any) => {
    countsMap[p.developer_id] = (countsMap[p.developer_id] || 0) + 1;
  });

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-14 text-center">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "شركاء التطوير" : "Development Partners"}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "كل" : "All"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المطورين العقاريين" : "Real Estate Developers"}
              </span>
            </h1>
          </div>

          <CompaniesGrid developers={developers || []} counts={countsMap} isAr={isAr} locale={locale} />
        </div>
      </section>

      <Footer />
    </main>
  );
}