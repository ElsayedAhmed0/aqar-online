"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type CustomArea = { name_ar: string; name_en: string | null };

export function useCustomAreas() {
  const [areas, setAreas] = useState<CustomArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("custom_areas")
        .select("name_ar, name_en")
        .order("created_at", { ascending: true });
      if (data) setAreas(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return { areas, loading };
}