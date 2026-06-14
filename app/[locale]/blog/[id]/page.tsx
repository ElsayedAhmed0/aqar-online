"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HiOutlineClock, HiOutlineTag, HiOutlineArrowRight } from "react-icons/hi2";

type BlogPost = {
  id: string;
  title_ar: string; title_en: string;
  excerpt_ar: string; excerpt_en: string;
  content_ar: string; content_en: string;
  category: string; image_url: string;
  published: boolean; created_at: string;
};

export default function BlogPostPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", params.id)
        .eq("published", true)
        .single();
      if (data) {
        setPost(data);
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        if (relatedData) setRelated(relatedData);
      }
      setLoading(false);
    };
    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-aura-bg">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin"/>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-aura-bg">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <p className="text-aura-muted">{isAr ? "المقال غير موجود" : "Post not found"}</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <article className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">

          {/* رجوع */}
          <a href={`/${locale}/blog`} className="flex items-center gap-2 text-sm text-aura-muted hover:text-aura-dark transition-colors mb-8 w-fit">
            <HiOutlineArrowRight className="w-4 h-4"/>
            {isAr ? "كل المقالات" : "All Articles"}
          </a>

          {/* الفئة والتاريخ */}
          <div className="flex items-center gap-3 mb-6">
            {post.category && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-accent/10 text-aura-accent text-xs font-medium">
                <HiOutlineTag className="w-3 h-3"/>
                {post.category}
              </span>
            )}
            <span className="text-xs text-aura-muted">
              {new Date(post.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1 text-xs text-aura-muted">
              <HiOutlineClock className="w-3.5 h-3.5"/>
              {isAr ? "5 دقائق" : "5 min read"}
            </span>
          </div>

          {/* العنوان */}
          <h1 className="text-3xl md:text-4xl font-light text-aura-dark mb-6 leading-tight">
            {isAr ? post.title_ar : post.title_en}
          </h1>

          {/* الصورة */}
          {post.image_url && (
            <div className="h-64 md:h-96 rounded-3xl overflow-hidden mb-10">
              <img src={post.image_url} alt={post.title_en} className="w-full h-full object-cover"/>
            </div>
          )}

          {/* الملخص */}
          <p className="text-lg text-aura-muted font-light leading-relaxed mb-8 border-r-4 border-aura-accent pr-4">
            {isAr ? post.excerpt_ar : post.excerpt_en}
          </p>

          {/* المحتوى */}
          <div className="prose prose-lg max-w-none text-aura-dark font-light leading-relaxed whitespace-pre-wrap">
            {isAr ? post.content_ar : post.content_en}
          </div>

        </div>
      </article>

      {/* مقالات ذات صلة */}
      {related.length > 0 && (
        <section className="py-16 px-6 lg:px-12 bg-aura-canvas border-t border-aura-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-light text-aura-dark mb-8">
              {isAr ? "مقالات ذات صلة" : "Related Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <a key={p.id} href={`/${locale}/blog/${p.id}`}
                  className="bento-card bg-aura-card rounded-3xl overflow-hidden group cursor-pointer block">
                  <div className="h-40 overflow-hidden">
                    <img src={p.image_url || "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80"} alt={p.title_en} className="w-full h-full object-cover img-hover"/>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-medium text-aura-dark group-hover:text-aura-accent transition-colors line-clamp-2">
                      {isAr ? p.title_ar : p.title_en}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}