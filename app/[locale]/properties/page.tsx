import type { Metadata } from "next";
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
      ? "شقق وفيلات للبيع والإيجار في مصر | تصفح كل العقارات | عقار أونلاين"
      : "Apartments & Villas for Sale & Rent in Egypt | Browse All Properties | Aqar Online",
    description: isAr
      ? "تصفح آلاف الشقق والفيلات والعقارات التجارية للبيع والإيجار في القاهرة والجيزة والساحل الشمالي وكل محافظات مصر — فلترة حسب السعر والمساحة وعدد الغرف"
      : "Browse thousands of apartments, villas, and commercial properties for sale and rent across Cairo, Giza, the North Coast, and all of Egypt — filter by price, area, and rooms",
    keywords: isAr
      ? ["شقق للبيع", "فيلات للبيع", "شقق للإيجار", "عقارات مصر", "شقق للبيع في القاهرة", "فيلات للبيع في مصر", "عقار أونلاين"]
      : ["apartments for sale Egypt", "villas for sale Egypt", "apartments for rent Cairo", "Egypt real estate listings"],
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
    },
  };
}

export default function PropertiesPage() {
  return <PropertiesClient />;
}