
"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

export default function LoginForm() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError(isAr ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(isAr ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password");
      setLoading(false);
      return;
    }

    window.location.href = `/${locale}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">

      {/* اللوجو */}
      <a href={`/${locale}`} className="flex flex-col mb-10">
        <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-4xl text-aura-dark">
          عقار
        </span>
        <span className="text-[9px] tracking-[0.5em] text-aura-muted uppercase -mt-1">
          Online
        </span>
      </a>

      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-aura-dark mb-2">
          {isAr ? "مرحباً بك مجدداً" : "Welcome Back"}
        </h1>
        <p className="text-aura-muted text-sm font-light">
          {isAr
            ? "سجل دخولك لتستكمل رحلة البحث عن عقارك المفضل"
            : "Sign in to continue your property search journey"}
        </p>
      </div>

      {/* الـ Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">

        {/* البريد */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-aura-dark">
            {isAr ? "البريد الإلكتروني" : "Email Address"}
          </label>
          <div className="relative">
            <HiOutlineEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full pr-11 pl-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
              dir="ltr"
            />
          </div>
        </div>

        {/* كلمة المرور */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-aura-dark">
            {isAr ? "كلمة المرور" : "Password"}
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full pr-11 pl-11 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-accent transition-colors"
            >
              {showPass ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* تذكرني + نسيت كلمة المرور */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              className="w-4 h-4 rounded accent-aura-accent cursor-pointer"
            />
            <span className="text-xs text-aura-muted">
              {isAr ? "تذكرني" : "Remember me"}
            </span>
          </label>

          <a href={`/${locale}/forgot-password`}
            className="text-xs text-aura-accent hover:text-aura-accent-dark transition-colors"
          >
            {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </a>
        </div>

        {/* زر تسجيل الدخول */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading
            ? (isAr ? "جاري تسجيل الدخول..." : "Signing in...")
            : (isAr ? "تسجيل الدخول" : "Sign In")}
        </button>

        {/* رابط إنشاء حساب */}
        <p className="text-center text-sm text-aura-muted pt-2">
          {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}

          <a href={`/${locale}/register`}
            className="text-aura-accent font-medium hover:text-aura-accent-dark transition-colors"
          >
            {isAr ? "إنشاء حساب جديد" : "Create Account"}
          </a>
        </p>

      </div>
    </div>
  );
}