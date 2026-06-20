"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useLocale } from "next-intl";
import { useFilter } from "@/context/FilterContext";
import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";
import { createClient } from "@/lib/supabase/client";
import { HiOutlineHome } from "react-icons/hi2";
import PropertyCard from "@/components/properties/PropertyCard";

export default function PropertiesSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { activeFilter, setActiveFilter, searchQuery } = useFilter();
  const { liked, toggleLike } = useWishlist();
  const { types: propertyTypes } = usePropertyTypes();

  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProps(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(12);
      if (data) setProperties(data);
      setLoadingProps(false);
    };
    fetchProperties();
  }, []);

  const filtered = properties.filter((p) => {
    const matchType = activeFilter === "all" || p.type === activeFilter;
    const matchSearch = searchQuery === "" ||
      p.title_ar?.includes(searchQuery) ||
      p.title_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location_ar?.includes(searchQuery) ||
      p.location_en?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });
  const sorted = [...filtered].sort((a, b) =>
    (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  const formatPrice = (price: number) =>
    isAr
      ? `${price.toLocaleString("ar-EG")} جنيه`
      : `EGP ${price.toLocaleString("en-US")}`;

  return (
    <section id="properties" className="py-16 md:py-20 bg-aura-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "عقاراتنا المميزة" : "Featured Properties"}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "اختر عقارك" : "Choose Your"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المثالي" : "Perfect Home"}
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-aura-card rounded-2xl p-1.5 border border-aura-border flex-wrap">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${activeFilter === "all"
                    ? "bg-aura-dark text-white shadow-sm"
                    : "text-aura-muted hover:text-aura-dark"
                  }`}
              >
                <HiOutlineHome className="w-4 h-4" />
                {isAr ? "الكل" : "All"}
              </button>

              {propertyTypes.slice(0, 2).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setActiveFilter(t.value)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${activeFilter === t.value
                      ? "bg-aura-dark text-white shadow-sm"
                      : "text-aura-muted hover:text-aura-dark"
                    }`}
                >
                  {isAr ? t.name_ar : t.name_en}
                </button>
              ))}
            </div>


            <a href={`/${locale}/properties`}
              className="px-5 py-3 rounded-2xl border border-aura-accent text-aura-accent text-xs font-medium hover:bg-aura-accent hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              {isAr ? "عرض كل العقارات ←" : "View All Properties →"}
            </a>
          </div>
        </div>

        {loadingProps ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-aura-muted font-light">
              {isAr ? "لا توجد عقارات متاحة حالياً" : "No properties available"}
            </p>
          </div>
        ) : (
          <div key={activeFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sorted.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isLiked={liked.includes(property.id)}
                onToggleLike={(e, prop) => {
                  e.stopPropagation();
                  e.preventDefault();
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
                animate
                locale={locale}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}