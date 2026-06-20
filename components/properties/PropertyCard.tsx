"use client";

import { HiOutlineHeart, HiOutlineMapPin } from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import type { Property } from "@/lib/data/properties";

type PropertyCardProps = {
  property: Property;
  isLiked: boolean;
  onToggleLike: (e: React.MouseEvent, property: Property) => void;
  formatPrice: (price: number) => string;
  isAr: boolean;
  showFeatured?: boolean;
  animate?: boolean;
  locale?: string;
};

export default function PropertyCard({
  property,
  isLiked,
  onToggleLike,
  formatPrice,
  isAr,
  showFeatured = true,
  animate = false,
  locale = "ar",
}: PropertyCardProps) {
  const purpose = (property as any).purpose;

  return (

    <a href={`/${locale}/properties/${property.id}`}
      className={`bento-card bg-aura-card rounded-3xl overflow-hidden group cursor-pointer block ${animate ? "card-animate" : ""}`}
    >
      {/* الصورة */}
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
        <img
          src={property.images?.[0] || property.img || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
          alt={property.title_en}
          className="w-full h-full object-cover img-hover"
        />

        {/* مميز */}
        {showFeatured && property.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-aura-accent text-white text-xs font-medium animate-pulse shadow-lg">
            ⭐ {isAr ? "مميز" : "Featured"}
          </div>
        )}

        {/* للبيع / للإيجار */}
        {purpose && (
          <div className={`absolute top-3 px-3 py-1 rounded-full text-xs font-medium ${showFeatured && property.featured ? "right-20" : "right-3"
            } ${purpose === "rent"
              ? "bg-blue-500/90 text-white"
              : "bg-aura-accent/90 text-white"
            }`}>
            {purpose === "rent"
              ? (isAr ? "للإيجار" : "For Rent")
              : (isAr ? "للبيع" : "For Sale")}
          </div>
        )}

        {/* زرار المفضلة */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(e, property); }}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
          aria-label={isAr ? "المفضلة" : "Wishlist"}
        >
          <HiOutlineHeart className={`w-4 h-4 transition-colors duration-300 ${isLiked ? "text-red-500 fill-red-500" : "text-aura-muted"}`} />
        </button>

        {/* السعر */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium">
          {formatPrice(property.price)}
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg font-light text-aura-dark mb-2 leading-snug line-clamp-2">
          {isAr ? property.title_ar : property.title_en}
        </h3>

        <div className="flex items-center gap-1.5 text-aura-muted mb-4">
          <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs truncate">{isAr ? property.location_ar : property.location_en}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-aura-border flex-wrap">
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
          <span className="mr-auto text-xs font-medium text-aura-accent hover:text-aura-accent-dark transition-colors">
            {isAr ? "التفاصيل ←" : "Details →"}
          </span>
        </div>
      </div>
    </a>
  );
}