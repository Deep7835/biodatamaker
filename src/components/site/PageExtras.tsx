"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const T = {
  en: { top: "Back to top", contact: "Contact us" },
  hi: { top: "ऊपर जाएँ", contact: "संपर्क करें" },
  mr: { top: "वर जा", contact: "संपर्क साधा" },
};

const icon = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;

/** Reading-progress bar under the header, back-to-top and a floating contact button (article pages). */
export function PageExtras({ lang }: { lang: Lang }) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        setShowTop(window.scrollY > 900);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div data-print-hide>
      <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent" aria-hidden>
        <div className="h-full origin-left bg-maroon transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="fixed bottom-5 right-4 z-30 flex flex-col items-center gap-2">
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={T[lang].top}
            title={T[lang].top}
            className="flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-md transition hover:border-gold"
          >
            <svg {...icon} className="size-5" aria-hidden>
              <path d="M6 14l6-6 6 6" />
            </svg>
          </button>
        )}
        <Link
          href="/contact/"
          aria-label={T[lang].contact}
          title={T[lang].contact}
          className="flex size-12 items-center justify-center rounded-full bg-maroon text-white shadow-lg shadow-maroon/25 transition hover:bg-maroon-dark"
        >
          <svg {...icon} className="size-5" aria-hidden>
            <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
