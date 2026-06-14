"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HiOutlineClock, HiOutlineTag } from "react-icons/hi2";

type BlogPost = {
  id: string;
  title_ar: string; title_en: string;
  excerpt_ar: string; excerpt_en: string;
  category: string; image_url: string;
  published: boolean; created_at: string;
};

const ITEMS_PER_PAGE = 9;

export default function BlogPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const supabase = createClient();

      let query = supabase
        .from("blog_posts")
        .select("*", { count: "exact" })
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (category !== "all") query = query.eq("category", category);

      const from = (page - 1) * ITEMS_PER_PAGE;
      query = query.range(from, from + ITEMS_PER_PAGE - 1);

      const { data, count } = await query;
      if (data) setPosts(data);
      if (count !== null) setTotal(count);
      setLoading(false);
    };
    fetchPosts();
  }, [page, category]);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("category")
        .eq("published", true);
      if (data) {
        const unique = [...new Set(data.map((p) => p.category).filter(Boolean))];
        setCategories(unique);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => { setPage(1); }, [category]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* العنوان */}
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "مدونتنا العقارية" : "Our Blog"}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "أحدث" : "Latest"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "المقالات" : "Articles"}
              </span>
            </h1>
          </div>

          {/* الفئات */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              <button onClick={() => setCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${category === "all" ? "bg-aura-dark text-white" : "bg-aura-card border border-aura-border text-aura-muted hover:text-aura-dark"}`}>
                {isAr ? "الكل" : "All"}
              </button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${category === cat ? "bg-aura-dark text-white" : "bg-aura-card border border-aura-border text-aura-muted hover:text-aura-dark"}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* المقالات */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 text-aura-muted">
              {isAr ? "لا توجد مقالات بعد" : "No posts yet"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <a key={post.id} href={`/${locale}/blog/${post.id}`}
                  className="bento-card bg-aura-card rounded-3xl overflow-hidden group cursor-pointer block"
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image_url || "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80"}
                      alt={post.title_en}
                      className="w-full h-full object-cover img-hover"
                    />
                    {post.category && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-aura-accent text-xs font-medium">
                        <HiOutlineTag className="w-3 h-3"/>
                        {post.category}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-medium text-aura-dark mb-2 leading-snug group-hover:text-aura-accent transition-colors duration-300 line-clamp-2">
                      {isAr ? post.title_ar : post.title_en}
                    </h3>
                    <p className="text-aura-muted text-xs font-light leading-relaxed mb-4 line-clamp-2">
                      {isAr ? post.excerpt_ar : post.excerpt_en}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-aura-border">
                      <span className="text-xs text-aura-muted">
                        {new Date(post.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-aura-muted">
                        <HiOutlineClock className="w-3.5 h-3.5"/>
                        {isAr ? "5 دقائق" : "5 min read"}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2.5 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark disabled:opacity-30 transition-all">
                {isAr ? "السابق ←" : "→ Prev"}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-medium transition-all ${page === p ? "bg-aura-dark text-white" : "border border-aura-border text-aura-muted hover:text-aura-dark"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2.5 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark disabled:opacity-30 transition-all">
                {isAr ? "→ التالي" : "Next ←"}
              </button>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </main>
  );
}