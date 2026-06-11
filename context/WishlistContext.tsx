"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const STORAGE_KEY = "aqar-wishlist";

type WishlistContextType = {
  liked: number[];
  toggleLike: (id: number) => void;
  addLike: (id: number) => void;
};

const WishlistContext = createContext<WishlistContextType>({
  liked: [],
  toggleLike: () => {},
  addLike: () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLiked(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liked));
  }, [liked, hydrated]);

  const toggleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addLike = (id: number) => {
    setLiked((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <WishlistContext.Provider value={{ liked, toggleLike, addLike }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
