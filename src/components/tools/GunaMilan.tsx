"use client";

import { useEffect, useId, useState } from "react";
import { href, type Lang } from "@/lib/i18n";
import { FIELDS, PLANETS, RASHI, type Biodata } from "@/lib/biodata";
import { topicPath } from "@/content/slugs";
import {
  charansIn,
  matchGuna,
  personFromBiodata,
  rashiOf,
  rashiOptions,
  type Band,
  type KootKey,
  type MatchResult,
} from "@/lib/tools/guna-milan";

type Side = "bride" | "groom";
/** nak -1 = not chosen yet; charan null = not known. */
type Input = { nak: number; charan: number | null; rashi: number };
type Saved = { bride: Input; groom: Input; shown: boolean };

const STORE = "biodatasathi:guna";
const EMPTY: Input = { nak: -1, charan: null, rashi: -1 };

const T = {
  en: {
    side: { bride: "Bride (Girl)", groom: "Groom (Boy)" },
    nakshatra: "Nakshatra",
    pickNak: "Select nakshatra",
    charan: "Charan (pada)",
    charanUnknown: "Not known",
    charanOpt: (c: number, r: string) => `Charan ${c} · ${r}`,
    rashi: "Rashi (Moon sign)",
    pickRashi: "Choose nakshatra first",
    rashiFromCharan: "Set by nakshatra + charan.",
    rashiFixed: "This nakshatra lies wholly in one rashi.",
    rashiTwo: "This nakshatra spans two rashis. Pick the right one, or choose the charan.",
    fill: "Fill from my biodata",
    filled: "Filled from the biodata saved on this device.",
    noDraft: "No saved biodata with a nakshatra was found on this device.",
    openEditor: "Open the biodata maker",
    match: "Match",
    need: "Choose the nakshatra for both bride and groom.",
    total: "Total gunas",
    outOf: "out of 36",
    band: { low: "Not recommended", average: "Average", good: "Good match", excellent: "Excellent match" } as Record<Band, string>,
    bandText: {
      low: "Below 18 gunas is traditionally not recommended for marriage.",
      average: "18 to 24 gunas is an average match. Families usually go ahead after checking the doshas below with an astrologer.",
      good: "25 to 32 gunas is considered a good match.",
      excellent: "33 to 36 gunas is considered an excellent match.",
    } as Record<Band, string>,
    koot: "Koot",
    points: "Points",
    bg: "Bride · Groom",
    koots: {
      varna: ["Varna", "Work nature and ego"],
      vashya: ["Vashya", "Mutual attraction and influence"],
      tara: ["Tara (Dina)", "Health and fortune"],
      yoni: ["Yoni", "Physical compatibility"],
      maitri: ["Graha Maitri", "Mental wavelength, friendship"],
      gana: ["Gana", "Temperament"],
      bhakoot: ["Bhakoot (Rashi)", "Family welfare and prosperity"],
      nadi: ["Nadi", "Health and children"],
    } as Record<KootKey, [string, string]>,
    varna: ["Brahmin", "Kshatriya", "Vaishya", "Shudra"],
    vashya: ["Chatushpad", "Manav", "Jalchar", "Vanchar", "Keet"],
    yoni: ["Horse", "Elephant", "Sheep", "Serpent", "Dog", "Cat", "Rat", "Cow", "Buffalo", "Tiger", "Deer", "Monkey", "Mongoose", "Lion"],
    gana: ["Dev", "Manushya", "Rakshas"],
    nadi: ["Adya", "Madhya", "Antya"],
    tara: ["Janma", "Sampat", "Vipat", "Kshema", "Pratyari", "Sadhaka", "Vadha", "Mitra", "Ati-mitra"],
    doshas: "Doshas",
    noDosha: "No Nadi, Bhakoot or Gana dosha in this match.",
    nadiDosha: (n: string) => `Nadi dosha: both have ${n} nadi, so Nadi scores 0 of 8. Traditionally this is taken seriously for health and children.`,
    bhakootDosha: (k: string) => `Bhakoot dosha (${k}): the two rashis sit ${k} from each other, so Bhakoot scores 0 of 7.`,
    ganaDosha: "Gana dosha: one of you is Rakshas gana and the other is not, which traditionally suggests a clash of temperament.",
    exc: {
      sameRashiDiffNak: "Same rashi but different nakshatras: many panchangs treat Nadi dosha as cancelled here.",
      sameNakDiffRashi: "Same nakshatra but different rashis: often cited as a cancellation of Nadi dosha.",
      sameNakDiffCharan: "Same nakshatra and rashi but different charan: some traditions treat the dosha as milder.",
      sameLord: (p: string) => `Both rashis are ruled by ${p}: a commonly cited cancellation of Bhakoot dosha.`,
      friendlyLords: (a: string, b: string) => `The rashi lords ${a} and ${b} are friends: many astrologers treat the dosha as cancelled or reduced.`,
      ganaLords: "The rashi lords are the same or friends: often cited as reducing Gana dosha.",
    },
    excNote: "These exceptions are shown for information only. The score above is not changed; ask your astrologer whether they apply.",
    note: "Guna milan compares only the Moon's nakshatra and rashi. A family astrologer also studies the full kundali (Mangal dosha, 7th house, dashas) before advising. Please treat this score as a first look and confirm with your astrologer or purohit.",
    method: "Tables follow the most common North Indian (Ashtakoot) convention. Panchangs differ slightly on Vashya, Gana and Tara, so another calculator may show a point or two of difference.",
    unsure: "Don't know the nakshatra?",
    finder: "Find rashi and nakshatra from the birth date",
  },
  hi: {
    side: { bride: "वधू (लड़की)", groom: "वर (लड़का)" },
    nakshatra: "नक्षत्र",
    pickNak: "नक्षत्र चुनें",
    charan: "चरण",
    charanUnknown: "पता नहीं",
    charanOpt: (c: number, r: string) => `चरण ${c} · ${r}`,
    rashi: "राशि (चंद्र राशि)",
    pickRashi: "पहले नक्षत्र चुनें",
    rashiFromCharan: "नक्षत्र और चरण से तय हुई।",
    rashiFixed: "यह नक्षत्र पूरा एक ही राशि में आता है।",
    rashiTwo: "यह नक्षत्र दो राशियों में फैला है। सही राशि चुनें या चरण बताएँ।",
    fill: "मेरे बायोडाटा से भरें",
    filled: "इस डिवाइस पर सेव बायोडाटा से भर दिया गया।",
    noDraft: "इस डिवाइस पर नक्षत्र वाला कोई सेव बायोडाटा नहीं मिला।",
    openEditor: "बायोडाटा मेकर खोलें",
    match: "मिलान करें",
    need: "वधू और वर दोनों का नक्षत्र चुनें।",
    total: "कुल गुण",
    outOf: "36 में से",
    band: { low: "अनुशंसित नहीं", average: "मध्यम", good: "अच्छा मिलान", excellent: "उत्तम मिलान" } as Record<Band, string>,
    bandText: {
      low: "18 से कम गुण परंपरागत रूप से विवाह के लिए उचित नहीं माने जाते।",
      average: "18 से 24 गुण मध्यम मिलान है। परिवार आमतौर पर नीचे दिए दोष ज्योतिषी से जँचवाकर आगे बढ़ते हैं।",
      good: "25 से 32 गुण अच्छा मिलान माना जाता है।",
      excellent: "33 से 36 गुण उत्तम मिलान माना जाता है।",
    } as Record<Band, string>,
    koot: "कूट",
    points: "गुण",
    bg: "वधू · वर",
    koots: {
      varna: ["वर्ण", "कार्य-स्वभाव और अहं"],
      vashya: ["वश्य", "आपसी आकर्षण और प्रभाव"],
      tara: ["तारा (दिन)", "स्वास्थ्य और भाग्य"],
      yoni: ["योनि", "शारीरिक अनुकूलता"],
      maitri: ["ग्रह मैत्री", "मानसिक तालमेल, मित्रता"],
      gana: ["गण", "स्वभाव"],
      bhakoot: ["भकूट (राशि)", "परिवार का सुख और समृद्धि"],
      nadi: ["नाड़ी", "स्वास्थ्य और संतान"],
    } as Record<KootKey, [string, string]>,
    varna: ["ब्राह्मण", "क्षत्रिय", "वैश्य", "शूद्र"],
    vashya: ["चतुष्पद", "मानव", "जलचर", "वनचर", "कीट"],
    yoni: ["अश्व", "गज", "मेष", "सर्प", "श्वान", "मार्जार", "मूषक", "गौ", "महिष", "व्याघ्र", "मृग", "वानर", "नकुल", "सिंह"],
    gana: ["देव", "मनुष्य", "राक्षस"],
    nadi: ["आद्य", "मध्य", "अंत्य"],
    tara: ["जन्म", "संपत", "विपत", "क्षेम", "प्रत्यरि", "साधक", "वध", "मित्र", "अतिमित्र"],
    doshas: "दोष",
    noDosha: "इस मिलान में नाड़ी, भकूट या गण दोष नहीं है।",
    nadiDosha: (n: string) => `नाड़ी दोष: दोनों की नाड़ी ${n} है, इसलिए नाड़ी में 8 में से 0 गुण। परंपरा में इसे स्वास्थ्य और संतान के लिहाज़ से गंभीर माना जाता है।`,
    bhakootDosha: (k: string) => `भकूट दोष (${k}): दोनों राशियाँ एक-दूसरे से ${k} पर हैं, इसलिए भकूट में 7 में से 0 गुण।`,
    ganaDosha: "गण दोष: एक का गण राक्षस है और दूसरे का नहीं, जिसे परंपरा में स्वभाव के टकराव का संकेत माना जाता है।",
    exc: {
      sameRashiDiffNak: "राशि एक है पर नक्षत्र अलग: कई पंचांग ऐसे में नाड़ी दोष को निरस्त मानते हैं।",
      sameNakDiffRashi: "नक्षत्र एक है पर राशि अलग: इसे अक्सर नाड़ी दोष का परिहार बताया जाता है।",
      sameNakDiffCharan: "नक्षत्र और राशि एक, पर चरण अलग: कुछ परंपराओं में दोष हल्का माना जाता है।",
      sameLord: (p: string) => `दोनों राशियों के स्वामी ${p} हैं: इसे भकूट दोष का प्रचलित परिहार माना जाता है।`,
      friendlyLords: (a: string, b: string) => `राशि स्वामी ${a} और ${b} आपस में मित्र हैं: कई ज्योतिषी ऐसे में दोष को निरस्त या कम मानते हैं।`,
      ganaLords: "राशि स्वामी एक ही हैं या मित्र हैं: इसे गण दोष कम करने वाला माना जाता है।",
    },
    excNote: "ये परिहार केवल जानकारी के लिए हैं। ऊपर का स्कोर नहीं बदला गया है; ये लागू होते हैं या नहीं, यह अपने ज्योतिषी से पूछें।",
    note: "गुण मिलान केवल चंद्रमा के नक्षत्र और राशि की तुलना है। पारिवारिक ज्योतिषी सलाह देने से पहले पूरी कुंडली (मंगल दोष, सप्तम भाव, दशा) भी देखते हैं। इस स्कोर को पहली झलक समझें और अपने ज्योतिषी या पुरोहित से ज़रूर पुष्टि करें।",
    method: "तालिकाएँ उत्तर भारत की सबसे प्रचलित अष्टकूट पद्धति के अनुसार हैं। वश्य, गण और तारा में पंचांगों में थोड़ा अंतर होता है, इसलिए किसी दूसरे कैलकुलेटर में एक-दो गुण का फ़र्क दिख सकता है।",
    unsure: "नक्षत्र पता नहीं?",
    finder: "जन्म तिथि से राशि और नक्षत्र जानें",
  },
  mr: {
    side: { bride: "वधू (मुलगी)", groom: "वर (मुलगा)" },
    nakshatra: "नक्षत्र",
    pickNak: "नक्षत्र निवडा",
    charan: "चरण",
    charanUnknown: "माहीत नाही",
    charanOpt: (c: number, r: string) => `चरण ${c} · ${r}`,
    rashi: "रास (चंद्र रास)",
    pickRashi: "आधी नक्षत्र निवडा",
    rashiFromCharan: "नक्षत्र व चरणावरून ठरली.",
    rashiFixed: "हे नक्षत्र पूर्णपणे एकाच राशीत येते.",
    rashiTwo: "हे नक्षत्र दोन राशींमध्ये पसरलेले आहे. योग्य रास निवडा किंवा चरण सांगा.",
    fill: "माझ्या बायोडाटामधून भरा",
    filled: "या डिव्हाइसवर सेव्ह केलेल्या बायोडाटामधून भरले.",
    noDraft: "या डिव्हाइसवर नक्षत्र असलेला सेव्ह केलेला बायोडाटा सापडला नाही.",
    openEditor: "बायोडाटा मेकर उघडा",
    match: "गुण जुळवा",
    need: "वधू आणि वर दोघांचे नक्षत्र निवडा.",
    total: "एकूण गुण",
    outOf: "36 पैकी",
    band: { low: "शिफारस नाही", average: "मध्यम", good: "चांगले जुळते", excellent: "उत्तम जुळते" } as Record<Band, string>,
    bandText: {
      low: "18 पेक्षा कमी गुण पारंपरिकरीत्या लग्नासाठी योग्य मानले जात नाहीत.",
      average: "18 ते 24 गुण म्हणजे मध्यम जुळणी. कुटुंबे साधारणपणे खालील दोष ज्योतिषांकडून तपासून पुढे जातात.",
      good: "25 ते 32 गुण चांगली जुळणी मानली जाते.",
      excellent: "33 ते 36 गुण उत्तम जुळणी मानली जाते.",
    } as Record<Band, string>,
    koot: "कूट",
    points: "गुण",
    bg: "वधू · वर",
    koots: {
      varna: ["वर्ण", "कार्यस्वभाव व अहंभाव"],
      vashya: ["वश्य", "परस्पर आकर्षण व प्रभाव"],
      tara: ["तारा (दिन)", "आरोग्य व भाग्य"],
      yoni: ["योनी", "शारीरिक अनुरूपता"],
      maitri: ["ग्रहमैत्री", "मनाची जुळवणूक, मैत्री"],
      gana: ["गण", "स्वभाव"],
      bhakoot: ["भकूट (रास)", "कुटुंबाचे सुख व समृद्धी"],
      nadi: ["नाडी", "आरोग्य व संतती"],
    } as Record<KootKey, [string, string]>,
    varna: ["ब्राह्मण", "क्षत्रिय", "वैश्य", "शूद्र"],
    vashya: ["चतुष्पद", "मानव", "जलचर", "वनचर", "कीटक"],
    yoni: ["अश्व", "गज", "मेष", "सर्प", "श्वान", "मार्जार", "मूषक", "गो", "महिष", "व्याघ्र", "मृग", "वानर", "नकुल", "सिंह"],
    gana: ["देव", "मनुष्य", "राक्षस"],
    nadi: ["आद्य", "मध्य", "अंत्य"],
    tara: ["जन्म", "संपत", "विपत", "क्षेम", "प्रत्यरी", "साधक", "वध", "मित्र", "अतिमित्र"],
    doshas: "दोष",
    noDosha: "या जुळणीत नाडी, भकूट किंवा गण दोष नाही.",
    nadiDosha: (n: string) => `नाडी दोष: दोघांची नाडी ${n} आहे, म्हणून नाडीचे 8 पैकी 0 गुण. परंपरेत आरोग्य व संततीच्या दृष्टीने हा दोष गंभीर मानला जातो.`,
    bhakootDosha: (k: string) => `भकूट दोष (${k}): दोन्ही राशी एकमेकांपासून ${k} स्थानी आहेत, म्हणून भकूटचे 7 पैकी 0 गुण.`,
    ganaDosha: "गण दोष: एकाचा गण राक्षस आहे आणि दुसऱ्याचा नाही; परंपरेत हे स्वभाव न जुळण्याचे लक्षण मानले जाते.",
    exc: {
      sameRashiDiffNak: "रास एक पण नक्षत्र वेगळे: अनेक पंचांगांत अशा वेळी नाडी दोष मानला जात नाही.",
      sameNakDiffRashi: "नक्षत्र एक पण रास वेगळी: हा नाडी दोषाचा परिहार म्हणून सांगितला जातो.",
      sameNakDiffCharan: "नक्षत्र व रास एक, पण चरण वेगळे: काही परंपरांत दोष सौम्य मानला जातो.",
      sameLord: (p: string) => `दोन्ही राशींचा स्वामी ${p} आहे: हा भकूट दोषाचा प्रचलित परिहार मानला जातो.`,
      friendlyLords: (a: string, b: string) => `राशिस्वामी ${a} व ${b} परस्पर मित्र आहेत: अनेक ज्योतिषी अशा वेळी दोष रद्द किंवा कमी मानतात.`,
      ganaLords: "राशिस्वामी एकच आहेत किंवा मित्र आहेत: यामुळे गण दोष कमी होतो असे मानले जाते.",
    },
    excNote: "हे परिहार फक्त माहितीसाठी आहेत. वरचा स्कोअर बदललेला नाही; ते लागू होतात का, हे आपल्या ज्योतिषांना विचारा.",
    note: "गुण मिलन फक्त चंद्राचे नक्षत्र व रास यांची तुलना करते. घरचे ज्योतिषी सल्ला देण्यापूर्वी संपूर्ण कुंडली (मंगळ दोष, सप्तम स्थान, दशा) पाहतात. हा स्कोअर पहिला अंदाज म्हणून पाहा आणि आपल्या ज्योतिषी किंवा गुरुजींकडून खात्री करून घ्या.",
    method: "तक्ते उत्तर भारतातील सर्वाधिक प्रचलित अष्टकूट पद्धतीनुसार आहेत. वश्य, गण व तारा यांबाबत पंचांगांत थोडा फरक असतो, त्यामुळे दुसऱ्या कॅल्क्युलेटरमध्ये एक-दोन गुणांचा फरक दिसू शकतो.",
    unsure: "नक्षत्र माहीत नाही?",
    finder: "जन्मतारखेवरून रास व नक्षत्र शोधा",
  },
};

