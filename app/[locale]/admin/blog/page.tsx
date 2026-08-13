"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { uploadToCloudinary } from "@/lib/utils/compressImage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineXMark, HiOutlinePhoto } from "react-icons/hi2";

type Post = {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  category: string;
  image_url: string;
  published: boolean;
  meta_description: string | null;
  meta_keywords: string | null;
  slug: string | null;
  focus_keyword: string | null;
  image_alt: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  status: string | null;
  publish_date: string | null;
  tags: string | null;
  author: string | null;
  canonical_url: string | null;
  reading_time: number | null;
  schema_type: string | null;
};

const emptyForm = {
  title_ar: "", title_en: "",
  excerpt_ar: "", excerpt_en: "",
  content_ar: "", content_en: "",
  category: "", image_url: "",
  meta_description: "", meta_keywords: "",
  slug: "", focus_keyword: "", image_alt: "",
  og_title: "", og_description: "", og_image: "",
  status: "draft", publish_date: "",
  tags: "", author: "فريق تحرير عقار أونلاين",
  canonical_url: "", schema_type: "BlogPosting",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogAdminPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [checked, setChecked] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingOgImg, setUploadingOgImg] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(`/${locale}/login`); return; }
    const checkAndLoad = async () => {
      const supabase = createClient();
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!profile || (profile.role !== "admin" && profile.role !== "subadmin")) {
        router.push(`/${locale}`);
        return;
      }
      setChecked(true);
      await load();
    };
    checkAndLoad();
  }, [user, authLoading, locale, router]);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSlugTouched(false);
    setShowForm(true);
  };

  const openEditForm = (post: Post) => {
    setForm({
      title_ar: post.title_ar || "", title_en: post.title_en || "",
      excerpt_ar: post.excerpt_ar || "", excerpt_en: post.excerpt_en || "",
      content_ar: post.content_ar || "", content_en: post.content_en || "",
      category: post.category || "", image_url: post.image_url || "",
      meta_description: post.meta_description || "", meta_keywords: post.meta_keywords || "",
      slug: post.slug || "", focus_keyword: post.focus_keyword || "", image_alt: post.image_alt || "",
      og_title: post.og_title || "", og_description: post.og_description || "", og_image: post.og_image || "",
      status: post.status || (post.published ? "published" : "draft"),
      publish_date: post.publish_date ? post.publish_date.slice(0, 10) : "",
      tags: post.tags || "", author: post.author || "فريق تحرير عقار أونلاين",
      canonical_url: post.canonical_url || "", schema_type: post.schema_type || "BlogPosting",
    });
    setEditingId(post.id);
    setSlugTouched(true);
    setShowForm(true);
  };

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title_en: val,
      slug: slugTouched ? prev.slug : slugify(val),
    }));
  };

  const handleSave = async () => {
    if (!form.title_ar.trim() || !form.title_en.trim()) return;
    setSaving(true);
    const supabase = createClient();

    const readingTime = estimateReadingTime(form.content_ar || form.content_en);

    const payload = {
      title_ar: form.title_ar.trim(),
      title_en: form.title_en.trim(),
      excerpt_ar: form.excerpt_ar.trim(),
      excerpt_en: form.excerpt_en.trim(),
      content_ar: form.content_ar,
      content_en: form.content_en,
      category: form.category.trim(),
      image_url: form.image_url,
      meta_description: form.meta_description.trim().slice(0, 160) || null,
      meta_keywords: form.meta_keywords.trim() || null,
      slug: (form.slug.trim() || slugify(form.title_en)) || null,
      focus_keyword: form.focus_keyword.trim() || null,
      image_alt: form.image_alt.trim() || null,
      og_title: form.og_title.trim() || null,
      og_description: form.og_description.trim() || null,
      og_image: form.og_image || null,
      status: form.status,
      published: form.status === "published",
      publish_date: form.publish_date ? new Date(form.publish_date).toISOString() : null,
      tags: form.tags.trim() || null,
      author: form.author.trim() || "فريق تحرير عقار أونلاين",
      canonical_url: form.canonical_url.trim() || null,
     reading_time: readingTime,
      schema_type: form.schema_type,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        alert(isAr
          ? "الرابط (Slug) ده مستخدم بالفعل في مقال تاني. غيّره واضغط حفظ تاني."
          : "This slug is already used by another post. Please change it and save again.");
      } else {
        alert(isAr ? `فشل الحفظ: ${error.message}` : `Save failed: ${error.message}`);
      }
      return;
    }

    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? "متأكد من حذف المقال ده؟" : "Are you sure you want to delete this post?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  const handleImageUpload = async (file: File | undefined, field: "image_url" | "og_image") => {
    if (!file) return;
    if (field === "image_url") setUploadingImg(true); else setUploadingOgImg(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } finally {
      if (field === "image_url") setUploadingImg(false); else setUploadingOgImg(false);
    }
  };

  if (!checked || loading) {
    return (
      <main className="min-h-screen bg-aura-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-aura-border bg-white text-sm outline-none focus:border-aura-accent";
  const labelCls = "text-xs font-medium text-aura-dark block mb-1.5";

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light text-aura-dark mb-1">
              {isAr ? "إدارة المدونة" : "Manage Blog"}
            </h1>
            <p className="text-sm text-aura-muted">{isAr ? `${posts.length} مقال` : `${posts.length} posts`}</p>
          </div>
          <button onClick={openNewForm} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all">
            <HiOutlinePlus className="w-4 h-4" />
            {isAr ? "مقال جديد" : "New Post"}
          </button>
        </div>

        {showForm && (
          <div className="bg-aura-card border border-aura-border rounded-2xl p-6 mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-aura-dark">{editingId ? (isAr ? "تعديل مقال" : "Edit Post") : (isAr ? "مقال جديد" : "New Post")}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full border border-aura-border flex items-center justify-center text-aura-muted"><HiOutlineXMark className="w-4 h-4" /></button>
            </div>

            {/* ── المحتوى الأساسي ── */}
            <div>
              <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-3">{isAr ? "المحتوى الأساسي" : "Core Content"}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>{isAr ? "العنوان (عربي) *" : "Title (Arabic) *"}</label><input type="text" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>{isAr ? "العنوان (إنجليزي) *" : "Title (English) *"}</label><input type="text" value={form.title_en} onChange={(e) => handleTitleChange(e.target.value)} className={inputCls} dir="ltr" /></div>
                <div><label className={labelCls}>{isAr ? "ملخص (عربي)" : "Excerpt (Arabic)"}</label><textarea rows={2} value={form.excerpt_ar} onChange={(e) => setForm({ ...form, excerpt_ar: e.target.value })} className={`${inputCls} resize-none`} /></div>
                <div><label className={labelCls}>{isAr ? "ملخص (إنجليزي)" : "Excerpt (English)"}</label><textarea rows={2} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} className={`${inputCls} resize-none`} dir="ltr" /></div>
              </div>
              <div className="mt-4">
                <label className={labelCls}>{isAr ? "المحتوى (عربي)" : "Content (Arabic)"}</label>
                <RichTextEditor value={form.content_ar} onChange={(html) => setForm({ ...form, content_ar: html })} dir="rtl" />
              </div>
              <div className="mt-4">
                <label className={labelCls}>{isAr ? "المحتوى (إنجليزي)" : "Content (English)"}</label>
                <RichTextEditor value={form.content_en} onChange={(html) => setForm({ ...form, content_en: html })} dir="ltr" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div><label className={labelCls}>{isAr ? "الفئة" : "Category"}</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} /></div>
                <div>
                  <label className={labelCls}>{isAr ? "صورة المقال" : "Post Image"}</label>
                  <div className="flex gap-2">
                    <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className={`${inputCls} flex-1`} />
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-aura-border bg-aura-canvas text-xs cursor-pointer shrink-0">
                      {uploadingImg ? <div className="w-4 h-4 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" /> : <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />}
                      {isAr ? "رفع" : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0], "image_url")} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SEO ── */}
            <div className="pt-4 border-t border-aura-border">
              <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-3">SEO</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>{isAr ? `Meta Description (${form.meta_description.length}/160)` : `Meta Description (${form.meta_description.length}/160)`}</label>
                  <textarea rows={2} maxLength={160} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className={`${inputCls} resize-none`} />
                </div>
                <div><label className={labelCls}>Meta Keywords ({isAr ? "مفصولة بفواصل" : "comma-separated"})</label><input type="text" value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} className={inputCls} dir="ltr" /></div>
                <div><label className={labelCls}>Slug</label><input type="text" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: slugify(e.target.value) }); }} className={inputCls} dir="ltr" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Focus Keyword</label><input type="text" value={form.focus_keyword} onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>{isAr ? "نص بديل للصورة (Alt)" : "Image Alt Text"}</label><input type="text" value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })} className={inputCls} /></div>
                </div>
                <div><label className={labelCls}>Canonical URL</label><input type="text" value={form.canonical_url} onChange={(e) => setForm({ ...form, canonical_url: e.target.value })} placeholder="https://..." className={inputCls} dir="ltr" /></div>
                <div>
                  <label className={labelCls}>Schema Type</label>
                  <select value={form.schema_type} onChange={(e) => setForm({ ...form, schema_type: e.target.value })} className={inputCls}>
                    <option value="BlogPosting">BlogPosting</option>
                    <option value="Article">Article</option>
                    <option value="NewsArticle">NewsArticle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Open Graph ── */}
            <div className="pt-4 border-t border-aura-border">
              <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-3">{isAr ? "السوشيال ميديا (Open Graph)" : "Social (Open Graph)"}</p>
              <div className="space-y-4">
                <div><label className={labelCls}>OG Title</label><input type="text" value={form.og_title} onChange={(e) => setForm({ ...form, og_title: e.target.value })} className={inputCls} placeholder={isAr ? "لو فاضي، هيستخدم العنوان العادي" : "Falls back to normal title if empty"} /></div>
                <div><label className={labelCls}>OG Description</label><textarea rows={2} value={form.og_description} onChange={(e) => setForm({ ...form, og_description: e.target.value })} className={`${inputCls} resize-none`} /></div>
                <div>
                  <label className={labelCls}>OG Image</label>
                  <div className="flex gap-2">
                    <input type="text" value={form.og_image} onChange={(e) => setForm({ ...form, og_image: e.target.value })} placeholder="https://..." className={`${inputCls} flex-1`} />
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-aura-border bg-aura-canvas text-xs cursor-pointer shrink-0">
                      {uploadingOgImg ? <div className="w-4 h-4 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" /> : <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />}
                      {isAr ? "رفع" : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0], "og_image")} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ── إدارة المحتوى ── */}
            <div className="pt-4 border-t border-aura-border">
              <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-3">{isAr ? "إدارة المحتوى" : "Content Management"}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{isAr ? "الحالة" : "Status"}</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                    <option value="draft">{isAr ? "مسودة" : "Draft"}</option>
                    <option value="published">{isAr ? "منشور" : "Published"}</option>
                    <option value="scheduled">{isAr ? "مجدول" : "Scheduled"}</option>
                  </select>
                </div>
                <div><label className={labelCls}>{isAr ? "تاريخ النشر" : "Publish Date"}</label><input type="date" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Tags</label><input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder={isAr ? "مفصولة بفواصل" : "comma-separated"} className={inputCls} /></div>
                <div><label className={labelCls}>{isAr ? "الكاتب" : "Author"}</label><input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputCls} /></div>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || !form.title_ar.trim() || !form.title_en.trim()} className="px-6 py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all disabled:opacity-50">
              {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-aura-card border border-aura-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-medium text-aura-dark">{isAr ? post.title_ar : post.title_en}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${post.status === "published" ? "bg-green-50 text-green-600" : post.status === "scheduled" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                    {post.status === "published" ? (isAr ? "منشور" : "Published") : post.status === "scheduled" ? (isAr ? "مجدول" : "Scheduled") : (isAr ? "مسودة" : "Draft")}
                  </span>
                </div>
                <p className="text-xs text-aura-muted">{post.slug ? `/${post.slug}` : "-"} {post.reading_time ? `— ${post.reading_time} ${isAr ? "دقيقة قراءة" : "min read"}` : ""}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEditForm(post)} className="w-9 h-9 rounded-xl border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent transition-all"><HiOutlinePencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(post.id)} className="w-9 h-9 rounded-xl border border-aura-border flex items-center justify-center text-aura-muted hover:text-red-500 transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}