"use client";

import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/lib/hooks/useSettings";
import { HiOutlineEye, HiOutlineRocketLaunch, HiOutlineShieldCheck } from "react-icons/hi2";

export default function AboutPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <main className="min-h-screen bg-aura-bg">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-aura-bg" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
            {isAr ? "تعرف علينا" : "Who We Are"}
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-aura-dark mb-6">
            {isAr ? settings.about_title_ar || "عن عقار أونلاين" : settings.about_title_en || "About Aqar Online"}
            <span className="block font-serif italic text-aura-accent mt-2">
              {isAr ? settings.about_subtitle_ar || "منصة العقارات الأولى في مصر" : settings.about_subtitle_en || "Egypt's #1 Real Estate Platform"}
            </span>
          </h1>
          <p className="text-aura-muted text-base font-light leading-relaxed max-w-2xl">
            {isAr ? settings.about_content_ar : settings.about_content_en}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 lg:px-12 bg-aura-card border-y border-aura-border">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-light text-aura-accent">{settings.stats_properties || "500"}+</p>
            <p className="text-xs text-aura-muted mt-1">{isAr ? "عقار متاح" : "Properties"}</p>
          </div>
          <div>
            <p className="text-3xl font-light text-aura-accent">{settings.stats_clients || "1000"}+</p>
            <p className="text-xs text-aura-muted mt-1">{isAr ? "عميل سعيد" : "Happy Clients"}</p>
          </div>
          <div>
            <p className="text-3xl font-light text-aura-accent">{settings.stats_years || "5"}+</p>
            <p className="text-xs text-aura-muted mt-1">{isAr ? "سنوات خبرة" : "Years Experience"}</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bento-card bg-aura-card rounded-3xl p-8 border border-aura-border">
            <div className="w-10 h-10 rounded-xl bg-aura-accent/10 flex items-center justify-center mb-5">
              <HiOutlineEye className="w-5 h-5 text-aura-accent" />
            </div>
            <h2 className="text-lg font-medium text-aura-dark mb-3">
              {isAr ? settings.about_vision_ar || "رؤيتنا" : settings.about_vision_en || "Our Vision"}
            </h2>
            <p className="text-sm text-aura-muted leading-relaxed">
              {isAr ? settings.about_vision_content_ar : settings.about_vision_content_en}
            </p>
          </div>

          <div className="bento-card bg-aura-card rounded-3xl p-8 border border-aura-border">
            <div className="w-10 h-10 rounded-xl bg-aura-accent/10 flex items-center justify-center mb-5">
              <HiOutlineRocketLaunch className="w-5 h-5 text-aura-accent" />
            </div>
            <h2 className="text-lg font-medium text-aura-dark mb-3">
              {isAr ? settings.about_mission_ar || "مهمتنا" : settings.about_mission_en || "Our Mission"}
            </h2>
            <p className="text-sm text-aura-muted leading-relaxed">
              {isAr ? settings.about_mission_content_ar : settings.about_mission_content_en}
            </p>
          </div>

          <div className="bento-card bg-aura-dark rounded-3xl p-8 md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <HiOutlineShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-medium text-white mb-1">
                  {isAr ? "لماذا عقار أونلاين؟" : "Why Aqar Online?"}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed">
                  {isAr
                    ? "لأننا نضع ثقتك فوق كل شيء — كل إعلان يمر بمراجعة دقيقة قبل النشر لضمان أعلى معايير الجودة والمصداقية."
                    : "Because we put your trust above everything — every listing goes through careful review before publishing to ensure the highest standards of quality and credibility."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}