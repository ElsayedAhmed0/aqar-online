"use client";

import { useEffect, useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import MyListingCard from "@/components/listings/MyListingCard";
import DeveloperProfileEditor from "@/components/dashboard/DeveloperProfileEditor";
import CompanyProfileEditor from "@/components/dashboard/CompanyProfileEditor";
import MyProjectsManager from "@/components/dashboard/MyProjectsManager";
import {
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
} from "react-icons/hi2";
import {
  MdOutlineApartment,
  MdOutlineVilla,
  MdOutlineStorefront,
  MdOutlineAddHome,
} from "react-icons/md";

const typeFilters = [
  { value: "all", icon: <HiOutlineHome className="w-4 h-4" />, label_ar: "الكل", label_en: "All" },
  { value: "apartment", icon: <MdOutlineApartment className="w-4 h-4" />, label_ar: "شقق", label_en: "Apartments" },
  { value: "villa", icon: <MdOutlineVilla className="w-4 h-4" />, label_ar: "فيلات", label_en: "Villas" },
  { value: "commercial", icon: <MdOutlineStorefront className="w-4 h-4" />, label_ar: "تجاري", label_en: "Commercial" },
];

export default function DashboardPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { listings, loading: listingsLoading, removeListing } = useListings();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "profile">(
    searchParams.get("tab") === "profile" ? "profile" : "listings"
  );
  const [role, setRole] = useState<string | null>(null);
  const [partner, setPartner] = useState<any>(null);
  const [developerRecord, setDeveloperRecord] = useState<any>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push(`/${locale}/login`);
  }, [user, loading, router, locale]);

  useEffect(() => {
    if (!user) return;
    const fetchRoleData = async () => {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile) setRole(profile.role);

      if (profile?.role === "agent") {
        const { data: partnerRow } = await supabase
          .from("partners")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (partnerRow) setPartner(partnerRow);
      }

      if (profile?.role === "developer") {
        const { data: devRow } = await supabase
          .from("developers")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (devRow) setDeveloperRecord(devRow);
      }

      setRoleLoading(false);
    };
    fetchRoleData();
  }, [user]);

  const filtered = useMemo(() => {
    let list = [...listings];
    if (activeFilter !== "all") list = list.filter((l) => l.type === activeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.title_ar.includes(searchQuery) ||
          l.title_en.toLowerCase().includes(q) ||
          l.location_ar.includes(searchQuery) ||
          l.location_en.toLowerCase().includes(q)
      );
    }
    return list;
  }, [listings, activeFilter, searchQuery]);

  const formatPrice = (price: number) =>
    isAr
      ? `${price.toLocaleString("ar-EG")} جنيه`
      : `EGP ${price.toLocaleString("en-US")}`;

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-aura-bg">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-1">
          {isAr ? "تصفية" : "Filter"}
        </p>
        <h3 className="text-lg font-light text-aura-dark">
          {isAr ? "إعلاناتي" : "My Listings"}
        </h3>
      </div>

      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? "بحث..." : "Search..."}
          className="w-full pr-11 pl-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all duration-300 placeholder:text-aura-muted/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => { setActiveFilter(f.value); setFilterOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-medium transition-all duration-300 ${activeFilter === f.value
              ? "bg-aura-dark text-white"
              : "bg-aura-canvas text-aura-muted hover:text-aura-dark border border-aura-border"
              }`}
          >
            {f.icon}
            {isAr ? f.label_ar : f.label_en}
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-aura-border">
        <p className="text-xs text-aura-muted">
          {isAr ? `${listings.length} إعلان` : `${listings.length} listings`}
          {listings.some((l) => l.status === "pending") && (
            <span className="block mt-1 text-amber-600">
              {isAr
                ? `${listings.filter((l) => l.status === "pending").length} بانتظار الموافقة`
                : `${listings.filter((l) => l.status === "pending").length} pending approval`}
            </span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* العنوان */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
                {isAr ? "لوحة التحكم" : "Dashboard"}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
                {role === "developer" ? (isAr ? "مشاريعي" : "My") : (isAr ? "إعلاناتي" : "My")}
                <span className="block font-serif italic text-aura-accent mt-1">
                  {role === "developer" ? (isAr ? "العقارية" : "Projects") : (isAr ? "العقارية" : "Listings")}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* ✅ زرار الفلتر على الموبايل */}
              {activeTab === "listings" && (
                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-aura-border text-aura-muted text-sm"
                >
                  <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
                  {isAr ? "تصفية" : "Filter"}
                </button>
              )}

              {!(role === "developer" && activeTab === "listings") && (
                <a href={`/${locale}/add-listing`}
                  className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium text-white bg-aura-accent hover:bg-aura-accent-dark transition-all duration-300"
                >
                  <MdOutlineAddHome className="w-5 h-5" />
                  {isAr ? "أضف إعلان" : "Add Listing"}
                </a>
              )}
            </div>
          </div>

          {/* ✅ تابات — تظهر للوسيط أو المطوّر */}
          {!roleLoading && (role === "agent" || role === "developer") && (
            <div className="flex gap-2 bg-aura-card p-1.5 rounded-2xl border border-aura-border w-fit mb-8 md:mb-10">
              <button
                onClick={() => setActiveTab("listings")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${activeTab === "listings" ? "bg-aura-dark text-white" : "text-aura-muted hover:text-aura-dark"
                  }`}
              >
                {role === "developer" ? (isAr ? "مشاريعي" : "My Projects") : (isAr ? "إعلاناتي" : "My Listings")}
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${activeTab === "profile" ? "bg-aura-dark text-white" : "text-aura-muted hover:text-aura-dark"
                  }`}
              >
                {role === "developer" ? (isAr ? "صفحة الشركة" : "Company Page") : (isAr ? "صفحة الوسيط" : "Agent Page")}
              </button>
            </div>
          )}

          {!roleLoading && role === "agent" && activeTab === "profile" && partner && (
            <DeveloperProfileEditor partner={partner} isAr={isAr} onUpdated={setPartner} />
          )}

          {!roleLoading && role === "developer" && activeTab === "profile" && developerRecord && (
            <CompanyProfileEditor developer={developerRecord} isAr={isAr} onUpdated={setDeveloperRecord} />
          )}

          {!roleLoading && role === "developer" && activeTab === "listings" && developerRecord && (
            <MyProjectsManager developerId={developerRecord.id} isAr={isAr} />
          )}

          {(roleLoading || (role !== "agent" && role !== "developer") || (role === "agent" && activeTab === "listings")) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* فلاتر — ديسكتوب فقط */}
              <aside className="hidden lg:block lg:col-span-3 min-w-0">
                <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 lg:sticky lg:top-28">
                  <FilterContent />
                </div>
              </aside>

              {/* الكروت */}
              <div className="lg:col-span-9 min-w-0">
                {listingsLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : listings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 md:py-24 gap-6 bento-card bg-aura-card rounded-3xl border border-aura-border">
                    <div className="w-20 h-20 rounded-full bg-aura-canvas flex items-center justify-center">
                      <MdOutlineAddHome className="w-10 h-10 text-aura-accent/40" />
                    </div>
                    <p className="text-aura-muted font-light text-base md:text-lg">
                      {isAr ? "لم تنشر أي إعلان بعد" : "No listings published yet"}
                    </p>

                    <a href={`/${locale}/add-listing`}
                      className="px-8 py-3 rounded-full bg-aura-accent text-white text-sm font-medium hover:bg-aura-accent-dark transition-all duration-300"
                    >
                      {isAr ? "أضف أول إعلان" : "Add Your First Listing"}
                    </a>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 bento-card bg-aura-card rounded-3xl border border-aura-border">
                    <p className="text-aura-muted font-light">
                      {isAr ? "لا توجد نتائج مطابقة" : "No matching results"}
                    </p>
                    <button
                      onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                      className="text-sm text-aura-accent hover:text-aura-accent-dark transition-colors"
                    >
                      {isAr ? "مسح الفلاتر" : "Clear filters"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {filtered.map((listing) => (
                      <MyListingCard
                        key={listing.id}
                        listing={listing}
                        isAr={isAr}
                        formatPrice={formatPrice}
                        onDelete={() => removeListing(listing.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ✅ Mobile Filter Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-aura-dark/40 backdrop-blur-md" onClick={() => setFilterOpen(false)} />
        <div className={`absolute top-0 ${isAr ? "right-0" : "left-0"} w-[85vw] max-w-sm h-full bg-aura-card overflow-y-auto transition-transform duration-300 ${filterOpen ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"
          }`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-aura-border sticky top-0 bg-aura-card z-10">
            <h3 className="text-sm font-medium text-aura-dark">
              {isAr ? "التصفية" : "Filter"}
            </h3>
            <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full border border-aura-border flex items-center justify-center text-aura-muted">
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <FilterContent />
          </div>
        </div>
      </div>
    </main>
  );
}