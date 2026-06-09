"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const stats = [
  {
    icon: <HiOutlineHome className="w-7 h-7" />,
    number: 2500,
    suffix: "+",
    label_ar: "عقار متاح",
    label_en: "Properties",
  },
  {
    icon: <HiOutlineUserGroup className="w-7 h-7" />,
    number: 1200,
    suffix: "+",
    label_ar: "عميل سعيد",
    label_en: "Happy Clients",
  },
  {
    icon: <HiOutlineStar className="w-7 h-7" />,
    number: 98,
    suffix: "%",
    label_ar: "نسبة الرضا",
    label_en: "Satisfaction Rate",
  },
  {
    icon: <HiOutlineBuildingOffice2 className="w-7 h-7" />,
    number: 15,
    suffix: "+",
    label_ar: "سنة خبرة",
    label_en: "Years Experience",
  },
];

// Hook لعد الأرقام
function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return count;
}

// كارد إحصائية واحدة
function StatCard({
  stat,
  isAr,
  started,
}: {
  stat: (typeof stats)[0];
  isAr: boolean;
  started: boolean;
}) {
  const count = useCountUp(stat.number, 2000, started);

  return (
    <div className="flex flex-col items-center text-center group">
      {/* الأيقونة */}
     <div className="w-12 h-12 rounded-xl bg-aura-accent/10 flex items-center justify-center text-aura-accent mb-4 group-hover:bg-aura-accent group-hover:text-white transition-all duration-500">
        {stat.icon}
      </div>

      {/* الرقم */}
      <div className="flex items-end gap-1 mb-2">
       <span className="text-4xl font-light text-aura-dark tabular-nums">
          {count.toLocaleString()}
        </span>
        <span className="text-2xl font-light text-aura-accent mb-1">
          {stat.suffix}
        </span>
      </div>

      {/* التسمية */}
      <p className="text-aura-muted text-sm font-light">
        {isAr ? stat.label_ar : stat.label_en}
      </p>

      {/* خط سفلي */}
      <div className="w-8 h-0.5 bg-aura-accent/30 mt-4 group-hover:w-16 transition-all duration-500" />
    </div>
  );
}

export default function StatsSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // نبدأ العد لما السكاشن يظهر على الشاشة
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
   <section ref={ref} className="py-14 px-6 lg:px-12 bg-aura-canvas">
      <div className="max-w-7xl mx-auto">

        {/* العنوان */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
            {isAr ? "أرقامنا تتكلم" : "Our Numbers Speak"}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-aura-dark">
            {isAr ? "ثقة" : "Trusted By"}
            <span className="block font-serif italic text-aura-accent mt-1">
              {isAr ? "آلاف العملاء" : "Thousands"}
            </span>
          </h2>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} isAr={isAr} started={started} />
          ))}
        </div>

      </div>
    </section>
  );
}