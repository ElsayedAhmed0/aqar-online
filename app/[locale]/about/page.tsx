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
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}