"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { HiOutlineSearch, HiOutlineChevronDown } from "react-icons/hi";
import { HiOutlineMapPin, HiOutlineCheckCircle } from "react-icons/hi2";
import {
  MdOutlineApartment,
  MdOutlineVilla,
  MdOutlineStorefront,
  MdOutlineLandscape,
  MdOutlineGridView,
} from "react-icons/md";

const getTypes = (isAr: boolean) => [
  { value: "all",        label: isAr ? "كل الأنواع" : "All Types",   icon: <MdOutlineGridView /> },
  { value: "apartment",  label: isAr ? "شقة"        : "Apartment",   icon: <MdOutlineApartment /> },
  { value: "villa",      label: isAr ? "فيلا"       : "Villa",       icon: <MdOutlineVilla /> },
  { value: "commercial", label: isAr ? "تجاري"      : "Commercial",  icon: <MdOutlineStorefront /> },
  { value: "land",       label: isAr ? "أرض"        : "Land",        icon: <MdOutlineLandscape /> },
];

export default function HeroSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const types = getTypes(isAr);

  const [searchQuery, setSearchQuery]   = useState("");
  const [propertyType, setPropertyType] = useState(types[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── الخلفية ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-aura-dark/50" />
      </div>

      {/* ── Glow Spheres ── */}
      <div className="glow-sphere absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-aura-accent z-0" />
      <div className="glow-sphere absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-aura-accent-light z-0" />

      {/* ── المحتوى ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-aura-accent animate-pulse" />
          {isAr ? "منصة العقارات الأولى في مصر" : "Egypt's #1 Real Estate Platform"}
        </div>

        {/* العنوان */}
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
          {isAr ? (
            <>
              اكتشف
              <span className="block font-serif italic text-aura-accent-light mt-2">
                عقارك المثالي
              </span>
            </>
          ) : (
            <>
              Find Your
              <span className="block font-serif italic text-aura-accent-light mt-2">
                Perfect Property
              </span>
            </>
          )}
        </h1>

        {/* الوصف */}
        <p className="text-white/70 font-light text-lg mb-12 max-w-xl mx-auto">
          {isAr
            ? "آلاف العقارات المميزة في انتظارك — شقق، فيلات، ومحلات تجارية"
            : "Thousands of premium properties await — apartments, villas, and commercial spaces"}
        </p>

        {/* شريط البحث */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">

          {/* Custom Dropdown */}
          <div ref={dropdownRef} className="relative md:w-48">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-2 bg-black/40 hover:bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <span className="text-aura-accent text-base">{propertyType.icon}</span>
                <span>{propertyType.label}</span>
              </span>
              <HiOutlineChevronDown
                className={`w-4 h-4 text-white/50 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* القايمة */}
            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-black/70 backdrop-blur-2xl border border-white/20 rounded-xl overflow-hidden z-50 shadow-2xl">
                {types.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setPropertyType(type);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150 hover:bg-white/10 ${
                      propertyType.value === type.value
                        ? "bg-white/10 text-white"
                        : "text-white/70"
                    }`}
                  >
                    <span className="text-aura-accent text-base">{type.icon}</span>
                    <span>{type.label}</span>
                    {propertyType.value === type.value && (
                      <HiOutlineCheckCircle className="mr-auto w-4 h-4 text-aura-accent" />
                    )}
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
              placeholder={isAr ? "ابحث بالمنطقة أو المدينة..." : "Search by area or city..."}
              className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none py-3"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-white/30 hover:text-white/60 transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* زر البحث */}
          <button className="search-pill-btn flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-medium">
            <HiOutlineSearch className="w-4 h-4" />
            {isAr ? "بحث" : "Search"}
          </button>

        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
          {[
            { num: "2,500+", label: isAr ? "عقار مميز"   : "Properties"        },
            { num: "1,200+", label: isAr ? "عميل سعيد"   : "Happy Clients"     },
            { num: "15+",    label: isAr ? "سنة خبرة"    : "Years Experience"  },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-light text-white">{stat.num}</p>
              <p className="text-xs text-white/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* ── السهم للأسفل ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/50" />
        </div>
      </div>

    </section>
  );
}