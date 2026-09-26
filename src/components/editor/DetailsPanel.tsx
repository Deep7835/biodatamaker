"use client";

import { useConfirm } from "../ui/useConfirm";
import { useRef, useState } from "react";
import { autofillHoroscope, emptyKundali, FIELDS, newFieldRow, QUICK_FIELDS, suggestionsFor, uid, type Biodata, type Section } from "@/lib/biodata";
import { DICTS } from "@/lib/dict";
import { resizePhoto } from "@/lib/export";
import type { Lang } from "@/lib/i18n";
import { applyCached, pendingWords, transliterateWord } from "@/lib/transliterate";
import { IconDown, IconEye, IconPlus, IconUp, IconX } from "./Icons";
import { KundaliEditor } from "./KundaliEditor";

type Props = { bio: Biodata; update: (fn: (b: Biodata) => Biodata) => void; lang: Lang; translit: boolean };

const LONG = /address|expectations|relatives/;

function move<T>(arr: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

export function DetailsPanel({ bio, update, lang, translit }: Props) {
  const t = DICTS[lang].editor;
  const { confirm: confirmDlg, dialog } = useConfirm(lang);
  const [adding, setAdding] = useState<string | null>(null);
  const usedKeys = new Set(bio.sections.flatMap((s) => s.rows.map((r) => r.id.split("-").slice(1).join("-"))));

  const setValue = (sid: string, rid: string, value: string) =>
    update((b) => {
      const row = b.sections.find((s) => s.id === sid)?.rows.find((r) => r.id === rid);
      if (row) row.value = value;
      return /-(nakshatra|charan)$/.test(rid) ? autofillHoroscope(b) : b;
    });

  /** Look up any completed English words in the field, then swap in their Devanagari forms. */
  async function maybeTransliterate(sid: string, rid: string, text: string) {
    const words = pendingWords(text, bio.lang);
    if (!words.length) return;
    await Promise.all(words.map((w) => transliterateWord(w, bio.lang)));
    update((b) => {
      const row = b.sections.find((s) => s.id === sid)?.rows.find((r) => r.id === rid);
      if (row) row.value = applyCached(row.value, bio.lang);
      return b;
    });
  }

  return (
    <div className="space-y-5">
      {dialog}
      <PhotoCard bio={bio} update={update} lang={lang} />

      {bio.sections.map((s, si) => (
        <div key={s.id} className={`rounded-2xl border border-line bg-paper p-4 sm:p-5 ${s.hidden ? "opacity-60" : ""}`}>
          <div className="mb-3 flex items-center gap-2">
            <input
              value={s.title}
              onChange={(e) =>
                update((b) => {
                  b.sections[si].title = e.target.value;
                  return b;
                })
              }
              aria-label={t.title}
              className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 font-display text-lg text-maroon outline-none hover:border-line focus:border-gold"
            />
            <SectionTools
              t={t}
              section={s}
              onUp={() => update((b) => (move(b.sections, si, -1), b))}
              onDown={() => update((b) => (move(b.sections, si, 1), b))}
              onToggle={() =>
                update((b) => {
                  b.sections[si].hidden = !b.sections[si].hidden;
                  return b;
                })
              }
              onDelete={async () => {
                if (s.rows.some((r) => r.value.trim()) && !(await confirmDlg(`${t.deleteSection}?`, { danger: true, okLabel: t.delete }))) return;
                update((b) => ({ ...b, sections: b.sections.filter((x) => x.id !== s.id) }));
              }}
            />
          </div>

          <div className="space-y-2.5">
            {s.rows.map((r, ri) => {
              const key = r.id.split("-").slice(1).join("-");
              const sug = suggestionsFor(r.label, bio.lang);
              const placeholder = FIELDS[key]?.sample[bio.lang] ?? "";
              const listId = sug ? `sug-${r.id}` : undefined;
              const long = LONG.test(key) || r.value.length > 48;
              // Numbers and addresses must never be transliterated.
              const translitRow = translit && !/^(phone|email|bloodGroup|height|weight|income|charan)$/.test(key);
              const common = {
                value: r.value,
                placeholder,
                "aria-label": r.label,
                className: "w-full rounded-lg border border-line bg-ivory/60 px-3 py-2 text-[15px] outline-none transition placeholder:text-soft/70 focus:border-gold focus:bg-paper",
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setValue(s.id, r.id, translitRow ? applyCached(e.target.value, bio.lang) : e.target.value);
                  if (translitRow) maybeTransliterate(s.id, r.id, e.target.value);
                },
                onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  if (translitRow) maybeTransliterate(s.id, r.id, `${e.target.value} `).then(() => undefined);
                },
              };
              return (
                <div key={r.id} className="group grid grid-cols-[minmax(0,34%)_minmax(0,1fr)_auto] items-start gap-2">
                  <input
                    value={r.label}
                    onChange={(e) =>
                      update((b) => {
                        b.sections[si].rows[ri].label = e.target.value;
                        return b;
                      })
                    }
                    aria-label={t.fieldLabel}
                    className="mt-1 w-full truncate rounded-md border border-transparent bg-transparent px-1 py-1.5 text-sm font-medium text-soft outline-none hover:border-line focus:border-gold focus:text-ink"
                  />
                  <div className="min-w-0">
                    {long ? <AutoTextarea {...common} /> : <input {...common} list={listId} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} />}
                    {fieldWarning(key, r.value, t) && (
                      <p role="status" className="mt-1 text-xs text-maroon">
                        {fieldWarning(key, r.value, t)}
                      </p>
                    )}
                  </div>
                  {listId && (
                    <datalist id={listId}>
                      {sug!.map((x) => (
                        <option key={x} value={x} />
                      ))}
                    </datalist>
                  )}
                  <div className="mt-1.5 flex opacity-40 transition group-focus-within:opacity-100 group-hover:opacity-100">
                    <IconBtn label={t.moveUp} onClick={() => update((b) => (move(b.sections[si].rows, ri, -1), b))}>
                      <IconUp />
                    </IconBtn>
                    <IconBtn label={t.moveDown} onClick={() => update((b) => (move(b.sections[si].rows, ri, 1), b))}>
                      <IconDown />
                    </IconBtn>
                    <IconBtn
                      label={t.delete}
                      onClick={() =>
                        update((b) => {
                          b.sections[si].rows.splice(ri, 1);
                          return b;
                        })
                      }
                    >
                      <IconX />
                    </IconBtn>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setAdding(adding === s.id ? null : s.id)}
            aria-expanded={adding === s.id}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-gold/60 px-3 py-1.5 text-sm text-gold-ink hover:bg-gold/5"
          >
            <IconPlus /> {t.addField}
          </button>
          {adding === s.id && (
            <div className="mt-2 rounded-xl border border-line bg-ivory/60 p-3">
              <div className="mb-2 text-xs font-medium text-soft">{t.quickAdd}</div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_FIELDS.filter((k) => !usedKeys.has(k)).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      update((b) => {
                        b.sections[si].rows.push(newFieldRow(s.id, k, bio.lang));
                        return b;
                      });
                      setAdding(null);
                    }}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink hover:border-gold"
                  >
                    + {FIELDS[k].label[bio.lang]}
                  </button>
                ))}
                <button
                  onClick={() => {
                    update((b) => {
                      b.sections[si].rows.push({ id: `${s.id}-custom${uid()}`, label: t.newField, value: "" });
                      return b;
                    });
                    setAdding(null);
                  }}
                  className="rounded-full border border-dashed border-gold/60 px-3 py-1 text-sm text-gold-ink"
                >
                  + {t.customField}
                </button>
              </div>
            </div>
          )}
          {s.id === "horoscope" &&
            (bio.kundali ? (
              <KundaliEditor bio={bio} update={update} lang={lang} />
            ) : (
              <button
                onClick={() => update((b) => ({ ...b, kundali: emptyKundali() }))}
                className="mt-3 ml-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-maroon/40 px-3 py-1.5 text-sm text-maroon hover:bg-maroon/5"
              >
                <IconPlus /> {t.addKundali}
              </button>
            ))}
        </div>
      ))}

      <button
        onClick={() =>
          update((b) => {
            b.sections.push({ id: `sec${uid()}`, title: t.newSection, rows: [{ id: `x-custom${uid()}`, label: t.newField, value: "" }] });
            return b;
          })
        }
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line py-3 text-sm text-soft hover:border-gold hover:text-ink"
      >
        <IconPlus /> {t.addSection}
      </button>
    </div>
  );
}

