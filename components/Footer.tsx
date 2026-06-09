"use client";

import { useLocale } from "next-intl";
import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
} from "react-icons/hi2";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";

export default function Footer() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <footer className="bg-aura-dark text-white">

      {/* ── الجزء الرئيسي ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* اللوجو والوصف */}
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-6">
              <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-3xl text-white">
                عقار
              </span>
              <span className="text-[9px] tracking-[0.5em] text-white/40 -mt-1 uppercase">
                Online
              </span>
            </div>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6">
              {isAr
                ? "منصة العقارات الأولى في مصر — نساعدك في إيجاد عقارك المثالي بكل سهولة وأمان"
                : "Egypt's #1 real estate platform — helping you find your perfect property safely and easily"}
            </p>

            {/* السوشيال ميديا */}
            <div className="flex items-center gap-3">
              {[
                { icon: <FaFacebookF className="w-3.5 h-3.5" />, href: "#" },
                { icon: <FaInstagram className="w-3.5 h-3.5" />, href: "#" },
                { icon: <FaWhatsapp className="w-3.5 h-3.5" />, href: "#" },
                { icon: <FaTiktok className="w-3.5 h-3.5" />, href: "#" },
              ].map((social, i) => (
                
                  <a key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-aura-accent flex items-center justify-center transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label_ar: "الرئيسية",     label_en: "Home",        href: "/"            },
                { label_ar: "العقارات",      label_en: "Properties",  href: "#properties"  },
                { label_ar: "عن عقار",       label_en: "About Us",    href: "#bento"       },
                { label_ar: "اتصل بنا",      label_en: "Contact",     href: "/contact"     },
                { label_ar: "أضف إعلانك",    label_en: "Add Listing", href: "/add-listing" },
              ].map((link) => (
                
                  <a key={link.href}
                  href={link.href}
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                >
                  {isAr ? link.label_ar : link.label_en}
                </a>
              ))}
            </nav>
          </div>

          {/* أنواع العقارات */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
              {isAr ? "أنواع العقارات" : "Property Types"}
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label_ar: "شقق سكنية",    label_en: "Apartments"   },
                { label_ar: "فيلات",         label_en: "Villas"       },
                { label_ar: "محلات تجارية", label_en: "Commercial"   },
                { label_ar: "أراضي",         label_en: "Land"         },
                { label_ar: "مكاتب إدارية", label_en: "Offices"      },
              ].map((type) => (
                
                  <a key={type.label_en}
                  href="#properties"
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                >
                  {isAr ? type.label_ar : type.label_en}
                </a>
              ))}
            </nav>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
              {isAr ? "تواصل معنا" : "Contact Us"}
            </h4>
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: <HiOutlinePhone className="w-4 h-4 shrink-0" />,
                  value: "920001234",
                },
                {
                  icon: <HiOutlineEnvelope className="w-4 h-4 shrink-0" />,
                  value: "info@aqar-online.com",
                },
                {
                  icon: <HiOutlineMapPin className="w-4 h-4 shrink-0" />,
                  value: isAr ? "التجمع الخامس، القاهرة" : "New Cairo, Egypt",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-white/50">
                  <span className="text-aura-accent mt-0.5">{item.icon}</span>
                  <span className="text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── الجزء السفلي ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            {isAr
              ? `© ${new Date().getFullYear()} عقار أونلاين — جميع الحقوق محفوظة`
              : `© ${new Date().getFullYear()} Aqar Online — All rights reserved`}
          </p>
          <div className="flex items-center gap-6">
            {[
              { label_ar: "سياسة الخصوصية", label_en: "Privacy Policy" },
              { label_ar: "الشروط والأحكام", label_en: "Terms of Service" },
            ].map((link) => (
              <a
                key={link.label_en}
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                {isAr ? link.label_ar : link.label_en}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}