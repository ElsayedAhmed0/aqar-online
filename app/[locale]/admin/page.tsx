"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock,
  HiOutlineMapPin, HiOutlineUserGroup, HiOutlineHome,
  HiOutlineMagnifyingGlass, HiOutlineArrowDownTray,
  HiOutlineCog6Tooth, HiOutlineCheckBadge, HiOutlineMegaphone,
  HiOutlinePhoto,
} from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

type Listing = {
  id: string; title_ar: string; title_en: string;
  location_ar: string; location_en: string; price: number;
  type: string; beds: number; baths: number; area: number;
  images: string[]; status: "pending" | "approved" | "rejected";
  created_at: string; user_id: string;
  profiles?: { full_name: string; email: string; phone: string };
};

type UserProfile = {
  id: string; full_name: string; email: string; phone: string;
  role: string; created_at: string; listings_count?: number;
};

type Ad = {
  id: string; title_ar: string; title_en: string;
  subtitle_ar: string; subtitle_en: string; badge_ar: string; badge_en: string;
  price: string; image_url: string; link: string; active: boolean; order_num: number;
};

const statusConfig = {
  pending:  { ar: "انتظار",     en: "Pending",  cls: "bg-amber-50 text-amber-600 border-amber-200" },
  approved: { ar: "موافق عليه", en: "Approved", cls: "bg-green-50 text-green-600 border-green-200" },
  rejected: { ar: "مرفوض",      en: "Rejected", cls: "bg-red-50 text-red-500 border-red-200"       },
};

const settingsGroups = [
  { title_ar: "معلومات الموقع", title_en: "Site Info", fields: [
    { key: "site_name_ar", label_ar: "اسم الموقع (عربي)",    label_en: "Site Name (Arabic)"  },
    { key: "site_name_en", label_ar: "اسم الموقع (إنجليزي)", label_en: "Site Name (English)" },
  ]},
  { title_ar: "قسم الهيرو", title_en: "Hero Section", fields: [
    { key: "hero_title_ar",    label_ar: "العنوان (عربي)",         label_en: "Hero Title (Arabic)"    },
    { key: "hero_title_en",    label_ar: "العنوان (إنجليزي)",       label_en: "Hero Title (English)"   },
    { key: "hero_subtitle_ar", label_ar: "الوصف (عربي)",           label_en: "Subtitle (Arabic)"      },
    { key: "hero_subtitle_en", label_ar: "الوصف (إنجليزي)",         label_en: "Subtitle (English)"     },
    { key: "hero_image",       label_ar: "رابط صورة الخلفية",      label_en: "Background Image URL"   },
  ]},
  { title_ar: "الإحصائيات", title_en: "Stats", fields: [
    { key: "stats_properties", label_ar: "عدد العقارات", label_en: "Properties Count"   },
    { key: "stats_clients",    label_ar: "عدد العملاء",  label_en: "Clients Count"       },
    { key: "stats_years",      label_ar: "سنوات الخبرة", label_en: "Years of Experience" },
  ]},
  { title_ar: "الفوتر", title_en: "Footer", fields: [
    { key: "footer_phone",      label_ar: "رقم الهاتف",        label_en: "Phone Number"          },
    { key: "footer_email",      label_ar: "البريد الإلكتروني", label_en: "Email Address"         },
    { key: "footer_address_ar", label_ar: "العنوان (عربي)",    label_en: "Address (Arabic)"      },
    { key: "footer_address_en", label_ar: "العنوان (إنجليزي)", label_en: "Address (English)"     },
    { key: "footer_desc_ar",    label_ar: "الوصف (عربي)",      label_en: "Description (Arabic)"  },
    { key: "footer_desc_en",    label_ar: "الوصف (إنجليزي)",   label_en: "Description (English)" },
  ]},
  { title_ar: "السوشيال ميديا", title_en: "Social Media", fields: [
    { key: "social_facebook",  label_ar: "فيسبوك (رابط)",  label_en: "Facebook (URL)"  },
    { key: "social_instagram", label_ar: "انستجرام (رابط)", label_en: "Instagram (URL)" },
    { key: "social_whatsapp",  label_ar: "واتساب (رابط)",   label_en: "WhatsApp (URL)"  },
    { key: "social_tiktok",    label_ar: "تيك توك (رابط)",  label_en: "TikTok (URL)"    },
  ]},
];

const emptyAd = { title_ar: "", title_en: "", subtitle_ar: "", subtitle_en: "", badge_ar: "", badge_en: "", price: "", image_url: "", link: "", order_num: "0" };

