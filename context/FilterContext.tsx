"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FilterContextType = {
  activeFilter: string;
  searchQuery: string;
  propertyType: string;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setPropertyType: (type: string) => void;
};

const FilterContext = createContext<FilterContextType>({
  activeFilter: "all",
  searchQuery: "",
  propertyType: "all",
  setActiveFilter: () => {},
  setSearchQuery: () => {},
  setPropertyType: () => {},
});

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery]   = useState("");
  const [propertyType, setPropertyType] = useState("all");

  return (
    <FilterContext.Provider value={{
      activeFilter,
      searchQuery,
      propertyType,
      setActiveFilter,
      setSearchQuery,
      setPropertyType,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = () => useContext(FilterContext);