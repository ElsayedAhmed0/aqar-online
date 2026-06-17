"use client";

import {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import type { UserListing } from "@/lib/types/listing";

type ListingsContextType = {
  listings: UserListing[];
  loading: boolean;
  addListing: (
    listing: Omit<UserListing, "id" | "userId" | "createdAt">,
    rawImages: string[],
    purpose?: string
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

  useEffect(() => {
    if (!user?.id) { setListings([]); setLoading(false); return; }

    const fetchListings = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setListings(data.map((l) => ({
          id: l.id,
          userId: l.user_id,
          createdAt: l.created_at,
          type: l.type,
          purpose: l.purpose || "sale",
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
          whatsapp: l.whatsapp || "",
          featured: l.featured || false,
          status: l.status,
          negotiable: l.negotiable || false,
          features: l.features || [],
          delivery_status: l.delivery_status || "ready",
        })));
      }
      setLoading(false);
    };

    fetchListings();
  }, [user?.id]);

  const uploadImage = async (
    supabase: ReturnType<typeof createClient>,
    base64: string,
    userId: string,
    index: number
  ): Promise<string | null> => {
    try {
      const blob = await fetch(base64).then((r) => r.blob());
      const ext = blob.type.split("/")[1] || "jpg";
      const fileName = `${userId}/${Date.now()}_${index}.${ext}`;
      const { data, error } = await supabase.storage
        .from("listings")
        .upload(fileName, blob, { contentType: blob.type });
      if (error || !data) return null;
      const { data: urlData } = supabase.storage.from("listings").getPublicUrl(data.path);
      return urlData.publicUrl;
    } catch { return null; }
  };

  const addListing = useCallback(
    async (
      listing: Omit<UserListing, "id" | "userId" | "createdAt">,
      rawImages: string[],
      purpose: string = "sale"
    ): Promise<UserListing | null> => {
      if (!user?.id) return null;
      const supabase = createClient();

      const uploadedUrls: string[] = [];
      for (let i = 0; i < rawImages.length; i++) {
        const img = rawImages[i];
        if (img.startsWith("data:")) {
          const url = await uploadImage(supabase, img, user.id, i);
          if (url) uploadedUrls.push(url);
        } else {
          uploadedUrls.push(img);
        }
      }

      const { data, error } = await supabase
        .from("listings")
        .insert({
          user_id: user.id,
          type: listing.type,
          purpose: (listing as any).purpose || purpose,
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
          negotiable: (listing as any).negotiable || false,
          features: (listing as any).features || [],
          delivery_status: (listing as any).delivery_status || "ready",
          whatsapp: (listing as any).whatsapp || null,
        })
        .select()
        .single();

      if (error || !data) { console.error("Insert error:", error); return null; }

      const newListing: UserListing = {
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        type: data.type,
        purpose: data.purpose || "sale",
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
        whatsapp: data.whatsapp || "",
        featured: data.featured || false,
        status: data.status,
        negotiable: data.negotiable || false,
        features: data.features || [],
        delivery_status: data.delivery_status || "ready",
      };

      setListings((prev) => [newListing, ...prev]);
      return newListing;
    },
    [user?.id]
  );

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