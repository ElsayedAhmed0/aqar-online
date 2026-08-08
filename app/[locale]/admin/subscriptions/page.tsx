"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Subscription = {
  id: string;
  user_id: string;
  package_id: string;
  status: "pending" | "active" | "expired" | "rejected";
  duration_days: number;
  requested_at: string;
  activated_at: string | null;
  expires_at: string | null;
};

type Pkg = {
  id: string;
  name_ar: string;
  name_en: string | null;
};

type Profile = {
  id: string;
  full_name: string | null;
};

export default function SubscriptionsAdminPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [checked, setChecked] = useState(false);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [packages, setPackages] = useState<Record<string, Pkg>>({});
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "expired" | "rejected">("pending");

  const load = async () => {
    const supabase = createClient();
    const { data: subsData } = await supabase
      .from("subscriptions")
      .select("*")
      .order("requested_at", { ascending: false });

    if (subsData) {
      setSubs(subsData);
      const initialDurations: Record<string, number> = {};
      subsData.forEach((s) => { initialDurations[s.id] = s.duration_days || 30; });
      setDurations(initialDurations);

      const userIds = Array.from(new Set(subsData.map((s) => s.user_id)));
      const packageIds = Array.from(new Set(subsData.map((s) => s.package_id)));

      const { data: profilesData } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
      const profileMap: Record<string, Profile> = {};
      (profilesData || []).forEach((p: any) => { profileMap[p.id] = p; });
      setProfiles(profileMap);

      const { data: packagesData } = await supabase.from("packages").select("id, name_ar, name_en").in("id", packageIds);
      const pkgMap: Record<string, Pkg> = {};
      (packagesData || []).forEach((p: any) => { pkgMap[p.id] = p; });
      setPackages(pkgMap);
    }
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

  const handleActivate = async (sub: Subscription) => {
    setBusyId(sub.id);
    const supabase = createClient();
    const now = new Date();
    const duration = durations[sub.id] || 30;
    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        activated_at: now.toISOString(),
        duration_days: duration,
        expires_at: new Date(now.getTime() + duration * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", sub.id);
    setBusyId(null);
    load();
  };

  const handleReject = async (sub: Subscription) => {
    setBusyId(sub.id);
    const supabase = createClient();
    await supabase.from("subscriptions").update({ status: "rejected" }).eq("id", sub.id);
    setBusyId(null);
    load();
  };

  const handleCancel = async (sub: Subscription) => {
    if (!confirm(isAr ? "متأكد إنك عايز تلغي اشتراك العميل ده دلوقتي؟ هيرجع فورًا للباقة المجانية." : "Are you sure you want to cancel this member's subscription now? They'll immediately revert to the free plan.")) return;
    setBusyId(sub.id);
    const supabase = createClient();
    await supabase
      .from("subscriptions")
      .update({ status: "expired", expires_at: new Date().toISOString() })
      .eq("id", sub.id);
    setBusyId(null);
    load();
  };

  const statusLabel = (status: string) => {
    if (status === "pending") return isAr ? "قيد الانتظار" : "Pending";
    if (status === "active") return isAr ? "مفعّل" : "Active";
    if (status === "expired") return isAr ? "منتهي" : "Expired";
    return isAr ? "مرفوض" : "Rejected";
  };

  const statusColor = (status: string) => {
    if (status === "pending") return "bg-amber-50 text-amber-600";
    if (status === "active") return "bg-green-50 text-green-600";
    if (status === "expired") return "bg-aura-canvas text-aura-muted";
    return "bg-red-50 text-red-500";
  };

  const filteredSubs = filter === "all" ? subs : subs.filter((s) => s.status === filter);

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
          {isAr ? "طلبات الاشتراك في الباقات" : "Package Subscription Requests"}
        </h1>
        <p className="text-sm text-aura-muted mb-8">
          {isAr ? `إجمالي الطلبات: ${subs.length}` : `Total requests: ${subs.length}`}
        </p>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(["pending", "active", "expired", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === f ? "bg-aura-dark text-white" : "bg-aura-card border border-aura-border text-aura-muted"}`}
            >
              {f === "all" ? (isAr ? "الكل" : "All") : statusLabel(f)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredSubs.length === 0 && (
            <p className="text-center text-aura-muted py-12">{isAr ? "لا توجد طلبات" : "No requests"}</p>
          )}
          {filteredSubs.map((sub) => {
            const profile = profiles[sub.user_id];
            const pkg = packages[sub.package_id];
            return (
              <div key={sub.id} className="bg-aura-card border border-aura-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium text-aura-dark">{profile?.full_name || sub.user_id}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(sub.status)}`}>
                      {statusLabel(sub.status)}
                    </span>
                  </div>
                  <p className="text-xs text-aura-muted">
                    {isAr ? "الباقة:" : "Package:"} {pkg ? (isAr ? pkg.name_ar : (pkg.name_en || pkg.name_ar)) : sub.package_id}
                  </p>
                  <p className="text-[11px] text-aura-muted mt-1">
                    {isAr ? "تاريخ الطلب:" : "Requested:"} {new Date(sub.requested_at).toLocaleString(isAr ? "ar-EG" : "en-US")}
                  </p>
                  {sub.status === "active" && sub.expires_at && (
                    <p className="text-[11px] text-green-600 mt-1">
                      {isAr ? "ينتهي في:" : "Expires:"} {new Date(sub.expires_at).toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                    </p>
                  )}
                </div>

                {sub.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-aura-muted">{isAr ? "المدة (أيام)" : "Duration (days)"}</label>
                      <input
                        type="number"
                        min={1}
                        value={durations[sub.id] ?? 30}
                        onChange={(e) => setDurations((prev) => ({ ...prev, [sub.id]: Number(e.target.value) }))}
                        className="w-20 px-2 py-1.5 rounded-lg border border-aura-border text-sm text-center outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleActivate(sub)}
                      disabled={busyId === sub.id}
                      className="px-4 py-2 rounded-xl bg-aura-accent text-white text-xs font-medium hover:bg-aura-dark transition-all disabled:opacity-50"
                    >
                      {isAr ? "تفعيل" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleReject(sub)}
                      disabled={busyId === sub.id}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      {isAr ? "رفض" : "Reject"}
                    </button>
                  </div>
                )}

                {sub.status === "active" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCancel(sub)}
                      disabled={busyId === sub.id}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      {isAr ? "إلغاء الاشتراك" : "Cancel Subscription"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}