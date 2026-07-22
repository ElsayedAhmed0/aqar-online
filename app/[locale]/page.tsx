import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddListingButton from "@/components/layout/AddListingButton";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import StatsSection from "@/components/home/StatsSection";
import PropertiesSection from "@/components/home/PropertiesSection";
import BlogSection from "@/components/home/BlogSection";
import PartnersSection from "@/components/home/PartnersSection";
import SideAds from "@/components/home/SideAds";
import DevelopersSection from "@/components/home/DevelopersSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
   title: isAr
  ? "شقق وفيلات للبيع والإيجار في مصر"
  : "Apartments & Villas for Sale in Egypt",
    description: isAr
      ? "اكتشف آلاف العقارات المميزة في مصر — شقق، فيلات، عقارات تجارية في 27 محافظة"
      : "Discover thousands of premium properties in Egypt — apartments, villas, commercial real estate across 27 governorates",
   keywords: isAr
      ? ["عقارات مصر", "شقق للبيع", "شقق للإيجار", "فلل للبيع", "فلل للإيجار", "عقارات القاهرة", "عقارات الجيزة", "عقارات التجمع الخامس", "عقارات الشيخ زايد", "عقارات العاصمة الإدارية", "عقارات الساحل الشمالي", "كمبوندات", "مشروعات عقارية", "مطورين عقاريين", "شركات عقارية", "عقار أونلاين"]
      : ["Egypt real estate", "apartments for sale", "villas Egypt", "Aqar Online"],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title: isAr
        ? "عقار أونلاين | منصة العقارات الأولى في مصر"
        : "Aqar Online | Egypt's #1 Real Estate Platform",
      description: isAr
        ? "اكتشف آلاف العقارات المميزة في مصر"
        : "Discover thousands of premium properties in Egypt",
      url: `https://www.aqqaronline.com/${locale}`,
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

export default function Home() {
  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <HeroSection />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex gap-8 items-start">

          {/* المحتوى الرئيسي */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <BentoGrid />

            {/* الإعلانات carousel على الموبايل — قبل شركاؤنا */}
            <div className="lg:hidden py-8">
              <SideAds />
            </div>

            <PartnersSection />
            <PropertiesSection />
            <DevelopersSection />
            {/* <StatsSection /> */}
            <BlogSection />
          </div>

          {/* الإعلانات الجانبية — ديسكتوب فقط */}
          <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-28 py-12">
            <SideAds />
          </div>

        </div>
      </div>

      <Footer />
      <AddListingButton />
    </main>
  );
}