import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyGallery from "@/components/properties/PropertyGallery";
import BookingForm from "@/components/properties/BookingForm";
import SimilarProperties from "@/components/properties/SimilarProperties";
import PropertyFeatures from "@/components/properties/PropertyFeatures";
import PropertyInfo from "@/components/properties/PropertyInfo";
import ContactCard from "@/components/properties/ContactCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const supabase = await createClient();
  const isAr = locale === "ar";

  const { data: property } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) return {};

  const title = isAr ? property.title_ar : property.title_en;
  const location = isAr ? property.location_ar : property.location_en;
  const description = isAr
    ? `${title} في ${location} — ${property.price?.toLocaleString()} جنيه`
    : `${title} in ${location} — EGP ${property.price?.toLocaleString()}`;

  return {
    title: isAr ? `${title} | عقار أونلاين` : `${title} | Aqar Online`,
    description,
    alternates: {
      canonical: `/${locale}/properties/${id}`,
      languages: {
        ar: `/ar/properties/${id}`,
        en: `/en/properties/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.aqqaronline.com/${locale}/properties/${id}`,
      siteName: isAr ? "عقار أونلاين" : "Aqar Online",
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
      images: property.images?.[0]
        ? [{ url: property.images[0], width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: property.images?.[0] ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) notFound();
  await supabase
    .from("listings")
    .update({ views: (property.views || 0) + 1 })
    .eq("id", id);
  const { data: similar } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "approved")
    .eq("type", property.type)
    .neq("id", id)
    .limit(3);

  const isAr = locale === "ar";

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-8">
          
           <a href={`/${locale}`}
            className="flex items-center gap-2 text-xs text-aura-muted hover:text-aura-accent transition-colors mb-6 w-fit"
          >
            ← {isAr ? "العودة للرئيسية" : "Back to Home"}
          </a>
          <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
            {isAr ? property.title_ar : property.title_en}
          </h1>
          <p className="text-aura-muted text-sm mt-2">
            {isAr ? property.location_ar : property.location_en}
          </p>
        </div>

        <PropertyGallery images={property.images || []} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-8">
            <PropertyInfo property={property} isAr={isAr} />
            <PropertyFeatures property={property} isAr={isAr} />
          </div>
          <div className="lg:col-span-1">
            <ContactCard property={property} isAr={isAr} />
          </div>
        </div>

        {similar && similar.length > 0 && (
          <SimilarProperties properties={similar} isAr={isAr} locale={locale} />
        )}
      </div>

      <Footer />
    </main>
  );
}