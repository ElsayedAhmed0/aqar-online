"use client";

import { HiOutlineMapPin, HiOutlineTrash, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { MdOutlineApartment, MdOutlineVilla, MdOutlineStorefront } from "react-icons/md";
import type { UserListing } from "@/lib/types/listing";

const typeLabels = {
  apartment: { ar: "شقة", en: "Apartment", icon: MdOutlineApartment },
  villa: { ar: "فيلا", en: "Villa", icon: MdOutlineVilla },
  commercial: { ar: "تجاري", en: "Commercial", icon: MdOutlineStorefront },
};

const statusConfig = {
  pending: {
    ar: "بانتظار الموافقة",
    en: "Pending Approval",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
    icon: HiOutlineClock,
  },
  approved: {
    ar: "تم الموافقة",
    en: "Approved",
    className: "bg-green-50 text-green-600 border border-green-200",
    icon: HiOutlineCheckCircle,
  },
  rejected: {
    ar: "مرفوض",
    en: "Rejected",
    className: "bg-red-50 text-red-500 border border-red-200",
    icon: HiOutlineXCircle,
  },
};

type MyListingCardProps = {
  listing: UserListing;
  isAr: boolean;
  formatPrice: (price: number) => string;
  onDelete: () => void;
};

export default function MyListingCard({
  listing,
  isAr,
  formatPrice,
  onDelete,
}: MyListingCardProps) {
  const typeInfo = typeLabels[listing.type];
  const TypeIcon = typeInfo.icon;
  const status = statusConfig[listing.status] ?? statusConfig.pending;
  const StatusIcon = status.icon;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bento-card bg-aura-card rounded-3xl overflow-hidden border border-aura-border group">
      {/* الصورة */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.img || listing.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
          alt={listing.title_en}
          className="w-full h-full object-cover img-hover"
        />

        {/* لاير للـ pending */}
        {listing.status === "pending" && (
          <div className="absolute inset-0 bg-amber-900/10 pointer-events-none" />
        )}

        {/* لاير للـ rejected */}
        {listing.status === "rejected" && (
          <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
        )}

        {/* النوع وعدد الصور */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {(listing.images?.length ?? 0) > 1 && (
            <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
              {listing.images.length} {isAr ? "صور" : "photos"}
            </span>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-card/90 backdrop-blur-sm text-xs font-medium text-aura-dark">
            <TypeIcon className="w-3.5 h-3.5 text-aura-accent" />
            {isAr ? typeInfo.ar : typeInfo.en}
          </span>
        </div>

        {/* حالة الإعلان */}
        <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold shadow-lg ${
          listing.status === "pending"
            ? "bg-amber-500 text-white animate-pulse"
            : listing.status === "approved"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {isAr ? status.ar : status.en}
        </div>

        {/* السعر */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
          {formatPrice(listing.price)}
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-light text-aura-dark leading-snug">
            {isAr ? listing.title_ar : listing.title_en}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-aura-muted mb-3">
          <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">
            {isAr ? listing.location_ar : listing.location_en}
          </span>
        </div>

        {/* الخصائص */}
        <div className="flex items-center gap-4 pt-3 border-t border-aura-border text-aura-muted">
          {listing.beds > 0 && (
            <div className="flex items-center gap-1.5">
              <LuBedDouble className="w-4 h-4" />
              <span className="text-xs">{listing.beds}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <LuBath className="w-4 h-4" />
            <span className="text-xs">{listing.baths}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LuMaximize className="w-4 h-4" />
            <span className="text-xs">
              {listing.area} {isAr ? "م²" : "m²"}
            </span>
          </div>
        </div>

        {/* التاريخ والحذف */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-aura-border">
          <span className="text-[10px] text-aura-muted">
            {isAr ? "أُرسل في" : "Submitted"} {formatDate(listing.createdAt)}
          </span>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-500 hover:bg-red-50 transition-all duration-300"
          >
            <HiOutlineTrash className="w-3.5 h-3.5" />
            {isAr ? "حذف" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}