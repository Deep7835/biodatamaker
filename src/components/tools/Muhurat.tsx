"use client";

import { IconCheck, IconWarning } from "../editor/Icons";
import { useMemo, useState, useSyncExternalStore } from "react";
import { SITE, toDevanagariDigits, type Lang } from "@/lib/i18n";
import { topicPath } from "@/content/slugs";
import { copyText } from "@/lib/tools/clipboard";
import {
  ACCESSED,
  MAHARASHTRA_CONFIRMED,
  MAHARASHTRA_SOME,
  NORTH_CONFIRMED,
  NORTH_SOME,
  PERIODS,
  RANGE,
  SOURCES,
  type DatasetId,
  type MuhuratDate,
  type MuhuratWindow,
  type Period,
  type PeriodId,
  type SomeDate,
  type SourceId,
} from "@/lib/tools/muhurat-data";

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
};
const MONTHS_SHORT: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  hi: MONTHS.hi,
  mr: MONTHS.mr,
};
const WEEKDAYS: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  mr: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
};

const NAKSHATRA: Record<string, { hi: string; mr: string }> = {
  Anuradha: { hi: "अनुराधा", mr: "अनुराधा" },
  Hasta: { hi: "हस्त", mr: "हस्त" },
  Krittika: { hi: "कृत्तिका", mr: "कृत्तिका" },
  Magha: { hi: "मघा", mr: "मघा" },
  Mrigashira: { hi: "मृगशिरा", mr: "मृगशीर्ष" },
  Mula: { hi: "मूल", mr: "मूळ" },
  "Purva Ashadha": { hi: "पूर्वाषाढ़ा", mr: "पूर्वाषाढा" },
  Revati: { hi: "रेवती", mr: "रेवती" },
  Rohini: { hi: "रोहिणी", mr: "रोहिणी" },
  Swati: { hi: "स्वाति", mr: "स्वाती" },
  "Uttara Ashadha": { hi: "उत्तराषाढ़ा", mr: "उत्तराषाढा" },
  "Uttara Bhadrapada": { hi: "उत्तरा भाद्रपद", mr: "उत्तरा भाद्रपदा" },
  "Uttara Phalguni": { hi: "उत्तरा फाल्गुनी", mr: "उत्तरा फाल्गुनी" },
};
const TITHI: Record<string, { hi: string; mr: string }> = {
  Pratipada: { hi: "प्रतिपदा", mr: "प्रतिपदा" },
  Dwitiya: { hi: "द्वितीया", mr: "द्वितीया" },
  Tritiya: { hi: "तृतीया", mr: "तृतीया" },
  Chaturthi: { hi: "चतुर्थी", mr: "चतुर्थी" },
  Panchami: { hi: "पंचमी", mr: "पंचमी" },
  Shashthi: { hi: "षष्ठी", mr: "षष्ठी" },
  Saptami: { hi: "सप्तमी", mr: "सप्तमी" },
  Ashtami: { hi: "अष्टमी", mr: "अष्टमी" },
  Navami: { hi: "नवमी", mr: "नवमी" },
  Dashami: { hi: "दशमी", mr: "दशमी" },
  Ekadashi: { hi: "एकादशी", mr: "एकादशी" },
  Dwadashi: { hi: "द्वादशी", mr: "द्वादशी" },
  Trayodashi: { hi: "त्रयोदशी", mr: "त्रयोदशी" },
  Chaturdashi: { hi: "चतुर्दशी", mr: "चतुर्दशी" },
  Purnima: { hi: "पूर्णिमा", mr: "पौर्णिमा" },
};

const SOURCE_SHORT: Record<SourceId, string> = {
  drik: "Drik Panchang",
  prokerala: "Prokerala",
  birthastro: "Birthastro",
  shubhpanchang: "Shubh Panchang",
  aajtak: "Aaj Tak",
  ind24: "IND24",
  ganeshaspeaks: "GaneshaSpeaks",
  zee24taas: "Zee 24 Taas",
  news18marathi: "News18 Marathi",
  pudhari: "Pudhari",
  etvbharat: "ETV Bharat",
  drikShukra: "Drik Panchang",
  amarujalaGochar: "Amar Ujala",
  amarujalaRule: "Amar Ujala",
  holika: "Dr. R. P. Sharma",
};

