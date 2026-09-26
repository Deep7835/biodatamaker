"use client";

import type { Photo, SymbolId } from "@/lib/biodata";
import type { Lang } from "@/lib/i18n";
import { PALETTES, type FontPair, type Frame, type Palette, type PhotoShape } from "@/lib/templates";

/** Card canvas: same 794×1123 (A-series ratio) as the biodata page, so A4 and A5 prints both fit. */
export const CARD = { w: 794, h: 1123 };

export const INVITE_STORAGE = (lang: Lang) => `biodatasathi:invite:${lang}`;

export type InviteEvent = { id: string; name: string; date: string; time: string; venue: string };

export type Invitation = {
  version: 1;
  lang: Lang;
  designId: string;
  symbol: SymbolId;
  /** User-uploaded deity photo or family logo, used when `symbol` is "custom". */
  symbolImage?: string;
  symbolSize?: number;
  invocation: string;
  /** Big heading motif, e.g. "शुभविवाह". */
  title: string;
  /** e.g. "सस्नेह निमंत्रण" / "सादर आमंत्रण" / "You are cordially invited". */
  opening: string;
  /** Invitation message paragraph. */
  intro: string;
  groom: string;
  groomParents: string;
  bride: string;
  brideParents: string;
  /** Word or symbol between the two names: "सह", "संग", "&". */
  joiner: string;
  brideFirst: boolean;
  /** Main muhurat line, e.g. "शुभ मुहूर्त: सकाळी 11:32". */
  muhurat: string;
  events: InviteEvent[];
  venueTitle: string;
  venue: string;
  hostsTitle: string;
  hosts: string;
  wishersTitle: string;
  wishers: string;
  contact: string;
  closing: string;
  photo: Photo | null;
  devanagariDigits: boolean;
};

let counter = 0;
export const eventId = () => `e${Date.now().toString(36)}${(counter++).toString(36)}`;

const ev = (name: string, date: string, time: string, venue: string): InviteEvent => ({ id: eventId(), name, date, time, venue });

