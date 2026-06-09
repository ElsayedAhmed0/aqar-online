"use client";

import { useLocale } from "next-intl";

const partners = [
  { id: 1, name: "EMAAR" },
  { id: 2, name: "SODIC" },
  { id: 3, name: "PALM HILLS" },
  { id: 4, name: "TMG" },
  { id: 5, name: "MOUNTAIN VIEW" },
  { id: 6, name: "HYDE PARK" },
  { id: 7, name: "ORA" },
  { id: 8, name: "ORASCOM" },
];

export default function PartnersSection() {
  const locale = useLocale();
  const isAr = locale === "ar";

  // لو 6 أو أقل — ثابتين، لو أكتر — بيتحركوا
  const isScrolling = partners.length > 6;

  return (
    <section className="py-14 bg-aura-canvas border-t border-aura-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-3">
            {isAr ? "شركاؤنا" : "Our Partners"}
          </p>
          <h2 className="text-2xl font-light text-aura-dark">
            {isAr ? "نتعاون مع أكبر" : "We Work With"}
            <span className="font-serif italic text-aura-accent mx-2">
              {isAr ? "المطورين العقاريين" : "Top Developers"}
            </span>
          </h2>
        </div>
      </div>

      {/* ثابتين — 6 أو أقل */}
      {!isScrolling && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-4 justify-center">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center px-4 py-5 rounded-2xl bg-aura-card border border-aura-border hover:border-aura-accent transition-all duration-300 group cursor-pointer"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-aura-muted group-hover:text-aura-accent transition-colors duration-300 text-center">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* متحركين — أكتر من 6 */}
      {isScrolling && (
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-aura-canvas to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-aura-canvas to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...partners, ...partners, ...partners].map((partner, i) => (
              <div
                key={i}
                className="flex items-center justify-center px-8 py-5 mx-3 rounded-2xl bg-aura-card border border-aura-border hover:border-aura-accent transition-all duration-300 shrink-0 group cursor-pointer min-w-40"
              >
                <span className="text-sm font-bold tracking-[0.2em] text-aura-muted group-hover:text-aura-accent transition-colors duration-300">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}