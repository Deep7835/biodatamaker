"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { copyText } from "@/lib/tools/clipboard";
import { biodataHeight, cmToFtIn, ftInToCm, heightTable, trimNum } from "@/lib/tools/height";

const T = {
  en: {
    ftin: "Feet and inches",
    ft: "Feet",
    inch: "Inches",
    cm: "Centimetres (cm)",
    m: "Metres (m)",
    result: "Write it in your biodata as",
    copy: "Copy",
    copied: "Copied!",
    copyFail: "Couldn't copy. Select the text and copy it by hand.",
    digits: "Devanagari digits (१२३)",
    invalid: "Enter a height between 3 ft and 8 ft (about 90–245 cm).",
    rounded: (ft: number, inch: number) => `Nearest whole inch: ${ft}' ${inch}"`,
    table: "Quick height chart",
    tableHint: "Tap a row to use it.",
    colFtIn: "Feet-inches",
    colCm: "cm",
  },
  hi: {
    ftin: "फुट और इंच",
    ft: "फुट",
    inch: "इंच",
    cm: "सेंटीमीटर (से.मी.)",
    m: "मीटर (मी.)",
    result: "बायोडाटा में ऐसे लिखें",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया!",
    copyFail: "कॉपी नहीं हो पाया। टेक्स्ट चुनकर खुद कॉपी करें।",
    digits: "देवनागरी अंक (१२३)",
    invalid: "3 फुट से 8 फुट (लगभग 90–245 से.मी.) के बीच की ऊँचाई डालें।",
    rounded: (ft: number, inch: number) => `नज़दीकी पूरा इंच: ${ft} फुट ${inch} इंच`,
    table: "ऊँचाई चार्ट",
    tableHint: "किसी पंक्ति पर टैप करके उसे चुनें।",
    colFtIn: "फुट-इंच",
    colCm: "से.मी.",
  },
  mr: {
    ftin: "फूट आणि इंच",
    ft: "फूट",
    inch: "इंच",
    cm: "सेंटिमीटर (सें.मी.)",
    m: "मीटर (मी.)",
    result: "बायोडाटामध्ये असे लिहा",
    copy: "कॉपी करा",
    copied: "कॉपी झाले!",
    copyFail: "कॉपी झाले नाही. मजकूर निवडून स्वतः कॉपी करा.",
    digits: "मराठी अंक (१२३)",
    invalid: "3 फूट ते 8 फूट (साधारण 90–245 सें.मी.) दरम्यानची उंची टाका.",
    rounded: (ft: number, inch: number) => `जवळचा पूर्ण इंच: ${ft} फूट ${inch} इंच`,
    table: "उंची तक्ता",
    tableHint: "एखाद्या ओळीवर टॅप करून ती निवडा.",
    colFtIn: "फूट-इंच",
    colCm: "सें.मी.",
  },
};

type Vals = { ft: string; inch: string; cm: string; m: string };

const num = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(",", ".")));

function fromFtIn(ft: string, inch: string): Vals {
  const f = num(ft);
  const i = inch.trim() === "" ? 0 : num(inch);
  const cm = Number.isFinite(f) && Number.isFinite(i) ? ftInToCm(f, i) : NaN;
  return { ft, inch, cm: trimNum(cm, 1), m: trimNum(cm / 100, 2) };
}

function fromCm(cmStr: string, mStr?: string): Vals {
  const cm = num(cmStr);
  if (!Number.isFinite(cm)) return { ft: "", inch: "", cm: cmStr, m: mStr ?? "" };
  const { ft, inch } = cmToFtIn(cm);
  return { ft: String(ft), inch: String(inch), cm: cmStr, m: mStr ?? trimNum(cm / 100, 2) };
}

const inputCls =
  "w-full min-w-0 rounded-lg border border-line bg-ivory/60 px-3 py-2.5 text-lg text-ink outline-none transition focus:border-gold focus:bg-paper";

