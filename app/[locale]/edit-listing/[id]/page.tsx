"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EditListingForm from "@/components/listings/EditListingForm";
import type { UserListing } from "@/lib/types/listing";

export default function EditListingPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  const { user, loading: authLoading } = useAuth();
  const [listing, setListing] = useState<UserListing | null>(null);
  const [fetching, setFetching] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push(`/${locale}/login`);
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (!user) return;

    const fetchListing = async () => {
      setFetching(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .eq("user_id", user.id) // ✅ الحماية الأساسية: يجيبه بس لو ملك المستخدم الحالي
        .single();

      if (error || !data) {
        setForbidden(true);
        setFetching(false);
        return;
      }

      setListing({
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        type: data.type,
        purpose: data.purpose || "sale",
        title_ar: data.title_ar,
        title_en: data.title_en,
        description_ar: data.description_ar || "",
        description_en: data.description_en || "",
        location_ar: data.location_ar || "",
        location_en: data.location_en || "",
        price: data.price,
        beds: data.beds || 0,
        baths: data.baths || 0,
        area: data.area || 0,
        img: data.images?.[0] || "",
        images: data.images || [],
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        featured: data.featured || false,
        status: data.status,
        negotiable: data.negotiable || false,
        features: data.features || [],
        delivery_status: data.delivery_status || "ready",
        views: data.views || 0,
        show_views: data.show_views || false,
      });
      setFetching(false);
    };

    fetchListing();
  }, [user, listingId]);

  if (authLoading || !user || fetching) {
    return (
      <main className="min-h-screen bg-aura-bg">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (forbidden || !listing) {
    return (
      <main className="min-h-screen bg-aura-bg">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-6">
          <p className="text-4xl">🚫</p>
          <p className="text-aura-dark font-medium">
            {isAr ? "الإعلان ده مش موجود أو مش ليك" : "This listing doesn't exist or isn't yours"}
          </p>
          <a href={`/${locale}/dashboard`} className="px-6 py-2.5 rounded-full bg-aura-accent text-white text-sm font-medium">
            {isAr ? "الرجوع للوحة التحكم" : "Back to Dashboard"}
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "تعديل الإعلان" : "Edit Listing"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-light text-aura-dark">
              {isAr ? "عدّل بيانات" : "Edit"}
              <span className="block font-serif italic text-aura-accent mt-1">
                {isAr ? "إعلانك" : "Your Listing"}
              </span>
            </h1>
          </div>

          <EditListingForm listing={listing} />
        </div>
      </section>
      <Footer />
    </main>
  );
}