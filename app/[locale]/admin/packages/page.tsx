"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineXMark } from "react-icons/hi2";

type Pkg = {
  id: string;
  name_ar: string;
  name_en: string | null;
  price_label: string;
  features_ar: string[];
  features_en: string[];
  max_listings: number;
  max_featured: number;
  is_free: boolean;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

const emptyForm = {
  name_ar: "",
  name_en: "",
  price_label: "***",
  features_ar: "",
  features_en: "",
  max_listings: 5,
  max_featured: 0,
  is_free: false,
  featured: false,
  active: true,
  sort_order: 0,
};

export default function PackagesAdminPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [checked, setChecked] = useState(false);
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("packages").select("*").order("sort_order", { ascending: true });
    if (data) setPackages(data);
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
    setShowForm(true);
  };

  const openEditForm = (pkg: Pkg) => {
    setForm({
      name_ar: pkg.name_ar,
      name_en: pkg.name_en || "",
      price_label: pkg.price_label,
      features_ar: pkg.features_ar.join("\n"),
      features_en: pkg.features_en.join("\n"),
      max_listings: pkg.max_listings,
      max_featured: pkg.max_featured,
      is_free: pkg.is_free,
      featured: pkg.featured,
      active: pkg.active,
      sort_order: pkg.sort_order,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name_ar.trim()) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      name_ar: form.name_ar.trim(),
      name_en: form.name_en.trim() || null,
      price_label: form.price_label.trim() || "***",
      features_ar: form.features_ar.split("\n").map((f) => f.trim()).filter(Boolean),
      features_en: form.features_en.split("\n").map((f) => f.trim()).filter(Boolean),
      max_listings: Number(form.max_listings) || 0,
      max_featured: Number(form.max_featured) || 0,
      is_free: form.is_free,
      featured: form.featured,
      active: form.active,
      sort_order: Number(form.sort_order) || 0,
    };

    if (editingId) {
      await supabase.from("packages").update(payload).eq("id", editingId);
    } else {
      await supabase.from("packages").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? "متأكد من حذف الباقة دي؟" : "Are you sure you want to delete this package?")) return;
    const supabase = createClient();
    await supabase.from("packages").delete().eq("id", id);
    load();
  };

  const toggleField = async (pkg: Pkg, field: "active" | "featured") => {
    const supabase = createClient();
    await supabase.from("packages").update({ [field]: !pkg[field] }).eq("id", pkg.id);
    load();
  };

  if (!checked || loading) {
    return (
      <main className="min-h-screen bg-aura-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-aura-border bg-white text-sm outline-none focus:border-aura-accent";

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light text-aura-dark mb-1">
              {isAr ? "إدارة باقات الاشتراك" : "Manage Subscription Packages"}
            </h1>
            <p className="text-sm text-aura-muted">
              {isAr ? `${packages.length} باقة` : `${packages.length} packages`}
            </p>
          </div>
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all"
          >
            <HiOutlinePlus className="w-4 h-4" />
            {isAr ? "باقة جديدة" : "New Package"}
          </button>
        </div>

        {showForm && (
          <div className="bg-aura-card border border-aura-border rounded-2xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-aura-dark">
                {editingId ? (isAr ? "تعديل الباقة" : "Edit Package") : (isAr ? "باقة جديدة" : "New Package")}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full border border-aura-border flex items-center justify-center text-aura-muted">
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "الاسم (عربي) *" : "Name (Arabic) *"}</label>
                <input type="text" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label>
                <input type="text" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className={inputCls} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "السعر المعروض (نص حر)" : "Price Label (free text)"}</label>
              <input type="text" value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} placeholder="*** أو 300 جنيه أو تواصل معنا" className={inputCls} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "المميزات (عربي) — سطر لكل ميزة" : "Features (Arabic) — one per line"}</label>
                <textarea rows={4} value={form.features_ar} onChange={(e) => setForm({ ...form, features_ar: e.target.value })} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "المميزات (إنجليزي) — سطر لكل ميزة" : "Features (English) — one per line"}</label>
                <textarea rows={4} value={form.features_en} onChange={(e) => setForm({ ...form, features_en: e.target.value })} className={`${inputCls} resize-none`} dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "أقصى إعلانات" : "Max Listings"}</label>
                <input type="number" min={0} value={form.max_listings} onChange={(e) => setForm({ ...form, max_listings: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "أقصى مميزة" : "Max Featured"}</label>
                <input type="number" min={0} value={form.max_featured} onChange={(e) => setForm({ ...form, max_featured: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-aura-dark block mb-1.5">{isAr ? "ترتيب العرض" : "Sort Order"}</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap pt-2">
              <label className="flex items-center gap-2 text-sm text-aura-dark cursor-pointer">
                <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} className="w-4 h-4" />
                {isAr ? "باقة مجانية افتراضية" : "Default free package"}
              </label>
              <label className="flex items-center gap-2 text-sm text-aura-dark cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                {isAr ? "الأكثر طلبًا (تمييز في صفحة العرض)" : "Most Popular badge"}
              </label>
              <label className="flex items-center gap-2 text-sm text-aura-dark cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                {isAr ? "ظاهرة للعملاء" : "Visible to customers"}
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.name_ar.trim()}
              className="px-6 py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all disabled:opacity-50"
            >
              {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-aura-card border border-aura-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-medium text-aura-dark">{isAr ? pkg.name_ar : (pkg.name_en || pkg.name_ar)}</p>
                  {pkg.is_free && <span className="text-[10px] px-2 py-0.5 rounded-full bg-aura-canvas text-aura-muted">{isAr ? "مجانية" : "Free"}</span>}
                  {pkg.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-aura-accent/10 text-aura-accent">{isAr ? "الأكثر طلبًا" : "Most Popular"}</span>}
                  {!pkg.active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-500">{isAr ? "مخفية" : "Hidden"}</span>}
                </div>
                <p className="text-xs text-aura-muted">
                  {pkg.price_label} — {isAr ? "أقصى إعلانات:" : "Max listings:"} {pkg.max_listings} — {isAr ? "مميزة:" : "Featured:"} {pkg.max_featured}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleField(pkg, "active")} className="px-3 py-2 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark transition-all">
                  {pkg.active ? (isAr ? "إخفاء" : "Hide") : (isAr ? "إظهار" : "Show")}
                </button>
                <button onClick={() => openEditForm(pkg)} className="w-9 h-9 rounded-xl border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent transition-all">
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(pkg.id)} className="w-9 h-9 rounded-xl border border-aura-border flex items-center justify-center text-aura-muted hover:text-red-500 transition-all">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}