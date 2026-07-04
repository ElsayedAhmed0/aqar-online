"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { HiOutlineSparkles, HiOutlineClipboardDocument, HiOutlineCheckCircle } from "react-icons/hi2";

type Props = {
  property: any;
  isAr: boolean;
};

export default function FeaturedBanner({ property, isAr }: Props) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // يظهر بس لصاحب الإعلان
  if (!user || user.id !== property.user_id) return null;

  // لو الإعلان مميز بالفعل مش يظهر
  if (property.featured) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(String(property.listing_number));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-aura-accent/30 bg-gradient-to-l from-aura-accent/5 to-aura-accent/10 p-5 mb-8 group cursor-pointer"
      onClick={handleCopy}>

      {/* انيميشن خلفية */}
      <div className="absolute inset-0 bg-gradient-to-l from-aura-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-aura-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-aura-accent/20 flex items-center justify-center animate-pulse">
            <HiOutlineSparkles className="w-5 h-5 text-aura-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-aura-dark">
              {isAr ? "✨ ميّز إعلانك وظهر في الأول!" : "✨ Feature your listing!"}
            </p>
            <p className="text-xs text-aura-muted mt-0.5">
              {isAr ? "أرسل رقم إعلانك للأدمن واحصل على التمييز" : "Send your listing ID to admin to get featured"}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-aura-accent text-white text-xs font-medium hover:bg-aura-dark transition-all duration-300 shrink-0"
        >
          {copied ? (
            <>
              <HiOutlineCheckCircle className="w-4 h-4" />
              {isAr ? "تم النسخ!" : "Copied!"}
            </>
          ) : (
            <>
              <HiOutlineClipboardDocument className="w-4 h-4" />
              {isAr ? `انسخ الرقم # ${property.listing_number}` : `Copy ID # ${property.listing_number}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}