"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { HiOutlineSearch, HiOutlineChevronDown } from "react-icons/hi";
import { HiOutlineMapPin, HiOutlineCheckCircle, HiOutlineSquares2X2 } from "react-icons/hi2";
import { useFilter } from "@/context/FilterContext";
import { useSettings } from "@/lib/hooks/useSettings";
import { useRouter } from "next/navigation";
import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";

export default function HeroSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { types: rawTypes } = usePropertyTypes();
  const { searchQuery, setSearchQuery, propertyType, setPropertyType, setActiveFilter } = useFilter();
  const { settings } = useSettings();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const types = [
    { value: "all", label: isAr ? "كل الأنواع" : "All Types", icon: <HiOutlineSquares2X2 /> },
    ...rawTypes.map((t) => ({
      value: t.value,
      label: isAr ? t.name_ar : t.name_en,
      icon: <span>🏠</span>,
    })),
  ];

  const currentType = types.find((t) => t.value === propertyType) ?? types[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (propertyType && propertyType !== "all") params.set("type", propertyType);
    router.push(`/${locale}/properties?${params.toString()}`);
  };

  const handleTypeSelect = (value: string) => {
    setPropertyType(value);
    setActiveFilter(value);
    setDropdownOpen(false);
    if (value !== "all") {
      router.push(`/${locale}/properties?type=${value}`);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* الخلفية */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.hero_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"}
          alt="hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-aura-dark/50" />
      </div>

      {/* Glow Spheres */}
      <div className="glow-sphere absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-aura-accent z-0" />
      <div className="glow-sphere absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-aura-accent-light z-0" />

      {/* المحتوى */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs mb-6 md:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-aura-accent animate-pulse" />
          {isAr ? "منصة العقارات الأولى في مصر" : "Egypt's #1 Real Estate Platform"}
        </div>

        {/* العنوان */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light text-white mb-4 md:mb-6 leading-tight">
          {isAr
            ? (settings.hero_title_ar || "اكتشف عقارك المثالي")
            : (settings.hero_title_en || "Find Your Perfect Property")}
        </h1>

        {/* الوصف */}
        <p className="text-white/70 font-light text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto">
          {isAr
            ? (settings.hero_subtitle_ar || "آلاف العقارات المميزة في انتظارك")
            : (settings.hero_subtitle_en || "Thousands of premium properties await")}
        </p>

        {/* شريط البحث */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">

          {/* Dropdown */}
          <div ref={dropdownRef} className="relative sm:w-48">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-2 bg-black/40 hover:bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <span className="text-aura-accent text-base">{currentType.icon}</span>
                <span>{currentType.label}</span>
              </span>
              <HiOutlineChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-black/70 backdrop-blur-2xl border border-white/20 rounded-xl overflow-hidden z-50 shadow-2xl max-h-48 overflow-y-auto scrollbar-hide">
                {types.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150 hover:bg-white/10 ${propertyType === type.value ? "bg-white/10 text-white" : "text-white/70"}`}
                  >
                    <span className="text-aura-accent text-base">{type.icon}</span>
                    <span>{type.label}</span>
                    {propertyType === type.value && <HiOutlineCheckCircle className="mr-auto w-4 h-4 text-aura-accent" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* حقل البحث */}
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/20 rounded-xl px-4">
            <HiOutlineMapPin className="w-4 h-4 text-white/50 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={isAr ? "ابحث بالمنطقة أو المدينة..." : "Search by area or city..."}
              className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none py-3"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-white/30 hover:text-white/60 transition-colors text-xs">✕</button>
            )}
          </div>

          {/* زر البحث */}
          <button
            onClick={handleSearch}
            className="search-pill-btn flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-medium"
          >
            <HiOutlineSearch className="w-4 h-4" />
            {isAr ? "بحث" : "Search"}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-10 md:mt-12 flex-wrap">
          {[
            { num: `${settings.stats_properties || "2,500"}+`, label: isAr ? "عقار مميز" : "Properties" },
            { num: `${settings.stats_clients || "1,200"}+`,    label: isAr ? "عميل سعيد" : "Happy Clients" },
            { num: `${settings.stats_years || "15"}+`,         label: isAr ? "سنة خبرة" : "Years Experience" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl font-light text-white">{stat.num}</p>
              <p className="text-xs text-white/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* السهم للأسفل */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}