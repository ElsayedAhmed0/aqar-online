"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
} from "react-icons/hi2";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isAr = locale === "ar";
  const { liked } = useWishlist();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = isAr ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${nextLocale}${newPath}`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-aura-card/80 backdrop-blur-xl shadow-sm border-b border-aura-border/50"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">

          {/* روابط الـ Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-xs font-semibold text-aura-dark hover:text-aura-accent tracking-wider transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </a>
            <a href="#bento" className="text-xs font-light text-aura-muted hover:text-aura-dark tracking-wider transition-colors">
              {isAr ? "عن عقار" : "About"}
            </a>
            <a href="#properties" className="text-xs font-light text-aura-muted hover:text-aura-dark tracking-wider transition-colors">
              {isAr ? "العقارات" : "Properties"}
            </a>
            <a href="/contact" className="text-xs font-light text-aura-muted hover:text-aura-dark tracking-wider transition-colors">
              {isAr ? "اتصل بنا" : "Contact"}
            </a>
          </nav>

          {/* اللوجو */}
          <a href="/" className="flex flex-col items-center justify-center select-none">
            <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-3xl text-aura-dark">
              عقار
            </span>
            <span className="text-[9px] tracking-[0.5em] text-aura-muted -mt-1 uppercase">
              Online
            </span>
          </a>

          {/* الجانب الأيسر */}
          <div className="flex items-center gap-3">
            {/* زر الـ Wishlist */}
            <a href="/wishlist"
              className="relative w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300"
              aria-label="Wishlist"
            >
              <HiOutlineHeart className="w-4 h-4" />
              {liked.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium">
                  {liked.length}
                </span>
              )}
            </a>
            {/* زر Dark/Light Mode */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <HiOutlineSun className="w-4 h-4" />
                ) : (
                  <HiOutlineMoon className="w-4 h-4" />
                )}
              </button>
            )}

            {/* زر اللغة */}
            <button
              onClick={toggleLanguage}
              className="w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300"
              aria-label="Toggle language"
            >
              <HiOutlineGlobeAlt className="w-4 h-4" />
            </button>

            {/* زر تسجيل الدخول */}

            <a href="/login"
              className="hidden md:block px-6 py-2.5 rounded-full text-xs font-medium text-white bg-aura-accent hover:bg-aura-accent-dark transition-all duration-300 shadow-sm"
            >
              {isAr ? "تسجيل الدخول" : "Login"}
            </a>

            {/* زر Mobile Menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-aura-dark p-2"
              aria-label="Menu"
            >
              <HiOutlineBars3 className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="absolute inset-0 bg-aura-dark/40 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 w-80 h-full bg-aura-card p-8 flex flex-col justify-between transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-2xl text-aura-dark">
                عقار
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-aura-dark">
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              <a href="#hero" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-aura-dark">
                {isAr ? "الرئيسية" : "Home"}
              </a>
              <a href="#bento" onClick={() => setMobileOpen(false)} className="text-sm font-light text-aura-muted">
                {isAr ? "عن عقار" : "About"}
              </a>
              <a href="#properties" onClick={() => setMobileOpen(false)} className="text-sm font-light text-aura-muted">
                {isAr ? "العقارات" : "Properties"}
              </a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="text-sm font-light text-aura-muted">
                {isAr ? "اتصل بنا" : "Contact"}
              </a>
            </nav>
          </div>
          <div className="border-t border-aura-border pt-6">
            <p className="text-xs text-aura-muted mb-4">
              {isAr ? "هل تحتاج إلى مساعدة؟" : "Need help?"}
            </p>
            <a href="tel:920001234" className="flex items-center gap-2 text-sm font-medium text-aura-dark">
              <HiOutlinePhone className="w-4 h-4 text-aura-accent" />
              920001234
            </a>
          </div>
        </div>
      </div>
    </>
  );
}