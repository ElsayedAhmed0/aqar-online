"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Settings = Record<string, string>;

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("key, value");

      if (data) {
        const mapped: Settings = {};
        data.forEach((row) => {
          mapped[row.key] = row.value || "";
        });
        setSettings(mapped);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}