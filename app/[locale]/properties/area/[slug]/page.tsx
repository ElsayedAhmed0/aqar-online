import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAreaBySlug } from "@/lib/data/areas";
import AreaClient from "./AreaClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const area = getAreaBySlug(slug);

  if (!area) return {};

  const title = isAr
    ? `شقق وفيلات للبيع والإيجار في ${area.ar}`
    : `Apartments & Villas for Sale & Rent in ${area.en}`;

  const description = isAr
    ? `تصفح أحدث الشقق والفيلات والعقارات التجارية للبيع والإيجار في ${area.ar}. فلترة حسب السعر والمساحة وعدد الغرف، وتواصل مباشر مع أصحاب الإعلانات.`
    : `Browse the latest apartments, villas, and commercial properties for sale and rent in ${area.en}. Filter by price, area, and rooms, with direct contact to listing owners.`;

  return {
    title,
    description,
    keywords: isAr
      ? [`شقق للبيع في ${area.ar}`, `فيلات للبيع في ${area.ar}`, `شقق للإيجار في ${area.ar}`, `عقارات ${area.ar}`, "عقار أونلاين"]
      : [`apartments for sale in ${area.en}`, `villas for sale in ${area.en}`, `real estate ${area.en}`, "Aqar Online"],
    alternates: {
      canonical: `/${locale}/properties/area/${slug}`,
      languages: {
        ar: `/ar/properties/area/${slug}`,
        en: `/en/properties/area/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.aqqaronline.com/${locale}/properties/area/${slug}`,
      siteName: isAr ? "عقار أونلاين" : "Aqar Online",
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
      images: [{
        url: "https://res.cloudinary.com/de6itr3fm/image/upload/v1783724293/aqar-online/u37lefl0abg9obkfrvmy.jpg",
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);

  if (!area) notFound();

  return <AreaClient area={area} />;
}