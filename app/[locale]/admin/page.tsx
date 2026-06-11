"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineClock,
    HiOutlineEye,
    HiOutlineMapPin,
} from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";

type Listing = {
    id: string;
    title_ar: string;
    title_en: string;
    location_ar: string;
    location_en: string;
    price: number;
    type: string;
    beds: number;
    baths: number;
    area: number;
    images: string[];
    status: "pending" | "approved" | "rejected";
    created_at: string;
    user_id: string;
    profiles?: { full_name: string; email: string; phone: string };
};

const statusConfig = {
    pending: { ar: "انتظار", en: "Pending", cls: "bg-amber-50 text-amber-600 border-amber-200" },
    approved: { ar: "موافق عليه", en: "Approved", cls: "bg-green-50 text-green-600 border-green-200" },
    rejected: { ar: "مرفوض", en: "Rejected", cls: "bg-red-50 text-red-500 border-red-200" },
};

export default function AdminPage() {
    const locale = useLocale();
    const isAr = locale === "ar";
    const router = useRouter();
    const { user, loading } = useAuth();

    const [listings, setListings] = useState<Listing[]>([]);
    const [fetching, setFetching] = useState(true);
    const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
    const [updating, setUpdating] = useState<string | null>(null);

    // التحقق من صلاحية الأدمن
    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push(`/${locale}/login`);
            return;
        }

        const checkAdmin = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            // لو مفيش data أو الـ role مش admin
            if (!data || data.role !== "admin") {
                router.push(`/${locale}`);
            } else {
                // هو أدمن — جيب الإعلانات
                const { data: listingsData } = await supabase
                    .from("listings")
                    .select("*, profiles(full_name, email, phone)")
                    .order("created_at", { ascending: false });

                if (listingsData) setListings(listingsData as Listing[]);
                setFetching(false);
            }
        };

        checkAdmin();
    }, [user, loading]);

   

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        setUpdating(id);
        const supabase = createClient();

        const { error } = await supabase
            .from("listings")
            .update({ status })
            .eq("id", id);

        if (!error) {
            setListings((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status } : l))
            );
        }
        setUpdating(null);
    };

    const filtered = listings.filter((l) => l.status === activeTab);

    const formatPrice = (price: number) =>
        isAr
            ? `${(price / 1000000).toFixed(1)} مليون`
            : `EGP ${(price / 1000000).toFixed(1)}M`;

    if (loading || fetching) {
        return (
            <main className="min-h-screen bg-aura-bg">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-aura-bg">
            <Navbar />

            <section className="py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">

                    {/* العنوان */}
                    <div className="mb-10">
                        <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
                            {isAr ? "لوحة الإدارة" : "Admin Panel"}
                        </p>
                        <h1 className="text-4xl font-light text-aura-dark">
                            {isAr ? "مراجعة" : "Review"}
                            <span className="block font-serif italic text-aura-accent mt-1">
                                {isAr ? "الإعلانات" : "Listings"}
                            </span>
                        </h1>
                    </div>

                    {/* إحصائيات سريعة */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {(["pending", "approved", "rejected"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setActiveTab(s)}
                                className={`p-4 rounded-2xl border text-center transition-all duration-300 ${activeTab === s
                                        ? "bg-aura-dark text-white border-aura-dark"
                                        : "bg-aura-card border-aura-border hover:border-aura-accent"
                                    }`}
                            >
                                <p className="text-2xl font-light">
                                    {listings.filter((l) => l.status === s).length}
                                </p>
                                <p className="text-xs mt-1 opacity-70">
                                    {isAr ? statusConfig[s].ar : statusConfig[s].en}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* الإعلانات */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-aura-card rounded-3xl border border-aura-border">
                            <HiOutlineClock className="w-12 h-12 text-aura-accent/30" />
                            <p className="text-aura-muted font-light">
                                {isAr ? "لا توجد إعلانات" : "No listings"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border"
                                >
                                    {/* الصورة */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={listing.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
                                            alt={listing.title_en}
                                            className="w-full h-full object-cover img-hover"
                                        />
                                        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                                            {formatPrice(listing.price)}
                                        </div>
                                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-medium ${statusConfig[listing.status].cls}`}>
                                            {isAr ? statusConfig[listing.status].ar : statusConfig[listing.status].en}
                                        </span>
                                    </div>

                                    {/* المحتوى */}
                                    <div className="p-5">
                                        <h3 className="text-sm font-medium text-aura-dark mb-1 leading-snug">
                                            {isAr ? listing.title_ar : listing.title_en}
                                        </h3>

                                        <div className="flex items-center gap-1.5 text-aura-muted mb-3">
                                            <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
                                            <span className="text-xs">
                                                {isAr ? listing.location_ar : listing.location_en}
                                            </span>
                                        </div>

                                        {/* بيانات المستخدم */}
                                        {listing.profiles && (
                                            <div className="px-3 py-2 rounded-xl bg-aura-canvas border border-aura-border mb-3">
                                                <p className="text-xs font-medium text-aura-dark">
                                                    {listing.profiles.full_name}
                                                </p>
                                                <p className="text-[10px] text-aura-muted">
                                                    {listing.profiles.email}
                                                </p>
                                                {listing.profiles.phone && (
                                                    <p className="text-[10px] text-aura-muted">
                                                        {listing.profiles.phone}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* الخصائص */}
                                        <div className="flex items-center gap-3 text-aura-muted mb-4">
                                            {listing.beds > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <LuBedDouble className="w-3.5 h-3.5" />
                                                    <span className="text-xs">{listing.beds}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <LuBath className="w-3.5 h-3.5" />
                                                <span className="text-xs">{listing.baths}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <LuMaximize className="w-3.5 h-3.5" />
                                                <span className="text-xs">{listing.area} {isAr ? "م²" : "m²"}</span>
                                            </div>
                                        </div>

                                        {/* أزرار الموافقة والرفض */}
                                        {listing.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(listing.id, "approved")}
                                                    disabled={updating === listing.id}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-50 text-green-600 border border-green-200 text-xs font-medium hover:bg-green-100 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    <HiOutlineCheckCircle className="w-4 h-4" />
                                                    {isAr ? "موافقة" : "Approve"}
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(listing.id, "rejected")}
                                                    disabled={updating === listing.id}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-red-500 border border-red-200 text-xs font-medium hover:bg-red-100 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    <HiOutlineXCircle className="w-4 h-4" />
                                                    {isAr ? "رفض" : "Reject"}
                                                </button>
                                            </div>
                                        )}

                                        {/* لو approved أو rejected */}
                                        {listing.status !== "pending" && (
                                            <button
                                                onClick={() => updateStatus(listing.id, listing.status === "approved" ? "rejected" : "approved")}
                                                disabled={updating === listing.id}
                                                className="w-full py-2.5 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark transition-all duration-300 disabled:opacity-50"
                                            >
                                                {listing.status === "approved"
                                                    ? (isAr ? "إلغاء الموافقة" : "Revoke Approval")
                                                    : (isAr ? "إعادة النظر" : "Reconsider")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}