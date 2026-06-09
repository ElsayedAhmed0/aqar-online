"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { MdOutlineAddHome } from "react-icons/md";

export default function AddListingButton() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ── CSS الـ Animation ── */}
      <style>{`
        @keyframes sonar {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        @keyframes sonar2 {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }

        @keyframes sonar3 {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(3.4);
            opacity: 0;
          }
        }

        .sonar-ring-1 {
          animation: sonar 2s ease-out infinite;
        }

        .sonar-ring-2 {
          animation: sonar2 2s ease-out infinite;
          animation-delay: 0.4s;
        }

        .sonar-ring-3 {
          animation: sonar3 2s ease-out infinite;
          animation-delay: 0.8s;
        }

        @keyframes btnPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }

        .btn-pulse {
          animation: btnPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`fixed top-28 z-40 transition-all duration-700 ${
          isAr ? "left-6" : "right-6"
        } ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <a href="/add-listing" className="relative flex items-center justify-center">

          {/* ── حلقات الـ Sonar ── */}
          <span className="sonar-ring-1 absolute inset-0 rounded-2xl bg-aura-accent" />
          <span className="sonar-ring-2 absolute inset-0 rounded-2xl bg-aura-accent" />
          <span className="sonar-ring-3 absolute inset-0 rounded-2xl bg-aura-accent" />

          {/* ── الزرار الرئيسي ── */}
          <div className="btn-pulse relative flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-aura-card/95 backdrop-blur-xl border border-aura-border shadow-xl hover:bg-aura-accent hover:border-aura-accent hover:text-white transition-all duration-300 group">

            {/* الأيقونة */}
            <div className="w-8 h-8 rounded-xl bg-aura-accent/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 shrink-0">
              <MdOutlineAddHome className="w-5 h-5 text-aura-accent group-hover:text-white transition-colors duration-300" />
            </div>

            {/* النص */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-aura-dark group-hover:text-white whitespace-nowrap leading-tight transition-colors duration-300">
                {isAr ? "أضف إعلانك" : "Add Listing"}
              </span>
              <span className="text-[10px] text-aura-muted group-hover:text-white/70 whitespace-nowrap leading-tight transition-colors duration-300">
                {isAr ? "مجاناً الآن" : "It's Free"}
              </span>
            </div>

            {/* نقطة خضراء */}
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          </div>
        </a>
      </div>
    </>
  );
}