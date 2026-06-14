"use client";

import { useLocale } from "next-intl";
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa6";
import { useSettings } from "@/lib/hooks/useSettings";
import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";

export default function Footer() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { settings } = useSettings();
  const { types: propertyTypes } = usePropertyTypes();

  const socials = [
    { icon: <FaTiktok className="w-3.5 h-3.5" />,    key: "social_tiktok"    },
    { icon: <FaWhatsapp className="w-3.5 h-3.5" />,  key: "social_whatsapp"  },
    { icon: <FaInstagram className="w-3.5 h-3.5" />, key: "social_instagram" },
    { icon: <FaFacebookF className="w-3.5 h-3.5" />, key: "social_facebook"  },
  ];

  const quickLinks = [
    { label_ar: "الرئيسية",   label_en: "Home",        href: `/${locale}`             },
    { label_ar: "العقارات",   label_en: "Properties",  href: `/${locale}/properties`  },
    { label_ar: "عن عقار",    label_en: "About Us",    href: `/${locale}/about`       },
    { label_ar: "المقالات",   label_en: "Blog",        href: `/${locale}/blog`        },
    { label_ar: "اتصل بنا",   label_en: "Contact",     href: `/${locale}/contact`     },
    { label_ar: "أضف إعلانك", label_en: "Add Listing", href: `/${locale}/add-listing` },
  ];

  return (
    <footer className="bg-aura-dark text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* اللوجو والوصف */}
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-6">
              <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-3xl text-white">
                {settings.site_name_ar || "عقار"}
              </span>
              <span className="text-[9px] tracking-[0.5em] text-white/40 -mt-1 uppercase">
                {settings.site_name_en || "Online"}
              </span>
            </div>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6">
              {isAr
                ? (settings.footer_desc_ar || "منصة العقارات الأولى في مصر — نساعدك في إيجاد عقارك المثالي بكل سهولة وأمان")
                : (settings.footer_desc_en || "Egypt's #1 real estate platform — helping you find your perfect property safely and easily")}
            </p>

            {/* السوشيال ميديا */}
            <div className="flex items-center gap-3">
              {socials.map((social) =>
                settings[social.key] ? (
                  <a key={social.key} href={settings[social.key]} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-aura-accent flex items-center justify-center transition-all duration-300">
                    {social.icon}
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a key={link.href} href={link.href}
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                  {isAr ? link.label_ar : link.label_en}
                </a>
              ))}
            </nav>
          </div>

          {/* أنواع العقارات — ديناميك */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
              {isAr ? "أنواع العقارات" : "Property Types"}
            </h4>
            <nav className="flex flex-col gap-3">
              {propertyTypes.length > 0 ? propertyTypes.map((type) => (
                <a key={type.value}
                  href={`/${locale}/properties?type=${type.value}`}
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                  {isAr ? type.name_ar : type.name_en}
                </a>
              )) : (
                <>
                  <a href={`/${locale}/properties?type=apartment`} className="text-sm text-white/50 hover:text-white transition-colors">{isAr ? "شقق سكنية" : "Apartments"}</a>
                  <a href={`/${locale}/properties?type=villa`} className="text-sm text-white/50 hover:text-white transition-colors">{isAr ? "فيلات" : "Villas"}</a>
                  <a href={`/${locale}/properties?type=commercial`} className="text-sm text-white/50 hover:text-white transition-colors">{isAr ? "تجاري" : "Commercial"}</a>
                </>
              )}
            </nav>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
              {isAr ? "تواصل معنا" : "Contact Us"}
            </h4>
            <div className="flex flex-col gap-4">
              {settings.footer_phone && (
                <a href={`tel:${settings.footer_phone}`} className="flex items-start gap-3 text-white/50 hover:text-white transition-colors">
                  <span className="text-aura-accent mt-0.5"><HiOutlinePhone className="w-4 h-4 shrink-0"/></span>
                  <span className="text-sm" dir="ltr">{settings.footer_phone}</span>
                </a>
              )}
              {settings.footer_email && (
                <a href={`mailto:${settings.footer_email}`} className="flex items-start gap-3 text-white/50 hover:text-white transition-colors">
                  <span className="text-aura-accent mt-0.5"><HiOutlineEnvelope className="w-4 h-4 shrink-0"/></span>
                  <span className="text-sm" dir="ltr">{settings.footer_email}</span>
                </a>
              )}
              <div className="flex items-start gap-3 text-white/50">
                <span className="text-aura-accent mt-0.5"><HiOutlineMapPin className="w-4 h-4 shrink-0"/></span>
                <span className="text-sm">{isAr ? (settings.footer_address_ar || "التجمع الخامس، القاهرة") : (settings.footer_address_en || "New Cairo, Egypt")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* الجزء السفلي */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            {isAr
              ? `© ${new Date().getFullYear()} ${settings.site_name_ar || "عقار أونلاين"} — جميع الحقوق محفوظة`
              : `© ${new Date().getFullYear()} ${settings.site_name_en || "Aqar Online"} — All rights reserved`}
          </p>
          <div className="flex items-center gap-6">
            <a href={`/${locale}/privacy`} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
            <a href={`/${locale}/terms`} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              {isAr ? "الشروط والأحكام" : "Terms of Service"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}