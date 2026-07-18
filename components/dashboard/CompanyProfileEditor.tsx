"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { HiOutlinePhoto, HiOutlineCheckCircle } from "react-icons/hi2";

type Developer = {
  id: string;
  name: string;
  name_en?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
  slug?: string | null;
  active: boolean;
};

export default function CompanyProfileEditor({
  developer,
  isAr,
  onUpdated,
}: {
  developer: Developer;
  isAr: boolean;
  onUpdated: (updated: Developer) => void;
}) {
  const [form, setForm] = useState({
    logo_url: developer.logo_url || "",
    cover_image_url: developer.cover_image_url || "",
    description_ar: developer.description_ar || "",
    description_en: developer.description_en || "",
    phone: developer.phone || "",
    whatsapp: developer.whatsapp || "",
    facebook_url: developer.facebook_url || "",
    linkedin_url: developer.linkedin_url || "",
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      return data.url || null;
    } catch {
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("developers")
      .update(form)
      .eq("id", developer.id)
      .select()
      .single();

    setSaving(false);
    if (!error && data) {
      onUpdated(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 md:p-6">
      <h3 className="text-base font-medium text-aura-dark mb-1">
        {isAr ? "بيانات صفحة شركتي" : "My Company Page"}
      </h3>
      <p className="text-xs text-aura-muted mb-5">
        {isAr
          ? developer.active
            ? "صفحتك ظاهرة للزوار حاليًا ✅"
            : "صفحتك لسه تحت مراجعة الأدمن ومش ظاهرة للزوار بعد ⏳"
          : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-aura-dark">{isAr ? "اللوجو" : "Logo"}</label>
          <div className="flex gap-3 items-center">
            {form.logo_url && (
              <div className="w-14 h-14 rounded-xl border border-aura-border bg-aura-canvas flex items-center justify-center overflow-hidden shrink-0">
                <img src={form.logo_url} alt="logo" className="max-h-full max-w-full object-contain p-1.5" />
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs text-aura-dark hover:border-aura-accent cursor-pointer transition-all">
              <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />
              {uploadingLogo ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "رفع لوجو جديد" : "Upload new logo")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingLogo(true);
                  const url = await uploadImage(file);
                  setUploadingLogo(false);
                  if (url) setForm((prev) => ({ ...prev, logo_url: url }));
                }}
              />
            </label>
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-aura-dark">{isAr ? "صورة البانر" : "Cover Banner"}</label>
          {form.cover_image_url && (
            <div className="h-28 w-full rounded-xl border border-aura-border overflow-hidden bg-aura-canvas mb-2">
              <img src={form.cover_image_url} alt="cover" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs text-aura-dark hover:border-aura-accent cursor-pointer transition-all w-fit">
            <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />
            {uploadingCover ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "رفع بانر جديد" : "Upload new banner")}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadingCover(true);
                const url = await uploadImage(file);
                setUploadingCover(false);
                if (url) setForm((prev) => ({ ...prev, cover_image_url: url }));
              }}
            />
          </label>
        </div>

        <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "رقم التواصل" : "Phone"}</label><input type="text" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" dir="ltr" /></div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "واتساب" : "WhatsApp"}</label><input type="text" value={form.whatsapp} onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" dir="ltr" /></div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "فيسبوك" : "Facebook"}</label><input type="text" value={form.facebook_url} onChange={(e) => setForm((prev) => ({ ...prev, facebook_url: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" dir="ltr" /></div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "لينكدإن" : "LinkedIn"}</label><input type="text" value={form.linkedin_url} onChange={(e) => setForm((prev) => ({ ...prev, linkedin_url: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" dir="ltr" /></div>

        <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "نبذة عن الشركة (عربي)" : "About (Arabic)"}</label><textarea value={form.description_ar} onChange={(e) => setForm((prev) => ({ ...prev, description_ar: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" /></div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "نبذة عن الشركة (إنجليزي)" : "About (English)"}</label><textarea value={form.description_en} onChange={(e) => setForm((prev) => ({ ...prev, description_en: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" dir="ltr" /></div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">
          {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ التعديلات" : "Save Changes")}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
            <HiOutlineCheckCircle className="w-4 h-4" />
            {isAr ? "تم الحفظ بنجاح" : "Saved successfully"}
          </span>
        )}
      </div>
    </div>
  );
}