"use client";

import { useEffect, useState } from "react";

type AuthScreen = "login" | "register" | "forgot" | "reset";

const content: Record<AuthScreen, { img: string; title_ar: string; title_en: string; desc_ar: string; desc_en: string }> = {
  login: {
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    title_ar: "نأخذك في رحلة للعثور على مساحتك الهادئة.",
    title_en: "We take you on a journey to find your perfect space.",
    desc_ar: "بيوت مصممة لتلائم نمط حياتك العصري، بلمسات تجمع بين البساطة والفخامة المطلقة.",
    desc_en: "Homes designed to suit your modern lifestyle, blending simplicity with absolute luxury.",
  },
  register: {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    title_ar: "ابدأ مستقبلك في منزل الأحلام.",
    title_en: "Start your future in your dream home.",
    desc_ar: "انضم إلى عائلتنا الكبيرة واستكشف أرقى المجمعات السكنية.",
    desc_en: "Join our growing family and explore the finest residential compounds.",
  },
  forgot: {
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    title_ar: "أمانك وخصوصية بياناتك أولويتنا.",
    title_en: "Your security and privacy are our priority.",
    desc_ar: "نوفر أحدث تقنيات التشفير والحماية لضمان سلامة حسابك.",
    desc_en: "We provide the latest encryption and protection technologies to ensure your account safety.",
  },
  reset: {
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    title_ar: "خطوة واحدة لتأمين حسابك.",
    title_en: "One step to secure your account.",
    desc_ar: "احرص دائمًا على اختيار كلمة مرور فريدة وقوية.",
    desc_en: "Always choose a unique and strong password for your account.",
  },
};

export default function AuthImageSide({
  screen,
  isAr,
}: {
  screen: AuthScreen;
  isAr: boolean;
}) {
  const [visible, setVisible] = useState(true);
  const [currentContent, setCurrentContent] = useState(content[screen]);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      setCurrentContent(content[screen]);
      setVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [screen]);

  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden items-end p-16">
      {/* الصورة */}
      <img
        src={currentContent.img}
        alt="auth"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* لاير داكن */}
      <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/85 via-aura-dark/20 to-transparent" />

      {/* المحتوى */}
      <div
        className={`relative z-10 max-w-md transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-4xl font-light text-white mb-4 leading-snug">
          {isAr ? currentContent.title_ar : currentContent.title_en}
        </h2>
        <p className="text-white/70 font-light text-base leading-relaxed">
          {isAr ? currentContent.desc_ar : currentContent.desc_en}
        </p>
      </div>
    </div>
  );
}