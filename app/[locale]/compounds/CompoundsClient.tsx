"use client";

import { useState } from "react";
import { AREAS } from "@/lib/data/areas";
import ProjectCard from "@/components/companies/ProjectCard";
import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal, HiOutlineXMark } from "react-icons/hi2";

const CONSTRUCTION_OPTIONS = [
  { value: "under_construction", ar: "تحت الإنشاء", en: "Under Construction" },
  { value: "delivered", ar: "تم التسليم", en: "Delivered" },
];

export default function CompoundsClient({
  projects,
  isAr,
  locale,
}: {
  projects: any[];
  isAr: boolean;
  locale: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = projects.filter((p) => {
    const matchSearch =
      searchQuery === "" ||
      p.name_ar?.includes(searchQuery) ||
      p.name_en?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchArea = areaFilter === "all" || p.area_slug === areaFilter;
    const matchStatus = statusFilter === "all" || p.construction_status === statusFilter;
    return matchSearch && matchArea && matchStatus;
  });

  const FiltersContent = () => (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-aura-dark">{isAr ? "بحث بالاسم" : "Search by name"}</label>
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "اسم الكمبوند..." : "Compound name..."}
            className="w-full pr-11 pl-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-aura-dark">{isAr ? "المنطقة" : "Area"}</label>
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent">
          <option value="all">{isAr ? "كل المناطق" : "All Areas"}</option>
          {AREAS.map((a) => (
            <option key={a.slug} value={a.slug}>{isAr ? a.ar : a.en}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-aura-dark">{isAr ? "حالة الإنشاء" : "Construction Status"}</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent">
          <option value="all">{isAr ? "الكل" : "All"}</option>
          {CONSTRUCTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{isAr ? o.ar : o.en}</option>
          ))}
        </select>
      </div>

      {(searchQuery || areaFilter !== "all" || statusFilter !== "all") && (
        <button
          onClick={() => { setSearchQuery(""); setAreaFilter("all"); setStatusFilter("all"); }}
          className="w-full py-2.5 rounded-2xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark transition-all"
        >
          {isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
        </button>
      )}
    </div>
  );

  return (
    <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "دليل الكمبوندات" : "Compounds Directory"}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "كل" : "All"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "الكمبوندات والمشاريع" : "Compounds & Projects"}
              </span>
            </h1>
          </div>

          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-aura-border bg-aura-card text-aura-dark text-sm w-fit"
          >
            <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
            {isAr ? "الفلاتر" : "Filters"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border lg:sticky lg:top-28">
              <FiltersContent />
            </div>
          </aside>

          <div className="lg:col-span-9">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 bg-aura-card rounded-3xl border border-aura-border">
                <p className="text-4xl">🏗️</p>
                <p className="text-aura-muted font-light">{isAr ? "لا توجد مشاريع مطابقة" : "No matching projects"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {filtered.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isAr={isAr}
                    locale={locale}
                    companySlug={project.developers?.slug || ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* فلتر الموبايل */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-aura-dark/40 backdrop-blur-md" onClick={() => setFilterOpen(false)} />
        <div className={`absolute top-0 ${isAr ? "right-0" : "left-0"} w-[85vw] max-w-sm h-full bg-aura-card overflow-y-auto transition-transform duration-300 ${filterOpen ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-aura-border sticky top-0 bg-aura-card z-10">
            <h3 className="text-sm font-medium text-aura-dark">{isAr ? "الفلاتر" : "Filters"}</h3>
            <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full border border-aura-border flex items-center justify-center text-aura-muted">
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <FiltersContent />
          </div>
        </div>
      </div>
    </section>
  );
}