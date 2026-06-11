"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
} from "react-icons/hi2";
import {
  MdOutlinePersonOutline,
  MdOutlineListAlt,
  MdOutlineLogout,
  MdOutlineAddHome,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isAr = locale === "ar";
  const { liked } = useWishlist();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تحقق من الـ role
  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    const checkRole = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsAdmin(data?.role === "admin");
    };
    checkRole();
  }, [user]);

  const toggleLanguage = () => {
    const nextLocale = isAr ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${nextLocale}${newPath}`);
  };

  const getInitials = () => {
    const name = user?.user_metadata?.full_name;
    if (name) return name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();
    return user?.email?.charAt(0).toUpperCase() || "?";
  };

  const Avatar = ({ size = "sm" }: { size?: "sm" | "md" }) => {
    const cls = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
    if (user?.user_metadata?.avatar_url) {
      return <img src={user.user_metadata.avatar_url} className={`${cls} rounded-full object-cover`} alt="avatar" />;
    }
    return (
      <div className={`${cls} rounded-full bg-aura-accent flex items-center justify-center text-white font-semibold shrink-0`}>
        {getInitials()}
      </div>
    );
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-aura-card/80 backdrop-blur-xl shadow-sm border-b border-aura-border/50" : "bg-transparent"}`}>
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
            <a href={`/${locale}/contact`} className="text-xs font-light text-aura-muted hover:text-aura-dark tracking-wider transition-colors">
              {isAr ? "اتصل بنا" : "Contact"}
            </a>
          </nav>

          {/* اللوجو */}
          <a href="/" className="flex flex-col items-center justify-center select-none">
            <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-3xl text-aura-dark">عقار</span>
            <span className="text-[9px] tracking-[0.5em] text-aura-muted -mt-1 uppercase">Online</span>
          </a>

          {/* الجانب الأيسر */}
          <div className="flex items-center gap-3">

            {/* زر الـ Wishlist */}
            <a href={`/${locale}/wishlist`} className="relative w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300" aria-label="Wishlist">
              <HiOutlineHeart className="w-4 h-4" />
              {liked.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium">
                  {liked.length}
                </span>
              )}
            </a>

            {/* زر Dark/Light Mode */}
            {/* {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300" aria-label="Toggle theme">
                {theme === "dark" ? <HiOutlineSun className="w-4 h-4" /> : <HiOutlineMoon className="w-4 h-4" />}
              </button>
            )} */}

            {/* زر اللغة */}
            <button onClick={toggleLanguage} className="w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300" aria-label="Toggle language">
              <HiOutlineGlobeAlt className="w-4 h-4" />
            </button>

            {/* لو logged in */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <a href={`/${locale}/add-listing`} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-aura-accent border border-aura-accent hover:bg-aura-accent hover:text-white transition-all duration-300">
                  <MdOutlineAddHome className="w-4 h-4" />
                  {isAr ? "أضف إعلانك" : "Add Listing"}
                </a>

                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-full border border-aura-border hover:border-aura-accent transition-all duration-300">
                    <Avatar size="sm" />
                    <span className="text-xs text-aura-dark">
                      {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 w-56 bg-aura-card border border-aura-border rounded-2xl shadow-xl overflow-hidden z-50">
                      
                      {/* هيدر */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-aura-border bg-aura-canvas">
                        <Avatar size="md" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-aura-dark truncate">
                            {user.user_metadata?.full_name || user.email?.split("@")[0]}
                          </p>
                          <p className="text-[10px] text-aura-muted truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* الصفحة الشخصية */}
                      <a href={`/${locale}/profile`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs text-aura-dark hover:bg-aura-canvas transition-colors">
                        <MdOutlinePersonOutline className="w-4 h-4 text-aura-accent shrink-0" />
                        {isAr ? "الصفحة الشخصية" : "My Profile"}
                      </a>

                      {/* إعلاناتي */}
                      <a href={`/${locale}/dashboard`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs text-aura-dark hover:bg-aura-canvas transition-colors">
                        <MdOutlineListAlt className="w-4 h-4 text-aura-accent shrink-0" />
                        {isAr ? "إعلاناتي" : "My Listings"}
                      </a>

                      {/* لوحة الإدارة — للأدمن بس */}
                      {isAdmin && (
                        <a href={`/${locale}/admin`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs text-aura-accent hover:bg-aura-accent/5 transition-colors">
                          <MdOutlineAdminPanelSettings className="w-4 h-4 shrink-0" />
                          {isAr ? "لوحة الإدارة" : "Admin Panel"}
                        </a>
                      )}

                      {/* تسجيل الخروج */}
                      <button onClick={() => { signOut(); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-500 hover:bg-red-50 transition-colors border-t border-aura-border">
                        <MdOutlineLogout className="w-4 h-4 shrink-0" />
                        {isAr ? "تسجيل الخروج" : "Sign Out"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <a href={`/${locale}/login`} className="hidden md:block px-6 py-2.5 rounded-full text-xs font-medium text-white bg-aura-accent hover:bg-aura-accent-dark transition-all duration-300 shadow-sm">
                {isAr ? "تسجيل الدخول" : "Login"}
              </a>
            )}

            {/* زر Mobile Menu */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-aura-dark p-2" aria-label="Menu">
              <HiOutlineBars3 className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-aura-dark/40 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 left-0 w-80 h-full bg-aura-card p-8 flex flex-col justify-between transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-2xl text-aura-dark">عقار</span>
              <button onClick={() => setMobileOpen(false)} className="text-aura-dark">
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              <a href="#hero" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-aura-dark">{isAr ? "الرئيسية" : "Home"}</a>
              <a href="#bento" onClick={() => setMobileOpen(false)} className="text-sm font-light text-aura-muted">{isAr ? "عن عقار" : "About"}</a>
              <a href="#properties" onClick={() => setMobileOpen(false)} className="text-sm font-light text-aura-muted">{isAr ? "العقارات" : "Properties"}</a>
              <a href={`/${locale}/contact`} onClick={() => setMobileOpen(false)} className="text-sm font-light text-aura-muted">{isAr ? "اتصل بنا" : "Contact"}</a>
            </nav>
          </div>

          <div className="border-t border-aura-border pt-6 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-aura-border">
                  <Avatar size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-aura-dark truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-aura-muted truncate">{user.email}</p>
                  </div>
                </div>

                <a href={`/${locale}/add-listing`} onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full text-xs font-medium text-white bg-aura-accent transition-all duration-300">
                  <MdOutlineAddHome className="w-4 h-4" />
                  {isAr ? "أضف إعلانك" : "Add Listing"}
                </a>

                <a href={`/${locale}/profile`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 w-full px-6 py-3 rounded-full text-xs font-medium text-aura-dark border border-aura-border transition-all duration-300">
                  <MdOutlinePersonOutline className="w-4 h-4 text-aura-accent" />
                  {isAr ? "الصفحة الشخصية" : "My Profile"}
                </a>

                <a href={`/${locale}/dashboard`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 w-full px-6 py-3 rounded-full text-xs font-medium text-aura-dark border border-aura-border transition-all duration-300">
                  <MdOutlineListAlt className="w-4 h-4 text-aura-accent" />
                  {isAr ? "إعلاناتي" : "My Listings"}
                </a>

                {/* لوحة الإدارة في الموبايل */}
                {isAdmin && (
                  <a href={`/${locale}/admin`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 w-full px-6 py-3 rounded-full text-xs font-medium text-aura-accent border border-aura-accent transition-all duration-300">
                    <MdOutlineAdminPanelSettings className="w-4 h-4" />
                    {isAr ? "لوحة الإدارة" : "Admin Panel"}
                  </a>
                )}

                <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-2 w-full px-6 py-3 rounded-full text-xs font-medium text-red-500 border border-red-100 transition-all duration-300">
                  <MdOutlineLogout className="w-4 h-4" />
                  {isAr ? "تسجيل الخروج" : "Sign Out"}
                </button>
              </>
            ) : (
              <a href={`/${locale}/login`} onClick={() => setMobileOpen(false)} className="block w-full text-center px-6 py-3 rounded-full text-xs font-medium text-white bg-aura-accent transition-all duration-300">
                {isAr ? "تسجيل الدخول" : "Login"}
              </a>
            )}

            <div className="pt-2">
              <p className="text-xs text-aura-muted mb-3">{isAr ? "هل تحتاج إلى مساعدة؟" : "Need help?"}</p>
              <a href="tel:920001234" className="flex items-center gap-2 text-sm font-medium text-aura-dark">
                <HiOutlinePhone className="w-4 h-4 text-aura-accent" />
                920001234
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}