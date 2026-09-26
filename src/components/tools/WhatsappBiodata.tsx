"use client";

import { IconChat } from "../editor/Icons";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createBiodata, type Biodata } from "@/lib/biodata";
import { href, LANG_NATIVE, LANGS, type Lang } from "@/lib/i18n";
import { copyText } from "@/lib/tools/clipboard";
import { formatWhatsapp, hasContent, WA_SOFT_LIMIT, waShareUrl, type WaStyle } from "@/lib/tools/whatsapp";

const T = {
  en: {
    loading: "Looking for your saved biodata…",
    emptyTitle: "No biodata saved on this device yet",
    emptyText: "This tool turns the biodata you make in our editor into neat WhatsApp text. Fill in your details there first (it saves automatically in this browser), or try it with a sample.",
    create: "Create my biodata",
    sample: "Try with a sample",
    useOther: (l: string) => `Use my ${l} biodata`,
    fromDraft: "Using the biodata saved in this browser.",
    fromSample: "This is sample data. Make your own biodata to get your real text.",
    fromOther: (l: string) => `Using your ${l} biodata.`,
    edit: "Edit details",
    style: "Style",
    minimal: "Simple",
    decorative: "Decorative",
    digits: "Devanagari digits (१२३)",
    preview: "WhatsApp text (you can edit it here)",
    chars: (n: number) => `${n.toLocaleString("en-IN")} characters`,
    long: "This message is long. The WhatsApp button may cut it on some phones, so use Copy and paste it into the chat instead.",
    copy: "Copy text",
    copied: "Copied. Paste it into any WhatsApp chat.",
    copyFail: "Couldn't copy automatically. Select the text and copy it by hand.",
    share: "Share on WhatsApp",
    reset: "Undo my edits",
    notes: [
      "The photo and kundali chart can't go in a text message. Send the biodata image or PDF along with it.",
      "Mobile numbers and email always keep English digits so they stay tappable in WhatsApp.",
      "*Stars* around a word make it bold in WhatsApp.",
    ],
  },
  hi: {
    loading: "आपका सेव किया हुआ बायोडाटा ढूँढ रहे हैं…",
    emptyTitle: "इस फ़ोन/ब्राउज़र में अभी कोई बायोडाटा सेव नहीं है",
    emptyText: "यह टूल हमारे एडिटर में बने बायोडाटा को साफ़-सुथरे WhatsApp मैसेज में बदलता है। पहले एडिटर में अपनी जानकारी भरें (वह इसी ब्राउज़र में अपने-आप सेव होती है), या सैंपल से आज़माकर देखें।",
    create: "मेरा बायोडाटा बनाएँ",
    sample: "सैंपल से आज़माएँ",
    useOther: (l: string) => `मेरा ${l} बायोडाटा लें`,
    fromDraft: "इस ब्राउज़र में सेव आपका बायोडाटा लिया गया है।",
    fromSample: "यह सैंपल जानकारी है। अपना असली टेक्स्ट पाने के लिए अपना बायोडाटा बनाएँ।",
    fromOther: (l: string) => `आपका ${l} बायोडाटा लिया गया है।`,
    edit: "जानकारी बदलें",
    style: "स्टाइल",
    minimal: "सादा",
    decorative: "सजावटी",
    digits: "देवनागरी अंक (१२३)",
    preview: "WhatsApp टेक्स्ट (यहीं बदल भी सकते हैं)",
    chars: (n: number) => `${n.toLocaleString("en-IN")} अक्षर`,
    long: "मैसेज काफ़ी लंबा है। कुछ फ़ोन में WhatsApp बटन से पूरा टेक्स्ट नहीं जाता, इसलिए कॉपी करके चैट में पेस्ट करें।",
    copy: "टेक्स्ट कॉपी करें",
    copied: "कॉपी हो गया। अब किसी भी WhatsApp चैट में पेस्ट करें।",
    copyFail: "अपने-आप कॉपी नहीं हो पाया। टेक्स्ट चुनकर खुद कॉपी करें।",
    share: "WhatsApp पर भेजें",
    reset: "मेरे बदलाव हटाएँ",
    notes: [
      "फ़ोटो और कुंडली चार्ट टेक्स्ट मैसेज में नहीं जा सकते। बायोडाटा की फ़ोटो या PDF साथ में भेजें।",
      "मोबाइल नंबर और ईमेल हमेशा अंग्रेज़ी अंकों में रहते हैं, ताकि WhatsApp में उन पर टैप किया जा सके।",
      "किसी शब्द के दोनों ओर *स्टार* लगाने से WhatsApp में वह बोल्ड दिखता है।",
    ],
  },
  mr: {
    loading: "तुमचा सेव्ह केलेला बायोडाटा शोधत आहोत…",
    emptyTitle: "या फोन/ब्राउझरमध्ये अजून बायोडाटा सेव्ह केलेला नाही",
    emptyText: "हे साधन आमच्या एडिटरमध्ये बनवलेला बायोडाटा नीटनेटक्या WhatsApp मेसेजमध्ये बदलते. आधी एडिटरमध्ये माहिती भरा (ती याच ब्राउझरमध्ये आपोआप सेव्ह होते), किंवा नमुना वापरून पाहा.",
    create: "माझा बायोडाटा बनवा",
    sample: "नमुना वापरून पाहा",
    useOther: (l: string) => `माझा ${l} बायोडाटा वापरा`,
    fromDraft: "या ब्राउझरमध्ये सेव्ह असलेला तुमचा बायोडाटा घेतला आहे.",
    fromSample: "ही नमुना माहिती आहे. तुमचा खरा मजकूर मिळवण्यासाठी स्वतःचा बायोडाटा बनवा.",
    fromOther: (l: string) => `तुमचा ${l} बायोडाटा घेतला आहे.`,
    edit: "माहिती बदला",
    style: "शैली",
    minimal: "साधी",
    decorative: "सजावटीची",
    digits: "मराठी अंक (१२३)",
    preview: "WhatsApp मजकूर (इथेच बदलू शकता)",
    chars: (n: number) => `${n.toLocaleString("en-IN")} अक्षरे`,
    long: "मेसेज बराच मोठा आहे. काही फोनमध्ये WhatsApp बटणाने पूर्ण मजकूर जात नाही, म्हणून कॉपी करून चॅटमध्ये पेस्ट करा.",
    copy: "मजकूर कॉपी करा",
    copied: "कॉपी झाले. आता कोणत्याही WhatsApp चॅटमध्ये पेस्ट करा.",
    copyFail: "आपोआप कॉपी झाले नाही. मजकूर निवडून स्वतः कॉपी करा.",
    share: "WhatsApp वर पाठवा",
    reset: "माझे बदल काढा",
    notes: [
      "फोटो आणि कुंडली चार्ट मजकुरात जाऊ शकत नाहीत. बायोडाटाचा फोटो किंवा PDF सोबत पाठवा.",
      "मोबाईल नंबर आणि ईमेल नेहमी इंग्रजी अंकांतच राहतात, म्हणजे WhatsApp मध्ये त्यावर टॅप करता येते.",
      "एखाद्या शब्दाभोवती *स्टार* लावल्यास WhatsApp मध्ये तो ठळक दिसतो.",
    ],
  },
};

