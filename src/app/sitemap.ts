import type { MetadataRoute } from "next";
import { PAGES, topicAlternates } from "@/content";
import type { Topic } from "@/content/types";
import { LANGS, SITE } from "@/lib/i18n";
import { templateImage, TEMPLATES } from "@/lib/templates";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { topic: Topic; lang: (typeof LANGS)[number]; priority: number; lastModified: string }[] = [
    ...PAGES.map((p) => ({ topic: p.topic, lang: p.lang, priority: p.topic === "home" ? 1 : 0.8, lastModified: p.updated })),
    ...LANGS.flatMap((lang) => [
      { topic: "create" as const, lang, priority: 0.9, lastModified: "2026-09-26" },
      { topic: "templates" as const, lang, priority: 0.8, lastModified: "2026-09-26" },
    ]),
  ];
  return entries.map(({ topic, lang, priority, lastModified }) => {
    const alt = topicAlternates(topic, lang, SITE.url);
    // Template previews go in the image sitemap so they can show up in Google Images.
    const images = topic === "templates" ? TEMPLATES.map((t) => `${SITE.url}${templateImage(lang, t).src}`) : undefined;
    return { url: alt.canonical, lastModified, changeFrequency: "weekly", priority, alternates: { languages: alt.languages }, images };
  });
}
