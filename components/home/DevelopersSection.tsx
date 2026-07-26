"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

type Developer = {
  id: string;
  name: string;
  name_en?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  active: boolean;
  order_num: number;
  slug?: string | null;
};

function DeveloperCard({ developer, locale }: { developer: Developer; locale: string }) {
  const initials = developer.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const clickable = Boolean(developer.slug);

  const cardContent = (
    <>
      {developer.cover_image_url ? (
        <img src={developer.cover_image_url} alt={developer.name} className="w-full h-full object-cover img-hover pointer-events-none select-none" draggable={false} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-aura-dark via-aura-accent-dark to-aura-accent" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center overflow-hidden pointer-events-none">
        {developer.logo_url ? (
          <img src={developer.logo_url} alt={developer.name} className="max-h-full max-w-full object-contain p-1.5" />
        ) : (
          <span className="text-xs font-bold text-aura-accent">{initials}</span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
        <p className="text-[10px] tracking-[0.15em] text-white/70 uppercase mb-1">
          {locale === "ar" ? "مطوّر عقاري" : "Developer"}
        </p>
        <p className="text-white text-sm font-medium leading-snug drop-shadow-md">
          {developer.name}
        </p>
      </div>
    </>
  );

  const className = "relative shrink-0 w-40 sm:w-48 h-56 sm:h-64 rounded-3xl overflow-hidden group border border-aura-border snap-start";

  if (clickable) {
    return (
      <a href={`/${locale}/companies/${developer.slug}`} className={className} draggable={false}>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const didDrag = useRef(false);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("developers")
        .select("*")
        .eq("active", true)
        .order("order_num", { ascending: true });
      if (data) setDevelopers(data);
    };
    fetchDevelopers();
  }, []);

  if (developers.length === 0) return null;

  const scroll = (direction: "prev" | "next") => {
    if (!scrollRef.current) return;
    const cardWidth = 208;
    const amount = direction === "next" ? cardWidth * 2 : -cardWidth * 2;
    const dir = isAr ? -amount : amount;
    scrollRef.current.scrollBy({ left: dir, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX;
    scrollStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 5) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollStart.current - delta;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="py-14 md:py-20 bg-aura-canvas border-t border-aura-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-start">
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-aura-dark text-white text-sm font-medium hover:bg-aura-accent transition-all duration-300 shrink-0 hover:-translate-y-0.5 hover:shadow-lg mx-auto md:mx-0"
          >
            {isAr ? "كل المطورين" : "All Developers"}
            <span className="text-lg">{isAr ? "←" : "→"}</span>
          </a>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <button
          onClick={() => scroll(isAr ? "next" : "prev")}
          aria-label={isAr ? "التالي" : "Previous"}
          className="hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-aura-border bg-aura-card shadow-md items-center justify-center text-aura-dark hover:border-aura-accent hover:text-aura-accent transition-all duration-300"
        >
          <HiOutlineChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => scroll(isAr ? "prev" : "next")}
          aria-label={isAr ? "السابق" : "Next"}
          className="hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-aura-border bg-aura-card shadow-md items-center justify-center text-aura-dark hover:border-aura-accent hover:text-aura-accent transition-all duration-300"
        >
          <HiOutlineChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onClickCapture={handleClickCapture}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        >
          {developers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}