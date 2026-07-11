import type { Metadata } from "next";
import { Readex_Pro, Playfair_Display, Reem_Kufi } from "next/font/google";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { WishlistProvider } from "@/context/WishlistContext";
import { FilterProvider } from "@/context/FilterContext";
import { AuthProvider } from "@/context/AuthContext";
import { ListingsProvider } from "@/context/ListingsContext";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const readex = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-readex",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-reem-kufi",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aqqaronline.com"),
  title: {
    default: "عقار أونلاين | Aqar Online",
    template: "%s | عقار أونلاين",
  },
  description: "منصة العقارات الأولى في مصر — اكتشف آلاف العقارات المميزة",
  other: {
    google: "notranslate",
  },
  verification: {
    google: "TyKS8blYgP3M25I",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
      translate="no"
    >
      <body
        className={`${readex.variable} ${playfair.variable} ${reemKufi.variable} font-sans bg-aura-bg text-aura-dark antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          <ListingsProvider>
            <WishlistProvider>
              <FilterProvider>
                <NextIntlClientProvider messages={messages}>
                  {children}
                  <Analytics />
                </NextIntlClientProvider>
              </FilterProvider>
            </WishlistProvider>
          </ListingsProvider>
        </AuthProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ELHZ6MJKM0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELHZ6MJKM0');
          `}
        </Script>
      </body>
    </html>
  );
}