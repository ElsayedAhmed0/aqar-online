"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type Developer = {
  id: string;
  name: string;
  name_en?: string | null;
  logo_url?: string | null;
  active: boolean;
  order_num: number;
  slug?: string | null;
};

function DeveloperCard({ developer, locale }: { developer: Developer; locale: string }) {
  const initials = developer.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const clickable = Boolean(developer.slug);

  const cardContent = (
    <>
      {developer.logo_url ? (
        <div className="w-16 h-16 rounded-2xl border border-aura-border bg-aura-canvas flex items-center justify-center overflow-hidden group-hover:border-aura-accent/30 transition-all duration-300">
          <img src={developer.logo_url} alt={developer.name} className="max-h-full max-w-full object-contain p-2" />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-aura-canvas border border-aura-border flex items-center justify-center group-hover:bg-aura-accent/10 group-hover:border-aura-accent/30 transition-all duration-300">
          <span className="text-lg font-bold text-aura-accent">{initials}</span>
        </div>
      )}
      <span className="text-xs font-medium text-aura-muted group-hover:text-aura-dark transition-colors duration-300 text-center leading-tight">
        {developer.name}
      </span>
    </>
  );

  const className = "flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-aura-card border border-aura-border hover:border-aura-accent/50 hover:shadow-[0_8px_30px_rgba(196,181,165,0.15)] transition-all duration-300 group";

  if (clickable) {
    return (
      <a href={`/${locale}/companies/${developer.slug}`} className={className}>
        {cardContent}
      </a>
    );
  }
  return <div className={className}>{cardContent}</div>;
}

export default function DevelopersSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("developers")
        .select("*")
        .eq("active", true)
        .order("order_num", { ascending: true })
        .limit(6);
      if (data) setDevelopers(data);
    };
    fetchDevelopers();
  }, []);

  if (developers.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-aura-bg border-t border-aura-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-start mb-8 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-3">
              {isAr ? "شركاء التطوير" : "Development Partners"}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-aura-dark">
              {isAr ? "نتعاون مع أكبر" : "We Work With"}
              <span className="font-serif italic text-aura-accent mx-2">
                {isAr ? "المطورين العقاريين" : "Top Developers"}
              </span>
            </h2>
            <p className="text-sm text-aura-muted font-light mt-3 max-w-xl mx-auto md:mx-0">
              {isAr
                ? "مشاريع عقارية متكاملة من أبرز شركات التطوير في مصر"
                : "Complete real estate projects from Egypt's leading development companies"}
            </p>
          </div>

          
            <a href={`/${locale}/companies`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-aura-dark text-white text-sm font-medium hover:bg-aura-accent transition-all duration-300 shrink-0 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {isAr ? "كل المطورين" : "All Developers"}
            <span className="text-lg">{isAr ? "←" : "→"}</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {developers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}