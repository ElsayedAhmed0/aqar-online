"use client";

import { useState } from "react";
import { HiOutlinePhone } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";

export default function ContactCard({ property, isAr }: { property: any; isAr: boolean }) {
  const [revealed, setRevealed] = useState(false);

  const phone = property.phone || "";
  const whatsapp = property.whatsapp || property.phone || "";
  const phoneClean = phone.replace(/\D/g, "");
  const waClean = whatsapp.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    isAr
      ? `مرحباً، أنا مهتم بالعقار: ${property.title_ar}`
      : `Hello, I'm interested in the property: ${property.title_en}`
  );

  return (
    <div className="lg:sticky lg:top-28">
      <div className="bento-card bg-aura-dark rounded-3xl p-5 sm:p-6 border border-aura-border">
        <h3 className="text-base font-light text-white mb-1">
          {isAr ? "تواصل مع صاحب الإعلان" : "Contact the Owner"}
        </h3>
        <p className="text-xs text-white/50 mb-5">
          {isAr ? "اضغط لإظهار بيانات التواصل" : "Click to reveal contact details"}
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3.5 rounded-2xl bg-aura-accent hover:bg-aura-accent-dark text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <HiOutlinePhone className="w-4 h-4" />
            {isAr ? "إظهار بيانات التواصل" : "Reveal Contact Info"}
          </button>
        ) : (
          <div className="flex flex-col gap-3">

            {/* رقم الهاتف */}
            <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/10">
              <HiOutlinePhone className="w-4 h-4 text-aura-accent" />
              <span className="text-white font-medium text-sm" dir="ltr">{phone}</span>
            </div>

            {/* رقم الواتساب لو مختلف */}
            {property.whatsapp && property.whatsapp !== phone && (
              <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/10">
                <FaWhatsapp className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium text-sm" dir="ltr">{property.whatsapp}</span>
              </div>
            )}

            {/* زرار اتصال */}
            
              <a href={`tel:${phoneClean}`}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-300 border border-white/10"
            >
              <HiOutlinePhone className="w-4 h-4" />
              {isAr ? "اتصال مباشر" : "Call Now"}
            </a>

            {/* زرار واتساب */}
            
              <a href={`https://wa.me/${waClean}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-all duration-300"
            >
              <FaWhatsapp className="w-4 h-4" />
              {isAr ? "تواصل عبر واتساب" : "WhatsApp"}
            </a>

          </div>
        )}
      </div>
    </div>
  );
}