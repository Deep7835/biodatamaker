import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Editor from "@/components/editor/Editor";
import { LandingPage } from "@/components/site/LandingPage";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { TemplatesGrid } from "@/components/site/TemplatesGrid";
import { getPage, slugsFor, topicPath } from "@/content";
import { LEGAL } from "@/content/legal";
import { Markdown } from "@/components/site/Markdown";
import { topicAlternates } from "@/content";
import { Analytics } from "@/components/site/Analytics";
import { ANALYTICS } from "@/lib/analytics";
import { fontVars } from "@/lib/fonts";
import { HREFLANG, SITE, type Lang } from "@/lib/i18n";
import { getTemplate, templateImage } from "@/lib/templates";

const OG_LOCALE: Record<Lang, string> = { en: "en_IN", hi: "hi_IN", mr: "mr_IN" };

function meta(lang: Lang, title: string, description: string, alternates: Metadata["alternates"], absoluteTitle = false, templateId = "kesari-classic"): Metadata {
  const img = templateImage(lang, getTemplate(templateId));
  const images = [{ url: `${SITE.url}${img.src}`, width: img.width, height: img.height, alt: img.alt }];
  return {
    metadataBase: new URL(SITE.url),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    openGraph: { title, description, url: (alternates?.canonical as string) ?? SITE.url, siteName: SITE.name, locale: OG_LOCALE[lang], type: "website", images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    robots: { index: true, follow: true },
    verification: {
      google: ANALYTICS.googleVerification || undefined,
      other: ANALYTICS.bingVerification ? { "msvalidate.01": ANALYTICS.bingVerification } : undefined,
    },
  };
}

export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={HREFLANG[lang]} className={`${fontVars} h-full`} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout; this rule targets the Pages Router */}
      <head>
        {/* Apply the saved / system theme before first paint (no flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("biodatasathi:theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

/* ---------- Home ---------- */

export function homeMeta(lang: Lang): Metadata {
  const p = getPage(lang, "")!;
  return meta(lang, p.title, p.description, topicAlternates("home", lang, SITE.url), true, p.sample.templateId);
}

export function HomeView({ lang }: { lang: Lang }) {
  return (
    <>
      <SiteHeader lang={lang} />
      <LandingPage page={getPage(lang, "")!} />
      <SiteFooter lang={lang} />
    </>
  );
}

/* ---------- Content pages ---------- */

export const slugParams = (lang: Lang) => slugsFor(lang).map((slug) => ({ slug }));

export function slugMeta(lang: Lang, slug: string): Metadata {
  const p = getPage(lang, slug);
  if (!p) return {};
  return meta(lang, p.title, p.description, topicAlternates(p.topic, lang, SITE.url), true, p.sample.templateId);
}

export function SlugView({ lang, slug }: { lang: Lang; slug: string }) {
  const p = getPage(lang, slug);
  if (!p) notFound();
  return (
    <>
      <SiteHeader lang={lang} />
      <LandingPage page={p} />
      <SiteFooter lang={lang} />
    </>
  );
}

/* ---------- Editor ---------- */

const CREATE = {
  en: { title: "Create Marriage Biodata Online – Free Editor | BiodataSathi", description: "Fill in your details, choose from 35 templates and download your marriage biodata as PDF, JPG or Word. Free, no login, no watermark.", h1: "Create your marriage biodata" },
  hi: { title: "ऑनलाइन शादी का बायोडाटा बनाएं – मुफ़्त एडिटर | BiodataSathi", description: "जानकारी भरें, 35 टेम्पलेट में से चुनें और शादी का बायोडाटा PDF, JPG या Word में डाउनलोड करें। मुफ़्त, बिना लॉगिन।", h1: "अपना शादी का बायोडाटा बनाएँ" },
  mr: { title: "ऑनलाईन मराठी बायोडाटा बनवा – मोफत एडिटर | BiodataSathi", description: "माहिती भरा, 35 टेम्पलेट्समधून निवडा आणि लग्नाचा बायोडाटा PDF, JPG किंवा Word मध्ये डाउनलोड करा. मोफत, लॉगिन नाही.", h1: "तुमचा लग्नाचा बायोडाटा बनवा" },
};

export const createMeta = (lang: Lang) => meta(lang, CREATE[lang].title, CREATE[lang].description, topicAlternates("create", lang, SITE.url), true);

export function CreateView({ lang }: { lang: Lang }) {
  return (
    <>
      <SiteHeader lang={lang} />
      <main id="main" className="flex flex-1 flex-col">
        <h1 className="sr-only">{CREATE[lang].h1}</h1>
        <Editor lang={lang} />
      </main>
    </>
  );
}

/* ---------- Templates ---------- */

const TPL = {
  en: { title: "Marriage Biodata Templates – 35 Free Designs (PDF, Word)", description: "Browse 35 marriage biodata templates: traditional, modern, simple and royal designs with photo frames. Pick one and edit online for free.", h1: "Marriage Biodata Templates", lead: "Traditional, modern and minimal designs. Every template works in English, Hindi and Marathi. Click one to start editing." },
  hi: { title: "शादी के बायोडाटा टेम्पलेट – 35 मुफ़्त डिज़ाइन (PDF, Word)", description: "35 सुंदर शादी के बायोडाटा टेम्पलेट: पारंपरिक, मॉडर्न और सिंपल डिज़ाइन, फोटो फ्रेम के साथ। कोई भी चुनें और मुफ़्त एडिट करें।", h1: "शादी के बायोडाटा टेम्पलेट", lead: "पारंपरिक, मॉडर्न और सिंपल डिज़ाइन। हर टेम्पलेट हिंदी, मराठी और अंग्रेज़ी में काम करता है। किसी पर क्लिक करके शुरू करें।" },
  mr: { title: "मराठी बायोडाटा टेम्पलेट्स – 35 मोफत डिझाईन्स (PDF, Word)", description: "35 सुंदर मराठी लग्नाचा बायोडाटा टेम्पलेट्स: पारंपरिक, मॉडर्न आणि साधे डिझाईन्स, फोटो फ्रेमसह. कोणतेही निवडा आणि मोफत बदला.", h1: "मराठी बायोडाटा टेम्पलेट्स", lead: "पारंपरिक, मॉडर्न आणि साधे डिझाईन्स. प्रत्येक टेम्पलेट मराठी, हिंदी आणि इंग्रजीत चालतो. कोणत्याही डिझाईनवर क्लिक करून सुरू करा." },
};

export const templatesMeta = (lang: Lang) => meta(lang, TPL[lang].title, TPL[lang].description, topicAlternates("templates", lang, SITE.url), true);

export function TemplatesView({ lang }: { lang: Lang }) {
  return (
    <>
      <SiteHeader lang={lang} />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <h1 className="font-display text-4xl text-ink">{TPL[lang].h1}</h1>
        <p className="mb-8 mt-3 max-w-2xl text-lg text-soft">{TPL[lang].lead}</p>
        <TemplatesGrid lang={lang} />
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}

export { topicPath };

/* ---------- Policy pages (English only; required for Razorpay activation) ---------- */

export function legalMeta(slug: string): Metadata {
  const doc = LEGAL.find((d) => d.slug === slug)!;
  return meta("en", `${doc.title} | ${SITE.name}`, doc.description, { canonical: `${SITE.url}/${slug}/` }, true);
}

export function LegalView({ slug }: { slug: string }) {
  const doc = LEGAL.find((d) => d.slug === slug)!;
  return (
    <>
      <SiteHeader lang="en" />
      <main id="main" className="prose-site mx-auto w-full max-w-7xl flex-1 px-4 py-12">
        <h1 className="font-display text-4xl text-ink">{doc.title}</h1>
        <Markdown source={doc.body} />
      </main>
      <SiteFooter lang="en" />
    </>
  );
}
