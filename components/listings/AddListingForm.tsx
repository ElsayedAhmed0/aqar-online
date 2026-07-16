"use client";

import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "@/lib/utils/compressImage";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { usePropertyTypes } from "@/lib/hooks/usePropertyTypes";
import { useCustomAreas } from "@/lib/hooks/useCustomAreas";
import { createClient } from "@/lib/supabase/client";
import { emptyListingForm, type ListingFormData } from "@/lib/types/listing";
import {
  HiOutlineHome, HiOutlineMapPin, HiOutlineCurrencyDollar,
  HiOutlinePhoto, HiOutlinePhone, HiOutlineDocumentText,
  HiOutlineCheck, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineCloudArrowUp, HiOutlineXMark, HiOutlineSparkles,
  HiOutlinePlus, HiOutlineChevronDown,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";

const sections = [
  { id: "type", icon: HiOutlineHome, label_ar: "نوع العقار", label_en: "Property Type" },
  { id: "basic", icon: HiOutlineDocumentText, label_ar: "المعلومات الأساسية", label_en: "Basic Info" },
  { id: "location", icon: HiOutlineMapPin, label_ar: "الموقع", label_en: "Location" },
  { id: "details", icon: HiOutlineCurrencyDollar, label_ar: "التفاصيل والسعر", label_en: "Details & Price" },
  { id: "features", icon: HiOutlineSparkles, label_ar: "المميزات", label_en: "Features" },
  { id: "media", icon: HiOutlinePhoto, label_ar: "الصور", label_en: "Photos" },
  { id: "contact", icon: HiOutlinePhone, label_ar: "التواصل", label_en: "Contact" },
] as const;

type SectionId = (typeof sections)[number]["id"];

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

export default function AddListingForm() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading } = useAuth();
  const { addListing } = useListings();
  const { types: propertyTypes, loading: typesLoading } = usePropertyTypes();
  const { areas: customAreas } = useCustomAreas();
  const [activeSection, setActiveSection] = useState<SectionId>("type");
  const [form, setForm] = useState<ListingFormData>(emptyListingForm());
  const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
  const [negotiable, setNegotiable] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<"ready" | "under_construction">("ready");
  const [whatsapp, setWhatsapp] = useState("");
  const [customFields, setCustomFields] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEnTitle, setShowEnTitle] = useState(false);
  const [showEnDesc, setShowEnDesc] = useState(false);
  const [showEnLocation, setShowEnLocation] = useState(false);
  const [locationChoice, setLocationChoice] = useState(""); // "" = لسه ماختارش, "other" = منطقة تانية
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const areaDropdownRef = useRef<HTMLDivElement>(null);

  const MAJOR_AREAS = [
    // القاهرة الكبرى
    { ar: "التجمع الخامس", en: "New Cairo" },
    { ar: "مدينة نصر", en: "Nasr City" },
    { ar: "المعادي", en: "Maadi" },
    { ar: "مصر الجديدة", en: "Heliopolis" },
    { ar: "المقطم", en: "Mokattam" },
    { ar: "وسط البلد", en: "Downtown Cairo" },
    { ar: "حلوان", en: "Helwan" },
    { ar: "العبور", en: "El Obour" },
    { ar: "بدر", en: "Badr City" },
    { ar: "الشروق", en: "El Shorouk" },
    { ar: "الرحاب", en: "Al Rehab" },
    { ar: "مدينتي", en: "Madinaty" },
    // العاصمة الإدارية
    { ar: "العاصمة الإدارية الجديدة", en: "New Administrative Capital" },
    // الجيزة
    { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    { ar: "6 أكتوبر", en: "6th of October" },
    { ar: "الدقي", en: "Dokki" },
    { ar: "المهندسين", en: "Mohandessin" },
    { ar: "فيصل", en: "Faisal" },
    { ar: "الهرم", en: "Haram" },
    // الساحل والسياحة
    { ar: "الساحل الشمالي", en: "North Coast" },
    { ar: "العلمين الجديدة", en: "New Alamein" },
    { ar: "مرسى مطروح", en: "Marsa Matrouh" },
    { ar: "الغردقة", en: "Hurghada" },
    { ar: "شرم الشيخ", en: "Sharm El Sheikh" },
    { ar: "رأس الحكمة", en: "Ras El Hekma" },
    // باقي المحافظات
    { ar: "الإسكندرية", en: "Alexandria" },
    { ar: "المنصورة", en: "Mansoura" },
    { ar: "طنطا", en: "Tanta" },
    { ar: "الزقازيق", en: "Zagazig" },
    { ar: "دمياط", en: "Damietta" },
    { ar: "بورسعيد", en: "Port Said" },
    { ar: "الإسماعيلية", en: "Ismailia" },
    { ar: "السويس", en: "Suez" },
    { ar: "أسوان", en: "Aswan" },
    { ar: "الأقصر", en: "Luxor" },
    { ar: "أسيوط", en: "Assiut" },
    { ar: "المنيا", en: "Minya" },
    { ar: "سوهاج", en: "Sohag" },
    { ar: "الفيوم", en: "Fayoum" },
  ];

  const ALL_AREAS = [
    ...MAJOR_AREAS,
    ...customAreas
      .filter((c) => !MAJOR_AREAS.some((a) => a.ar === c.name_ar))
      .map((c) => ({ ar: c.name_ar, en: c.name_en || c.name_ar })),
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target as Node)) {
        setAreaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



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

  const addCustomField = () => {
    setCustomFields((prev) => [...prev, { label: "", value: "" }]);
  };

  const updateCustomField = (index: number, key: "label" | "value", val: string) => {
    setCustomFields((prev) => prev.map((f, i) => i === index ? { ...f, [key]: val } : f));
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const sectionIndex = sections.findIndex((s) => s.id === activeSection);

  const validateSection = (id: SectionId): string | null => {
    switch (id) {
      case "type": return !form.type ? (isAr ? "اختر نوع العقار" : "Select property type") : null;
      case "basic": return !form.title_ar.trim() ? (isAr ? "أدخل عنوان الإعلان" : "Enter listing title") : null;
      case "location": return !form.location_ar.trim() ? (isAr ? "أدخل موقع العقار" : "Enter property location") : null;
      case "details":
        if (!form.price || Number(form.price) <= 0) return isAr ? "أدخل سعر صحيح" : "Enter a valid price";
        if (!form.area || Number(form.area) <= 0) return isAr ? "أدخل المساحة" : "Enter area";
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
      if (locationChoice === "other" && form.location_ar.trim()) {
        const typedArea = form.location_ar.trim();
        const alreadyExists = ALL_AREAS.some((a) => a.ar === typedArea);
        if (!alreadyExists) {
          const supabase = createClient();
          await supabase
            .from("custom_areas")
            .upsert({ name_ar: typedArea, name_en: form.location_en.trim() || null }, { onConflict: "name_ar" });
        }
      }
      const created = await addListing({
        type: form.type as any,
        purpose,
        title_ar: form.title_ar.trim(),
        title_en: showEnTitle ? form.title_en.trim() : form.title_ar.trim(),
        description_ar: form.description_ar.trim(),
        description_en: showEnDesc ? form.description_en.trim() : form.description_ar.trim(),
        location_ar: form.location_ar.trim(),
        location_en: showEnLocation ? form.location_en.trim() : form.location_ar.trim(),
        price: Number(form.price),
        beds: Number(form.beds) || 0,
        baths: Number(form.baths) || 0,
        area: Number(form.area),
        img: form.images[0],
        images: [],
        phone: form.phone.trim(),
        featured: false,
        status: "pending",
        negotiable,
        features: selectedFeatures,
        custom_fields: customFields.filter(f => f.label.trim() && f.value.trim()),
        delivery_status: deliveryStatus,
        whatsapp: whatsapp.trim() || null,
      } as any, form.images);

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

  const EnToggle = ({ show, onShow, label }: { show: boolean; onShow: () => void; label: string }) =>
    !show ? (
      <button type="button" onClick={onShow}
        className="flex items-center gap-1.5 text-xs text-aura-accent hover:text-aura-dark transition-colors mt-1 w-fit">
        <HiOutlinePlus className="w-3.5 h-3.5" />
        {label}
      </button>
    ) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <aside className="lg:col-span-4 xl:col-span-3">
        <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-4 md:p-5 lg:sticky lg:top-28">
          <p className="text-xs tracking-[0.2em] text-aura-accent uppercase mb-3 md:mb-4">
            {isAr ? "خطوات الإعلان" : "Listing Steps"}
          </p>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {sections.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              const isDone = isSectionComplete(s.id);
              return (
                <button key={s.id} onClick={() => { setActiveSection(s.id); setError(""); }}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl text-xs font-medium transition-all duration-300 shrink-0 lg:shrink ${isActive ? "bg-aura-dark text-white" : "bg-aura-canvas text-aura-muted hover:text-aura-dark border border-aura-border"}`}>
                  <span className={`w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white/20" : isDone ? "bg-green-100 text-green-600" : "bg-aura-card"}`}>
                    {isDone && !isActive ? <HiOutlineCheck className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
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

      <div className="lg:col-span-8 xl:col-span-9">
        <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 md:p-6 lg:p-8">
          <h3 className="text-lg md:text-xl font-light text-aura-dark mb-5 md:mb-6">
            {isAr ? sections[sectionIndex].label_ar : sections[sectionIndex].label_en}
          </h3>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">{error}</div>
          )}

          {/* ── نوع العقار ── */}
          {activeSection === "type" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-aura-dark mb-3">{isAr ? "نوع العقار" : "Property Type"}</p>
                {typesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {propertyTypes.map((t) => (
                      <button key={t.value} type="button" onClick={() => update({ type: t.value as any })}
                        className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 text-center ${form.type === t.value ? "border-aura-accent bg-aura-accent/5 shadow-md" : "border-aura-border hover:border-aura-accent/40"}`}>
                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${form.type === t.value ? "bg-aura-accent text-white" : "bg-aura-canvas text-aura-accent"}`}>
                          <HiOutlineHome className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <p className="text-xs font-medium text-aura-dark leading-tight">{isAr ? t.name_ar : t.name_en}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── المعلومات الأساسية ── */}
          {activeSection === "basic" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "عنوان الإعلان *" : "Title *"}</label>
                <input type="text" value={form.title_ar} onChange={(e) => update({ title_ar: e.target.value })}
                  placeholder={isAr ? "مثال: شقة فاخرة بالتجمع الخامس" : "e.g. Luxury apartment in New Cairo"} className={inputCls} />
                <EnToggle show={showEnTitle} onShow={() => setShowEnTitle(true)} label={isAr ? "أضف العنوان بالإنجليزية" : "Add English title"} />
              </div>
              {showEnTitle && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-aura-dark">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
                  <input type="text" value={form.title_en} onChange={(e) => update({ title_en: e.target.value })} placeholder="Luxury Apartment in New Cairo" className={inputCls} dir="ltr" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "وصف الإعلان" : "Description"}</label>
                <textarea rows={4} value={form.description_ar} onChange={(e) => update({ description_ar: e.target.value })}
                  placeholder={isAr ? "اكتب وصفاً تفصيلياً للعقار..." : "Write a detailed description..."} className={`${inputCls} resize-none`} />
                <EnToggle show={showEnDesc} onShow={() => setShowEnDesc(true)} label={isAr ? "أضف الوصف بالإنجليزية" : "Add English description"} />
              </div>
              {showEnDesc && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-aura-dark">{isAr ? "الوصف (إنجليزي)" : "Description (English)"}</label>
                  <textarea rows={4} value={form.description_en} onChange={(e) => update({ description_en: e.target.value })} placeholder="Detailed property description..." className={`${inputCls} resize-none`} dir="ltr" />
                </div>
              )}
            </div>
          )}

          {/* ── الموقع ── */}
          {activeSection === "location" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "الموقع *" : "Location *"}</label>
                <div ref={areaDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
                    className={`${inputCls} flex items-center justify-between`}
                  >
                    <span className={locationChoice ? "text-aura-dark" : "text-aura-muted/50"}>
                      {locationChoice === "other"
                        ? (isAr ? "منطقة تانية" : "Other area")
                        : locationChoice
                          ? (isAr ? locationChoice : (ALL_AREAS.find((a) => a.ar === locationChoice)?.en || locationChoice))
                          : (isAr ? "اختر المنطقة" : "Select area")}
                    </span>
                    <HiOutlineChevronDown className={`w-4 h-4 text-aura-muted transition-transform duration-200 ${areaDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {areaDropdownOpen && (
                    <div
                      style={{ maxHeight: "300px", overflow: "scroll" }}
                      className="absolute top-full mt-1.5 w-full bg-white border border-aura-border rounded-2xl overflow-y-scroll z-50 shadow-xl"
                    >
                      {ALL_AREAS.map((area) => (
                        <button
                          key={area.ar}
                          type="button"
                          onClick={() => {
                            setLocationChoice(area.ar);
                            setAreaDropdownOpen(false);
                            update({ location_ar: area.ar, location_en: area.en });
                          }}
                          className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-aura-canvas ${locationChoice === area.ar ? "bg-aura-accent/10 text-aura-accent" : "text-aura-dark"}`}
                        >
                          {isAr ? area.ar : area.en}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setLocationChoice("other");
                          setAreaDropdownOpen(false);
                          update({ location_ar: "", location_en: "" });
                        }}
                        className={`w-full text-right px-4 py-2.5 text-sm border-t border-aura-border transition-colors hover:bg-aura-canvas ${locationChoice === "other" ? "bg-aura-accent/10 text-aura-accent" : "text-aura-dark"}`}
                      >
                        {isAr ? "منطقة تانية" : "Other area"}
                      </button>
                    </div>
                  )}
                </div>
                {locationChoice === "other" && (
                  <input type="text" value={form.location_ar} onChange={(e) => update({ location_ar: e.target.value })}
                    placeholder={isAr ? "اكتب اسم المنطقة" : "Type the area name"} className={`${inputCls} mt-2`} />
                )}
                <EnToggle show={showEnLocation} onShow={() => setShowEnLocation(true)} label={isAr ? "أضف الموقع بالإنجليزية" : "Add English location"} />
              </div>
              {showEnLocation && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-aura-dark">{isAr ? "الموقع (إنجليزي)" : "Location (English)"}</label>
                  <input type="text" value={form.location_en} onChange={(e) => update({ location_en: e.target.value })} placeholder="New Cairo, Cairo" className={inputCls} dir="ltr" />
                </div>
              )}
            </div>
          )}

          {/* ── التفاصيل والسعر ── */}
          {activeSection === "details" && (
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-medium text-aura-dark">{isAr ? "الغرض من الإعلان" : "Listing Purpose"}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "sale", label_ar: "للبيع", label_en: "For Sale", icon: "🏷️" },
                    { value: "rent", label_ar: "للإيجار", label_en: "For Rent", icon: "🔑" },
                  ].map((p) => (
                    <button key={p.value} type="button" onClick={() => setPurpose(p.value as any)}
                      className={`flex items-center justify-center gap-2 py-3 md:py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ${purpose === p.value ? "border-aura-accent bg-aura-accent/5 text-aura-dark shadow-md" : "border-aura-border hover:border-aura-accent/40 text-aura-muted"}`}>
                      <span>{p.icon}</span>
                      {isAr ? p.label_ar : p.label_en}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-aura-dark">{isAr ? "السعر (جنيه مصري) *" : "Price (EGP) *"}</label>
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
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-aura-dark">{isAr ? "المساحة (م²) *" : "Area (m²) *"}</label>
                  <input type="number" value={form.area} onChange={(e) => update({ area: e.target.value })} placeholder="180" className={inputCls} dir="ltr" min={0} />
                </div>
              </div>
              <button type="button" onClick={() => setNegotiable(!negotiable)}
                className={`flex items-center gap-3 w-full p-4 rounded-2xl border-2 transition-all duration-300 ${negotiable ? "border-aura-accent bg-aura-accent/5" : "border-aura-border hover:border-aura-accent/40"}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${negotiable ? "bg-aura-accent border-aura-accent" : "border-aura-border"}`}>
                  {negotiable && <HiOutlineCheck className="w-3 h-3 text-white" />}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-aura-dark">{isAr ? "السعر قابل للتفاوض" : "Price is Negotiable"}</p>
                  <p className="text-xs text-aura-muted">{isAr ? "سيظهر بادج على إعلانك" : "A badge will appear on your listing"}</p>
                </div>
              </button>

              {/* ✅ Custom Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-aura-dark">{isAr ? "تفاصيل إضافية" : "Additional Details"}</p>
                  <button type="button" onClick={addCustomField}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aura-accent/10 text-aura-accent text-xs font-medium hover:bg-aura-accent/20 transition-all">
                    <HiOutlinePlus className="w-3.5 h-3.5" />
                    {isAr ? "أضف تفصيلة" : "Add Detail"}
                  </button>
                </div>
                {customFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="text" value={field.label} onChange={(e) => updateCustomField(index, "label", e.target.value)}
                      placeholder={isAr ? "اسم التفصيلة (مثال: عدد الأدوار)" : "Label (e.g. Floors)"} className={`${inputCls} flex-1`} />
                    <input type="text" value={field.value} onChange={(e) => updateCustomField(index, "value", e.target.value)}
                      placeholder={isAr ? "القيمة (مثال: 3)" : "Value (e.g. 3)"} className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => removeCustomField(index)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center shrink-0">
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── المميزات ── */}
          {activeSection === "features" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-aura-dark mb-3">{isAr ? "حالة العقار" : "Property Status"}</p>
                <div className="grid grid-cols-2 gap-3">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const selected = deliveryStatus === opt.value;
                    return (
                      <button key={opt.value} type="button" onClick={() => setDeliveryStatus(opt.value as any)}
                        className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ${selected ? "border-aura-accent bg-aura-accent/5 text-aura-dark" : "border-aura-border hover:border-aura-accent/40 text-aura-muted"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "bg-aura-accent border-aura-accent" : "border-aura-border"}`}>
                          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span>{opt.icon}</span>
                        <span className="text-xs sm:text-sm">{isAr ? opt.label_ar : opt.label_en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-aura-dark mb-3">{isAr ? "مميزات العقار" : "Property Features"}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {FEATURES.map((f) => {
                    const selected = selectedFeatures.includes(f.key);
                    return (
                      <button key={f.key} type="button" onClick={() => toggleFeature(f.key)}
                        className={`flex items-center gap-2 p-2.5 md:p-3 rounded-2xl border-2 text-xs font-medium transition-all duration-300 ${selected ? "border-aura-accent bg-aura-accent/5 text-aura-dark" : "border-aura-border hover:border-aura-accent/40 text-aura-muted"}`}>
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${selected ? "bg-aura-accent" : "border border-aura-border bg-white"}`}>
                          {selected && <HiOutlineCheck className="w-2.5 h-2.5 text-white" />}
                        </div>
                        {isAr ? f.ar : f.en}
                      </button>
                    );
                  })}
                </div>
                {selectedFeatures.length > 0 && (
                  <p className="text-xs text-aura-accent mt-3">
                    {isAr ? `تم اختيار ${selectedFeatures.length} ميزة` : `${selectedFeatures.length} features selected`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── الصور ── */}
          {activeSection === "media" && (
            <div className="space-y-5">
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              {form.images.length < MAX_IMAGES && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  disabled={uploading}
                  className="w-full flex flex-col items-center justify-center gap-3 py-10 md:py-12 rounded-2xl border-2 border-dashed border-aura-border hover:border-aura-accent bg-aura-canvas/50 hover:bg-aura-accent/5 transition-all duration-300 disabled:opacity-50">
                  {uploading ? (
                    <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-aura-accent/10 flex items-center justify-center">
                      <HiOutlineCloudArrowUp className="w-6 h-6 md:w-7 md:h-7 text-aura-accent" />
                    </div>
                  )}
                  <div className="text-center px-4">
                    <p className="text-sm font-medium text-aura-dark">
                      {uploading ? (isAr ? "جاري رفع الصور على Cloudinary..." : "Uploading to Cloudinary...") : (isAr ? "اضغط أو اسحب الصور هنا" : "Click or drag images here")}
                    </p>
                    <p className="text-[11px] text-aura-muted mt-1">
                      {isAr ? `JPG, PNG, WEBP — حتى ${MAX_IMAGES} صور (5 ميجا لكل صورة)` : `JPG, PNG, WEBP — up to ${MAX_IMAGES} images (5MB each)`}
                    </p>
                  </div>
                </button>
              )}
              {form.images.length > 0 && (
                <div>
                  <p className="text-xs text-aura-muted mb-3">
                    {isAr ? `${form.images.length} / ${MAX_IMAGES} صور — الأولى هي صورة الغلاف` : `${form.images.length} / ${MAX_IMAGES} images — first is cover`}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.images.map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-aura-border group">
                        <img src={src} alt={`${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-aura-accent text-white text-[10px] font-medium">
                            {isAr ? "الغلاف" : "Cover"}
                          </span>
                        )}
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

          {/* ── التواصل ── */}
          {activeSection === "contact" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "رقم الهاتف *" : "Phone Number *"}</label>
                <div className="relative">
                  <HiOutlinePhone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
                  <input type="tel" value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="01xxxxxxxxx" className={`${inputCls} pr-11`} dir="ltr" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark">{isAr ? "رقم الواتساب (اختياري)" : "WhatsApp Number (optional)"}</label>
                <div className="relative">
                  <FaWhatsapp className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={isAr ? "لو مختلف عن رقم الهاتف..." : "If different from phone number..."} className={`${inputCls} pr-11`} dir="ltr" />
                </div>
                <p className="text-[11px] text-aura-muted">{isAr ? "اتركه فارغاً لو نفس رقم الهاتف" : "Leave empty if same as phone number"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-aura-canvas border border-aura-border">
                <p className="text-xs text-aura-muted leading-relaxed">
                  {isAr ? "سيظهر رقمك للمهتمين بالعقار. تأكد من صحته قبل النشر." : "Your number will be visible to interested buyers. Verify it before publishing."}
                </p>
              </div>
              <div className="mt-2 p-4 md:p-5 rounded-2xl bg-aura-canvas border border-aura-border space-y-2">
                <p className="text-xs font-medium text-aura-dark mb-3">{isAr ? "ملخص الإعلان" : "Listing Summary"}</p>
                {[
                  { label_ar: "النوع", label_en: "Type", value: form.type || "-" },
                  { label_ar: "الغرض", label_en: "Purpose", value: purpose === "sale" ? (isAr ? "للبيع" : "For Sale") : (isAr ? "للإيجار" : "For Rent") },
                  { label_ar: "السعر", label_en: "Price", value: form.price ? `${Number(form.price).toLocaleString()} EGP${negotiable ? (isAr ? " (قابل للتفاوض)" : " (Negotiable)") : ""}` : "-" },
                  { label_ar: "حالة العقار", label_en: "Status", value: deliveryStatus === "ready" ? (isAr ? "✅ جاهز للتسليم" : "✅ Ready") : (isAr ? "🏗️ قيد الإنشاء" : "🏗️ Under Construction") },
                  { label_ar: "المميزات", label_en: "Features", value: selectedFeatures.length > 0 ? (isAr ? `${selectedFeatures.length} ميزة` : `${selectedFeatures.length} features`) : "-" },
                  { label_ar: "الصور", label_en: "Photos", value: String(form.images.length) },
                ].map((row) => (
                  <div key={row.label_en} className="flex items-center justify-between text-xs">
                    <span className="text-aura-muted">{isAr ? row.label_ar : row.label_en}</span>
                    <span className="text-aura-dark font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 md:mt-8 pt-5 md:pt-6 border-t border-aura-border">
            <button type="button" onClick={goPrev} disabled={sectionIndex === 0}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl text-sm text-aura-muted border border-aura-border hover:text-aura-dark transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed">
              <HiOutlineChevronRight className="w-4 h-4" />
              {isAr ? "السابق" : "Previous"}
            </button>
            {sectionIndex < sections.length - 1 ? (
              <button type="button" onClick={goNext}
                className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-2xl text-sm font-medium text-white bg-aura-accent hover:bg-aura-dark transition-all duration-300">
                {isAr ? "التالي" : "Next"}
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-2xl text-sm font-medium text-white bg-aura-accent hover:bg-aura-dark transition-all duration-300 disabled:opacity-50">
                {submitting ? (isAr ? "جاري النشر..." : "Publishing...") : (isAr ? "نشر الإعلان" : "Publish Listing")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}