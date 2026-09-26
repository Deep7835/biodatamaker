import type { Metadata } from "next";
import { RenderSample } from "@/components/biodata/RenderSample";

// Build-time helper page: scripts/generate-assets.mjs screenshots each template from here.
export const metadata: Metadata = { title: "Render", robots: { index: false, follow: false } };

export default function Page() {
  return <RenderSample />;
}
