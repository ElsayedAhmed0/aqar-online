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
  HiOutlinePhoto, HiOutlineTag, HiOutlineBuildingOffice2,
  HiOutlineNewspaper, HiOutlineInbox, HiOutlineChevronDown,
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
type PropertyType = { id: string; name_ar: string; name_en: string; value: string; active: boolean; order_num: number; };
type Partner = { id: string; name: string; logo_url: string; active: boolean; order_num: number; };
type BlogPost = {
  id: string; title_ar: string; title_en: string;
  excerpt_ar: string; excerpt_en: string;
  content_ar: string; content_en: string;
  category: string; image_url: string; published: boolean; created_at: string;
};
type Message = {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; read: boolean; created_at: string;
};

const statusConfig = {
  pending: { ar: "انتظار", en: "Pending", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  approved: { ar: "موافق عليه", en: "Approved", cls: "bg-green-50 text-green-600 border-green-200" },
  rejected: { ar: "مرفوض", en: "Rejected", cls: "bg-red-50 text-red-500 border-red-200" },
};

const settingsGroups = [
  {
    title_ar: "معلومات الموقع", title_en: "Site Info", fields: [
      { key: "site_name_ar", label_ar: "اسم الموقع (عربي)", label_en: "Site Name (Arabic)" },
      { key: "site_name_en", label_ar: "اسم الموقع (إنجليزي)", label_en: "Site Name (English)" },
    ]
  },
  {
    title_ar: "قسم الهيرو", title_en: "Hero Section", fields: [
      { key: "hero_title_ar", label_ar: "العنوان (عربي)", label_en: "Hero Title (Arabic)" },
      { key: "hero_title_en", label_ar: "العنوان (إنجليزي)", label_en: "Hero Title (English)" },
      { key: "hero_subtitle_ar", label_ar: "الوصف (عربي)", label_en: "Subtitle (Arabic)" },
      { key: "hero_subtitle_en", label_ar: "الوصف (إنجليزي)", label_en: "Subtitle (English)" },
      { key: "hero_image", label_ar: "صورة الخلفية", label_en: "Background Image" },
    ]
  },
  {
    title_ar: "الإحصائيات", title_en: "Stats", fields: [
      { key: "stats_properties", label_ar: "عدد العقارات", label_en: "Properties Count" },
      { key: "stats_clients", label_ar: "عدد العملاء", label_en: "Clients Count" },
      { key: "stats_years", label_ar: "سنوات الخبرة", label_en: "Years of Experience" },
    ]
  },
  {
    title_ar: "الفوتر", title_en: "Footer", fields: [
      { key: "footer_phone", label_ar: "رقم الهاتف", label_en: "Phone Number" },
      { key: "footer_email", label_ar: "البريد الإلكتروني", label_en: "Email Address" },
      { key: "footer_address_ar", label_ar: "العنوان (عربي)", label_en: "Address (Arabic)" },
      { key: "footer_address_en", label_ar: "العنوان (إنجليزي)", label_en: "Address (English)" },
      { key: "footer_desc_ar", label_ar: "الوصف (عربي)", label_en: "Description (Arabic)" },
      { key: "footer_desc_en", label_ar: "الوصف (إنجليزي)", label_en: "Description (English)" },
    ]
  },
  {
    title_ar: "السوشيال ميديا", title_en: "Social Media", fields: [
      { key: "social_facebook", label_ar: "فيسبوك (رابط)", label_en: "Facebook (URL)" },
      { key: "social_instagram", label_ar: "انستجرام (رابط)", label_en: "Instagram (URL)" },
      { key: "social_whatsapp", label_ar: "واتساب (رابط)", label_en: "WhatsApp (URL)" },
      { key: "social_tiktok", label_ar: "تيك توك (رابط)", label_en: "TikTok (URL)" },
    ]
  },
  {
    title_ar: "صفحات قانونية", title_en: "Legal Pages", fields: [
      { key: "privacy_content_ar", label_ar: "سياسة الخصوصية (عربي)", label_en: "Privacy Policy (Arabic)" },
      { key: "privacy_content_en", label_ar: "سياسة الخصوصية (إنجليزي)", label_en: "Privacy Policy (English)" },
      { key: "terms_content_ar", label_ar: "الشروط والأحكام (عربي)", label_en: "Terms (Arabic)" },
      { key: "terms_content_en", label_ar: "الشروط والأحكام (إنجليزي)", label_en: "Terms (English)" },
    ]
  },
  {
    title_ar: "صفحة عن عقار", title_en: "About Page", fields: [
      { key: "about_title_ar", label_ar: "العنوان (عربي)", label_en: "Title (Arabic)" },
      { key: "about_title_en", label_ar: "العنوان (إنجليزي)", label_en: "Title (English)" },
      { key: "about_subtitle_ar", label_ar: "العنوان الفرعي (عربي)", label_en: "Subtitle (Arabic)" },
      { key: "about_subtitle_en", label_ar: "العنوان الفرعي (إنجليزي)", label_en: "Subtitle (English)" },
      { key: "about_content_ar", label_ar: "المحتوى (عربي)", label_en: "Content (Arabic)" },
      { key: "about_content_en", label_ar: "المحتوى (إنجليزي)", label_en: "Content (English)" },
      { key: "about_vision_ar", label_ar: "عنوان الرؤية (عربي)", label_en: "Vision Title (Arabic)" },
      { key: "about_vision_en", label_ar: "عنوان الرؤية (إنجليزي)", label_en: "Vision Title (English)" },
      { key: "about_vision_content_ar", label_ar: "نص الرؤية (عربي)", label_en: "Vision Content (Arabic)" },
      { key: "about_vision_content_en", label_ar: "نص الرؤية (إنجليزي)", label_en: "Vision Content (English)" },
      { key: "about_mission_ar", label_ar: "عنوان المهمة (عربي)", label_en: "Mission Title (Arabic)" },
      { key: "about_mission_en", label_ar: "عنوان المهمة (إنجليزي)", label_en: "Mission Title (English)" },
      { key: "about_mission_content_ar", label_ar: "نص المهمة (عربي)", label_en: "Mission Content (Arabic)" },
      { key: "about_mission_content_en", label_ar: "نص المهمة (إنجليزي)", label_en: "Mission Content (English)" },
    ]
  },
];

const textareaKeys = [
  "privacy_content_ar", "privacy_content_en", "terms_content_ar", "terms_content_en",
  "about_content_ar", "about_content_en", "about_vision_content_ar", "about_vision_content_en",
  "about_mission_content_ar", "about_mission_content_en",
];

const emptyAd = { title_ar: "", title_en: "", subtitle_ar: "", subtitle_en: "", badge_ar: "", badge_en: "", price: "", image_url: "", link: "", order_num: "0" };
const emptyType = { name_ar: "", name_en: "", value: "", order_num: "0" };
const emptyPartner = { name: "", logo_url: "", order_num: "0" };
const emptyPost = { title_ar: "", title_en: "", excerpt_ar: "", excerpt_en: "", content_ar: "", content_en: "", category: "", image_url: "" };
const PROMO_TABLE = "promotions";
const imageSettingKeys = ["hero_image"];

export default function AdminPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"listings" | "users" | "settings" | "ads" | "types" | "partners" | "blog" | "messages">("listings");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [listingFilter, setListingFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [adForm, setAdForm] = useState(emptyAd);
  const [typeForm, setTypeForm] = useState(emptyType);
  const [partnerForm, setPartnerForm] = useState(emptyPartner);
  const [postForm, setPostForm] = useState(emptyPost);
  const [editingAd, setEditingAd] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [savingAd, setSavingAd] = useState(false);
  const [savingType, setSavingType] = useState(false);
  const [savingPartner, setSavingPartner] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [uploadingAdImg, setUploadingAdImg] = useState(false);
  const [uploadingPostImg, setUploadingPostImg] = useState(false);
  const [uploadingSettingImg, setUploadingSettingImg] = useState(false);
  const [userFilter, setUserFilter] = useState<"all" | "admin" | "subadmin" | "user">("all");
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
      if (!data || (data.role !== "admin" && data.role !== "subadmin")) { router.push(`/${locale}`); return; }
      setCurrentUserRole(data.role);

      const [listingsRes, usersRes, settingsRes, adsRes, typesRes, partnersRes, blogRes, messagesRes] = await Promise.all([
        supabase.from("listings").select("*, profiles(full_name, email, phone)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("key, value"),
        supabase.from(PROMO_TABLE).select("*").order("order_num", { ascending: true }),
        supabase.from("property_types").select("*").order("order_num", { ascending: true }),
        supabase.from("partners").select("*").order("order_num", { ascending: true }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
      ]);

      if (listingsRes.data) setListings(listingsRes.data as Listing[]);
      if (usersRes.data) {
        const withCounts = await Promise.all(usersRes.data.map(async (u) => {
          const { count } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("user_id", u.id);
          return { ...u, listings_count: count || 0 };
        }));
        setUsers(withCounts);
      }
      if (settingsRes.data) {
        const mapped: Record<string, string> = {};
        settingsRes.data.forEach((row) => { mapped[row.key] = row.value || ""; });
        setSiteSettings(mapped);
      }
      if (adsRes.data) setAds(adsRes.data as Ad[]);
      if (typesRes.data) setPropertyTypes(typesRes.data as PropertyType[]);
      if (partnersRes.data) setPartners(partnersRes.data as Partner[]);
      if (blogRes.data) setBlogPosts(blogRes.data as BlogPost[]);
      if (messagesRes.data) setMessages(messagesRes.data as Message[]);
      setFetching(false);
    };
    checkAdmin();
  }, [user, loading]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    const supabase = createClient();
    const { error } = await supabase.from("listings").update({ status }).eq("id", id);
    if (!error) setListings((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    setUpdating(null);
  };

  const changeUserRole = async (userId: string, role: "admin" | "subadmin" | "user") => {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (!error) setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const supabase = createClient();
    for (const [key, value] of Object.entries(siteSettings)) {
      await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    }
    setSavingSettings(false); setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };
  // ✅ استبدل الفنكشن دي بالكاملة
  const uploadImage = async (file: File, prefix: string): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();
      return data.url || null;
    } catch {
      return null;
    }
  };

  const saveAd = async () => {
    setSavingAd(true);
    const supabase = createClient();
    const payload = { ...adForm, order_num: Number(adForm.order_num) };
    if (editingAd) {
      const { data } = await supabase.from(PROMO_TABLE).update(payload).eq("id", editingAd).select().single();
      if (data) setAds((prev) => prev.map((a) => a.id === editingAd ? data : a));
      setEditingAd(null);
    } else {
      const { data } = await supabase.from(PROMO_TABLE).insert({ ...payload, active: true }).select().single();
      if (data) setAds((prev) => [...prev, data]);
    }
    setAdForm(emptyAd); setSavingAd(false);
  };

  const toggleAdActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from(PROMO_TABLE).update({ active }).eq("id", id);
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, active } : a));
  };

  const deleteAd = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from(PROMO_TABLE).delete().eq("id", id);
    if (!error) setAds((prev) => prev.filter((a) => a.id !== id));
  };

  const savePropertyType = async () => {
    setSavingType(true);
    const supabase = createClient();
    const payload = { ...typeForm, order_num: Number(typeForm.order_num) };
    if (editingType) {
      const { data } = await supabase.from("property_types").update(payload).eq("id", editingType).select().single();
      if (data) setPropertyTypes((prev) => prev.map((t) => t.id === editingType ? data : t));
      setEditingType(null);
    } else {
      const { data } = await supabase.from("property_types").insert({ ...payload, active: true }).select().single();
      if (data) setPropertyTypes((prev) => [...prev, data]);
    }
    setTypeForm(emptyType); setSavingType(false);
  };

  const toggleTypeActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from("property_types").update({ active }).eq("id", id);
    setPropertyTypes((prev) => prev.map((t) => t.id === id ? { ...t, active } : t));
  };

  const deletePropertyType = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("property_types").delete().eq("id", id);
    if (!error) setPropertyTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const savePartner = async () => {
    setSavingPartner(true);
    const supabase = createClient();
    const payload = { ...partnerForm, order_num: Number(partnerForm.order_num) };
    if (editingPartner) {
      const { data } = await supabase.from("partners").update(payload).eq("id", editingPartner).select().single();
      if (data) setPartners((prev) => prev.map((p) => p.id === editingPartner ? data : p));
      setEditingPartner(null);
    } else {
      const { data } = await supabase.from("partners").insert({ ...payload, active: true }).select().single();
      if (data) setPartners((prev) => [...prev, data]);
    }
    setPartnerForm(emptyPartner); setSavingPartner(false);
  };

  const togglePartnerActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from("partners").update({ active }).eq("id", id);
    setPartners((prev) => prev.map((p) => p.id === id ? { ...p, active } : p));
  };

  const deletePartner = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (!error) setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  const savePost = async () => {
    setSavingPost(true);
    const supabase = createClient();
    if (editingPost) {
      const { data } = await supabase.from("blog_posts").update(postForm).eq("id", editingPost).select().single();
      if (data) setBlogPosts((prev) => prev.map((p) => p.id === editingPost ? data : p));
      setEditingPost(null);
    } else {
      const { data } = await supabase.from("blog_posts").insert({ ...postForm, published: false }).select().single();
      if (data) setBlogPosts((prev) => [data, ...prev]);
    }
    setPostForm(emptyPost); setSavingPost(false);
  };

  const togglePostPublished = async (id: string, published: boolean) => {
    const supabase = createClient();
    await supabase.from("blog_posts").update({ published }).eq("id", id);
    setBlogPosts((prev) => prev.map((p) => p.id === id ? { ...p, published } : p));
  };

  const deletePost = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (!error) setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const markMessageRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from("messages").update({ read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const exportUsersExcel = () => {
    const filtered = getFilteredUsers();
    const headers = ["الاسم", "البريد", "الهاتف", "الدور", "عدد الإعلانات", "تاريخ التسجيل"];
    const rows = filtered.map((u) => [u.full_name || "-", u.email || "-", u.phone || "-", u.role === "admin" ? "أدمن" : u.role === "subadmin" ? "مساعد أدمن" : "مستخدم", u.listings_count || 0, new Date(u.created_at).toLocaleDateString("ar-EG")]);
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

 const formatPrice = (price: number) =>
  isAr
    ? `${price.toLocaleString("ar-EG")} جنيه`
    : `EGP ${price.toLocaleString("en-US")}`;

  if (loading || fetching) {
    return (
      <main className="min-h-screen bg-aura-bg"><Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  const filteredListings = listings.filter((l) => l.status === listingFilter);
  const filteredUsers = getFilteredUsers();
  const unreadCount = messages.filter((m) => !m.read).length;
  const isFullAdmin = currentUserRole === "admin";
  const inputCls = "w-full px-4 py-3 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300";
  const textareaCls = `${inputCls} resize-none`;

  const adTextFields = [
    { key: "title_ar", label_ar: "العنوان (عربي)", label_en: "Title (Arabic)" },
    { key: "title_en", label_ar: "العنوان (إنجليزي)", label_en: "Title (English)" },
    { key: "subtitle_ar", label_ar: "الوصف (عربي)", label_en: "Subtitle (Arabic)" },
    { key: "subtitle_en", label_ar: "الوصف (إنجليزي)", label_en: "Subtitle (English)" },
    { key: "badge_ar", label_ar: "البادج (عربي)", label_en: "Badge (Arabic)" },
    { key: "badge_en", label_ar: "البادج (إنجليزي)", label_en: "Badge (English)" },
    { key: "price", label_ar: "السعر", label_en: "Price" },
    { key: "link", label_ar: "رابط الإعلان", label_en: "Ad Link" },
    { key: "order_num", label_ar: "الترتيب", label_en: "Order" },
  ];

  const allTabs = [
    { id: "listings", icon: <HiOutlineHome className="w-4 h-4" />, ar: "الإعلانات", en: "Listings", count: listings.length },
    { id: "users", icon: <HiOutlineUserGroup className="w-4 h-4" />, ar: "المستخدمون", en: "Users", count: users.length },
    { id: "messages", icon: <HiOutlineInbox className="w-4 h-4" />, ar: "الرسائل", en: "Messages", count: unreadCount },
    { id: "ads", icon: <HiOutlineMegaphone className="w-4 h-4" />, ar: "الإعلانات الجانبية", en: "Side Ads", count: ads.length },
    { id: "types", icon: <HiOutlineTag className="w-4 h-4" />, ar: "أنواع العقارات", en: "Property Types", count: propertyTypes.length },
    { id: "partners", icon: <HiOutlineBuildingOffice2 className="w-4 h-4" />, ar: "الشركاء", en: "Partners", count: partners.length },
    { id: "blog", icon: <HiOutlineNewspaper className="w-4 h-4" />, ar: "المقالات", en: "Blog Posts", count: blogPosts.length },
    { id: "settings", icon: <HiOutlineCog6Tooth className="w-4 h-4" />, ar: "إعدادات الموقع", en: "Site Settings", count: null },
  ];

  const tabs = isFullAdmin ? allTabs : allTabs.filter((t) => ["listings", "users", "messages"].includes(t.id));
  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <main className="min-h-screen bg-aura-bg">
      <Navbar />
      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* الهيدر */}
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-aura-accent/10 flex items-center justify-center shrink-0">
              <MdOutlineAdminPanelSettings className="w-5 h-5 md:w-6 md:h-6 text-aura-accent" />
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] text-aura-accent uppercase">{isAr ? "لوحة الإدارة" : "Admin Panel"}</p>
              <h1 className="text-2xl md:text-3xl font-light text-aura-dark">{isAr ? "إدارة الموقع" : "Site Management"}</h1>
              {!isFullAdmin && <p className="text-xs text-aura-muted mt-1">{isAr ? "مساعد أدمن — صلاحيات محدودة" : "Sub Admin — Limited Access"}</p>}
            </div>
          </div>

          {/* ✅ Tabs — dropdown على الموبايل، أفقية على الديسكتوب */}
          <div className="mb-6 md:mb-8">
            {/* موبايل — dropdown */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMobileTabOpen(!mobileTabOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-aura-card border border-aura-border text-sm font-medium text-aura-dark"
              >
                <span className="flex items-center gap-2">
                  {activeTabData?.icon}
                  {isAr ? activeTabData?.ar : activeTabData?.en}
                </span>
                <HiOutlineChevronDown className={`w-4 h-4 text-aura-muted transition-transform ${mobileTabOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileTabOpen && (
                <div className="absolute top-full mt-2 w-full bg-aura-card border border-aura-border rounded-2xl shadow-xl overflow-hidden z-20">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id as any); setMobileTabOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === tab.id ? "bg-aura-dark text-white" : "text-aura-muted hover:bg-aura-canvas"}`}
                    >
                      {tab.icon}
                      {isAr ? tab.ar : tab.en}
                      {tab.count !== null && tab.count > 0 && (
                        <span className={`mr-auto text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : tab.id === "messages" && unreadCount > 0 ? "bg-red-500 text-white" : "bg-aura-canvas"}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ديسكتوب — أفقية scrollable */}
            <div className="hidden md:flex gap-2 bg-aura-card p-1.5 rounded-2xl border border-aura-border overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap shrink-0 ${activeTab === tab.id ? "bg-aura-dark text-white" : "text-aura-muted hover:text-aura-dark"}`}
                >
                  {tab.icon}
                  {isAr ? tab.ar : tab.en}
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : tab.id === "messages" && unreadCount > 0 ? "bg-red-500 text-white" : "bg-aura-canvas"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── الإعلانات ── */}
          {activeTab === "listings" && (
            <>
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {(["pending", "approved", "rejected"] as const).map((s) => (
                  <button key={s} onClick={() => setListingFilter(s)}
                    className={`p-3 md:p-4 rounded-2xl border text-center transition-all duration-300 ${listingFilter === s ? "bg-aura-dark text-white border-aura-dark" : "bg-aura-card border-aura-border hover:border-aura-accent"}`}>
                    <p className="text-xl md:text-2xl font-light">{listings.filter((l) => l.status === s).length}</p>
                    <p className="text-[10px] md:text-xs mt-1 opacity-70">{isAr ? statusConfig[s].ar : statusConfig[s].en}</p>
                  </button>
                ))}
              </div>
              {filteredListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bg-aura-card rounded-3xl border border-aura-border">
                  <HiOutlineClock className="w-12 h-12 text-aura-accent/30" />
                  <p className="text-aura-muted font-light">{isAr ? "لا توجد إعلانات" : "No listings"}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border">
                      <div className="relative h-44 md:h-48 overflow-hidden">
                        <img src={listing.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"} alt={listing.title_en} className="w-full h-full object-cover img-hover" />
                        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xs md:text-sm font-medium">{formatPrice(listing.price)}</div>
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full border text-[10px] font-medium ${statusConfig[listing.status].cls}`}>{isAr ? statusConfig[listing.status].ar : statusConfig[listing.status].en}</span>
                      </div>
                      <div className="p-4 md:p-5">
                        <h3 className="text-sm font-medium text-aura-dark mb-1 line-clamp-1">{isAr ? listing.title_ar : listing.title_en}</h3>
                        <div className="flex items-center gap-1.5 text-aura-muted mb-3">
                          <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xs truncate">{isAr ? listing.location_ar : listing.location_en}</span>
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

          {/* ── المستخدمين ── */}
          {activeTab === "users" && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex gap-2 bg-aura-card p-1.5 rounded-2xl border border-aura-border flex-wrap">
                  {(["all", "admin", "subadmin", "user"] as const).map((f) => (
                    <button key={f} onClick={() => setUserFilter(f)}
                      className={`px-3 md:px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${userFilter === f ? "bg-aura-dark text-white" : "text-aura-muted hover:text-aura-dark"}`}>
                      {f === "all" ? (isAr ? "الكل" : "All") : f === "admin" ? (isAr ? "أدمن" : "Admin") : f === "subadmin" ? (isAr ? "مساعد" : "Sub") : (isAr ? "مستخدم" : "User")}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1">
                  <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "بحث بالاسم أو البريد..." : "Search by name or email..."}
                    className="w-full pr-11 pl-4 py-3 rounded-2xl border border-aura-border bg-aura-card text-aura-dark text-sm outline-none focus:border-aura-accent transition-all" />
                </div>
                <button onClick={exportUsersExcel} className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-aura-dark text-white text-xs font-medium hover:bg-aura-accent transition-all duration-300 shrink-0">
                  <HiOutlineArrowDownTray className="w-4 h-4" />{isAr ? "تصدير" : "Export"}
                </button>
              </div>

              {/* ✅ جدول scrollable على الموبايل */}
              <div className="bg-aura-card rounded-3xl border border-aura-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]" dir={isAr ? "rtl" : "ltr"}>
                    <thead>
                      <tr className="border-b border-aura-border bg-aura-canvas">
                        {[isAr ? "الاسم" : "Name", isAr ? "البريد" : "Email", isAr ? "الهاتف" : "Phone", isAr ? "الدور" : "Role", isAr ? "الإعلانات" : "Listings", isAr ? "تاريخ التسجيل" : "Joined",
                        ...(isFullAdmin ? [isAr ? "الصلاحيات" : "Permissions"] : [])].map((h) => (
                          <th key={h} className="px-4 md:px-6 py-4 text-start text-xs font-medium text-aura-muted whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-12 text-aura-muted text-sm">{isAr ? "لا توجد نتائج" : "No results"}</td></tr>
                      ) : filteredUsers.map((u, i) => (
                        <tr key={u.id} className={`border-b border-aura-border hover:bg-aura-canvas transition-colors ${i % 2 === 0 ? "" : "bg-aura-canvas/30"}`}>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-aura-accent/20 flex items-center justify-center text-aura-accent text-xs font-medium shrink-0">{u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}</div>
                              <span className="text-sm text-aura-dark whitespace-nowrap">{u.full_name || "-"}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-sm text-aura-muted whitespace-nowrap">{u.email || "-"}</td>
                          <td className="px-4 md:px-6 py-4 text-sm text-aura-muted whitespace-nowrap">{u.phone || "-"}</td>
                          <td className="px-4 md:px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${u.role === "admin" ? "bg-aura-accent/10 text-aura-accent" : u.role === "subadmin" ? "bg-blue-50 text-blue-500 border border-blue-200" : "bg-aura-canvas text-aura-muted border border-aura-border"}`}>
                              {u.role === "admin" ? (isAr ? "أدمن" : "Admin") : u.role === "subadmin" ? (isAr ? "مساعد أدمن" : "Sub Admin") : (isAr ? "مستخدم" : "User")}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-sm text-aura-dark">{u.listings_count || 0}</td>
                          <td className="px-4 md:px-6 py-4 text-xs text-aura-muted whitespace-nowrap">{new Date(u.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US")}</td>
                          {isFullAdmin && (
                            <td className="px-4 md:px-6 py-4">
                              {u.id !== user?.id && (
                                <div className="flex items-center gap-2">
                                  {u.role === "user" && (
                                    <>
                                      <button onClick={() => changeUserRole(u.id, "subadmin")} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-500 text-[10px] font-medium hover:bg-blue-100 transition-all border border-blue-200 whitespace-nowrap">{isAr ? "مساعد" : "Sub"}</button>
                                      <button onClick={() => changeUserRole(u.id, "admin")} className="px-3 py-1.5 rounded-lg bg-aura-accent/10 text-aura-accent text-[10px] font-medium hover:bg-aura-accent/20 transition-all whitespace-nowrap">{isAr ? "أدمن" : "Admin"}</button>
                                    </>
                                  )}
                                  {(u.role === "admin" || u.role === "subadmin") && (
                                    <button onClick={() => changeUserRole(u.id, "user")} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-[10px] font-medium hover:bg-red-100 transition-all border border-red-200 whitespace-nowrap">{isAr ? "إلغاء" : "Revoke"}</button>
                                  )}
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── الرسائل ── */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg md:text-xl font-light text-aura-dark">{isAr ? "رسائل العملاء" : "Customer Messages"}</h2>
                  {unreadCount > 0 && <p className="text-xs text-aura-accent mt-1">{isAr ? `${unreadCount} رسالة غير مقروءة` : `${unreadCount} unread messages`}</p>}
                </div>
              </div>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bg-aura-card rounded-3xl border border-aura-border">
                  <HiOutlineInbox className="w-12 h-12 text-aura-accent/30" />
                  <p className="text-aura-muted font-light">{isAr ? "لا توجد رسائل بعد" : "No messages yet"}</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} onClick={() => { if (!msg.read) markMessageRead(msg.id); }}
                    className={`bento-card rounded-3xl p-4 md:p-6 border cursor-pointer transition-all ${msg.read ? "bg-aura-card border-aura-border" : "bg-aura-accent/5 border-aura-accent/30"}`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-aura-accent/20 flex items-center justify-center text-aura-accent font-medium text-sm shrink-0">{msg.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="text-sm font-medium text-aura-dark">{msg.name}</p>
                          <div className="flex items-center gap-2 text-xs text-aura-muted mt-0.5 flex-wrap">
                            {msg.phone && <span dir="ltr">📞 {msg.phone}</span>}
                            {msg.email && <span dir="ltr">✉️ {msg.email}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!msg.read && <span className="w-2.5 h-2.5 rounded-full bg-aura-accent" />}
                        <span className="text-xs text-aura-muted">{new Date(msg.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US")}</span>
                      </div>
                    </div>
                    {msg.subject && <p className="text-xs font-medium text-aura-dark mb-2 px-3 py-1.5 rounded-lg bg-aura-canvas w-fit">{msg.subject}</p>}
                    <p className="text-sm text-aura-muted leading-relaxed mb-4">{msg.message}</p>
                    <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      {msg.phone && <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-aura-dark text-white text-xs hover:bg-aura-accent transition-all">📞 {isAr ? "اتصل" : "Call"}</a>}
                      {msg.email && <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-aura-border text-aura-dark text-xs hover:border-aura-accent transition-all">✉️ {isAr ? "راسل" : "Email"}</a>}
                      <button onClick={() => deleteMessage(msg.id)} className="mr-auto px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-all">{isAr ? "حذف" : "Delete"}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── الإعلانات الجانبية ── */}
          {activeTab === "ads" && isFullAdmin && (
            <div className="space-y-8">
              <div className="bento-card bg-aura-card rounded-3xl p-5 md:p-6 border border-aura-border">
                <h3 className="text-base font-medium text-aura-dark mb-1">{editingAd ? (isAr ? "تعديل إعلان" : "Edit Ad") : (isAr ? "إضافة إعلان جديد" : "Add New Ad")}</h3>
                <div className="w-8 h-0.5 bg-aura-accent mb-5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adTextFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs font-medium text-aura-dark">{isAr ? field.label_ar : field.label_en}</label>
                      <input type="text" value={adForm[field.key as keyof typeof adForm]} onChange={(e) => setAdForm((prev) => ({ ...prev, [field.key]: e.target.value }))} className={inputCls} />
                    </div>
                  ))}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-aura-dark">{isAr ? "صورة الإعلان" : "Ad Image"}</label>
                    <div className="flex gap-3">
                      <input type="text" value={adForm.image_url} onChange={(e) => setAdForm((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="URL..." className={`${inputCls} flex-1`} />
                      <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs text-aura-dark hover:border-aura-accent cursor-pointer transition-all shrink-0">
                        {uploadingAdImg ? <div className="w-4 h-4 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" /> : <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />}
                        {isAr ? "رفع" : "Upload"}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingAdImg(true); const url = await uploadImage(file, "promo"); setUploadingAdImg(false); if (url) setAdForm((prev) => ({ ...prev, image_url: url })); }} />
                      </label>
                    </div>
                    {adForm.image_url && <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-aura-border"><img src={adForm.image_url} alt="preview" className="w-full h-full object-cover" /></div>}
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={saveAd} disabled={savingAd || uploadingAdImg} className="px-6 py-3 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">{savingAd ? (isAr ? "جاري الحفظ..." : "Saving...") : editingAd ? (isAr ? "تحديث" : "Update") : (isAr ? "إضافة" : "Add")}</button>
                  {editingAd && <button onClick={() => { setEditingAd(null); setAdForm(emptyAd); }} className="px-6 py-3 rounded-2xl border border-aura-border text-aura-muted text-sm hover:text-aura-dark transition-all">{isAr ? "إلغاء" : "Cancel"}</button>}
                </div>
              </div>
              {ads.length === 0 ? <div className="text-center py-16 text-aura-muted bg-aura-card rounded-3xl border border-aura-border">{isAr ? "لا توجد إعلانات جانبية بعد" : "No side ads yet"}</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {ads.map((ad) => (
                    <div key={ad.id} className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border">
                      {ad.image_url && <div className="h-40 overflow-hidden"><img src={ad.image_url} alt={isAr ? ad.title_ar : ad.title_en} className="w-full h-full object-cover" /></div>}
                      <div className="p-4 md:p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-medium text-aura-dark line-clamp-1">{isAr ? ad.title_ar : ad.title_en}</h4>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${ad.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{ad.active ? (isAr ? "نشط" : "Active") : (isAr ? "متوقف" : "Inactive")}</span>
                        </div>
                        {ad.badge_ar && <span className="inline-block px-2 py-0.5 rounded-full bg-aura-accent/10 text-aura-accent text-[10px] mb-2">{isAr ? ad.badge_ar : ad.badge_en}</span>}
                        <p className="text-xs text-aura-muted mb-1 line-clamp-1">{isAr ? ad.subtitle_ar : ad.subtitle_en}</p>
                        {ad.price && <p className="text-xs font-medium text-aura-accent mb-3">{ad.price}</p>}
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingAd(ad.id); setAdForm({ title_ar: ad.title_ar || "", title_en: ad.title_en || "", subtitle_ar: ad.subtitle_ar || "", subtitle_en: ad.subtitle_en || "", badge_ar: ad.badge_ar || "", badge_en: ad.badge_en || "", price: ad.price || "", image_url: ad.image_url || "", link: ad.link || "", order_num: String(ad.order_num) }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 py-2 rounded-xl border border-aura-border text-xs text-aura-dark hover:border-aura-accent transition-all">{isAr ? "تعديل" : "Edit"}</button>
                          <button onClick={() => toggleAdActive(ad.id, !ad.active)} className={`flex-1 py-2 rounded-xl border text-xs transition-all ${ad.active ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>{ad.active ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تفعيل" : "Activate")}</button>
                          <button onClick={() => deleteAd(ad.id)} className="py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-all">{isAr ? "حذف" : "Del"}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── أنواع العقارات ── */}
          {activeTab === "types" && isFullAdmin && (
            <div className="space-y-8">
              <div className="bento-card bg-aura-card rounded-3xl p-5 md:p-6 border border-aura-border">
                <h3 className="text-base font-medium text-aura-dark mb-1">{editingType ? (isAr ? "تعديل نوع" : "Edit Type") : (isAr ? "إضافة نوع جديد" : "Add New Type")}</h3>
                <div className="w-8 h-0.5 bg-aura-accent mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "الاسم (عربي)" : "Name (Arabic)"}</label><input type="text" value={typeForm.name_ar} onChange={(e) => setTypeForm((prev) => ({ ...prev, name_ar: e.target.value }))} className={inputCls} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label><input type="text" value={typeForm.name_en} onChange={(e) => setTypeForm((prev) => ({ ...prev, name_en: e.target.value }))} className={inputCls} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "القيمة" : "Value"}</label><input type="text" value={typeForm.value} onChange={(e) => setTypeForm((prev) => ({ ...prev, value: e.target.value.toLowerCase().replace(/\s/g, "_") }))} className={inputCls} dir="ltr" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "الترتيب" : "Order"}</label><input type="number" value={typeForm.order_num} onChange={(e) => setTypeForm((prev) => ({ ...prev, order_num: e.target.value }))} className={inputCls} dir="ltr" /></div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={savePropertyType} disabled={savingType || !typeForm.name_ar || !typeForm.name_en || !typeForm.value} className="px-6 py-3 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">{savingType ? (isAr ? "جاري الحفظ..." : "Saving...") : editingType ? (isAr ? "تحديث" : "Update") : (isAr ? "إضافة" : "Add")}</button>
                  {editingType && <button onClick={() => { setEditingType(null); setTypeForm(emptyType); }} className="px-6 py-3 rounded-2xl border border-aura-border text-aura-muted text-sm hover:text-aura-dark transition-all">{isAr ? "إلغاء" : "Cancel"}</button>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertyTypes.map((type) => (
                  <div key={type.id} className="bento-card bg-aura-card rounded-2xl p-4 md:p-5 border border-aura-border">
                    <div className="flex items-center justify-between mb-3">
                      <div><h4 className="text-sm font-medium text-aura-dark">{isAr ? type.name_ar : type.name_en}</h4><p className="text-[10px] text-aura-muted mt-0.5" dir="ltr">{type.value}</p></div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${type.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{type.active ? (isAr ? "نشط" : "Active") : (isAr ? "متوقف" : "Inactive")}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingType(type.id); setTypeForm({ name_ar: type.name_ar, name_en: type.name_en, value: type.value, order_num: String(type.order_num) }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 py-2 rounded-xl border border-aura-border text-xs text-aura-dark hover:border-aura-accent transition-all">{isAr ? "تعديل" : "Edit"}</button>
                      <button onClick={() => toggleTypeActive(type.id, !type.active)} className={`flex-1 py-2 rounded-xl border text-xs transition-all ${type.active ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>{type.active ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تفعيل" : "Activate")}</button>
                      <button onClick={() => deletePropertyType(type.id)} className="py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-all">{isAr ? "حذف" : "Del"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── الشركاء ── */}
          {activeTab === "partners" && isFullAdmin && (
            <div className="space-y-8">
              <div className="bento-card bg-aura-card rounded-3xl p-5 md:p-6 border border-aura-border">
                <h3 className="text-base font-medium text-aura-dark mb-1">{editingPartner ? (isAr ? "تعديل شريك" : "Edit Partner") : (isAr ? "إضافة شريك جديد" : "Add New Partner")}</h3>
                <div className="w-8 h-0.5 bg-aura-accent mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "اسم الشريك" : "Partner Name"}</label><input type="text" value={partnerForm.name} onChange={(e) => setPartnerForm((prev) => ({ ...prev, name: e.target.value }))} className={inputCls} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "الترتيب" : "Order"}</label><input type="number" value={partnerForm.order_num} onChange={(e) => setPartnerForm((prev) => ({ ...prev, order_num: e.target.value }))} className={inputCls} dir="ltr" /></div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-aura-dark">{isAr ? "لوجو الشريك" : "Partner Logo"}</label>
                    <div className="flex gap-3">
                      <input type="text" value={partnerForm.logo_url} onChange={(e) => setPartnerForm((prev) => ({ ...prev, logo_url: e.target.value }))} placeholder="URL..." className={`${inputCls} flex-1`} />
                      <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs text-aura-dark hover:border-aura-accent cursor-pointer transition-all shrink-0">
                        <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />
                        {isAr ? "رفع" : "Upload"}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadImage(file, "partner"); if (url) setPartnerForm((prev) => ({ ...prev, logo_url: url })); }} />
                      </label>
                    </div>
                    {partnerForm.logo_url && <div className="mt-2 h-16 w-32 rounded-xl border border-aura-border overflow-hidden bg-aura-canvas flex items-center justify-center"><img src={partnerForm.logo_url} alt="preview" className="max-h-full max-w-full object-contain p-2" /></div>}
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={savePartner} disabled={savingPartner || !partnerForm.name} className="px-6 py-3 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">{savingPartner ? (isAr ? "جاري الحفظ..." : "Saving...") : editingPartner ? (isAr ? "تحديث" : "Update") : (isAr ? "إضافة" : "Add")}</button>
                  {editingPartner && <button onClick={() => { setEditingPartner(null); setPartnerForm(emptyPartner); }} className="px-6 py-3 rounded-2xl border border-aura-border text-aura-muted text-sm hover:text-aura-dark transition-all">{isAr ? "إلغاء" : "Cancel"}</button>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="bento-card bg-aura-card rounded-2xl p-4 md:p-5 border border-aura-border">
                    <div className="flex items-center gap-4 mb-4">
                      {partner.logo_url ? <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-aura-border bg-aura-canvas flex items-center justify-center overflow-hidden shrink-0"><img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain p-1" /></div> : <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-aura-accent/10 flex items-center justify-center shrink-0"><span className="text-sm font-bold text-aura-accent">{partner.name.slice(0, 2)}</span></div>}
                      <div><h4 className="text-sm font-medium text-aura-dark">{partner.name}</h4><span className={`text-[10px] px-2 py-0.5 rounded-full ${partner.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{partner.active ? (isAr ? "نشط" : "Active") : (isAr ? "متوقف" : "Inactive")}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingPartner(partner.id); setPartnerForm({ name: partner.name, logo_url: partner.logo_url || "", order_num: String(partner.order_num) }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 py-2 rounded-xl border border-aura-border text-xs text-aura-dark hover:border-aura-accent transition-all">{isAr ? "تعديل" : "Edit"}</button>
                      <button onClick={() => togglePartnerActive(partner.id, !partner.active)} className={`flex-1 py-2 rounded-xl border text-xs transition-all ${partner.active ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>{partner.active ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تفعيل" : "Activate")}</button>
                      <button onClick={() => deletePartner(partner.id)} className="py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-all">{isAr ? "حذف" : "Del"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── المقالات ── */}
          {activeTab === "blog" && isFullAdmin && (
            <div className="space-y-8">
              <div className="bento-card bg-aura-card rounded-3xl p-5 md:p-6 border border-aura-border">
                <h3 className="text-base font-medium text-aura-dark mb-1">{editingPost ? (isAr ? "تعديل مقال" : "Edit Post") : (isAr ? "إضافة مقال جديد" : "Add New Post")}</h3>
                <div className="w-8 h-0.5 bg-aura-accent mb-5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label><input type="text" value={postForm.title_ar} onChange={(e) => setPostForm((prev) => ({ ...prev, title_ar: e.target.value }))} className={inputCls} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label><input type="text" value={postForm.title_en} onChange={(e) => setPostForm((prev) => ({ ...prev, title_en: e.target.value }))} className={inputCls} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "ملخص (عربي)" : "Excerpt (Arabic)"}</label><textarea rows={2} value={postForm.excerpt_ar} onChange={(e) => setPostForm((prev) => ({ ...prev, excerpt_ar: e.target.value }))} className={textareaCls} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "ملخص (إنجليزي)" : "Excerpt (English)"}</label><textarea rows={2} value={postForm.excerpt_en} onChange={(e) => setPostForm((prev) => ({ ...prev, excerpt_en: e.target.value }))} className={textareaCls} /></div>
                  <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-medium text-aura-dark">{isAr ? "المحتوى (عربي)" : "Content (Arabic)"}</label><textarea rows={5} value={postForm.content_ar} onChange={(e) => setPostForm((prev) => ({ ...prev, content_ar: e.target.value }))} className={textareaCls} /></div>
                  <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-medium text-aura-dark">{isAr ? "المحتوى (إنجليزي)" : "Content (English)"}</label><textarea rows={5} value={postForm.content_en} onChange={(e) => setPostForm((prev) => ({ ...prev, content_en: e.target.value }))} className={textareaCls} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-aura-dark">{isAr ? "الفئة" : "Category"}</label><input type="text" value={postForm.category} onChange={(e) => setPostForm((prev) => ({ ...prev, category: e.target.value }))} className={inputCls} /></div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-aura-dark">{isAr ? "صورة المقال" : "Post Image"}</label>
                    <div className="flex gap-3">
                      <input type="text" value={postForm.image_url} onChange={(e) => setPostForm((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="https://..." className={`${inputCls} flex-1`} />
                      <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs text-aura-dark hover:border-aura-accent cursor-pointer transition-all shrink-0">
                        {uploadingPostImg ? <div className="w-4 h-4 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" /> : <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />}
                        {isAr ? "رفع" : "Upload"}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingPostImg(true); const url = await uploadImage(file, "blog"); setUploadingPostImg(false); if (url) setPostForm((prev) => ({ ...prev, image_url: url })); }} />
                      </label>
                    </div>
                    {postForm.image_url && <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-aura-border"><img src={postForm.image_url} alt="preview" className="w-full h-full object-cover" /></div>}
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={savePost} disabled={savingPost || !postForm.title_ar || !postForm.title_en} className="px-6 py-3 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">{savingPost ? (isAr ? "جاري الحفظ..." : "Saving...") : editingPost ? (isAr ? "تحديث" : "Update") : (isAr ? "إضافة" : "Add")}</button>
                  {editingPost && <button onClick={() => { setEditingPost(null); setPostForm(emptyPost); }} className="px-6 py-3 rounded-2xl border border-aura-border text-aura-muted text-sm hover:text-aura-dark transition-all">{isAr ? "إلغاء" : "Cancel"}</button>}
                </div>
              </div>
              {blogPosts.length === 0 ? <div className="text-center py-16 text-aura-muted bg-aura-card rounded-3xl border border-aura-border">{isAr ? "لا توجد مقالات بعد" : "No blog posts yet"}</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border">
                      {post.image_url && <div className="h-40 overflow-hidden"><img src={post.image_url} alt={post.title_en} className="w-full h-full object-cover" /></div>}
                      <div className="p-4 md:p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-medium text-aura-dark line-clamp-2">{isAr ? post.title_ar : post.title_en}</h4>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${post.published ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{post.published ? (isAr ? "منشور" : "Published") : (isAr ? "مسودة" : "Draft")}</span>
                        </div>
                        {post.category && <span className="inline-block px-2 py-0.5 rounded-full bg-aura-accent/10 text-aura-accent text-[10px] mb-2">{post.category}</span>}
                        <p className="text-xs text-aura-muted mb-4 line-clamp-2">{isAr ? post.excerpt_ar : post.excerpt_en}</p>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingPost(post.id); setPostForm({ title_ar: post.title_ar || "", title_en: post.title_en || "", excerpt_ar: post.excerpt_ar || "", excerpt_en: post.excerpt_en || "", content_ar: post.content_ar || "", content_en: post.content_en || "", category: post.category || "", image_url: post.image_url || "" }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 py-2 rounded-xl border border-aura-border text-xs text-aura-dark hover:border-aura-accent transition-all">{isAr ? "تعديل" : "Edit"}</button>
                          <button onClick={() => togglePostPublished(post.id, !post.published)} className={`flex-1 py-2 rounded-xl border text-xs transition-all ${post.published ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>{post.published ? (isAr ? "إلغاء النشر" : "Unpublish") : (isAr ? "نشر" : "Publish")}</button>
                          <button onClick={() => deletePost(post.id)} className="py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-all">{isAr ? "حذف" : "Del"}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── الإعدادات ── */}
          {activeTab === "settings" && isFullAdmin && (
            <div className="space-y-6 md:space-y-8">
              {settingsSaved && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">
                  <HiOutlineCheckBadge className="w-4 h-4 shrink-0" />
                  {isAr ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!"}
                </div>
              )}
              {settingsGroups.map((group) => (
                <div key={group.title_en} className="bento-card bg-aura-card rounded-3xl p-5 md:p-6 border border-aura-border">
                  <h3 className="text-base font-medium text-aura-dark mb-1">{isAr ? group.title_ar : group.title_en}</h3>
                  <div className="w-8 h-0.5 bg-aura-accent mb-5" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.fields.map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-xs font-medium text-aura-dark">{isAr ? field.label_ar : field.label_en}</label>
                        {imageSettingKeys.includes(field.key) ? (
                          <div className="space-y-2">
                            <div className="flex gap-3">
                              <input type="text" value={siteSettings[field.key] || ""} onChange={(e) => setSiteSettings((prev) => ({ ...prev, [field.key]: e.target.value }))} placeholder="https://..." className={`${inputCls} flex-1`} />
                              <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-aura-border bg-aura-canvas text-xs text-aura-dark hover:border-aura-accent cursor-pointer transition-all shrink-0">
                                {uploadingSettingImg ? <div className="w-4 h-4 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" /> : <HiOutlinePhoto className="w-4 h-4 text-aura-accent" />}
                                {isAr ? "رفع" : "Upload"}
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingSettingImg(true); const url = await uploadImage(file, "setting"); setUploadingSettingImg(false); if (url) setSiteSettings((prev) => ({ ...prev, [field.key]: url })); }} />
                              </label>
                            </div>
                            {siteSettings[field.key] && <div className="h-24 w-full rounded-xl overflow-hidden border border-aura-border"><img src={siteSettings[field.key]} alt="preview" className="w-full h-full object-cover" /></div>}
                          </div>
                        ) : textareaKeys.includes(field.key) ? (
                          <textarea rows={8} value={siteSettings[field.key] || ""} onChange={(e) => setSiteSettings((prev) => ({ ...prev, [field.key]: e.target.value }))} className={textareaCls} />
                        ) : (
                          <input type="text" value={siteSettings[field.key] || ""} onChange={(e) => setSiteSettings((prev) => ({ ...prev, [field.key]: e.target.value }))} className={inputCls} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={saveSettings} disabled={savingSettings} className="px-8 py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all disabled:opacity-50">
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