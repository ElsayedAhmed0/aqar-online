"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

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
      {partner.logo_url ? (
        <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-cover img-hover pointer-events-none select-none" draggable={false} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-aura-accent-dark via-aura-accent to-aura-accent-light flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{initials}</span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
        <p className="text-white text-sm font-medium leading-snug drop-shadow-md">
          {partner.name}
        </p>
      </div>
    </>
  );

  const className = "relative shrink-0 w-40 sm:w-48 h-56 sm:h-64 rounded-3xl overflow-hidden group border border-aura-border snap-start";

  if (clickable) {
    return (
      <a href={`/${locale}/developers/${partner.slug}`} className={className} draggable={false}>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ حالة السحب بالماوس
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const didDrag = useRef(false);

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

  const scroll = (direction: "prev" | "next") => {
    if (!scrollRef.current) return;
    const cardWidth = 208;
    const amount = direction === "next" ? cardWidth * 2 : -cardWidth * 2;
    const dir = isAr ? -amount : amount;
    scrollRef.current.scrollBy({ left: dir, behavior: "smooth" });
  };

  // ✅ سحب بالماوس (Desktop)
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

  // ✅ نمنع الضغط على الكارت (فتح الرابط) لو المستخدم كان بيسحب فعليًا
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
              {isAr ? "شركاؤنا" : "Our Partners"}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-aura-dark">
              {isAr ? "نتعاون مع أكبر" : "We Work With"}
              <span className="font-serif italic text-aura-accent mx-2">
                {isAr ? "الوسطاء العقاريين" : "Top Agents"}
              </span>
            </h2>
            <p className="text-sm text-aura-muted font-light mt-3 max-w-xl mx-auto md:mx-0">
              {isAr
                ? "شراكات استراتيجية مع أبرز الوسطاء العقاريين في مصر"
                : "Strategic partnerships with Egypt's top real estate agents"}
            </p>
          </div>

          
           <a href={`/${locale}/developers`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-aura-dark text-white text-sm font-medium hover:bg-aura-accent transition-all duration-300 shrink-0 hover:-translate-y-0.5 hover:shadow-lg mx-auto md:mx-0"
          >
            {isAr ? "كل الوسطاء" : "All Agents"}
            <span className="text-lg">{isAr ? "←" : "→"}</span>
          </a>
        </div>
      </div>

      {/* حاوية السلايدر — الأسهم على الحواف */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* سهم يمين */}
        <button
          onClick={() => scroll(isAr ? "next" : "prev")}
          aria-label={isAr ? "التالي" : "Previous"}
          className="hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-aura-border bg-aura-card shadow-md items-center justify-center text-aura-dark hover:border-aura-accent hover:text-aura-accent transition-all duration-300"
        >
          <HiOutlineChevronRight className="w-5 h-5" />
        </button>

        {/* سهم شمال */}
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
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}