"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Listing = {
  id: string;
  title_ar: string;
  title_en: string;
  location_ar: string;
  price: number;
  archived: boolean;
  cycle_start_at: string;
  created_at: string;
};

export default function ArchiveAdminPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [checked, setChecked] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data } = await supabase
      .from("listings")
      .select("id, title_ar, title_en, location_ar, price, archived, cycle_start_at, created_at")
      .or(`archived.eq.true,cycle_start_at.lt.${ninetyDaysAgo}`)
      .order("cycle_start_at", { ascending: true });

    if (data) setListings(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(`/${locale}/login`); return; }

    const checkAndLoad = async () => {
      const supabase = createClient();
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!profile || (profile.role !== "admin" && profile.role !== "subadmin")) {
        router.push(`/${locale}`);
        return;
      }
      setChecked(true);
      await load();
    };
    checkAndLoad();
  }, [user, authLoading, locale, router]);

  const handleRestore = async (id: string) => {
    setBusyId(id);
    const supabase = createClient();
    await supabase
      .from("listings")
      .update({ archived: false, cycle_start_at: new Date().toISOString() })
      .eq("id", id);
    setBusyId(null);
    load();
  };

  const handleDeletePermanently = async (id: string) => {
    if (!confirm(isAr ? "متأكد إنك عايز تحذف الإعلان ده نهائيًا؟ الخطوة دي مش قابلة للتراجع." : "Are you sure you want to permanently delete this listing? This cannot be undone.")) return;
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", id);
    setBusyId(null);
    load();
  };

  if (!checked || loading) {
    return (
      <main className="min-h-screen bg-aura-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-2xl font-light text-aura-dark mb-2">
          {isAr ? "أرشيف الإعلانات" : "Listings Archive"}
        </h1>
        <p className="text-sm text-aura-muted mb-8">
          {isAr
            ? "إعلانات اختفت تلقائيًا من الموقع (عمرها أكتر من 90 يوم) أو تمت أرشفتها يدويًا"
            : "Listings that auto-expired (90+ days old) or were manually archived"}
        </p>

        <div className="space-y-3">
          {listings.length === 0 && (
            <p className="text-center text-aura-muted py-12">{isAr ? "الأرشيف فاضي دلوقتي" : "Archive is empty"}</p>
          )}
          {listings.map((l) => (
            <div key={l.id} className="bg-aura-card border border-aura-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-aura-dark truncate">{isAr ? l.title_ar : (l.title_en || l.title_ar)}</p>
                <p className="text-xs text-aura-muted">{l.location_ar} — {l.price?.toLocaleString()} EGP</p>
                <p className="text-[11px] text-aura-muted mt-1">
                  {isAr ? "بداية الدورة:" : "Cycle start:"} {new Date(l.cycle_start_at || l.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                  {l.archived && <span className="mr-2 text-amber-600">({isAr ? "أرشفة يدوية" : "manually archived"})</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleRestore(l.id)}
                  disabled={busyId === l.id}
                  className="px-4 py-2 rounded-xl bg-aura-accent text-white text-xs font-medium hover:bg-aura-dark transition-all disabled:opacity-50"
                >
                  {isAr ? "إرجاع للموقع" : "Restore"}
                </button>
                <button
                  onClick={() => handleDeletePermanently(l.id)}
                  disabled={busyId === l.id}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                >
                  {isAr ? "حذف نهائي" : "Delete Permanently"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}