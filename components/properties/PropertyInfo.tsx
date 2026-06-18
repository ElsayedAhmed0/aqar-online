"use client";

import { HiOutlineMapPin, HiOutlineShare, HiOutlineTag, HiOutlineEye } from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { MdOutlineApartment, MdOutlineVilla, MdOutlineStorefront } from "react-icons/md";

const typeIcons: Record<string, any> = {
  apartment: MdOutlineApartment,
  villa: MdOutlineVilla,
  commercial: MdOutlineStorefront,
};

export default function PropertyInfo({ property, isAr }: { property: any; isAr: boolean }) {
  const TypeIcon = typeIcons[property.type] || MdOutlineApartment;

const formatPrice = (price: number) =>
  isAr
    ? `${price.toLocaleString("ar-EG")} جنيه`
    : `EGP ${price.toLocaleString("en-US")}`;

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: isAr ? property.title_ar : property.title_en, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="bento-card bg-aura-card rounded-3xl p-5 sm:p-6 md:p-8 border border-aura-border">

      {/* النوع والمشاركة */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-aura-accent/10 text-aura-accent text-xs font-medium">
            <TypeIcon className="w-4 h-4" />
            {property.type}
          </span>
          {property.purpose && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${property.purpose === "rent" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
              {property.purpose === "rent" ? (isAr ? "للإيجار" : "For Rent") : (isAr ? "للبيع" : "For Sale")}
            </span>
          )}
          {property.negotiable && (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
              <HiOutlineTag className="w-3 h-3" />
              {isAr ? "قابل للتفاوض" : "Negotiable"}
            </span>
          )}
          {property.delivery_status && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${property.delivery_status === "ready" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
              {property.delivery_status === "ready" ? (isAr ? "✅ جاهز للتسليم" : "✅ Ready") : (isAr ? "🏗️ قيد الإنشاء" : "🏗️ Under Construction")}
            </span>
          )}
        </div>
        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300 shrink-0"
        >
          <HiOutlineShare className="w-4 h-4" />
        </button>
      </div>

      {/* السعر */}
      <div className="mb-6">
        <p className="text-2xl sm:text-3xl font-light text-aura-dark mb-1">{formatPrice(property.price)}</p>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-aura-muted">
            <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-sm">{isAr ? property.location_ar : property.location_en}</span>
          </div>

          {/* ✅ عداد المشاهدات */}
          {property.views > 0 && (
            <div className="flex items-center gap-1.5 text-aura-muted">
              <HiOutlineEye className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs">
                {property.views.toLocaleString(isAr ? "ar-EG" : "en-US")} {isAr ? "مشاهدة" : "views"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* الخصائص */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 py-5 md:py-6 border-y border-aura-border">
        {property.beds > 0 && (
          <div className="text-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-aura-canvas flex items-center justify-center mx-auto mb-2">
              <LuBedDouble className="w-4 h-4 sm:w-5 sm:h-5 text-aura-accent" />
            </div>
            <p className="text-base sm:text-lg font-light text-aura-dark">{property.beds}</p>
            <p className="text-[10px] text-aura-muted">{isAr ? "غرفة نوم" : "Bedrooms"}</p>
          </div>
        )}
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-aura-canvas flex items-center justify-center mx-auto mb-2">
            <LuBath className="w-4 h-4 sm:w-5 sm:h-5 text-aura-accent" />
          </div>
          <p className="text-base sm:text-lg font-light text-aura-dark">{property.baths}</p>
          <p className="text-[10px] text-aura-muted">{isAr ? "حمام" : "Bathrooms"}</p>
        </div>
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-aura-canvas flex items-center justify-center mx-auto mb-2">
            <LuMaximize className="w-4 h-4 sm:w-5 sm:h-5 text-aura-accent" />
          </div>
          <p className="text-base sm:text-lg font-light text-aura-dark">{property.area}</p>
          <p className="text-[10px] text-aura-muted">{isAr ? "م²" : "m²"}</p>
        </div>
      </div>

      {/* الوصف */}
      {(property.description_ar || property.description_en) && (
        <div className="mt-5 md:mt-6">
          <h3 className="text-sm font-medium text-aura-dark mb-3">{isAr ? "وصف العقار" : "Property Description"}</h3>
          <p className="text-sm text-aura-muted font-light leading-relaxed">
            {isAr ? property.description_ar : property.description_en}
          </p>
        </div>
      )}
    </div>
  );
}