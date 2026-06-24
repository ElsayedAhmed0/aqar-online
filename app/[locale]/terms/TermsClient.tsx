"use client";

import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { useSettings } from "@/lib/hooks/useSettings";

export default function TermsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { settings, loading } = useSettings();

  const content = isAr ? settings.terms_content_ar : settings.terms_content_en;

  return (
    <main className="min-h-screen bg-aura-bg" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-aura-accent/10 flex items-center justify-center shrink-0">
              <HiOutlineDocumentText className="w-6 h-6 text-aura-accent" />
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-1">
                {isAr ? "عقار أونلاين" : "Aqar Online"}
              </p>
              <h1 className="text-3xl font-light text-aura-dark">
                {isAr ? "الشروط والأحكام" : "Terms of Service"}
              </h1>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-aura-card border border-aura-border mb-10">
            <p className="text-xs text-aura-muted">
              {isAr
                ? `آخر تحديث: ${new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}`
                : `Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-aura-card border border-aura-border">
              <p className="text-sm text-aura-muted leading-relaxed whitespace-pre-wrap">
                {content || (isAr ? "لم يتم إضافة محتوى بعد" : "No content added yet")}
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}