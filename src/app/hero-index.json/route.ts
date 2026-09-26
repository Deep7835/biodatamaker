import { PAGES } from "@/content";

export const dynamic = "force-static";

/** Build-time list for scripts/generate-assets.mjs: which hero sample to pre-render for each content page. */
export function GET() {
  return Response.json(
    PAGES.filter((p) => !p.tool && p.topic !== "tools").map((p) => ({
      lang: p.lang,
      slug: p.slug,
      t: p.sample.templateId ?? "kesari-classic",
      g: p.sample.gender ?? "girl",
      r: p.sample.religion ?? "",
      np: p.sample.noPhoto ? "1" : "",
    })),
  );
}
