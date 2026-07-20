"use client";

import { useState, useRef } from "react";
import { uploadToCloudinary } from "@/lib/utils/compressImage";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useListings } from "@/context/ListingsContext";
import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";
import type { UserListing } from "@/lib/types/listing";
import {
  HiOutlineHome, HiOutlineMapPin, HiOutlinePhoto, HiOutlinePhone,
  HiOutlineDocumentText, HiOutlineCheck, HiOutlineCloudArrowUp,
  HiOutlineXMark, HiOutlineSparkles, HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";

const FEATURES = [
  { key: "parking", ar: "موقف سيارة", en: "Parking" },
  { key: "pool", ar: "حمام سباحة", en: "Swimming Pool" },
  { key: "gym", ar: "جيم", en: "Gym" },
  { key: "security", ar: "أمن وحراسة", en: "Security" },
  { key: "elevator", ar: "أسانسير", en: "Elevator" },
  { key: "garden", ar: "حديقة", en: "Garden" },
  { key: "ac", ar: "تكييف مركزي", en: "Central A/C" },
  { key: "furnished", ar: "مفروشة", en: "Furnished" },
  { key: "balcony", ar: "بلكونة", en: "Balcony" },
  { key: "storage", ar: "غرفة مخزن", en: "Storage Room" },
  { key: "maid_room", ar: "غرفة خادمة", en: "Maid's Room" },
  { key: "view", ar: "إطلالة مميزة", en: "Special View" },
  { key: "solar", ar: "طاقة شمسية", en: "Solar Energy" },
  { key: "intercom", ar: "إنتركم", en: "Intercom" },
  { key: "pets", ar: "يسمح بالحيوانات", en: "Pets Allowed" },
  { key: "smart_home", ar: "منزل ذكي", en: "Smart Home" },
  { key: "roof", ar: "روف", en: "Roof" },
  { key: "basement", ar: "بدروم", en: "Basement" },
  { key: "kitchen", ar: "مزود بالمطبخ", en: "Kitchen Included" },
];

const DELIVERY_OPTIONS = [
  { value: "ready", label_ar: "جاهز للتسليم", label_en: "Ready", icon: "✅" },
  { value: "under_construction", label_ar: "قيد الإنشاء", label_en: "Under Construction", icon: "🏗️" },
];

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ✅ اتنقل هنا برّة الكومبوننت — عشان مرجعه يفضل ثابت بين كل الـ renders
function SectionCard({
  icon: Icon, title, children,
}: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 md:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-aura-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-aura-accent" />
        </div>
        <h3 className="text-base font-medium text-aura-dark">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function EditListingForm({ listing }: { listing: UserListing }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { updateListing } = useListings();
  const { types: propertyTypes, loading: typesLoading } = usePropertyTypes();

  const [type, setType] = useState(listing.type);
  const [purpose, setPurpose] = useState<"sale" | "rent">((listing.purpose as any) || "sale");
  const [titleAr, setTitleAr] = useState(listing.title_ar || "");
  const [titleEn, setTitleEn] = useState(listing.title_en || "");
  const [descAr, setDescAr] = useState(listing.description_ar || "");
  const [descEn, setDescEn] = useState(listing.description_en || "");
  const [locationAr, setLocationAr] = useState(listing.location_ar || "");
  const [locationEn, setLocationEn] = useState(listing.location_en || "");
  const [price, setPrice] = useState(String(listing.price || ""));
  const [negotiable, setNegotiable] = useState(listing.negotiable || false);
  const [beds, setBeds] = useState(String(listing.beds || ""));
  const [baths, setBaths] = useState(String(listing.baths || ""));
  const [area, setArea] = useState(String(listing.area || ""));
  const [deliveryStatus, setDeliveryStatus] = useState<"ready" | "under_construction">(
    (listing.delivery_status as any) || "ready"
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(listing.features || []);
  const [images, setImages] = useState<string[]>(listing.images || []);
  const [phone, setPhone] = useState(listing.phone || "");
  const [whatsapp, setWhatsapp] = useState(listing.whatsapp || "");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const newImages: string[] = [];
    const remaining = MAX_IMAGES - images.length;
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!file.type.startsWith("image/")) {
        setError(isAr ? "يُسمح بملفات الصور فقط" : "Only image files are allowed");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(isAr ? "حجم الصورة كبير (الحد 5 ميجا)" : "Image too large (max 5MB)");
        continue;
      }
      try {
        const url = await uploadToCloudinary(file);
        newImages.push(url);
      } catch {
        setError(isAr ? "فشل تحميل الصورة" : "Failed to load image");
      }
    }
    if (newImages.length > 0) setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): string | null => {
    if (!type) return isAr ? "اختر نوع العقار" : "Select property type";
    if (!titleAr.trim()) return isAr ? "أدخل عنوان الإعلان" : "Enter listing title";
    if (!locationAr.trim()) return isAr ? "أدخل موقع العقار" : "Enter property location";
    if (!price || Number(price) <= 0) return isAr ? "أدخل سعر صحيح" : "Enter a valid price";
    if (!area || Number(area) <= 0) return isAr ? "أدخل المساحة" : "Enter area";
    if (images.length === 0) return isAr ? "أضف صورة واحدة على الأقل" : "Add at least one image";
    if (!phone.trim()) return isAr ? "أدخل رقم التواصل" : "Enter contact phone";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    setSubmitting(true);
    setError("");

    const success = await updateListing(
      listing.id,
      {
        type: type as any,
        purpose,
        title_ar: titleAr.trim(),
        title_en: titleEn.trim() || titleAr.trim(),
        description_ar: descAr.trim(),
        description_en: descEn.trim() || descAr.trim(),
        location_ar: locationAr.trim(),
        location_en: locationEn.trim() || locationAr.trim(),
        price: Number(price),
        beds: Number(beds) || 0,
        baths: Number(baths) || 0,
        area: Number(area),
        img: images[0],
        images: [],
        phone: phone.trim(),
        featured: listing.featured,
        negotiable,
        features: selectedFeatures,
        delivery_status: deliveryStatus,
        whatsapp: whatsapp.trim() || null,
      } as any,
      images
    );

    setSubmitting(false);
    if (success) router.push(`/${locale}/dashboard`);
    else setError(isAr ? "فشل حفظ التعديلات" : "Failed to save changes");
  };

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50";

  return (
    <div className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">{error}</div>
      )}

      {listing.status === "approved" && (
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs">
          {isAr
            ? "الإعلان ده معتمد حاليًا، وأي تعديل هيتحفظ فورًا من غير ما يحتاج مراجعة تانية."
            : "This listing is currently approved — changes will be saved instantly without requiring re-review."}
        </div>
      )}

      {/* نوع العقار والغرض */}
      <SectionCard icon={HiOutlineHome} title={isAr ? "نوع العقار والغرض" : "Property Type & Purpose"}>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-aura-dark mb-3">{isAr ? "نوع العقار" : "Property Type"}</p>
            {typesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propertyTypes.map((t) => (
                  <button key={t.value} type="button" onClick={() => setType(t.value as any)}
                    className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 text-center ${type === t.value ? "border-aura-accent bg-aura-accent/5 shadow-md" : "border-aura-border hover:border-aura-accent/40"}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${type === t.value ? "bg-aura-accent text-white" : "bg-aura-canvas text-aura-accent"}`}>
                      <HiOutlineHome className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-aura-dark leading-tight">{isAr ? t.name_ar : t.name_en}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-aura-dark mb-3">{isAr ? "الغرض" : "Purpose"}</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPurpose("sale")}
                className={`py-3 rounded-2xl border-2 text-sm font-medium transition-all ${purpose === "sale" ? "border-aura-accent bg-aura-accent/5 text-aura-dark" : "border-aura-border text-aura-muted"}`}>
                {isAr ? "للبيع" : "For Sale"}
              </button>
              <button type="button" onClick={() => setPurpose("rent")}
                className={`py-3 rounded-2xl border-2 text-sm font-medium transition-all ${purpose === "rent" ? "border-aura-accent bg-aura-accent/5 text-aura-dark" : "border-aura-border text-aura-muted"}`}>
                {isAr ? "للإيجار" : "For Rent"}
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* المعلومات الأساسية */}
      <SectionCard icon={HiOutlineDocumentText} title={isAr ? "المعلومات الأساسية" : "Basic Info"}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "عنوان الإعلان (عربي) *" : "Title (Arabic) *"}</label>
            <input type="text" value={titleAr} maxLength={90} onChange={(e) => setTitleAr(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "عنوان الإعلان (إنجليزي)" : "Title (English)"}</label>
            <input type="text" value={titleEn} maxLength={90} onChange={(e) => setTitleEn(e.target.value)} className={inputCls} dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "الوصف (عربي)" : "Description (Arabic)"}</label>
            <textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "الوصف (إنجليزي)" : "Description (English)"}</label>
            <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={4} className={`${inputCls} resize-none`} dir="ltr" />
          </div>
        </div>
      </SectionCard>

      {/* الموقع */}
      <SectionCard icon={HiOutlineMapPin} title={isAr ? "الموقع" : "Location"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "الموقع (عربي) *" : "Location (Arabic) *"}</label>
            <input type="text" value={locationAr} onChange={(e) => setLocationAr(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "الموقع (إنجليزي)" : "Location (English)"}</label>
            <input type="text" value={locationEn} onChange={(e) => setLocationEn(e.target.value)} className={inputCls} dir="ltr" />
          </div>
        </div>
      </SectionCard>

      {/* التفاصيل والسعر */}
      <SectionCard icon={HiOutlineCurrencyDollar} title={isAr ? "التفاصيل والسعر" : "Details & Price"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "السعر (جنيه) *" : "Price (EGP) *"}</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "المساحة (م²) *" : "Area (m²) *"}</label>
              <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className={inputCls} dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "عدد الغرف" : "Bedrooms"}</label>
              <input type="number" value={beds} onChange={(e) => setBeds(e.target.value)} className={inputCls} dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "عدد الحمامات" : "Bathrooms"}</label>
              <input type="number" value={baths} onChange={(e) => setBaths(e.target.value)} className={inputCls} dir="ltr" />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} className="w-4 h-4 accent-aura-accent" />
            <span className="text-sm text-aura-dark">{isAr ? "السعر قابل للتفاوض" : "Price is negotiable"}</span>
          </label>

          <div>
            <p className="text-sm font-medium text-aura-dark mb-3">{isAr ? "حالة العقار" : "Property Status"}</p>
            <div className="grid grid-cols-2 gap-3">
              {DELIVERY_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setDeliveryStatus(opt.value as any)}
                  className={`py-3 rounded-2xl border-2 text-sm font-medium transition-all ${deliveryStatus === opt.value ? "border-aura-accent bg-aura-accent/5 text-aura-dark" : "border-aura-border text-aura-muted"}`}>
                  {opt.icon} {isAr ? opt.label_ar : opt.label_en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* المميزات */}
      <SectionCard icon={HiOutlineSparkles} title={isAr ? "المميزات" : "Features"}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {FEATURES.map((f) => {
            const selected = selectedFeatures.includes(f.key);
            return (
              <button key={f.key} type="button" onClick={() => toggleFeature(f.key)}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 text-xs font-medium transition-all ${selected ? "border-aura-accent bg-aura-accent/5 text-aura-dark" : "border-aura-border text-aura-muted"}`}>
                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${selected ? "bg-aura-accent" : "border border-aura-border bg-white"}`}>
                  {selected && <HiOutlineCheck className="w-2.5 h-2.5 text-white" />}
                </div>
                {isAr ? f.ar : f.en}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* الصور */}
      <SectionCard icon={HiOutlinePhoto} title={isAr ? "الصور" : "Photos"}>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        {images.length < MAX_IMAGES && (
          <button type="button" onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed border-aura-border hover:border-aura-accent bg-aura-canvas/50 transition-all duration-300 disabled:opacity-50 mb-4">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineCloudArrowUp className="w-8 h-8 text-aura-accent" />
            )}
            <p className="text-sm font-medium text-aura-dark">
              {uploading ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "اضغط أو اسحب الصور هنا" : "Click or drag images here")}
            </p>
            <p className="text-[11px] text-aura-muted">
              {isAr ? `حتى ${MAX_IMAGES} صور (5 ميجا لكل صورة)` : `Up to ${MAX_IMAGES} images (5MB each)`}
            </p>
          </button>
        )}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-aura-border group">
                <img src={src} alt={`${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-aura-accent text-white text-[10px] font-medium">
                    {isAr ? "الغلاف" : "Cover"}
                  </span>
                )}
                <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500">
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* التواصل */}
      <SectionCard icon={HiOutlinePhone} title={isAr ? "التواصل" : "Contact"}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "رقم الهاتف *" : "Phone Number *"}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "رقم الواتساب (اختياري)" : "WhatsApp Number (optional)"}</label>
            <div className="relative">
              <FaWhatsapp className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={`${inputCls} pr-11`} dir="ltr" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* زرار الحفظ */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={submitting || uploading}
          className="px-8 py-3.5 rounded-2xl text-sm font-medium text-white bg-aura-accent hover:bg-aura-dark transition-all duration-300 disabled:opacity-50"
        >
          {submitting ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ التعديلات" : "Save Changes")}
        </button>
        <button
          onClick={() => router.push(`/${locale}/dashboard`)}
          className="px-6 py-3.5 rounded-2xl border border-aura-border text-aura-muted text-sm hover:text-aura-dark transition-all"
        >
          {isAr ? "إلغاء" : "Cancel"}
        </button>
      </div>
    </div>
  );
}