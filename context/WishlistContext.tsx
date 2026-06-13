"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

type WishlistItem = {
  id: string | number;
  title_ar: string;
  title_en: string;
  location_ar: string;
  location_en: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  area: number;
  img: string;
  images: string[];
  featured: boolean;
  status?: string;
};

type WishlistContextType = {
  liked: (string | number)[];
  items: WishlistItem[];
  toggleLike: (id: string | number, item?: WishlistItem) => void;
};

const WishlistContext = createContext<WishlistContextType>({
  liked: [],
  items: [],
  toggleLike: () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // مفتاح مختلف لكل مستخدم
  const storageKey = `aqar-wishlist-${user?.id || "guest"}`;

  // حمّل الـ wishlist من localStorage لما يتغير المستخدم
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, [storageKey]);

  // احفظ لما تتغير الـ items
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, hydrated, storageKey]);

  const liked = items.map((i) => i.id);

  const toggleLike = (id: string | number, item?: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === id);
      if (exists) return prev.filter((i) => i.id !== id);
      if (item) return [...prev, item];
      return prev;
    });
  };

  return (
    <WishlistContext.Provider value={{ liked, items, toggleLike }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);