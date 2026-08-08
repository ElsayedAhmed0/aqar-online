import type { Metadata } from "next";
import ContactSection from "@/components/home/ContactSection";
import Navbar from "@/components/layout/Navbar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "اتصل بنا" : "Contact Us",
    description: isAr
      ? "تواصل مع فريق عقار أونلاين — نحن في التجمع الخامس، القاهرة. فريقنا جاهز لمساعدتك في إيجاد عقارك المثالي"
      : "Get in touch with the Aqar Online team — located in New Cairo. Our team is ready to help you find your perfect property",
    keywords: isAr
      ? ["اتصل بعقار أونلاين", "تواصل معنا", "خدمة عملاء عقارية", "عقار أونلاين"]
      : ["contact Aqar Online", "get in touch", "real estate customer support", "Aqar Online"],
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        ar: "/ar/contact",
        en: "/en/contact",
      },
    },
    openGraph: {
      title: isAr ? "اتصل بنا | عقار أونلاين" : "Contact Us | Aqar Online",
      description: isAr
        ? "تواصل مع فريق عقار أونلاين"
        : "Get in touch with the Aqar Online team",
      url: `https://www.aqqaronline.com/${locale}/contact`,
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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <ContactSection />
    </main>
  );
}