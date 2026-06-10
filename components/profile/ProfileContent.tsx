"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { MdOutlineListAlt, MdOutlineAddHome } from "react-icons/md";

export default function ProfileContent() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, loading, router, locale]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
      });
    }
  }, [user]);

  const getInitials = () => {
    const name = user?.user_metadata?.full_name;
    if (name) {
      return name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "?";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError(isAr ? "يرجى إدخال الاسم الكامل" : "Please enter your full name");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: form.name.trim(),
        phone: form.phone.trim(),
      },
    });

    if (error) {
      setError(isAr ? "حدث خطأ أثناء حفظ البيانات" : "Error saving profile");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* بطاقة المستخدم */}
      <div className="lg:col-span-1">
        <div className="bento-card bg-aura-card rounded-3xl p-8 flex flex-col items-center text-center">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              className="w-24 h-24 rounded-full object-cover mb-4"
              alt="avatar"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-aura-accent flex items-center justify-center text-white text-2xl font-semibold mb-4">
              {getInitials()}
            </div>
          )}

          <h2 className="text-xl font-light text-aura-dark mb-1">
            {user.user_metadata?.full_name || user.email?.split("@")[0]}
          </h2>
          <p className="text-sm text-aura-muted mb-6" dir="ltr">
            {user.email}
          </p>

          {user.created_at && (
            <div className="flex items-center gap-2 text-xs text-aura-muted">
              <HiOutlineCalendar className="w-4 h-4 text-aura-accent" />
              {isAr ? "عضو منذ" : "Member since"} {formatDate(user.created_at)}
            </div>
          )}

          {/* روابط سريعة */}
          <div className="w-full mt-8 pt-6 border-t border-aura-border space-y-3">
            <a
              href={`/${locale}/dashboard`}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs text-aura-dark border border-aura-border hover:border-aura-accent hover:bg-aura-canvas transition-all duration-300"
            >
              <MdOutlineListAlt className="w-4 h-4 text-aura-accent shrink-0" />
              {isAr ? "إعلاناتي" : "My Listings"}
            </a>
            <a
              href={`/${locale}/add-listing`}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs text-white bg-aura-accent hover:bg-aura-accent-dark transition-all duration-300"
            >
              <MdOutlineAddHome className="w-4 h-4 shrink-0" />
              {isAr ? "أضف إعلانك" : "Add Listing"}
            </a>
          </div>
        </div>
      </div>

      {/* نموذج التعديل */}
      <div className="lg:col-span-2">
        <div className="bento-card bg-aura-card rounded-3xl p-8">
          <h3 className="text-lg font-light text-aura-dark mb-6">
            {isAr ? "معلومات الحساب" : "Account Information"}
          </h3>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">
              {isAr ? "تم حفظ البيانات بنجاح" : "Profile updated successfully"}
            </div>
          )}

          <div className="space-y-5">

            {/* الاسم */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">
                {isAr ? "الاسم الكامل" : "Full Name"}
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={isAr ? "أدخل اسمك بالكامل" : "Enter your full name"}
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
                />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">
                {isAr ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="relative">
                <HiOutlinePhone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
                  dir="ltr"
                />
              </div>
            </div>

            {/* البريد — للقراءة فقط */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">
                {isAr ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-muted" />
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl border border-aura-border bg-aura-canvas text-aura-muted text-sm cursor-not-allowed"
                  dir="ltr"
                />
              </div>
              <p className="text-[10px] text-aura-muted">
                {isAr
                  ? "لا يمكن تغيير البريد الإلكتروني"
                  : "Email address cannot be changed"}
              </p>
            </div>

            {/* زر الحفظ */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {saving
                ? isAr
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isAr
                  ? "حفظ التغييرات"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