const T = {
  en: {
    tradition: "Panchang tradition",
    north: "North India (Hindi panchangs)",
    maharashtra: "Maharashtra (Marathi panchangs)",
    note: "Dates compiled from published panchangs (sources listed below); confirm the exact muhurat time with your purohit.",
    noteMore: "Muhurat windows shown are Drik Panchang's timings for New Delhi. Your city's timings can differ, and your purohit will also check both horoscopes.",
    digits: "Devanagari digits (१२३)",
    months: "Jump to a month",
    total: (n: number) => `${n} confirmed dates, Nov 2026 – Dec 2027`,
    next: "Next confirmed muhurat",
    noneLeft: "All listed dates have passed. Check back for the next season's list.",
    past: "Past",
    today: "Today",
    nextBadge: "Next",
    window: "Muhurat (New Delhi)",
    agreed: "Listed by",
    nextDay: "next day",
    early: (d: string) => `early hours of ${d}`,
    none: "No wedding muhurat this month.",
    noneWhy: "Why:",
    some: (n: number) => `Also listed by only one panchang (${n}) – not confirmed`,
    someHint: "These dates appear in just one source (or only in Drik Panchang and a site that copies it). Ask your purohit before considering them.",
    caution: "Simhastha Guru",
    cautionHint: "Jupiter is in Leo on the marked dates. Some pandits, especially between the Ganga and the Godavari, avoid weddings then; many panchangs still list them. Ask your purohit.",
    periodsTitle: "When there are no muhurats",
    kindBlock: "No weddings",
    kindCaution: "Some pandits avoid",
    mhTitle: "Marathi panchang dates are not yet confirmed",
    mhBody:
      "We list a date only when at least two published sources agree. For November 2026 onwards we have so far found only one Marathi list, so no Maharashtra date is marked confirmed yet. Marathi panchangs (Date, Kalnirnay, Mahalaxmi) often differ from North Indian lists, so do not assume the all-India dates apply.",
    mhSwitch: "See the North India list",
    mhMonth: "Marathi panchang dates not yet confirmed",
    mhOne: "One Marathi list (Pudhari, Dec 2025) gives:",
    mhOneHint: "The article itself says its list includes dates falling in Guru ast, Shukra ast and Simhastha. Treat these only as a starting point for your purohit.",
    alsoNorth: "also in the North India list",
    inPeriod: "falls in",
    copy: "Copy list",
    share: "Share list",
    copied: "List copied. Paste it in WhatsApp or a note.",
    copyFail: "Couldn't copy. Please try again.",
    listTitle: (d: string) => `Vivah muhurat Nov 2026 – Dec 2027 · ${d}`,
    listNone: "no muhurat",
    listMhNone: "Marathi panchang dates not yet confirmed.",
    before: "Before you fix the date:",
    kundli: "match kundli (gun milan)",
    biodata: "make the biodata",
    sourcesTitle: "Sources",
    sourcesHint: (d: string) => `All pages accessed on ${d}.`,
    method:
      "How we compiled this: a date is confirmed only when Drik Panchang lists it and at least one independently calculated or independently published list agrees. Every nakshatra was re-checked against an ephemeris. Sites that copy Drik's list are shown but not counted.",
  },
  hi: {
    tradition: "पंचांग परंपरा",
    north: "उत्तर भारत (हिंदी पंचांग)",
    maharashtra: "महाराष्ट्र (मराठी पंचांग)",
    note: "तारीखें प्रकाशित पंचांगों से संकलित हैं (स्रोत नीचे दिए हैं); मुहूर्त का सही समय अपने पुरोहित से ज़रूर पक्का करें।",
    noteMore: "दिखाया गया मुहूर्त समय द्रिक पंचांग के अनुसार नई दिल्ली का है। आपके शहर में समय अलग हो सकता है, और पुरोहित वर-वधू की कुंडली भी देखेंगे।",
    digits: "देवनागरी अंक (१२३)",
    months: "महीना चुनें",
    total: (n: number) => `नवंबर 2026 – दिसंबर 2027 में ${n} पक्की तारीखें`,
    next: "अगला पक्का मुहूर्त",
    noneLeft: "सूची की सभी तारीखें बीत चुकी हैं। अगले सीज़न की सूची के लिए फिर देखें।",
    past: "बीत गया",
    today: "आज",
    nextBadge: "अगला",
    window: "मुहूर्त (नई दिल्ली)",
    agreed: "स्रोत",
    nextDay: "अगले दिन",
    early: (d: string) => `${d} की भोर`,
    none: "इस महीने विवाह का कोई मुहूर्त नहीं है।",
    noneWhy: "कारण:",
    some: (n: number) => `सिर्फ़ एक पंचांग में दी गई तारीखें (${n}) – पक्की नहीं`,
    someHint: "ये तारीखें केवल एक स्रोत में हैं (या केवल द्रिक पंचांग और उसकी नकल करने वाली साइट में)। इन पर विचार करने से पहले पुरोहित से पूछें।",
    caution: "सिंहस्थ गुरु",
    cautionHint: "चिह्नित तारीखों पर गुरु सिंह राशि में हैं। कुछ पंडित, ख़ासकर गंगा और गोदावरी के बीच के क्षेत्र में, इस समय विवाह टालते हैं, जबकि कई पंचांग ये तारीखें देते हैं। अपने पुरोहित से पूछें।",
    periodsTitle: "कब नहीं होते विवाह मुहूर्त",
    kindBlock: "विवाह वर्जित",
    kindCaution: "कुछ पंडित टालते हैं",
    mhTitle: "मराठी पंचांग की तारीखें अभी पक्की नहीं हैं",
    mhBody:
      "हम कोई तारीख तभी दिखाते हैं जब कम से कम दो प्रकाशित स्रोत सहमत हों। नवंबर 2026 के बाद के लिए अभी तक हमें केवल एक मराठी सूची मिली है, इसलिए महाराष्ट्र की कोई तारीख अभी पक्की नहीं मानी गई है। मराठी पंचांग (दाते, कालनिर्णय, महालक्ष्मी) अक्सर उत्तर भारतीय सूचियों से अलग होते हैं।",
    mhSwitch: "उत्तर भारत की सूची देखें",
    mhMonth: "मराठी पंचांग की तारीखें अभी पक्की नहीं",
    mhOne: "एक मराठी सूची (पुढारी, दिसंबर 2025) में ये तारीखें हैं:",
    mhOneHint: "उसी लेख में लिखा है कि इस सूची में गुरु अस्त, शुक्र अस्त और सिंहस्थ काल की तारीखें भी हैं। इन्हें सिर्फ़ पुरोहित से बात शुरू करने के लिए देखें।",
    alsoNorth: "उत्तर भारत की सूची में भी",
    inPeriod: "इस काल में:",
    copy: "सूची कॉपी करें",
    share: "सूची शेयर करें",
    copied: "सूची कॉपी हो गई। व्हाट्सऐप या नोट में पेस्ट करें।",
    copyFail: "कॉपी नहीं हो पाया। फिर से कोशिश करें।",
    listTitle: (d: string) => `विवाह मुहूर्त नवंबर 2026 – दिसंबर 2027 · ${d}`,
    listNone: "कोई मुहूर्त नहीं",
    listMhNone: "मराठी पंचांग की तारीखें अभी पक्की नहीं हैं।",
    before: "तारीख तय करने से पहले:",
    kundli: "कुंडली मिलान (गुण मिलान) करें",
    biodata: "बायोडाटा बनाएँ",
    sourcesTitle: "स्रोत",
    sourcesHint: (d: string) => `सभी पेज ${d} को देखे गए।`,
    method:
      "हमने सूची कैसे बनाई: कोई तारीख तभी पक्की मानी गई जब द्रिक पंचांग में हो और कम से कम एक अलग से गणना करने वाला या अलग से प्रकाशित स्रोत भी उसे दे। हर नक्षत्र को खगोलीय गणना से दोबारा जाँचा गया। द्रिक की सूची की नकल करने वाली साइटें दिखाई गई हैं, पर गिनी नहीं गईं।",
  },
  mr: {
    tradition: "पंचांग परंपरा",
    north: "उत्तर भारत (हिंदी पंचांग)",
    maharashtra: "महाराष्ट्र (मराठी पंचांग)",
    note: "तारखा प्रकाशित पंचांगांवरून संकलित केल्या आहेत (स्रोत खाली दिले आहेत); मुहूर्ताची नेमकी वेळ आपल्या गुरुजींकडून नक्की करून घ्या.",
    noteMore: "दाखवलेली मुहूर्त वेळ द्रिक पंचांगानुसार नवी दिल्लीची आहे. तुमच्या शहरात वेळ वेगळी असू शकते, आणि गुरुजी वधू-वरांच्या पत्रिकाही पाहतील.",
    digits: "मराठी अंक (१२३)",
    months: "महिना निवडा",
    total: (n: number) => `नोव्हेंबर 2026 – डिसेंबर 2027 मध्ये ${n} पक्क्या तारखा`,
    next: "पुढचा पक्का मुहूर्त",
    noneLeft: "यादीतील सर्व तारखा होऊन गेल्या. पुढच्या हंगामाची यादी पुन्हा पाहा.",
    past: "होऊन गेला",
    today: "आज",
    nextBadge: "पुढचा",
    window: "मुहूर्त (नवी दिल्ली)",
    agreed: "स्रोत",
    nextDay: "दुसऱ्या दिवशी",
    early: (d: string) => `${d} ची पहाट`,
    none: "या महिन्यात लग्नाचा मुहूर्त नाही.",
    noneWhy: "कारण:",
    some: (n: number) => `फक्त एकाच पंचांगात दिलेल्या तारखा (${n}) – पक्क्या नाहीत`,
    someHint: "या तारखा फक्त एका स्रोतात आहेत (किंवा फक्त द्रिक पंचांग आणि त्याची नक्कल करणाऱ्या साइटवर). त्यांचा विचार करण्याआधी गुरुजींना विचारा.",
    caution: "सिंहस्थ गुरू",
    cautionHint: "खूण केलेल्या तारखांना गुरू सिंह राशीत आहे. काही गुरुजी, विशेषतः गंगा-गोदावरीच्या मधल्या प्रदेशात, या काळात लग्न टाळतात; तरीही अनेक पंचांग या तारखा देतात. आपल्या गुरुजींना विचारा.",
    periodsTitle: "लग्नाचे मुहूर्त कधी नसतात",
    kindBlock: "लग्न वर्ज्य",
    kindCaution: "काही गुरुजी टाळतात",
    mhTitle: "मराठी पंचांगातील तारखा अजून पक्क्या नाहीत",
    mhBody:
      "किमान दोन प्रकाशित स्रोत जुळले तरच आम्ही तारीख पक्की दाखवतो. नोव्हेंबर 2026 पासूनच्या काळासाठी आम्हाला आतापर्यंत फक्त एकच मराठी यादी मिळाली आहे, म्हणून महाराष्ट्राची कोणतीही तारीख अजून पक्की दाखवलेली नाही. मराठी पंचांग (दाते, कालनिर्णय, महालक्ष्मी) अनेकदा उत्तर भारतीय याद्यांपेक्षा वेगळे असतात, त्यामुळे ती यादी जशीच्या तशी लागू होईल असे मानू नका.",
    mhSwitch: "उत्तर भारताची यादी पाहा",
    mhMonth: "मराठी पंचांगातील तारखा अजून पक्क्या नाहीत",
    mhOne: "एका मराठी यादीत (पुढारी, डिसेंबर 2025) या तारखा आहेत:",
    mhOneHint: "त्याच बातमीत म्हटले आहे की या यादीत गुरू अस्त, शुक्र अस्त आणि सिंहस्थ काळातील तारखाही आहेत. गुरुजींशी बोलताना फक्त सुरुवात म्हणून या पाहा.",
    alsoNorth: "उत्तर भारताच्या यादीतही",
    inPeriod: "या काळात:",
    copy: "यादी कॉपी करा",
    share: "यादी शेअर करा",
    copied: "यादी कॉपी झाली. व्हॉट्सॲप किंवा नोटमध्ये पेस्ट करा.",
    copyFail: "कॉपी झाली नाही. पुन्हा प्रयत्न करा.",
    listTitle: (d: string) => `लग्न मुहूर्त नोव्हेंबर 2026 – डिसेंबर 2027 · ${d}`,
    listNone: "मुहूर्त नाही",
    listMhNone: "मराठी पंचांगातील तारखा अजून पक्क्या नाहीत.",
    before: "तारीख ठरवण्याआधी:",
    kundli: "गुण मिलन करा",
    biodata: "बायोडाटा तयार करा",
    sourcesTitle: "स्रोत",
    sourcesHint: (d: string) => `सर्व पाने ${d} रोजी पाहिली.`,
    method:
      "ही यादी कशी तयार केली: द्रिक पंचांगात असलेली आणि किमान एका स्वतंत्र गणना करणाऱ्या किंवा स्वतंत्रपणे प्रकाशित स्रोताशी जुळणारी तारीखच पक्की मानली. प्रत्येक नक्षत्र खगोलीय गणनेने पुन्हा तपासले. द्रिकची यादी जशीच्या तशी देणाऱ्या साइट दाखवल्या आहेत, पण मोजल्या नाहीत.",
  },
};

