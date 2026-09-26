"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  createBiodata,
  FIELDS,
  INVOCATIONS,
  RELIGION_PRESETS,
  RELIGIONS,
  restoreStandardLines,
  SECTION_TITLES,
  TITLES,
  type Biodata,
  type Religion,
  type SymbolId,
} from "@/lib/biodata";
import { DICTS } from "@/lib/dict";
import { exportDocx, exportJpg, exportPdf, resizePhoto, shareImage } from "@/lib/export";
import { LANG_NATIVE, LANGS, SITE, type Lang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { isPremiumUnlocked } from "@/lib/premium";
import { useConfirm } from "../ui/useConfirm";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { ScaledDoc } from "../biodata/ScaledDoc";
import { DetailsPanel } from "./DetailsPanel";
import { IconCrown, IconDoc, IconDownload, IconImage, IconShare } from "./Icons";
import { PremiumDialog } from "./PremiumDialog";
import { TemplatePicker } from "./TemplatePicker";

const STORAGE = (lang: Lang) => `biodatasathi:draft:${lang}`;
const SYMBOLS: SymbolId[] = ["ganesh", "om", "swastik", "kalash", "lotus", "jain", "chakra", "crescent", "cross", "khanda", "none"];
const ACCENTS = ["", "#7F1D2D", "#C0561B", "#B23A5B", "#0E6B6B", "#23408E", "#1F6B3A", "#6A4C9C", "#B7791F", "#2B2B2B"];

type Tab = "details" | "design" | "preview";
type Job = "pdf" | "jpg" | "docx" | "share";

function isEmpty(b: Biodata) {
  return !b.photo && b.sections.every((s) => s.rows.every((r) => !r.value.trim()));
}

function load(lang: Lang): Biodata | null {
  try {
    const raw = localStorage.getItem(STORAGE(lang));
    const b = raw ? (JSON.parse(raw) as Biodata) : null;
    return b?.version === 1 ? b : null;
  } catch {
    return null;
  }
}

/** Re-labels untouched default labels and titles into another language. */
function relabel(b: Biodata, to: Lang): Biodata {
  const from = b.lang;
  const map = (list: Record<Lang, string[]>, v: string) => {
    // Only the first entry (Ganesh vandana / "Biodata") is equivalent across languages.
    return list[from].indexOf(v) === 0 ? list[to][0] : v;
  };
  return {
    ...b,
    lang: to,
    invocation: map(INVOCATIONS, b.invocation),
    title: map(TITLES, b.title),
    sections: b.sections.map((s) => ({
      ...s,
      title: SECTION_TITLES[s.id] && s.title === SECTION_TITLES[s.id][from] ? SECTION_TITLES[s.id][to] : s.title,
      rows: s.rows.map((r) => {
        const f = FIELDS[r.id.split("-").slice(1).join("-")];
        return f && r.label === f.label[from] ? { ...r, label: f.label[to] } : r;
      }),
    })),
  };
}

export default function Editor({ lang }: { lang: Lang }) {
  const t = DICTS[lang].editor;
  const d = DICTS[lang];
  const [bio, setBio] = useState<Biodata>(() => createBiodata(lang));
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("details");
  const [busy, setBusy] = useState<Job | null>(null);
  const [premiumAsk, setPremiumAsk] = useState<Job | null>(null);
  const [premium, setPremium] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const { confirm: confirmDlg, dialog } = useConfirm(lang);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [credit, setCredit] = useState<string | undefined>();
  const [exporting, setExporting] = useState(false);
  const [translit, setTranslit] = useState(lang !== "en");
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = load(lang);
    const tpl = new URLSearchParams(window.location.search).get("t");
    // Lines deleted in an earlier session come back (empty) so nothing standard is lost for good.
    const next = saved ? restoreStandardLines(saved) : createBiodata(lang);
    if (tpl && TEMPLATES.some((x) => x.id === tpl)) next.templateId = tpl;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    setBio(next);
    setPremium(isPremiumUnlocked());
    // Instagram / Facebook / Snapchat / LINE webviews usually block file downloads.
    setInAppBrowser(/FBAN|FBAV|FB_IAB|Instagram|Snapchat|Line\//i.test(navigator.userAgent));
    setReady(true);
  }, [lang]);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE(lang), JSON.stringify(bio));
      } catch {
        /* storage full or blocked: the editor keeps working in memory */
      }
    }, 300);
    return () => clearTimeout(id);
  }, [bio, lang, ready]);

  const update = useCallback((fn: (b: Biodata) => Biodata) => setBio((b) => fn(structuredClone(b))), []);

  const empty = isEmpty(bio);
  const hasBlanks = useMemo(() => bio.sections.some((s) => !s.hidden && s.rows.some((r) => !r.value.trim())), [bio]);

  const template = getTemplate(bio.templateId);
  const accent = bio.accent || template.palette.accent;

  // Ctrl/Cmd+P prints only the biodata (print CSS); drop faded samples and the photo placeholder while printing.
  useEffect(() => {
    const before = () => flushSync(() => setExporting(true));
    const after = () => setExporting(false);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  useEffect(() => {
    if (!toast && !error) return;
    const id = setTimeout(() => {
      setToast("");
      setError("");
    }, 5000);
    return () => clearTimeout(id);
  }, [toast, error]);

  async function run(job: Job, opts: { credit?: boolean; unlocked?: boolean } = {}) {
    const withCredit = !!opts.credit;
    if (template.premium && !premium && !opts.unlocked && !withCredit) {
      setPremiumAsk(job);
      return;
    }
    // Commit the credit line synchronously so the capture below includes it (rAF would stall in background tabs).
    // Faded sample text and the placeholder photo are editing aids only; drop them for the capture.
    flushSync(() => {
      setBusy(job);
      setExporting(true);
      setCredit(withCredit ? `Made with ${SITE.url.replace("https://", "")}` : undefined);
    });
    try {
      const node = docRef.current;
      if (!node) return;
      if (job === "pdf") await exportPdf(node, bio);
      if (job === "jpg") await exportJpg(node, bio);
      if (job === "share") await shareImage(node, bio);
      if (job === "docx") await exportDocx(bio, accent, node);
      track(job, bio.templateId);
    } catch (e) {
      console.error(e);
      setError(t.downloadFailed);
    } finally {
      setBusy(null);
      setExporting(false);
      setCredit(undefined);
    }
  }

  async function applyReligion(r: Religion) {
    const custom = bio.sections.some((s) => !["personal", "horoscope", "family", "contact", "community"].includes(s.id) || s.rows.some((row) => row.id.includes("-custom")));
    if (custom && !(await confirmDlg(t.presetConfirm))) return;
    update((b) => {
      const fresh = createBiodata(b.lang, { religion: r, templateId: b.templateId });
      const old = new Map(b.sections.flatMap((s) => s.rows).map((row) => [row.id.split("-").slice(1).join("-"), row.value]));
      fresh.sections.forEach((s) => s.rows.forEach((row) => (row.value = old.get(row.id.split("-").slice(1).join("-")) ?? "")));
      return { ...fresh, photo: b.photo, accent: b.accent, devanagariDigits: b.devanagariDigits, symbolImage: b.symbolImage, symbolSize: b.symbolSize, kundali: b.kundali };
    });
  }

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => run("pdf")}
        disabled={!!busy || empty}
        className="inline-flex items-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-dark disabled:opacity-50 sm:px-5"
      >
        <IconDownload /> {busy === "pdf" ? t.working : t.downloadPdf}
      </button>
      <button
        onClick={() => run("jpg")}
        disabled={!!busy || empty}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2.5 text-sm font-medium hover:border-gold disabled:opacity-50 sm:px-4"
      >
        <IconImage /> {busy === "jpg" ? t.working : "JPG"}
      </button>
      <button
        onClick={() => run("share")}
        disabled={!!busy || empty}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2.5 text-sm font-medium text-leaf hover:border-leaf disabled:opacity-50 sm:px-4"
        title={t.share}
      >
        <IconShare /> <span className="hidden sm:inline">WhatsApp</span>
      </button>
      <button
        onClick={() => run("docx")}
        disabled={!!busy || empty}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2.5 text-sm font-medium hover:border-gold disabled:opacity-50 sm:px-4"
        title={t.downloadWord}
      >
        <IconDoc /> <span className="hidden sm:inline">{busy === "docx" ? t.working : "Word"}</span>
      </button>
      {premium && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-ink" title={t.unlocked}>
          <IconCrown /> <span className="hidden sm:inline">{t.unlocked}</span>
        </span>
      )}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-28 pt-4 lg:flex-row lg:flex-wrap lg:pb-10">
      {inAppBrowser && (
        <div role="alert" className="flex w-full basis-full flex-col gap-2 rounded-2xl border border-gold/50 bg-gold/10 p-4 text-sm text-ink sm:flex-row sm:items-center">
          <span className="flex-1">{t.inApp}</span>
          <button
            onClick={async () => {
              await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
              setToast(t.copied);
            }}
            className="shrink-0 rounded-full bg-maroon px-4 py-2 text-xs font-semibold text-white"
          >
            {t.copyLink}
          </button>
        </div>
      )}

      {/* Left: form */}
      <section data-clarity-mask="true" data-print-hide className={`min-w-0 lg:block lg:w-[46%] ${tab === "preview" ? "hidden" : ""}`}>
        <div className="mb-4 flex items-center gap-1 rounded-full border border-line bg-paper p-1 text-sm">
          {(["details", "design"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 rounded-full px-4 py-2 font-medium transition ${tab === k || (tab === "preview" && k === "details") ? "bg-maroon text-white" : "text-soft hover:text-ink"}`}
            >
              {k === "details" ? t.form : t.design}
            </button>
          ))}
        </div>

        {tab !== "design" ? (
          <DetailsPanel bio={bio} update={update} lang={lang} translit={translit && bio.lang !== "en"} />
        ) : (
          <div className="space-y-5">
            <Card title={t.template}>
              <TemplatePicker lang={bio.lang} value={bio.templateId} onChange={(id) => update((b) => ({ ...b, templateId: id, accent: undefined }))} premiumLabel={t.premium} />
            </Card>

            <Card title={t.accent}>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c || "default"}
                    onClick={() => update((b) => ({ ...b, accent: c || undefined }))}
                    aria-label={c || "Template default"}
                    className={`size-8 rounded-full border-2 ${(bio.accent ?? "") === c ? "border-ink" : "border-white shadow"}`}
                    style={{ background: c || `conic-gradient(${template.palette.accent} 0 50%, ${template.palette.accent2} 0)` }}
                  />
                ))}
              </div>
            </Card>

            <Card title={t.header}>
              <label className="mb-1 block text-xs font-medium text-soft">{t.symbol}</label>
              <SymbolUpload bio={bio} update={update} lang={lang} />
              <div className="mb-4 flex flex-wrap gap-1.5">
                {bio.symbolImage && (
                  <button
                    onClick={() => update((b) => ({ ...b, symbol: "custom" }))}
                    className={`inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-3 text-sm ${bio.symbol === "custom" ? "border-maroon bg-maroon/5 text-maroon" : "border-line text-soft hover:border-gold"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bio.symbolImage} alt="" className="size-6 rounded-full bg-ivory object-contain" />
                    {d.symbols.custom}
                  </button>
                )}
                {SYMBOLS.map((s) => (
                  <button
                    key={s}
                    onClick={() => update((b) => ({ ...b, symbol: s }))}
                    className={`rounded-full border px-3 py-1 text-sm ${bio.symbol === s ? "border-maroon bg-maroon/5 text-maroon" : "border-line text-soft hover:border-gold"}`}
                  >
                    {d.symbols[s]}
                  </button>
                ))}
              </div>
              <label className="mb-1 block text-xs font-medium text-soft" htmlFor="inv">
                {t.invocation}
              </label>
              <input
                id="inv"
                list="inv-list"
                value={bio.invocation}
                onChange={(e) => update((b) => ({ ...b, invocation: e.target.value }))}
                className="mb-4 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-gold"
              />
              <datalist id="inv-list">
                {INVOCATIONS[bio.lang].map((x) => (
                  <option key={x} value={x} />
                ))}
              </datalist>
              <label className="mb-1 block text-xs font-medium text-soft" htmlFor="ttl">
                {t.title}
              </label>
              <input
                id="ttl"
                list="ttl-list"
                value={bio.title}
                onChange={(e) => update((b) => ({ ...b, title: e.target.value }))}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-gold"
              />
              <datalist id="ttl-list">
                {TITLES[bio.lang].map((x) => (
                  <option key={x} value={x} />
                ))}
              </datalist>
            </Card>

            <Card title={t.religion}>
              <div className="flex flex-wrap gap-1.5">
                {RELIGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => applyReligion(r)}
                    className={`rounded-full border px-3 py-1 text-sm ${bio.invocation === RELIGION_PRESETS[r].invocation[bio.lang] ? "border-maroon bg-maroon/5 text-maroon" : "border-line text-soft hover:border-gold"}`}
                  >
                    {d.religions[r]}
                  </button>
                ))}
              </div>
            </Card>

            <Card title={t.biodataLanguage}>
              <div className="flex gap-1.5">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => update((b) => relabel(b, l))}
                    className={`rounded-full border px-4 py-1.5 text-sm ${bio.lang === l ? "border-maroon bg-maroon/5 text-maroon" : "border-line text-soft hover:border-gold"}`}
                  >
                    {LANG_NATIVE[l]}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <Toggle checked={bio.devanagariDigits} onChange={(v) => update((b) => ({ ...b, devanagariDigits: v }))} label={t.devanagariDigits} />
                {bio.lang !== "en" && <Toggle checked={translit} onChange={setTranslit} label={t.transliterate} />}
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* Right: preview */}
      <section data-print-show className={`min-w-0 flex-1 lg:block ${tab === "preview" ? "" : "hidden"}`}>
        <div className="lg:sticky lg:top-20">
          <div data-print-hide className="mb-3 hidden items-center justify-between gap-3 lg:flex">{actions}</div>
          <div className="print-doc relative mx-auto max-w-[620px] rounded-sm shadow-[0_10px_40px_-12px_rgba(60,30,20,0.25)] ring-1 ring-line">
            <ScaledDoc ref={docRef} data={bio} ghost={!exporting} placeholderPhoto={!exporting && !bio.photo} credit={credit} />
          </div>
          {hasBlanks && (
            <p data-print-hide className="mx-auto mt-3 flex max-w-[620px] items-center justify-center gap-2 text-center text-xs text-soft">
              <span className="inline-block h-2 w-6 rounded-full bg-soft/30" />
              {lang === "mr"
                ? "फिकट अक्षरे फक्त नमुना आहेत — डाउनलोडमध्ये येणार नाहीत"
                : lang === "hi"
                  ? "हल्के अक्षर सिर्फ़ नमूना हैं — डाउनलोड में नहीं आएँगे"
                  : "Faded text is only a sample — it won't appear in your download"}
            </p>
          )}
          <p data-print-hide className="mx-auto mt-1.5 max-w-[620px] text-center text-xs text-soft">{t.privacy}</p>
        </div>
      </section>

      {/* Mobile bottom bar */}
      <div data-print-hide className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-3 py-2 backdrop-blur lg:hidden">
        <div className="mb-2 flex gap-1 text-sm">
          {(["details", "design", "preview"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full py-1.5 ${tab === k ? "bg-maroon text-white" : "text-soft"}`}>
              {k === "details" ? t.form : k === "design" ? t.design : t.preview}
            </button>
          ))}
        </div>
        <div className="flex justify-center">{actions}</div>
      </div>

      {premiumAsk && (
        <PremiumDialog
          lang={lang}
          onClose={() => setPremiumAsk(null)}
          onCredit={() => {
            const job = premiumAsk;
            setPremiumAsk(null);
            run(job, { credit: true });
          }}
          onUnlocked={() => {
            const job = premiumAsk;
            setPremiumAsk(null);
            setPremium(true);
            setToast(t.thanks);
            run(job, { unlocked: true });
          }}
        />
      )}

      {dialog}
      {error && (
        <div role="alert" className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-maroon px-5 py-2.5 text-sm font-medium text-white shadow-lg lg:bottom-8">
          {error}
        </div>
      )}
      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-white shadow-lg lg:bottom-8">
          {toast}
        </div>
      )}
    </div>
  );
}

/** Upload a deity photo or family logo for the header, plus a size control for any symbol. */
function SymbolUpload({ bio, update, lang }: { bio: Biodata; update: (fn: (b: Biodata) => Biodata) => void; lang: Lang }) {
  const t = DICTS[lang].editor;
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setLoading(true);
    try {
      const src = await resizePhoto(f, 360, true);
      update((b) => ({ ...b, symbol: "custom", symbolImage: src, symbolSize: b.symbolSize ?? 72 }));
    } finally {
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  }

  const custom = bio.symbol === "custom" && bio.symbolImage;
  return (
    <div className="mb-4 rounded-xl border border-dashed border-gold/60 bg-ivory/60 p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-paper text-gold-ink"
          aria-label={t.uploadSymbol}
        >
          {custom ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bio.symbolImage} alt="" className="h-full w-full object-contain" />
          ) : loading ? (
            "…"
          ) : (
            <IconImage className="size-6" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={() => input.current?.click()} className="text-sm font-semibold text-maroon hover:underline">
            {custom ? t.changeSymbol : t.uploadSymbol}
          </button>
          <p className="mt-0.5 text-xs leading-snug text-soft">{t.symbolHint}</p>
        </div>
        {bio.symbolImage && (
          <button
            type="button"
            onClick={() => update((b) => ({ ...b, symbolImage: undefined, symbol: b.symbol === "custom" ? "ganesh" : b.symbol }))}
            className="shrink-0 text-xs text-soft hover:text-maroon"
          >
            {t.removePhoto}
          </button>
        )}
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {bio.symbol !== "none" && (
        <label className="mt-3 block text-xs text-soft">
          {t.symbolSize}
          <input
            type="range"
            min={28}
            max={130}
            step={2}
            value={bio.symbolSize ?? (bio.symbol === "custom" ? 72 : 48)}
            onChange={(e) => update((b) => ({ ...b, symbolSize: Number(e.target.value) }))}
            className="mt-1 w-full accent-maroon"
          />
        </label>
      )}
    </div>
  );
}

function track(job: Job, template: string) {
  trackEvent("biodata_download", { format: job, template });
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-soft">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-maroon" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