/** Gentle checks for the fields people most often mistype (never blocks saving). */
function fieldWarning(key: string, value: string, t: (typeof DICTS)["en"]["editor"]) {
  const v = value.trim();
  if (!v) return "";
  if (key === "phone") {
    // Placeholder-style masks like 98XXX XXXXX are fine; letters otherwise are a typo.
    const digits = v.replace(/[^0-9Xx०-९]/g, "");
    if (/[A-WYZa-wyz]/.test(v) || digits.length < 10) return t.checkPhone;
  }
  if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return t.checkEmail;
  return "";
}

function AutoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={2} {...props} style={{ fieldSizing: "content", minHeight: "2.6rem" } as React.CSSProperties} className={`${props.className} resize-none`} />;
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="rounded p-1 text-soft hover:bg-sand hover:text-ink">
      {children}
    </button>
  );
}

function SectionTools({
  t,
  section,
  onUp,
  onDown,
  onToggle,
  onDelete,
}: {
  t: (typeof DICTS)["en"]["editor"];
  section: Section;
  onUp: () => void;
  onDown: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0">
      <IconBtn label={t.moveUp} onClick={onUp}>
        <IconUp />
      </IconBtn>
      <IconBtn label={t.moveDown} onClick={onDown}>
        <IconDown />
      </IconBtn>
      <IconBtn label={section.hidden ? t.showSection : t.hideSection} onClick={onToggle}>
        <IconEye off={section.hidden} />
      </IconBtn>
      <IconBtn label={t.deleteSection} onClick={onDelete}>
        <IconX />
      </IconBtn>
    </div>
  );
}