/** Sample content with fictional names, per card language. */
export function sampleInvitation(lang: Lang, designId = DESIGNS[0].id): Invitation {
  const common = { version: 1 as const, lang, designId, symbol: "ganesh" as SymbolId, photo: null };
  if (lang === "mr")
    return {
      ...common,
      invocation: "।। श्री गणेशाय नमः ।।",
      title: "शुभविवाह",
      opening: "सस्नेह निमंत्रण",
      intro: "आमचे येथे श्री कृपेकरून खालील शुभमुहूर्तावर विवाह करण्याचे योजिले आहे. तरी या मंगलप्रसंगी आपण सहकुटुंब सहपरिवार उपस्थित राहून वधू-वरांस शुभाशीर्वाद द्यावेत, ही आग्रहाची विनंती.",
      groom: "चि. रोहन",
      groomParents: "श्री. सुरेश व सौ. सुनीता कुलकर्णी यांचे ज्येष्ठ चिरंजीव, पुणे",
      bride: "चि. सौ. कां. प्रिया",
      brideParents: "श्री. विजय व सौ. मीना देशपांडे यांची कनिष्ठ कन्या, नाशिक",
      joiner: "सह",
      brideFirst: false,
      muhurat: "शुभ मुहूर्त : रविवार, 13 डिसेंबर 2026, सकाळी 11 वा. 32 मि.",
      events: [
        ev("हळद", "शनिवार, 12 डिसेंबर", "सकाळी 9 वा.", "राहत्या घरी"),
        ev("सीमांत पूजन", "शनिवार, 12 डिसेंबर", "सायं. 6 वा.", "मंगल कार्यालय"),
        ev("विवाह", "रविवार, 13 डिसेंबर", "सकाळी 11:32", "मंगल कार्यालय"),
        ev("स्वागत समारंभ", "रविवार, 13 डिसेंबर", "सायं. 7 वा.", "मंगल कार्यालय"),
      ],
      venueTitle: "विवाह स्थळ",
      venue: "श्री लक्ष्मी मंगल कार्यालय, कर्वे रस्ता, कोथरूड, पुणे – 411038",
      hostsTitle: "निमंत्रक",
      hosts: "श्री. सुरेश व सौ. सुनीता कुलकर्णी\nसमस्त कुलकर्णी परिवार",
      wishersTitle: "दर्शनाभिलाषी",
      wishers: "श्री. अजय व सौ. स्नेहा कुलकर्णी\nकु. अनुष्का, चि. आर्यन",
      contact: "संपर्क : 98XXX XXX00",
      closing: "आपले शुभाशीर्वाद हाच आमचा आहेर.",
      devanagariDigits: true,
    };
  if (lang === "hi")
    return {
      ...common,
      invocation: "।। श्री गणेशाय नमः ।।",
      title: "शुभ विवाह",
      opening: "सादर आमंत्रण",
      intro: "ईश्वर की असीम अनुकम्पा एवं बड़ों के आशीर्वाद से हमारे परिवार में शुभ विवाह का आयोजन निश्चित हुआ है। इस मंगल अवसर पर आप सपरिवार पधारकर वर-वधू को अपना आशीर्वाद प्रदान करें।",
      groom: "चि. रोहन",
      groomParents: "सुपुत्र श्रीमती सुनीता एवं श्री सुरेश शर्मा, जयपुर",
      bride: "आयुष्मती प्रिया",
      brideParents: "सुपुत्री श्रीमती मीना एवं श्री विजय अग्रवाल, उदयपुर",
      joiner: "संग",
      brideFirst: false,
      muhurat: "शुभ मुहूर्त : रविवार, 13 दिसंबर 2026, प्रातः 11:32 बजे",
      events: [
        ev("हल्दी", "शनिवार, 12 दिसंबर", "प्रातः 10 बजे", "निवास स्थान"),
        ev("मेहंदी संध्या", "शनिवार, 12 दिसंबर", "सायं 6 बजे", "राजमहल गार्डन"),
        ev("पाणिग्रहण संस्कार", "रविवार, 13 दिसंबर", "प्रातः 11:32 बजे", "राजमहल गार्डन"),
        ev("प्रीतिभोज", "रविवार, 13 दिसंबर", "सायं 7 बजे से", "राजमहल गार्डन"),
      ],
      venueTitle: "विवाह स्थल",
      venue: "राजमहल गार्डन, टोंक रोड, जयपुर (राज.)",
      hostsTitle: "विनीत",
      hosts: "श्रीमती सुनीता एवं श्री सुरेश शर्मा\nसमस्त शर्मा परिवार",
      wishersTitle: "दर्शनाभिलाषी",
      wishers: "अजय-स्नेहा, विकास-पूजा\nएवं समस्त इष्ट-मित्र",
      contact: "संपर्क : 98XXX XXX00",
      closing: "आपका आशीर्वाद ही हमारा उपहार है।",
      devanagariDigits: false,
    };
  return {
    ...common,
    invocation: "|| Shree Ganeshaya Namah ||",
    title: "Shubh Vivah",
    opening: "You are cordially invited",
    intro: "With the blessings of our elders, we request the pleasure of your company to celebrate the wedding of",
    groom: "Rohan",
    groomParents: "son of Mrs. Sunita & Mr. Suresh Kulkarni, Pune",
    bride: "Priya",
    brideParents: "daughter of Mrs. Meena & Mr. Vijay Deshpande, Nashik",
    joiner: "&",
    brideFirst: true,
    muhurat: "Muhurat: Sunday, 13 December 2026 at 11:32 AM",
    events: [
      ev("Haldi", "Sat, 12 December", "10:00 AM", "At residence"),
      ev("Sangeet", "Sat, 12 December", "7:00 PM", "Lakshmi Banquets"),
      ev("Wedding", "Sun, 13 December", "11:32 AM", "Lakshmi Banquets"),
      ev("Reception", "Sun, 13 December", "7:30 PM onwards", "Lakshmi Banquets"),
    ],
    venueTitle: "Venue",
    venue: "Shri Lakshmi Banquets, Karve Road, Kothrud, Pune 411038",
    hostsTitle: "With best compliments",
    hosts: "Mrs. Sunita & Mr. Suresh Kulkarni\nMrs. Meena & Mr. Vijay Deshpande",
    wishersTitle: "Eagerly awaiting you",
    wishers: "Ajay & Sneha Kulkarni\nAnushka and Aryan",
    contact: "RSVP: Ajay Kulkarni – 98XXX XXX00",
    closing: "Your presence and blessings are the only gift we seek.",
    devanagariDigits: false,
  };
}

/** A card with every text field cleared (design, symbol and language kept). */
export function blankInvitation(inv: Invitation): Invitation {
  return {
    ...inv,
    groom: "",
    groomParents: "",
    bride: "",
    brideParents: "",
    muhurat: "",
    events: [{ id: eventId(), name: "", date: "", time: "", venue: "" }],
    venue: "",
    hosts: "",
    wishers: "",
    contact: "",
    closing: "",
    photo: null,
  };
}

/**
 * Heart joiner. U+FE0E forces text (not emoji) style in the form; on the card it is drawn as an SVG
 * heart (see isHeartJoiner). Older saved cards with "❤" are recognised too.
 */
