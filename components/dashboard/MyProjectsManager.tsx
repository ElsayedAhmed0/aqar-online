"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { HiOutlinePhoto, HiOutlinePlus, HiOutlineXMark, HiOutlineMapPin, HiOutlineCalendarDays } from "react-icons/hi2";
import { AREAS } from "@/lib/data/areas";

const FINISH_TYPES = [
  { value: "extra_super_lux", ar: "إكسترا سوبر لوكس", en: "Extra Super Lux" },
  { value: "super_lux", ar: "سوبر لوكس", en: "Super Lux" },
  { value: "lux", ar: "لوكس", en: "Lux" },
  { value: "semi_finished", ar: "نصف تشطيب", en: "Semi Finished" },
  { value: "without_finish", ar: "بدون تشطيب", en: "Without Finish" },
];
type Project = {
  id: string;
  developer_id: string;
  name_ar: string;
  name_en?: string | null;
  slug?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  cover_image_url?: string | null;
  location_ar?: string | null;
  location_en?: string | null;
  delivery_date?: string | null;
  payment_plan_ar?: string | null;
  status: "pending" | "approved" | "rejected";
  active: boolean;
  starting_price?: number | null;
  construction_status?: "under_construction" | "delivered" | null;
  finish_type?: string | null;
  area_slug?: string | null;
};

