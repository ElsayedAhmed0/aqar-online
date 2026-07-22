"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineClock, HiOutlineTag } from "react-icons/hi2";

type BlogPost = {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  category: string;
  image_url: string;
  published: boolean;
  created_at: string;
};

export default function BlogSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? HiOutlineArrowLeft : HiOutlineArrowRight;
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-aura-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "مدونتنا العقارية" : "Our Blog"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-light text-aura-dark">
              {isAr ? "أحدث" : "Latest"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المقالات" : "Articles"}
              </span>
            </h2>
          </div>
          
           <a href={`/${locale}/blog`}
            className="flex items-center gap-2 text-sm text-aura-muted hover:text-aura-dark transition-colors group w-fit"
          >
            {isAr ? "كل المقالات" : "All Articles"}
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post, i) => (
            
             <a  key={post.id}
              href={`/${locale}/blog/${post.id}`}
              className="bento-card card-animate bg-aura-card rounded-3xl overflow-hidden group cursor-pointer block"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={post.image_url || "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80"}
                  alt={post.title_en}
                  className="w-full h-full object-cover img-hover"
                />
                {post.category && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-aura-accent text-xs font-medium">
                    <HiOutlineTag className="w-3 h-3" />
                    {post.category}
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-sm sm:text-base font-medium text-aura-dark mb-2 leading-snug group-hover:text-aura-accent transition-colors duration-300 line-clamp-2">
                  {isAr ? post.title_ar : post.title_en}
                </h3>
                <p className="text-aura-muted text-xs font-light leading-relaxed mb-4 line-clamp-2">
                  {isAr ? post.excerpt_ar : post.excerpt_en}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-aura-border">
                  <span className="text-xs text-aura-muted">
                    {new Date(post.created_at).toLocaleDateString(
                      isAr ? "ar-EG" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                  {/* <div className="flex items-center gap-1 text-xs text-aura-muted">
                    <HiOutlineClock className="w-3.5 h-3.5" />
                    {isAr ? "5 دقائق" : "5 min read"}
                  </div> */}
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}