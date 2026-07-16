import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DevelopersGrid from "./DevelopersGrid";
import DeveloperTrustInfo from "@/components/developers/DeveloperTrustInfo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
   title: isAr ? "كل الوسطاء العقاريين" : "All Agents",
    description: isAr
      ? "تصفح كل شركاء ووسطاء عقار أونلاين العقاريين في مكان واحد"
      : "Browse all of Aqar Online's real estate agent partners",
  alternates: {
      canonical: `/${locale}/developers`,
      languages: { ar: `/ar/developers`, en: `/en/developers` },
    },
    openGraph: {
      title: isAr ? "كل الوسطاء العقاريين | عقار أونلاين" : "All Agents | Aqar Online",
      description: isAr
        ? "تصفح كل شركاء ووسطاء عقار أونلاين العقاريين"
        : "Browse all of Aqar Online's real estate agent partners",
      url: `https://www.aqqaronline.com/${locale}/developers`,
      siteName: isAr ? "عقار أونلاين" : "Aqar Online",
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
      images: [{
        url: "https://res.cloudinary.com/de6itr3fm/image/upload/v1783724293/aqar-online/u37lefl0abg9obkfrvmy.jpg",
        width: 1200,
        height: 630,
        alt: isAr ? "عقار أونلاين" : "Aqar Online",
      }],
    },
  };
}

export default async function DevelopersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: partners } = await supabase
    .from("partners")
    .select("*")
    .eq("active", true)
    .order("order_num", { ascending: true });

  const { data: listingCounts } = await supabase
    .from("listings")
    .select("developer_id")
    .eq("status", "approved")
    .not("developer_id", "is", null);

  const countsMap: Record<string, number> = {};
  (listingCounts || []).forEach((l: any) => {
    countsMap[l.developer_id] = (countsMap[l.developer_id] || 0) + 1;
  });

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-14 text-center">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "شركاؤنا" : "Our Partners"}
            </p>
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "كل" : "All"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "الوسطاء العقاريين" : "Real Estate Agents"}
              </span>
            </h1>
          </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <DeveloperTrustInfo isAr={isAr} />
            </aside>
            <div className="lg:col-span-9 order-1 lg:order-2">
              <DevelopersGrid partners={partners || []} counts={countsMap} isAr={isAr} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}