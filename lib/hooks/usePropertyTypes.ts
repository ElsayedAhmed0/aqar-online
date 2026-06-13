"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PropertyType = {
  id: string;
  name_ar: string;
  name_en: string;
  value: string;
  active: boolean;
  order_num: number;
};

export function usePropertyTypes() {
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("property_types")
        .select("*")
        .eq("active", true)
        .order("order_num", { ascending: true });
      if (data) setTypes(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return { types, loading };
}