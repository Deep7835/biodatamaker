import Link from "next/link";
import { topicPath } from "@/content/slugs";
import type { Topic } from "@/content/types";
import { DICTS } from "@/lib/dict";
import { href, SITE, type Lang } from "@/lib/i18n";
import { MobileMenu, SearchButton, ThemeToggle } from "./HeaderClient";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { TOOLS_LABEL } from "./ToolsGrid";

export function Logo({ lang }: { lang: Lang }) {
  return (
    <Link href={href(lang, "/")} className="flex items-center gap-2" aria-label={SITE.name}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect x="3" y="2" width="26" height="28" rx="4" fill="#8A1C2B" />
        <rect x="6.5" y="5.5" width="19" height="21" rx="2" fill="none" stroke="#E7C58F" strokeWidth="1" />
        <circle cx="16" cy="12" r="3.2" fill="#E7C58F" />
        <path d="M10.5 19h11M10.5 22.5h8" stroke="#FBF8F3" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="whitespace-nowrap font-display text-base leading-none tracking-tight text-ink min-[400px]:text-lg sm:text-xl">
        Marathi Biodata <span className="text-maroon">Make</span>
      </span>
    </Link>
  );
}

const SKIP = { en: "Skip to content", hi: "मुख्य सामग्री पर जाएँ", mr: "मुख्य मजकुराकडे जा" };

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = DICTS[lang].nav;
  const links = [
    { href: href(lang, "/templates"), label: t.templates },
    { href: topicPath("format", lang)!, label: t.formats },
    { href: topicPath("guide", lang)!, label: t.guide },
    { href: topicPath("tools", lang)!, label: TOOLS_LABEL[lang] },
  ];
  const cta = { href: href(lang, "/create"), label: t.create };
  return (
    <header data-print-hide className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur">
      <a href="#main" className="skip-link">
        {SKIP[lang]}
      </a>
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4">
        <Logo lang={lang} />
        <nav className="ml-4 hidden items-center gap-6 text-[15px] text-soft md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchButton lang={lang} />
          <span className="hidden sm:block">
            <ThemeToggle lang={lang} />
          </span>
          <span className="hidden sm:block">
            <LanguageSwitcher lang={lang} />
          </span>
          <Link href={cta.href} className="ml-1 hidden rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-dark md:inline-block">
            {cta.label}
          </Link>
          <MobileMenu
            lang={lang}
            links={links}
            cta={cta}
            extra={
              <>
                <div className="py-3">
                  <LanguageSwitcher lang={lang} />
                </div>
                <ThemeToggle lang={lang} withLabel />
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}

type L = Record<Lang, string>;

const LABEL: Partial<Record<Topic, L>> = {
  create: { en: "Create biodata", hi: "बायोडाटा बनाएँ", mr: "बायोडाटा बनवा" },
  templates: { en: "Templates", hi: "टेम्पलेट", mr: "टेम्पलेट्स" },
  format: { en: "Biodata format", hi: "बायोडाटा फॉर्मेट", mr: "बायोडाटा फॉरमॅट" },
  samples: { en: "Word & PDF samples", hi: "PDF / Word नमूना", mr: "बायोडाटा नमुना" },
  guide: { en: "What to write", hi: "बायोडाटा कैसे बनाएं", mr: "बायोडाटा कसा बनवायचा" },
  girl: { en: "For girl", hi: "लड़की का बायोडाटा", mr: "मुलीचा बायोडाटा" },
  boy: { en: "For boy", hi: "लड़के का बायोडाटा", mr: "मुलाचा बायोडाटा" },
  secondMarriage: { en: "Second marriage", hi: "दूसरी शादी", mr: "दुसरे लग्न" },
  withoutPhoto: { en: "Without photo", hi: "बिना फोटो", mr: "फोटोशिवाय" },
  whatsapp: { en: "WhatsApp biodata", hi: "WhatsApp बायोडाटा", mr: "WhatsApp बायोडाटा" },
  hindu: { en: "Hindu", hi: "हिंदू", mr: "हिंदू" },
  brahmin: { en: "Brahmin", hi: "ब्राह्मण", mr: "ब्राह्मण" },
  jain: { en: "Jain", hi: "जैन", mr: "जैन" },
  buddhist: { en: "Buddhist", hi: "बौद्ध", mr: "बौद्ध" },
  muslim: { en: "Muslim", hi: "मुस्लिम बायोडाटा", mr: "मुस्लिम" },
  christian: { en: "Christian", hi: "ईसाई", mr: "ख्रिश्चन" },
  sikh: { en: "Sikh", hi: "सिख", mr: "शीख" },
  gunaMilan: { en: "Kundali matching", hi: "कुंडली मिलान", mr: "गुण मिलन" },
  birthChart: { en: "Rashi & nakshatra finder", hi: "राशि-नक्षत्र जानें", mr: "रास-नक्षत्र शोधा" },
  invitation: { en: "Wedding invitation", hi: "शादी कार्ड", mr: "लग्नपत्रिका" },
  muhurat: { en: "Vivah muhurat 2026–27", hi: "विवाह मुहूर्त 2026-27", mr: "लग्न मुहूर्त 2026-27" },
  typing: { en: "Marathi / Hindi typing", hi: "हिंदी टाइपिंग", mr: "मराठी टायपिंग" },
  tools: { en: "All tools", hi: "सभी टूल्स", mr: "सर्व साधने" },
};

const COLUMNS: { title: L; topics: Topic[] }[] = [
  { title: { en: "Biodata maker", hi: "बायोडाटा मेकर", mr: "बायोडाटा मेकर" }, topics: ["create", "templates", "format", "samples", "guide"] },
  { title: { en: "Biodata for", hi: "किसके लिए", mr: "कोणासाठी" }, topics: ["girl", "boy", "secondMarriage", "withoutPhoto", "whatsapp"] },
  { title: { en: "By community", hi: "समाज के अनुसार", mr: "समाजानुसार" }, topics: ["hindu", "brahmin", "jain", "buddhist", "muslim", "christian", "sikh"] },
  { title: { en: "Free tools", hi: "मुफ़्त टूल्स", mr: "मोफत साधने" }, topics: ["gunaMilan", "birthChart", "invitation", "muhurat", "typing"] },
];

const PER_COLUMN = 5;

/** Footer columns for a language: missing pages dropped, at most 5 links each; a column left with a single link folds into the previous one. */
function footerColumns(lang: Lang) {
  const cols = COLUMNS.map((c) => ({
    title: c.title[lang],
    items: c.topics.flatMap((t) => {
      const path = topicPath(t, lang);
      return path && LABEL[t] ? [{ href: path, label: LABEL[t]![lang] }] : [];
    }),
  }));
  const out: typeof cols = [];
  for (const c of cols) {
    if (c.items.length === 1 && out.length) out[out.length - 1].items.push(...c.items);
    else if (c.items.length) out.push(c);
  }
  return out.map((c) => ({ ...c, items: c.items.slice(0, PER_COLUMN) }));
}

const REFUND: L = { en: "Refund policy", hi: "रिफ़ंड नीति", mr: "परतावा धोरण" };
const HELP_TITLE: L = { en: "Languages & help", hi: "भाषा और मदद", mr: "भाषा व मदत" };

export function SiteFooter({ lang }: { lang: Lang }) {
  const d = DICTS[lang];
  const columns = footerColumns(lang);
  const help = [
    { href: "/", label: "English" },
    { href: "/hindi/", label: "हिंदी" },
    { href: "/marathi/", label: "मराठी" },
    { href: topicPath("tools", lang)!, label: LABEL.tools![lang] },
    { href: "/contact/", label: d.footer.contact },
  ];
  return (
    <footer data-print-hide className="mt-auto border-t border-line bg-sand/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-9 px-4 py-12 text-sm text-soft sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Logo lang={lang} />
          <p className="mt-3 max-w-xs leading-relaxed">{d.footer.tagline}</p>
        </div>
        {[...columns, { title: HELP_TITLE[lang], items: help }].map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink">{col.title}</p>
            <ul className="space-y-2">
              {col.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="hover:text-ink">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-line px-4 py-4 text-xs text-soft">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <Link href="/terms/" className="hover:text-ink">
          {d.footer.terms}
        </Link>
        <Link href="/privacy/" className="hover:text-ink">
          {d.footer.privacy}
        </Link>
        <Link href="/refund-policy/" className="hover:text-ink">
          {REFUND[lang]}
        </Link>
        <Link href="/contact/" className="hover:text-ink">
          {d.footer.contact}
        </Link>
      </div>
    </footer>
  );
}
