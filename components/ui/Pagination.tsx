"use client";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isAr: boolean;
};

export default function Pagination({ page, totalPages, onPageChange, isAr }: Props) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 md:mt-10 flex-wrap">

      {/* السابق */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark hover:border-aura-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isAr ? "السابق ←" : "→ Prev"}
      </button>

      {/* الأرقام — مخفية بعض الأرقام على الموبايل */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-aura-muted text-xs">
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-medium transition-all duration-300 ${
              page === p
                ? "bg-aura-dark text-white shadow-sm"
                : "border border-aura-border text-aura-muted hover:border-aura-accent hover:text-aura-dark"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* التالي */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-aura-border text-xs text-aura-muted hover:text-aura-dark hover:border-aura-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isAr ? "→ التالي" : "Next ←"}
      </button>

    </div>
  );
}