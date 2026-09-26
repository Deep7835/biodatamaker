import { toDevanagariDigits, type Lang } from "@/lib/i18n";

/** 1 inch is exactly 2.54 cm (international definition). */
export const CM_PER_INCH = 2.54;

export function ftInToCm(ft: number, inch: number): number {
  return (ft * 12 + inch) * CM_PER_INCH;
}

/** Centimetres to feet + whole inches, rounded to the nearest inch (so 182.8 cm is 6' 0", not 5' 12"). */
export function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = Math.round(cm / CM_PER_INCH);
  return { ft: Math.floor(totalIn / 12), inch: totalIn % 12 };
}

/** Rounds to `dp` decimals and drops trailing zeros: 162.56 → "162.6", 150 → "150". */
export function trimNum(n: number, dp: number): string {
  if (!Number.isFinite(n)) return "";
  const f = 10 ** dp;
  return String(Math.round(n * f) / f);
}

const UNITS: Record<Lang, { ft: string; inch: string; cm: string }> = {
  en: { ft: "ft", inch: "in", cm: "cm" },
  hi: { ft: "फुट", inch: "इंच", cm: "से.मी." },
  mr: { ft: "फूट", inch: "इंच", cm: "सें.मी." },
};

/**
 * How the height is usually written in a biodata, e.g. `5' 4" (163 cm)`, `5 फुट 4 इंच (163 से.मी.)`,
 * `5 फूट 4 इंच (163 सें.मी.)`. Whole inches, whole centimetres (from `exactCm` when the user typed centimetres,
 * so 167 cm stays 167 even though 5' 6" is 167.6). 0 inches is written as just the feet in Hindi/Marathi.
 */
export function biodataHeight(ft: number, inch: number, lang: Lang, devanagari = false, exactCm?: number): string {
  const cm = Math.round(exactCm ?? ftInToCm(ft, inch));
  let s: string;
  if (lang === "en") s = `${ft}' ${inch}" (${cm} cm)`;
  else {
    const u = UNITS[lang];
    s = inch ? `${ft} ${u.ft} ${inch} ${u.inch} (${cm} ${u.cm})` : `${ft} ${u.ft} (${cm} ${u.cm})`;
  }
  return devanagari && lang !== "en" ? toDevanagariDigits(s) : s;
}

/** 4' 6" to 6' 6" in one-inch steps, with centimetres rounded to whole numbers. */
export function heightTable(fromIn = 54, toIn = 78): { ft: number; inch: number; cm: number }[] {
  const rows = [];
  for (let t = fromIn; t <= toIn; t++) rows.push({ ft: Math.floor(t / 12), inch: t % 12, cm: Math.round(t * CM_PER_INCH) });
  return rows;
}
