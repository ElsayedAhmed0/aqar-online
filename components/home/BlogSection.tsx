"use client";

import { useLocale } from "next-intl";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineClock, HiOutlineTag } from "react-icons/hi2";

const posts = [
  {
    id: 1,
    title_ar: "أفضل مناطق الاستثمار العقاري في القاهرة 2025",
    title_en: "Best Real Estate Investment Areas in Cairo 2025",
    excerpt_ar: "تعرف على أكثر المناطق جذباً للاستثمار العقاري في القاهرة خلال العام الجاري وما تقدمه من فرص مميزة",
    excerpt_en: "Discover the most attractive areas for real estate investment in Cairo this year and the unique opportunities they offer",
    category_ar: "استثمار",
    category_en: "Investment",
    date_ar: "15 يناير 2025",
    date_en: "Jan 15, 2025",
    read_ar: "5 دقائق",
    read_en: "5 min read",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
  },
  {
    id: 2,
    title_ar: "كيف تختار الشقة المناسبة لميزانيتك؟",
    title_en: "How to Choose the Right Apartment for Your Budget?",
    excerpt_ar: "دليل شامل لمساعدتك في اتخاذ القرار الصحيح عند شراء أو استئجار شقة بما يتناسب مع إمكانياتك المالية",
    excerpt_en: "A comprehensive guide to help you make the right decision when buying or renting an apartment within your budget",
    category_ar: "نصائح",
    category_en: "Tips",
    date_ar: "10 يناير 2025",
    date_en: "Jan 10, 2025",
    read_ar: "7 دقائق",
    read_en: "7 min read",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  },
  {
    id: 3,
    title_ar: "العاصمة الإدارية الجديدة — فرصة أم مغامرة؟",
    title_en: "New Administrative Capital — Opportunity or Risk?",
    excerpt_ar: "تحليل معمق لسوق العقارات في العاصمة الإدارية الجديدة ومدى جدوى الاستثمار فيها على المدى البعيد",
    excerpt_en: "An in-depth analysis of the real estate market in the New Administrative Capital and the feasibility of long-term investment",
    category_ar: "تحليل",
    category_en: "Analysis",
    date_ar: "5 يناير 2025",
    date_en: "Jan 5, 2025",
    read_ar: "8 دقائق",
    read_en: "8 min read",
    img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=80",
  },
];

export default function BlogSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? HiOutlineArrowLeft : HiOutlineArrowRight;

  return (
    <section className="py-20 px-6 lg:px-12 bg-aura-bg">
      <div className="max-w-7xl mx-auto">

        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "مدونتنا العقارية" : "Our Blog"}
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-aura-dark">
              {isAr ? "أحدث" : "Latest"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المقالات" : "Articles"}
              </span>
            </h2>
          </div>
          
            <a href="/blog"
            className="flex items-center gap-2 text-sm text-aura-muted hover:text-aura-dark transition-colors group w-fit"
          >
            {isAr ? "كل المقالات" : "All Articles"}
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            
             <a key={post.id}
              href={`/blog/${post.id}`}
              className="bento-card card-animate bg-aura-card rounded-3xl overflow-hidden group cursor-pointer block"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* الصورة */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title_en}
                  className="w-full h-full object-cover img-hover"
                />
                {/* الكاتيجوري */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-aura-accent text-xs font-medium">
                  <HiOutlineTag className="w-3 h-3" />
                  {isAr ? post.category_ar : post.category_en}
                </div>
              </div>

              {/* المحتوى */}
              <div className="p-6">
                <h3 className="text-base font-medium text-aura-dark mb-2 leading-snug group-hover:text-aura-accent transition-colors duration-300 line-clamp-2">
                  {isAr ? post.title_ar : post.title_en}
                </h3>
                <p className="text-aura-muted text-xs font-light leading-relaxed mb-4 line-clamp-2">
                  {isAr ? post.excerpt_ar : post.excerpt_en}
                </p>

                {/* التاريخ والوقت */}
                <div className="flex items-center justify-between pt-4 border-t border-aura-border">
                  <span className="text-xs text-aura-muted">
                    {isAr ? post.date_ar : post.date_en}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-aura-muted">
                    <HiOutlineClock className="w-3.5 h-3.5" />
                    {isAr ? post.read_ar : post.read_en}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}