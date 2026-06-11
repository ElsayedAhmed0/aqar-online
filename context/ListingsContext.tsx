"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import type { UserListing } from "@/lib/types/listing";

type ListingsContextType = {
  listings: UserListing[];
  loading: boolean;
  addListing: (
    listing: Omit<UserListing, "id" | "userId" | "createdAt">
  ) => Promise<UserListing | null>;
  removeListing: (id: string) => Promise<void>;
};

const ListingsContext = createContext<ListingsContextType>({
  listings: [],
  loading: true,
  addListing: async () => null,
  removeListing: async () => {},
});

export function ListingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [listings, setListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);

  // جيب إعلانات المستخدم من Supabase
  useEffect(() => {
    if (!user?.id) {
      setListings([]);
      setLoading(false);
      return;
    }

    const fetchListings = async () => {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: UserListing[] = data.map((l) => ({
          id: l.id,
          userId: l.user_id,
          createdAt: l.created_at,
          type: l.type,
          title_ar: l.title_ar,
          title_en: l.title_en,
          description_ar: l.description_ar || "",
          description_en: l.description_en || "",
          location_ar: l.location_ar || "",
          location_en: l.location_en || "",
          price: l.price,
          beds: l.beds || 0,
          baths: l.baths || 0,
          area: l.area || 0,
          img: l.images?.[0] || "",
          images: l.images || [],
          phone: l.phone || "",
          featured: l.featured || false,
          status: l.status,
        }));
        setListings(mapped);
      }

      setLoading(false);
    };

    fetchListings();
  }, [user?.id]);

  // إضافة إعلان جديد لـ Supabase
  const addListing = useCallback(
    async (
      listing: Omit<UserListing, "id" | "userId" | "createdAt">
    ): Promise<UserListing | null> => {
      if (!user?.id) return null;

      const supabase = createClient();

      // رفع الصور لـ Supabase Storage
      const uploadedUrls: string[] = [];

      for (const img of listing.images) {
        // لو الصورة base64 — نرفعها
        if (img.startsWith("data:")) {
          const base64 = img.split(",")[1];
          const blob = await fetch(img).then((r) => r.blob());
          const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("listings")
            .upload(fileName, blob, { contentType: "image/jpeg" });

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from("listings")
              .getPublicUrl(uploadData.path);
            uploadedUrls.push(urlData.publicUrl);
          }
        } else {
          uploadedUrls.push(img);
        }
      }

      // حفظ الإعلان في الـ DB
      const { data, error } = await supabase
        .from("listings")
        .insert({
          user_id: user.id,
          type: listing.type,
          title_ar: listing.title_ar,
          title_en: listing.title_en,
          description_ar: listing.description_ar,
          description_en: listing.description_en,
          location_ar: listing.location_ar,
          location_en: listing.location_en,
          price: listing.price,
          beds: listing.beds,
          baths: listing.baths,
          area: listing.area,
          images: uploadedUrls,
          phone: listing.phone,
          featured: false,
          status: "pending",
        })
        .select()
        .single();

      if (error || !data) return null;

      const newListing: UserListing = {
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        type: data.type,
        title_ar: data.title_ar,
        title_en: data.title_en,
        description_ar: data.description_ar || "",
        description_en: data.description_en || "",
        location_ar: data.location_ar || "",
        location_en: data.location_en || "",
        price: data.price,
        beds: data.beds || 0,
        baths: data.baths || 0,
        area: data.area || 0,
        img: uploadedUrls[0] || "",
        images: uploadedUrls,
        phone: data.phone || "",
        featured: data.featured || false,
        status: data.status,
      };

      setListings((prev) => [newListing, ...prev]);
      return newListing;
    },
    [user?.id]
  );

  // حذف إعلان من Supabase
  const removeListing = useCallback(
    async (id: string) => {
      if (!user?.id) return;

      const supabase = createClient();
      await supabase.from("listings").delete().eq("id", id).eq("user_id", user.id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    },
    [user?.id]
  );

  return (
    <ListingsContext.Provider value={{ listings, loading, addListing, removeListing }}>
      {children}
    </ListingsContext.Provider>
  );
}

export const useListings = () => useContext(ListingsContext);