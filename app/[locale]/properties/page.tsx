"use client";

import { useEffect, useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";
import { useWishlist } from "@/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import SideAds from "@/components/home/SideAds";
import {
  HiOutlineMagnifyingGlass, HiOutlineHome,
  HiOutlineFunnel, HiOutlineXMark,
} from "react-icons/hi2";

const ITEMS_PER_PAGE = 9;

export default function PropertiesPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const { types: propertyTypes } = usePropertyTypes();
  const { liked, toggleLike } = useWishlist();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // الفلاتر
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeType, setActiveType] = useState(searchParams.get("type") || "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const formatPrice = (price: number) =>
    isAr ? `${(price / 1000000).toFixed(1)} مليون جنيه` : `EGP ${(price / 1000000).toFixed(1)}M`;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const supabase = createClient();

      let query = supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("status", "approved");

      if (activeType !== "all") query = query.eq("type", activeType);
      if (minPrice) query = query.gte("price", Number(minPrice));
      if (maxPrice) query = query.lte("price", Number(maxPrice));
      if (searchQuery) {
        query = query.or(`title_ar.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%,location_ar.ilike.%${searchQuery}%,location_en.ilike.%${searchQuery}%`);
      }

      if (sortBy === "newest") query = query.order("created_at", { ascending: false });
      else if (sortBy === "price-asc") query = query.order("price", { ascending: true });
      else if (sortBy === "price-desc") query = query.order("price", { ascending: false });

      const from = (page - 1) * ITEMS_PER_PAGE;
      query = query.range(from, from + ITEMS_PER_PAGE - 1);

      const { data, count } = await query;
      if (data) setProperties(data);
      if (count !== null) setTotal(count);
      setLoading(false);
    };

    fetchProperties();
  }, [activeType, searchQuery, minPrice, maxPrice, sortBy, page]);

  // reset page لما الفلتر يتغير
  useEffect(() => { setPage(1); }, [activeType, searchQuery, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveType("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  const hasFilters = searchQuery || activeType !== "all" || minPrice || maxPrice;

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* العنوان */}
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "تصفح العقارات" : "Browse Properties"}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "كل" : "All"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "العقارات" : "Properties"}
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* الفلاتر — يمين */}
            <aside className="lg:col-span-3">
              <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 lg:sticky lg:top-28 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiOutlineFunnel className="w-4 h-4 text-aura-accent" />
                    <p className="text-sm font-medium text-aura-dark">{isAr ? "فلتر البحث" : "Filters"}</p>
                  </div>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs text-aura-muted hover:text-red-500 transition-colors flex items-center gap-1">
                      <HiOutlineXMark className="w-3.5 h-3.5" />
                      {isAr ? "مسح" : "Clear"}
                    </button>
                  )}
                </div>

                {/* بحث */}
                <div className="relative">
                  <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "بحث..." : "Search..."}
                    className="w-full pr-11 pl-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all"
                  />
                </div>

                {/* نوع العقار */}
                <div>
                  <p className="text-xs font-medium text-aura-muted mb-2">{isAr ? "نوع العقار" : "Property Type"}</p>
                  <div className="flex flex-col gap-1.5">
                    <button onClick={() => setActiveType("all")}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeType === "all" ? "bg-aura-dark text-white" : "bg-aura-canvas text-aura-muted hover:text-aura-dark border border-aura-border"}`}>
                      <HiOutlineHome className="w-4 h-4" />
                      {isAr ? "الكل" : "All"}
                    </button>
                    {propertyTypes.map((t) => (
                      <button key={t.value} onClick={() => setActiveType(t.value)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeType === t.value ? "bg-aura-dark text-white" : "bg-aura-canvas text-aura-muted hover:text-aura-dark border border-aura-border"}`}>
                        🏠
                        {isAr ? t.name_ar : t.name_en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* فلتر السعر */}
                <div>
                  <p className="text-xs font-medium text-aura-muted mb-2">{isAr ? "نطاق السعر (جنيه)" : "Price Range (EGP)"}</p>
                  <div className="flex gap-2">
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                      placeholder={isAr ? "من" : "Min"}
                      className="w-1/2 px-3 py-2.5 rounded-xl border border-aura-border bg-aura-canvas text-aura-dark text-xs outline-none focus:border-aura-accent transition-all" dir="ltr" />
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder={isAr ? "إلى" : "Max"}
                      className="w-1/2 px-3 py-2.5 rounded-xl border border-aura-border bg-aura-canvas text-aura-dark text-xs outline-none focus:border-aura-accent transition-all" dir="ltr" />
                  </div>
                </div>

                {/* ترتيب */}
                <div>
                  <p className="text-xs font-medium text-aura-muted mb-2">{isAr ? "ترتيب حسب" : "Sort By"}</p>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-aura-border bg-aura-canvas text-aura-dark text-xs outline-none focus:border-aura-accent transition-all">
                    <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
                    <option value="price-asc">{isAr ? "السعر: الأقل أولاً" : "Price: Low to High"}</option>
                    <option value="price-desc">{isAr ? "السعر: الأعلى أولاً" : "Price: High to Low"}</option>
                  </select>
                </div>

                {/* عدد النتائج */}
                <div className="pt-3 border-t border-aura-border">
                  <p className="text-xs text-aura-muted">
                    {isAr ? `${total} عقار` : `${total} properties`}
                  </p>
                </div>
              </div>
            </aside>

            {/* الكروت — وسط */}
            <div className="lg:col-span-6">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4 bg-aura-card rounded-3xl border border-aura-border">
                  <p className="text-aura-muted font-light">{isAr ? "لا توجد عقارات مطابقة" : "No properties found"}</p>
                  <button onClick={clearFilters} className="text-sm text-aura-accent hover:text-aura-dark transition-colors">
                    {isAr ? "مسح الفلاتر" : "Clear filters"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {properties.map((property) => (
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
                            img: prop.images?.[0] || "",
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 rounded-xl border border-aura-border text-sm text-aura-muted hover:text-aura-dark disabled:opacity-30 transition-all">
                        {isAr ? "السابق" : "Prev"}
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === p ? "bg-aura-dark text-white" : "border border-aura-border text-aura-muted hover:text-aura-dark"}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl border border-aura-border text-sm text-aura-muted hover:text-aura-dark disabled:opacity-30 transition-all">
                        {isAr ? "التالي" : "Next"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* الإعلانات الجانبية — يسار */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-28">
              <SideAds inPanel />
            </aside>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}