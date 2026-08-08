import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "المدونة العقارية" : "Real Estate Blog",
    description: isAr
      ? "أحدث المقالات والنصائح العقارية — اتجاهات السوق، نصائح الشراء، دليل الاستثمار العقاري في مصر"
      : "Latest real estate articles and tips — market trends, buying guides, and investment advice for Egypt's property market",
    keywords: isAr
      ? ["مدونة عقارية", "نصائح شراء عقار", "استثمار عقاري في مصر", "اتجاهات سوق العقارات", "دليل شراء شقة", "دليل شراء فيلا", "أخبار العقارات في مصر", "عقار أونلاين"]
      : ["real estate blog", "property buying tips", "Egypt real estate investment", "property market trends", "Aqar Online"],
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { ar: "/ar/blog", en: "/en/blog" },
    },
    openGraph: {
      title: isAr ? "المدونة العقارية | عقار أونلاين" : "Real Estate Blog | Aqar Online",
      description: isAr ? "أحدث المقالات والنصائح العقارية" : "Latest real estate articles and tips",
      url: `https://www.aqqaronline.com/${locale}/blog`,
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

export default function BlogPage() {
  return <BlogClient />;
}