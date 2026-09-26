"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { topicOf, topicPath } from "@/content/slugs";
import { LANG_NATIVE, LANGS, LANG_PREFIX, type Lang } from "@/lib/i18n";

/** Links to the same page in the other languages (falls back to their home page). */
export function LanguageSwitcher({ lang }: { lang: Lang }) {
  const path = usePathname() || "/";
  const rest = path.slice(LANG_PREFIX[lang].length).replace(/^\/|\/$/g, "");
  const topic = topicOf(lang, rest);

  return (
    <div className="flex items-center rounded-full border border-line bg-paper p-0.5 text-sm">
      {LANGS.map((l) => {
        const to = (topic && topicPath(topic, l)) || `${LANG_PREFIX[l]}/`;
        return (
          <Link
            key={l}
            href={to}
            hrefLang={l}
            className={`rounded-full px-2.5 py-1 ${l === lang ? "bg-maroon text-white" : "text-soft hover:text-ink"}`}
            aria-current={l === lang ? "true" : undefined}
          >
            {l === "en" ? "EN" : LANG_NATIVE[l]}
          </Link>
        );
      })}
    </div>
  );
}
