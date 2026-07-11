"use client";

import { useRouter } from "next/navigation";
import { HiOutlineHeart, HiOutlineMapPin } from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { HiOutlinePhone } from "react-icons/hi2";

type Props = {
  property: any;
  isLiked: boolean;
  onToggleLike: (e: React.MouseEvent, property: any) => void;
  formatPrice: (price: number) => string;
  isAr: boolean;
  locale: string;
};

export default function PropertyListItem({
  property, isLiked, onToggleLike, formatPrice, isAr, locale,
}: Props) {
  const router = useRouter();
  const purpose = property.purpose;
  const phone = property.phone || "";
  const whatsapp = property.whatsapp || property.phone || "";

  const formatWhatsapp = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("0")) return `20${clean.slice(1)}`;
    if (clean.startsWith("20")) return clean;
    return `20${clean}`;
  };

  const waMsg = encodeURIComponent(
    isAr
      ? `مرحباً، أنا مهتم بالعقار: ${property.title_ar}`
      : `Hello, I'm interested in the property: ${property.title_en}`
  );

  return (
    <div
      onClick={() => router.push(`/${locale}/properties/${property.id}`)}
     className="bento-card bg-aura-card rounded-3xl overflow-hidden group cursor-pointer flex flex-col sm:flex-row"
    >
      {/* الصورة — على اليمين */}
      <div className="relative w-full sm:w-64 md:w-72 h-48 shrink-0 overflow-hidden">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
          alt={isAr ? property.title_ar : property.title_en}
          className="w-full h-full object-cover img-hover"
        />

        {property.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium shadow-lg">
            ⭐ {isAr ? "مميز" : "Featured"}
          </div>
        )}

        {purpose && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
            purpose === "rent" ? "bg-blue-500/90 text-white" : "bg-aura-accent/90 text-white"
          }`}>
            {purpose === "rent" ? (isAr ? "للإيجار" : "For Rent") : (isAr ? "للبيع" : "For Sale")}
          </div>
        )}

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(e, property); }}
          className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
          aria-label={isAr ? "المفضلة" : "Wishlist"}
        >
          <HiOutlineHeart className={`w-4 h-4 transition-colors duration-300 ${isLiked ? "text-red-500 fill-red-500" : "text-aura-muted"}`} />
        </button>
      </div>

      {/* المحتوى */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base sm:text-lg font-light text-aura-dark leading-snug line-clamp-1">
            {isAr ? property.title_ar : property.title_en}
          </h3>
          <span className="shrink-0 text-sm sm:text-base font-medium text-aura-accent whitespace-nowrap">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-aura-muted mb-3">
          <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs truncate">{isAr ? property.location_ar : property.location_en}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 pb-3 border-b border-aura-border flex-wrap">
          {property.beds > 0 && (
            <div className="flex items-center gap-1.5 text-aura-muted">
              <LuBedDouble className="w-4 h-4 shrink-0" />
              <span className="text-xs">{property.beds}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-aura-muted">
            <LuBath className="w-4 h-4 shrink-0" />
            <span className="text-xs">{property.baths}</span>
          </div>
          <div className="flex items-center gap-1.5 text-aura-muted">
            <LuMaximize className="w-4 h-4 shrink-0" />
            <span className="text-xs">{property.area} {isAr ? "م²" : "m²"}</span>
          </div>
        </div>

        {/* أزرار التواصل السريع */}
        <div className="flex items-center gap-2 mt-3">
          {whatsapp && (
            
             <a href={`https://wa.me/${formatWhatsapp(whatsapp)}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-all duration-300"
            >
              <FaWhatsapp className="w-3.5 h-3.5" />
              {isAr ? "واتساب" : "WhatsApp"}
            </a>
          )}
          {phone && (
            
              <a href={`tel:${phone.replace(/\D/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl border border-aura-border text-aura-dark hover:border-aura-accent hover:text-aura-accent text-xs font-medium transition-all duration-300"
            >
              <HiOutlinePhone className="w-3.5 h-3.5" />
              {isAr ? "اتصال" : "Call"}
            </a>
          )}
          <span className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-medium text-aura-accent whitespace-nowrap">
            {isAr ? "التفاصيل ←" : "Details →"}
          </span>
        </div>
      </div>
    </div>
  );
}