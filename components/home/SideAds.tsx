"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAds = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("promotions")
        .select("*")
        .eq("active", true)
        .order("order_num", { ascending: true });
      if (data) setAds(data as Ad[]);
    };
    fetchAds();
  }, []);

  if (ads.length === 0) return null;

  const prev = () => {
    const newIndex = currentIndex === 0 ? ads.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    carouselRef.current?.children[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const next = () => {
    const newIndex = currentIndex === ads.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    carouselRef.current?.children[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const AdCard = ({ ad, height }: { ad: Ad; height: string }) => (
    
     <a href={ad.link || "#"}
      target={ad.link?.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`relative rounded-2xl overflow-hidden group cursor-pointer block border border-aura-border hover:border-aura-accent transition-all duration-300 shrink-0 ${height}`}
    >
      {ad.image_url ? (
        <img src={ad.image_url} alt={isAr ? ad.title_ar : ad.title_en} className="w-full h-full object-cover img-hover" />
      ) : (
        <div className="w-full h-full bg-aura-accent/20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/80 to-transparent" />
      {(ad.badge_ar || ad.badge_en) && (
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-aura-accent text-white text-[10px] font-medium">
          {isAr ? ad.badge_ar : ad.badge_en}
        </div>
      )}
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
      <div className="absolute inset-0 bg-aura-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );

  // ✅ Carousel للموبايل
  const MobileCarousel = () => (
    <div className="lg:hidden">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-[0.2em] uppercase text-aura-muted" style={{display: "none"}}>
          {isAr ? "إعلانات مميزة" : "Featured Ads"}
        </p>
        {ads.length > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={isAr ? next : prev} className="w-7 h-7 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all">
              <HiOutlineChevronRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={isAr ? prev : next} className="w-7 h-7 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all">
              <HiOutlineChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* الكروت الأفقية */}
      <div
        ref={carouselRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
      >
        {ads.map((ad) => (
          <div key={ad.id} className="snap-center shrink-0 w-[80vw] sm:w-[60vw]">
            <AdCard ad={ad} height="h-48" />
          </div>
        ))}
      </div>

      {/* الـ dots */}
      {ads.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                carouselRef.current?.children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className={`rounded-full transition-all duration-300 ${i === currentIndex ? "w-4 h-1.5 bg-aura-accent" : "w-1.5 h-1.5 bg-aura-border"}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  // ✅ ديسكتوب — عمودي في الـ sidebar
  const DesktopList = () => (
    <div className="hidden lg:flex flex-col gap-4 w-full">
      <p className="text-xs tracking-[0.2em] uppercase text-aura-muted" style={{display: "none"}}>
        {isAr ? "إعلانات مميزة" : "Featured Ads"}
      </p>
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} height={inPanel ? "h-36" : "h-48"} />
      ))}
    </div>
  );

  // ✅ inPanel — للأدمن بس
  if (inPanel) {
    return (
      <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 w-full min-w-0">
        <div className="flex flex-col gap-3 max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain">
          <p className="text-xs tracking-[0.2em] uppercase text-aura-muted" style={{display: "none"}}>
            {isAr ? "إعلانات مميزة" : "Featured Ads"}
          </p>
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} height="h-36" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileCarousel />
      <DesktopList />
    </>
  );
}