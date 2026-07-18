"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useSettings } from "@/lib/hooks/useSettings";
import { useAuth } from "@/context/AuthContext";
import {
  HiOutlinePhone, HiOutlineMapPin, HiOutlineCheckCircle, HiOutlineLockClosed,
} from "react-icons/hi2";

export default function ContactSection() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { settings } = useSettings();
  const { user } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ نملأ بيانات المستخدم المسجّل دخول تلقائيًا (ونمنع التعديل فيها)
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, email")
        .eq("id", user.id)
        .single();

      setForm((prev) => ({
        ...prev,
        name: profile?.full_name || user.user_metadata?.full_name || "",
        phone: profile?.phone || user.user_metadata?.phone || "",
        email: profile?.email || user.email || "",
      }));
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.message) {
      setError(isAr ? "يرجى كتابة الرسالة" : "Please write your message");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: dbError } = await supabase.from("messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    });
    setLoading(false);
    if (dbError) {
      setError(isAr ? "حدث خطأ، حاول مرة أخرى" : "An error occurred, please try again");
      return;
    }
    setSent(true);
  };

  const contactItems = [
    { icon: <HiOutlinePhone className="w-5 h-5"/>, label: isAr ? "اتصل بنا" : "Call Us", value: settings.footer_phone || "920001234", href: `tel:${settings.footer_phone || "920001234"}` },
    // ✅ إيميل الشركة معلَّق مؤقتًا لحد ما يتعمل إيميل رسمي باسم الموقع
    // { icon: <HiOutlineEnvelope className="w-5 h-5"/>, label: isAr ? "راسلنا" : "Email Us", value: settings.footer_email || "info@aqar-online.com", href: `mailto:${settings.footer_email || "info@aqar-online.com"}` },
    { icon: <HiOutlineMapPin className="w-5 h-5"/>, label: isAr ? "عنواننا" : "Our Address", value: isAr ? (settings.footer_address_ar || "التجمع الخامس، القاهرة") : (settings.footer_address_en || "New Cairo, Egypt"), href: "#" },
  ];

  const inputCls = "w-full px-4 py-3 rounded-xl bg-aura-canvas border border-aura-border text-aura-dark text-sm outline-none focus:border-aura-accent transition-colors placeholder:text-aura-muted/50";
  const disabledInputCls = "w-full px-4 py-3 rounded-xl bg-aura-canvas/50 border border-aura-border text-aura-muted text-sm outline-none cursor-not-allowed";

  return (
    <section id="contact" className="py-24 px-6 lg:px-12 bg-aura-bg">
      <div className="max-w-7xl mx-auto">

        {/* العنوان */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mb-4">
            {isAr ? "تواصل معنا" : "Get In Touch"}
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-aura-dark">
            {isAr ? "نحن هنا" : "We Are"}
            <span className="block font-serif italic text-aura-accent mt-1">
              {isAr ? "لمساعدتك" : "Here To Help"}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* معلومات التواصل */}
          <div className="space-y-8">
            <div className="relative h-64 rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="contact" className="w-full h-full object-cover img-hover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/60 to-transparent"/>
              <div className="absolute bottom-6 right-6">
                <p className="text-white font-light text-lg">{isAr ? "فريقنا جاهز لمساعدتك" : "Our team is ready to help"}</p>
              </div>
            </div>

            <div className="space-y-4">
              {contactItems.map((item) => (
                <a key={item.label} href={item.href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-aura-canvas border border-aura-border hover:border-aura-accent transition-all duration-300 block">
                  <div className="w-10 h-10 rounded-xl bg-aura-accent/10 flex items-center justify-center text-aura-accent shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-aura-muted mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-aura-dark">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* الفورم */}
          <div className="bg-aura-card rounded-3xl p-8 border border-aura-border">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-8 h-8 text-green-500"/>
                </div>
                <h3 className="text-xl font-light text-aura-dark">{isAr ? "تم الإرسال بنجاح!" : "Message Sent!"}</h3>
                <p className="text-aura-muted text-sm text-center">{isAr ? "سيتواصل معك فريقنا في أقرب وقت" : "Our team will contact you shortly"}</p>
                <button onClick={() => { setSent(false); setForm((prev) => ({ ...prev, subject: "", message: "" })); }}
                  className="mt-4 px-6 py-2.5 rounded-full border border-aura-border text-sm text-aura-muted hover:text-aura-dark transition-colors">
                  {isAr ? "إرسال رسالة أخرى" : "Send Another"}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-xl font-light text-aura-dark mb-2">{isAr ? "أرسل لنا رسالة" : "Send Us a Message"}</h3>

                {!user && (
                  <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                    <HiOutlineLockClosed className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">{isAr ? "لازم تسجّل دخول الأول عشان تقدر تبعت رسالة." : "You need to log in first to send a message."}</p>
                      <a href={`/${locale}/login`} className="inline-block px-4 py-2 rounded-full bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors">
                        {isAr ? "تسجيل الدخول" : "Log In"}
                      </a>
                    </div>
                  </div>
                )}

                {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-aura-muted">{isAr ? "الاسم الكامل" : "Full Name"}</label>
                    <input type="text" value={form.name} readOnly disabled
                      placeholder={isAr ? "أدخل اسمك..." : "Your name..."} className={disabledInputCls}/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-aura-muted">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
                    <input type="tel" value={form.phone} readOnly disabled
                      placeholder="01xxxxxxxxx" className={disabledInputCls} dir="ltr"/>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-aura-muted">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                  <input type="email" value={form.email} readOnly disabled
                    placeholder={isAr ? "بريدك الإلكتروني..." : "your@email.com"} className={disabledInputCls} dir="ltr"/>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-aura-muted">{isAr ? "الموضوع" : "Subject (optional)"}</label>
                  <input type="text" value={form.subject} disabled={!user} onChange={(e) => setForm({...form, subject: e.target.value})}
                    placeholder={isAr ? "موضوع رسالتك..." : "Message subject..."} className={user ? inputCls : disabledInputCls}/>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-aura-muted">{isAr ? "رسالتك *" : "Message *"}</label>
                  <textarea value={form.message} disabled={!user} onChange={(e) => setForm({...form, message: e.target.value})}
                    placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message..."} rows={4}
                    className={`${user ? inputCls : disabledInputCls} resize-none`}/>
                </div>

                <button onClick={handleSubmit} disabled={loading || !user || !form.message}
                  className="w-full py-4 rounded-xl bg-aura-dark text-white text-sm font-medium hover:bg-aura-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (isAr ? "جاري الإرسال..." : "Sending...") : (isAr ? "إرسال الرسالة" : "Send Message")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}