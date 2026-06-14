"use client";

import { useState, useEffect, useRef } from "react";
import { compressImage } from "@/lib/utils/compressImage";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";
import { emptyListingForm, type ListingFormData } from "@/lib/types/listing";
import {
  HiOutlineHome, HiOutlineMapPin, HiOutlineCurrencyDollar,
  HiOutlinePhoto, HiOutlinePhone, HiOutlineDocumentText,
  HiOutlineCheck, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineCloudArrowUp, HiOutlineXMark,
} from "react-icons/hi2";

const sections = [
  { id: "type", icon: HiOutlineHome, label_ar: "نوع العقار", label_en: "Property Type" },
  { id: "basic", icon: HiOutlineDocumentText, label_ar: "المعلومات الأساسية", label_en: "Basic Info" },
  { id: "location", icon: HiOutlineMapPin, label_ar: "الموقع", label_en: "Location" },
  { id: "details", icon: HiOutlineCurrencyDollar, label_ar: "التفاصيل والسعر", label_en: "Details & Price" },
  { id: "media", icon: HiOutlinePhoto, label_ar: "الصور", label_en: "Photos" },
  { id: "contact", icon: HiOutlinePhone, label_ar: "التواصل", label_en: "Contact" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function AddListingForm() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading } = useAuth();
  const { addListing } = useListings();
  const { types: propertyTypes, loading: typesLoading } = usePropertyTypes();

  const [activeSection, setActiveSection] = useState<SectionId>("type");
  const [form, setForm] = useState<ListingFormData>(emptyListingForm());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 6;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    if (!loading && !user) router.push(`/${locale}/login`);
  }, [user, loading, router, locale]);

  useEffect(() => {
    if (user?.user_metadata?.phone) {
      setForm((prev) => ({ ...prev, phone: prev.phone || user.user_metadata.phone }));
    }
  }, [user]);

  const update = (fields: Partial<ListingFormData>) => {
    setForm((prev) => ({ ...prev, ...fields }));
    setError("");
  };

  const sectionIndex = sections.findIndex((s) => s.id === activeSection);

  const validateSection = (id: SectionId): string | null => {
    switch (id) {
      case "type": return !form.type ? (isAr ? "اختر نوع العقار" : "Select property type") : null;
      case "basic": return (!form.title_ar.trim() || !form.title_en.trim()) ? (isAr ? "أدخل عنوان الإعلان بالعربية والإنجليزية" : "Enter title in Arabic and English") : null;
      case "location": return (!form.location_ar.trim() || !form.location_en.trim()) ? (isAr ? "أدخل موقع العقار" : "Enter property location") : null;
      case "details":
        if (!form.price || Number(form.price) <= 0) return isAr ? "أدخل سعر صحيح" : "Enter a valid price";
        if (!form.area || Number(form.area) <= 0) return isAr ? "أدخل المساحة" : "Enter area";
        if (!form.baths || Number(form.baths) < 0) return isAr ? "أدخل عدد الحمامات" : "Enter bathrooms count";
        return null;
      case "media": return form.images.length === 0 ? (isAr ? "أضف صورة واحدة على الأقل" : "Add at least one image") : null;
      case "contact": return !form.phone.trim() ? (isAr ? "أدخل رقم التواصل" : "Enter contact phone") : null;
      default: return null;
    }
  };

  const isSectionComplete = (id: SectionId) => validateSection(id) === null;

  const goNext = () => {
    const err = validateSection(activeSection);
    if (err) { setError(err); return; }
    if (sectionIndex < sections.length - 1) { setActiveSection(sections[sectionIndex + 1].id); setError(""); }
  };

  const goPrev = () => {
    if (sectionIndex > 0) { setActiveSection(sections[sectionIndex - 1].id); setError(""); }
  };

  const handleSubmit = async () => {
    for (const s of sections) {
      const err = validateSection(s.id);
      if (err) { setActiveSection(s.id); setError(err); return; }
    }
    setSubmitting(true);
    setError("");
    try {
      const created = await addListing({
        type: form.type as any,
        title_ar: form.title_ar.trim(),
        title_en: form.title_en.trim(),
        description_ar: form.description_ar.trim(),
        description_en: form.description_en.trim(),
        location_ar: form.location_ar.trim(),
        location_en: form.location_en.trim(),
        price: Number(form.price),
        beds: Number(form.beds) || 0,
        baths: Number(form.baths),
        area: Number(form.area),
        img: form.images[0],
        images: [],
        phone: form.phone.trim(),
        featured: false,
        status: "pending",
      }, form.images);

      if (created) router.push(`/${locale}/dashboard`);
      else setError(isAr ? "فشل حفظ الإعلان" : "Failed to save listing");
    } catch {
      setError(isAr ? "فشل حفظ الإعلان" : "Failed to save listing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const newImages: string[] = [];
    const remaining = MAX_IMAGES - form.images.length;
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!file.type.startsWith("image/")) { setError(isAr ? "يُسمح بملفات الصور فقط" : "Only image files are allowed"); continue; }
      if (file.size > MAX_FILE_SIZE) { setError(isAr ? "حجم الصورة كبير (الحد 5 ميجا)" : "Image too large (max 5MB)"); continue; }
      try { newImages.push(await compressImage(file, 800, 0.7)); } catch { setError(isAr ? "فشل تحميل الصورة" : "Failed to load image"); }
    }
    if (newImages.length > 0) update({ images: [...form.images, ...newImages] });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50";

  // نوع العقار — commercial لو ملوش غرف
  const selectedType = propertyTypes.find((t) => t.value === form.type);
  const isCommercialType = form.type && !["apartment", "villa"].includes(form.type) &&
    !propertyTypes.find((t) => t.value === form.type && (t.value === "apartment" || t.value === "villa"));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* قائمة الأقسام */}
      <aside className="lg:col-span-4 xl:col-span-3">
        <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 lg:sticky lg:top-28">
          <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-4">
            {isAr ? "خطوات الإعلان" : "Listing Steps"}
          </p>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {sections.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              const isDone = isSectionComplete(s.id);
              return (
                <button key={s.id} onClick={() => { setActiveSection(s.id); setError(""); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-medium transition-all duration-300 shrink-0 lg:shrink ${isActive ? "bg-aura-dark text-white" : "bg-aura-canvas text-aura-muted hover:text-aura-dark border border-aura-border"}`}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white/20" : isDone ? "bg-green-100 text-green-600" : "bg-aura-card"}`}>
                    {isDone && !isActive ? <HiOutlineCheck className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </span>
                  <span className="whitespace-nowrap lg:whitespace-normal text-right">
                    <span className="hidden lg:inline text-aura-muted/60 ml-1">{i + 1}.</span>
                    {isAr ? s.label_ar : s.label_en}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* محتوى القسم */}
      <div className="lg:col-span-8 xl:col-span-9">
        <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-6 md:p-8">
          <h3 className="text-xl font-light text-aura-dark mb-6">
            {isAr ? sections[sectionIndex].label_ar : sections[sectionIndex].label_en}
          </h3>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">{error}</div>
          )}

          {/* نوع العقار — ديناميك من Supabase */}
          {activeSection === "type" && (
            <div className="space-y-6">

              {/* بيع أو إيجار */}
              <div>
                <p className="text-sm font-medium text-aura-dark mb-3">
                  {isAr ? "الغرض من الإعلان" : "Listing Purpose"}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "sale", label_ar: "للبيع", label_en: "For Sale", icon: "🏷️" },
                    { value: "rent", label_ar: "للإيجار", label_en: "For Rent", icon: "🔑" },
                  ].map((p) => {
                    const selected = (form as any).purpose === p.value || (!((form as any).purpose) && p.value === "sale");
                    return (
                      <button key={p.value} type="button"
                        onClick={() => update({ ...form, purpose: p.value } as any)}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ${selected ? "border-aura-accent bg-aura-accent/5 text-aura-dark shadow-md" : "border-aura-border hover:border-aura-accent/40 text-aura-muted"}`}>
                        <span>{p.icon}</span>
                        {isAr ? p.label_ar : p.label_en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* نوع العقار */}
              <div>
                <p className="text-sm font-medium text-aura-dark mb-3">
                  {isAr ? "نوع العقار" : "Property Type"}
                </p>
                {typesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {propertyTypes.map((t) => {
                      const selected = form.type === t.value;
                      return (
                        <button key={t.value} type="button"
                          onClick={() => update({ type: t.value as any })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 text-center ${selected ? "border-aura-accent bg-aura-accent/5 shadow-md" : "border-aura-border hover:border-aura-accent/40"}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? "bg-aura-accent text-white" : "bg-aura-canvas text-aura-accent"}`}>
                            <HiOutlineHome className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-medium text-aura-dark leading-tight">
                            {isAr ? t.name_ar : t.name_en}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* معلومات أساسية */}
          {activeSection === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-aura-dark">{isAr ? "عنوان الإعلان (عربي)" : "Title (Arabic)"}</label>
                  <input type="text" value={form.title_ar} onChange={(e) => update({ title_ar: e.target.value })} placeholder={isAr ? "مثال: شقة فاخرة بالتجمع الخامس" : "e.g. Luxury apartment"} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-aura-dark">{isAr ? "عنوان الإعلان (إنجليزي)" : "Title (English)"}</label>
                  <input type="text" value={form.title_en} onChange={(e) => update({ title_en: e.target.value })} placeholder="Luxury Apartment in New Cairo" className={inputCls} dir="ltr" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "وصف الإعلان (عربي)" : "Description (Arabic)"}</label>
                <textarea rows={4} value={form.description_ar} onChange={(e) => update({ description_ar: e.target.value })} placeholder={isAr ? "اكتب وصفاً تفصيلياً للعقار..." : "Write a detailed description..."} className={`${inputCls} resize-none`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "وصف الإعلان (إنجليزي)" : "Description (English)"}</label>
                <textarea rows={4} value={form.description_en} onChange={(e) => update({ description_en: e.target.value })} placeholder="Detailed property description..." className={`${inputCls} resize-none`} dir="ltr" />
              </div>
            </div>
          )}

          {/* الموقع */}
          {activeSection === "location" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "الموقع (عربي)" : "Location (Arabic)"}</label>
                <input type="text" value={form.location_ar} onChange={(e) => update({ location_ar: e.target.value })} placeholder={isAr ? "مثال: التجمع الخامس، القاهرة" : "e.g. New Cairo"} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "الموقع (إنجليزي)" : "Location (English)"}</label>
                <input type="text" value={form.location_en} onChange={(e) => update({ location_en: e.target.value })} placeholder="New Cairo, Cairo" className={inputCls} dir="ltr" />
              </div>
            </div>
          )}

          {/* التفاصيل والسعر */}
          {activeSection === "details" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "السعر (جنيه مصري)" : "Price (EGP)"}</label>
                <input type="number" value={form.price} onChange={(e) => update({ price: e.target.value })} placeholder="2500000" className={inputCls} dir="ltr" min={0} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "عدد الغرف" : "Bedrooms"}</label>
                <input type="number" value={form.beds} onChange={(e) => update({ beds: e.target.value })} placeholder="3" className={inputCls} dir="ltr" min={0} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "عدد الحمامات" : "Bathrooms"}</label>
                <input type="number" value={form.baths} onChange={(e) => update({ baths: e.target.value })} placeholder="2" className={inputCls} dir="ltr" min={0} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "المساحة (م²)" : "Area (m²)"}</label>
                <input type="number" value={form.area} onChange={(e) => update({ area: e.target.value })} placeholder="180" className={inputCls} dir="ltr" min={0} />
              </div>
            </div>
          )}

          {/* الصور */}
          {activeSection === "media" && (
            <div className="space-y-5">
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              {form.images.length < MAX_IMAGES && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  disabled={uploading}
                  className="w-full flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-aura-border hover:border-aura-accent bg-aura-canvas/50 hover:bg-aura-accent/5 transition-all duration-300 disabled:opacity-50">
                  {uploading ? <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" /> : (
                    <div className="w-14 h-14 rounded-2xl bg-aura-accent/10 flex items-center justify-center">
                      <HiOutlineCloudArrowUp className="w-7 h-7 text-aura-accent" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium text-aura-dark">{uploading ? (isAr ? "جاري رفع الصور..." : "Uploading...") : (isAr ? "اضغط أو اسحب الصور هنا" : "Click or drag images here")}</p>
                    <p className="text-[11px] text-aura-muted mt-1">{isAr ? `JPG, PNG, WEBP — حتى ${MAX_IMAGES} صور (5 ميجا لكل صورة)` : `JPG, PNG, WEBP — up to ${MAX_IMAGES} images (5MB each)`}</p>
                  </div>
                </button>
              )}
              {form.images.length > 0 && (
                <div>
                  <p className="text-xs text-aura-muted mb-3">{isAr ? `${form.images.length} / ${MAX_IMAGES} صور — الأولى هي صورة الغلاف` : `${form.images.length} / ${MAX_IMAGES} images — first is cover`}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.images.map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-aura-border group">
                        <img src={src} alt={`${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-aura-accent text-white text-[10px] font-medium">{isAr ? "الغلاف" : "Cover"}</span>}
                        <button type="button" onClick={() => update({ images: form.images.filter((_, idx) => idx !== i) })}
                          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500">
                          <HiOutlineXMark className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* التواصل */}
          {activeSection === "contact" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "رقم التواصل" : "Contact Phone"}</label>
                <input type="tel" value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="01xxxxxxxxx" className={inputCls} dir="ltr" />
              </div>
              <div className="p-4 rounded-2xl bg-aura-canvas border border-aura-border">
                <p className="text-xs text-aura-muted leading-relaxed">
                  {isAr ? "سيظهر رقمك للمهتمين بالعقار. تأكد من صحته قبل النشر." : "Your number will be visible to interested buyers. Verify it before publishing."}
                </p>
              </div>
            </div>
          )}

          {/* أزرار التنقل */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-aura-border">
            <button type="button" onClick={goPrev} disabled={sectionIndex === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm text-aura-muted border border-aura-border hover:text-aura-dark transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed">
              <HiOutlineChevronRight className="w-4 h-4" />
              {isAr ? "السابق" : "Previous"}
            </button>
            {sectionIndex < sections.length - 1 ? (
              <button type="button" onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium text-white bg-aura-accent hover:bg-aura-dark transition-all duration-300">
                {isAr ? "التالي" : "Next"}
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-medium text-white bg-aura-accent hover:bg-aura-dark transition-all duration-300 disabled:opacity-50">
                {submitting ? (isAr ? "جاري النشر..." : "Publishing...") : (isAr ? "نشر الإعلان" : "Publish Listing")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}