const selectCls =
  "w-full min-w-0 rounded-lg border border-line bg-ivory/60 px-3 py-2.5 text-base text-ink outline-none transition focus:border-gold focus:bg-paper disabled:opacity-60";

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function isInput(v: unknown): v is Input {
  const o = v as Input;
  return !!o && typeof o.nak === "number" && o.nak >= -1 && o.nak < 27 && typeof o.rashi === "number" && (o.charan === null || [1, 2, 3, 4].includes(o.charan));
}

/** Keeps charan and rashi consistent with the nakshatra. */
function fix(p: Input): Input {
  if (p.nak < 0) return EMPTY;
  if (p.charan) return { ...p, rashi: rashiOf(p.nak, p.charan) };
  const opts = rashiOptions(p.nak);
  return { ...p, rashi: opts.includes(p.rashi) ? p.rashi : opts[0] };
}

function readDraft(lang: Lang): Biodata | null {
  const order: Lang[] = [lang, ...(["en", "hi", "mr"] as Lang[]).filter((l) => l !== lang)];
  for (const l of order) {
    try {
      const raw = localStorage.getItem(`biodatasathi:draft:${l}`);
      if (!raw) continue;
      const b = JSON.parse(raw) as Biodata;
      if (b && Array.isArray(b.sections) && personFromBiodata(b)) return b;
    } catch {
      /* ignore unreadable drafts */
    }
  }
  return null;
}

