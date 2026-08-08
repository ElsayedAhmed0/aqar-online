"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { PACKAGES_SYSTEM_ENABLED } from "@/lib/featureFlags";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HiOutlineCheck } from "react-icons/hi2";

type Pkg = {
  id: string;
  name_ar: string;
  name_en: string | null;
  price_label: string;
  features_ar: string[];
  features_en: string[];
  max_listings: number;
  max_featured: number;
  is_free: boolean;
  featured: boolean;
};

export default function PackagesClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  useEffect(() => {
    if (!PACKAGES_SYSTEM_ENABLED) router.push(`/${locale}`);
  }, [locale, router]);
  const { user } = useAuth();

  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<{ packageId: string; daysLeft: number } | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("packages")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (data) setPackages(data);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadActiveSub = async () => {
      const supabase = createClient();
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("package_id, activated_at, duration_days")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("activated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sub && sub.activated_at) {
        const activatedAt = new Date(sub.activated_at);
        const durationDays = sub.duration_days || 30;
        const expiresAt = new Date(activatedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
        const now = new Date();
        if (now < expiresAt) {
          const daysLeft = Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
          setActiveSub({ packageId: sub.package_id, daysLeft });
        }
      }
    };
    loadActiveSub();
  }, [user]);

  const handleSubscribe = async (pkg: Pkg) => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    setRequesting(pkg.id);
    const supabase = createClient();

    await supabase.from("subscriptions").insert({
      user_id: user.id,
      package_id: pkg.id,
      status: "pending",
    });

    const pkgName = isAr ? pkg.name_ar : (pkg.name_en || pkg.name_ar);
    await supabase.from("support_messages").insert({
      user_id: user.id,
      sender: "user",
      message: isAr
        ? `مرحبًا، أرغب في الاشتراك في باقة "${pkgName}". برجاء إبلاغي بالسعر النهائي وطريقة الدفع.`
        : `Hi, I'd like to subscribe to the "${pkgName}" package. Please let me know the final price and payment method.`,
    });

    setRequesting(null);
    window.dispatchEvent(new CustomEvent("open-support-chat"));
  };

  if (!PACKAGES_SYSTEM_ENABLED) return null;

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />

      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
              {isAr ? "باقات الاشتراك" : "Subscription Plans"}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-aura-dark">
              {isAr ? "اختار الباقة اللي تناسبك" : "Choose the Plan That Fits You"}
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => {
                const features = isAr ? pkg.features_ar : pkg.features_en;
                const isCurrent = activeSub?.packageId === pkg.id;
                const isDefaultFree = pkg.is_free && !activeSub;
                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-3xl border-2 p-6 md:p-8 flex flex-col ${isCurrent ? "border-green-500 bg-green-50/50 shadow-lg" : pkg.featured ? "border-aura-accent bg-aura-accent/5 shadow-lg" : "border-aura-border bg-aura-card"}`}
                  >
                    {isCurrent ? (
                      <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-medium">
                        {isAr ? "باقتك الحالية" : "Your Current Plan"}
                      </span>
                    ) : pkg.featured && (
                      <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-aura-accent text-white text-[10px] font-medium">
                        {isAr ? "الأكثر طلبًا" : "Most Popular"}
                      </span>
                    )}
                    <h3 className="text-lg font-medium text-aura-dark mb-1">
                      {isAr ? pkg.name_ar : (pkg.name_en || pkg.name_ar)}
                    </h3>
                    <p className="text-2xl font-light text-aura-accent mb-5">{pkg.price_label}</p>
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-aura-muted">
                          <HiOutlineCheck className="w-4 h-4 text-aura-accent shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <div className="w-full py-3 rounded-2xl bg-green-500/10 text-center">
                        <p className="text-sm font-medium text-green-700 mb-0.5">
                          {isAr ? "باقتك الحالية" : "Your Current Plan"}
                        </p>
                        <p className="text-xs text-green-600">
                          {isAr ? `متبقي ${activeSub!.daysLeft} يوم` : `${activeSub!.daysLeft} days remaining`}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(pkg)}
                        disabled={isDefaultFree || requesting === pkg.id}
                        className={`w-full py-3 rounded-2xl text-sm font-medium transition-all duration-300 disabled:opacity-50 ${pkg.featured ? "bg-aura-accent text-white hover:bg-aura-dark" : "bg-aura-canvas text-aura-dark hover:bg-aura-accent hover:text-white"}`}
                      >
                        {isDefaultFree
                          ? (isAr ? "باقتك الحالية" : "Your Current Plan")
                          : requesting === pkg.id
                          ? (isAr ? "جاري الطلب..." : "Requesting...")
                          : (isAr ? "اشترك الآن" : "Subscribe Now")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}