const statusLabels: Record<string, { ar: string; en: string; cls: string }> = {
  pending: { ar: "بانتظار المراجعة", en: "Pending Review", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  approved: { ar: "معتمد", en: "Approved", cls: "bg-green-50 text-green-600 border-green-200" },
  rejected: { ar: "مرفوض", en: "Rejected", cls: "bg-red-50 text-red-500 border-red-200" },
};

const emptyForm = {
  name_ar: "", name_en: "", description_ar: "", description_en: "",
  cover_image_url: "", location_ar: "", location_en: "",
  delivery_date: "", payment_plan_ar: "",
  starting_price: "", construction_status: "", finish_type: "", area_slug: "",
};

export default function MyProjectsManager({ developerId, isAr }: { developerId: string; isAr: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const fetchProjects = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("developer_id", developerId)
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [developerId]);

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

  const handleAddProject = async () => {
    if (!form.name_ar) return;
    setSaving(true);
    const supabase = createClient();

    const slug =
      form.name_ar
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-")
        .replace(/-+/g, "-") +
      "-" +
      Date.now().toString().slice(-6);

  const { data, error } = await supabase
      .from("projects")
      .insert({
        developer_id: developerId,
        ...form,
        starting_price: form.starting_price ? Number(form.starting_price) : null,
        construction_status: form.construction_status || null,
        finish_type: form.finish_type || null,
        area_slug: form.area_slug || null,
        slug,
        status: "pending",
        active: false,
      })
      .select()
      .single();

    setSaving(false);
    if (!error && data) {
      setProjects((prev) => [data, ...prev]);
      setForm(emptyForm);
      setFormOpen(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const confirmed = window.confirm(
      isAr ? "متأكد إنك عايز تمسح المشروع ده؟" : "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-aura-dark">
          {isAr ? "مشاريعي" : "My Projects"} <span className="text-aura-muted font-light">({projects.length})</span>
        </h3>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-xs font-medium transition-all"
        >
          {formOpen ? <HiOutlineXMark className="w-4 h-4" /> : <HiOutlinePlus className="w-4 h-4" />}
          {formOpen ? (isAr ? "إغلاق" : "Close") : (isAr ? "إضافة مشروع جديد" : "Add New Project")}
        </button>
      </div>

      {formOpen && (
        <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-5 md:p-6">
          <p className="text-xs text-aura-muted mb-5">
            {isAr
              ? "المشروع الجديد هيروح تحت مراجعة الأدمن قبل ما يظهر للعامة"
              : "The new project will be reviewed by the admin before going live"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "اسم المشروع (عربي)" : "Project Name (Arabic)"}</label>
              <input type="text" value={form.name_ar} onChange={(e) => setForm((p) => ({ ...p, name_ar: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "اسم المشروع (إنجليزي)" : "Project Name (English)"}</label>
              <input type="text" value={form.name_en} onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent" dir="ltr" />
            </div>

          <div className="space-y-1.5 relative">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "المنطقة" : "Area"}</label>
              <button
                type="button"
                onClick={() => setAreaDropdownOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm text-aura-dark outline-none focus:border-aura-accent"
              >
                <span className={form.area_slug ? "" : "text-aura-muted"}>
                  {form.area_slug
                    ? (isAr ? AREAS.find((a) => a.slug === form.area_slug)?.ar : AREAS.find((a) => a.slug === form.area_slug)?.en)
                    : (isAr ? "اختر المنطقة" : "Select area")}
                </span>
                <span className={`text-xs transition-transform ${areaDropdownOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              {areaDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAreaDropdownOpen(false)} />
                  <div className="absolute top-full mt-1 start-0 w-full max-h-48 overflow-y-auto bg-aura-card border border-aura-border rounded-2xl shadow-lg z-20">
                    {AREAS.map((a) => (
                      <button
                        key={a.slug}
                        type="button"
                        onClick={() => { setForm((p) => ({ ...p, area_slug: a.slug })); setAreaDropdownOpen(false); }}
                        className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${form.area_slug === a.slug ? "bg-aura-accent/10 text-aura-accent font-medium" : "text-aura-dark hover:bg-aura-canvas"}`}
                      >
                        {isAr ? a.ar : a.en}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "تاريخ التسليم" : "Delivery Date"}</label>
              <input type="text" value={form.delivery_date} onChange={(e) => setForm((p) => ({ ...p, delivery_date: e.target.value }))} placeholder={isAr ? "مثال: 2028" : "e.g. 2028"} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "السعر يبدأ من (جنيه)" : "Starting Price (EGP)"}</label>
              <input type="number" value={form.starting_price} onChange={(e) => setForm((p) => ({ ...p, starting_price: e.target.value }))} placeholder={isAr ? "مثال: 3000000" : "e.g. 3000000"} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "حالة الإنشاء" : "Construction Status"}</label>
              <select value={form.construction_status} onChange={(e) => setForm((p) => ({ ...p, construction_status: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent">
                <option value="">{isAr ? "اختر الحالة" : "Select status"}</option>
                <option value="under_construction">{isAr ? "تحت الإنشاء" : "Under Construction"}</option>
                <option value="delivered">{isAr ? "تم التسليم" : "Delivered"}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "نوع التشطيب" : "Finish Type"}</label>
              <select value={form.finish_type} onChange={(e) => setForm((p) => ({ ...p, finish_type: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent">
                <option value="">{isAr ? "اختر نوع التشطيب" : "Select finish type"}</option>
                {FINISH_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>{isAr ? f.ar : f.en}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "صورة المشروع (ماستر بلان أو واجهة)" : "Project Image (Master plan or facade)"}</label>
              <div className="flex gap-3">
                <input type="text" value={form.cover_image_url} onChange={(e) => setForm((p) => ({ ...p, cover_image_url: e.target.value }))} placeholder="URL..." className="flex-1 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent" />
                <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs cursor-pointer hover:border-aura-accent transition-all shrink-0">
                  <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />
                  {uploading ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "رفع" : "Upload")}
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    const url = await uploadImage(file);
                    setUploading(false);
                    if (url) setForm((p) => ({ ...p, cover_image_url: url }));
                  }} />
                </label>
              </div>
              {form.cover_image_url && <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-aura-border"><img src={form.cover_image_url} alt="preview" className="w-full h-full object-cover" /></div>}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "وصف المشروع" : "Project Description"}</label>
              <textarea value={form.description_ar} onChange={(e) => setForm((p) => ({ ...p, description_ar: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent" />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-aura-dark">{isAr ? "خطة السداد" : "Payment Plan"}</label>
              <textarea value={form.payment_plan_ar} onChange={(e) => setForm((p) => ({ ...p, payment_plan_ar: e.target.value }))} rows={2} placeholder={isAr ? "مثال: مقدم 10% وتقسيط 8 سنوات" : "e.g. 10% down payment, 8-year installments"} className="w-full px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent" />
            </div>
          </div>

          <button onClick={handleAddProject} disabled={saving || !form.name_ar} className="mt-5 px-6 py-3 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">
            {saving ? (isAr ? "جاري الإضافة..." : "Adding...") : (isAr ? "إضافة المشروع" : "Add Project")}
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-aura-card rounded-3xl border border-aura-border">
          <p className="text-4xl">🏗️</p>
          <p className="text-aura-muted font-light text-sm">{isAr ? "لسه معملتش أي مشروع" : "You haven't added any projects yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border">
              {project.cover_image_url && <div className="h-36 overflow-hidden"><img src={project.cover_image_url} alt={project.name_ar} className="w-full h-full object-cover" /></div>}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium text-aura-dark">{isAr ? project.name_ar : (project.name_en || project.name_ar)}</h4>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-medium ${statusLabels[project.status].cls}`}>
                    {isAr ? statusLabels[project.status].ar : statusLabels[project.status].en}
                  </span>
                </div>
                {project.area_slug && (
                  <div className="flex items-center gap-1.5 text-aura-muted mb-1">
                    <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs truncate">
                      {isAr
                        ? AREAS.find((a) => a.slug === project.area_slug)?.ar || project.area_slug
                        : AREAS.find((a) => a.slug === project.area_slug)?.en || project.area_slug}
                    </span>
                  </div>
                )}
                {project.delivery_date && (
                  <div className="flex items-center gap-1.5 text-aura-muted mb-1">
                    <HiOutlineCalendarDays className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs">{project.delivery_date}</span>
                  </div>
                )}
                {project.starting_price && (
                  <p className="text-xs font-medium text-aura-accent mb-3">
                    {isAr ? "يبدأ من " : "Starts at "}{project.starting_price.toLocaleString(isAr ? "ar-EG" : "en-US")} {isAr ? "جنيه" : "EGP"}
                  </p>
                )}
                <button onClick={() => handleDeleteProject(project.id)} className="w-full py-2 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-all">
                  {isAr ? "حذف المشروع" : "Delete Project"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}