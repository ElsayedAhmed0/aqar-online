"use client";

import { useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePhoto } from "react-icons/hi2";

export default function PropertyGallery({ images, title }: { images: string[]; title?: string }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 sm:h-96 rounded-3xl bg-aura-canvas border border-aura-border flex items-center justify-center">
        <HiOutlinePhoto className="w-16 h-16 text-aura-muted/30" />
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* الصورة الرئيسية */}
      <div className="relative rounded-3xl overflow-hidden border border-aura-border bg-aura-canvas aspect-[16/9] group">
        <img
          key={current}
          src={images[current]}
          alt={title ? `${title} - صورة ${current + 1}` : `property-${current}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* أزرار التنقل — دايمًا ظاهرة على الموبايل */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm border border-aura-border flex items-center justify-center hover:bg-white transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <HiOutlineChevronRight className="w-4 h-4 text-aura-dark" />
            </button>
            <button
              onClick={next}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm border border-aura-border flex items-center justify-center hover:bg-white transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <HiOutlineChevronLeft className="w-4 h-4 text-aura-dark" />
            </button>
          </>
        )}

        {/* عداد الصور */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* الـ Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                i === current
                  ? "border-aura-accent"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={title ? `${title} - صورة مصغرة ${i + 1}` : `thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}