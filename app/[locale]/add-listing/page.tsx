import type { Metadata } from "next";
import AddListingClient from "./AddListingClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "أضف إعلانك مجاناً" : "Add Your Listing for Free",
    description: isAr
      ? "أعلن عن عقارك مجاناً على منصة عقار أونلاين — سريع وسهل وآمن، يظهر بعد مراجعة الفريق"
      : "List your property for free on Aqar Online — fast, easy, and secure. Goes live after team review",
    alternates: {
      canonical: `/${locale}/add-listing`,
      languages: { ar: "/ar/add-listing", en: "/en/add-listing" },
    },
    openGraph: {
      title: isAr ? "أضف إعلانك | عقار أونلاين" : "Add Listing | Aqar Online",
      description: isAr ? "أعلن عن عقارك مجاناً" : "List your property for free",
      url: `https://www.aqqaronline.com/${locale}/add-listing`,
      siteName: isAr ? "عقار أونلاين" : "Aqar Online",
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
    },
  };
}

export default function AddListingPage() {
  return <AddListingClient />;
}