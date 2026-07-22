"use client";

import { useLocale } from "next-intl";
import { useSettings } from "@/lib/hooks/useSettings";
import { HiOutlineShieldCheck, HiOutlineMapPin, HiOutlineStar, HiOutlineUserGroup } from "react-icons/hi2";

export default function BentoGrid() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { settings } = useSettings();

  const stats = [
    { num: `${settings.stats_properties || "2,500"}+`, label: isAr ? "عقار متاح" : "Properties" },
    { num: `${settings.stats_clients || "98"}%`,       label: isAr ? "نسبة رضا العملاء" : "Client Satisfaction" },
    { num: "500+",                                      label: isAr ? "صفقة شهرياً" : "Monthly Deals" },
  ];

  return (
    <section id="bento" className="py-16 md:py-24 bg-aura-bg">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
            {isAr ? "لماذا عقار أونلاين" : "Why Aqar Online"}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
            {isAr ? "كل ما تحتاجه" : "Everything You"}
            <span className="block font-serif italic text-aura-accent mt-1">
              {isAr ? "في مكان واحد" : "Need in One Place"}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">

          <div className="bento-card sm:col-span-2 lg:col-span-2 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-56 md:min-h-64 relative overflow-hidden">
            <img
             src={settings.hero_image || "https://res.cloudinary.com/de6itr3fm/image/upload/v1783724293/aqar-online/u37lefl0abg9obkfrvmy.jpg"}
              alt="background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-aura-dark/75" />
            <div className="glow-sphere absolute -top-10 -right-10 w-48 h-48 rounded-full bg-aura-accent" />
            <div className="relative z-10">
              <p className="text-aura-accent-light text-xs tracking-widest uppercase mb-3">
                {isAr ? "خبرتنا" : "Our Experience"}
              </p>
              {/* <h3 className="text-5xl md:text-6xl font-light text-white">
                {settings.stats_years || "15"}+
              </h3> */}
              <p className="text-white/50 text-sm mt-2">
                {isAr ? " في سوق العقارات المصري" : " in Egyptian Real Estate"}
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-3 mt-6 md:mt-8 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <HiOutlineStar className="w-3 h-3 text-aura-accent" />
                </div>
              ))}
              {/* <span className="text-white/40 text-xs mr-2">
                {settings.stats_clients || "1,200"}+ {isAr ? "عميل راضي" : "Happy Clients"}
              </span> */}
            </div>
          </div>

          <div className="bento-card bg-aura-canvas rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-56 md:min-h-64">
            <div className="w-12 h-12 rounded-2xl bg-aura-accent/10 flex items-center justify-center mb-4 md:mb-6">
              <HiOutlineShieldCheck className="w-6 h-6 text-aura-accent" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-light text-aura-dark mb-2">
                {isAr ? "معاملات آمنة 100%" : "100% Safe Deals"}
              </h3>
              <p className="text-aura-muted text-sm font-light leading-relaxed">
                {isAr ? "كل العقارات موثقة ومراجعة من فريقنا المتخصص" : "All properties are verified by our expert team"}
              </p>
            </div>
          </div>

          <div className="bento-card bg-aura-accent/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-56 md:min-h-64 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-aura-accent/10 flex items-center justify-center mb-4 md:mb-6">
              <HiOutlineMapPin className="w-6 h-6 text-aura-accent" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-light text-aura-dark mb-2">
                {isAr ? "27 محافظة" : "27 Governorates"}
              </h3>
              <p className="text-aura-muted text-sm font-light leading-relaxed">
                {isAr ? "تغطية كاملة لجميع محافظات مصر" : "Full coverage across all of Egypt"}
              </p>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-20">
              {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-aura-accent" />)}
            </div>
          </div>

          <div className="bento-card bg-aura-card rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-56 md:min-h-64">
            <div className="w-12 h-12 rounded-2xl bg-aura-accent/10 flex items-center justify-center mb-4 md:mb-6">
              <HiOutlineUserGroup className="w-6 h-6 text-aura-accent" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-light text-aura-dark mb-2">
                {isAr ? "فريق متخصص" : "Expert Team"}
              </h3>
              <p className="text-aura-muted text-sm font-light leading-relaxed">
                {isAr ? "خبراء عقاريين معتمدين على أتم استعداد لمساعدتك" : "Certified real estate experts ready to assist you"}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-6 flex-wrap">
              {["A", "B", "C", "D"].map((letter) => (
                <div key={letter} className="w-9 h-9 rounded-full bg-aura-accent/20 border-2 border-aura-bg flex items-center justify-center text-xs font-medium text-aura-accent -ml-2 first:ml-0">
                  {letter}
                </div>
              ))}
              <span className="text-aura-muted text-xs mr-3">{isAr ? "+50 خبير" : "+50 Experts"}</span>
            </div>
          </div>

          {/* <div className="bento-card bg-aura-accent rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-56 md:min-h-64">
            <p className="text-white/70 text-xs tracking-widest uppercase">
              {isAr ? "إحصائياتنا" : "Our Numbers"}
            </p>
            <div className="space-y-3 md:space-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-white/60 text-xs">{stat.label}</span>
                  <span className="text-white font-light text-lg">{stat.num}</span>
                </div>
              ))}
            </div>
          </div> */}

        </div>
      </div>
    </section>
  );
}