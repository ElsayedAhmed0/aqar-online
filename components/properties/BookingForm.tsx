"use client";

import { useState } from "react";
import {
    HiOutlineCheckCircle,
    HiOutlinePhone,
    HiOutlineCalendar,
    HiOutlineUser,
} from "react-icons/hi2";

// ── كارت إظهار بيانات التواصل ──
function ContactReveal({ property, isAr }: { property: any; isAr: boolean }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="bento-card bg-aura-dark rounded-3xl p-6 border border-aura-border mt-4">
            <h3 className="text-base font-light text-white mb-1">
                {isAr ? "تواصل مع صاحب الإعلان" : "Contact the Owner"}
            </h3>
            <p className="text-xs text-white/50 mb-5">
                {isAr ? "اضغط لإظهار بيانات التواصل" : "Click to reveal contact details"}
            </p>

            {!revealed ? (
                <button
                    onClick={() => setRevealed(true)}
                    className="w-full py-3.5 rounded-2xl bg-aura-accent hover:bg-aura-accent-dark text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <HiOutlinePhone className="w-4 h-4" />
                    {isAr ? "إظهار بيانات التواصل" : "Reveal Contact Info"}
                </button>
            ) : (
                <div className="flex flex-col gap-3">
                    {/* الرقم */}
                    <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/10">
                        <HiOutlinePhone className="w-4 h-4 text-aura-accent" />
                        <span className="text-white font-medium text-sm" dir="ltr">
                            {property.phone}
                        </span>
                    </div>

                    {/* زرار الاتصال */}

                    <a href={`tel:${property.phone}`}
                        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-300 border border-white/10"
                    >
                        <HiOutlinePhone className="w-4 h-4" />
                        {isAr ? "اتصال مباشر" : "Call Now"}
                    </a>

                    {/* زرار الواتساب */}

                    <a href={`https://wa.me/${property.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                        isAr
                            ? `مرحباً، أنا مهتم بالعقار: ${property.title_ar}`
                            : `Hello, I'm interested in the property: ${property.title_en}`
                    )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-all duration-300"
                    >
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {isAr ? "واتساب" : "WhatsApp"}
                    </a>
                </div>
            )}
        </div>
    );
}

// ── الفورم الرئيسي ──
export default function BookingForm({
    property,
    isAr,
}: {
    property: any;
    isAr: boolean;
}) {
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

        if (!error) {
            setSent(true);
        } else {
            console.error("Booking error:", error);
        }

        setLoading(false);
    };

    const inputCls =
        "w-full px-4 py-3.5 rounded-2xl border border-aura-border bg-aura-canvas text-aura-dark text-sm outline-none focus:border-aura-accent focus:ring-4 focus:ring-aura-accent/10 transition-all duration-300 placeholder:text-aura-muted/50";

    return (
        <div className="sticky top-28 space-y-4">

            {/* فورم الحجز */}
            <div className="bento-card bg-aura-card rounded-3xl p-6 border border-aura-border">
                {sent ? (
                    <div className="flex flex-col items-center text-center py-8 gap-4">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                            <HiOutlineCheckCircle className="w-7 h-7 text-green-500" />
                        </div>
                        <h3 className="text-lg font-light text-aura-dark">
                            {isAr ? "تم تسجيل طلبك!" : "Request Submitted!"}
                        </h3>
                        <p className="text-aura-muted text-sm font-light">
                            {isAr
                                ? "سيتواصل معك مستشارنا العقاري خلال ساعة"
                                : "Our agent will contact you within an hour"}
                        </p>
                        <button
                            onClick={() => { setSent(false); setForm({ name: "", phone: "", date: "" }); }}
                            className="mt-2 px-6 py-2.5 rounded-full border border-aura-border text-xs text-aura-muted hover:text-aura-dark transition-colors"
                        >
                            {isAr ? "طلب آخر" : "New Request"}
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-light text-aura-dark mb-1">
                            {isAr ? "احجز موعد زيارة" : "Book a Visit"}
                        </h3>
                        <p className="text-xs text-aura-muted mb-6">
                            {isAr
                                ? "سيتواصل معك مستشارنا لتأكيد الموعد"
                                : "Our agent will confirm your appointment"}
                        </p>

                        <div className="space-y-4">
                            {/* الاسم */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-aura-dark flex items-center gap-1.5">
                                    <HiOutlineUser className="w-3.5 h-3.5 text-aura-accent" />
                                    {isAr ? "الاسم الكامل" : "Full Name"}
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder={isAr ? "أدخل اسمك..." : "Enter your name..."}
                                    className={inputCls}
                                />
                            </div>

                            {/* الهاتف */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-aura-dark flex items-center gap-1.5">
                                    <HiOutlinePhone className="w-3.5 h-3.5 text-aura-accent" />
                                    {isAr ? "رقم الهاتف" : "Phone Number"}
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="01xxxxxxxxx"
                                    className={inputCls}
                                    dir="ltr"
                                />
                            </div>

                            {/* التاريخ */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-aura-dark flex items-center gap-1.5">
                                    <HiOutlineCalendar className="w-3.5 h-3.5 text-aura-accent" />
                                    {isAr ? "تاريخ الزيارة" : "Visit Date"}
                                </label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    min={new Date().toISOString().split("T")[0]}
                                    className={inputCls}
                                    dir="ltr"
                                />
                            </div>

                            {/* زر الحجز */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !form.name || !form.phone || !form.date}
                                className="w-full py-4 rounded-2xl bg-aura-accent hover:bg-aura-dark text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? (isAr ? "جاري الإرسال..." : "Sending...")
                                    : (isAr ? "تأكيد الحجز" : "Confirm Booking")}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* كارت التواصل */}
            <ContactReveal property={property} isAr={isAr} />
        </div>
    );
}