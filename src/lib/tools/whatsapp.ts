import type { Biodata } from "@/lib/biodata";
import { toDevanagariDigits } from "@/lib/i18n";

export type WaStyle = "minimal" | "decorative";
export type WaOptions = { style: WaStyle; devanagariDigits: boolean };

/** WhatsApp accepts long messages, but wa.me links and some phones cut very long pre-filled text. */
export const WA_SOFT_LIMIT = 4000;

/** Plain typographic marks (never emoji) so the message looks the same on every phone. */
const BULLET = "•";
const HEADING_MARK = "◆";
const TITLE_MARK = "✦";

/** Phone numbers and emails keep Latin digits so WhatsApp can still make them tappable. */
const KEEP_LATIN = /-(phone|email)$/;

/** Collapse a (possibly multi-line) value to one tidy line. */
function oneLine(s: string) {
  return s
    .split(/\r?\n/)
    .map((x) => x.trim().replace(/[,;]+$/, ""))
    .filter(Boolean)
    .join(", ")
    .replace(/\s+/g, " ");
}

/** WhatsApp bold is *text*; stray asterisks inside the title would break it. */
function bold(s: string) {
  const clean = s.replace(/\*/g, "").trim();
  return clean ? `*${clean}*` : "";
}

/**
 * Formats a biodata as WhatsApp-ready plain text: invocation, *bold* title and section titles,
 * "• label: value" lines. Hidden sections and empty rows are skipped; the photo and kundali chart
 * can't travel as text and are left out.
 */
export function formatWhatsapp(bio: Biodata, opts: WaOptions): string {
  const deco = opts.style === "decorative";
  const digits = (rowId: string, s: string) => (opts.devanagariDigits && !KEEP_LATIN.test(rowId) ? toDevanagariDigits(s) : s);
  const out: string[] = [];

  const invocation = oneLine(bio.invocation ?? "");
  if (invocation) out.push(invocation);
  const title = bold(oneLine(bio.title ?? ""));
  if (title) out.push(deco ? `${TITLE_MARK} ${title} ${TITLE_MARK}` : title);

  for (const s of bio.sections ?? []) {
    if (s.hidden) continue;
    const rows = (s.rows ?? [])
      .map((r) => ({ label: oneLine(r.label ?? ""), value: oneLine(r.value ?? ""), id: r.id ?? "" }))
      .filter((r) => r.value);
    if (!rows.length) continue;
    if (out.length) out.push(deco ? "━━━━━━━━━━━━" : "");
    const heading = bold(oneLine(s.title ?? ""));
    if (heading) out.push(deco ? `${HEADING_MARK} ${heading}` : heading);
    for (const r of rows) {
      const value = digits(r.id, r.value);
      out.push(r.label ? `${BULLET} ${r.label}: ${value}` : `${BULLET} ${value}`);
    }
  }
  return out.join("\n").trim();
}

export function waShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** True when the draft has at least one filled row. */
export function hasContent(bio: Biodata | null | undefined): bio is Biodata {
  return !!bio?.sections?.some((s) => s.rows?.some((r) => r.value?.trim()));
}
