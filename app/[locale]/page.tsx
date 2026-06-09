import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import StatsSection from "@/components/StatsSection";
import PropertiesSection from "@/components/PropertiesSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import AddListingButton from "@/components/AddListingButton";
import SideAds from "@/components/SideAds";

export default function Home() {
  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      {/* Hero — full width */}
      <HeroSection />

      {/* Layout — محتوى + إعلانات جانبية */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex gap-8 items-start">

          {/* المحتوى الرئيسي — 75% */}
          <div className="flex-1 min-w-0">
            <BentoGrid />
            <StatsSection />
            <PropertiesSection />
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