export const HEART = "\u2665\uFE0E";
export const isHeartJoiner = (s: string) => /^[\u2665\u2764\u2661][\uFE0E\uFE0F]?$/.test(s.trim());

export const JOINERS: Record<Lang, string[]> = {
  mr: ["सह", "संग", "आणि", "&", HEART],
  hi: ["संग", "सह", "एवं", "&", HEART],
  en: ["&", "and", "weds", HEART],
};

export const TITLES: Record<Lang, string[]> = {
  mr: ["शुभविवाह", "लग्नपत्रिका", "शुभमंगल सावधान", "विवाह निमंत्रण"],
  hi: ["शुभ विवाह", "विवाह आमंत्रण", "शुभ परिणय", "मांगलिक आमंत्रण"],
  en: ["Shubh Vivah", "Wedding Invitation", "Save the Date", "Together Forever"],
};

export const OPENINGS: Record<Lang, string[]> = {
  mr: ["सस्नेह निमंत्रण", "सादर निमंत्रण", "आग्रहाचे निमंत्रण", "स्नेहपूर्ण आमंत्रण"],
  hi: ["सादर आमंत्रण", "सप्रेम निमंत्रण", "सादर निमंत्रण", "आपको सपरिवार आमंत्रित करते हैं"],
  en: ["You are cordially invited", "Together with their families", "Please join us", "Request the honour of your presence"],
};

export const EVENT_NAMES: Record<Lang, string[]> = {
  mr: ["साखरपुडा", "हळद", "मेहंदी", "संगीत", "सीमांत पूजन", "देवदेवक", "विवाह", "स्वागत समारंभ", "सत्यनारायण पूजा"],
  hi: ["सगाई", "तिलक", "हल्दी", "मेहंदी", "संगीत संध्या", "बारात प्रस्थान", "पाणिग्रहण संस्कार", "प्रीतिभोज", "रिसेप्शन"],
  en: ["Engagement", "Haldi", "Mehendi", "Sangeet", "Baraat", "Wedding", "Reception", "Dinner"],
};

export const HOST_TITLES: Record<Lang, string[]> = {
  mr: ["निमंत्रक", "दर्शनाभिलाषी", "स्वागतोत्सुक", "आपले नम्र", "आमंत्रक"],
  hi: ["विनीत", "दर्शनाभिलाषी", "स्वागतोत्सुक", "निवेदक", "आमंत्रक"],
  en: ["With best compliments", "Eagerly awaiting you", "Hosted by", "RSVP"],
};

// ---------------------------------------------------------------- designs

export type EventStyle = "cards" | "columns";
export type TitleStyle = "plain" | "ribbon" | "flourish";

export type InviteDesign = {
  id: string;
  name: string;
  palette: Palette;
  frame: Frame;
  fonts: FontPair;
  events: EventStyle;
  title: TitleStyle;
  /** Faint mandala watermark behind the text. */
  mandala: boolean;
  photo: PhotoShape;
};

type Spec = [id: string, name: string, palette: keyof typeof PALETTES, frame: Frame, fonts: FontPair, events: EventStyle, title: TitleStyle, mandala: boolean, photo: PhotoShape];

const SPECS: Spec[] = [
  ["marigold-toran", "Marigold Toran", "marigold", "toran", "traditional", "cards", "plain", false, "round"],
  ["maroon-ornate", "Maroon Heritage", "maroon", "ornate", "traditional", "columns", "flourish", false, "arch"],
  ["wine-paisley", "Wine Paisley", "wine", "paisley", "decorative", "cards", "plain", true, "round"],
  ["champagne-jharokha", "Champagne Jharokha", "champagne", "jharokha", "elegant", "columns", "plain", false, "arch"],
  ["emerald-jharokha", "Emerald Night", "emeraldnight", "jharokha", "decorative", "cards", "plain", true, "arch"],
  ["kesari-rangoli", "Kesari Rangoli", "kesari", "rangoli", "traditional", "cards", "ribbon", false, "round"],
  ["haldi-mandala", "Haldi Mandala", "haldi", "mandala", "decorative", "columns", "flourish", false, "round"],
  ["peacock-arch", "Peacock Arch", "peacock", "arch", "elegant", "cards", "plain", false, "arch"],
  ["midnight-gold", "Midnight Gold", "navy", "double", "elegant", "columns", "flourish", true, "round"],
  ["sindoor-toran", "Sindoor Toran", "sindoor", "toran", "decorative", "columns", "ribbon", false, "round"],
  ["purple-paisley", "Royal Purple", "royalpurple", "paisley", "elegant", "cards", "flourish", true, "round"],
  ["blush-floral", "Blush Floral", "blush", "corners", "elegant", "cards", "plain", false, "round"],
  ["mehndi-leaf", "Mehndi Leaf", "mehndi", "corners", "traditional", "columns", "ribbon", false, "arch"],
  ["teal-ornate", "Night Teal", "nightteal", "ornate", "decorative", "cards", "flourish", true, "round"],
];

