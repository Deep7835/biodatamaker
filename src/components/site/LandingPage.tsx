import Link from "next/link";
import { relatedPages, type PageContent } from "@/content";
import { DICTS } from "@/lib/dict";
import { href, HREFLANG, SITE } from "@/lib/i18n";
import { getTemplate, heroImage, templateImage } from "@/lib/templates";
import { topicPath } from "@/content";
import { IconDownload } from "../editor/Icons";
import { ToolRenderer } from "../tools/ToolRenderer";
import { JsonLd } from "./JsonLd";
import { TOOLS_LABEL, ToolsGrid } from "./ToolsGrid";
import { Markdown, tocOf } from "./Markdown";
import { HeroStack, SpringCta } from "./HeroStack";
import { PageExtras } from "./PageExtras";
import { TemplatesGrid } from "./TemplatesGrid";

const SAMPLE = {
  en: { girl: "For girl", boy: "For boy", file: "marriage-biodata-format", title: "Download a free sample format", body: "An editable Word file and a print-ready PDF. Replace the sample details with yours, or make it online in 3 minutes with your photo.", word: "Word format (.docx)", pdf: "PDF format" },
  hi: { girl: "लड़की", boy: "लड़का", file: "hindi-biodata-format", title: "मुफ़्त नमूना फॉर्मेट डाउनलोड करें", body: "एडिट होने वाली Word फ़ाइल और प्रिंट के लिए तैयार PDF। नमूने की जगह अपनी जानकारी लिखें, या फोटो के साथ 3 मिनट में ऑनलाइन बनाएँ।", word: "Word फॉर्मेट (.docx)", pdf: "PDF फॉर्मेट" },
  mr: { girl: "मुलगी", boy: "मुलगा", file: "marathi-biodata-format", title: "मोफत नमुना फॉरमॅट डाउनलोड करा", body: "बदल करता येणारी Word फाईल आणि प्रिंटसाठी तयार PDF. नमुन्याऐवजी तुमची माहिती लिहा, किंवा फोटोसह 3 मिनिटांत ऑनलाईन बनवा.", word: "Word फॉरमॅट (.docx)", pdf: "PDF फॉरमॅट" },
};

/** Delay for the staggered hero entrance (80 ms steps). */
const stagger = (step: number) => ({ "--d": `${Math.round(step * 80)}ms` }) as React.CSSProperties;

const ON_PAGE = { en: "On this page", hi: "इस पेज पर", mr: "या पानावर" };

const UPDATED = { en: "Last updated:", hi: "अंतिम अपडेट:", mr: "शेवटचे अपडेट:" };

const COPY = {
  en: { templates: "Pick from 35 designs", faq: "Frequently asked questions", related: "More biodata formats", badges: ["No login", "No watermark", "PDF · JPG · Word"], see: "See all templates", ready: "Ready to make yours?", readySub: "It takes about three minutes." },
  hi: { templates: "35 डिज़ाइन में से चुनें", faq: "अक्सर पूछे जाने वाले सवाल", related: "और बायोडाटा फॉर्मेट", badges: ["लॉगिन नहीं", "वॉटरमार्क नहीं", "PDF · JPG · Word"], see: "सभी टेम्पलेट देखें", ready: "अपना बायोडाटा बनाएँ", readySub: "सिर्फ़ 3 मिनट लगते हैं।" },
  mr: { templates: "35 डिझाईन्समधून निवडा", faq: "नेहमी विचारले जाणारे प्रश्न", related: "आणखी बायोडाटा फॉरमॅट", badges: ["लॉगिन नाही", "वॉटरमार्क नाही", "PDF · JPG · Word"], see: "सर्व टेम्पलेट्स पहा", ready: "तुमचा बायोडाटा बनवा", readySub: "फक्त 3 मिनिटे लागतात." },
};

