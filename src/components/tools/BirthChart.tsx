"use client";

import { IconCheck } from "../editor/Icons";
import Link from "next/link";
import { useId, useMemo, useState, type FormEvent } from "react";
import { KundaliChart } from "@/components/biodata/KundaliChart";
import { createBiodata, FIELDS, PLANETS, RASHI, type Biodata, type Kundali } from "@/lib/biodata";
import { href, type Lang } from "@/lib/i18n";
import {
  birthInstant,
  computeChart,
  degInSign,
  formatDms,
  housesFor,
  mergeIntoBiodata,
  moonChanges,
  type BirthInput,
  type DraftKey,
  type MergeReport,
} from "@/lib/tools/birth-chart";
import { CITIES, CITY_GROUPS, type City } from "@/lib/tools/cities";

const STORAGE = (lang: Lang) => `biodatasathi:draft:${lang}`;
const OTHER = "__other";
const IST = 330;
const WAR_TIME = 390; // India, 1 Sep 1942 – 15 Oct 1945: clocks ran 1 h ahead of IST.

const WESTERN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
};

const T = {
  en: {
    dob: "Date of birth",
    time: "Time of birth",
    hour: "Hour",
    minute: "Minute",
    unknown: "I don't know the birth time",
    place: "Place of birth",
    choose: "Choose a city",
    other: "Other place (enter latitude / longitude)",
    placeHint: "Not in the list? Pick the nearest city: 50 km away shifts the lagna by only about 2 minutes.",
    lat: "Latitude (° N, south is negative)",
    lon: "Longitude (° E, west is negative)",
    tz: "Time zone",
    change: "Change",
    done: "Done",
    tzHint: "Use the UTC offset that was in force on the birth date.",
    dst: "Summer time (DST) was on at the birth (+1 hour)",
    dstHint: "This country moves clocks 1 hour ahead in summer. Tick this for a summer birth; check the exact change dates if you are unsure.",
    warTime: "Between 1 Sep 1942 and 15 Oct 1945, Indian clocks ran 1 hour ahead (war time, UTC+6:30), so we have applied it. If the recorded time was already converted to IST, change the time zone to UTC+5:30.",
    oldIndia: "Before 1955 some records in Mumbai, and before 1948 in Kolkata, used local city time instead of IST. If the time came from such a record, confirm with your family astrologer.",
    submit: "Find rashi & nakshatra",
    errDate: "Please enter a date of birth between 1900 and 2100.",
    errCity: "Please choose the place of birth.",
    errCoords: "Please enter a valid latitude (−90 to 90) and longitude (−180 to 180).",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
    result: "Your result",
    rashi: "Rashi (Moon sign)",
    nakshatra: "Nakshatra",
    charan: "Charan (pada)",
    gan: "Gan",
    nadi: "Nadi",
    lagna: "Lagna (ascendant)",
    sun: "Sun sign (Vedic)",
    western: "Western zodiac sign",
    noTimeTitle: "Birth time not known",
    noTime: "We used 12:00 noon. The rashi is usually right (the Moon stays about 2¼ days in one rashi), but the nakshatra (about one day) and charan (about 6 hours) may be off. Lagna and the kundali chart need the birth time.",
    change_: (what: string, a: string, b: string, at: string) => `On this date the Moon moved from ${a} to ${b} ${what === "rashi" ? "rashi" : "nakshatra"} at ${at}. Born before that: ${a}; after it: ${b}.`,
    chart: "Birth chart (North Indian style)",
    chartNote: "The top diamond is house 1 (lagna). Small numbers are rashi numbers (1 = Mesh).",
    planets: "Planet positions (sidereal)",
    planet: "Planet",
    degree: "Degree",
    house: "House",
    method: (ayan: string, utc: string) =>
      `Method: Lahiri (Chitrapaksha) ayanamsa ${ayan}, geocentric positions, mean Rahu/Ketu, whole-sign houses. Moment used: ${utc} UTC. Calculated in your browser. Please confirm with your panchang or family astrologer before any important decision.`,
    useTitle: "Use in my biodata",
    useDesc: "Fills rashi, nakshatra, charan, gan and nadi (and the kundali chart when the birth time is known) in the biodata saved on this device. Birth date, time and place are filled only if blank.",
    overwrite: "Overwrite values that are already filled",
    use: "Use in my biodata",
    updated: "Filled:",
    kept: "Kept your existing:",
    keptHint: "Tick “Overwrite” above to replace them.",
    missing: "Not in your biodata (add the field in the editor):",
    nothing: "Your biodata already has these details.",
    kundali: "Kundali chart",
    open: "Open the biodata editor →",
    saveErr: "Could not save on this device (storage is blocked or full).",
  },
  hi: {
    dob: "जन्म तिथि",
    time: "जन्म समय",
    hour: "घंटा",
    minute: "मिनट",
    unknown: "जन्म समय पता नहीं है",
    place: "जन्म स्थान",
    choose: "शहर चुनें",
    other: "अन्य स्थान (अक्षांश / देशांतर डालें)",
    placeHint: "सूची में नहीं है? सबसे पास का शहर चुनें: 50 किमी दूरी से लग्न का समय केवल लगभग 2 मिनट खिसकता है।",
    lat: "अक्षांश (° उत्तर, दक्षिण के लिए ऋण)",
    lon: "देशांतर (° पूर्व, पश्चिम के लिए ऋण)",
    tz: "समय क्षेत्र (टाइम ज़ोन)",
    change: "बदलें",
    done: "ठीक है",
    tzHint: "जन्म की तारीख़ पर जो UTC अंतर लागू था, वही चुनें।",
    dst: "जन्म के समय समर टाइम (DST) लागू था (+1 घंटा)",
    dstHint: "इस देश में गर्मियों में घड़ी 1 घंटा आगे की जाती है। जन्म गर्मियों में हुआ हो तो इसे चुनें; पक्का न हो तो उस साल की तारीख़ें देख लें।",
    warTime: "1 सितंबर 1942 से 15 अक्टूबर 1945 तक भारत में घड़ियाँ 1 घंटा आगे थीं (युद्धकालीन समय, UTC+6:30), इसलिए हमने यही लिया है। अगर दर्ज समय पहले से IST में बदला हुआ है, तो टाइम ज़ोन UTC+5:30 कर दें।",
    oldIndia: "1955 से पहले मुंबई में और 1948 से पहले कोलकाता में कुछ रिकॉर्ड IST की जगह स्थानीय शहर का समय लिखते थे। ऐसा हो तो अपने पारिवारिक ज्योतिषी से पुष्टि करें।",
    submit: "राशि और नक्षत्र जानें",
    errDate: "कृपया 1900 से 2100 के बीच की जन्म तिथि डालें।",
    errCity: "कृपया जन्म स्थान चुनें।",
    errCoords: "कृपया सही अक्षांश (−90 से 90) और देशांतर (−180 से 180) डालें।",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात",
    result: "आपका परिणाम",
    rashi: "राशि (चंद्र राशि)",
    nakshatra: "नक्षत्र",
    charan: "चरण",
    gan: "गण",
    nadi: "नाड़ी",
    lagna: "लग्न",
    sun: "सूर्य राशि (वैदिक)",
    western: "पश्चिमी (अंग्रेज़ी) राशि",
    noTimeTitle: "जन्म समय पता नहीं",
    noTime: "हमने दोपहर 12:00 बजे का समय लिया है। राशि आमतौर पर सही रहती है (चंद्रमा एक राशि में लगभग सवा दो दिन रहता है), पर नक्षत्र (लगभग एक दिन) और चरण (लगभग 6 घंटे) बदल सकते हैं। लग्न और कुंडली के लिए जन्म समय ज़रूरी है।",
    change_: (what: string, a: string, b: string, at: string) => `इस दिन ${at} पर चंद्रमा ${a} से ${b} ${what === "rashi" ? "राशि" : "नक्षत्र"} में गया। इससे पहले जन्म हो तो ${a}, बाद में हो तो ${b}।`,
    chart: "जन्म कुंडली (उत्तर भारतीय शैली)",
    chartNote: "ऊपर का बीच वाला खाना पहला भाव (लग्न) है। छोटे अंक राशि संख्या हैं (1 = मेष)।",
    planets: "ग्रह स्थिति (निरयन)",
    planet: "ग्रह",
    degree: "अंश",
    house: "भाव",
    method: (ayan: string, utc: string) =>
      `विधि: लाहिड़ी (चित्रपक्ष) अयनांश ${ayan}, भूकेंद्रीय ग्रह स्थिति, मध्यम राहु/केतु, राशि = भाव। गणना का क्षण: ${utc} UTC। गणना आपके ब्राउज़र में होती है। किसी भी महत्वपूर्ण निर्णय से पहले अपने पंचांग या पारिवारिक ज्योतिषी से पुष्टि ज़रूर करें।`,
    useTitle: "मेरे बायोडाटा में भरें",
    useDesc: "इस डिवाइस पर सेव बायोडाटा में राशि, नक्षत्र, चरण, गण और नाड़ी भर देगा (जन्म समय पता हो तो कुंडली चार्ट भी)। जन्म तिथि, समय और स्थान केवल खाली हों तभी भरे जाएँगे।",
    overwrite: "पहले से भरी जानकारी बदल दें",
    use: "मेरे बायोडाटा में भरें",
    updated: "भरा गया:",
    kept: "आपकी पहले से भरी जानकारी रखी गई:",
    keptHint: "बदलने के लिए ऊपर “पहले से भरी जानकारी बदल दें” चुनें।",
    missing: "आपके बायोडाटा में ये फ़ील्ड नहीं हैं (एडिटर में जोड़ें):",
    nothing: "आपके बायोडाटा में यह जानकारी पहले से है।",
    kundali: "कुंडली चार्ट",
    open: "बायोडाटा एडिटर खोलें →",
    saveErr: "इस डिवाइस पर सेव नहीं हो सका (स्टोरेज बंद या भरा हुआ है)।",
  },
  mr: {
    dob: "जन्म तारीख",
    time: "जन्म वेळ",
    hour: "तास",
    minute: "मिनिट",
    unknown: "जन्म वेळ माहीत नाही",
    place: "जन्म ठिकाण",
    choose: "शहर निवडा",
    other: "इतर ठिकाण (अक्षांश / रेखांश भरा)",
    placeHint: "यादीत नाही? जवळचे शहर निवडा: 50 किमी अंतरामुळे लग्नाची वेळ फक्त सुमारे 2 मिनिटांनी सरकते.",
    lat: "अक्षांश (° उत्तर, दक्षिणेसाठी ऋण)",
    lon: "रेखांश (° पूर्व, पश्चिमेसाठी ऋण)",
    tz: "वेळ क्षेत्र (टाइम झोन)",
    change: "बदला",
    done: "ठीक आहे",
    tzHint: "जन्मतारखेला जो UTC फरक लागू होता, तोच निवडा.",
    dst: "जन्माच्या वेळी समर टाइम (DST) लागू होता (+1 तास)",
    dstHint: "या देशात उन्हाळ्यात घड्याळ 1 तास पुढे केले जाते. जन्म उन्हाळ्यात झाला असेल तर हे निवडा; खात्री नसेल तर त्या वर्षीच्या तारखा तपासा.",
    warTime: "1 सप्टेंबर 1942 ते 15 ऑक्टोबर 1945 या काळात भारतातील घड्याळे 1 तास पुढे होती (युद्धकालीन वेळ, UTC+6:30), म्हणून आम्ही तीच धरली आहे. नोंदवलेली वेळ आधीच IST मध्ये बदललेली असेल, तर टाइम झोन UTC+5:30 करा.",
    oldIndia: "1955 पूर्वी मुंबईत आणि 1948 पूर्वी कोलकात्यात काही नोंदी IST ऐवजी स्थानिक शहराची वेळ वापरत. तसे असल्यास आपल्या कौटुंबिक ज्योतिषांकडून खात्री करून घ्या.",
    submit: "रास व नक्षत्र शोधा",
    errDate: "कृपया 1900 ते 2100 मधील जन्म तारीख भरा.",
    errCity: "कृपया जन्म ठिकाण निवडा.",
    errCoords: "कृपया योग्य अक्षांश (−90 ते 90) आणि रेखांश (−180 ते 180) भरा.",
    morning: "सकाळी",
    afternoon: "दुपारी",
    evening: "सायंकाळी",
    night: "रात्री",
    result: "तुमचा निकाल",
    rashi: "रास (चंद्र रास)",
    nakshatra: "नक्षत्र",
    charan: "चरण",
    gan: "गण",
    nadi: "नाडी",
    lagna: "लग्न",
    sun: "सूर्य रास (वैदिक)",
    western: "पाश्चात्त्य (इंग्रजी) रास",
    noTimeTitle: "जन्म वेळ माहीत नाही",
    noTime: "आम्ही दुपारी 12:00 ही वेळ धरली आहे. रास बहुतेक बरोबर येते (चंद्र एका राशीत सुमारे सव्वा दोन दिवस असतो), पण नक्षत्र (सुमारे एक दिवस) आणि चरण (सुमारे 6 तास) चुकू शकतात. लग्न आणि कुंडलीसाठी जन्म वेळ आवश्यक आहे.",
    change_: (what: string, a: string, b: string, at: string) => `या दिवशी ${at} वाजता चंद्र ${a} मधून ${b} ${what === "rashi" ? "राशीत" : "नक्षत्रात"} गेला. त्याआधी जन्म असेल तर ${a}, नंतर असेल तर ${b}.`,
    chart: "जन्म कुंडली (उत्तर भारतीय पद्धत)",
    chartNote: "वरचे मधले घर हे पहिले स्थान (लग्न) आहे. लहान अंक हे राशी क्रमांक आहेत (1 = मेष).",
    planets: "ग्रहस्थिती (निरयन)",
    planet: "ग्रह",
    degree: "अंश",
    house: "स्थान",
    method: (ayan: string, utc: string) =>
      `पद्धत: लाहिरी (चित्रपक्ष) अयनांश ${ayan}, भूकेंद्रीय ग्रहस्थिती, मध्यम राहू/केतू, रास = स्थान. गणनेचा क्षण: ${utc} UTC. गणना तुमच्या ब्राउझरमध्येच होते. कोणताही महत्त्वाचा निर्णय घेण्यापूर्वी आपले पंचांग किंवा कौटुंबिक ज्योतिषी यांच्याकडून खात्री करून घ्या.`,
    useTitle: "माझ्या बायोडाटामध्ये भरा",
    useDesc: "या डिव्हाइसवर जतन केलेल्या बायोडाटामध्ये रास, नक्षत्र, चरण, गण आणि नाडी भरली जाईल (जन्म वेळ माहीत असल्यास कुंडलीसुद्धा). जन्म तारीख, वेळ व ठिकाण फक्त रिकामे असल्यासच भरले जातील.",
    overwrite: "आधी भरलेली माहिती बदला",
    use: "माझ्या बायोडाटामध्ये भरा",
    updated: "भरले:",
    kept: "तुमची आधीची माहिती तशीच ठेवली:",
    keptHint: "बदलायची असल्यास वर “आधी भरलेली माहिती बदला” निवडा.",
    missing: "तुमच्या बायोडाटामध्ये ही फील्ड नाहीत (एडिटरमध्ये जोडा):",
    nothing: "तुमच्या बायोडाटामध्ये ही माहिती आधीच आहे.",
    kundali: "कुंडली",
    open: "बायोडाटा एडिटर उघडा →",
    saveErr: "या डिव्हाइसवर जतन करता आले नाही (स्टोरेज बंद किंवा भरलेले आहे).",
  },
};

