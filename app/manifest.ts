import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "عقار أونلاين | Aqar Online",
    short_name: "عقار أونلاين",
    description: "منصة العقارات الأولى في مصر — شقق، فيلات، عقارات تجارية في 27 محافظة",
    start_url: "/ar",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#1a1a1a",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}