export const DESIGNS: InviteDesign[] = SPECS.map(([id, name, palette, frame, fonts, events, title, mandala, photo]) => ({
  id,
  name,
  palette: PALETTES[palette],
  frame,
  fonts,
  events,
  title,
  mandala,
  photo,
}));

export function getDesign(id: string | undefined): InviteDesign {
  return DESIGNS.find((d) => d.id === id) ?? DESIGNS[0];
}

// ---------------------------------------------------------------- storage

export function loadInvitation(lang: Lang): Invitation | null {
  try {
    const raw = localStorage.getItem(INVITE_STORAGE(lang));
    const inv = raw ? (JSON.parse(raw) as Invitation) : null;
    if (inv?.version !== 1 || !Array.isArray(inv.events)) return null;
    // Fill fields added later so older drafts keep working.
    return { ...sampleInvitation(inv.lang ?? lang), ...inv };
  } catch {
    return null;
  }
}

export function saveInvitation(lang: Lang, inv: Invitation) {
  try {
    localStorage.setItem(INVITE_STORAGE(lang), JSON.stringify(inv));
  } catch {
    /* storage full or blocked: the editor keeps working in memory */
  }
}

// ---------------------------------------------------------------- export

const FILE_SUFFIX: Record<Lang, string> = { en: "wedding-invitation", hi: "shadi-card", mr: "lagna-patrika" };

const clean = (s: string) =>
  s
    .replace(/^(चि\.\s*सौ\.\s*कां\.|चि\.|आयुष्मती|आयुष्मान|आयु\.|सौ\.|कु\.)\s*/u, "")
    .replace(/[\\/:*?"<>|]+/g, "")
    .trim();

export function inviteFileBase(inv: Invitation) {
  const names = [clean(inv.groom), clean(inv.bride)].filter(Boolean).join("-");
  const safe = names.replace(/\s+/g, "-").slice(0, 60);
  return safe ? `${safe}-${FILE_SUFFIX[inv.lang]}` : FILE_SUFFIX[inv.lang];
}

export function inviteShareText(inv: Invitation) {
  const names = [inv.groom, inv.bride].filter((s) => s.trim());
  const [a, b] = inv.brideFirst ? names.reverse() : names;
  const joiner = !inv.joiner || isHeartJoiner(inv.joiner) ? "&" : inv.joiner;
  return [inv.title, [a, b].filter(Boolean).join(` ${joiner} `)].filter(Boolean).join(" – ");
}

async function renderJpeg(node: HTMLElement, pixelRatio = 2.5) {
  const { toJpeg } = await import("html-to-image");
  // Keep the design's own paper colour; a fixed white would wipe out dark designs.
  const backgroundColor = getComputedStyle(node).backgroundColor || "#ffffff";
  const opts = { width: CARD.w, height: CARD.h, pixelRatio, quality: 0.93, backgroundColor, style: { transform: "none" } };
  // First pass warms the font/image cache; Safari often drops web fonts on the very first capture.
  await toJpeg(node, { ...opts, pixelRatio: 0.3 });
  return toJpeg(node, opts);
}

function download(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function exportInviteJpg(node: HTMLElement, inv: Invitation) {
  download(await renderJpeg(node), `${inviteFileBase(inv)}.jpg`);
}

/** A5 portrait PDF (148 × 210 mm): the usual Indian card size; prints on A4 with "fit to page" too. */
export async function exportInvitePdf(node: HTMLElement, inv: Invitation) {
  const [img, { jsPDF }] = await Promise.all([renderJpeg(node, 3), import("jspdf")]);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5", compress: true });
  pdf.addImage(img, "JPEG", 0, 0, 148, 210, undefined, "FAST");
  pdf.setProperties({ title: inviteFileBase(inv), creator: "BiodataSathi" });
  pdf.save(`${inviteFileBase(inv)}.pdf`);
}

export async function shareInvite(node: HTMLElement, inv: Invitation) {
  const url = await renderJpeg(node);
  const blob = await (await fetch(url)).blob();
  const file = new File([blob], `${inviteFileBase(inv)}.jpg`, { type: "image/jpeg" });
  const text = inviteShareText(inv);
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: text });
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
  }
  // Desktop fallback: save the image, then open WhatsApp so the user can attach it.
  download(url, file.name);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}
