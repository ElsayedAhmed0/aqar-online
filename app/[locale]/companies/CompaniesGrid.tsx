"use client";

import { HiOutlineHome, HiOutlineBuildingOffice2 } from "react-icons/hi2";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {developers.map((developer) => {
        const displayName = (isAr ? developer.name : developer.name_en) || developer.name;
        const description = isAr ? developer.description_ar : developer.description_en;
        const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2);
        const clickable = Boolean(developer.slug);
        const projectsCount = counts[developer.id] || 0;

        const cardContent = (
          <>
            <div className="relative h-20 w-full overflow-hidden">
              {developer.cover_image_url ? (
                <img src={developer.cover_image_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-aura-accent-dark via-aura-accent to-aura-accent-light" />
              )}
            </div>

            <div className="px-5 pb-5 -mt-9 relative">
              <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-3">
                {developer.logo_url ? (
                  <img src={developer.logo_url} alt={displayName} className="max-h-full max-w-full object-contain p-1.5" />
                ) : (
                  <span className="text-lg font-bold text-aura-accent">{initials}</span>
                )}
              </div>

              <h3 className="text-sm font-medium text-aura-dark mb-1 truncate">{displayName}</h3>

              {description ? (
                <p className="text-xs text-aura-muted font-light line-clamp-2 leading-relaxed mb-3">
                  {description}
                </p>
              ) : (
                <p className="text-xs text-aura-muted/50 font-light italic mb-3">
                  {isAr ? "مطوّر عقاري موثّق" : "Verified Developer"}
                </p>
              )}

              <div className="flex items-center gap-1.5 pt-3 border-t border-aura-border">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-aura-accent shrink-0" />
                <span className="text-[11px] text-aura-muted">
                  {projectsCount} {isAr ? (projectsCount === 1 ? "مشروع" : "مشاريع") : (projectsCount === 1 ? "project" : "projects")}
                </span>
              </div>
            </div>
          </>
        );

        const className = "block bg-aura-card rounded-3xl border border-aura-border overflow-hidden hover:border-aura-accent/50 hover:shadow-[0_8px_30px_rgba(196,181,165,0.15)] transition-all duration-300 group";

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