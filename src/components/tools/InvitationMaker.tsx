"use client";

import { useConfirm } from "../ui/useConfirm";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { topicPath } from "@/content/slugs";
import { INVOCATIONS, type Photo, type SymbolId } from "@/lib/biodata";
import { DICTS } from "@/lib/dict";
import { resizePhoto } from "@/lib/export";
import { href, LANG_NATIVE, LANGS, type Lang } from "@/lib/i18n";
import {
  blankInvitation,
  DESIGNS,
  EVENT_NAMES,
  eventId,
  exportInviteJpg,
  exportInvitePdf,
  HOST_TITLES,
  JOINERS,
  loadInvitation,
  OPENINGS,
  sampleInvitation,
  saveInvitation,
  shareInvite,
  TITLES,
  type Invitation,
} from "@/lib/tools/invitation";
import { applyCached, pendingWords, transliterateWord } from "@/lib/transliterate";
import { DesignThumb, ScaledCard } from "../invitation/InvitationCard";
import { IconDown, IconDownload, IconImage, IconPlus, IconShare, IconUp, IconX } from "../editor/Icons";

const T = {
  en: {
    details: "Details",
    design: "Design",
    preview: "Preview",
    couple: "Bride & groom",
    groom: "Groom's name",
    groomParents: "Groom's parents / family line",
    bride: "Bride's name",
    brideParents: "Bride's parents / family line",
    joiner: "Between the names",
    brideFirst: "Print the bride's name first",
    photo: "Couple photo (optional)",
    uploadPhoto: "Add photo",
    changePhoto: "Change",
    removePhoto: "Remove",
    zoom: "Zoom",
    posX: "Left–right",
    posY: "Up–down",
    wording: "Heading & message",
    title: "Heading",
    opening: "Opening line",
    intro: "Invitation message",
    events: "Muhurat & ceremonies",
    muhurat: "Main muhurat line",
    muhuratHint: "Please confirm the exact muhurat with your family purohit before printing.",
    muhuratLink: "See vivah muhurat dates",
    eventName: "Ceremony",
    date: "Day / date",
    time: "Time",
    place: "Place",
    addEvent: "Add ceremony",
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",
    event: "Ceremony",
    venue: "Venue",
    venueTitle: "Heading",
    venueAddr: "Venue name and address",
    hosts: "Hosts & contact",
    hostsTitle: "First list heading",
    wishersTitle: "Second list heading",
    names: "Names (one per line)",
    contact: "Contact / RSVP line",
    closing: "Closing line",
    designs: "Card design",
    header: "God image & invocation",
    symbol: "Symbol",
    uploadSymbol: "Upload god photo / family logo",
    changeSymbol: "Change image",
    symbolHint: "A PNG with a transparent background looks best.",
    symbolSize: "Symbol size",
    invocation: "Invocation line",
    cardLang: "Card language & text",
    switchLang: "Replace the text with sample wording in {lang}? Your photo and design stay.",
    digits: "Devanagari digits (१२३)",
    translit: "Type in English, get Devanagari",
    sample: "Fill sample text",
    clear: "Clear my text",
    clearAsk: "Clear names, ceremonies and other details?",
    pdf: "Download PDF",
    working: "Preparing…",
    shareLabel: "Share on WhatsApp",
    privacy: "Your card is made in your browser and saved only on this device. The card and photos are never uploaded.",
    free: "All designs are free, with no watermark.",
    failed: "Sorry, the download failed. Please try again.",
    inApp: "This in-app browser may block downloads. Open this page in Chrome or Safari to save your card.",
    copyLink: "Copy link",
    copied: "Link copied",
    biodata: "Need a marriage biodata too?",
    biodataCta: "Make a biodata",
    pdfNote: "PDF is A5 size; choose “Fit to page” to print on A4.",
  },
  hi: {
    details: "जानकारी",
    design: "डिज़ाइन",
    preview: "प्रीव्यू",
    couple: "वर-वधू",
    groom: "वर (दूल्हे) का नाम",
    groomParents: "वर के माता-पिता / परिवार",
    bride: "वधू (दुल्हन) का नाम",
    brideParents: "वधू के माता-पिता / परिवार",
    joiner: "नामों के बीच",
    brideFirst: "वधू का नाम पहले छापें",
    photo: "कपल फोटो (वैकल्पिक)",
    uploadPhoto: "फोटो जोड़ें",
    changePhoto: "बदलें",
    removePhoto: "हटाएँ",
    zoom: "ज़ूम",
    posX: "बाएँ–दाएँ",
    posY: "ऊपर–नीचे",
    wording: "शीर्षक और संदेश",
    title: "शीर्षक",
    opening: "आरंभिक पंक्ति",
    intro: "निमंत्रण संदेश",
    events: "मुहूर्त और कार्यक्रम",
    muhurat: "मुख्य मुहूर्त पंक्ति",
    muhuratHint: "छपवाने से पहले सटीक मुहूर्त अपने पारिवारिक पंडित जी से अवश्य पक्का कर लें।",
    muhuratLink: "विवाह मुहूर्त की तारीखें देखें",
    eventName: "कार्यक्रम",
    date: "दिन / तारीख",
    time: "समय",
    place: "स्थान",
    addEvent: "कार्यक्रम जोड़ें",
    moveUp: "ऊपर करें",
    moveDown: "नीचे करें",
    remove: "हटाएँ",
    event: "कार्यक्रम",
    venue: "विवाह स्थल",
    venueTitle: "शीर्षक",
    venueAddr: "स्थल का नाम और पता",
    hosts: "निमंत्रक और संपर्क",
    hostsTitle: "पहली सूची का शीर्षक",
    wishersTitle: "दूसरी सूची का शीर्षक",
    names: "नाम (हर पंक्ति में एक)",
    contact: "संपर्क पंक्ति",
    closing: "अंतिम पंक्ति",
    designs: "कार्ड डिज़ाइन",
    header: "भगवान की फोटो और मंगल वचन",
    symbol: "चिह्न",
    uploadSymbol: "भगवान की फोटो / कुल-चिह्न अपलोड करें",
    changeSymbol: "फोटो बदलें",
    symbolHint: "पारदर्शी बैकग्राउंड वाली PNG सबसे अच्छी दिखती है।",
    symbolSize: "चिह्न का आकार",
    invocation: "मंगल वचन",
    cardLang: "कार्ड की भाषा और टेक्स्ट",
    switchLang: "क्या टेक्स्ट को {lang} के नमूना शब्दों से बदल दें? आपकी फोटो और डिज़ाइन वही रहेंगे।",
    digits: "देवनागरी अंक (१२३)",
    translit: "अंग्रेज़ी में टाइप करें, हिंदी में पाएँ",
    sample: "नमूना टेक्स्ट भरें",
    clear: "मेरा टेक्स्ट मिटाएँ",
    clearAsk: "नाम, कार्यक्रम और बाकी जानकारी मिटा दें?",
    pdf: "PDF डाउनलोड",
    working: "तैयार हो रहा है…",
    shareLabel: "WhatsApp पर भेजें",
    privacy: "आपका कार्ड आपके ब्राउज़र में ही बनता है और सिर्फ़ इसी डिवाइस पर सेव होता है। कार्ड और फोटो कहीं अपलोड नहीं होते।",
    free: "सभी डिज़ाइन मुफ़्त हैं, कोई वॉटरमार्क नहीं।",
    failed: "माफ़ करें, डाउनलोड नहीं हो पाया। कृपया दोबारा कोशिश करें।",
    inApp: "यह इन-ऐप ब्राउज़र डाउनलोड रोक सकता है। कार्ड सेव करने के लिए यह पेज Chrome या Safari में खोलें।",
    copyLink: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    biodata: "शादी का बायोडाटा भी चाहिए?",
    biodataCta: "बायोडाटा बनाएँ",
    pdfNote: "PDF A5 साइज़ में है; A4 पर छापने के लिए “Fit to page” चुनें।",
  },
  mr: {
    details: "माहिती",
    design: "डिझाइन",
    preview: "पूर्वावलोकन",
    couple: "वधू-वर",
    groom: "वराचे नाव",
    groomParents: "वराचे आई-वडील / घराणे",
    bride: "वधूचे नाव",
    brideParents: "वधूचे आई-वडील / घराणे",
    joiner: "नावांच्या मध्ये",
    brideFirst: "वधूचे नाव आधी छापा",
    photo: "वधू-वरांचा फोटो (ऐच्छिक)",
    uploadPhoto: "फोटो जोडा",
    changePhoto: "बदला",
    removePhoto: "काढा",
    zoom: "झूम",
    posX: "डावी–उजवी",
    posY: "वर–खाली",
    wording: "शीर्षक व मजकूर",
    title: "शीर्षक",
    opening: "सुरुवातीची ओळ",
    intro: "निमंत्रणाचा मजकूर",
    events: "मुहूर्त व कार्यक्रम",
    muhurat: "मुख्य मुहूर्ताची ओळ",
    muhuratHint: "छपाईपूर्वी नेमका मुहूर्त आपल्या गुरुजींकडून नक्की करून घ्या.",
    muhuratLink: "लग्न मुहूर्त तारखा पाहा",
    eventName: "कार्यक्रम",
    date: "वार / तारीख",
    time: "वेळ",
    place: "ठिकाण",
    addEvent: "कार्यक्रम जोडा",
    moveUp: "वर हलवा",
    moveDown: "खाली हलवा",
    remove: "काढा",
    event: "कार्यक्रम",
    venue: "विवाह स्थळ",
    venueTitle: "शीर्षक",
    venueAddr: "कार्यालयाचे नाव व पत्ता",
    hosts: "निमंत्रक व संपर्क",
    hostsTitle: "पहिल्या यादीचे शीर्षक",
    wishersTitle: "दुसऱ्या यादीचे शीर्षक",
    names: "नावे (एका ओळीत एक)",
    contact: "संपर्काची ओळ",
    closing: "शेवटची ओळ",
    designs: "पत्रिकेचे डिझाइन",
    header: "देवाचा फोटो व मंगल वचन",
    symbol: "चिन्ह",
    uploadSymbol: "कुलदैवताचा फोटो / लोगो अपलोड करा",
    changeSymbol: "फोटो बदला",
    symbolHint: "पारदर्शक पार्श्वभूमीची PNG सर्वात छान दिसते.",
    symbolSize: "चिन्हाचा आकार",
    invocation: "मंगल वचन",
    cardLang: "पत्रिकेची भाषा व मजकूर",
    switchLang: "मजकूर {lang} मधील नमुन्याने बदलायचा का? फोटो व डिझाइन तसेच राहील.",
    digits: "देवनागरी अंक (१२३)",
    translit: "इंग्रजीत टाइप करा, मराठीत मिळवा",
    sample: "नमुना मजकूर भरा",
    clear: "माझा मजकूर पुसा",
    clearAsk: "नावे, कार्यक्रम व इतर माहिती पुसायची का?",
    pdf: "PDF डाउनलोड",
    working: "तयार होत आहे…",
    shareLabel: "WhatsApp वर पाठवा",
    privacy: "तुमची पत्रिका तुमच्या ब्राउझरमध्येच बनते आणि फक्त याच डिव्हाइसवर सेव्ह होते. पत्रिका व फोटो कुठेही अपलोड होत नाहीत.",
    free: "सर्व डिझाइन मोफत, वॉटरमार्क नाही.",
    failed: "क्षमस्व, डाउनलोड झाले नाही. कृपया पुन्हा प्रयत्न करा.",
    inApp: "हा इन-ॲप ब्राउझर डाउनलोड अडवू शकतो. पत्रिका सेव्ह करण्यासाठी हे पान Chrome किंवा Safari मध्ये उघडा.",
    copyLink: "लिंक कॉपी करा",
    copied: "लिंक कॉपी झाली",
    biodata: "लग्नाचा बायोडाटाही हवा आहे?",
    biodataCta: "बायोडाटा बनवा",
    pdfNote: "PDF A5 आकारात आहे; A4 वर छापताना “Fit to page” निवडा.",
  },
};

