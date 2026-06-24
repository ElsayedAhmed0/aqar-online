"use client";

import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddListingForm from "@/components/listings/AddListingForm";

export default function AddListingPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-10 lg:mb-12">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "أضف عقارك" : "List Your Property"}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "إضافة" : "Add"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "إعلان جديد" : "New Listing"}
              </span>
            </h1>
            <p className="text-aura-muted text-sm mt-4 max-w-xl">
              {isAr
                ? "أكمل الخطوات التالية لنشر إعلانك — سيظهر بعد مراجعة الأدمن"
                : "Complete the steps below — your listing will appear after admin review"}
            </p>
          </div>

          <AddListingForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}