const PERIOD_NAME: Record<PeriodId, Record<Lang, string>> = {
  chaturmas2026: {
    en: "Chaturmas – ends on Devuthani / Prabodhini Ekadashi (Fri 20 Nov 2026)",
    hi: "चातुर्मास – देवउठनी एकादशी (शुक्रवार, 20 नवंबर 2026) को समाप्त",
    mr: "चातुर्मास – प्रबोधिनी एकादशीला (शुक्रवार, 20 नोव्हेंबर 2026) समाप्त",
  },
  shukraAst2026: { en: "Shukra ast (Venus combust)", hi: "शुक्र अस्त", mr: "शुक्राचा अस्त" },
  simhastha1: {
    en: "Simhastha Guru – Jupiter in Leo",
    hi: "सिंहस्थ गुरु – गुरु सिंह राशि में",
    mr: "सिंहस्थ गुरू – गुरू सिंह राशीत",
  },
  kharmas2026: {
    en: "Kharmas / Dhanurmas – Sun in Sagittarius, until Makar Sankranti",
    hi: "खरमास – धनु संक्रांति से मकर संक्रांति तक",
    mr: "धनुर्मास / खरमास – मकर संक्रांतीपर्यंत",
  },
  holashtak2027: { en: "Holashtak – eight days before Holika Dahan", hi: "होलाष्टक – होलिका दहन से पहले के आठ दिन", mr: "होळाष्टक – होळीपूर्वीचे आठ दिवस" },
  meenKharmas2027: { en: "Kharmas – Sun in Pisces (Meen)", hi: "खरमास – मीन संक्रांति", mr: "मीन खरमास" },
  simhastha2: {
    en: "Simhastha Guru – Jupiter in Leo again (Nashik Kumbh year)",
    hi: "सिंहस्थ गुरु – गुरु फिर सिंह राशि में (नासिक कुंभ वर्ष)",
    mr: "सिंहस्थ गुरू – गुरू पुन्हा सिंह राशीत (नाशिक कुंभमेळा वर्ष)",
  },
  chaturmas2027: {
    en: "Chaturmas – Devshayani (Wed 14 Jul) to Prabodhini Ekadashi (Wed 10 Nov 2027)",
    hi: "चातुर्मास – देवशयनी (बुधवार, 14 जुलाई) से देवउठनी एकादशी (बुधवार, 10 नवंबर 2027)",
    mr: "चातुर्मास – आषाढी (बुधवार, 14 जुलै) ते प्रबोधिनी एकादशी (बुधवार, 10 नोव्हेंबर 2027)",
  },
  shukraAst2027: { en: "Shukra ast (Venus combust)", hi: "शुक्र अस्त", mr: "शुक्राचा अस्त" },
  kharmas2027: {
    en: "Kharmas / Dhanurmas – from Dhanu Sankranti",
    hi: "खरमास – धनु संक्रांति से",
    mr: "धनुर्मास / खरमास – धनु संक्रांतीपासून",
  },
};