function PhotoCard({ bio, update, lang }: { bio: Biodata; update: Props["update"]; lang: Lang }) {
  const t = DICTS[lang].editor;
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setLoading(true);
    try {
      const src = await resizePhoto(f);
      update((b) => ({ ...b, photo: { src, zoom: 1, x: 50, y: 30 } }));
    } finally {
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  }

  const p = bio.photo;
  const set = (k: "zoom" | "x" | "y", v: number) => update((b) => (b.photo ? { ...b, photo: { ...b.photo, [k]: v } } : b));

  return (
    <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => input.current?.click()}
          className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-dashed border-gold/70 bg-ivory text-xs text-soft"
        >
          {p ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${p.x}% ${p.y}%` }} />
          ) : loading ? (
            "…"
          ) : (
            <span className="px-2">{t.uploadPhoto}</span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{t.photo}</div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => input.current?.click()} className="rounded-full border border-line px-3 py-1 text-sm hover:border-gold">
              {p ? t.changePhoto : t.uploadPhoto}
            </button>
            {p && (
              <button onClick={() => update((b) => ({ ...b, photo: null }))} className="rounded-full px-3 py-1 text-sm text-soft hover:text-maroon">
                {t.removePhoto}
              </button>
            )}
          </div>
        </div>
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {p && (
        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-soft sm:grid-cols-3">
          <Range label={t.zoom} min={1} max={2.5} step={0.05} value={p.zoom} onChange={(v) => set("zoom", v)} />
          <Range label={t.posX} min={0} max={100} step={1} value={p.x} onChange={(v) => set("x", v)} />
          <Range label={t.posY} min={0} max={100} step={1} value={p.y} onChange={(v) => set("y", v)} />
        </div>
      )}
    </div>
  );
}

function Range({ label, ...r }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      {label}
      <input type="range" min={r.min} max={r.max} step={r.step} value={r.value} onChange={(e) => r.onChange(Number(e.target.value))} className="mt-1 w-full accent-maroon" />
    </label>
  );
}
