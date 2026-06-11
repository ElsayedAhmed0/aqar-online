"use client";

import { useLocale } from "next-intl";
import {
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowsUpDown,
} from "react-icons/hi2";
import { MdOutlineApartment, MdOutlineVilla, MdOutlineStorefront } from "react-icons/md";

const typeFilters = [
  { value: "all", icon: <HiOutlineHome className="w-4 h-4" />, label_ar: "الكل", label_en: "All" },
  { value: "apartment", icon: <MdOutlineApartment className="w-4 h-4" />, label_ar: "شقق", label_en: "Apartments" },
  { value: "villa", icon: <MdOutlineVilla className="w-4 h-4" />, label_ar: "فيلات", label_en: "Villas" },
  { value: "commercial", icon: <MdOutlineStorefront className="w-4 h-4" />, label_ar: "تجاري", label_en: "Commercial" },
];

const sortOptions = [
  { value: "newest", label_ar: "الأحدث", label_en: "Newest" },
  { value: "price-asc", label_ar: "السعر: الأقل", label_en: "Price: Low" },
  { value: "price-desc", label_ar: "السعر: الأعلى", label_en: "Price: High" },
];

type WishlistFiltersProps = {
  activeFilter: string;
  sortBy: string;
  searchQuery: string;
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export default function WishlistFilters({
  activeFilter,
  sortBy,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
}: WishlistFiltersProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-6 space-y-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-1">
          {isAr ? "تصفية" : "Filter"}
        </p>
        <h3 className="text-lg font-light text-aura-dark">
          {isAr ? "العقارات المحفوظة" : "Saved Properties"}
        </h3>
      </div>

      {/* بحث */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-aura-dark">
          {isAr ? "بحث" : "Search"}
        </label>
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isAr ? "ابحث بالاسم أو الموقع..." : "Search by name or location..."}
            className="w-full pr-11 pl-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
          />
        </div>
      </div>

      {/* نوع العقار */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-aura-dark">
          {isAr ? "نوع العقار" : "Property Type"}
        </label>
        <div className="flex flex-col gap-2">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-medium transition-all duration-300 ${
                activeFilter === f.value
                  ? "bg-aura-dark text-white"
                  : "bg-aura-canvas text-aura-muted hover:text-aura-dark border border-aura-border"
              }`}
            >
              {f.icon}
              {isAr ? f.label_ar : f.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* ترتيب */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-aura-dark flex items-center gap-2">
          <HiOutlineArrowsUpDown className="w-4 h-4 text-aura-accent" />
          {isAr ? "ترتيب حسب" : "Sort By"}
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all duration-300"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {isAr ? opt.label_ar : opt.label_en}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
