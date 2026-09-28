/**
 * Analytics & search-engine verification, all optional and switched on by env vars at build time
 * (see .env.example and docs/SETUP-TRACKING.md). Nothing loads unless its ID is set.
 */
export const ANALYTICS = {
  /** Cloudflare Web Analytics beacon token (cookieless; recommended). */
  cloudflareToken: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN ?? "",
  /** Google Analytics 4 measurement ID, e.g. G-XXXXXXX. */
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  /** Microsoft Clarity project ID (heatmaps + session recordings; biodata content is masked). */
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
  /** Google Search Console HTML-tag verification token. */
  // Public by design (it's printed in the page <head>), so it lives in code and every build/deploy includes it.
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "_yA_7dYFVtOmA8E2NOD_TRbuhWczpcHqmwoQmQPYPqs",
  /** Bing Webmaster Tools msvalidate.01 token. */
  bingVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
};

const UTM_KEY = "biodatasathi:utm";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

/** Remembers the first campaign (utm_*) this visit arrived with, so later events can be attributed. */
export function captureUtm() {
  try {
    if (sessionStorage.getItem(UTM_KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(UTM_FIELDS.filter((k) => q.get(k)).map((k) => [k, q.get(k)!.slice(0, 100)]));
    if (Object.keys(utm).length) sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch {
    /* storage blocked */
  }
}

function utmParams(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Sends a named event (with the visit's campaign, if any) to whichever analytics are enabled. */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; clarity?: (...a: unknown[]) => void };
  w.gtag?.("event", name, { ...utmParams(), ...params });
  w.clarity?.("event", name);
}

/** Builds a campaign link, e.g. utmLink("/marathi/", "whatsapp", "group", "diwali-2026"). */
export function utmLink(path: string, source: string, medium: string, campaign: string) {
  const u = new URL(path, "https://biodatasathi.com");
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", medium);
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}