const PERIOD_SHORT: Record<PeriodId, Record<Lang, string>> = {
  chaturmas2026: { en: "Chaturmas", hi: "चातुर्मास", mr: "चातुर्मास" },
  shukraAst2026: { en: "Shukra ast", hi: "शुक्र अस्त", mr: "शुक्राचा अस्त" },
  simhastha1: { en: "Simhastha Guru", hi: "सिंहस्थ गुरु", mr: "सिंहस्थ गुरू" },
  kharmas2026: { en: "Kharmas / Dhanurmas", hi: "खरमास", mr: "धनुर्मास / खरमास" },
  holashtak2027: { en: "Holashtak", hi: "होलाष्टक", mr: "होळाष्टक" },
  meenKharmas2027: { en: "Kharmas", hi: "खरमास", mr: "मीन खरमास" },
  simhastha2: { en: "Simhastha Guru", hi: "सिंहस्थ गुरु", mr: "सिंहस्थ गुरू" },
  chaturmas2027: { en: "Chaturmas", hi: "चातुर्मास", mr: "चातुर्मास" },
  shukraAst2027: { en: "Shukra ast", hi: "शुक्र अस्त", mr: "शुक्राचा अस्त" },
  kharmas2027: { en: "Kharmas / Dhanurmas", hi: "खरमास", mr: "धनुर्मास / खरमास" },
};

