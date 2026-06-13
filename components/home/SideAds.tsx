"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type Ad = {
  id: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  image_url: string;
  link: string;
  badge_ar: string;
  badge_en: string;
  price: string;
  active: boolean;
  order_num: number;
};

type SideAdsProps = {
  inPanel?: boolean;
};

export default function SideAds({ inPanel = false }: SideAdsProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("ads")
        .select("*")
        .eq("active", true)
        .order("order_num", { ascending: true });
      if (data) setAds(data as Ad[]);
    };
    fetchAds();
  }, []);

  if (ads.length === 0) return null;

  const adsList = (
    <>
      <p className="text-xs tracking-[0.2em] uppercase text-aura-muted">
        {isAr ? "إعلانات مميزة" : "Featured Ads"}
      </p>

      {ads.map((ad) => (
        
         <a key={ad.id}
          href={ad.link || "#"}
          target={ad.link?.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className={`relative rounded-2xl overflow-hidden group cursor-pointer block border border-aura-border hover:border-aura-accent transition-all duration-300 ${
            inPanel ? "h-36 shadow-sm hover:shadow-md" : "h-48 shadow-md hover:shadow-xl"
          }`}
        >
          {/* الصورة */}
          {ad.image_url ? (
            <img src={ad.image_url} alt={isAr ? ad.title_ar : ad.title_en} className="w-full h-full object-cover img-hover" />
          ) : (
            <div className="w-full h-full bg-aura-accent/20" />
          )}

          {/* لاير تدريجي */}
          <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/80 to-transparent" />

          {/* Badge */}
          {(ad.badge_ar || ad.badge_en) && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-aura-accent text-white text-[10px] font-medium">
              {isAr ? ad.badge_ar : ad.badge_en}
            </div>
          )}

          {/* النص */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h4 className="text-white font-medium text-sm leading-tight mb-1">
              {isAr ? ad.title_ar : ad.title_en}
            </h4>
            <p className="text-white/70 text-xs">
              {isAr ? ad.subtitle_ar : ad.subtitle_en}
            </p>
            {ad.price && (
              <p className="text-aura-accent text-xs font-medium mt-1">{ad.price}</p>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-aura-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      ))}
    </>
  );

  if (inPanel) {
    return (
      <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 w-full min-w-0">
        <div className="flex flex-col gap-3 max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain">
          {adsList}
        </div>
      </div>
    );
  }

  return <div className="flex flex-col gap-4 w-full">{adsList}</div>;
}