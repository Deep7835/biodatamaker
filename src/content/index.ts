import { href, type Lang } from "@/lib/i18n";
import { EN } from "./en";
import { HI } from "./hi";
import { MR } from "./mr";
import { MR_GUIDES } from "./mr-guides";
import { TOOL_PAGES } from "./tools";
import { TOPIC_SLUGS, topicPath } from "./slugs";
import type { PageContent, Topic } from "./types";

export { topicPath } from "./slugs";

export const PAGES: PageContent[] = [...EN, ...HI, ...MR, ...MR_GUIDES, ...TOOL_PAGES];

export function getPage(lang: Lang, slug: string) {
  return PAGES.find((p) => p.lang === lang && p.slug === slug);
}

export function slugsFor(lang: Lang) {
  return PAGES.filter((p) => p.lang === lang && p.slug).map((p) => p.slug);
}


/** hreflang map for a topic across the languages that have it. */
export function topicAlternates(topic: Topic, lang: Lang, base: string) {
  const langs: Record<string, string> = {};
  const codes: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };
  (["en", "hi", "mr"] as Lang[]).forEach((l) => {
    const p = topicPath(topic, l);
    if (p) langs[codes[l]] = base + p;
  });
  if (langs["en-IN"]) langs["x-default"] = langs["en-IN"];
  return { canonical: base + topicPath(topic, lang)!, languages: langs };
}

export function relatedPages(lang: Lang, exclude: string) {
  return PAGES.filter((p) => p.lang === lang && p.slug && p.slug !== exclude);
}

export type { PageContent, Topic };

// Keep the slug table honest: every content page must be registered in TOPIC_SLUGS.
for (const p of PAGES) {
  if (topicPath(p.topic, p.lang) !== href(p.lang, p.slug ? `/${p.slug}` : "/")) throw new Error(`TOPIC_SLUGS out of sync for ${p.lang}/${p.slug}`);
}
// …and every registered slug must have a page, or hreflang/sitemap would point at a 404.
for (const [topic, langs] of Object.entries(TOPIC_SLUGS))
  for (const [lang, slug] of Object.entries(langs ?? {}))
    if (!PAGES.some((p) => p.lang === lang && p.slug === slug)) throw new Error(`No page for ${topic} in ${lang} (/${slug})`);
