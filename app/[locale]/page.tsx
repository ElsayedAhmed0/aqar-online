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

export default function Home() {
  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <HeroSection />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex gap-8 items-start">

          {/* المحتوى الرئيسي — 75% */}
          <div className="flex-1 min-w-0">
            <BentoGrid />
             <PartnersSection />
            <PropertiesSection />
            <StatsSection />
            
           
            <BlogSection />
          </div>

          {/* الإعلانات الجانبية — 25% sticky */}
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