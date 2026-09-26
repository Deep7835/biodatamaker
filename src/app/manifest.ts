import type { MetadataRoute } from "next";
import { SITE } from "@/lib/i18n";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} – Marriage Biodata Maker`,
    short_name: SITE.name,
    description: "Free marriage biodata maker in English, Hindi and Marathi. PDF, JPG and Word download.",
    start_url: "/create/",
    scope: "/",
    display: "standalone",
    background_color: "#FBF8F3",
    theme_color: "#8A1C2B",
    lang: "en-IN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "मराठी बायोडाटा", url: "/marathi/create/" },
      { name: "हिंदी बायोडाटा", url: "/hindi/create/" },
    ],
  };
}
