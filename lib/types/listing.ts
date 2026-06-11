export type ListingStatus = "pending" | "approved" | "rejected";

export type UserListing = {
  id: string;
  userId: string;
  createdAt: string;
  type: "apartment" | "villa" | "commercial";
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  location_ar: string;
  location_en: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  img: string;
  images: string[];
  phone: string;
  featured: boolean;
  status: ListingStatus;
};

export type ListingFormData = {
  type: "apartment" | "villa" | "commercial" | "";
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  location_ar: string;
  location_en: string;
  price: string;
  beds: string;
  baths: string;
  area: string;
  images: string[];
  phone: string;
};

export const emptyListingForm = (): ListingFormData => ({
  type: "",
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  location_ar: "",
  location_en: "",
  price: "",
  beds: "",
  baths: "",
  area: "",
  images: [],
  phone: "",
});