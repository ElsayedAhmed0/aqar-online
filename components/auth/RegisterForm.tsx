"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

export default function RegisterForm() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [accountType, setAccountType] = useState<"user" | "agent">("user");
  const [form, setForm] = useState({
    name: "",
    developerName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError(isAr ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    if (accountType === "agent" && !form.developerName) {
      setError(isAr ? "يرجى كتابة اسم الشركة/الوسيط" : "Please enter your company/agent name");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError(isAr ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale}`,
        data: {
          full_name: form.name,
          phone: form.phone,
          account_type: accountType,
          ...(accountType === "agent" ? { developer_name: form.developerName } : {}),
        },
      },
    });

    if (error) {
      setError(isAr ? "حدث خطأ أثناء إنشاء الحساب" : "Error creating account");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSent(true);
  };

  // شاشة التأكيد
  if (sent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <a href={`/${locale}`} className="flex flex-col mb-10">
          <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-4xl text-aura-dark">عقار</span>
          <span className="text-[9px] tracking-[0.5em] text-aura-muted uppercase -mt-1">Online</span>
        </a>

        <div className="flex flex-col items-center text-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-light text-aura-dark">
            {isAr ? "تحقق من بريدك!" : "Check your email!"}
          </h2>
          <p className="text-aura-muted text-sm font-light max-w-xs leading-relaxed">
            {isAr
              ? `أرسلنا رابط تأكيد إلى ${form.email} — اضغط عليه لتفعيل حسابك ثم سجل دخولك`
              : `We sent a confirmation link to ${form.email} — click it to activate your account then login`}
          </p>

          <a href={`/${locale}/login`}
            className="mt-4 px-8 py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all duration-300"
          >
            {isAr ? "انتقل لتسجيل الدخول" : "Go to Login"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">

      {/* اللوجو */}
      <a href={`/${locale}`} className="flex flex-col mb-8">
        <span style={{ fontFamily: "var(--font-reem-kufi)" }} className="text-4xl text-aura-dark">عقار</span>
        <span className="text-[9px] tracking-[0.5em] text-aura-muted uppercase -mt-1">Online</span>
      </a>

      {/* العنوان */}
      <div className="mb-6">
        <h1 className="text-3xl font-light text-aura-dark mb-2">
          {isAr ? "إنشاء حساب جديد" : "Create Account"}
        </h1>
        <p className="text-aura-muted text-sm font-light">
          {isAr ? "انضم إلينا وابدأ تجربة عقارية لا مثيل لها" : "Join us and start an unmatched real estate experience"}
        </p>
      </div>

      {/* الـ Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">

        {/* نوع الحساب */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-aura-dark">{isAr ? "نوع الحساب" : "Account Type"}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={`py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${
                accountType === "user"
                  ? "bg-aura-dark text-white border-aura-dark"
                  : "border-aura-border text-aura-muted hover:border-aura-accent"
              }`}
            >
              {isAr ? "مستخدم عادي" : "Regular User"}
            </button>
            <button
              type="button"
              onClick={() => setAccountType("agent")}
              className={`py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${
                accountType === "agent"
                  ? "bg-aura-dark text-white border-aura-dark"
                  : "border-aura-border text-aura-muted hover:border-aura-accent"
              }`}
            >
              {isAr ? "وسيط عقاري" : "Real Estate Agent"}
            </button>
          </div>
          {accountType === "agent" && (
            <p className="text-[10px] text-aura-muted pt-1">
              {isAr
                ? "هيكون عندك لوحة خاصة لإدارة صفحتك وإعلاناتك، بعد مراجعة الأدمن"
                : "You'll get a dedicated dashboard to manage your page and listings, pending admin review"}
            </p>
          )}
        </div>

        {/* الاسم */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-aura-dark">{isAr ? "الاسم الكامل" : "Full Name"}</label>
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

        {/* اسم الشركة/الوسيط — يظهر بس لو وسيط */}
        {accountType === "agent" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-aura-dark">{isAr ? "اسم الشركة/الوسيط" : "Company/Agent Name"}</label>
            <div className="relative">
              <HiOutlineUser className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
              <input
                type="text"
                value={form.developerName}
                onChange={(e) => setForm({ ...form, developerName: e.target.value })}
                placeholder={isAr ? "مثال: شركة النور للتطوير العقاري" : "e.g. Al Nour Developments"}
                className="w-full pr-11 pl-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
              />
            </div>
          </div>
        )}

        {/* رقم الهاتف */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-aura-dark">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
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

        {/* البريد */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-aura-dark">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
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
          <label className="text-xs font-medium text-aura-dark">{isAr ? "كلمة المرور" : "Password"}</label>
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
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-accent transition-colors">
              {showPass ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* تأكيد كلمة المرور */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-aura-dark">{isAr ? "تأكيد كلمة المرور" : "Confirm Password"}</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full pr-11 pl-11 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
              dir="ltr"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-accent transition-colors">
              {showConfirm ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* زر إنشاء الحساب */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading
            ? (isAr ? "جاري إنشاء الحساب..." : "Creating account...")
            : (isAr ? "تأكيد التسجيل والانضمام" : "Create Account")}
        </button>

        {/* رابط تسجيل الدخول */}
        <p className="text-center text-sm text-aura-muted pt-2">
          {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
          <a href={`/${locale}/login`} className="text-aura-accent font-medium hover:text-aura-accent-dark transition-colors">
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </a>
        </p>
      </div>
    </div>
  );
}