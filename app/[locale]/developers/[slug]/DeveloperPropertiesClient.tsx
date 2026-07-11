"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PropertiesListView from "@/components/properties/PropertiesListView";
import PropertiesFilter from "@/components/properties/PropertyFilter";
import { HiOutlineAdjustmentsHorizontal, HiOutlineXMark } from "react-icons/hi2";
import { FaWhatsapp, FaFacebook, FaLinkedin } from "react-icons/fa";

const ITEMS_PER_PAGE = 9;

type Partner = {
  id: string;
  name: string;
  name_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
};

export default function DeveloperPropertiesClient({
  partner,
  isAr,
  locale,
}: {
  partner: Partner;
  isAr: boolean;
  locale: string;
}) {
  const developerId = partner.id;

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [purpose, setPurpose] = useState("all");
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
        .eq("developer_id", developerId) // ✅ الفرق الوحيد عن /properties
        .lte("price", maxPrice);

      if (activeType !== "all") query = query.eq("type", activeType);
      if (purpose !== "all") query = query.eq("purpose", purpose);
      if (minArea > 0) query = query.gte("area", minArea);
      if (minBeds > 0) query = query.gte("beds", minBeds);
      if (searchQuery) {
        query = query.or(`title_ar.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%,location_ar.ilike.%${searchQuery}%,location_en.ilike.%${searchQuery}%`);
      }

      if (sortBy === "newest") {
        query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
      } else if (sortBy === "price-asc") {
        query = query.order("featured", { ascending: false }).order("price", { ascending: true });
      } else if (sortBy === "price-desc") {
        query = query.order("featured", { ascending: false }).order("price", { ascending: false });
      }

      const from = (page - 1) * ITEMS_PER_PAGE;
      query = query.range(from, from + ITEMS_PER_PAGE - 1);

      const { data, count } = await query;
      if (data) setProperties(data);
      if (count !== null) setTotal(count);
      setLoading(false);
    };
    fetch();
  }, [developerId, searchQuery, activeType, purpose, maxPrice, minArea, minBeds, sortBy, page]);

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
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-light text-aura-dark">
              {isAr ? "عقارات هذا المطوّر" : "Properties by this Developer"}
              <span className="text-aura-muted text-base font-light ms-2">({total})</span>
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-aura-border bg-aura-card text-aura-dark text-sm"
              >
                <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
                {isAr ? "الفلاتر" : "Filters"}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-aura-border bg-aura-card text-aura-dark text-sm outline-none focus:border-aura-accent transition-all"
              >
                <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
                <option value="price-asc">{isAr ? "السعر: الأقل أولاً" : "Price: Low to High"}</option>
                <option value="price-desc">{isAr ? "السعر: الأعلى أولاً" : "Price: High to Low"}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

          <aside className="hidden lg:block lg:col-span-3">
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

         <div className="lg:col-span-6">
            <PropertiesListView
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

          <aside className="lg:col-span-3">
            <div className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border sticky top-28">
              <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-3">
                {isAr ? "نبذة عن المطوّر" : "About the Developer"}
              </p>
              {(isAr ? partner.description_ar : partner.description_en) ? (
                <p className="text-sm text-aura-muted font-light leading-relaxed whitespace-pre-line">
                  {isAr ? partner.description_ar : partner.description_en}
                </p>
              ) : (
                <p className="text-sm text-aura-muted/60 font-light italic">
                  {isAr ? "لا يوجد وصف مضاف بعد" : "No description added yet"}
                </p>
              )}

              {partner.phone && (
                
                  <a href={`tel:${partner.phone}`}
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all duration-300"
                  dir="ltr"
                >
                  {partner.phone}
                </a>
              )}

              {(partner.whatsapp || partner.facebook_url || partner.linkedin_url) && (
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-aura-border">
                  {partner.whatsapp && (
                    
                      <a href={`https://wa.me/${partner.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-green-600 hover:border-green-600 transition-all duration-300"
                      aria-label="WhatsApp"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                    </a>
                  )}
                  {partner.facebook_url && (
                    
                     <a href={partner.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-blue-600 hover:border-blue-600 transition-all duration-300"
                      aria-label="Facebook"
                    >
                      <FaFacebook className="w-4 h-4" />
                    </a>
                  )}
                  {partner.linkedin_url && (
                    
                      <a href={partner.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-sky-700 hover:border-sky-700 transition-all duration-300"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>

      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-aura-dark/40 backdrop-blur-md" onClick={() => setFilterOpen(false)} />
        <div className={`absolute top-0 ${isAr ? "right-0" : "left-0"} w-[85vw] max-w-sm h-full bg-aura-card overflow-y-auto transition-transform duration-300 ${
          filterOpen ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"
        }`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-aura-border sticky top-0 bg-aura-card z-10">
            <h3 className="text-sm font-medium text-aura-dark">
              {isAr ? "الفلاتر" : "Filters"}
            </h3>
            <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full border border-aura-border flex items-center justify-center text-aura-muted">
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
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
          </div>
        </div>
      </div>
    </section>
  );
}