"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "@/context/WishlistContext";
import PropertyCard from "@/components/properties/PropertyCard";

export default function SimilarProperties({
  properties,
  isAr,
  locale,
}: {
  properties: any[];
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
      ? `${(price / 1000000).toFixed(1)} مليون جنيه`
      : `EGP ${(price / 1000000).toFixed(1)}M`;

  if (!mounted) return null;

  return (
    <section className="mt-16">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-3">
          {isAr ? "قد يعجبك أيضاً" : "You May Also Like"}
        </p>
        <h2 className="text-3xl font-light text-aura-dark">
          {isAr ? "عقارات" : "Similar"}
          <span className="font-serif italic text-aura-accent mx-2">
            {isAr ? "مشابهة" : "Properties"}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <a key={property.id} href={`/${locale}/properties/${property.id}`}>
            <PropertyCard
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
          </a>
        ))}
      </div>
    </section>
  );
}