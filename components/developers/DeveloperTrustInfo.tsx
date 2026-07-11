"use client";

import { HiOutlineShieldCheck, HiOutlineDocumentCheck, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function DeveloperTrustInfo({ isAr }: { isAr: boolean }) {
    const items = [
        {
            icon: <HiOutlineShieldCheck className="w-5 h-5" />,
            color: "bg-emerald-50 text-emerald-600",
            title: isAr ? "وسيط موثّق" : "Verified Agent",
            desc: isAr
                ? "كل وسيط بيظهر هنا بيتراجع من فريقنا قبل ما صفحته تنشر للعامة."
                : "Every agent shown here is reviewed by our team before their page goes live.",
        },
        {
            icon: <HiOutlineDocumentCheck className="w-5 h-5" />,
            color: "bg-sky-50 text-sky-600",
            title: isAr ? "إعلانات معتمدة" : "Approved Listings",
            desc: isAr
                ? "كل عقار بيتراجع بشكل فردي قبل النشر، عشان تتصفح بثقة."
                : "Every property is individually reviewed before publishing, so you can browse with confidence.",
        },
        {
            icon: <HiOutlineChatBubbleLeftRight className="w-5 h-5" />,
            color: "bg-violet-50 text-violet-600",
            title: isAr ? "تواصل مباشر" : "Direct Contact",
            desc: isAr
                ? "تقدر تتواصل مع الوسيط مباشرة عبر واتساب أو اتصال من صفحته."
                : "Reach the agent directly via WhatsApp or a phone call from their page.",
        },
    ];

    return (
        <div className="bento-card bg-aura-card rounded-3xl border border-aura-border p-6 lg:sticky lg:top-28">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-aura-accent/10 flex items-center justify-center mb-4">
                    <HiOutlineShieldCheck className="w-7 h-7 text-aura-accent" />
                </div>
                <h3 className="text-base font-medium text-aura-dark mb-1">
                    {isAr ? "ليه تثق في وسطائنا؟" : "Why Trust Our Agents?"}
                </h3>
                <p className="text-xs text-aura-muted font-light">
                    {isAr
                        ? "كل وسيط وكل إعلان بيمر بمراجعة قبل النشر"
                        : "Every agent and listing is reviewed before publishing"}
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {items.map((item, i) => (
                    <div key={i} className="rounded-2xl border border-aura-border p-4">
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${item.color}`}>
                                {item.icon}
                            </div>
                            <p className="text-sm font-medium text-aura-dark">{item.title}</p>
                        </div>
                        <p className="text-xs text-aura-muted font-light leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}