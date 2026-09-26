export const SITE = {
  name: "BiodataSathi",
  url: "https://biodatasathi.com",
  // Shown on the Contact / policy pages. Razorpay checks these match your KYC details before activating live payments.
  contactEmail: "support@biodatasathi.com",
  operator: "BiodataSathi", // TODO: your legal/business name as registered with Razorpay
  address: "", // TODO: business address (required by Razorpay); hidden while empty
};

export const LANGS = ["en", "hi", "mr"] as const;
export type Lang = (typeof LANGS)[number];

/** URL prefix per language. English lives at the root. */
export const LANG_PREFIX: Record<Lang, string> = {
  en: "",
  hi: "/hindi",
  mr: "/marathi",
};

export const LANG_SLUG_TO_CODE: Record<string, Lang> = {
  hindi: "hi",
  marathi: "mr",
};

export const HREFLANG: Record<Lang, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export const LANG_NATIVE: Record<Lang, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};

export function href(lang: Lang, path = "/") {
  const p = path === "/" ? "/" : path.endsWith("/") ? path : `${path}/`;
  return `${LANG_PREFIX[lang]}${p}`;
}

/** Canonical + hreflang alternates for a path that exists in every language. */
export function alternates(lang: Lang, path = "/") {
  return {
    canonical: `${SITE.url}${href(lang, path)}`,
    languages: {
      "en-IN": `${SITE.url}${href("en", path)}`,
      "hi-IN": `${SITE.url}${href("hi", path)}`,
      "mr-IN": `${SITE.url}${href("mr", path)}`,
      "x-default": `${SITE.url}${href("en", path)}`,
    },
  };
}

const DEVANAGARI_DIGITS = "०१२३४५६७८९";
export function toDevanagariDigits(s: string) {
  return s.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}
