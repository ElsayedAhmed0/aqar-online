"use client";

import { useState } from "react";
import {
  HiOutlineCheckCircle, HiOutlinePhone,
  HiOutlineCalendar, HiOutlineUser,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";

function ContactReveal({ property, isAr }: { property: any; isAr: boolean }) {
  const [revealed, setRevealed] = useState(false);

  const phone = property.phone || "";
  const whatsapp = property.whatsapp || property.phone || "";
  const phoneClean = phone.replace(/\D/g, "");
  const waClean = whatsapp.replace(/\D/g, "");

  const waMsg = encodeURIComponent(
    isAr
      ? `مرحباً، أنا مهتم بالعقار: ${property.title_ar}`
      : `Hello, I'm interested in the property: ${property.title_en}`
  );

  return (
    <div className="bento-card bg-aura-dark rounded-3xl p-6 border border-aura-border">
      <h3 className="text-base font-light text-white mb-1">
        {isAr ? "تواصل مع صاحب الإعلان" : "Contact the Owner"}
      </h3>
      <p className="text-xs text-white/50 mb-5">
        {isAr ? "اضغط لإظهار بيانات التواصل" : "Click to reveal contact details"}
      </p>

      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          className="w-full py-3.5 rounded-2xl bg-aura-accent hover:bg-aura-accent-dark text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2">
          <HiOutlinePhone className="w-4 h-4"/>
          {isAr ? "إظهار بيانات التواصل" : "Reveal Contact Info"}
        </button>
      ) : (
        <div className="flex flex-col gap-3">

          {/* رقم الهاتف */}
          <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/10">
            <HiOutlinePhone className="w-4 h-4 text-aura-accent"/>
            <span className="text-white font-medium text-sm" dir="ltr">{phone}</span>
          </div>

          {/* واتساب — لو مختلف عن الهاتف */}
          {property.whatsapp && property.whatsapp !== phone && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/10">
              <FaWhatsapp className="w-4 h-4 text-green-400"/>
              <span className="text-white font-medium text-sm" dir="ltr">{property.whatsapp}</span>
            </div>
          )}

          {/* زرار اتصال */}
          <a href={`tel:${phoneClean}`}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-300 border border-white/10">
            <HiOutlinePhone className="w-4 h-4"/>
            {isAr ? "اتصال مباشر" : "Call Now"}
          </a>

          {/* زرار واتساب */}
          <a href={`https://wa.me/${waClean}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-all duration-300">
            <FaWhatsapp className="w-4 h-4"/>
            {isAr ? "تواصل عبر واتساب" : "WhatsApp"}
          </a>

        </div>
      )}
    </div>
  );
}

export default function BookingForm({ property, isAr }: { property: any; isAr: boolean }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.date) return;
    setLoading(true);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      listing_id: property.id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      date: form.date,
    });
    if (!error) setSent(true);
    else console.error("Booking error:", error);
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50";

  return (
    <div className="sticky top-28 space-y-4">

      {/* فورم الحجز */}
      <div className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border">
        {sent ? (
          <div className="flex flex-col items-center text-center py-8 gap-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-7 h-7 text-green-500"/>
            </div>
            <h3 className="text-lg font-light text-aura-dark">{isAr ? "تم تسجيل طلبك!" : "Request Submitted!"}</h3>
            <p className="text-aura-muted text-sm font-light">
              {isAr ? "سيتواصل معك مستشارنا العقاري خلال ساعة" : "Our agent will contact you within an hour"}
            </p>
            <button onClick={() => { setSent(false); setForm({ name: "", phone: "", date: "" }); }}
              className="mt-2 px-6 py-2.5 rounded-full border border-aura-border text-xs text-aura-muted hover:text-aura-dark transition-colors">
              {isAr ? "طلب آخر" : "New Request"}
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-light text-aura-dark mb-1">{isAr ? "احجز موعد زيارة" : "Book a Visit"}</h3>
            <p className="text-xs text-aura-muted mb-6">
              {isAr ? "سيتواصل معك مستشارنا لتأكيد الموعد" : "Our agent will confirm your appointment"}
            </p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark flex items-center gap-1.5">
                  <HiOutlineUser className="w-3.5 h-3.5 text-aura-accent"/>
                  {isAr ? "الاسم الكامل" : "Full Name"}
                </label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={isAr ? "أدخل اسمك..." : "Enter your name..."} className={inputCls}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark flex items-center gap-1.5">
                  <HiOutlinePhone className="w-3.5 h-3.5 text-aura-accent"/>
                  {isAr ? "رقم الهاتف" : "Phone Number"}
                </label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01xxxxxxxxx" className={inputCls} dir="ltr"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-dark flex items-center gap-1.5">
                  <HiOutlineCalendar className="w-3.5 h-3.5 text-aura-accent"/>
                  {isAr ? "تاريخ الزيارة" : "Visit Date"}
                </label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]} className={inputCls} dir="ltr"/>
              </div>
              <button onClick={handleSubmit} disabled={loading || !form.name || !form.phone || !form.date}
                className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (isAr ? "جاري الإرسال..." : "Sending...") : (isAr ? "تأكيد الحجز" : "Confirm Booking")}
              </button>
            </div>
          </>
        )}
      </div>

      {/* كارت التواصل */}
      <ContactReveal property={property} isAr={isAr}/>

    </div>
  );
}