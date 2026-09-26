import Link from "next/link";
import { PAGES, topicPath } from "@/content";
import { TOOL_IDS, type ToolId } from "@/content/types";
import { ToolIcon } from "./ToolIcons";
import type { Lang } from "@/lib/i18n";

export const TOOLS_LABEL: Record<Lang, string> = { en: "Tools", hi: "टूल्स", mr: "साधने" };


/** Card grid linking every tool page in a language (tools hub + footer of tool pages). */
export function ToolsGrid({ lang, exclude }: { lang: Lang; exclude?: ToolId }) {
  const items = TOOL_IDS.filter((id) => id !== exclude).flatMap((id) => {
    const path = topicPath(id, lang);
    const page = PAGES.find((p) => p.lang === lang && p.topic === id);
    return path && page ? [{ id, path, page }] : [];
  });
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ id, path, page }) => (
          <li key={id}>
            <Link href={path} className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
              <span className="flex size-12 items-center justify-center rounded-xl bg-sand text-maroon ring-1 ring-gold/30 transition group-hover:bg-maroon group-hover:text-white">
                <ToolIcon id={id} />
              </span>
              <span className="mt-3 font-display text-lg text-ink group-hover:text-maroon">{page.h1}</span>
              <span className="mt-1 text-sm leading-relaxed text-soft">{page.lead}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
