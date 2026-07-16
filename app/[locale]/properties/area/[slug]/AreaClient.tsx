"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertiesGrid from "@/components/properties/PropertiesGrid";
import type { Area } from "@/lib/data/areas";

const ITEMS_PER_PAGE = 9;

export default function AreaClient({ area }: { area: Area }) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const supabase = createClient();

      const from = (page - 1) * ITEMS_PER_PAGE;
      const { data, count } = await supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("status", "approved")
        .eq("location_ar", area.ar)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, from + ITEMS_PER_PAGE - 1);

      if (data) setProperties(data);
      if (count !== null) setTotal(count);
      setLoading(false);
    };
    fetch();
  }, [page, area.ar]);

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8 md:mb-10">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "تصفح العقارات" : "Browse Properties"}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark mb-3">
              {isAr ? "شقق وفيلات للبيع والإيجار في " : "Apartments & Villas for Sale & Rent in "}
              <span className="font-serif italic text-aura-accent">{isAr ? area.ar : area.en}</span>
            </h1>
            <p className="text-aura-muted text-sm max-w-2xl">
              {isAr
                ? `تصفح أحدث العروض من الشقق والفيلات والعقارات التجارية للبيع والإيجار في ${area.ar}، مع إمكانية التواصل المباشر مع أصحاب الإعلانات.`
                : `Browse the latest apartments, villas, and commercial properties for sale and rent in ${area.en}, with direct contact to listing owners.`}
            </p>
          </div>

          <PropertiesGrid
            properties={properties}
            loading={loading}
            isAr={isAr}
            locale={locale}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onClearFilters={() => {}}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}