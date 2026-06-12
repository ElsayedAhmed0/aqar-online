"use client";

import { HiOutlineMapPin, HiOutlineShare } from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { MdOutlineApartment, MdOutlineVilla, MdOutlineStorefront } from "react-icons/md";

const typeLabels = {
  apartment: { ar: "شقة سكنية", en: "Apartment" },
  villa:     { ar: "فيلا",       en: "Villa"      },
  commercial:{ ar: "تجاري",      en: "Commercial" },
};

const typeIcons = {
  apartment:  MdOutlineApartment,
  villa:      MdOutlineVilla,
  commercial: MdOutlineStorefront,
};

export default function PropertyInfo({
  property,
  isAr,
}: {
  property: any;
  isAr: boolean;
}) {
  const TypeIcon = typeIcons[property.type as keyof typeof typeIcons] || MdOutlineApartment;
  const typeLabel = typeLabels[property.type as keyof typeof typeLabels];

  const formatPrice = (price: number) =>
    isAr
      ? `${(price / 1000000).toFixed(1)} مليون جنيه`
      : `EGP ${(price / 1000000).toFixed(1)}M`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isAr ? property.title_ar : property.title_en,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bento-card bg-aura-card rounded-3xl p-8 border border-aura-border">

      {/* النوع والمشاركة */}
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-aura-accent/10 text-aura-accent text-xs font-medium">
          <TypeIcon className="w-4 h-4" />
          {isAr ? typeLabel?.ar : typeLabel?.en}
        </span>
        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300"
        >
          <HiOutlineShare className="w-4 h-4" />
        </button>
      </div>

      {/* السعر */}
      <div className="mb-6">
        <p className="text-3xl font-light text-aura-dark mb-1">
          {formatPrice(property.price)}
        </p>
        <div className="flex items-center gap-1.5 text-aura-muted">
          <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-sm">
            {isAr ? property.location_ar : property.location_en}
          </span>
        </div>
      </div>

      {/* الخصائص */}
      <div className="grid grid-cols-3 gap-4 py-6 border-y border-aura-border">
        {property.beds > 0 && (
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-aura-canvas flex items-center justify-center mx-auto mb-2">
              <LuBedDouble className="w-5 h-5 text-aura-accent" />
            </div>
            <p className="text-lg font-light text-aura-dark">{property.beds}</p>
            <p className="text-[10px] text-aura-muted">{isAr ? "غرفة نوم" : "Bedrooms"}</p>
          </div>
        )}
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-aura-canvas flex items-center justify-center mx-auto mb-2">
            <LuBath className="w-5 h-5 text-aura-accent" />
          </div>
          <p className="text-lg font-light text-aura-dark">{property.baths}</p>
          <p className="text-[10px] text-aura-muted">{isAr ? "حمام" : "Bathrooms"}</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-aura-canvas flex items-center justify-center mx-auto mb-2">
            <LuMaximize className="w-5 h-5 text-aura-accent" />
          </div>
          <p className="text-lg font-light text-aura-dark">{property.area}</p>
          <p className="text-[10px] text-aura-muted">{isAr ? "م²" : "m²"}</p>
        </div>
      </div>

      {/* الوصف */}
      {(property.description_ar || property.description_en) && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-aura-dark mb-3">
            {isAr ? "وصف العقار" : "Property Description"}
          </h3>
          <p className="text-sm text-aura-muted font-light leading-relaxed">
            {isAr ? property.description_ar : property.description_en}
          </p>
        </div>
      )}

      
    </div>
  );
}