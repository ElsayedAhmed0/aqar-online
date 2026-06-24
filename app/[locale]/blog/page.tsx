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
    },
  };
}

export default function BlogPage() {
  return <BlogClient />;
}