"use client";

import type { Lang } from "@/lib/i18n";
import { templateImage, TEMPLATES } from "@/lib/templates";
import { IconCrown } from "./Icons";

export function TemplatePicker({ value, onChange, premiumLabel, lang = "mr" }: { value: string; onChange: (id: string) => void; premiumLabel: string; lang?: Lang }) {
  return (
    <div className="grid max-h-[520px] grid-cols-3 gap-3 overflow-y-auto pr-1 sm:grid-cols-4">
      {TEMPLATES.map((tpl) => {
        const img = templateImage(lang, tpl);
        return (
          <button
            key={tpl.id}
            onClick={() => onChange(tpl.id)}
            className={`group relative overflow-hidden rounded-md text-left ring-2 transition ${value === tpl.id ? "ring-maroon" : "ring-transparent hover:ring-gold/60"}`}
            title={tpl.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
            <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 640px) 140px, 30vw" alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" className="block h-auto w-full bg-paper" />
            {tpl.premium && (
              <span className="absolute right-1 top-1 inline-flex items-center gap-0.5 rounded-full bg-gold-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">
                <IconCrown className="size-2.5" /> {premiumLabel}
              </span>
            )}
            <span className="block truncate bg-paper px-1.5 py-1 text-[11px] text-soft">{tpl.name}</span>
          </button>
        );
      })}
    </div>
  );
}
