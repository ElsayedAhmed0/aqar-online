"use client";

import PropertyListItem from "@/components/properties/PropertyListItem";
import Pagination from "@/components/ui/Pagination";
import { useWishlist } from "@/context/WishlistContext";

type Props = {
  properties: any[];
  loading: boolean;
  isAr: boolean;
  locale: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
};

export default function PropertiesListView({
  properties, loading, isAr, locale, page, totalPages, onPageChange, onClearFilters,
}: Props) {
  const { liked, toggleLike } = useWishlist();
  const sorted = [...properties].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const formatPrice = (price: number) =>
    isAr ? `${price.toLocaleString("ar-EG")} جنيه` : `EGP ${price.toLocaleString("en-US")}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 md:py-32">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 md:py-32 gap-4 bg-aura-card rounded-3xl border border-aura-border">
        <p className="text-4xl">🏠</p>
        <p className="text-aura-muted font-light text-base md:text-lg text-center px-4">
          {isAr ? "لا توجد عقارات مطابقة" : "No properties found"}
        </p>
        <button onClick={onClearFilters} className="text-sm text-aura-accent hover:text-aura-dark transition-colors">
          {isAr ? "مسح الفلاتر" : "Clear filters"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {sorted.map((property) => (
          <PropertyListItem
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
                img: prop.images?.[0] || "",
                images: prop.images || [],
                featured: prop.featured || false,
                status: prop.status,
              });
            }}
            formatPrice={formatPrice}
            isAr={isAr}
            locale={locale}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} isAr={isAr} />
    </div>
  );
}