export default function HeightConverter({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [v, setV] = useState<Vals>(() => fromFtIn("5", "4"));
  const [digits, setDigits] = useState(false);
  const [status, setStatus] = useState("");

  const cm = num(v.cm);
  const valid = Number.isFinite(cm) && cm >= 90 && cm <= 245;
  const exact = valid ? cm / 2.54 : NaN;
  const whole = valid ? cmToFtIn(cm) : null;
  // Show the rounding note only when the typed feet/inches aren't already a whole-inch height.
  const fractional = valid && Math.abs(exact - Math.round(exact)) > 0.05;
  const line = whole ? biodataHeight(whole.ft, whole.inch, lang, digits, cm) : "";

  const update = (next: Vals) => {
    setV(next);
    setStatus("");
  };

  async function onCopy() {
    setStatus((await copyText(line)) ? t.copied : t.copyFail);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
      <div className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink">{t.ftin}</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs text-soft">{t.ft}</span>
                <input type="number" inputMode="numeric" min={3} max={8} step={1} value={v.ft} onChange={(e) => update(fromFtIn(e.target.value, v.inch))} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-soft">{t.inch}</span>
                <input type="number" inputMode="decimal" min={0} max={11.9} step={0.5} value={v.inch} onChange={(e) => update(fromFtIn(v.ft, e.target.value))} className={inputCls} />
              </label>
            </div>
          </fieldset>
          <div className="my-4 flex items-center gap-3 text-soft" aria-hidden>
            <span className="h-px flex-1 bg-line" />⇅<span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs text-soft">{t.cm}</span>
              <input type="number" inputMode="decimal" min={90} max={245} step={0.5} value={v.cm} onChange={(e) => update(fromCm(e.target.value))} className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-soft">{t.m}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0.9}
                max={2.45}
                step={0.01}
                value={v.m}
                onChange={(e) => {
                  const m = num(e.target.value);
                  update(fromCm(Number.isFinite(m) ? trimNum(m * 100, 1) : "", e.target.value));
                }}
                className={inputCls}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-gold/60 bg-sand/60 p-4 sm:p-5" aria-live="polite">
          {valid && whole ? (
            <>
              <p className="text-sm text-soft">{t.result}</p>
              <p className="mt-1 break-words font-display text-2xl text-maroon sm:text-3xl">{line}</p>
              {fractional && <p className="mt-1 text-xs text-soft">{t.rounded(whole.ft, whole.inch)}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" onClick={onCopy} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark">
                  {t.copy}
                </button>
                {lang !== "en" && (
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                    <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} className="h-4 w-4 accent-[var(--color-maroon)]" />
                    {t.digits}
                  </label>
                )}
              </div>
              <p className="mt-2 min-h-5 text-sm text-leaf">{status}</p>
            </>
          ) : (
            <p className="text-sm text-maroon">{t.invalid}</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <h2 className="font-display text-lg text-maroon">{t.table}</h2>
        <p className="mb-2 text-xs text-soft">{t.tableHint}</p>
        <div className="max-h-[26rem] overflow-y-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-sand text-left text-xs text-soft">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t.colFtIn}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {t.colCm}
                </th>
              </tr>
            </thead>
            <tbody>
              {heightTable().map((r) => {
                const active = whole && whole.ft === r.ft && whole.inch === r.inch;
                return (
                  <tr key={r.cm} className={`border-t border-line ${active ? "bg-maroon/10 font-semibold text-maroon" : ""}`}>
                    <td className="p-0" colSpan={2}>
                      <button
                        type="button"
                        onClick={() => update(fromFtIn(String(r.ft), String(r.inch)))}
                        aria-current={active ? "true" : undefined}
                        className="flex w-full justify-between px-3 py-1.5 text-left hover:bg-ivory"
                      >
                        <span>
                          {r.ft}&apos; {r.inch}&quot;
                        </span>
                        <span>{r.cm}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
