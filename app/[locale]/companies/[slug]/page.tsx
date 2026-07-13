import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompanyHero from "@/components/companies/CompanyHero";
import ProjectCard from "@/components/companies/ProjectCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: developer } = await supabase
    .from("developers")
    .select("name, name_en, description_ar, description_en, logo_url, cover_image_url")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!developer) return {};

  const name = isAr ? developer.name : developer.name_en || developer.name;
  const description =
    (isAr ? developer.description_ar : developer.description_en) ||
    (isAr ? `تصفح كل مشاريع ${name} على عقار أونلاين` : `Browse all projects by ${name} on Aqar Online`);

  return {
    title: isAr ? `${name} | عقار أونلاين` : `${name} | Aqar Online`,
    description,
    alternates: {
      canonical: `/${locale}/companies/${slug}`,
      languages: { ar: `/ar/companies/${slug}`, en: `/en/companies/${slug}` },
    },
    openGraph: {
      title: name,
      description,
      images: developer.cover_image_url ? [{ url: developer.cover_image_url }] : [],
    },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: developer } = await supabase
    .from("developers")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!developer) notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("developer_id", developer.id)
    .eq("status", "approved")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <CompanyHero developer={developer} isAr={isAr} />

      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <div className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border lg:sticky lg:top-28">
                <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-3">
                  {isAr ? "نبذة عن المطوّر" : "About the Developer"}
                </p>
                {(isAr ? developer.description_ar : developer.description_en) ? (
                  <p className="text-sm text-aura-muted font-light leading-relaxed whitespace-pre-line">
                    {isAr ? developer.description_ar : developer.description_en}
                  </p>
                ) : (
                  <p className="text-sm text-aura-muted/60 font-light italic">
                    {isAr ? "لا يوجد وصف مضاف بعد" : "No description added yet"}
                  </p>
                )}
                {developer.phone && (
                  
                    <a href={`tel:${developer.phone}`}
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all duration-300"
                    dir="ltr"
                  >
                    {developer.phone}
                  </a>
                )}
              </div>
            </aside>

            <div className="lg:col-span-9 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-light text-aura-dark mb-8">
                {isAr ? "مشاريع هذا المطوّر" : "Projects by this Developer"}
                <span className="text-aura-muted text-base font-light ms-2">({projects?.length || 0})</span>
              </h2>

              {!projects || projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-aura-card rounded-3xl border border-aura-border">
                  <p className="text-4xl">🏗️</p>
                  <p className="text-aura-muted font-light">
                    {isAr ? "لا توجد مشاريع منشورة بعد" : "No published projects yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isAr={isAr}
                      locale={locale}
                      companySlug={slug}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}