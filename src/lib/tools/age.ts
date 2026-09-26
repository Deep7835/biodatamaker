import { toDevanagariDigits, type Lang } from "@/lib/i18n";

/** A calendar date with no time zone: month is 1–12. */
export type YMD = { y: number; m: number; d: number };
export type Span = { years: number; months: number; days: number; totalDays: number };

/** Parses "YYYY-MM-DD" (the value of <input type="date">). Returns null for anything invalid, e.g. 2023-02-29. */
export function parseDate(s: string): YMD | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth(y, mo)) return null;
  return { y, m: mo, d };
}

export function toISO({ y, m, d }: YMD): string {
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function todayYMD(now = new Date()): YMD {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

export function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number) {
  return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

const dayNumber = ({ y, m, d }: YMD) => Date.UTC(y, m - 1, d) / 86400000;

export function compare(a: YMD, b: YMD) {
  return dayNumber(a) - dayNumber(b);
}

/** Adds whole months, clamping to the month end (31 Jan + 1 month = 28/29 Feb). */
function addMonths(a: YMD, n: number): YMD {
  const idx = a.y * 12 + (a.m - 1) + n;
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  return { y, m, d: Math.min(a.d, daysInMonth(y, m)) };
}

/**
 * Calendar difference from `from` to `to` (from ≤ to) as years, months and days, the way age is
 * normally counted: whole months first, then the remaining days. A 29 February birthday completes
 * a year on 28 February in non-leap years.
 */
export function diff(from: YMD, to: YMD): Span {
  if (compare(from, to) > 0) [from, to] = [to, from];
  let months = (to.y - from.y) * 12 + (to.m - from.m);
  if (compare(addMonths(from, months), to) > 0) months--;
  const anchor = addMonths(from, months);
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: compare(to, anchor),
    totalDays: compare(to, from),
  };
}

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
};

/** "14 March 1998" / "14 मार्च 1998", the usual biodata style. */
export function formatDate({ y, m, d }: YMD, lang: Lang, devanagari = false): string {
  const s = `${d} ${MONTHS[lang][m - 1]} ${y}`;
  return devanagari ? toDevanagariDigits(s) : s;
}
