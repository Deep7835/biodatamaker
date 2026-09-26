"use client";

import type { Lang } from "./i18n";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/**
 * Phonetic English → Devanagari using Google Input Tools (public, CORS-enabled, no key).
 * Returns the original word if the service is unreachable so typing never breaks.
 */
export async function transliterateWord(word: string, lang: Lang): Promise<string> {
  if (lang === "en" || !/^[a-zA-Z]+$/.test(word)) return word;
  const key = `${lang}:${word.toLowerCase()}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const pending = inflight.get(key);
  if (pending) return pending;
  const job = lookup(word, lang, key).finally(() => inflight.delete(key));
  inflight.set(key, job);
  return job;
}

async function lookup(word: string, lang: Lang, key: string): Promise<string> {
  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=${lang}-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`;
    const res = await fetch(url);
    const json = await res.json();
    const out: string = json?.[0] === "SUCCESS" ? json[1]?.[0]?.[1]?.[0] ?? word : word;
    cache.set(key, out);
    return out;
  } catch {
    return word;
  }
}

/**
 * A finished English word worth converting: has a lowercase letter (so MBA, CA, B.E., XXX stay as typed),
 * isn't glued to an email/URL/number (family@example.com, www.site.in, 98XXX), and is followed by a
 * space or punctuation.
 */
const COMPLETED_WORD = /(?<![\w@./])[A-Za-z]*[a-z][A-Za-z]*(?=[\s,;:()-]|\.(?![A-Za-z0-9]))/g;

/**
 * Completed Latin words (followed by a space/punctuation) that haven't been looked up yet.
 * Covers typing, paste, swipe-typing and keyboard suggestions, which insert several words at once.
 */
export function pendingWords(text: string, lang: Lang): string[] {
  if (lang === "en") return [];
  const words = text.match(COMPLETED_WORD) ?? [];
  return [...new Set(words)].filter((w) => !cache.has(`${lang}:${w.toLowerCase()}`));
}

/**
 * Replace every completed Latin word (one followed by a space/punctuation) that we've already
 * transliterated. Applied on each keystroke, so a slow lookup can never be undone by typing
 * that raced ahead of it.
 */
export function applyCached(text: string, lang: Lang): string {
  if (lang === "en") return text;
  return text.replace(COMPLETED_WORD, (w) => cache.get(`${lang}:${w.toLowerCase()}`) ?? w);
}
