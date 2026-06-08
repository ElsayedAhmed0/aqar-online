import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <HeroSection />
      <BentoGrid />
    </main>
  );
}