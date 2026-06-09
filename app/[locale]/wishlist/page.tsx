"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import { HiOutlineHeart, HiOutlineMapPin } from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";

// نفس بيانات العقارات — هنجيبها من الـ DB لاحقاً
const properties = [
  {
    id: 1,
    title_ar: "شقة فاخرة بالتجمع الخامس",
    title_en: "Luxury Apartment in New Cairo",
    location_ar: "التجمع الخامس، القاهرة",
    location_en: "New Cairo, Cairo",
    price: 2500000,
    type: "apartment",
    beds: 3,
    baths: 2,
    area: 180,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    featured: true,
  },
  {
    id: 2,
    title_ar: "فيلا مودرن بالشيخ زايد",
    title_en: "Modern Villa in Sheikh Zayed",
    location_ar: "الشيخ زايد، الجيزة",
    location_en: "Sheikh Zayed, Giza",
    price: 8500000,
    type: "villa",
    beds: 5,
    baths: 4,
    area: 450,
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    featured: true,
  },
  {
    id: 3,
    title_ar: "محل تجاري بوسط البلد",
    title_en: "Commercial Space in Downtown",
    location_ar: "وسط البلد، القاهرة",
    location_en: "Downtown, Cairo",
    price: 1200000,
    type: "commercial",
    beds: 0,
    baths: 1,
    area: 90,
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    featured: false,
  },
  {
    id: 4,
    title_ar: "شقة بإطلالة بحرية بالإسكندرية",
    title_en: "Sea View Apartment in Alexandria",
    location_ar: "سيدي بشر، الإسكندرية",
    location_en: "Sidi Bishr, Alexandria",
    price: 3200000,
    type: "apartment",
    beds: 4,
    baths: 3,
    area: 220,
    img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
    featured: true,
  },
  {
    id: 5,
    title_ar: "فيلا بحديقة بالرحاب",
    title_en: "Garden Villa in Rehab City",
    location_ar: "مدينة الرحاب، القاهرة",
    location_en: "Rehab City, Cairo",
    price: 6800000,
    type: "villa",
    beds: 4,
    baths: 3,
    area: 380,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    featured: false,
  },
  {
    id: 6,
    title_ar: "مكتب إداري بمدينة نصر",
    title_en: "Office Space in Nasr City",
    location_ar: "مدينة نصر، القاهرة",
    location_en: "Nasr City, Cairo",
    price: 950000,
    type: "commercial",
    beds: 0,
    baths: 2,
    area: 120,
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80",
    featured: false,
  },
];

export default function WishlistPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { liked, toggleLike } = useWishlist();

  const wishlistProperties = properties.filter((p) => liked.includes(p.id));

  const formatPrice = (price: number) =>
    isAr
      ? `${(price / 1000000).toFixed(1)} مليون جنيه`
      : `EGP ${(price / 1000000).toFixed(1)}M`;

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* العنوان */}
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "قائمتك المفضلة" : "Your Wishlist"}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "العقارات" : "Saved"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المحفوظة" : "Properties"}
              </span>
            </h1>
          </div>

          {/* لو مفيش عقارات */}
          {wishlistProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="w-20 h-20 rounded-full bg-aura-canvas flex items-center justify-center">
                <HiOutlineHeart className="w-10 h-10 text-aura-accent/40" />
              </div>
              <p className="text-aura-muted font-light text-lg">
                {isAr ? "لم تضف أي عقار بعد" : "No properties saved yet"}
              </p>
              
                <a
                href="/#properties"
                className="px-8 py-3 rounded-full bg-aura-accent text-white text-sm font-medium hover:bg-aura-accent-dark transition-all duration-300"
              >
                {isAr ? "تصفح العقارات" : "Browse Properties"}
              </a>
            </div>
          ) : (
            <>
              <p className="text-aura-muted text-sm mb-8">
                {isAr
                  ? `${wishlistProperties.length} عقار محفوظ`
                  : `${wishlistProperties.length} saved properties`}
              </p>

              {/* الكروت */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bento-card bg-aura-card rounded-3xl overflow-hidden group cursor-pointer"
                  >
                    {/* الصورة */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={property.img}
                        alt={property.title_en}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* زر إزالة من الـ Wishlist */}
                      <button
                        onClick={() => toggleLike(property.id)}
                        className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white"
                      >
                        <HiOutlineHeart className="w-4 h-4 text-red-500 fill-red-500" />
                      </button>

                      {/* السعر */}
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                        {formatPrice(property.price)}
                      </div>
                    </div>

                    {/* المحتوى */}
                    <div className="p-6">
                      <h3 className="text-lg font-light text-aura-dark mb-2 leading-snug">
                        {isAr ? property.title_ar : property.title_en}
                      </h3>

                      <div className="flex items-center gap-1.5 text-aura-muted mb-4">
                        <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs">
                          {isAr ? property.location_ar : property.location_en}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-aura-border">
                        {property.beds > 0 && (
                          <div className="flex items-center gap-1.5 text-aura-muted">
                            <LuBedDouble className="w-4 h-4" />
                            <span className="text-xs">{property.beds}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-aura-muted">
                          <LuBath className="w-4 h-4" />
                          <span className="text-xs">{property.baths}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-aura-muted">
                          <LuMaximize className="w-4 h-4" />
                          <span className="text-xs">{property.area} {isAr ? "م²" : "m²"}</span>
                        </div>
                        <button className="mr-auto text-xs font-medium text-aura-accent hover:text-aura-accent-dark transition-colors">
                          {isAr ? "التفاصيل ←" : "Details →"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}