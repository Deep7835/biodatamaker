"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

type NavLink = { href: string; label: string };
type Hit = { l: Lang; t: string; d: string; u: string; k: string };

const T = {
  en: { menu: "Menu", close: "Close", search: "Search", placeholder: "Search formats, tools, guides…", none: "No matches. Try “format”, “marathi” or “kundali”.", dark: "Dark mode", light: "Light mode", hint: "Press / to search" },
  hi: { menu: "मेनू", close: "बंद करें", search: "खोजें", placeholder: "फॉर्मेट, टूल्स, गाइड खोजें…", none: "कुछ नहीं मिला। “फॉर्मेट”, “कुंडली” या “शादी” लिखकर देखें।", dark: "डार्क मोड", light: "लाइट मोड", hint: "खोजने के लिए / दबाएँ" },
  mr: { menu: "मेनू", close: "बंद करा", search: "शोधा", placeholder: "फॉरमॅट, साधने, मार्गदर्शन शोधा…", none: "काही सापडले नाही. “फॉरमॅट”, “कुंडली” किंवा “लग्न” लिहून पाहा.", dark: "डार्क मोड", light: "लाइट मोड", hint: "शोधण्यासाठी / दाबा" },
};

const icon = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;
const SearchIcon = () => (
  <svg {...icon} className="size-5" aria-hidden>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </svg>
);
const MenuIcon = ({ open }: { open: boolean }) => (
  <svg {...icon} className="size-6" aria-hidden>
    {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
  </svg>
);
const MoonIcon = () => (
  <svg {...icon} className="size-5" aria-hidden>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);
const SunIcon = () => (
  <svg {...icon} className="size-5" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const btn = "flex size-10 items-center justify-center rounded-full text-soft transition hover:bg-sand hover:text-ink";

/* ---------- Theme ---------- */

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark");
    sync(); // read the theme set by the no-flash head script
    window.addEventListener("biodatasathi:theme", sync);
    return () => window.removeEventListener("biodatasathi:theme", sync);
  }, []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.dispatchEvent(new Event("biodatasathi:theme"));
    try {
      localStorage.setItem("biodatasathi:theme", next ? "dark" : "light");
    } catch {
      /* storage blocked: the toggle still works for this visit */
    }
  };
  return { dark, toggle };
}

export function ThemeToggle({ lang, withLabel }: { lang: Lang; withLabel?: boolean }) {
  const { dark, toggle } = useTheme();
  const label = dark ? T[lang].light : T[lang].dark;
  if (withLabel)
    return (
      <button type="button" onClick={toggle} className="flex w-full items-center gap-3 py-3 text-base text-ink">
        {dark ? <SunIcon /> : <MoonIcon />} {label}
      </button>
    );
  return (
    <button type="button" onClick={toggle} className={btn} aria-label={label} title={label}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* ---------- Search ---------- */

let indexPromise: Promise<Hit[]> | null = null;
const loadIndex = () => (indexPromise ??= fetch("/search-index.json").then((r) => r.json() as Promise<Hit[]>));
const norm = (s: string) => s.toLowerCase().normalize("NFC");

function useSearchResults(q: string, lang: Lang) {
  const [index, setIndex] = useState<Hit[]>([]);
  useEffect(() => {
    loadIndex()
      .then(setIndex)
      .catch(() => undefined);
  }, []);
  return useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index
      .map((h) => {
        const title = norm(h.t);
        const hay = `${title} ${norm(h.k)} ${norm(h.d)} ${h.u}`;
        if (!terms.every((w) => hay.includes(w))) return null;
        const score = (h.l === lang ? 10 : 0) + terms.filter((w) => title.includes(w)).length * 3;
        return { h, score };
      })
      .filter((x): x is { h: Hit; score: number } => !!x)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.h);
  }, [q, index, lang]);
}

export function SearchButton({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn} aria-label={T[lang].search} title={`${T[lang].search} (/)`}>
        <SearchIcon />
      </button>
      {open && <SearchDialog lang={lang} onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = T[lang];
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const results = useSearchResults(q, lang);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  const go = (u: string) => {
    onClose();
    window.location.href = u;
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/40 p-4 pt-[12vh]" role="dialog" aria-modal aria-label={t.search} onClick={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-paper shadow-2xl ring-1 ring-line" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-line px-4">
          <span className="text-soft">
            <SearchIcon />
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
              if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
              if (e.key === "Enter" && results[active]) go(results[active].u);
            }}
            placeholder={t.placeholder}
            aria-label={t.search}
            className="min-w-0 flex-1 bg-transparent py-4 text-base text-ink outline-none placeholder:text-soft/70"
          />
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-xs text-soft ring-1 ring-line hover:text-ink">
            Esc
          </button>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto p-2" role="listbox" aria-label={t.search}>
          {q && results.length === 0 && <li className="px-3 py-6 text-center text-sm text-soft">{t.none}</li>}
          {results.map((h, i) => (
            <li key={h.u} role="option" aria-selected={i === active}>
              <Link
                href={h.u}
                onClick={onClose}
                onMouseEnter={() => setActive(i)}
                className={`block rounded-xl px-3 py-2.5 ${i === active ? "bg-sand" : ""}`}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  {h.t}
                  {h.l !== lang && <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] uppercase text-soft">{h.l}</span>}
                </span>
                {h.d && <span className="mt-0.5 line-clamp-1 block text-xs text-soft">{h.d}</span>}
              </Link>
            </li>
          ))}
        </ul>
        {!q && <p className="border-t border-line px-4 py-2 text-xs text-soft">{t.hint}</p>}
      </div>
    </div>
  );
}

/* ---------- Mobile menu ---------- */

export function MobileMenu({ lang, links, cta, extra }: { lang: Lang; links: NavLink[]; cta: NavLink; extra?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen(!open)} className={btn} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? T[lang].close : T[lang].menu}>
        <MenuIcon open={open} />
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-line bg-paper px-4 pb-5 pt-2 shadow-lg">
          <nav className="flex flex-col" aria-label={T[lang].menu}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-3 text-base text-ink last:border-0">
                {l.label}
              </Link>
            ))}
            <div className="border-t border-line sm:hidden">{extra}</div>
          </nav>
          <Link href={cta.href} onClick={() => setOpen(false)} className="mt-3 block rounded-full bg-maroon py-3 text-center font-semibold text-white">
            {cta.label}
          </Link>
        </div>
      )}
    </div>
  );
}