type Source = { kind: "draft" } | { kind: "sample" } | { kind: "other"; lang: Lang };

function loadDraft(lang: Lang): Biodata | null {
  try {
    const raw = localStorage.getItem(`biodatasathi:draft:${lang}`);
    const b = raw ? (JSON.parse(raw) as Biodata) : null;
    return b?.version === 1 && hasContent(b) ? b : null;
  } catch {
    return null;
  }
}

export default function WhatsappBiodata({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [ready, setReady] = useState(false);
  const [bio, setBio] = useState<Biodata | null>(null);
  const [source, setSource] = useState<Source>({ kind: "draft" });
  const [other, setOther] = useState<Lang | null>(null);
  const [style, setStyle] = useState<WaStyle>("minimal");
  const [digits, setDigits] = useState(false);
  const [edited, setEdited] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const own = loadDraft(lang);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read localStorage after mount
    setBio(own);
    if (own) setDigits(!!own.devanagariDigits && lang !== "en");
    else setOther(LANGS.find((l) => l !== lang && loadDraft(l)) ?? null);
    setReady(true);
  }, [lang]);

  const generated = useMemo(() => (bio ? formatWhatsapp(bio, { style, devanagariDigits: digits }) : ""), [bio, style, digits]);
  const text = edited ?? generated;
  const tooLong = text.length > WA_SOFT_LIMIT;

  function choose(next: Biodata, src: Source) {
    setBio(next);
    setSource(src);
    setDigits(!!next.devanagariDigits && lang !== "en");
    setEdited(null);
    setStatus("");
  }

  async function onCopy() {
    setStatus((await copyText(text)) ? t.copied : t.copyFail);
  }

  if (!ready) {
    return <div className="rounded-2xl border border-line bg-paper p-6 text-center text-soft">{t.loading}</div>;
  }

  if (!bio) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5 text-center sm:p-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sand text-maroon" aria-hidden>
          <IconChat className="size-6" />
        </div>
        <h2 className="font-display text-xl text-ink">{t.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-xl text-soft">{t.emptyText}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href={href(lang, "/create")} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark">
            {t.create}
          </Link>
          <button
            type="button"
            onClick={() => choose(createBiodata(lang, { sample: true }), { kind: "sample" })}
            className="rounded-full border border-line bg-ivory px-5 py-2.5 text-sm font-semibold text-ink hover:border-gold"
          >
            {t.sample}
          </button>
          {other && (
            <button
              type="button"
              onClick={() => {
                const b = loadDraft(other);
                if (b) choose(b, { kind: "other", lang: other });
              }}
              className="rounded-full border border-line bg-ivory px-5 py-2.5 text-sm font-semibold text-ink hover:border-gold"
            >
              {t.useOther(LANG_NATIVE[other])}
            </button>
          )}
        </div>
      </div>
    );
  }

  const sourceText = source.kind === "sample" ? t.fromSample : source.kind === "other" ? t.fromOther(LANG_NATIVE[source.lang]) : t.fromDraft;
  const editorLang = source.kind === "other" ? source.lang : lang;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
      <div className="min-w-0 rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <div className={`mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-3 py-2 text-sm ${source.kind === "sample" ? "bg-sand text-ink" : "bg-ivory text-soft"}`}>
          <span className="min-w-0 flex-1">{sourceText}</span>
          <Link href={href(editorLang, "/create")} className="font-semibold text-maroon underline decoration-gold/50 underline-offset-2">
            {source.kind === "sample" ? t.create : t.edit}
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">{t.style}</legend>
            <span className="text-sm text-soft" aria-hidden>
              {t.style}:
            </span>
            <div className="inline-flex rounded-full border border-line bg-ivory p-0.5">
              {(["minimal", "decorative"] as WaStyle[]).map((s) => (
                <label key={s} className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${style === s ? "bg-maroon text-white" : "text-ink hover:text-maroon"}`}>
                  <input
                    type="radio"
                    name="wa-style"
                    value={s}
                    checked={style === s}
                    onChange={() => {
                      setStyle(s);
                      setEdited(null);
                    }}
                    className="sr-only"
                  />
                  {s === "minimal" ? t.minimal : t.decorative}
                </label>
              ))}
            </div>
          </fieldset>
          {lang !== "en" && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={digits}
                onChange={(e) => {
                  setDigits(e.target.checked);
                  setEdited(null);
                }}
                className="h-4 w-4 accent-[var(--color-maroon)]"
              />
              {t.digits}
            </label>
          )}
        </div>

        <label htmlFor="wa-text" className="mb-1.5 block text-sm font-semibold text-ink">
          {t.preview}
        </label>
        <textarea
          id="wa-text"
          value={text}
          onChange={(e) => setEdited(e.target.value)}
          rows={16}
          spellCheck={false}
          className="block w-full resize-y rounded-xl border border-line bg-ivory/60 px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none focus:border-gold focus:bg-paper"
        />
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-soft">
          <span>{t.chars(text.length)}</span>
          {edited !== null && (
            <button type="button" onClick={() => setEdited(null)} className="font-semibold text-maroon hover:underline">
              {t.reset}
            </button>
          )}
        </div>
        {tooLong && (
          <p role="alert" className="mt-3 rounded-xl border border-gold/50 bg-sand px-3 py-2 text-sm text-ink">
            {t.long}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={onCopy} disabled={!text.trim()} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark disabled:opacity-50">
            {t.copy}
          </button>
          <a
            href={waShareUrl(text)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            {t.share}
          </a>
        </div>
        <p aria-live="polite" className="mt-2 min-h-5 text-sm text-leaf">
          {status}
        </p>
      </div>

      <aside className="rounded-2xl border border-line bg-paper p-4 text-sm leading-relaxed text-soft sm:p-5">
        <ul className="space-y-2.5">
          {t.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="text-gold-ink" aria-hidden>
                ◆
              </span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
