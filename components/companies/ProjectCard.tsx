"use client";

import { HiOutlineMapPin, HiOutlineCalendarDays } from "react-icons/hi2";
import { AREAS } from "@/lib/data/areas";

const CONSTRUCTION_LABELS: Record<string, { ar: string; en: string }> = {
  under_construction: { ar: "تحت الإنشاء", en: "Under Construction" },
  delivered: { ar: "تم التسليم", en: "Delivered" },
};

export default function ProjectCard({
  project,
  isAr,
  locale,
  companySlug,
}: {
  project: any;
  isAr: boolean;
  locale: string;
  companySlug: string;
}) {
  const name = (isAr ? project.name_ar : project.name_en) || project.name_ar;
  const area = AREAS.find((a) => a.slug === project.area_slug);
  const location = area ? (isAr ? area.ar : area.en) : (isAr ? project.location_ar : project.location_en);
  const constructionLabel = project.construction_status ? CONSTRUCTION_LABELS[project.construction_status] : null;

  return (
    <a href={`/${locale}/companies/${companySlug}/${project.slug}`}
      className="block bg-aura-card rounded-3xl border border-aura-border overflow-hidden hover:border-aura-accent/50 hover:shadow-[0_8px_30px_rgba(196,181,165,0.15)] transition-all duration-300 group"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={name} className="w-full h-full object-cover img-hover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-aura-dark to-aura-accent/40" />
        )}
        {project.delivery_date && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium">
            <HiOutlineCalendarDays className="w-3.5 h-3.5" />
            {project.delivery_date}
          </div>
        )}
        {constructionLabel && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-aura-accent/90 backdrop-blur-sm text-white text-[11px] font-medium">
            {isAr ? constructionLabel.ar : constructionLabel.en}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-medium text-aura-dark mb-1.5 group-hover:text-aura-accent transition-colors">
          {name}
        </h3>
        {location && (
          <div className="flex items-center gap-1.5 text-aura-muted mb-2">
            <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{location}</span>
          </div>
        )}
        {project.starting_price && (
          <p className="text-sm font-medium text-aura-accent">
            {isAr ? "يبدأ من " : "From "}{Number(project.starting_price).toLocaleString(isAr ? "ar-EG" : "en-US")} {isAr ? "جنيه" : "EGP"}
          </p>
        )}
      </div>
    </a>
  );
}