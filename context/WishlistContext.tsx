"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type WishlistContextType = {
  liked: number[];
  toggleLike: (id: number) => void;
};

const WishlistContext = createContext<WishlistContextType>({
  liked: [],
  toggleLike: () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <WishlistContext.Provider value={{ liked, toggleLike }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);