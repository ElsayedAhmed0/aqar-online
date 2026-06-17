import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyGallery from "@/components/properties/PropertyGallery";
import BookingForm from "@/components/properties/BookingForm";
import SimilarProperties from "@/components/properties/SimilarProperties";
// import MortgageCalculator from "@/components/properties/MortgageCalculator";
import PropertyFeatures from "@/components/properties/PropertyFeatures";
import PropertyInfo from "@/components/properties/PropertyInfo";
import ContactCard from "@/components/properties/ContactCard";


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
    .eq("status", "approved")
    .single();

  if (!property) notFound();

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

        {/* العنوان */}
        <div className="mb-8">

          <a
            href={`/${locale}`}
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

        {/* معرض الصور */}
        <PropertyGallery images={property.images || []} />

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

          {/* اليمين — المعلومات والمميزات */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyInfo property={property} isAr={isAr} />
            <PropertyFeatures property={property} isAr={isAr} />
            {/* <MortgageCalculator price={property.price} isAr={isAr} /> */}
          </div>

          {/* اليسار — حجز موعد */}
          <div className="lg:col-span-1">
            <ContactCard property={property} isAr={isAr} />
          </div>

        </div>

        {/* عقارات مشابهة */}
        {similar && similar.length > 0 && (
          <SimilarProperties properties={similar} isAr={isAr} locale={locale} />
        )}

      </div>

      <Footer />
    </main>
  );
}