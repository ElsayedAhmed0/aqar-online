"use client";

import { useLocale } from "next-intl";

const ads = [
    {
        id: 1,
        img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
        title_ar: "شقق فاخرة بالتجمع",
        title_en: "Luxury Apartments",
        subtitle_ar: "من 2 مليون جنيه",
        subtitle_en: "Starting 2M EGP",
        badge_ar: "عرض خاص",
        badge_en: "Special Offer",
        color: "from-aura-accent/80",
    },
    {
        id: 2,
        img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
        title_ar: "فيلات الشيخ زايد",
        title_en: "Sheikh Zayed Villas",
        subtitle_ar: "تشطيب سوبر لوكس",
        subtitle_en: "Super Lux Finish",
        badge_ar: "جديد",
        badge_en: "New",
        color: "from-blue-900/80",
    },
    {
        id: 3,
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
        title_ar: "كمبوند الرحاب",
        title_en: "Rehab Compound",
        subtitle_ar: "تسليم فوري",
        subtitle_en: "Immediate Delivery",
        badge_ar: "مميز",
        badge_en: "Featured",
        color: "from-emerald-900/80",
    },
];

export default function SideAds() {
    const locale = useLocale();
    const isAr = locale === "ar";

    return (
        <div className="flex flex-col gap-4 w-full">
            <p className="text-xs tracking-[0.2em] uppercase text-aura-muted mb-2">
                {isAr ? "إعلانات مميزة" : "Featured Ads"}
            </p>

            {ads.map((ad) => (

                <a key={ad.id}
                    href="#properties"
                    className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer block shadow-md hover:shadow-xl border border-aura-border hover:border-aura-accent transition-all duration-300"
                >
                    {/* الصورة */}
                    <img
                        src={ad.img}
                        alt={ad.title_en}
                        className="w-full h-full object-cover img-hover"
                    />

                    {/* لاير تدريجي */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${ad.color} to-transparent`} />

                    {/* Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-aura-accent text-white text-[10px] font-medium">
                        {isAr ? ad.badge_ar : ad.badge_en}
                    </div>

                    {/* النص */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-medium text-sm leading-tight mb-1">
                            {isAr ? ad.title_ar : ad.title_en}
                        </h4>
                        <p className="text-white/70 text-xs">
                            {isAr ? ad.subtitle_ar : ad.subtitle_en}
                        </p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-aura-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
            ))}
        </div>
    );
}