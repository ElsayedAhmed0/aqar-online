import Script from "next/script";

type BreadcrumbItem = {
  label: string;
  href?: string; // آخر عنصر من غير href (الصفحة الحالية)
};

export default function Breadcrumb({
  items,
  isAr,
}: {
  items: BreadcrumbItem[];
  isAr: boolean;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-aura-muted mb-4">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-aura-border">{isAr ? "/" : "/"}</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-aura-accent transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-aura-dark font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}