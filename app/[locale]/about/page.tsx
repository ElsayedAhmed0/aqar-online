import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "عن عقار أونلاين" : "About Aqar Online",
    description: isAr
      ? "تعرف على عقار أونلاين — المنصة العقارية الأولى في مصر بخبرة أكثر من 15 عاماً وأكثر من 1200 عميل راضٍ"
      : "Learn about Aqar Online — Egypt's leading real estate platform with 15+ years of experience and over 1,200 satisfied clients",
    keywords: isAr
      ? ["عن عقار أونلاين", "منصة عقارات مصر", "أفضل موقع عقارات في مصر", "شركة عقارات موثوقة", "عقار أونلاين"]
      : ["about Aqar Online", "Egypt real estate platform", "trusted real estate company", "Aqar Online"],
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        ar: "/ar/about",
        en: "/en/about",
      },
    },
    openGraph: {
      title: isAr ? "عن عقار أونلاين" : "About Aqar Online",
      description: isAr
        ? "منصة العقارات الأولى في مصر"
        : "Egypt's #1 Real Estate Platform",
      url: `https://www.aqqaronline.com/${locale}/about`,
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

export default function AboutPage() {
  return <AboutClient />;
}