"use client";

import { HiOutlineHome, HiOutlineBuildingOffice2, HiOutlineMapPin } from "react-icons/hi2";

type Developer = {
  id: string;
  name: string;
  name_en?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  slug?: string | null;
};

export default function CompaniesGrid({
  developers,
  counts = {},
  isAr,
  locale,
}: {
  developers: Developer[];
  counts?: Record<string, number>;
  isAr: boolean;
  locale: string;
}) {
  if (developers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-aura-card rounded-3xl border border-aura-border">
        <HiOutlineHome className="w-10 h-10 text-aura-muted" />
        <p className="text-aura-muted font-light text-sm">
          {isAr ? "لا يوجد مطوّرين حاليًا" : "No developers yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
      {developers.map((developer) => {
        const displayName = (isAr ? developer.name : developer.name_en) || developer.name;
        const description = isAr ? developer.description_ar : developer.description_en;
        const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2);
        const clickable = Boolean(developer.slug);
        const projectsCount = counts[developer.id] || 0;

        const cardContent = (
          <>
            {/* البانر — مسيطر على 60% من الكارت */}
            <div className="relative h-48 md:h-56 w-full overflow-hidden">
              {developer.cover_image_url ? (
                <img src={developer.cover_image_url} alt={displayName} className="w-full h-full object-cover img-hover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-aura-dark via-aura-accent-dark to-aura-accent" />
              )}
              {/* Overlay غامق فخم */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* شارة عدد المشاريع — بارزة فوق الصورة */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium">
                <HiOutlineBuildingOffice2 className="w-4 h-4" />
                {projectsCount} {isAr ? (projectsCount === 1 ? "مشروع" : "مشاريع") : (projectsCount === 1 ? "project" : "projects")}
              </div>

              {/* اللوجو — شارة عايمة تحت لليسار */}
              <div className="absolute bottom-4 left-4 w-16 h-16 rounded-2xl bg-white border-2 border-white/80 shadow-xl flex items-center justify-center overflow-hidden">
                {developer.logo_url ? (
                  <img src={developer.logo_url} alt={displayName} className="max-h-full max-w-full object-contain p-1.5" />
                ) : (
                  <span className="text-lg font-bold text-aura-accent">{initials}</span>
                )}
              </div>

              {/* اسم المطوّر فوق الصورة نفسها */}
              <div className="absolute bottom-4 right-4 text-end">
                <p className="text-[10px] tracking-[0.2em] text-white/70 uppercase mb-1">
                  {isAr ? "مطوّر عقاري" : "Developer"}
                </p>
                <h3 className="text-lg md:text-xl font-medium text-white drop-shadow-md">
                  {displayName}
                </h3>
              </div>
            </div>

            {/* المحتوى تحت */}
            <div className="p-5 md:p-6 bg-aura-dark">
              {description ? (
                <p className="text-sm text-white/60 font-light line-clamp-2 leading-relaxed">
                  {description}
                </p>
              ) : (
                <p className="text-sm text-white/40 font-light italic">
                  {isAr ? "شركة تطوير عقاري موثّقة" : "Verified Development Company"}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-4 text-aura-accent text-xs font-medium">
                {isAr ? "استعرض المشاريع" : "View Projects"}
                <span>{isAr ? "←" : "→"}</span>
              </div>
            </div>
          </>
        );

        const className = "block rounded-3xl overflow-hidden border border-aura-dark/10 hover:shadow-[0_12px_40px_rgba(44,43,41,0.2)] hover:-translate-y-1 transition-all duration-300 group";

        if (clickable) {
          return (
            <a key={developer.id} href={`/${locale}/companies/${developer.slug}`} className={className}>
              {cardContent}
            </a>
          );
        }
        return (
          <div key={developer.id} className={className}>
            {cardContent}
          </div>
        );
      })}
    </div>
  );
}