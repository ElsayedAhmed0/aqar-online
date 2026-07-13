"use client";

export default function CompanyHero({
  developer,
  isAr,
}: {
  developer: {
    id: string;
    name: string;
    name_en?: string | null;
    logo_url?: string | null;
    cover_image_url?: string | null;
  };
  isAr: boolean;
}) {
  const displayName = (isAr ? developer.name : developer.name_en) || developer.name;
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <section className="relative">
      <div className="relative h-64 sm:h-80 md:h-[26rem] w-full overflow-hidden">
        {developer.cover_image_url ? (
          <img
            src={developer.cover_image_url}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-aura-dark via-aura-accent-dark to-aura-accent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-aura-bg to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center -mt-12 sm:-mt-14 relative z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white ring-4 ring-aura-bg shadow-[0_8px_30px_rgba(44,43,41,0.15)] flex items-center justify-center overflow-hidden shrink-0">
            {developer.logo_url ? (
              <img src={developer.logo_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-aura-accent">{initials}</span>
            )}
          </div>

          <p className="text-xs tracking-[0.3em] text-aura-accent uppercase mt-4 mb-1.5 font-medium">
            {isAr ? "مطوّر عقاري" : "Real Estate Developer"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-aura-dark">
            {displayName}
          </h1>
        </div>
      </div>
    </section>
  );
}