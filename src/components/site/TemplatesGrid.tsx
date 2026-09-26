"use client";

import Link from "next/link";
import { useState } from "react";
import { DICTS } from "@/lib/dict";
import { href, type Lang } from "@/lib/i18n";
import { templateImage, TEMPLATES } from "@/lib/templates";
import { IconCrown } from "../editor/Icons";

const TAGS: Record<Lang, Record<string, string>> = {
  en: { traditional: "Traditional", modern: "Modern", simple: "Simple", girl: "For girls", boy: "For boys", royal: "Royal", premium: "Premium" },
  hi: { traditional: "पारंपरिक", modern: "मॉडर्न", simple: "सिंपल", girl: "लड़की", boy: "लड़का", royal: "रॉयल", premium: "प्रीमियम" },
  mr: { traditional: "पारंपरिक", modern: "मॉडर्न", simple: "साधे", girl: "मुलगी", boy: "मुलगा", royal: "रॉयल", premium: "प्रीमियम" },
};

export function TemplatesGrid({ lang, limit, filters = true }: { lang: Lang; limit?: number; filters?: boolean }) {
  const d = DICTS[lang];
  const [tag, setTag] = useState<string>("");
  const list = TEMPLATES.filter((t) => !tag || t.tags.includes(tag)).slice(0, limit);

  return (
    <div>
      {filters && (
        <div className="mb-6 flex flex-wrap gap-2">
          {["", ...Object.keys(TAGS[lang])].map((k) => (
            <button
              key={k || "all"}
              onClick={() => setTag(k)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${tag === k ? "border-maroon bg-maroon text-white" : "border-line bg-paper text-soft hover:border-gold"}`}
            >
              {k ? TAGS[lang][k] : d.templatesPage.all}
            </button>
          ))}
        </div>
      )}
      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((t, i) => {
          const img = templateImage(lang, t);
          return (
            <li key={t.id}>
              <Link href={`${href(lang, "/create")}?t=${t.id}`} className="group block">
                <div className="relative overflow-hidden rounded-lg shadow-sm ring-1 ring-line transition group-hover:-translate-y-1 group-hover:shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
                  <img
                    src={img.src}
                    srcSet={img.srcSet}
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 46vw"
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading={i < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="block h-auto w-full bg-paper"
                  />
                  <span
                    className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.premium ? "bg-gold-ink text-white" : "bg-paper/90 text-leaf"}`}
                  >
                    {t.premium && <IconCrown className="size-3" />}
                    {t.premium ? d.editor.premium : d.templatesPage.free}
                  </span>
                  <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-maroon py-2 text-center text-sm font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    {d.templatesPage.useTemplate}
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium text-ink">{t.name}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
