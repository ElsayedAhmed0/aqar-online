"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { HiOutlineEnvelope, HiOutlineArrowRight, HiOutlineCheckCircle } from "react-icons/hi2";

export default function ForgotPasswordForm() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError(isAr ? "يرجى إدخال البريد الإلكتروني" : "Please enter your email");
      return;
    }
    setLoading(true);
    setError("");

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    });

    if (error) {
      setError(isAr ? "حدث خطأ أثناء الإرسال" : "Error sending reset email");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSent(true);
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

      {/* رابط الرجوع */}

      <a href={`/${locale}/login`}
        className="flex items-center gap-2 text-sm text-aura-muted hover:text-aura-accent transition-colors mb-8 w-fit"
      >
        <HiOutlineArrowRight className="w-4 h-4" />
        {isAr ? "العودة لتسجيل الدخول" : "Back to Login"}
      </a>

      {sent ? (
        /* شاشة النجاح */
        <div className="flex flex-col items-center text-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-light text-aura-dark">
            {isAr ? "تم الإرسال بنجاح!" : "Email Sent!"}
          </h2>
          <p className="text-aura-muted text-sm font-light max-w-xs">
            {isAr
              ? `تم إرسال رابط استعادة كلمة المرور إلى ${email}`
              : `Password reset link has been sent to ${email}`}
          </p>

          <a href={`/${locale}/login`}
            className="mt-4 px-8 py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all duration-300"
          >
            {isAr ? "العودة لتسجيل الدخول" : "Back to Login"}
          </a>
        </div>
      ) : (
        <>
          {/* العنوان */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-aura-dark mb-2">
              {isAr ? "نسيت كلمة المرور؟" : "Forgot Password?"}
            </h1>
            <p className="text-aura-muted text-sm font-light">
              {isAr
                ? "أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لاستعادة الوصول"
                : "Enter your email and we'll send you a secure reset link"}
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
                {isAr ? "البريد الإلكتروني المسجل" : "Registered Email"}
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-accent" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl border border-aura-border bg-white text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50"
                  dir="ltr"
                />
              </div>
            </div>

            {/* زر الإرسال */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? (isAr ? "جاري الإرسال..." : "Sending...")
                : (isAr ? "إرسال رابط الاستعادة" : "Send Reset Link")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}