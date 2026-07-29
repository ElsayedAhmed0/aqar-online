"use client";

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function ComingSoon({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-28 px-6 text-center">
      <div className="relative w-24 h-24 mb-6">
        {/* دوائر نابضة في الخلفية */}
        <div className="absolute inset-0 rounded-full bg-aura-accent/10 animate-ping-slow" />
        <div className="absolute inset-2 rounded-full bg-aura-accent/10 animate-ping-slower" />
        {/* الأيقونة نفسها بحركة تمايل بسيطة */}
        <div className="relative w-24 h-24 rounded-full bg-aura-accent/10 flex items-center justify-center animate-float">
          <HiOutlineBuildingOffice2 className="w-10 h-10 text-aura-accent" />
        </div>
      </div>

      <h3 className="text-lg font-medium text-aura-dark mb-2">{title}</h3>
      <p className="text-sm text-aura-muted font-light max-w-sm">{subtitle}</p>

      {/* نقط تحميل متحركة */}
      <div className="flex items-center gap-1.5 mt-6">
        <span className="w-2 h-2 rounded-full bg-aura-accent animate-bounce-dot" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-aura-accent animate-bounce-dot" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-aura-accent animate-bounce-dot" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}