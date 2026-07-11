import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DeveloperHero from "@/components/developers/DeveloperHero";
import DeveloperPropertiesClient from "./DeveloperPropertiesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: partner } = await supabase
    .from("partners")
    .select("name, name_en, description_ar, description_en, logo_url, cover_image_url, active")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!partner) return {};

  const name = isAr ? partner.name : partner.name_en || partner.name;
  const description =
    (isAr ? partner.description_ar : partner.description_en) ||
    (isAr ? `تصفح كل عقارات ${name} على عقار أونلاين` : `Browse all properties by ${name} on Aqar Online`);

  return {
    title: isAr ? `${name} | عقار أونلاين` : `${name} | Aqar Online`,
    description,
    alternates: {
      canonical: `/${locale}/developers/${slug}`,
      languages: { ar: `/ar/developers/${slug}`, en: `/en/developers/${slug}` },
    },
    openGraph: {
      title: name,
      description,
      images: partner.cover_image_url
        ? [{ url: partner.cover_image_url }]
        : partner.logo_url
        ? [{ url: partner.logo_url }]
        : [],
    },
  };
}

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: partner } = await supabase
    .from("partners")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!partner) notFound();

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <DeveloperHero partner={partner} isAr={isAr} />
      <DeveloperPropertiesClient partner={partner} isAr={isAr} locale={locale} />
      <Footer />
    </main>
  );
}