export default function AdminPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"listings" | "users" | "settings" | "ads">("listings");
  const [listingFilter, setListingFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [adForm, setAdForm] = useState(emptyAd);
  const [editingAd, setEditingAd] = useState<string | null>(null);
  const [savingAd, setSavingAd] = useState(false);
  const [uploadingAdImg, setUploadingAdImg] = useState(false);
  const [userFilter, setUserFilter] = useState<"all" | "admin" | "user">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push(`/${locale}/login`); return; }
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!data || data.role !== "admin") { router.push(`/${locale}`); return; }

      const { data: listingsData } = await supabase.from("listings").select("*, profiles(full_name, email, phone)").order("created_at", { ascending: false });
      if (listingsData) setListings(listingsData as Listing[]);

      const { data: usersData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (usersData) {
        const withCounts = await Promise.all(usersData.map(async (u) => {
          const { count } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("user_id", u.id);
          return { ...u, listings_count: count || 0 };
        }));
        setUsers(withCounts);
      }

      const { data: settingsData } = await supabase.from("site_settings").select("key, value");
      if (settingsData) {
        const mapped: Record<string, string> = {};
        settingsData.forEach((row) => { mapped[row.key] = row.value || ""; });
        setSiteSettings(mapped);
      }

      const { data: adsData } = await supabase.from("ads").select("*").order("order_num", { ascending: true });
      if (adsData) setAds(adsData as Ad[]);

      setFetching(false);
    };
    checkAdmin();
  }, [user, loading]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    const supabase = createClient();
    const { error } = await supabase.from("listings").update({ status }).eq("id", id);
    if (!error) setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setUpdating(null);
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const supabase = createClient();
    for (const [key, value] of Object.entries(siteSettings)) {
      await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
    }
    setSavingSettings(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const uploadAdImage = async (file: File): Promise<string | null> => {
    setUploadingAdImg(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `ad-images/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from("listings").upload(fileName, file, { upsert: true, contentType: file.type });
    setUploadingAdImg(false);
    if (error || !data) return null;
    const { data: urlData } = supabase.storage.from("listings").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const saveAd = async () => {
    setSavingAd(true);
    const supabase = createClient();
    const payload = { ...adForm, order_num: Number(adForm.order_num) };
    if (editingAd) {
      const { data } = await supabase.from("ads").update(payload).eq("id", editingAd).select().single();
      if (data) setAds((prev) => prev.map((a) => a.id === editingAd ? data : a));
      setEditingAd(null);
    } else {
      const { data } = await supabase.from("ads").insert({ ...payload, active: true }).select().single();
      if (data) setAds((prev) => [...prev, data]);
    }
    setAdForm(emptyAd);
    setSavingAd(false);
  };

  const toggleAdActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from("ads").update({ active }).eq("id", id);
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, active } : a));
  };

 const deleteAd = async (id: string) => {
  const supabase = createClient();
  // نعمل soft delete بدل حذف حقيقي عشان ad blocker
  const { error } = await supabase
    .from("ads")
    .update({ active: false, title_ar: "__deleted__" })
    .eq("id", id);
  
  if (!error) {
    setAds((prev) => prev.filter((a) => a.id !== id));
  }
};

  const exportUsersExcel = () => {
    const filtered = getFilteredUsers();
    const headers = ["الاسم", "البريد", "الهاتف", "الدور", "عدد الإعلانات", "تاريخ التسجيل"];
    const rows = filtered.map((u) => [u.full_name || "-", u.email || "-", u.phone || "-", u.role === "admin" ? "أدمن" : "مستخدم", u.listings_count || 0, new Date(u.created_at).toLocaleDateString("ar-EG")]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "users.csv"; a.click();
  };

  const getFilteredUsers = () => users.filter((u) => {
    const matchRole = userFilter === "all" || u.role === userFilter;
    const matchSearch = searchQuery === "" || u.full_name?.includes(searchQuery) || u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const formatPrice = (price: number) => isAr ? `${(price / 1000000).toFixed(1)} مليون` : `EGP ${(price / 1000000).toFixed(1)}M`;

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

  const filteredListings = listings.filter((l) => l.status === listingFilter);
  const filteredUsers = getFilteredUsers();
  const inputCls = "w-full px-4 py-3 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300";

  const adTextFields = [
    { key: "title_ar",    label_ar: "العنوان (عربي)",                          label_en: "Title (Arabic)"    },
    { key: "title_en",    label_ar: "العنوان (إنجليزي)",                        label_en: "Title (English)"   },
    { key: "subtitle_ar", label_ar: "الوصف (عربي)",                            label_en: "Subtitle (Arabic)" },
    { key: "subtitle_en", label_ar: "الوصف (إنجليزي)",                          label_en: "Subtitle (English)"},
    { key: "badge_ar",    label_ar: "البادج (عربي) — مثال: مميز / جديد / عرض", label_en: "Badge (Arabic)"   },
    { key: "badge_en",    label_ar: "البادج (إنجليزي)",                         label_en: "Badge (English)"   },
    { key: "price",       label_ar: "السعر — مثال: من 2 مليون جنيه",           label_en: "Price"             },
    { key: "link",        label_ar: "رابط الإعلان",                            label_en: "Ad Link"           },
    { key: "order_num",   label_ar: "الترتيب",                                 label_en: "Order"             },
  ];

  const tabs = [
    { id: "listings", icon: <HiOutlineHome className="w-4 h-4" />,       ar: "الإعلانات",          en: "Listings",      count: listings.length },
    { id: "users",    icon: <HiOutlineUserGroup className="w-4 h-4" />,   ar: "المستخدمون",         en: "Users",         count: users.length    },
    { id: "ads",      icon: <HiOutlineMegaphone className="w-4 h-4" />,   ar: "الإعلانات الجانبية", en: "Side Ads",      count: ads.length      },
    { id: "settings", icon: <HiOutlineCog6Tooth className="w-4 h-4" />,   ar: "إعدادات الموقع",    en: "Site Settings", count: null            },
  ];

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* العنوان */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-aura-accent/10 flex items-center justify-center">
              <MdOutlineAdminPanelSettings className="w-6 h-6 text-aura-accent" />
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] text-aura-accent uppercase">{isAr ? "لوحة الإدارة" : "Admin Panel"}</p>
              <h1 className="text-3xl font-light text-aura-dark">{isAr ? "إدارة الموقع" : "Site Management"}</h1>
            </div>
          </div>

          {/* الـ Tabs */}
          <div className="flex gap-2 mb-8 bg-aura-card p-1.5 rounded-2xl border border-aura-border w-fit flex-wrap">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? "bg-aura-dark text-white" : "text-aura-muted hover:text-aura-dark"}`}>
                {tab.icon}{isAr ? tab.ar : tab.en}
                {tab.count !== null && <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-aura-canvas"}`}>{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* ── تاب الإعلانات ── */}
          {activeTab === "listings" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {(["pending", "approved", "rejected"] as const).map((s) => (
                  <button key={s} onClick={() => setListingFilter(s)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-300 ${listingFilter === s ? "bg-aura-dark text-white border-aura-dark" : "bg-aura-card border-aura-border hover:border-aura-accent"}`}>
                    <p className="text-2xl font-light">{listings.filter((l) => l.status === s).length}</p>
                    <p className="text-xs mt-1 opacity-70">{isAr ? statusConfig[s].ar : statusConfig[s].en}</p>
                  </button>
                ))}
              </div>
              {filteredListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bg-aura-card rounded-3xl border border-aura-border">
                  <HiOutlineClock className="w-12 h-12 text-aura-accent/30" />
                  <p className="text-aura-muted font-light">{isAr ? "لا توجد إعلانات" : "No listings"}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border">
                      <div className="relative h-48 overflow-hidden">
                        <img src={listing.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"} alt={listing.title_en} className="w-full h-full object-cover img-hover" />
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-sm font-medium">{formatPrice(listing.price)}</div>
                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-medium ${statusConfig[listing.status].cls}`}>{isAr ? statusConfig[listing.status].ar : statusConfig[listing.status].en}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-sm font-medium text-aura-dark mb-1">{isAr ? listing.title_ar : listing.title_en}</h3>
                        <div className="flex items-center gap-1.5 text-aura-muted mb-3">
                          <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xs">{isAr ? listing.location_ar : listing.location_en}</span>
                        </div>
                        {listing.profiles && (
                          <div className="px-3 py-2 rounded-xl bg-aura-canvas border border-aura-border mb-3">
                            <p className="text-xs font-medium text-aura-dark">{listing.profiles.full_name}</p>
                            <p className="text-[10px] text-aura-muted">{listing.profiles.email}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-aura-muted mb-4">
                          {listing.beds > 0 && <div className="flex items-center gap-1"><LuBedDouble className="w-3.5 h-3.5" /><span className="text-xs">{listing.beds}</span></div>}
                          <div className="flex items-center gap-1"><LuBath className="w-3.5 h-3.5" /><span className="text-xs">{listing.baths}</span></div>
                          <div className="flex items-center gap-1"><LuMaximize className="w-3.5 h-3.5" /><span className="text-xs">{listing.area} {isAr ? "م²" : "m²"}</span></div>
                        </div>
                        {listing.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => updateStatus(listing.id, "approved")} disabled={updating === listing.id} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-50 text-green-600 border border-green-200 text-xs font-medium hover:bg-green-100 transition-all disabled:opacity-50">
                              <HiOutlineCheckCircle className="w-4 h-4" />{isAr ? "موافقة" : "Approve"}
                            </button>
                            <button onClick={() => updateStatus(listing.id, "rejected")} disabled={updating === listing.id} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-red-500 border border-red-200 text-xs font-medium hover:bg-red-100 transition-all disabled:opacity-50">
                              <HiOutlineXCircle className="w-4 h-4" />{isAr ? "رفض" : "Reject"}
                            </button>
                          </div>
                        )}
                        {listing.status !== "pending" && (
                          <button onClick={() => updateStatus(listing.id, listing.status === "approved" ? "rejected" : "approved")} disabled={updating === listing.id} className="w-full py-2.5 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark transition-all disabled:opacity-50">
                            {listing.status === "approved" ? (isAr ? "إلغاء الموافقة" : "Revoke") : (isAr ? "إعادة النظر" : "Reconsider")}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── تاب المستخدمين ── */}
          {activeTab === "users" && (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex gap-2 bg-aura-card p-1.5 rounded-2xl border border-aura-border w-fit">
                  {(["all", "admin", "user"] as const).map((f) => (
                    <button key={f} onClick={() => setUserFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${userFilter === f ? "bg-aura-dark text-white" : "text-aura-muted hover:text-aura-dark"}`}>
                      {f === "all" ? (isAr ? "الكل" : "All") : f === "admin" ? (isAr ? "أدمن" : "Admin") : (isAr ? "مستخدم" : "User")}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                  <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "بحث بالاسم أو البريد..." : "Search by name or email..."}
                    className="w-full pr-11 pl-4 py-3 rounded-2xl border border-aura-border bg-aura-card text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" />
                </div>
                <button onClick={exportUsersExcel} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-aura-dark text-white text-xs font-medium hover:bg-aura-accent transition-all duration-300">
                  <HiOutlineArrowDownTray className="w-4 h-4" />{isAr ? "تصدير Excel" : "Export Excel"}
                </button>
              </div>
              <div className="bg-aura-card rounded-3xl border border-aura-border overflow-hidden">
                <table className="w-full" dir={isAr ? "rtl" : "ltr"}>
                  <thead>
                    <tr className="border-b border-aura-border bg-aura-canvas">
                      {[isAr ? "الاسم" : "Name", isAr ? "البريد" : "Email", isAr ? "الهاتف" : "Phone", isAr ? "الدور" : "Role", isAr ? "الإعلانات" : "Listings", isAr ? "تاريخ التسجيل" : "Joined"].map((h) => (
                        <th key={h} className="px-6 py-4 text-start text-xs font-medium text-aura-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-aura-muted text-sm">{isAr ? "لا توجد نتائج" : "No results"}</td></tr>
                    ) : filteredUsers.map((u, i) => (
                      <tr key={u.id} className={`border-b border-aura-border hover:bg-aura-canvas transition-colors ${i % 2 === 0 ? "" : "bg-aura-canvas/30"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-aura-accent/20 flex items-center justify-center text-aura-accent text-xs font-medium shrink-0">
                              {u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}
                            </div>
                            <span className="text-sm text-aura-dark">{u.full_name || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-aura-muted">{u.email || "-"}</td>
                        <td className="px-6 py-4 text-sm text-aura-muted">{u.phone || "-"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${u.role === "admin" ? "bg-aura-accent/10 text-aura-accent" : "bg-aura-canvas text-aura-muted border border-aura-border"}`}>
                            {u.role === "admin" ? (isAr ? "أدمن" : "Admin") : (isAr ? "مستخدم" : "User")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-aura-dark">{u.listings_count || 0}</td>
                        <td className="px-6 py-4 text-xs text-aura-muted">{new Date(u.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── تاب الإعلانات الجانبية ── */}
          {activeTab === "ads" && (
            <div className="space-y-8">
              <div className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border">
                <h3 className="text-base font-medium text-aura-dark mb-1">
                  {editingAd ? (isAr ? "تعديل إعلان" : "Edit Ad") : (isAr ? "إضافة إعلان جديد" : "Add New Ad")}
                </h3>
                <div className="w-8 h-0.5 bg-aura-accent mb-5" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adTextFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs font-medium text-aura-dark">{isAr ? field.label_ar : field.label_en}</label>
                      <input type="text" value={adForm[field.key as keyof typeof adForm]}
                        onChange={(e) => setAdForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className={inputCls} />
                    </div>
                  ))}

                  {/* صورة الإعلان */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-aura-dark">
                      {isAr ? "صورة الإعلان" : "Ad Image"}
                    </label>
                    <div className="flex gap-3">
                      <input type="text" value={adForm.image_url}
                        onChange={(e) => setAdForm((prev) => ({ ...prev, image_url: e.target.value }))}
                        placeholder={isAr ? "رابط الصورة (URL)..." : "Image URL..."}
                        className={`${inputCls} flex-1`} />
                      <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs text-aura-dark hover:border-aura-accent cursor-pointer transition-all shrink-0">
                        {uploadingAdImg ? (
                          <div className="w-4 h-4 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />
                        )}
                        {isAr ? "رفع صورة" : "Upload"}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadAdImage(file);
                            if (url) setAdForm((prev) => ({ ...prev, image_url: url }));
                          }} />
                      </label>
                    </div>
                    {adForm.image_url && (
                      <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-aura-border">
                        <img src={adForm.image_url} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={saveAd} disabled={savingAd || uploadingAdImg}
                    className="px-6 py-3 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">
                    {savingAd ? (isAr ? "جاري الحفظ..." : "Saving...") : editingAd ? (isAr ? "تحديث" : "Update") : (isAr ? "إضافة" : "Add")}
                  </button>
                  {editingAd && (
                    <button onClick={() => { setEditingAd(null); setAdForm(emptyAd); }}
                      className="px-6 py-3 rounded-2xl border border-aura-border text-aura-muted text-sm hover:text-aura-dark transition-all">
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>

              {ads.length === 0 ? (
                <div className="text-center py-16 text-aura-muted bg-aura-card rounded-3xl border border-aura-border">
                  {isAr ? "لا توجد إعلانات جانبية بعد" : "No side ads yet"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads.map((ad) => (
                    <div key={ad.id} className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border">
                      {ad.image_url && (
                        <div className="h-40 overflow-hidden">
                          <img src={ad.image_url} alt={ad.title_en} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-medium text-aura-dark">{isAr ? ad.title_ar : ad.title_en}</h4>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${ad.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                            {ad.active ? (isAr ? "نشط" : "Active") : (isAr ? "متوقف" : "Inactive")}
                          </span>
                        </div>
                        {ad.badge_ar && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-aura-accent/10 text-aura-accent text-[10px] mb-2">
                            {isAr ? ad.badge_ar : ad.badge_en}
                          </span>
                        )}
                        <p className="text-xs text-aura-muted mb-1">{isAr ? ad.subtitle_ar : ad.subtitle_en}</p>
                        {ad.price && <p className="text-xs font-medium text-aura-accent mb-3">{ad.price}</p>}
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setEditingAd(ad.id);
                            setAdForm({ title_ar: ad.title_ar || "", title_en: ad.title_en || "", subtitle_ar: ad.subtitle_ar || "", subtitle_en: ad.subtitle_en || "", badge_ar: ad.badge_ar || "", badge_en: ad.badge_en || "", price: ad.price || "", image_url: ad.image_url || "", link: ad.link || "", order_num: String(ad.order_num) });
                          }} className="flex-1 py-2 rounded-xl border border-aura-border text-xs text-aura-dark hover:border-aura-accent transition-all">
                            {isAr ? "تعديل" : "Edit"}
                          </button>
                          <button onClick={() => toggleAdActive(ad.id, !ad.active)}
                            className="flex-1 py-2 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark transition-all">
                            {ad.active ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تفعيل" : "Activate")}
                          </button>
                          <button onClick={() => deleteAd(ad.id)}
                            className="py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-all">
                            {isAr ? "حذف" : "Del"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── تاب الإعدادات ── */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              {settingsSaved && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">
                  <HiOutlineCheckBadge className="w-4 h-4 shrink-0" />
                  {isAr ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!"}
                </div>
              )}
              {settingsGroups.map((group) => (
                <div key={group.title_en} className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border">
                  <h3 className="text-base font-medium text-aura-dark mb-1">{isAr ? group.title_ar : group.title_en}</h3>
                  <div className="w-8 h-0.5 bg-aura-accent mb-5" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.fields.map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-xs font-medium text-aura-dark">{isAr ? field.label_ar : field.label_en}</label>
                        <input type="text" value={siteSettings[field.key] || ""}
                          onChange={(e) => setSiteSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          className={inputCls} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={saveSettings} disabled={savingSettings}
                className="px-8 py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">
                {savingSettings ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ الإعدادات" : "Save Settings")}
              </button>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </main>
  );
}