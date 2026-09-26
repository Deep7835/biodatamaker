"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { captureUtm } from "@/lib/analytics";

const KEY = "biodatasathi:consent";

const T = {
  en: { text: "We'd like to use analytics cookies to see which pages help people. Your biodata details are never included.", accept: "Accept", decline: "No thanks", more: "Privacy policy" },
  hi: { text: "हम यह समझने के लिए एनालिटिक्स कुकीज़ इस्तेमाल करना चाहते हैं कि कौन-से पेज काम आते हैं। आपके बायोडाटा की जानकारी कभी शामिल नहीं होती।", accept: "स्वीकार करें", decline: "नहीं, धन्यवाद", more: "प्राइवेसी पॉलिसी" },
  mr: { text: "कोणती पाने उपयोगी पडतात हे समजण्यासाठी आम्ही ॲनालिटिक्स कुकीज वापरू इच्छितो. तुमच्या बायोडाटाची माहिती कधीच समाविष्ट होत नाही.", accept: "स्वीकारा", decline: "नको, धन्यवाद", more: "गोपनीयता धोरण" },
};

function load(src: string, inline?: string) {
  const s = document.createElement("script");
  if (src) {
    s.async = true;
    s.src = src;
  } else if (inline) s.text = inline;
  document.head.appendChild(s);
}

function start(gaId: string, clarityId: string) {
  if (gaId) {
    load(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
    load("", `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)},{anonymize_ip:true});`);
  }
  if (clarityId)
    load(
      "",
      `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",${JSON.stringify(clarityId)});`,
    );
}

/** Consent banner (only when cookie-setting analytics are configured) + first-touch UTM capture. */
export function ConsentAnalytics({ gaId, clarityId }: { gaId: string; clarityId: string }) {
  const [ask, setAsk] = useState(false);
  const [lang, setLang] = useState<"en" | "hi" | "mr">("en");

  useEffect(() => {
    captureUtm();
    if (!gaId && !clarityId) return;
    const l = document.documentElement.lang.slice(0, 2);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read page language + stored choice after mount
    setLang(l === "hi" || l === "mr" ? l : "en");
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(KEY);
    } catch {
      /* storage blocked: treat as undecided */
    }
    if (choice === "granted") start(gaId, clarityId);
    else if (choice !== "denied") setAsk(true);
  }, [gaId, clarityId]);

  if (!ask) return null;
  const t = T[lang];
  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(KEY, granted ? "granted" : "denied");
    } catch {
      /* ignore */
    }
    if (granted) start(gaId, clarityId);
    setAsk(false);
  };
  return (
    <div data-print-hide role="dialog" aria-live="polite" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-[65] mx-auto max-w-2xl rounded-2xl border border-line bg-paper p-4 shadow-xl sm:flex sm:items-center sm:gap-4">
      <p className="text-sm leading-relaxed text-ink">
        {t.text}{" "}
        <Link href="/privacy/" className="text-maroon underline underline-offset-2">
          {t.more}
        </Link>
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button type="button" onClick={() => decide(false)} className="rounded-full border border-line px-4 py-2 text-sm text-soft hover:text-ink">
          {t.decline}
        </button>
        <button type="button" onClick={() => decide(true)} className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-dark">
          {t.accept}
        </button>
      </div>
    </div>
  );
}
