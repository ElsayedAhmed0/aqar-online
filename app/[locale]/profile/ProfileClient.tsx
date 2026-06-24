"use client";

import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import ProfileContent from "@/components/profile/ProfileContent";

export default function ProfilePage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "حسابك" : "Your Account"}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "الصفحة" : "My"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "الشخصية" : "Profile"}
              </span>
            </h1>
          </div>

          <ProfileContent />
        </div>
      </section>
    </main>
  );
}
