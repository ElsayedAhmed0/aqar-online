"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useLocale } from "next-intl";
import { useFilter } from "@/context/FilterContext";
import { HiOutlineHome } from "react-icons/hi2";
import { MdOutlineApartment, MdOutlineVilla, MdOutlineStorefront } from "react-icons/md";
import PropertyCard from "@/components/properties/PropertyCard";
import { properties } from "@/lib/data/properties";

const filters = [
  { value: "all", icon: <HiOutlineHome className="w-4 h-4" />, label_ar: "الكل", label_en: "All" },
  { value: "apartment", icon: <MdOutlineApartment className="w-4 h-4" />, label_ar: "شقق", label_en: "Apartments" },
  { value: "villa", icon: <MdOutlineVilla className="w-4 h-4" />, label_ar: "فيلات", label_en: "Villas" },
  { value: "commercial", icon: <MdOutlineStorefront className="w-4 h-4" />, label_ar: "تجاري", label_en: "Commercial" },
];

export default function PropertiesSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { activeFilter, setActiveFilter, searchQuery } = useFilter();
  const { liked, toggleLike } = useWishlist();

  const filtered = properties.filter((p) => {
  const matchType = activeFilter === "all" || p.type === activeFilter;
  const matchSearch = searchQuery === "" ||
    p.title_ar.includes(searchQuery) ||
    p.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location_ar.includes(searchQuery) ||
    p.location_en.toLowerCase().includes(searchQuery.toLowerCase());
  return matchType && matchSearch;
});

  const formatPrice = (price: number) =>
    isAr
      ? `${(price / 1000000).toFixed(1)} مليون جنيه`
      : `EGP ${(price / 1000000).toFixed(1)}M`;

  return (
    <section id="properties" className="py-18 px-6 lg:px-12 bg-aura-canvas">
      <div className="max-w-7xl mx-auto">

        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "عقاراتنا المميزة" : "Featured Properties"}
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "اختر عقارك" : "Choose Your"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المثالي" : "Perfect Home"}
              </span>
            </h2>
          </div>

          {/* الفلاتر */}
          <div className="flex items-center gap-2 bg-aura-card rounded-2xl p-1.5 border border-aura-border w-fit">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${activeFilter === f.value
                  ? "bg-aura-dark text-white shadow-sm"
                  : "text-aura-muted hover:text-aura-dark"
                  }`}
              >
                {f.icon}
                {isAr ? f.label_ar : f.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* الكروت */}
        <div key={activeFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isLiked={liked.includes(property.id)}
              onToggleLike={(e) => {
                e.stopPropagation();
                toggleLike(property.id);
              }}
              formatPrice={formatPrice}
              isAr={isAr}
              animate
            />
          ))}
        </div>

        {/* زر عرض الكل */}
        <div className="text-center mt-12">
          <button className="px-10 py-4 rounded-full border border-aura-border text-aura-dark text-sm font-medium hover:bg-aura-dark hover:text-white transition-all duration-300">
            {isAr ? "عرض جميع العقارات" : "View All Properties"}
          </button>
        </div>

      </div>
    </section>
  );
}