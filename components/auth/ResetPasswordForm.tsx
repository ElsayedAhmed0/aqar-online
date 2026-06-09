"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

export default function ResetPasswordForm() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.password || !form.confirmPassword) {
      setError(isAr ? "يرجى ملء جميع الحقول" : "Please fill all fields");
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
    // هنا هيتربط بـ Supabase لاحقاً
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
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

      {done ? (
        /* شاشة النجاح */
        <div className="flex flex-col items-center text-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-light text-aura-dark">
            {isAr ? "تم تحديث كلمة المرور!" : "Password Updated!"}
          </h2>
          <p className="text-aura-muted text-sm font-light">
            {isAr
              ? "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة"
              : "You can now sign in with your new password"}
          </p>
          <button
            onClick={() => router.push(`/${locale}/login`)}
            className="mt-4 px-8 py-3 rounded-2xl bg-aura-accent text-white text-sm font-medium hover:bg-aura-dark transition-all duration-300"
          >
            {isAr ? "تسجيل الدخول الآن" : "Sign In Now"}
          </button>
        </div>
      ) : (
        <>
          {/* العنوان */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-aura-dark mb-2">
              {isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"}
            </h1>
            <p className="text-aura-muted text-sm font-light">
              {isAr
                ? "قم بتعيين كلمة مرور جديدة قوية لحماية حسابك"
                : "Set a new strong password to protect your account"}
            </p>
          </div>

          {/* الـ Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">

            {/* كلمة المرور الجديدة */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">
                {isAr ? "كلمة المرور الجديدة" : "New Password"}
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

            {/* تأكيد كلمة المرور */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-dark">
                {isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
              </label>
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
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-accent transition-colors"
                >
                  {showConfirm ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* زر التحديث */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? (isAr ? "جاري التحديث..." : "Updating...")
                : (isAr ? "تحديث كلمة المرور والدخول" : "Update Password")}
            </button>

          </div>
        </>
      )}
    </div>
  );
}