export function LandingPage({ page }: { page: PageContent }) {
  const { lang } = page;
  const d = DICTS[lang];
  const c = COPY[lang];
  const create = href(lang, "/create");
  const heroTemplate = getTemplate(page.sample.templateId);
  const toc = tocOf(page.body);
  const backImg = templateImage(lang, getTemplate("peacock-grace"));
  const url = `${SITE.url}${href(lang, page.slug ? `/${page.slug}` : "/")}`;
  const sampleImg = templateImage(lang, getTemplate("kesari-classic"));

  return (
    <main id="main" className="flex-1">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: page.h1,
            url,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any (web browser)",
            inLanguage: lang,
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            url,
            inLanguage: lang,
            dateModified: page.updated,
            description: page.description,
          },
          ...(page.slug
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: SITE.name, item: `${SITE.url}${href(lang, "/")}` },
                    { "@type": "ListItem", position: 2, name: page.h1, item: url },
                  ],
                },
              ]
            : []),
        ]}
      />

      {/* Tool pages: title + the interactive tool first */}
      {page.tool && (
        // overflow-clip (not hidden) so tools can use position: sticky inside.
        <section className="relative overflow-clip">
          <div data-print-hide className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_10%,rgba(184,137,59,0.10),transparent)]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 md:pt-12">
            <nav className="mb-4 text-sm text-soft" aria-label="Breadcrumb">
              <Link href={href(lang, "/")} className="hover:text-ink">
                {d.nav.home}
              </Link>
              <span className="mx-2 text-line">/</span>
              <Link href={topicPath("tools", lang)!} className="hover:text-ink">
                {TOOLS_LABEL[lang]}
              </Link>
              <span className="mx-2 text-line">/</span>
              <span>{page.h1}</span>
            </nav>
            <h1 className="font-display text-[2rem] leading-[1.25] text-ink sm:text-4xl">{page.h1}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-soft">{page.lead}</p>
            <div className="mt-8">
              <ToolRenderer tool={page.tool} lang={lang} />
            </div>
          </div>
        </section>
      )}

      {/* Tools hub: grid of every tool in this language */}
      {page.topic === "tools" && (
        <>
          <section className="mx-auto max-w-7xl px-4 pt-10 md:pt-14">
            <h1 className="font-display text-[2rem] leading-[1.25] text-ink sm:text-4xl">{page.h1}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-soft">{page.lead}</p>
          </section>
          <ToolsGrid lang={lang} />
        </>
      )}

      {/* Hero */}
      {!page.tool && page.topic !== "tools" && (
      <section className="relative overflow-hidden">
        <div data-print-hide className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_20%,rgba(184,137,59,0.12),transparent),radial-gradient(40%_40%_at_10%_90%,rgba(138,28,43,0.06),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:pt-16">
          <div>
            {page.slug && (
              <nav className="hero-rise mb-4 text-sm text-soft" aria-label="Breadcrumb">
                <Link href={href(lang, "/")} className="hover:text-ink">
                  {d.nav.home}
                </Link>
                <span className="mx-2 text-line">/</span>
                <span>{page.h1}</span>
              </nav>
            )}
            <h1 className="hero-rise font-display text-[2rem] leading-[1.25] text-ink sm:text-5xl" style={stagger(1)}>
              {page.h1}
            </h1>
            <p className="hero-rise mt-5 max-w-xl text-lg leading-relaxed text-soft" style={stagger(2)}>
              {page.lead}
            </p>
            <div data-print-hide className="hero-rise mt-8 flex flex-wrap items-center gap-3" style={stagger(3)}>
              <SpringCta href={create} className="block rounded-full bg-maroon px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-maroon/20 transition-colors hover:bg-maroon-dark">
                {d.cta}
              </SpringCta>
              <Link href={href(lang, "/templates")} className="rounded-full border border-line bg-paper px-6 py-3.5 text-base font-medium text-ink hover:border-gold">
                {c.see}
              </Link>
            </div>
            <ul data-print-hide className="hero-rise mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-soft" style={stagger(4)}>
              {c.badges.map((b, i) => (
                <li key={b} className="flex items-center gap-1.5">
                  <svg viewBox="0 0 20 20" className="hero-check size-4 text-leaf" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" style={stagger(6 + i * 1.5)} />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          {/* Pre-rendered hero image (scripts/generate-assets.mjs) + CSS entrance + Motion tilt/parallax. */}
          <HeroStack
            href={`${create}?t=${heroTemplate.id}`}
            front={{ src: heroImage(lang, page.slug), alt: templateImage(lang, heroTemplate).alt, width: 596, height: 842 }}
            back={{ src: backImg.src, srcSet: backImg.srcSet, sizes: "(min-width: 768px) 345px, 72vw", alt: "", width: 596, height: 842 }}
          />
        </div>
      </section>
      )}

      {/* Downloadable sample format (targets "format pdf / word download" searches) */}
      {(page.topic === "format" || page.topic === "samples") && (
        <section className="px-4 pb-4">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 rounded-3xl border border-line bg-paper p-6 sm:flex-row sm:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
            <img {...sampleImg} alt={sampleImg.alt} loading="lazy" className="w-32 shrink-0 rounded shadow ring-1 ring-line" />
            <div>
              <h2 className="font-display text-2xl text-ink">{SAMPLE[lang].title}</h2>
              <p className="mt-2 text-soft">{SAMPLE[lang].body}</p>
              {(["", "-boy"] as const).map((suffix) => (
                <div key={suffix} className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="w-16 text-sm font-medium text-soft">{suffix ? SAMPLE[lang].boy : SAMPLE[lang].girl}</span>
                  <a href={`/samples/${SAMPLE[lang].file}${suffix}.docx`} download className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark">
                    <IconDownload /> {SAMPLE[lang].word}
                  </a>
                  <a href={`/samples/${SAMPLE[lang].file}${suffix}.pdf`} download className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-gold">
                    <IconDownload /> {SAMPLE[lang].pdf}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Templates */}
      {!page.slug && (
        <section className="border-y border-line bg-paper/60 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-ink">{c.templates}</h2>
              <Link href={href(lang, "/templates")} className="shrink-0 text-sm font-medium text-maroon hover:underline">
                {c.see} →
              </Link>
            </div>
            <TemplatesGrid lang={lang} limit={8} filters={false} />
          </div>
        </section>
      )}

      {/* Content: full-width grid, article + sticky sidebar on desktop */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
      <article className="prose-site min-w-0">
        <p className="!mt-0 text-sm">
          {UPDATED[lang]}{" "}
          <time dateTime={page.updated}>{new Intl.DateTimeFormat(HREFLANG[lang], { day: "numeric", month: "long", year: "numeric" }).format(new Date(page.updated))}</time>
        </p>
        <Markdown source={page.body} />

        <h2>{c.faq}</h2>
        <div className="not-prose divide-y divide-line rounded-2xl border border-line bg-paper">
          {page.faqs.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                {f.q}
                <span className="text-gold-ink transition group-open:rotate-45">+</span>
              </summary>
              <p className="!mb-0 !mt-2">{f.a}</p>
            </details>
          ))}
        </div>

        <h2>{c.related}</h2>
        <ul className="!ml-0 grid !list-none gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {relatedPages(lang, page.slug).map((p) => (
            <li key={p.slug}>
              <Link href={href(lang, `/${p.slug}`)} className="block rounded-xl border border-line bg-paper px-4 py-3 text-ink hover:border-gold">
                {p.h1}
              </Link>
            </li>
          ))}
        </ul>
      </article>

      <aside data-print-hide className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          {toc.length > 2 && (
            <nav aria-label={ON_PAGE[lang]} className="rounded-2xl border border-line bg-paper p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-soft">{ON_PAGE[lang]}</p>
              <ol className="space-y-2 text-sm">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="block leading-snug text-ink hover:text-maroon">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="rounded-2xl bg-maroon p-5 text-white">
            <p className="font-display text-xl leading-snug">{c.ready}</p>
            <p className="mt-1 text-sm text-white/80">{c.readySub}</p>
            <Link href={create} className="mt-4 inline-block rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-ivory">
              {d.cta}
            </Link>
          </div>
        </div>
      </aside>
      </div>

      <PageExtras lang={lang} />

      {/* Final CTA */}
      <section data-print-hide className="px-4 pb-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-maroon px-6 py-12 text-center text-white">
          <h2 className="font-display text-3xl">{c.ready}</h2>
          <p className="mt-2 text-white/80">{c.readySub}</p>
          <Link href={create} className="mt-6 inline-block rounded-full bg-paper px-7 py-3 font-semibold text-maroon hover:bg-ivory">
            {d.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
