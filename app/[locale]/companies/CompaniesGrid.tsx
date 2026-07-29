"use client";

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import ComingSoon from "@/components/ui/ComingSoon";

type Developer = {
  id: string;
  name: string;
  name_en?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  description_ar?: string | null;
  slug?: string | null;
};

export default function CompaniesGrid({
  developers,
  counts,
  isAr,
  locale,
}: {
  developers: Developer[];
  counts: Record<string, number>;
  isAr: boolean;
  locale: string;
}) {
  if (developers.length === 0) {
    return (
      <div className="bg-aura-card rounded-3xl border border-aura-border">
        <ComingSoon
          title={isAr ? "قريبًا..." : "Coming Soon..."}
          subtitle={isAr ? "قسم المطورين العقاريين جاري تجهيزه، وهيظهر هنا كل شركاء التطوير قريبًا" : "The developers section is being prepared. All development partners will appear here soon"}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {developers.map((dev) => {
        const name = (isAr ? dev.name : dev.name_en) || dev.name;
        const projectCount = counts[dev.id] || 0;

        return (
          
           <a key={dev.id}
            href={`/${locale}/companies/${dev.slug}`}
            className="block bg-aura-card rounded-3xl border border-aura-border overflow-hidden hover:border-aura-accent/50 hover:shadow-[0_8px_30px_rgba(196,181,165,0.15)] transition-all duration-300 group"
          >
            <div className="relative h-40 w-full overflow-hidden">
              {dev.cover_image_url ? (
                <img src={dev.cover_image_url} alt={name} className="w-full h-full object-cover img-hover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-aura-dark to-aura-accent/40" />
              )}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
                {projectCount} {isAr ? "مشروع" : "project" + (projectCount === 1 ? "" : "s")}
              </div>
              <div className="absolute -bottom-6 right-6 w-16 h-16 rounded-2xl border-4 border-aura-card bg-white flex items-center justify-center overflow-hidden shadow-md">
                {dev.logo_url ? (
                  <img src={dev.logo_url} alt={name} className="max-h-full max-w-full object-contain p-1.5" />
                ) : (
                  <span className="text-lg font-bold text-aura-accent">{name.slice(0, 2)}</span>
                )}
              </div>
            </div>

            <div className="p-6 pt-9">
              <p className="text-[10px] tracking-[0.2em] text-aura-accent uppercase mb-1.5">
                {isAr ? "مطوّر عقاري" : "Developer"}
              </p>
              <h3 className="text-base font-medium text-aura-dark mb-2 group-hover:text-aura-accent transition-colors">
                {name}
              </h3>
              {dev.description_ar && (
                <p className="text-xs text-aura-muted font-light line-clamp-2">
                  {dev.description_ar}
                </p>
              )}
              <p className="text-xs text-aura-accent font-medium mt-4 flex items-center gap-1">
                {isAr ? "استعرض المشاريع" : "View Projects"}
                <span>{isAr ? "←" : "→"}</span>
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}