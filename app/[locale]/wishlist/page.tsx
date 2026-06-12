"use client";

import { useState, useMemo } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import SideAds from "@/components/home/SideAds";
import WishlistFilters from "@/components/wishlist/WishlistFilters";
import PropertyCard from "@/components/properties/PropertyCard";
import { properties } from "@/lib/data/properties";
import { HiOutlineHeart } from "react-icons/hi2";

export default function WishlistPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { liked, toggleLike } = useWishlist();

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const wishlistProperties = useMemo(() => {
    let list = properties.filter((p) => liked.includes(p.id as any));

    if (activeFilter !== "all") {
      list = list.filter((p) => p.type === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title_ar.includes(searchQuery) ||
          p.title_en.toLowerCase().includes(q) ||
          p.location_ar.includes(searchQuery) ||
          p.location_en.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [liked, activeFilter, sortBy, searchQuery]);

  const formatPrice = (price: number) =>
    isAr
      ? `${(price / 1000000).toFixed(1)} مليون جنيه`
      : `EGP ${(price / 1000000).toFixed(1)}M`;

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">

          {/* العنوان */}
          <div className="mb-10 lg:mb-12">
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

          {/* فلاتر موبايل */}
          <div className="lg:hidden mb-6">
            <WishlistFilters
              activeFilter={activeFilter}
              sortBy={sortBy}
              searchQuery={searchQuery}
              onFilterChange={setActiveFilter}
              onSortChange={setSortBy}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* التخطيط: فلاتر 25% | كروت 50% | إعلانات 25% */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* فلاتر — 25% يمين في RTL */}
            <aside className="hidden lg:block lg:col-span-3 min-w-0 sticky top-28">
              <WishlistFilters
                activeFilter={activeFilter}
                sortBy={sortBy}
                searchQuery={searchQuery}
                onFilterChange={setActiveFilter}
                onSortChange={setSortBy}
                onSearchChange={setSearchQuery}
              />
            </aside>

            {/* الكروت — 50% */}
            <div className="lg:col-span-6 min-w-0">
              {liked.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 lg:py-32 gap-6 bento-card bg-aura-card rounded-3xl border border-aura-border">
                  <div className="w-20 h-20 rounded-full bg-aura-canvas flex items-center justify-center">
                    <HiOutlineHeart className="w-10 h-10 text-aura-accent/40" />
                  </div>
                  <p className="text-aura-muted font-light text-lg">
                    {isAr ? "لم تضف أي عقار بعد" : "No properties saved yet"}
                  </p>
                  <a
                    href="/#properties"
                    className="px-8 py-3 rounded-full bg-aura-accent text-white text-sm font-medium hover:bg-aura-accent-dark transition-all duration-300"
                  >
                    {isAr ? "تصفح العقارات" : "Browse Properties"}
                  </a>
                </div>
              ) : wishlistProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bento-card bg-aura-card rounded-3xl border border-aura-border">
                  <p className="text-aura-muted font-light">
                    {isAr ? "لا توجد نتائج مطابقة للفلتر" : "No results match your filters"}
                  </p>
                  <button
                    onClick={() => {
                      setActiveFilter("all");
                      setSearchQuery("");
                    }}
                    className="text-sm text-aura-accent hover:text-aura-accent-dark transition-colors"
                  >
                    {isAr ? "مسح الفلاتر" : "Clear filters"}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-aura-muted text-sm mb-6">
                    {isAr
                      ? `${wishlistProperties.length} عقار محفوظ`
                      : `${wishlistProperties.length} saved properties`}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlistProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isLiked={liked.includes(property.id as any)}
                        onToggleLike={(e) => {
                          e.stopPropagation();
                          toggleLike(property.id as any);
                        }}
                        formatPrice={formatPrice}
                        isAr={isAr}
                        showFeatured={false}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* إعلانات — 25% يسار في RTL */}
            <aside className="hidden lg:block lg:col-span-3 min-w-0 sticky top-28">
              <SideAds inPanel />
            </aside>
          </div>

          {/* إعلانات موبايل */}
          <div className="lg:hidden mt-8 min-w-0">
            <SideAds inPanel />
          </div>
        </div>
      </section>
    </main>
  );
}