type Form = {
  date: string; // yyyy-mm-dd
  hour12: number; // 1–12
  minute: number;
  pm: boolean;
  timeKnown: boolean;
  cityId: string;
  lat: string;
  lon: string;
  tzOverride: number | null;
  dst: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");
const OFFSETS = Array.from({ length: (840 + 720) / 15 + 1 }, (_, i) => -720 + i * 15);
const fmtOffset = (m: number) => `UTC${m < 0 ? "−" : "+"}${Math.floor(Math.abs(m) / 60)}:${pad(Math.abs(m) % 60)}`;

function parseDate(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (y < 1900 || y > 2100) return null;
  return { y, mo, d };
}

const isWarTime = (y: number, mo: number, d: number) => {
  const v = y * 10000 + mo * 100 + d;
  return v >= 19420901 && v <= 19451015;
};

/** 24-hour clock → "6:45 AM" / "सुबह 6:45" / "सकाळी 6:45". */
function clock(h24: number, min: number, lang: Lang) {
  const h12 = h24 % 12 || 12;
  const t = T[lang];
  if (lang === "en") return `${h12}:${pad(min)} ${h24 < 12 ? "AM" : "PM"}`;
  const part = h24 >= 4 && h24 < 12 ? t.morning : h24 >= 12 && h24 < 16 ? t.afternoon : h24 >= 16 && h24 < 20 ? t.evening : t.night;
  return `${part} ${h12}:${pad(min)}`;
}

function clockWords(h24: number, min: number, lang: Lang) {
  if (lang !== "en") return clock(h24, min, lang);
  const t = T.en;
  const part = h24 >= 4 && h24 < 12 ? t.morning : h24 >= 12 && h24 < 16 ? t.afternoon : h24 >= 16 && h24 < 20 ? t.evening : t.night;
  return `${clock(h24, min, lang)} (${part})`;
}

export default function BirthChart({ lang }: { lang: Lang }) {
  const t = T[lang];
  const uid = useId();
  const [form, setForm] = useState<Form>({ date: "", hour12: 6, minute: 0, pm: false, timeKnown: true, cityId: "", lat: "", lon: "", tzOverride: null, dst: false });
  const [editTz, setEditTz] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState<(BirthInput & { city: City | null }) | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [saved, setSaved] = useState<MergeReport | "error" | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const city = CITIES.find((c) => c.id === form.cityId) ?? null;
  const date = parseDate(form.date);
  const h24 = (form.hour12 % 12) + (form.pm ? 12 : 0);
  const autoOffset = !city ? IST : city.group !== "abroad" && date && isWarTime(date.y, date.mo, date.d) ? WAR_TIME : city.tz + (city.dst && form.dst ? 60 : 0);
  const offset = form.tzOverride ?? autoOffset;
  const showWarNote = !!date && isWarTime(date.y, date.mo, date.d) && (form.cityId === OTHER || city?.group !== "abroad");
  const showOldNote = !!date && date.y < 1955 && !showWarNote && (form.cityId === OTHER || city?.group !== "abroad");

  const chart = useMemo(() => (input ? computeChart(input) : null), [input]);

  // With an unknown birth time, find whether the Moon changed nakshatra / rashi during that local day.
  const dayChanges = useMemo(() => {
    if (!input || input.timeKnown) return [];
    const from = birthInstant({ ...input, hour: 0, minute: 0 });
    const to = new Date(from.getTime() + 86400_000);
    return [...moonChanges(from, to, "rashi").map((c) => ({ ...c, what: "rashi" as const })), ...moonChanges(from, to, "nakshatra").map((c) => ({ ...c, what: "nakshatra" as const }))];
  }, [input]);

  const nakNames = FIELDS.nakshatra.suggest![lang];
  const ganNames = FIELDS.gan.suggest![lang];
  const nadiNames = FIELDS.nadi.suggest![lang];
  const rashiNames = RASHI[lang];

  const kundali: Kundali | null = useMemo(() => {
    if (!chart?.lagna) return null;
    return { show: true, mode: "chart", lagna: chart.lagna.rashi + 1, houses: housesFor(chart, PLANETS[lang].map((p) => p.abbr)) };
  }, [chart, lang]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setSaved(null);
    if (!date) return setError(t.errDate);
    let lat: number, lon: number;
    if (form.cityId === OTHER) {
      lat = Number(form.lat);
      lon = Number(form.lon);
      if (!form.lat.trim() || !form.lon.trim() || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return setError(t.errCoords);
    } else if (city) {
      lat = city.lat;
      lon = city.lon;
    } else return setError(t.errCity);
    setError("");
    setInput({ year: date.y, month: date.mo, day: date.d, hour: h24, minute: form.minute, utcOffset: offset, lat, lon, timeKnown: form.timeKnown, city });
  }

  function applyToBiodata() {
    if (!chart || !input) return;
    try {
      const raw = localStorage.getItem(STORAGE(lang));
      let b: Biodata | null = null;
      try {
        const parsed = raw ? (JSON.parse(raw) as Biodata) : null;
        b = parsed?.version === 1 ? parsed : null;
      } catch {
        b = null;
      }
      const bio = b ?? createBiodata(lang);
      const values: Partial<Record<DraftKey, string>> = {
        rashi: rashiNames[chart.moon.rashi],
        nakshatra: nakNames[chart.moon.nakshatra],
        charan: String(chart.moon.charan),
        gan: ganNames[chart.moon.gan],
        nadi: nadiNames[chart.moon.nadi],
        dob: `${input.day} ${MONTHS[lang][input.month - 1]} ${input.year}`,
        birthTime: input.timeKnown ? clock(input.hour, input.minute, lang) : undefined,
        birthPlace: input.city ? input.city[lang] : undefined,
      };
      const report = mergeIntoBiodata(bio, values, kundali, overwrite);
      localStorage.setItem(STORAGE(lang), JSON.stringify(bio));
      setSaved(report);
    } catch {
      setSaved("error");
    }
  }

  const fieldLabel = (k: string) => (k === "kundali" ? t.kundali : (FIELDS[k]?.label[lang] ?? k));
  const inputCls = "block w-full min-w-0 rounded-xl border border-line bg-ivory/60 px-3 py-2.5 text-[15px] text-ink outline-none focus:border-gold focus:bg-paper";
  const labelCls = "mb-1.5 block text-sm font-semibold text-ink";
  const selectCls = "rounded-xl border border-line bg-ivory/60 px-3 py-2.5 text-[15px] text-ink outline-none focus:border-gold focus:bg-paper disabled:opacity-50";
  const offsetUtc = input ? new Date(chart!.instant).toISOString().slice(0, 16).replace("T", " ") : "";

  return (
    <div className="space-y-4">
      <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-date`} className={labelCls}>
              {t.dob}
            </label>
            <input id={`${uid}-date`} type="date" min="1900-01-01" max="2100-12-31" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
          </div>

          <fieldset className="min-w-0">
            <legend className={labelCls}>{t.time}</legend>
            <div className="flex flex-wrap items-center gap-2">
              <select aria-label={t.hour} disabled={!form.timeKnown} value={form.hour12} onChange={(e) => set("hour12", Number(e.target.value))} className={selectCls}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <span aria-hidden className="text-soft">
                :
              </span>
              <select aria-label={t.minute} disabled={!form.timeKnown} value={form.minute} onChange={(e) => set("minute", Number(e.target.value))} className={selectCls}>
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {pad(m)}
                  </option>
                ))}
              </select>
              <div role="radiogroup" aria-label="AM / PM" className="inline-flex rounded-full border border-line bg-ivory p-0.5">
                {[false, true].map((pm) => (
                  <button
                    key={String(pm)}
                    type="button"
                    role="radio"
                    aria-checked={form.pm === pm}
                    disabled={!form.timeKnown}
                    onClick={() => set("pm", pm)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold disabled:opacity-50 ${form.pm === pm ? "bg-maroon text-white" : "text-soft hover:text-ink"}`}
                  >
                    {pm ? "PM" : "AM"}
                  </button>
                ))}
              </div>
            </div>
            {form.timeKnown && <p className="mt-1.5 text-sm text-soft">= {clockWords(h24, form.minute, lang)}</p>}
            <label className="mt-2 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!form.timeKnown} onChange={(e) => set("timeKnown", !e.target.checked)} className="h-4 w-4 accent-maroon" />
              {t.unknown}
            </label>
          </fieldset>

          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-city`} className={labelCls}>
              {t.place}
            </label>
            <select
              id={`${uid}-city`}
              value={form.cityId}
              onChange={(e) => setForm((f) => ({ ...f, cityId: e.target.value, tzOverride: null, dst: false }))}
              className={inputCls}
            >
              <option value="">{t.choose}</option>
              {CITY_GROUPS.map((g) => (
                <optgroup key={g.id} label={g.label[lang]}>
                  {CITIES.filter((c) => c.group === g.id).map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === "en" ? c.en : `${c[lang]} · ${c.en}`}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value={OTHER}>{t.other}</option>
            </select>
            <p className="mt-1.5 text-xs leading-relaxed text-soft">{t.placeHint}</p>

            {form.cityId === OTHER && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-lat`} className="mb-1 block text-sm text-ink">
                    {t.lat}
                  </label>
                  <input id={`${uid}-lat`} inputMode="decimal" placeholder="18.52" value={form.lat} onChange={(e) => set("lat", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor={`${uid}-lon`} className="mb-1 block text-sm text-ink">
                    {t.lon}
                  </label>
                  <input id={`${uid}-lon`} inputMode="decimal" placeholder="73.86" value={form.lon} onChange={(e) => set("lon", e.target.value)} className={inputCls} />
                </div>
              </div>
            )}

            <div className="mt-3 rounded-xl bg-sand/60 px-3 py-2.5 text-sm">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-soft">{t.tz}:</span>
                {editTz ? (
                  <select
                    aria-label={t.tz}
                    value={offset}
                    onChange={(e) => set("tzOverride", Number(e.target.value))}
                    className="rounded-lg border border-line bg-paper px-2 py-1.5 text-sm text-ink"
                  >
                    {OFFSETS.map((m) => (
                      <option key={m} value={m}>
                        {fmtOffset(m)}
                        {m === IST ? " (IST)" : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <strong className="font-semibold text-ink">
                    {fmtOffset(offset)}
                    {offset === IST ? " (IST)" : ""}
                  </strong>
                )}
                <button type="button" onClick={() => setEditTz((v) => !v)} className="font-semibold text-maroon underline-offset-2 hover:underline">
                  {editTz ? t.done : t.change}
                </button>
              </div>
              {editTz && <p className="mt-1.5 text-xs text-soft">{t.tzHint}</p>}
              {city?.dst && form.tzOverride === null && (
                <>
                  <label className="mt-2 flex items-start gap-2 text-ink">
                    <input type="checkbox" checked={form.dst} onChange={(e) => set("dst", e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-maroon" />
                    {t.dst}
                  </label>
                  <p className="mt-1 text-xs leading-relaxed text-soft">{t.dstHint}</p>
                </>
              )}
              {showWarNote && <p className="mt-2 text-xs leading-relaxed text-soft">{t.warTime}</p>}
              {showOldNote && <p className="mt-2 text-xs leading-relaxed text-soft">{t.oldIndia}</p>}
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-maroon">
            {error}
          </p>
        )}
        <button type="submit" className="mt-4 w-full rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark sm:w-auto">
          {t.submit}
        </button>
      </form>

      <div aria-live="polite">
        {chart && input && (
          <div className="space-y-4">
            <section className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
              <h2 className="font-display text-xl text-ink">{t.result}</h2>

              {!input.timeKnown && (
                <div className="mt-3 rounded-xl border border-gold/60 bg-sand/60 p-3 text-sm leading-relaxed text-ink">
                  <p className="font-semibold">{t.noTimeTitle}</p>
                  <p className="mt-1">{t.noTime}</p>
                  {dayChanges.map((c, i) => {
                    const names = c.what === "rashi" ? rashiNames : nakNames;
                    const local = new Date(c.at.getTime() + input.utcOffset * 60000 + 30000); // round to the minute
                    return (
                      <p key={i} className="mt-1 font-semibold text-maroon">
                        {t.change_(c.what, names[c.from], names[c.to], clock(local.getUTCHours(), local.getUTCMinutes(), lang))}
                      </p>
                    );
                  })}
                </div>
              )}

              <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                <Stat label={t.rashi} value={rashiNames[chart.moon.rashi]} strong />
                <Stat label={t.nakshatra} value={nakNames[chart.moon.nakshatra]} strong />
                <Stat label={t.charan} value={String(chart.moon.charan)} />
                <Stat label={t.gan} value={ganNames[chart.moon.gan]} />
                <Stat label={t.nadi} value={nadiNames[chart.moon.nadi]} />
                <Stat label={t.lagna} value={chart.lagna ? rashiNames[chart.lagna.rashi] : "—"} strong={!!chart.lagna} />
                <Stat label={t.sun} value={rashiNames[chart.sunRashi]} />
                <Stat label={t.western} value={lang === "en" ? WESTERN[chart.westernSign] : `${RASHI[lang][chart.westernSign]} (${WESTERN[chart.westernSign]})`} />
              </dl>

              {kundali && (
                <div className="mt-5 flex flex-col items-center">
                  <p className="mb-2 text-sm font-semibold text-ink">{t.chart}</p>
                  <div className="w-full max-w-[280px] text-[15px]">
                    <KundaliChart k={kundali} size={260} color="#8a1c2b" ink="#2a2320" title="" fmt={(s) => s} />
                  </div>
                  <p className="mt-2 max-w-sm text-center text-xs leading-relaxed text-soft">{t.chartNote}</p>
                </div>
              )}

              <details className="mt-4 rounded-xl border border-line bg-ivory/60 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-ink">{t.planets}</summary>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[300px] text-left text-sm">
                    <thead className="text-xs text-soft">
                      <tr>
                        <th className="py-1 pr-2 font-semibold">{t.planet}</th>
                        <th className="py-1 pr-2 font-semibold">{t.rashi.split(" (")[0]}</th>
                        <th className="py-1 pr-2 font-semibold">{t.degree}</th>
                        <th className="py-1 pr-2 font-semibold">{t.nakshatra}</th>
                        {chart.lagna && <th className="py-1 font-semibold">{t.house}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {chart.lagna && (
                        <tr className="border-t border-line">
                          <td className="py-1 pr-2">{t.lagna.split(" (")[0]}</td>
                          <td className="py-1 pr-2">{rashiNames[chart.lagna.rashi]}</td>
                          <td className="py-1 pr-2 tabular-nums">{degInSign(chart.lagna.lon)}</td>
                          <td className="py-1 pr-2" colSpan={2}></td>
                        </tr>
                      )}
                      {chart.planets.map((p, i) => (
                        <tr key={p.key} className="border-t border-line">
                          <td className="py-1 pr-2">{PLANETS[lang][i].name}</td>
                          <td className="py-1 pr-2">{rashiNames[p.rashi]}</td>
                          <td className="py-1 pr-2 tabular-nums">{degInSign(p.lon)}</td>
                          <td className="py-1 pr-2">
                            {nakNames[p.nakshatra]} {p.charan}
                          </td>
                          {chart.lagna && <td className="py-1 tabular-nums">{p.house}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              <p className="mt-4 text-xs leading-relaxed text-soft">{t.method(formatDms(chart.ayanamsa), offsetUtc)}</p>
            </section>

            <section className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
              <h2 className="font-display text-lg text-ink">{t.useTitle}</h2>
              <p className="mt-1 text-sm leading-relaxed text-soft">{t.useDesc}</p>
              <label className="mt-3 flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} className="h-4 w-4 accent-maroon" />
                {t.overwrite}
              </label>
              <button type="button" onClick={applyToBiodata} className="mt-3 w-full rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark sm:w-auto">
                {t.use}
              </button>
              {saved === "error" && (
                <p role="alert" className="mt-3 text-sm font-semibold text-maroon">
                  {t.saveErr}
                </p>
              )}
              {saved && saved !== "error" && (
                <div role="status" className="mt-3 space-y-1 rounded-xl bg-sand/60 p-3 text-sm leading-relaxed text-ink">
                  {saved.updated.length > 0 && (
                    <p>
                      <span className="inline-flex items-center gap-1 font-semibold text-leaf">
                        <IconCheck className="size-3.5" /> {t.updated}
                      </span> {saved.updated.map(fieldLabel).join(", ")}
                    </p>
                  )}
                  {saved.kept.length > 0 && (
                    <p>
                      <span className="font-semibold">{t.kept}</span> {saved.kept.map(fieldLabel).join(", ")}. <span className="text-soft">{t.keptHint}</span>
                    </p>
                  )}
                  {saved.missing.length > 0 && (
                    <p>
                      <span className="font-semibold">{t.missing}</span> {saved.missing.map(fieldLabel).join(", ")}
                    </p>
                  )}
                  {saved.updated.length === 0 && saved.kept.length === 0 && saved.missing.length === 0 && <p>{t.nothing}</p>}
                  <p className="pt-1">
                    <Link href={href(lang, "/create")} className="font-semibold text-maroon underline-offset-2 hover:underline">
                      {t.open}
                    </Link>
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-ivory/60 px-3 py-2.5">
      <dt className="text-xs text-soft">{label}</dt>
      <dd className={`mt-0.5 break-words ${strong ? "font-display text-lg text-maroon" : "text-[15px] font-semibold text-ink"}`}>{value}</dd>
    </div>
  );
}
