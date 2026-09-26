import { PAGES, topicPath } from "@/content";
import { LANGS } from "@/lib/i18n";

export const dynamic = "force-static";

const EXTRA = {
  create: { en: "Create biodata (editor)", hi: "बायोडाटा बनाएँ (एडिटर)", mr: "बायोडाटा बनवा (एडिटर)" },
  templates: { en: "Biodata templates", hi: "बायोडाटा टेम्पलेट", mr: "बायोडाटा टेम्पलेट्स" },
} as const;

/** Small static index for the header search: every page in all three languages. */
export function GET() {
  const pages = PAGES.map((p) => ({ l: p.lang, t: p.h1, d: p.description, u: topicPath(p.topic, p.lang)!, k: p.title }));
  const extra = LANGS.flatMap((l) =>
    (Object.keys(EXTRA) as (keyof typeof EXTRA)[]).map((topic) => ({ l, t: EXTRA[topic][l], d: "", u: topicPath(topic, l)!, k: "" })),
  );
  return Response.json([...extra, ...pages]);
}
