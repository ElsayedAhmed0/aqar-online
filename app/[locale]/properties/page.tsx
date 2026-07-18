import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PropertiesClient from "./PropertiesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
  ? "شقق وفيلات للبيع والإيجار في مصر | تصفح كل العقارات"
  : "Apartments & Villas for Sale & Rent in Egypt | Browse All Properties",
    description: isAr
      ? "تصفح آلاف الشقق والفيلات والعقارات التجارية للبيع والإيجار في القاهرة والجيزة والساحل الشمالي وكل محافظات مصر — فلترة حسب السعر والمساحة وعدد الغرف"
      : "Browse thousands of apartments, villas, and commercial properties for sale and rent across Cairo, Giza, the North Coast, and all of Egypt — filter by price, area, and rooms",
  keywords: isAr
      ? ["عقارات مصر", "شقق للبيع", "شقق للإيجار", "فلل للبيع", "فلل للإيجار", "عقارات القاهرة", "عقارات الجيزة", "عقارات التجمع الخامس", "عقارات الشيخ زايد", "عقارات العاصمة الإدارية", "عقارات الساحل الشمالي", "كمبوندات", "مشروعات عقارية", "مطورين عقاريين", "شركات عقارية", "عقار أونلاين"]
      : ["Egypt real estate", "apartments for sale", "villas Egypt", "Aqar Online"],
    alternates: {
      canonical: `/${locale}/properties`,
      languages: {
        ar: "/ar/properties",
        en: "/en/properties",
      },
    },
    openGraph: {
      title: isAr
        ? "شقق وفيلات للبيع والإيجار في مصر | عقار أونلاين"
        : "Apartments & Villas for Sale & Rent in Egypt | Aqar Online",
      description: isAr
        ? "تصفح آلاف العقارات للبيع والإيجار في كل محافظات مصر"
        : "Browse thousands of properties for sale and rent across Egypt",
      url: `https://www.aqqaronline.com/${locale}/properties`,
      siteName: isAr ? "عقار أونلاين" : "Aqar Online",
   locale: isAr ? "ar_EG" : "en_US",
      type: "website",
      images: [{
        url: "https://res.cloudinary.com/de6itr3fm/image/upload/v1783724293/aqar-online/u37lefl0abg9obkfrvmy.jpg",
        width: 1200,
        height: 630,
        alt: isAr ? "عقار أونلاين" : "Aqar Online",
      }],
    },
  };
}

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: initialProperties, count: initialTotal } = await supabase
    .from("listings")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(0, 8);

  return (
    <PropertiesClient
      initialProperties={initialProperties || []}
      initialTotal={initialTotal || 0}
    />
  );
}