"use client";

export type Script = "mr" | "hi";

const cache = new Map<string, string[]>();

/**
 * Up to `num` Devanagari candidates for one English word, from the same Google Input Tools endpoint
 * that `transliterateWord` uses (public, CORS-enabled, no key). Returns [] when offline or on error.
 */
export async function fetchSuggestions(word: string, lang: Script, num = 5): Promise<string[]> {
  if (!/^[a-zA-Z]+$/.test(word)) return [];
  const key = `${lang}:${num}:${word.toLowerCase()}`;
  const hit = cache.get(key);
  if (hit) return hit;
  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=${lang}-t-i0-und&num=${num}&cp=0&cs=1&ie=utf-8&oe=utf-8`;
    const res = await fetch(url);
    const json = await res.json();
    const list: unknown = json?.[0] === "SUCCESS" ? json[1]?.[0]?.[1] : null;
    const out = Array.isArray(list) ? list.filter((x): x is string => typeof x === "string").slice(0, num) : [];
    if (out.length) cache.set(key, out);
    return out;
  } catch {
    return [];
  }
}

/**
 * Same rule as the private COMPLETED_WORD in src/lib/transliterate.ts: a Latin word with at least one
 * lowercase letter, not part of an email/URL/number, followed by a space or punctuation.
 */
const COMPLETED_WORD = /(?<![\w@./])[A-Za-z]*[a-z][A-Za-z]*(?=[\s,;:()-]|\.(?![A-Za-z0-9]))/g;

/** The last completed Latin word that ends at or before `caret` (the word the user has just finished). */
export function lastCompletedWord(text: string, caret = text.length): string | null {
  let last: string | null = null;
  for (const m of text.matchAll(COMPLETED_WORD)) {
    if (m.index + m[0].length < caret) last = m[0];
  }
  return last;
}

/**
 * Applies `apply` (e.g. applyCached) to everything except the Latin word the caret is touching, so a word
 * being typed or edited in the middle of the text is never converted half-way. Returns the new text,
 * where the caret should go, and the two outer parts (to look up pending words in).
 */
export function convertAroundCaret(text: string, caret: number, apply: (s: string) => string) {
  let s = caret;
  let e = caret;
  while (s > 0 && /[A-Za-z]/.test(text[s - 1])) s--;
  while (e < text.length && /[A-Za-z]/.test(text[e])) e++;
  const before = text.slice(0, s);
  const after = text.slice(e);
  const head = apply(before);
  return { text: head + text.slice(s, e) + apply(after), caret: head.length + (caret - s), parts: [before, after] };
}

/** Replaces the last occurrence of `from` that ends at or before `near` with `to`. */
export function replaceNear(text: string, from: string, to: string, near = text.length): { text: string; at: number } | null {
  if (!from) return null;
  const i = text.lastIndexOf(from, Math.max(0, near - from.length));
  const j = i >= 0 ? i : text.lastIndexOf(from);
  if (j < 0) return null;
  return { text: text.slice(0, j) + to + text.slice(j + from.length), at: j + to.length };
}

/** Words = whitespace-separated runs; characters = user-perceived letters (graphemes) where supported. */
export function counts(text: string): { words: number; chars: number } {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  let chars: number;
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    chars = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].length;
  } else chars = [...text].length;
  return { words, chars };
}
