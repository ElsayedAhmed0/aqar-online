"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "@/context/WishlistContext";
import PropertyCard from "@/components/properties/PropertyCard";

export default function ProjectUnits({
  units,
  projectName,
  isAr,
  locale,
}: {
  units: any[];
  projectName: string;
  isAr: boolean;
  locale: string;
}) {
  const { liked, toggleLike } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) =>
    isAr
      ? `${price.toLocaleString("ar-EG")} جنيه`
      : `EGP ${price.toLocaleString("en-US")}`;

  if (!mounted || units.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-medium text-aura-dark mb-1">
        {isAr ? "الوحدات المتاحة" : "Available Units"}
        <span className="text-aura-muted font-normal text-sm mx-2">({units.length})</span>
      </h2>
      <p className="text-xs text-aura-muted mb-5">
        {isAr ? `وحدات معروضة للبيع أو الإيجار داخل ${projectName}` : `Units listed for sale or rent inside ${projectName}`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {units.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isLiked={liked.includes(property.id)}
            onToggleLike={(e, prop) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike(prop.id, {
                id: prop.id,
                title_ar: prop.title_ar,
                title_en: prop.title_en,
                location_ar: prop.location_ar,
                location_en: prop.location_en,
                price: prop.price,
                type: prop.type,
                beds: prop.beds,
                baths: prop.baths,
                area: prop.area,
                img: prop.images?.[0] || prop.img || "",
                images: prop.images || [],
                featured: prop.featured || false,
                status: prop.status,
              });
            }}
            formatPrice={formatPrice}
            isAr={isAr}
            locale={locale}
            animate
          />
        ))}
      </div>
    </section>
  );
}