type Strings = (typeof T)["en"];
type Tab = "details" | "design" | "preview";
type Job = "pdf" | "jpg" | "share";
type Update = (fn: (i: Invitation) => Invitation | void) => void;
type Get = (i: Invitation) => string;
type Setter = (i: Invitation, v: string) => void;

const SYMBOLS: SymbolId[] = ["ganesh", "om", "swastik", "kalash", "lotus", "jain", "chakra", "crescent", "cross", "khanda", "none"];
const INPUT = "w-full rounded-lg border border-line bg-ivory/60 px-3 py-2 text-[15px] outline-none transition placeholder:text-soft/70 focus:border-gold focus:bg-paper";

function move<T>(arr: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

export default function InvitationMaker({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { confirm: confirmDlg, notify, dialog } = useConfirm(lang);
  const [inv, setInv] = useState<Invitation>(() => sampleInvitation(lang));
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("details");
  const [busy, setBusy] = useState<Job | null>(null);
  const [toast, setToast] = useState("");
  const [translit, setTranslit] = useState(lang !== "en");
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // The mobile action bar is fixed to the viewport, so show it only while the tool itself is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "0px 0px -120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const saved = loadInvitation(lang);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    if (saved) setInv(saved);
    // Instagram / Facebook / Snapchat / LINE webviews usually block file downloads.
    setInAppBrowser(/FBAN|FBAV|FB_IAB|Instagram|Snapchat|Line\//i.test(navigator.userAgent));
    setReady(true);
  }, [lang]);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => saveInvitation(lang, inv), 300);
    return () => clearTimeout(id);
  }, [inv, lang, ready]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);

  const update: Update = useCallback(
    (fn) =>
      setInv((i) => {
        const next = structuredClone(i);
        return fn(next) ?? next;
      }),
    [],
  );

  const tl = translit && inv.lang !== "en";

  /** Look up any completed English words in the field, then swap in their Devanagari forms. */
  async function transliterate(get: Get, set: Setter, text: string) {
    const cardLang = inv.lang;
    const words = pendingWords(text, cardLang);
    if (!words.length) return;
    await Promise.all(words.map((w) => transliterateWord(w, cardLang)));
    update((i) => set(i, applyCached(get(i), cardLang)));
  }

  /** Value + handlers for a text field bound to one string in the card. */
  const bind = (get: Get, set: Setter) => ({
    value: get(inv),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = tl ? applyCached(e.target.value, inv.lang) : e.target.value;
      update((i) => set(i, v));
      if (tl) transliterate(get, set, e.target.value);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (tl) transliterate(get, set, `${e.target.value} `);
    },
  });
  type Key = { [K in keyof Invitation]-?: Invitation[K] extends string ? K : never }[keyof Invitation];
  const field = (k: Key) =>
    bind(
      (i) => i[k] as string,
      (i, v) => {
        (i as Record<Key, string>)[k] = v;
      },
    );

  async function run(job: Job) {
    flushSync(() => setBusy(job));
    try {
      const node = cardRef.current;
      if (!node) return;
      if (job === "pdf") await exportInvitePdf(node, inv);
      if (job === "jpg") await exportInviteJpg(node, inv);
      if (job === "share") await shareInvite(node, inv);
      trackEvent("invitation_download", { format: job, template: inv.designId });
    } catch (e) {
      console.error(e);
      notify(t.failed);
    } finally {
      setBusy(null);
    }
  }

  async function switchLang(l: Lang) {
    if (l === inv.lang) return;
    if (!(await confirmDlg(t.switchLang.replace("{lang}", LANG_NATIVE[l])))) return;
    update((i) => ({ ...sampleInvitation(l, i.designId), symbol: i.symbol, symbolImage: i.symbolImage, symbolSize: i.symbolSize, photo: i.photo }));
  }

  const actions = (compact: boolean) => (
    <div className={`flex items-center justify-center gap-2 ${compact ? "" : "flex-wrap"}`}>
      <button
        onClick={() => run("pdf")}
        disabled={!!busy}
        className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-dark disabled:opacity-50"
      >
        <IconDownload /> {busy === "pdf" ? t.working : compact ? "PDF" : t.pdf}
      </button>
      <button
        onClick={() => run("jpg")}
        disabled={!!busy}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-medium hover:border-gold disabled:opacity-50"
      >
        <IconImage /> {busy === "jpg" ? t.working : "JPG"}
      </button>
      <button
        onClick={() => run("share")}
        disabled={!!busy}
        aria-label={t.shareLabel}
        title={t.shareLabel}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-medium text-leaf hover:border-leaf disabled:opacity-50"
      >
        <IconShare /> <span className={compact ? "hidden min-[400px]:inline" : ""}>{busy === "share" ? t.working : "WhatsApp"}</span>
      </button>
    </div>
  );

  const details = (
    <div className="space-y-5">
      <Card title={t.couple}>
        <PhotoPicker inv={inv} update={update} t={t} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field id="inv-groom" label={t.groom} {...field("groom")} />
          <Field id="inv-bride" label={t.bride} {...field("bride")} />
          <Field id="inv-groom-p" label={t.groomParents} long {...field("groomParents")} />
          <Field id="inv-bride-p" label={t.brideParents} long {...field("brideParents")} />
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div className="w-32">
            <Field id="inv-joiner" label={t.joiner} list={JOINERS[inv.lang]} {...field("joiner")} />
          </div>
          <div className="min-w-48 flex-1 pb-2 text-sm">
            <Toggle checked={inv.brideFirst} onChange={(v) => update((i) => void (i.brideFirst = v))} label={t.brideFirst} />
          </div>
        </div>
      </Card>

      <Card title={t.events}>
        <Field id="inv-muhurat" label={t.muhurat} {...field("muhurat")} />
        <p className="mt-1.5 text-xs leading-snug text-soft">
          {t.muhuratHint}{" "}
          <Link href={topicPath("muhurat", lang) ?? href(lang, "/")} className="font-medium text-maroon hover:underline">
            {t.muhuratLink} →
          </Link>
        </p>
        <datalist id="inv-event-names">
          {EVENT_NAMES[inv.lang].map((x) => (
            <option key={x} value={x} />
          ))}
        </datalist>
        <ol className="mt-4 space-y-3">
          {inv.events.map((e, idx) => {
            const ev = (k: "name" | "date" | "time" | "venue") =>
              bind(
                (i) => i.events.find((x) => x.id === e.id)?.[k] ?? "",
                (i, v) => {
                  const x = i.events.find((y) => y.id === e.id);
                  if (x) x[k] = v;
                },
              );
            return (
              <li key={e.id} className="rounded-xl border border-line bg-ivory/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-soft">
                    {t.event} {idx + 1}
                  </span>
                  <span className="flex-1" />
                  <IconBtn label={t.moveUp} onClick={() => update((i) => move(i.events, idx, -1))}>
                    <IconUp />
                  </IconBtn>
                  <IconBtn label={t.moveDown} onClick={() => update((i) => move(i.events, idx, 1))}>
                    <IconDown />
                  </IconBtn>
                  <IconBtn label={t.remove} onClick={() => update((i) => void i.events.splice(idx, 1))}>
                    <IconX />
                  </IconBtn>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field id={`inv-ev${idx}-name`} label={t.eventName} list="inv-event-names" {...ev("name")} />
                  <Field id={`inv-ev${idx}-time`} label={t.time} {...ev("time")} />
                  <Field id={`inv-ev${idx}-date`} label={t.date} {...ev("date")} />
                  <Field id={`inv-ev${idx}-venue`} label={t.place} {...ev("venue")} />
                </div>
              </li>
            );
          })}
        </ol>
        <button
          onClick={() => update((i) => void i.events.push({ id: eventId(), name: "", date: "", time: "", venue: "" }))}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-gold/60 px-3 py-1.5 text-sm text-gold-ink hover:bg-gold/5"
        >
          <IconPlus /> {t.addEvent}
        </button>
      </Card>

      <Card title={t.venue}>
        <div className="grid gap-3">
          <Field id="inv-venue-t" label={t.venueTitle} {...field("venueTitle")} />
          <Field id="inv-venue" label={t.venueAddr} long {...field("venue")} />
        </div>
      </Card>

      <Card title={t.wording}>
        <div className="grid gap-3">
          <Field id="inv-title" label={t.title} list={TITLES[inv.lang]} {...field("title")} />
          <Field id="inv-opening" label={t.opening} list={OPENINGS[inv.lang]} {...field("opening")} />
          <Field id="inv-intro" label={t.intro} long {...field("intro")} />
        </div>
      </Card>

      <Card title={t.hosts}>
        <datalist id="inv-host-titles">
          {HOST_TITLES[inv.lang].map((x) => (
            <option key={x} value={x} />
          ))}
        </datalist>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Field id="inv-hosts-t" label={t.hostsTitle} list="inv-host-titles" {...field("hostsTitle")} />
            <Field id="inv-hosts" label={t.names} long {...field("hosts")} />
          </div>
          <div className="space-y-2">
            <Field id="inv-wish-t" label={t.wishersTitle} list="inv-host-titles" {...field("wishersTitle")} />
            <Field id="inv-wish" label={t.names} long {...field("wishers")} />
          </div>
          <Field id="inv-contact" label={t.contact} {...field("contact")} />
          <Field id="inv-closing" label={t.closing} {...field("closing")} />
        </div>
      </Card>
    </div>
  );

  const d = DICTS[lang];
  const design = (
    <div className="space-y-5">
      <Card title={t.designs}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {DESIGNS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => update((i) => void (i.designId = ds.id))}
              aria-pressed={inv.designId === ds.id}
              className={`overflow-hidden rounded-md text-left ring-2 transition ${inv.designId === ds.id ? "ring-maroon" : "ring-transparent hover:ring-gold/60"}`}
              title={ds.name}
            >
              <DesignThumb designId={ds.id} lang={inv.lang} />
              <span className="block truncate bg-paper px-1.5 py-1 text-[11px] text-soft">{ds.name}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-leaf">{t.free}</p>
      </Card>

      <Card title={t.header}>
        <SymbolUpload inv={inv} update={update} t={t} />
        <div className="mb-1 text-xs font-medium text-soft">{t.symbol}</div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {inv.symbolImage && (
            <button
              onClick={() => update((i) => void (i.symbol = "custom"))}
              className={`inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-3 text-sm ${inv.symbol === "custom" ? "border-maroon bg-maroon/5 text-maroon" : "border-line text-soft hover:border-gold"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={inv.symbolImage} alt="" className="size-6 rounded-full bg-ivory object-contain" />
              {d.symbols.custom}
            </button>
          )}
          {SYMBOLS.map((s) => (
            <button
              key={s}
              onClick={() => update((i) => void (i.symbol = s))}
              className={`rounded-full border px-3 py-1 text-sm ${inv.symbol === s ? "border-maroon bg-maroon/5 text-maroon" : "border-line text-soft hover:border-gold"}`}
            >
              {d.symbols[s]}
            </button>
          ))}
        </div>
        <Field id="inv-invocation" label={t.invocation} list={INVOCATIONS[inv.lang]} {...field("invocation")} />
      </Card>

      <Card title={t.cardLang}>
        <div className="flex flex-wrap gap-1.5">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              aria-pressed={inv.lang === l}
              className={`rounded-full border px-4 py-1.5 text-sm ${inv.lang === l ? "border-maroon bg-maroon/5 text-maroon" : "border-line text-soft hover:border-gold"}`}
            >
              {LANG_NATIVE[l]}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <Toggle checked={inv.devanagariDigits} onChange={(v) => update((i) => void (i.devanagariDigits = v))} label={t.digits} />
          {inv.lang !== "en" && <Toggle checked={translit} onChange={setTranslit} label={t.translit} />}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => update((i) => ({ ...sampleInvitation(i.lang, i.designId), symbol: i.symbol, symbolImage: i.symbolImage, symbolSize: i.symbolSize, photo: i.photo }))}
            className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-gold"
          >
            {t.sample}
          </button>
          <button
            onClick={async () => (await confirmDlg(t.clearAsk, { danger: true })) && update((i) => blankInvitation(i))}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-soft hover:border-maroon hover:text-maroon"
          >
            {t.clear}
          </button>
        </div>
      </Card>
    </div>
  );

  return (
    <div ref={rootRef} className="relative pb-28 lg:pb-0">
      {dialog}
      {inAppBrowser && (
        <div role="alert" className="mb-4 flex flex-col gap-2 rounded-2xl border border-gold/50 bg-gold/10 p-4 text-sm text-ink sm:flex-row sm:items-center">
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        {/* Left: form */}
        <section
          className={`min-w-0 lg:block lg:max-h-[88vh] lg:overflow-y-auto lg:pr-2 ${tab === "preview" ? "hidden" : ""}`}
          aria-label={t.details}
        >
          <div className="mb-4 flex items-center gap-1 rounded-full border border-line bg-paper p-1 text-sm">
            {(["details", "design"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 rounded-full px-4 py-2 font-medium transition ${tab === k || (tab === "preview" && k === "details") ? "bg-maroon text-white" : "text-soft hover:text-ink"}`}
              >
                {k === "details" ? t.details : t.design}
              </button>
            ))}
          </div>
          {tab === "design" ? design : details}
        </section>

        {/* Right: preview */}
        <section className={`min-w-0 lg:block ${tab === "preview" ? "" : "hidden"}`} aria-label={t.preview}>
          <div className="lg:sticky lg:top-20">
            <div className="mb-3 hidden lg:block">{actions(false)}</div>
            <div className="mx-auto max-w-[480px] rounded-sm shadow-[0_10px_40px_-12px_rgba(60,30,20,0.25)] ring-1 ring-line">
              <ScaledCard ref={cardRef} inv={inv} />
            </div>
            <p className="mx-auto mt-3 max-w-[480px] text-center text-xs text-soft">{t.pdfNote}</p>
            <p className="mx-auto mt-1 max-w-[480px] text-center text-xs text-soft">{t.privacy}</p>
            <p className="mx-auto mt-3 max-w-[480px] text-center text-sm text-soft">
              {t.biodata}{" "}
              <Link href={href(lang, "/create")} className="font-semibold text-maroon hover:underline">
                {t.biodataCta} →
              </Link>
            </p>
          </div>
        </section>
      </div>

      {/* Mobile bottom bar, shown while the tool is on screen. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-3 py-2 backdrop-blur transition-transform lg:hidden ${inView ? "" : "pointer-events-none translate-y-full"}`}
        inert={!inView}
      >
        <div className="mb-2 flex gap-1 text-sm" role="tablist">
          {(["details", "design", "preview"] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => {
                setTab(k);
                // Jump back to the top of the tool if the user had scrolled down the form.
                if ((rootRef.current?.getBoundingClientRect().top ?? 0) < 0) rootRef.current?.scrollIntoView({ block: "start" });
              }}
              className={`flex-1 rounded-full py-1.5 ${tab === k ? "bg-maroon text-white" : "text-soft"}`}
            >
              {t[k]}
            </button>
          ))}
        </div>
        {actions(true)}
      </div>

      <div aria-live="polite" className="sr-only">
        {busy ? t.working : ""}
      </div>
      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-28 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-white shadow-lg lg:bottom-8">
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  long,
  list,
  ...rest
}: {
  id: string;
  label: string;
  long?: boolean;
  list?: string | string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const listId = Array.isArray(list) ? `${id}-list` : list;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-soft">
        {label}
      </label>
      {long ? (
        <textarea id={id} rows={2} {...rest} className={`${INPUT} resize-none`} style={{ fieldSizing: "content", minHeight: "2.6rem" } as React.CSSProperties} />
      ) : (
        <input id={id} list={listId} {...rest} className={INPUT} />
      )}
      {Array.isArray(list) && (
        <datalist id={listId}>
          {list.map((x) => (
            <option key={x} value={x} />
          ))}
        </datalist>
      )}
    </div>
  );
}

function PhotoPicker({ inv, update, t }: { inv: Invitation; update: Update; t: Strings }) {
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setLoading(true);
    try {
      const src = await resizePhoto(f, 800);
      update((i) => void (i.photo = { src, zoom: 1, x: 50, y: 35 }));
    } finally {
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  }

  const p = inv.photo;
  const set = (k: keyof Omit<Photo, "src">, v: number) => update((i) => void (i.photo && (i.photo[k] = v)));

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => input.current?.click()}
          aria-label={p ? t.changePhoto : t.uploadPhoto}
          className="relative size-16 shrink-0 overflow-hidden rounded-full border border-dashed border-gold/70 bg-ivory text-soft"
        >
          {p ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${p.x}% ${p.y}%` }} />
          ) : loading ? (
            "…"
          ) : (
            <IconImage className="mx-auto size-6 text-gold-ink" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{t.photo}</div>
          <div className="mt-1.5 flex gap-2">
            <button onClick={() => input.current?.click()} className="rounded-full border border-line px-3 py-1 text-sm hover:border-gold">
              {p ? t.changePhoto : t.uploadPhoto}
            </button>
            {p && (
              <button onClick={() => update((i) => void (i.photo = null))} className="rounded-full px-3 py-1 text-sm text-soft hover:text-maroon">
                {t.removePhoto}
              </button>
            )}
          </div>
        </div>
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {p && (
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-soft sm:grid-cols-3">
          <Range label={t.zoom} min={1} max={2.5} step={0.05} value={p.zoom} onChange={(v) => set("zoom", v)} />
          <Range label={t.posX} min={0} max={100} step={1} value={p.x} onChange={(v) => set("x", v)} />
          <Range label={t.posY} min={0} max={100} step={1} value={p.y} onChange={(v) => set("y", v)} />
        </div>
      )}
    </div>
  );
}

/** Upload a deity photo or family logo for the top of the card, plus a size control for any symbol. */
function SymbolUpload({ inv, update, t }: { inv: Invitation; update: Update; t: Strings }) {
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setLoading(true);
    try {
      const src = await resizePhoto(f, 360, true);
      update((i) => ({ ...i, symbol: "custom", symbolImage: src, symbolSize: i.symbolSize ?? 76 }));
    } finally {
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  }

  const custom = inv.symbol === "custom" && inv.symbolImage;
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
            <img src={inv.symbolImage} alt="" className="h-full w-full object-contain" />
          ) : loading ? (
            "…"
          ) : (
            <IconImage className="size-6" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={() => input.current?.click()} className="text-left text-sm font-semibold text-maroon hover:underline">
            {custom ? t.changeSymbol : t.uploadSymbol}
          </button>
          <p className="mt-0.5 text-xs leading-snug text-soft">{t.symbolHint}</p>
        </div>
        {inv.symbolImage && (
          <button
            type="button"
            onClick={() => update((i) => ({ ...i, symbolImage: undefined, symbol: i.symbol === "custom" ? "ganesh" : i.symbol }))}
            className="shrink-0 text-xs text-soft hover:text-maroon"
          >
            {t.removePhoto}
          </button>
        )}
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {inv.symbol !== "none" && (
        <label className="mt-3 block text-xs text-soft">
          {t.symbolSize}
          <input
            type="range"
            min={28}
            max={130}
            step={2}
            value={inv.symbolSize ?? (inv.symbol === "custom" ? 76 : 50)}
            onChange={(e) => update((i) => void (i.symbolSize = Number(e.target.value)))}
            className="mt-1 w-full accent-maroon"
          />
        </label>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <h3 className="mb-3 font-display text-lg text-maroon">{title}</h3>
      {children}
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="rounded p-1.5 text-soft hover:bg-sand hover:text-ink">
      {children}
    </button>
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

function Range({ label, ...r }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      {label}
      <input type="range" min={r.min} max={r.max} step={r.step} value={r.value} onChange={(e) => r.onChange(Number(e.target.value))} className="mt-1 w-full accent-maroon" />
    </label>
  );
}
