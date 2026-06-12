"use client";

import { useState, useMemo } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import { HiOutlineHeart } from "react-icons/hi2";

export default function WishlistPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { liked, items, toggleLike } = useWishlist();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let list = [...items];
    if (activeFilter !== "all") {
      list = list.filter((p) => p.type === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title_ar?.includes(searchQuery) ||
          p.title_en?.toLowerCase().includes(q) ||
          p.location_ar?.includes(searchQuery) ||
          p.location_en?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, activeFilter, searchQuery]);

  const formatPrice = (price: number) =>
    isAr
      ? `${(price / 1000000).toFixed(1)} مليون جنيه`
      : `EGP ${(price / 1000000).toFixed(1)}M`;

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* العنوان */}
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "قائمتك المفضلة" : "Your Wishlist"}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "العقارات" : "Saved"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المحفوظة" : "Properties"}
              </span>
            </h1>
          </div>

          {/* فلاتر */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex gap-2 bg-aura-card p-1.5 rounded-2xl border border-aura-border w-fit">
              {[
                { value: "all", label_ar: "الكل", label_en: "All" },
                { value: "apartment", label_ar: "شقق", label_en: "Apartments" },
                { value: "villa", label_ar: "فيلات", label_en: "Villas" },
                { value: "commercial", label_ar: "تجاري", label_en: "Commercial" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    activeFilter === f.value
                      ? "bg-aura-dark text-white"
                      : "text-aura-muted hover:text-aura-dark"
                  }`}
                >
                  {isAr ? f.label_ar : f.label_en}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "بحث..." : "Search..."}
              className="px-4 py-2.5 rounded-2xl border border-aura-border bg-aura-card text-aura-dark text-sm outline-none focus:border-aura-accent transition-all max-w-xs"
            />
          </div>

          {/* الكروت */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-aura-card rounded-3xl border border-aura-border">
              <div className="w-20 h-20 rounded-full bg-aura-canvas flex items-center justify-center">
                <HiOutlineHeart className="w-10 h-10 text-aura-accent/40" />
              </div>
              <p className="text-aura-muted font-light text-lg">
                {isAr ? "لم تضف أي عقار بعد" : "No properties saved yet"}
              </p>
              
               <a href={`/${locale}`}
                className="px-8 py-3 rounded-full bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all duration-300"
              >
                {isAr ? "تصفح العقارات" : "Browse Properties"}
              </a>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-aura-muted">{isAr ? "لا توجد نتائج" : "No results"}</p>
              <button
                onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                className="mt-4 text-sm text-aura-accent hover:text-aura-dark transition-colors"
              >
                {isAr ? "مسح الفلاتر" : "Clear filters"}
              </button>
            </div>
          ) : (
            <>
              <p className="text-aura-muted text-sm mb-6">
                {isAr ? `${filtered.length} عقار محفوظ` : `${filtered.length} saved properties`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property as any}
                    isLiked={liked.includes(property.id)}
                    onToggleLike={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleLike(property.id);
                    }}
                    formatPrice={formatPrice}
                    isAr={isAr}
                    locale={locale}
                    showFeatured={false}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}