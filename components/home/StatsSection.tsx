"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useSettings } from "@/lib/hooks/useSettings";
import {
  HiOutlineHome, HiOutlineUserGroup,
  HiOutlineStar, HiOutlineBuildingOffice2,
} from "react-icons/hi2";

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!started || target === 0 || hasAnimated.current) return;
    hasAnimated.current = true;
    let start = 0;
    setCount(0);
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return count;
}

function StatCard({ icon, number, suffix, label, started }: {
  icon: React.ReactNode; number: number; suffix: string;
  label: string; started: boolean;
}) {
  const count = useCountUp(number, 2000, started);
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-aura-accent/10 flex items-center justify-center text-aura-accent mb-3 sm:mb-4 group-hover:bg-aura-accent group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-3xl sm:text-4xl font-light text-aura-dark tabular-nums">
          {count.toLocaleString()}
        </span>
        <span className="text-xl sm:text-2xl font-light text-aura-accent mb-1">{suffix}</span>
      </div>
      <p className="text-aura-muted text-xs sm:text-sm font-light">{label}</p>
      <div className="w-8 h-0.5 bg-aura-accent/30 mt-3 sm:mt-4 group-hover:w-16 transition-all duration-500" />
    </div>
  );
}

export default function StatsSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { settings } = useSettings();
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <HiOutlineHome className="w-5 h-5 sm:w-7 sm:h-7" />,
      number: Number(settings.stats_properties?.replace(/,/g, "") || 2500),
      suffix: "+",
      label: isAr ? "عقار متاح" : "Properties",
    },
    {
      icon: <HiOutlineUserGroup className="w-5 h-5 sm:w-7 sm:h-7" />,
      number: Number(settings.stats_clients?.replace(/,/g, "") || 1200),
      suffix: "+",
      label: isAr ? "عميل سعيد" : "Happy Clients",
    },
    {
      icon: <HiOutlineStar className="w-5 h-5 sm:w-7 sm:h-7" />,
      number: 98,
      suffix: "%",
      label: isAr ? "نسبة الرضا" : "Satisfaction Rate",
    },
    {
      icon: <HiOutlineBuildingOffice2 className="w-5 h-5 sm:w-7 sm:h-7" />,
      number: Number(settings.stats_years?.replace(/,/g, "") || 15),
      suffix: "+",
      label: isAr ? "سنة خبرة" : "Years Experience",
    },
  ];

  return (
    <section ref={ref} className="py-12 md:py-14 bg-aura-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
            {isAr ? "أرقامنا تتكلم" : "Our Numbers Speak"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-aura-dark">
            {isAr ? "ثقة" : "Trusted By"}
            <span className="block font-serif italic text-aura-accent mt-1">
              {isAr ? "آلاف العملاء" : "Thousands"}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} started={started} />
          ))}
        </div>

      </div>
    </section>
  );
}