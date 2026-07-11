"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type Partner = {
  id: string;
  name: string;
  logo_url: string;
  active: boolean;
  order_num: number;
  slug?: string | null;
};

function PartnerCard({ partner, locale }: { partner: Partner; locale: string }) {
  const initials = partner.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const clickable = Boolean(partner.slug);

  const cardContent = (
    <>
      {/* اللوجو فوق */}
      {partner.logo_url ? (
        <div className="w-16 h-16 rounded-2xl border border-aura-border bg-aura-canvas flex items-center justify-center overflow-hidden group-hover:border-aura-accent/30 transition-all duration-300">
          <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain p-2" />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-aura-canvas border border-aura-border flex items-center justify-center group-hover:bg-aura-accent/10 group-hover:border-aura-accent/30 transition-all duration-300">
          <span className="text-lg font-bold text-aura-accent">{initials}</span>
        </div>
      )}

      {/* الاسم تحت */}
      <span className="text-xs font-medium text-aura-muted group-hover:text-aura-dark transition-colors duration-300 text-center leading-tight">
        {partner.name}
      </span>
    </>
  );

  const className = "flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-aura-card border border-aura-border hover:border-aura-accent/50 hover:shadow-[0_8px_30px_rgba(196,181,165,0.15)] transition-all duration-300 shrink-0 group w-36 sm:w-40";

  if (clickable) {
    return (
      <a href={`/${locale}/developers/${partner.slug}`} className={className}>
        {cardContent}
      </a>
    );
  }

  return <div className={className}>{cardContent}</div>;
}

export default function PartnersSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("partners")
        .select("*")
        .eq("active", true)
        .order("order_num", { ascending: true });
      if (data) setPartners(data);
    };
    fetchPartners();
  }, []);

  if (partners.length === 0) return null;

  const MarqueeTrack = () => (
    <div className="flex shrink-0 items-center gap-4 sm:gap-5 pr-4 sm:pr-5">
      {partners.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} locale={locale} />
      ))}
    </div>
  );

  return (
    <section className="py-14 md:py-20 bg-aura-canvas border-t border-aura-border overflow-hidden">
   <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-start">
          <div>
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-3">
              {isAr ? "شركاؤنا" : "Our Partners"}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-aura-dark">
              {isAr ? "نتعاون مع أكبر" : "We Work With"}
              <span className="font-serif italic text-aura-accent mx-2">
                {isAr ? "الوسطاء العقاريين" : "Top Agents"}
              </span>
            </h2>
            {/* <p className="text-sm text-aura-muted font-light mt-3 max-w-xl mx-auto md:mx-0">
              {isAr
                ? "شراكات استراتيجية مع أبرز الوسطاء العقاريين في مصر"
                : "Strategic partnerships with Egypt's top real estate agents"}
            </p> */}
          </div>

          
           <a href={`/${locale}/developers`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-aura-dark text-white text-sm font-medium hover:bg-aura-accent transition-all duration-300 shrink-0 hover:-translate-y-0.5 hover:shadow-lg mx-auto md:mx-0"
          >
            {isAr ? "كل الوسطاء" : "All Agents"}
            <span className="text-lg">{isAr ? "←" : "→"}</span>
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-aura-canvas via-aura-canvas/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-aura-canvas via-aura-canvas/80 to-transparent" />
        <div className="marquee-viewport">
          <div className="marquee-track">
            <MarqueeTrack />
            <div aria-hidden><MarqueeTrack /></div>
          </div>
        </div>
      </div>
    </section>
  );
}