export default function GunaMilan({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [bride, setBride] = useState<Input>(EMPTY);
  const [groom, setGroom] = useState<Input>(EMPTY);
  const [shown, setShown] = useState(false);
  const [need, setNeed] = useState(false);
  const [fillMsg, setFillMsg] = useState<{ side: Side; ok: boolean } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || "null") as Saved | null;
      if (s && isInput(s.bride) && isInput(s.groom)) {
        /* eslint-disable react-hooks/set-state-in-effect -- restore the last inputs from localStorage after mount */
        setBride(fix(s.bride));
        setGroom(fix(s.groom));
        setShown(!!s.shown && s.bride.nak >= 0 && s.groom.nak >= 0);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ bride, groom, shown } satisfies Saved));
    } catch {
      /* storage full or blocked */
    }
  }, [bride, groom, shown, loaded]);

  const ready = bride.nak >= 0 && groom.nak >= 0;
  const result: MatchResult | null = shown && ready ? matchGuna(bride, groom) : null;

  function update(side: Side, p: Input) {
    (side === "bride" ? setBride : setGroom)(fix(p));
    setFillMsg(null);
    setNeed(false);
  }

  function fillFromDraft(side: Side) {
    const b = readDraft(lang);
    const found = b ? personFromBiodata(b) : null;
    if (found) {
      (side === "bride" ? setBride : setGroom)(fix(found.person));
      setNeed(false);
    }
    setFillMsg({ side, ok: !!found });
  }

  function onMatch() {
    if (!ready) {
      setNeed(true);
      return;
    }
    setNeed(false);
    setShown(true);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {(["bride", "groom"] as Side[]).map((side) => (
          <PersonCard
            key={side}
            lang={lang}
            side={side}
            value={side === "bride" ? bride : groom}
            onChange={(p) => update(side, p)}
            onFill={() => fillFromDraft(side)}
            fillMsg={fillMsg?.side === side ? fillMsg.ok : null}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={onMatch} className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark">
          {t.match}
        </button>
        <p className="text-sm text-soft">
          {t.unsure}{" "}
          <a href={topicPath("birthChart", lang)} className="font-semibold text-maroon underline underline-offset-2">
            {t.finder}
          </a>
        </p>
      </div>

      <div aria-live="polite">
        {need && <p className="rounded-lg border border-gold/50 bg-paper px-3 py-2 text-sm text-maroon">{t.need}</p>}
        {result && <Result lang={lang} r={result} />}
      </div>

      <div className="rounded-2xl border border-line bg-paper p-4 text-sm leading-relaxed text-soft sm:p-5">
        <p>{t.note}</p>
        <p className="mt-2">{t.method}</p>
      </div>
    </div>
  );
}

function PersonCard({
  lang,
  side,
  value,
  onChange,
  onFill,
  fillMsg,
}: {
  lang: Lang;
  side: Side;
  value: Input;
  onChange: (p: Input) => void;
  onFill: () => void;
  fillMsg: boolean | null;
}) {
  const t = T[lang];
  const id = useId();
  const naks = FIELDS.nakshatra.suggest![lang];
  const rashis = RASHI[lang];
  const opts = value.nak >= 0 ? rashiOptions(value.nak) : [];
  const hint =
    value.nak < 0 ? "" : value.charan ? t.rashiFromCharan : opts.length === 1 ? t.rashiFixed : t.rashiTwo;

  return (
    <fieldset className="min-w-0 rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <legend className="sr-only">{t.side[side]}</legend>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-xl text-maroon" aria-hidden="true">
          {t.side[side]}
        </p>
        <button type="button" onClick={onFill} aria-label={`${t.fill}: ${t.side[side]}`} className="rounded-full border border-line bg-ivory px-3 py-1.5 text-xs font-semibold text-ink hover:border-gold">
          {t.fill}
        </button>
      </div>
      {fillMsg !== null && (
        <p className={`mb-3 text-sm ${fillMsg ? "text-leaf" : "text-maroon"}`} role="status">
          {fillMsg ? (
            t.filled
          ) : (
            <>
              {t.noDraft}{" "}
              <a href={href(lang, "/create")} className="font-semibold underline underline-offset-2">
                {t.openEditor}
              </a>
            </>
          )}
        </p>
      )}
      <div className="grid gap-3">
        <label className="block" htmlFor={`${id}-nak`}>
          <span className="mb-1 block text-sm font-semibold text-ink">{t.nakshatra}</span>
          <select
            id={`${id}-nak`}
            value={value.nak}
            onChange={(e) => onChange({ ...value, nak: Number(e.target.value) })}
            className={selectCls}
          >
            <option value={-1} disabled>
              {t.pickNak}
            </option>
            {naks.map((n, i) => (
              <option key={n} value={i}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <label className="block min-w-0" htmlFor={`${id}-charan`}>
            <span className="mb-1 block text-sm font-semibold text-ink">{t.charan}</span>
            <select
              id={`${id}-charan`}
              value={value.charan ?? 0}
              disabled={value.nak < 0}
              onChange={(e) => onChange({ ...value, charan: Number(e.target.value) || null })}
              className={selectCls}
            >
              <option value={0}>{t.charanUnknown}</option>
              {[1, 2, 3, 4].map((c) => (
                <option key={c} value={c}>
                  {value.nak >= 0 ? t.charanOpt(c, rashis[rashiOf(value.nak, c)]) : c}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0" htmlFor={`${id}-rashi`}>
            <span className="mb-1 block text-sm font-semibold text-ink">{t.rashi}</span>
            <select
              id={`${id}-rashi`}
              value={value.nak >= 0 ? value.rashi : -1}
              disabled={value.nak < 0 || opts.length < 2}
              onChange={(e) => {
                const r = Number(e.target.value);
                // A charan in the other rashi no longer fits; keep it only if it lies in the chosen rashi.
                const charan = value.charan && charansIn(value.nak, r).includes(value.charan) ? value.charan : null;
                onChange({ ...value, rashi: r, charan });
              }}
              className={selectCls}
              aria-describedby={hint ? `${id}-hint` : undefined}
            >
              {value.nak < 0 && <option value={-1}>{t.pickRashi}</option>}
              {opts.map((r) => (
                <option key={r} value={r}>
                  {rashis[r]}
                </option>
              ))}
            </select>
          </label>
        </div>
        {hint && (
          <p id={`${id}-hint`} className="text-xs text-soft">
            {hint}
          </p>
        )}
      </div>
    </fieldset>
  );
}

function Result({ lang, r }: { lang: Lang; r: MatchResult }) {
  const t = T[lang];
  const rashis = RASHI[lang];
  const planet = (i: number) => PLANETS[lang][i].name;
  const pair = (list: string[], [a, b]: [number, number]) => `${list[a]} · ${list[b]}`;
  const kindLabel = r.bhakoot.replace("-", "/");

  const detail: Record<KootKey, string> = {
    varna: pair(t.varna, r.attrs.varna),
    vashya: pair(t.vashya, r.attrs.vashya),
    tara: `${t.tara[r.tara.fromBride - 1]} · ${t.tara[r.tara.fromGroom - 1]}`,
    yoni: pair(t.yoni, r.attrs.yoni),
    maitri: `${planet(r.attrs.lord[0])} · ${planet(r.attrs.lord[1])}`,
    gana: pair(t.gana, r.attrs.gana),
    bhakoot: `${rashis[r.bride.rashi]} · ${rashis[r.groom.rashi]} (${kindLabel})`,
    nadi: pair(t.nadi, r.attrs.nadi),
  };

  const bandColor = r.band === "low" ? "text-maroon" : r.band === "average" ? "text-ink" : "text-leaf";
  const anyDosha = r.doshas.nadi || r.doshas.bhakoot || r.doshas.gana;
  const anyExc = r.exceptions.nadi.length + r.exceptions.bhakoot.length + r.exceptions.gana.length > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gold/60 bg-sand/60 p-4 text-center sm:p-5">
        <p className="text-sm text-soft">{t.total}</p>
        <p className="font-display text-5xl leading-tight text-maroon sm:text-6xl">
          {fmt(r.total)} <span className="text-2xl text-soft sm:text-3xl">/ 36</span>
        </p>
        <p className={`mt-1 text-lg font-semibold ${bandColor}`}>{t.band[r.band]}</p>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink">{t.bandText[r.band]}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">{`${t.total}: ${fmt(r.total)} / 36`}</caption>
          <thead className="bg-sand/70 text-xs uppercase tracking-wide text-soft">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold sm:px-4">
                {t.koot} <span className="font-normal normal-case">({t.bg})</span>
              </th>
              <th scope="col" className="w-28 px-3 py-2 text-right font-semibold sm:w-40 sm:px-4">
                {t.points}
              </th>
            </tr>
          </thead>
          <tbody>
            {r.koots.map((k) => {
              const [name, meaning] = t.koots[k.key];
              const pct = (k.score / k.max) * 100;
              const bar = pct >= 99.9 ? "bg-leaf" : pct > 0 ? "bg-gold" : "bg-maroon";
              return (
                <tr key={k.key} className="border-t border-line align-top">
                  <th scope="row" className="px-3 py-2.5 font-normal sm:px-4">
                    <span className="block font-semibold text-ink">
                      {name} <span className="font-normal text-soft">· {meaning}</span>
                    </span>
                    <span className="mt-0.5 block break-words text-xs text-soft">{detail[k.key]}</span>
                  </th>
                  <td className="px-3 py-2.5 text-right sm:px-4">
                    <span className="font-semibold text-ink">
                      {fmt(k.score)} / {k.max}
                    </span>
                    <span className="mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-sand" aria-hidden="true">
                      <span className={`block h-full rounded-full ${bar}`} style={{ width: `${Math.max(pct, 4)}%` }} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <h3 className="font-display text-lg text-maroon">{t.doshas}</h3>
        {!anyDosha && <p className="mt-2 text-sm text-leaf">{t.noDosha}</p>}
        <ul className="mt-2 space-y-3 text-sm text-ink">
          {r.doshas.nadi && (
            <li className="rounded-lg border-l-4 border-maroon bg-ivory px-3 py-2">
              <p>{t.nadiDosha(t.nadi[r.attrs.nadi[0]])}</p>
              {r.exceptions.nadi.map((e) => (
                <p key={e} className="mt-1 text-soft">
                  {t.exc[e]}
                </p>
              ))}
            </li>
          )}
          {r.doshas.bhakoot && (
            <li className="rounded-lg border-l-4 border-maroon bg-ivory px-3 py-2">
              <p>{t.bhakootDosha(kindLabel)}</p>
              {r.exceptions.bhakoot.includes("sameLord") && <p className="mt-1 text-soft">{t.exc.sameLord(planet(r.attrs.lord[0]))}</p>}
              {r.exceptions.bhakoot.includes("friendlyLords") && (
                <p className="mt-1 text-soft">{t.exc.friendlyLords(planet(r.attrs.lord[0]), planet(r.attrs.lord[1]))}</p>
              )}
            </li>
          )}
          {r.doshas.gana && (
            <li className="rounded-lg border-l-4 border-gold bg-ivory px-3 py-2">
              <p>{t.ganaDosha}</p>
              {r.exceptions.gana.length > 0 && <p className="mt-1 text-soft">{t.exc.ganaLords}</p>}
            </li>
          )}
        </ul>
        {anyExc && <p className="mt-3 text-xs text-soft">{t.excNote}</p>}
      </div>
    </div>
  );
}
