import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyGallery from "@/components/properties/PropertyGallery";
import SimilarProperties from "@/components/properties/SimilarProperties";
import PropertyFeatures from "@/components/properties/PropertyFeatures";
import PropertyInfo from "@/components/properties/PropertyInfo";
import ContactCard from "@/components/properties/ContactCard";
import FeaturedBanner from "../FeaturedBanner";
export const dynamic = "force-dynamic";
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
    title: title,
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

   await supabase.rpc("increment_listing_views", { listing_id: id });

  const { data: similar } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "approved")
    .eq("type", property.type)
    .neq("id", id)
    .limit(3);

  const isAr = locale === "ar";
  const title = isAr ? property.title_ar : property.title_en;
  const location = isAr ? property.location_ar : property.location_en;

  // Structured Data JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description: isAr
      ? `${title} في ${location}`
      : `${title} in ${location}`,
    url: `https://www.aqqaronline.com/${locale}/properties/${id}`,
    image: property.images?.[0] || "",
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: "EG",
    },
    floorSize: property.area
      ? {
          "@type": "QuantitativeValue",
          value: property.area,
          unitCode: "MTK",
        }
      : undefined,
    numberOfRooms: property.beds || undefined,
    provider: {
      "@type": "Organization",
      name: "عقار أونلاين | Aqar Online",
      url: "https://www.aqqaronline.com",
    },
  };

  return (
    <main className="min-h-screen bg-aura-bg">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-8">
          
            <a href={`/${locale}`}
            className="flex items-center gap-2 text-xs text-aura-muted hover:text-aura-accent transition-colors mb-6 w-fit"
          >
            ← {isAr ? "العودة للرئيسية" : "Back to Home"}
          </a>
          <h1 className="text-4xl md:text-5xl font-light text-aura-dark">
            {title}
          </h1>
          <p className="text-aura-muted text-sm mt-2">{location}</p>
        </div>

        <FeaturedBanner property={property} isAr={isAr} />
        <PropertyGallery images={property.images || []} title={title} />

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