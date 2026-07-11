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
  HiOutlineCheckCircle,
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
  const [passwordSent, setPasswordSent] = useState(false);

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
      return name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "?";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
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

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: form.name.trim(),
        phone: form.phone.trim(),
      },
    });

    if (authError) {
      setError(isAr ? "حدث خطأ أثناء حفظ البيانات" : "Error saving profile");
      setSaving(false);
      return;
    }

    // حدث الـ profiles table برضو
    await supabase
      .from("profiles")
      .update({
        full_name: form.name.trim(),
        phone: form.phone.trim(),
      })
      .eq("id", user!.id);

    setSuccess(true);
    setSaving(false);
    router.refresh();
  };

  const handlePasswordReset = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(user!.email!, {
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    });
    setPasswordSent(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const inputCls = "w-full pr-11 pl-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* بطاقة المستخدم */}
      <div className="lg:col-span-1">
        <div className="bento-card bg-aura-card rounded-3xl p-8 flex flex-col items-center text-center">

          {/* الصورة أو الأحرف */}
          {/* الصورة أو الأحرف */}
          <div className="relative mb-4 group">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                className="w-24 h-24 rounded-full object-cover"
                alt="avatar"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-aura-accent flex items-center justify-center text-white text-2xl font-semibold">
                {getInitials()}
              </div>
            )}

            {/* زرار رفع الصورة */}
            <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <span className="text-white text-[10px] font-medium">
                {isAr ? "تغيير" : "Change"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const { createClient } = await import("@/lib/supabase/client");
                  const supabase = createClient();

                  // ارفع الصورة
                 const ext = file.name.split(".").pop();
                  const fileName = `${user!.id}/avatar.${ext}`;

                  const { data, error } = await supabase.storage
                    .from("listings")
                    .upload(fileName, file, { upsert: true, contentType: file.type });

                  if (!error && data) {
                    const { data: urlData } = supabase.storage
                      .from("listings")
                      .getPublicUrl(data.path);

                    // حدث الـ metadata
                    await supabase.auth.updateUser({
                      data: { avatar_url: urlData.publicUrl },
                    });

                    // حدث الـ profiles
                    await supabase
                      .from("profiles")
                      .update({ avatar_url: urlData.publicUrl })
                      .eq("id", user!.id);

                    router.refresh();
                    window.location.reload();
                  }
                }}
              />
            </label>
          </div>

          <h2 className="text-xl font-light text-aura-dark mb-1">
            {user.user_metadata?.full_name || user.email?.split("@")[0]}
          </h2>
          <p className="text-sm text-aura-muted mb-6" dir="ltr">{user.email}</p>

          {user.created_at && (
            <div className="flex items-center gap-2 text-xs text-aura-muted">
              <HiOutlineCalendar className="w-4 h-4 text-aura-accent" />
              {isAr ? "عضو منذ" : "Member since"} {formatDate(user.created_at)}
            </div>
          )}

          {/* روابط سريعة */}
          <div className="w-full mt-8 pt-6 border-t border-aura-border space-y-3">

            <a href={`/${locale}/dashboard`}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs text-aura-dark border border-aura-border hover:border-aura-accent hover:bg-aura-canvas transition-all duration-300"
            >
              <MdOutlineListAlt className="w-4 h-4 text-aura-accent shrink-0" />
              {isAr ? "إعلاناتي" : "My Listings"}
            </a>

            <a href={`/${locale}/add-listing`}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs text-white bg-aura-accent hover:bg-aura-dark transition-all duration-300"
            >
              <MdOutlineAddHome className="w-4 h-4 shrink-0" />
              {isAr ? "أضف إعلانك" : "Add Listing"}
            </a>
          </div>
        </div>
      </div>

      {/* نموذج التعديل */}
      <div className="lg:col-span-2 space-y-6">

        {/* معلومات الحساب */}
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
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm flex items-center gap-2">
              <HiOutlineCheckCircle className="w-4 h-4 shrink-0" />
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
                  className={inputCls}
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
                  className={inputCls}
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
                {isAr ? "لا يمكن تغيير البريد الإلكتروني" : "Email address cannot be changed"}
              </p>
            </div>

            {/* زر الحفظ */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? (isAr ? "جاري الحفظ..." : "Saving...")
                : (isAr ? "حفظ التغييرات" : "Save Changes")}
            </button>
          </div>
        </div>

        {/* تغيير كلمة المرور */}
        <div className="bento-card bg-aura-card rounded-3xl p-8">
          <h3 className="text-lg font-light text-aura-dark mb-2">
            {isAr ? "كلمة المرور" : "Password"}
          </h3>
          <p className="text-xs text-aura-muted mb-6">
            {isAr
              ? "سيتم إرسال رابط لتغيير كلمة المرور على بريدك"
              : "A password reset link will be sent to your email"}
          </p>

          {passwordSent ? (
            <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm flex items-center gap-2">
              <HiOutlineCheckCircle className="w-4 h-4 shrink-0" />
              {isAr ? "تم إرسال الرابط على بريدك" : "Reset link sent to your email"}
            </div>
          ) : (
            <button
              onClick={handlePasswordReset}
              className="w-full py-3.5 rounded-2xl border border-aura-border text-aura-dark text-sm font-medium hover:border-aura-accent hover:text-aura-accent transition-all duration-300"
            >
              {isAr ? "إرسال رابط تغيير كلمة المرور" : "Send Password Reset Link"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}