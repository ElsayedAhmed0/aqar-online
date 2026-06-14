
"use client";

import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";
import { HiOutlineXMark } from "react-icons/hi2";

type Props = {
  isAr: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeType: string;
  setActiveType: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minArea: number;
  setMinArea: (v: number) => void;
  minBeds: number;
  setMinBeds: (v: number) => void;
  total: number;
  onClear: () => void;
};

export default function PropertiesFilter({
  isAr, searchQuery, setSearchQuery, activeType, setActiveType,
  maxPrice, setMaxPrice, minArea, setMinArea, minBeds, setMinBeds,
  total, onClear,
}: Props) {
  const { types } = usePropertyTypes();
  const hasFilters = searchQuery || activeType !== "all" || maxPrice < 10000000 || minArea > 0 || minBeds > 0;

  return (
    <div className="sticky top-28 bg-aura-card border border-aura-border rounded-3xl p-6 shadow-sm space-y-6">

      {/* الهيدر */}
      <div className="flex justify-between items-center border-b border-aura-border pb-4">
        <h3 className="text-sm font-medium text-aura-dark flex items-center gap-2">
          <span className="text-aura-accent">⚙</span>
          {isAr ? "خيارات التصفية" : "Filter Options"}
        </h3>
        {hasFilters && (
          <button onClick={onClear} className="text-[10px] text-aura-muted hover:text-red-500 transition-colors flex items-center gap-1">
            <HiOutlineXMark className="w-3 h-3" />
            {isAr ? "إعادة تعيين" : "Reset"}
          </button>
        )}
      </div>

      {/* بحث */}
      <div className="space-y-2">
        <label className="block text-[10px] text-aura-muted uppercase tracking-wider font-medium">
          {isAr ? "ابحث بكلمة دلالية أو حي" : "Search by keyword or area"}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "مثال: التجمع، مسبح..." : "e.g. New Cairo, pool..."}
            className="w-full text-xs px-4 py-3.5 bg-aura-canvas border border-aura-border rounded-2xl focus:border-aura-accent outline-none text-aura-dark pr-10 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-aura-muted text-xs">🔍</span>
        </div>
      </div>

      {/* نوع العقار */}
      <div className="space-y-2">
        <label className="block text-[10px] text-aura-muted uppercase tracking-wider font-medium">
          {isAr ? "نوع العقار" : "Property Type"}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveType("all")}
            className={`py-3 text-xs font-medium rounded-xl transition-all duration-300 ${activeType === "all" ? "bg-aura-dark text-white" : "bg-white text-aura-muted border border-aura-border hover:border-aura-accent hover:text-aura-dark"}`}>
            {isAr ? "الكل" : "All"}
          </button>
          {types.map((t) => (
            <button key={t.value} onClick={() => setActiveType(t.value)}
              className={`py-3 text-xs font-medium rounded-xl transition-all duration-300 ${activeType === t.value ? "bg-aura-dark text-white" : "bg-white text-aura-muted border border-aura-border hover:border-aura-accent hover:text-aura-dark"}`}>
              {isAr ? t.name_ar : t.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* الحد الأقصى للسعر */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-aura-muted">{isAr ? "الحد الأقصى للسعر" : "Max Price"}</span>
          <span className="text-aura-dark font-medium">
            {isAr ? `${(maxPrice / 1000000).toFixed(1)} مليون` : `EGP ${(maxPrice / 1000000).toFixed(1)}M`}
          </span>
        </div>
        <input type="range" min={500000} max={10000000} step={100000} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1 bg-aura-canvas rounded-lg appearance-none cursor-pointer accent-aura-accent" />
        <div className="flex justify-between text-[9px] text-aura-muted">
          <span>{isAr ? "500 ألف" : "500K"}</span>
          <span>{isAr ? "10 مليون" : "10M"}</span>
        </div>
      </div>

      {/* الحد الأدنى للمساحة */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-aura-muted">{isAr ? "الحد الأدنى للمساحة" : "Min Area"}</span>
          <span className="text-aura-dark font-medium">{minArea} {isAr ? "م²" : "m²"}</span>
        </div>
        <input type="range" min={0} max={1000} step={10} value={minArea}
          onChange={(e) => setMinArea(Number(e.target.value))}
          className="w-full h-1 bg-aura-canvas rounded-lg appearance-none cursor-pointer accent-aura-accent" />
        <div className="flex justify-between text-[9px] text-aura-muted">
          <span>0</span>
          <span>1000 {isAr ? "م²" : "m²"}</span>
        </div>
      </div>

      {/* عدد الغرف */}
      <div className="space-y-2">
        <label className="block text-[10px] text-aura-muted uppercase tracking-wider font-medium">
          {isAr ? "الحد الأدنى للغرف" : "Min Bedrooms"}
        </label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setMinBeds(n)}
              className={`flex-1 py-2 text-xs rounded-xl border transition-all ${minBeds === n ? "bg-aura-dark text-white border-aura-dark" : "border-aura-border text-aura-muted hover:border-aura-accent"}`}>
              {n === 0 ? (isAr ? "الكل" : "All") : n === 5 ? "5+" : n}
            </button>
          ))}
        </div>
      </div>

      {/* عدد النتائج */}
      <div className="pt-3 border-t border-aura-border">
        <p className="text-xs text-aura-muted">
          {isAr ? `${total} عقار متاح` : `${total} properties available`}
        </p>
      </div>
    </div>
  );
}