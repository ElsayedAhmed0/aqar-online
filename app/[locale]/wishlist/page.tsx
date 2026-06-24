import type { Metadata } from "next";
import WishlistClient from "./WishlistClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "العقارات المحفوظة" : "Saved Properties",
    description: isAr
      ? "عقاراتك المفضلة في مكان واحد"
      : "Your saved properties in one place",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/wishlist`,
      languages: { ar: "/ar/wishlist", en: "/en/wishlist" },
    },
  };
}

export default function WishlistPage() {
  return <WishlistClient />;
}