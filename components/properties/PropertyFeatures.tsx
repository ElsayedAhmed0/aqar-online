"use client";

import { HiOutlineCheckCircle } from "react-icons/hi2";

const features = {
  apartment: {
    ar: ["تكييف مركزي", "أمن 24 ساعة", "مواقف سيارات", "مصعد", "إنترنت فايبر", "مطبخ مجهز"],
    en: ["Central AC", "24/7 Security", "Parking", "Elevator", "Fiber Internet", "Fitted Kitchen"],
  },
  villa: {
    ar: ["حمام سباحة خاص", "حديقة", "جراج", "نظام أمن ذكي", "غرفة خادمة", "مسبح"],
    en: ["Private Pool", "Garden", "Garage", "Smart Security", "Maid's Room", "Swimming Pool"],
  },
  commercial: {
    ar: ["واجهة زجاجية", "مواقف عملاء", "تكييف مركزي", "أمن 24 ساعة", "إنترنت فايبر", "مولد كهربائي"],
    en: ["Glass Facade", "Customer Parking", "Central AC", "24/7 Security", "Fiber Internet", "Generator"],
  },
};

export default function PropertyFeatures({
  property,
  isAr,
}: {
  property: any;
  isAr: boolean;
}) {
  const type = property.type as keyof typeof features;
  const featureList = isAr
    ? features[type]?.ar || features.apartment.ar
    : features[type]?.en || features.apartment.en;

  return (
    <div className="">
      <h3 className="text-xl font-light text-aura-dark mb-6">
        {isAr ? "مميزات العقار" : "Property Features"}
        <span className="block font-serif italic text-aura-accent text-base mt-0.5">
          {isAr ? "ما يميز هذا العقار" : "What makes it special"}
        </span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {featureList.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-2xl bg-aura-canvas border border-aura-border hover:border-aura-accent transition-all duration-300"
          >
            <HiOutlineCheckCircle className="w-4 h-4 text-aura-accent shrink-0" />
            <span className="text-xs text-aura-dark">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}