/* ---------- helpers ---------- */

const pad = (n: number) => String(n).padStart(2, "0");
const parts = (iso: string) => iso.split("-").map(Number) as [number, number, number];
const weekdayIndex = (iso: string) => {
  const [y, m, d] = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};
const nextIso = (iso: string) => {
  const [y, m, d] = parts(iso);
  const n = new Date(Date.UTC(y, m - 1, d + 1));
  return `${n.getUTCFullYear()}-${pad(n.getUTCMonth() + 1)}-${pad(n.getUTCDate())}`;
};

function monthKeys(): string[] {
  const out: string[] = [];
  let [y, m] = RANGE.from.split("-").map(Number);
  const [ty, tm] = RANGE.to.split("-").map(Number);
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${pad(m)}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}
const MONTH_KEYS = monthKeys();

const localName = (map: Record<string, { hi: string; mr: string }>, name: string, lang: Lang) =>
  lang === "en" ? name : (map[name]?.[lang] ?? name);

function fmtTime(hhmm: string, lang: Lang): string {
  const [h, m] = hhmm.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const clock = `${h12}:${pad(m)}`;
  if (lang === "en") return `${clock} ${h < 12 ? "am" : "pm"}`;
  const part =
    h >= 4 && h < 12
      ? { hi: "सुबह", mr: "सकाळी" }
      : h >= 12 && h < 16
        ? { hi: "दोपहर", mr: "दुपारी" }
        : h >= 16 && h < 19
          ? { hi: "शाम", mr: "सायंकाळी" }
          : { hi: "रात", mr: "रात्री" };
  return `${part[lang]} ${clock}`;
}

function inPeriods(iso: string): Period[] {
  return PERIODS.filter((p) => iso >= p.from && iso <= p.to);
}

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const subscribeNoop = () => () => {};
const hasShare = () => typeof navigator.share === "function";

/* ---------- component ---------- */

