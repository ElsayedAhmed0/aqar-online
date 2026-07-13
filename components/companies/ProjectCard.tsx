"use client";

import { HiOutlineMapPin, HiOutlineCalendarDays } from "react-icons/hi2";

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
  const location = isAr ? project.location_ar : project.location_en;

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
      </div>

      <div className="p-5">
        <h3 className="text-base font-medium text-aura-dark mb-1.5 group-hover:text-aura-accent transition-colors">
          {name}
        </h3>
        {location && (
          <div className="flex items-center gap-1.5 text-aura-muted">
            <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{location}</span>
          </div>
        )}
      </div>
    </a>
  );
}