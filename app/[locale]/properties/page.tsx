"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertiesGrid from "@/components/properties/PropertiesGrid";
import SideAds from "@/components/home/SideAds";
import PropertiesFilter from "@/components/properties/PropertiesFilter"

const ITEMS_PER_PAGE = 9;

export default function PropertiesPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeType, setActiveType] = useState(searchParams.get("type") || "all");
  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "all");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [minArea, setMinArea] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeType, purpose, maxPrice, minArea, minBeds, sortBy]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const supabase = createClient();

      let query = supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("status", "approved")
        .lte("price", maxPrice);

      if (activeType !== "all") query = query.eq("type", activeType);
      if (purpose !== "all") query = query.eq("purpose", purpose);
      if (minArea > 0) query = query.gte("area", minArea);
      if (minBeds > 0) query = query.gte("beds", minBeds);
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
    fetch();
  }, [searchQuery, activeType, purpose, maxPrice, minArea, minBeds, sortBy, page]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveType("all");
    setPurpose("all");
    setMaxPrice(10000000);
    setMinArea(0);
    setMinBeds(0);
    setSortBy("newest");
  };

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
                {isAr ? "كل" : "All"}
                <span className="block font-serif italic text-aura-accent mt-1">
                  {isAr ? "العقارات" : "Properties"}
                </span>
              </h1>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-aura-border bg-aura-card text-aura-dark text-sm outline-none focus:border-aura-accent transition-all w-fit">
                <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
                <option value="price-asc">{isAr ? "السعر: الأقل أولاً" : "Price: Low to High"}</option>
                <option value="price-desc">{isAr ? "السعر: الأعلى أولاً" : "Price: High to Low"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* الفلاتر */}
            <aside className="lg:col-span-3">
              <PropertiesFilter
                isAr={isAr}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeType={activeType}
                setActiveType={setActiveType}
                purpose={purpose}
                setPurpose={setPurpose}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minArea={minArea}
                setMinArea={setMinArea}
                minBeds={minBeds}
                setMinBeds={setMinBeds}
                total={total}
                onClear={clearFilters}
              />
            </aside>

            {/* الكروت */}
            <div className="lg:col-span-6">
              <PropertiesGrid
                properties={properties}
                loading={loading}
                isAr={isAr}
                locale={locale}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onClearFilters={clearFilters}
              />
            </div>

            {/* الإعلانات */}
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