export default function Muhurat({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [dataset, setDataset] = useState<DatasetId>(lang === "mr" ? "maharashtra" : "north");
  const [digits, setDigits] = useState(false);
  const [open, setOpen] = useState<Set<string>>(() => new Set([MONTH_KEYS[0]]));
  const [status, setStatus] = useState("");
  // Today's date is only known in the browser; the static HTML renders without past/upcoming marks.
  const today = useSyncExternalStore(subscribeNoop, todayIso, () => null);

  const num = (s: string) => (digits && lang !== "en" ? toDevanagariDigits(s) : s);
  const monthLabel = (key: string, short = false) => {
    const [y, m] = key.split("-").map(Number);
    return num(`${(short ? MONTHS_SHORT : MONTHS)[lang][m - 1]} ${y}`);
  };
  const dayMonth = (iso: string) => {
    const [, m, d] = parts(iso);
    return num(`${d} ${MONTHS_SHORT[lang][m - 1]}`);
  };
  const fullDate = (iso: string) => {
    const [y, m, d] = parts(iso);
    return num(`${WEEKDAYS[lang][weekdayIndex(iso)]}, ${d} ${MONTHS[lang][m - 1]} ${y}`);
  };
  const windowLabel = (iso: string, w: MuhuratWindow) => {
    const [from, to, fromNext, toNext] = w;
    const s = fmtTime(from, lang);
    const e = fmtTime(to, lang);
    if (fromNext && toNext) return num(`${s} – ${e} (${t.early(dayMonth(nextIso(iso)))})`);
    return num(`${s} – ${e}${toNext ? ` (${t.nextDay})` : ""}`);
  };
  const periodRange = (p: Period) => `${dayMonth(p.from)} ${num(p.from.slice(0, 4))} – ${dayMonth(p.to)} ${num(p.to.slice(0, 4))}`;

  const confirmed: MuhuratDate[] = dataset === "north" ? NORTH_CONFIRMED : MAHARASHTRA_CONFIRMED;
  const some: SomeDate[] = dataset === "north" ? NORTH_SOME : MAHARASHTRA_SOME;
  const northSet = useMemo(() => new Set(NORTH_CONFIRMED.map((d) => d.date)), []);

  const byMonth = useMemo(() => {
    const map = new Map<string, { conf: MuhuratDate[]; some: SomeDate[] }>();
    for (const k of MONTH_KEYS) map.set(k, { conf: [], some: [] });
    for (const d of confirmed) map.get(d.date.slice(0, 7))?.conf.push(d);
    for (const d of some) map.get(d.date.slice(0, 7))?.some.push(d);
    return map;
  }, [confirmed, some]);

  const nextDate = today ? confirmed.find((d) => d.date >= today) : undefined;

  const toggle = (key: string) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  const jump = (key: string) => {
    setOpen((prev) => new Set(prev).add(key));
    // Wait one tick so the opened panel is rendered before scrolling to it.
    setTimeout(() => document.getElementById(`muhurat-${key}`)?.scrollIntoView({ block: "start" }), 0);
  };

  const pageUrl = `${SITE.url}${topicPath("muhurat", lang) ?? "/"}`;

  function listText(): string {
    const lines = [t.listTitle(dataset === "north" ? t.north : t.maharashtra), "", t.note, ""];
    if (dataset === "north") {
      for (const k of MONTH_KEYS) {
        const c = byMonth.get(k)!.conf;
        const days = c.map((d) => `${num(String(parts(d.date)[2]))} (${WEEKDAYS[lang][weekdayIndex(d.date)].slice(0, lang === "en" ? 3 : undefined)})`);
        lines.push(`${monthLabel(k)}: ${days.length ? days.join(", ") : t.listNone}`);
      }
    } else {
      lines.push(t.listMhNone, "", t.mhOne);
      for (const k of MONTH_KEYS) {
        const s = byMonth.get(k)!.some;
        if (s.length) lines.push(`${monthLabel(k)}: ${s.map((d) => num(String(parts(d.date)[2]))).join(", ")}`);
      }
    }
    lines.push("", pageUrl);
    return lines.join("\n");
  }

  async function onCopy() {
    setStatus((await copyText(listText())) ? t.copied : t.copyFail);
  }
  const canShare = useSyncExternalStore(subscribeNoop, hasShare, () => false);
  async function onShare() {
    try {
      await navigator.share({ text: listText() });
    } catch {
      /* user cancelled */
    }
  }

  const order: DatasetId[] = lang === "mr" ? ["maharashtra", "north"] : ["north", "maharashtra"];
  const kundliHref = topicPath("gunaMilan", lang);
  const createHref = topicPath("create", lang);

  return (
    <div className="space-y-4">
      {/* Controls + note */}
      <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">{t.tradition}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {order.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setDataset(id);
                  setStatus("");
                }}
                aria-pressed={dataset === id}
                className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition ${
                  dataset === id ? "border-maroon bg-maroon text-white" : "border-line bg-ivory/60 text-ink hover:border-gold"
                }`}
              >
                {id === "north" ? t.north : t.maharashtra}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 rounded-xl border border-gold/60 bg-sand/60 p-3 text-sm text-ink" role="note">
          <p className="font-semibold">{t.note}</p>
          <p className="mt-1 text-soft">{t.noteMore}</p>
        </div>

        {lang !== "en" && (
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} className="h-4 w-4 accent-[var(--color-maroon)]" />
            {t.digits}
          </label>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5" aria-live="polite">
        {dataset === "north" ? (
          <>
            <p className="text-sm text-soft">{num(t.total(confirmed.length))}</p>
            {today &&
              (nextDate ? (
                <p className="mt-1 text-ink">
                  <span className="text-sm text-soft">{t.next}: </span>
                  <span className="font-display text-xl text-maroon">{fullDate(nextDate.date)}</span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-ink">{t.noneLeft}</p>
              ))}
          </>
        ) : (
          <>
            <h2 className="font-display text-lg text-maroon">{t.mhTitle}</h2>
            <p className="mt-1 text-sm text-ink">{t.mhBody}</p>
            <button
              type="button"
              onClick={() => setDataset("north")}
              className="mt-3 rounded-full border border-maroon px-4 py-2 text-sm font-semibold text-maroon hover:bg-maroon hover:text-white"
            >
              {t.mhSwitch}
            </button>
          </>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onCopy} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark">
            {t.copy}
          </button>
          {canShare && (
            <button type="button" onClick={onShare} className="rounded-full border border-maroon px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-ivory">
              {t.share}
            </button>
          )}
        </div>
        <p className="mt-2 min-h-5 text-sm text-leaf">{status}</p>
      </div>

      {/* Month chips */}
      <nav aria-label={t.months}>
        <p className="mb-2 text-sm font-semibold text-ink">{t.months}</p>
        <ul className="flex flex-wrap gap-2">
          {MONTH_KEYS.map((k) => {
            const m = byMonth.get(k)!;
            const count = m.conf.length;
            const past = today ? `${k}-31` < today : false;
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => jump(k)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    count ? "border-gold bg-paper text-ink hover:bg-sand" : "border-line bg-ivory text-soft hover:border-gold"
                  } ${past ? "opacity-60" : ""}`}
                >
                  {monthLabel(k, true)}
                  <span className={`ml-1.5 rounded-full px-1.5 text-xs ${count ? "bg-maroon text-white" : "bg-line text-soft"}`}>
                    {dataset === "maharashtra" && !count ? "–" : num(String(count))}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Months */}
      <div className="space-y-3">
        {MONTH_KEYS.map((k) => {
          const m = byMonth.get(k)!;
          const isOpen = open.has(k);
          const monthStart = `${k}-01`;
          const monthEnd = `${k}-31`;
          const monthPeriods = PERIODS.filter((p) => p.from <= monthEnd && p.to >= monthStart);
          const panelId = `muhurat-panel-${k}`;
          return (
            <section key={k} id={`muhurat-${k}`} className="scroll-mt-24 rounded-2xl border border-line bg-paper">
              <h3 className="m-0">
                <button
                  type="button"
                  onClick={() => toggle(k)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
                >
                  <span className="font-display text-lg text-maroon">{monthLabel(k)}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm text-soft">
                    {dataset === "north" ? num(String(m.conf.length)) : "–"}
                    <span aria-hidden className={`transition ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </span>
                </button>
              </h3>
              {isOpen && (
                <div id={panelId} className="border-t border-line px-4 pb-4 pt-3 sm:px-5">
                  {dataset === "maharashtra" && m.conf.length === 0 && <p className="text-sm font-semibold text-ink">{t.mhMonth}</p>}

                  {dataset === "north" && m.conf.length === 0 && (
                    <div className="text-sm text-ink">
                      <p className="font-semibold">{t.none}</p>
                      {monthPeriods.some((p) => p.kind === "block") && (
                        <p className="mt-1 text-soft">
                          {t.noneWhy} {monthPeriods.filter((p) => p.kind === "block").map((p) => num(PERIOD_NAME[p.id][lang])).join("; ")}
                        </p>
                      )}
                    </div>
                  )}

                  {m.conf.some((d) => inPeriods(d.date).some((p) => p.kind === "caution")) && (
                    <p className="mb-3 rounded-lg bg-gold/10 px-3 py-2 text-xs text-ink">
                      <span className="inline-flex items-center gap-1 font-semibold text-maroon">
                    <IconWarning className="size-3.5" /> {t.caution}:
                  </span> {t.cautionHint}
                    </p>
                  )}

                  {m.conf.length > 0 && (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {m.conf.map((d) => {
                        const isPast = today ? d.date < today : false;
                        const isToday = today === d.date;
                        const isNext = nextDate?.date === d.date;
                        const caution = inPeriods(d.date).find((p) => p.kind === "caution");
                        return (
                          <li
                            key={d.date}
                            className={`rounded-xl border p-3 ${isNext ? "border-gold bg-sand/60" : "border-line bg-ivory/60"} ${isPast ? "opacity-60" : ""}`}
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                              <p className="font-semibold text-ink">{fullDate(d.date)}</p>
                              <span className="text-xs font-semibold">
                                {isToday ? (
                                  <span className="text-leaf">{t.today}</span>
                                ) : isNext ? (
                                  <span className="text-maroon">{t.nextBadge}</span>
                                ) : isPast ? (
                                  <span className="text-soft">{t.past}</span>
                                ) : null}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-ink">
                              {d.nakshatra.map((n) => localName(NAKSHATRA, n, lang)).join(", ")} · {d.tithi.map((x) => localName(TITHI, x, lang)).join(", ")}
                            </p>
                            <p className="mt-1 text-xs text-soft">
                              {t.window}: {d.windows.map((w) => windowLabel(d.date, w)).join("; ")}
                            </p>
                            {caution && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-maroon">
                            <IconWarning className="size-3.5" /> {t.caution}
                          </p>
                        )}
                            <p className="mt-1 text-xs text-soft">
                              {t.agreed}: {d.sources.map((s) => SOURCE_SHORT[s]).join(", ")}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {m.some.length > 0 && dataset === "north" && (
                    <details className="mt-3 rounded-xl border border-dashed border-line p-3">
                      <summary className="cursor-pointer text-sm text-soft">{num(t.some(m.some.length))}</summary>
                      <p className="mt-2 text-xs text-soft">{t.someHint}</p>
                      <ul className="mt-2 space-y-1 text-sm text-ink">
                        {m.some.map((d) => (
                          <li key={d.date}>
                            {fullDate(d.date)} <span className="text-xs text-soft">({d.sources.map((s) => SOURCE_SHORT[s]).join(", ")})</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {m.some.length > 0 && dataset === "maharashtra" && (
                    <div className="mt-3 rounded-xl border border-dashed border-line p-3">
                      <p className="text-sm text-ink">{t.mhOne}</p>
                      <p className="mt-1 text-xs text-soft">{t.mhOneHint}</p>
                      <ul className="mt-2 space-y-1 text-sm text-ink">
                        {m.some.map((d) => {
                          const block = inPeriods(d.date).filter((p) => p.kind === "block");
                          return (
                            <li key={d.date} className={today && d.date < today ? "opacity-60" : ""}>
                              {fullDate(d.date)}
                              {northSet.has(d.date) && (
                          <span className="ml-1 inline-flex items-center gap-0.5 text-xs text-leaf">
                            <IconCheck className="size-3.5" /> {t.alsoNorth}
                          </span>
                        )}
                              {block.length > 0 && (
                                <span className="ml-1 text-xs text-maroon">
                                  ({t.inPeriod} {block.map((p) => num(PERIOD_SHORT[p.id][lang])).join(", ")})
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {monthPeriods.length > 0 && (m.conf.length > 0 || dataset === "maharashtra") && (
                    <ul className="mt-3 space-y-1 text-xs text-soft">
                      {monthPeriods.map((p) => (
                        <li key={p.id}>
                          <span className={p.kind === "block" ? "text-maroon" : "text-ink"}>{p.kind === "block" ? t.kindBlock : t.kindCaution}:</span>{" "}
                          {num(PERIOD_NAME[p.id][lang])} ({periodRange(p)})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* No-muhurat periods */}
      <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <h2 className="font-display text-lg text-maroon">{t.periodsTitle}</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {PERIODS.map((p) => (
            <li key={p.id} className="flex flex-col gap-0.5 border-b border-line pb-2 last:border-0 last:pb-0">
              <span className="text-ink">
                <span
                  className={`mr-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    p.kind === "block" ? "bg-maroon/10 text-maroon" : "bg-gold/20 text-ink"
                  }`}
                >
                  {p.kind === "block" ? t.kindBlock : t.kindCaution}
                </span>
                {num(PERIOD_NAME[p.id][lang])}
              </span>
              <span className="text-xs text-soft">
                {periodRange(p)} · {[...new Set(p.sources.map((s) => SOURCE_SHORT[s]))].join(", ")}
              </span>
            </li>
          ))}
        </ul>
        {(kundliHref || createHref) && (
          <p className="mt-3 text-sm text-ink">
            {t.before}{" "}
            {kundliHref && (
              <a href={kundliHref} className="font-semibold text-maroon underline underline-offset-2">
                {t.kundli}
              </a>
            )}
            {kundliHref && createHref && " · "}
            {createHref && (
              <a href={createHref} className="font-semibold text-maroon underline underline-offset-2">
                {t.biodata}
              </a>
            )}
          </p>
        )}
      </div>

      {/* Sources */}
      <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <h2 className="font-display text-lg text-maroon">{t.sourcesTitle}</h2>
        <p className="mt-1 text-sm text-soft">{t.method}</p>
        <p className="mt-1 text-xs text-soft">{t.sourcesHint(ACCESSED)}</p>
        <ul className="mt-3 space-y-2 text-sm">
          {SOURCES.map((s) => (
            <li key={s.id} className="min-w-0">
              <p className="font-semibold text-ink">{s.name}</p>
              <p className="text-xs text-soft">{s.note[lang]}</p>
              <ul className="mt-0.5 space-y-0.5">
                {s.urls.map((u) => (
                  <li key={u} className="min-w-0">
                    <a href={u} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-xs text-maroon underline underline-offset-2">
                      {u.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
