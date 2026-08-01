import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { AREAS } from "@/lib/data/areas";
import { HiOutlineMapPin, HiOutlineCalendarDays, HiOutlineBanknotes, HiOutlineBuildingOffice2 } from "react-icons/hi2";

const CONSTRUCTION_LABELS: Record<string, { ar: string; en: string }> = {
  under_construction: { ar: "تحت الإنشاء", en: "Under Construction" },
  delivered: { ar: "تم التسليم", en: "Delivered" },
};

const FINISH_LABELS: Record<string, { ar: string; en: string }> = {
  extra_super_lux: { ar: "إكسترا سوبر لوكس", en: "Extra Super Lux" },
  super_lux: { ar: "سوبر لوكس", en: "Super Lux" },
  lux: { ar: "لوكس", en: "Lux" },
  semi_finished: { ar: "نصف تشطيب", en: "Semi Finished" },
  without_finish: { ar: "بدون تشطيب", en: "Without Finish" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string; locale: string }>;
}): Promise<Metadata> {
  const { projectSlug, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("name_ar, name_en, description_ar, description_en, cover_image_url")
    .eq("slug", projectSlug)
    .single();

  if (!project) return {};

  const name = isAr ? project.name_ar : project.name_en || project.name_ar;
  const description = (isAr ? project.description_ar : project.description_en) || name;

  return {
    title: isAr ? `${name} | عقار أونلاين` : `${name} | Aqar Online`,
    description,
    openGraph: {
      title: name,
      description,
      images: project.cover_image_url ? [{ url: project.cover_image_url }] : [],
    },
  };
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string; locale: string }>;
}) {
  const { slug, projectSlug, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, developers(id, name, name_en, logo_url, slug, phone, whatsapp)")
    .eq("slug", projectSlug)
    .single();

  if (!project) notFound();

  const developer = (project as any).developers;
  const name = (isAr ? project.name_ar : project.name_en) || project.name_ar;
  const description = isAr ? project.description_ar : project.description_en;
  const area = AREAS.find((a) => a.slug === (project as any).area_slug);
  const constructionLabel = (project as any).construction_status ? CONSTRUCTION_LABELS[(project as any).construction_status] : null;
  const finishLabel = (project as any).finish_type ? FINISH_LABELS[(project as any).finish_type] : null;

  const developerName = developer ? (isAr ? developer.name : developer.name_en || developer.name) : "";

  const breadcrumbItems = [
    {
      label: isAr ? "الرئيسية" : "Home",
      href: `https://www.aqqaronline.com/${locale}`,
    },
    {
      label: isAr ? "المطورين" : "Developers",
      href: `https://www.aqqaronline.com/${locale}/developers`,
    },
    ...(developer
      ? [
          {
            label: developerName,
            href: `https://www.aqqaronline.com/${locale}/companies/${developer.slug}`,
          },
        ]
      : []),
    {
      label: name,
    },
  ];

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <Breadcrumb items={breadcrumbItems} isAr={isAr} />

        {/* صورة الغلاف */}
        <div className="relative h-64 md:h-96 w-full rounded-3xl overflow-hidden mb-8">
          {project.cover_image_url ? (
            <img src={project.cover_image_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-aura-dark to-aura-accent/40" />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* العمود الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-aura-dark mb-3">{name}</h1>
              {area && (
                <div className="flex items-center gap-1.5 text-aura-muted">
                  <HiOutlineMapPin className="w-4 h-4" />
                  <span className="text-sm">{isAr ? area.ar : area.en}</span>
                </div>
              )}
            </div>

            {/* شارات سريعة */}
            <div className="flex flex-wrap gap-3">
              {project.starting_price && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-aura-card border border-aura-border">
                  <HiOutlineBanknotes className="w-4 h-4 text-aura-accent" />
                  <span className="text-sm text-aura-dark">
                    {isAr ? "يبدأ من " : "From "}{Number(project.starting_price).toLocaleString(isAr ? "ar-EG" : "en-US")} {isAr ? "جنيه" : "EGP"}
                  </span>
                </div>
              )}
              {constructionLabel && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-aura-card border border-aura-border">
                  <HiOutlineBuildingOffice2 className="w-4 h-4 text-aura-accent" />
                  <span className="text-sm text-aura-dark">{isAr ? constructionLabel.ar : constructionLabel.en}</span>
                </div>
              )}
              {project.delivery_date && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-aura-card border border-aura-border">
                  <HiOutlineCalendarDays className="w-4 h-4 text-aura-accent" />
                  <span className="text-sm text-aura-dark">{project.delivery_date}</span>
                </div>
              )}
              {finishLabel && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-aura-card border border-aura-border">
                  <span className="text-sm text-aura-dark">{isAr ? finishLabel.ar : finishLabel.en}</span>
                </div>
              )}
            </div>

            {/* الوصف */}
            {description && (
              <div>
                <h2 className="text-lg font-medium text-aura-dark mb-3">{isAr ? "عن المشروع" : "About the Project"}</h2>
                <p className="text-sm text-aura-muted leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}

            {/* خطة السداد */}
            {project.payment_plan_ar && (
              <div>
                <h2 className="text-lg font-medium text-aura-dark mb-3">{isAr ? "خطة السداد" : "Payment Plan"}</h2>
                <p className="text-sm text-aura-muted leading-relaxed whitespace-pre-line">{project.payment_plan_ar}</p>
              </div>
            )}
          </div>

          {/* الشريط الجانبي — بيانات المطور */}
          <aside className="lg:col-span-1">
            <div className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border lg:sticky lg:top-28">
              <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
                {isAr ? "المطوّر العقاري" : "Developer"}
              </p>
              {developer && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl border border-aura-border bg-aura-canvas flex items-center justify-center overflow-hidden shrink-0">
                      {developer.logo_url ? (
                        <img src={developer.logo_url} alt={developer.name} className="max-h-full max-w-full object-contain p-1" />
                      ) : (
                        <span className="text-sm font-bold text-aura-accent">{developer.name?.slice(0, 2)}</span>
                      )}
                    </div>
                    <a href={`/${locale}/companies/${developer.slug}`} className="text-sm font-medium text-aura-dark hover:text-aura-accent transition-colors">
                      {isAr ? developer.name : developer.name_en || developer.name}
                    </a>
                  </div>
                  {developer.phone && (
                    <a href={`tel:${developer.phone}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all duration-300 mb-2" dir="ltr">
                      {developer.phone}
                    </a>
                  )}
                  {developer.whatsapp && (
                    <a href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-aura-border text-aura-dark text-sm font-medium hover:border-aura-accent transition-all duration-300">
                      {isAr ? "واتساب" : "WhatsApp"}
                    </a>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}