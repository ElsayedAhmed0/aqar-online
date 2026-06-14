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
};

function PartnerCard({ partner }: { partner: Partner }) {
  const initials = partner.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-aura-card border border-aura-border hover:border-aura-accent/50 hover:shadow-[0_8px_30px_rgba(196,181,165,0.15)] transition-all duration-300 shrink-0 group">
      {partner.logo_url ? (
        <div className="w-12 h-12 rounded-xl border border-aura-border bg-aura-canvas flex items-center justify-center overflow-hidden shrink-0 group-hover:border-aura-accent/30 transition-all duration-300">
          <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain p-1" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-aura-canvas border border-aura-border flex items-center justify-center shrink-0 group-hover:bg-aura-accent/10 group-hover:border-aura-accent/30 transition-all duration-300">
          <span className="text-[10px] font-bold tracking-wider text-aura-accent">{initials}</span>
        </div>
      )}
      <span className="text-sm font-semibold tracking-[0.18em] text-aura-muted group-hover:text-aura-dark transition-colors duration-300 whitespace-nowrap">
        {partner.name}
      </span>
    </div>
  );
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
    <div className="flex shrink-0 items-center gap-5 pr-5">
      {partners.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-aura-canvas border-t border-aura-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-3">
            {isAr ? "شركاؤنا" : "Our Partners"}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-aura-dark">
            {isAr ? "نتعاون مع أكبر" : "We Work With"}
            <span className="font-serif italic text-aura-accent mx-2">
              {isAr ? "المطورين العقاريين" : "Top Developers"}
            </span>
          </h2>
          <p className="text-sm text-aura-muted font-light mt-3 max-w-xl mx-auto">
            {isAr
              ? "شراكات استراتيجية مع أبرز شركات التطوير العقاري في مصر"
              : "Strategic partnerships with Egypt's top real estate developers"}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10 bg-gradient-to-r from-aura-canvas via-aura-canvas/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10 bg-gradient-to-l from-aura-canvas via-aura-canvas/80 to-transparent" />
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