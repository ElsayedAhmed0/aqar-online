"use client";

import { HiOutlineCheckCircle } from "react-icons/hi2";

const FEATURES_MAP: Record<string, { ar: string; en: string }> = {
  parking: { ar: "موقف سيارة", en: "Parking" },
  pool: { ar: "حمام سباحة", en: "Swimming Pool" },
  gym: { ar: "جيم", en: "Gym" },
  security: { ar: "أمن وحراسة", en: "Security" },
  elevator: { ar: "أسانسير", en: "Elevator" },
  garden: { ar: "حديقة", en: "Garden" },
  ac: { ar: "تكييف مركزي", en: "Central A/C" },
  furnished: { ar: "مفروشة", en: "Furnished" },
  balcony: { ar: "بلكونة", en: "Balcony" },
  storage: { ar: "غرفة مخزن", en: "Storage Room" },
  maid_room: { ar: "غرفة خادمة", en: "Maid's Room" },
  view: { ar: "إطلالة مميزة", en: "Special View" },
  solar: { ar: "طاقة شمسية", en: "Solar Energy" },
  intercom: { ar: "إنتركم", en: "Intercom" },
  pets: { ar: "يسمح بالحيوانات", en: "Pets Allowed" },
  smart_home: { ar: "منزل ذكي", en: "Smart Home" },
  roof: { ar: "روف", en: "Roof" },
  basement: { ar: "بدروم", en: "Basement" },
  kitchen: { ar: "مزود بالمطبخ", en: "Kitchen Included" },
};

export default function PropertyFeatures({ property, isAr }: { property: any; isAr: boolean }) {
  const features: string[] = property.features || [];

  if (features.length === 0) return null;

  return (
    <div>
      <h3 className="text-xl font-light text-aura-dark mb-6">
        {isAr ? "مميزات العقار" : "Property Features"}
        <span className="block font-serif italic text-aura-accent text-base mt-0.5">
          {isAr ? "ما يميز هذا العقار" : "What makes it special"}
        </span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((key) => {
          const label = FEATURES_MAP[key];
          if (!label) return null;
          return (
            <div key={key} className="flex items-center gap-3 p-3 rounded-2xl bg-aura-canvas border border-aura-border hover:border-aura-accent transition-all duration-300">
              <HiOutlineCheckCircle className="w-4 h-4 text-aura-accent shrink-0" />
              <span className="text-xs text-aura-dark">{isAr ? label.ar : label.en}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}