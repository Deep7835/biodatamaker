"use client";

import { useRef, useState } from "react";
import { PLANETS, RASHI, type Biodata, type Kundali } from "@/lib/biodata";
import { DICTS } from "@/lib/dict";
import { resizePhoto } from "@/lib/export";
import type { Lang } from "@/lib/i18n";
import { IconImage, IconX } from "./Icons";

type Props = { bio: Biodata; update: (fn: (b: Biodata) => Biodata) => void; lang: Lang };

export function KundaliEditor({ bio, update, lang }: Props) {
  const t = DICTS[lang].editor;
  const k = bio.kundali!;
  const [house, setHouse] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const set = (fn: (k: Kundali) => Kundali) => update((b) => (b.kundali ? { ...b, kundali: fn(b.kundali) } : b));

  const togglePlanet = (abbr: string) =>
    set((kk) => {
      const houses = [...kk.houses];
      const parts = houses[house].split(/[\s,]+/).filter(Boolean);
      houses[house] = (parts.includes(abbr) ? parts.filter((p) => p !== abbr) : [...parts, abbr]).join(" ");
      return { ...kk, houses };
    });

  async function onFile(f: File | undefined) {
    if (!f) return;
    const src = await resizePhoto(f, 700);
    set((kk) => ({ ...kk, mode: "image", image: src }));
    if (input.current) input.current.value = "";
  }

  return (
    <div className="mt-4 rounded-xl border border-gold/40 bg-ivory/60 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-ink">{t.kundali}</div>
        <button onClick={() => update((b) => ({ ...b, kundali: undefined }))} className="inline-flex items-center gap-1 text-xs text-soft hover:text-maroon">
          <IconX className="size-3.5" /> {t.removeKundali}
        </button>
      </div>
      <div className="mb-3 flex gap-1 rounded-full border border-line bg-paper p-1 text-xs">
        {(["chart", "image"] as const).map((m) => (
          <button key={m} onClick={() => set((kk) => ({ ...kk, mode: m }))} className={`flex-1 rounded-full px-3 py-1.5 ${k.mode === m ? "bg-maroon text-white" : "text-soft"}`}>
            {m === "chart" ? t.chartMode : t.imageMode}
          </button>
        ))}
      </div>

      {k.mode === "chart" ? (
        <>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <span className="shrink-0 text-soft">{t.lagna}</span>
            <select
              value={k.lagna}
              onChange={(e) => set((kk) => ({ ...kk, lagna: Number(e.target.value) }))}
              className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-2 py-1.5 outline-none focus:border-gold"
            >
              <option value={0}>—</option>
              {RASHI[bio.lang].map((r, i) => (
                <option key={r} value={i + 1}>
                  {i + 1}. {r}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {k.houses.map((h, i) => (
              <label key={i} className={`block rounded-lg border p-1.5 text-[11px] ${house === i ? "border-maroon bg-paper" : "border-line bg-paper/60"}`}>
                <span className="text-soft">
                  {t.house} {i + 1}
                  {k.lagna > 0 && <span className="text-gold-ink"> · {((k.lagna - 1 + i) % 12) + 1}</span>}
                </span>
                <input
                  value={h}
                  onFocus={() => setHouse(i)}
                  onChange={(e) =>
                    set((kk) => {
                      const houses = [...kk.houses];
                      houses[i] = e.target.value;
                      return { ...kk, houses };
                    })
                  }
                  aria-label={`${t.house} ${i + 1}`}
                  className="mt-0.5 w-full bg-transparent text-sm text-ink outline-none"
                />
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-soft">
            {t.selectedHouse} <strong className="text-maroon">{house + 1}</strong>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {PLANETS[bio.lang].map((pl) => {
              const on = k.houses[house].split(/[\s,]+/).includes(pl.abbr);
              return (
                <button
                  key={pl.abbr}
                  onClick={() => togglePlanet(pl.abbr)}
                  title={pl.name}
                  className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-maroon bg-maroon text-white" : "border-line bg-paper text-ink hover:border-gold"}`}
                >
                  {pl.abbr} <span className={on ? "text-white/70" : "text-soft"}>{pl.name}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={() => input.current?.click()} className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gold/70 bg-paper text-gold-ink">
            {k.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={k.image} alt="" className="h-full w-full object-contain" />
            ) : (
              <IconImage className="size-6" />
            )}
          </button>
          <button onClick={() => input.current?.click()} className="text-sm font-semibold text-maroon hover:underline">
            {t.uploadKundali}
          </button>
          <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      )}
    </div>
  );
}
