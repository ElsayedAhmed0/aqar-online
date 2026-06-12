"use client";

import { useState, useEffect } from "react";

export default function MortgageCalculator({
  price,
  isAr,
}: {
  price: number;
  isAr: boolean;
}) {
  const [downPercent, setDownPercent] = useState(20);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [monthly, setMonthly] = useState(0);

  useEffect(() => {
    const down = (downPercent / 100) * price;
    const loan = price - down;
    const totalMonths = years * 12;
    const monthlyRate = rate / 100 / 12;

    if (monthlyRate > 0) {
      const m =
        (loan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      setMonthly(Math.round(m));
    } else {
      setMonthly(Math.round(loan / totalMonths));
    }
  }, [downPercent, years, rate, price]);

  const formatNum = (n: number) =>
    isAr
      ? n.toLocaleString("ar-EG") + " جنيه"
      : "EGP " + n.toLocaleString("en-US");

  const sliders = [
    {
      label_ar: "نسبة المقدم",
      label_en: "Down Payment",
      value: downPercent,
      setValue: setDownPercent,
      min: 10, max: 50, step: 5,
      display: `${downPercent}% — ${formatNum((downPercent / 100) * price)}`,
    },
    {
      label_ar: "مدة التمويل",
      label_en: "Loan Period",
      value: years,
      setValue: setYears,
      min: 1, max: 25, step: 1,
      display: isAr ? `${years} سنة` : `${years} Years`,
    },
    {
      label_ar: "نسبة الفائدة السنوية",
      label_en: "Annual Interest Rate",
      value: rate,
      setValue: setRate,
      min: 5, max: 25, step: 0.5,
      display: `${rate}%`,
    },
  ];

  return (
    <div className="bento-card bg-aura-card rounded-3xl p-8 border border-aura-border">
      <h3 className="text-xl font-light text-aura-dark mb-2">
        {isAr ? "حاسبة التمويل العقاري" : "Mortgage Calculator"}
        <span className="block font-serif italic text-aura-accent text-base mt-0.5">
          {isAr ? "احسب قسطك الشهري" : "Calculate your monthly installment"}
        </span>
      </h3>

      {/* القسط الشهري */}
      <div className="my-6 p-5 rounded-2xl bg-aura-dark text-center">
        <p className="text-xs text-white/50 mb-1">
          {isAr ? "القسط الشهري التقديري" : "Estimated Monthly Payment"}
        </p>
        <p className="text-3xl font-light text-white">
          {formatNum(monthly)}
        </p>
      </div>

      {/* السلايدرات */}
      <div className="space-y-6">
        {sliders.map((s, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-aura-dark">
                {isAr ? s.label_ar : s.label_en}
              </label>
              <span className="text-xs text-aura-accent font-medium">
                {s.display}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.setValue(Number(e.target.value))}
              className="w-full accent-aura-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-aura-muted mt-1">
              <span>{s.min}{i === 0 ? "%" : i === 1 ? (isAr ? " سنة" : " yr") : "%"}</span>
              <span>{s.max}{i === 0 ? "%" : i === 1 ? (isAr ? " سنة" : " yr") : "%"}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-aura-muted mt-4 text-center">
        {isAr
          ? "* هذه الأرقام تقديرية للاسترشاد فقط وليست عرضاً تمويلياً رسمياً"
          : "* These are estimated figures for guidance only, not an official financing offer"}
      </p>
    </div>
  );
}