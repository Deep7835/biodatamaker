import type { Lang } from "@/lib/i18n";
import {
  BENGAL_CONFIRMED,
  BENGAL_SOME,
  MAHARASHTRA_SOME,
  MITHILA_CONFIRMED,
  NORTH_CONFIRMED,
  type MuhuratDate,
  type SomeDate,
} from "@/lib/tools/muhurat-data";
import { BENGALI_MONTH, fmtTime, localName, MONTHS, MONTHS_SHORT, NAKSHATRA, TITHI, WEEKDAYS } from "@/lib/tools/muhurat-names";
import { topicPath } from "./slugs";
import type { PageContent, Topic } from "./types";

/**
 * Articles on the coming wedding season (added 2026-10 for "shadi muhurat november 2026" style searches).
 * Every date table is built from src/lib/tools/muhurat-data.ts, so the articles always match the muhurat tool.
 */

const updated = "2026-10-12";

/* ---------- date helpers ---------- */

const pad = (n: number) => String(n).padStart(2, "0");
const parts = (iso: string) => iso.split("-").map(Number) as [number, number, number];
const inRange = <T extends { date: string }>(list: T[], from: string, to: string) => list.filter((d) => d.date >= from && d.date <= to);
const weekday = (iso: string, lang: Lang) => {
  const [y, m, d] = parts(iso);
  return WEEKDAYS[lang][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
};
const dayMonth = (iso: string, lang: Lang) => {
  const [, m, d] = parts(iso);
  return `${d} ${MONTHS_SHORT[lang][m - 1]}`;
};
const nextIso = (iso: string) => {
  const [y, m, d] = parts(iso);
  const n = new Date(Date.UTC(y, m - 1, d + 1));
  return `${n.getUTCFullYear()}-${pad(n.getUTCMonth() + 1)}-${pad(n.getUTCDate())}`;
};
const monthKeys = (from: string, to: string) => {
  const out: string[] = [];
  let [y, m] = parts(from);
  const [ty, tm] = parts(to);
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${pad(m)}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
};
const monthName = (key: string, lang: Lang) => {
  const [y, m] = parts(`${key}-01`);
  return `${MONTHS[lang][m - 1]} ${y}`;
};
const AND: Record<Lang, string> = { en: " and ", hi: " और ", mr: " आणि " };

/** "21, 24, 25 and 26 November; 2 and 3 December" */
function dateList(list: { date: string }[], lang: Lang) {
  const groups = new Map<string, number[]>();
  for (const d of list) {
    const k = d.date.slice(0, 7);
    groups.set(k, [...(groups.get(k) ?? []), parts(d.date)[2]]);
  }
  return [...groups]
    .map(([k, days]) => {
      const nums = days.map(String);
      const joined = nums.length > 1 ? `${nums.slice(0, -1).join(", ")}${AND[lang]}${nums[nums.length - 1]}` : nums[0];
      return `${joined} ${MONTHS[lang][parts(`${k}-01`)[1] - 1]}`;
    })
    .join("; ");
}

/** Dates present in every list. */
const common = (...lists: { date: string }[][]) => lists[0].filter((d) => lists.every((l) => l.some((x) => x.date === d.date)));
const has = (list: { date: string }[], iso: string) => list.some((d) => d.date === iso);

function windowText(d: MuhuratDate, lang: Lang) {
  const nextDay = { en: "next day", hi: "अगले दिन", mr: "दुसऱ्या दिवशी" }[lang];
  const early = (s: string) => ({ en: `early hours of ${s}`, hi: `${s} की भोर`, mr: `${s} ची पहाट` })[lang];
  return (d.windows ?? [])
    .map(([from, to, fromNext, toNext]) => {
      const s = `${fmtTime(from, lang)} – ${fmtTime(to, lang)}`;
      if (fromNext && toNext) return `${s} (${early(dayMonth(nextIso(d.date), lang))})`;
      return toNext ? `${s} (${nextDay})` : s;
    })
    .join("; ");
}

const HEAD: Record<Lang, { date: string; day: string; nak: string; tithi: string; time: string; month: string; dates: string; count: string; bengali: string }> = {
  en: { date: "Date", day: "Day", nak: "Nakshatra", tithi: "Tithi", time: "Muhurat (New Delhi)", month: "Month", dates: "Dates", count: "Count", bengali: "Bengali date" },
  hi: { date: "तारीख", day: "वार", nak: "नक्षत्र", tithi: "तिथि", time: "मुहूर्त (नई दिल्ली)", month: "महीना", dates: "तारीखें", count: "गिनती", bengali: "बांग्ला तिथि" },
  mr: { date: "तारीख", day: "वार", nak: "नक्षत्र", tithi: "तिथी", time: "मुहूर्त (नवी दिल्ली)", month: "महिना", dates: "तारखा", count: "संख्या", bengali: "बंगाली दिनांक" },
};

/** North India dates with nakshatra, tithi and the New Delhi window. */
function northTable(from: string, to: string, lang: Lang) {
  const h = HEAD[lang];
  const rows = inRange(NORTH_CONFIRMED, from, to).map(
    (d) =>
      `| ${dayMonth(d.date, lang)} ${parts(d.date)[0]} | ${weekday(d.date, lang)} | ${(d.nakshatra ?? []).map((n) => localName(NAKSHATRA, n, lang)).join(", ")} | ${(d.tithi ?? []).map((x) => localName(TITHI, x, lang)).join(", ")} | ${windowText(d, lang)} |`,
  );
  return [`| ${h.date} | ${h.day} | ${h.nak} | ${h.tithi} | ${h.time} |`, "|---|---|---|---|---|", ...rows].join("\n");
}

/** One row per month: the day numbers and how many. */
function monthTable(list: { date: string }[], from: string, to: string, lang: Lang, none: string) {
  const h = HEAD[lang];
  const rows = monthKeys(from, to).map((k) => {
    const days = list.filter((d) => d.date.startsWith(k)).map((d) => parts(d.date)[2]);
    return `| ${monthName(k, lang)} | ${days.length ? days.join(", ") : none} | ${days.length} |`;
  });
  return [`| ${h.month} | ${h.dates} | ${h.count} |`, "|---|---|---|", ...rows].join("\n");
}

function bengalTable(list: (MuhuratDate | SomeDate)[], lang: Lang) {
  const h = HEAD[lang];
  const rows = list.map((d) => `| ${d.bengali ? `${d.bengali[1]} ${BENGALI_MONTH[d.bengali[0]][lang]} 1433` : ""} | ${dayMonth(d.date, lang)} ${parts(d.date)[0]} | ${weekday(d.date, lang)} |`);
  return [`| ${h.bengali} | ${h.date} | ${h.day} |`, "|---|---|---|", ...rows].join("\n");
}

const path = (topic: Topic, lang: Lang) => `${topicPath(topic, lang)}/`;

/* ---------- data for the articles ---------- */

const ND = { from: "2026-11-01", to: "2026-12-31" };
const JM = { from: "2027-01-01", to: "2027-03-31" };

const ndNorth = inRange(NORTH_CONFIRMED, ND.from, ND.to);
const ndMithila = inRange(MITHILA_CONFIRMED, ND.from, ND.to);
const ndBengal = inRange(BENGAL_CONFIRMED, ND.from, ND.to);
const ndCommon = common(ndNorth, ndMithila, ndBengal);
const ndMarathiAlsoNorth = inRange(MAHARASHTRA_SOME, ND.from, ND.to).filter((d) => has(NORTH_CONFIRMED, d.date));

const jmNorth = inRange(NORTH_CONFIRMED, JM.from, JM.to);
const jmMithila = inRange(MITHILA_CONFIRMED, JM.from, JM.to);
const jmBengal = inRange(BENGAL_CONFIRMED, JM.from, JM.to);
const jmCommon = common(jmNorth, jmMithila, jmBengal);

const MITHILA_ALL = { from: "2026-11-01", to: "2027-07-31" };
const mithilaAlsoNorth = MITHILA_CONFIRMED.filter((d) => has(NORTH_CONFIRMED, d.date));
const mithilaOnly = MITHILA_CONFIRMED.filter((d) => !has(NORTH_CONFIRMED, d.date));
const mithilaBusiest = monthKeys(MITHILA_ALL.from, MITHILA_ALL.to)
  .map((k) => ({ k, n: MITHILA_CONFIRMED.filter((d) => d.date.startsWith(k)).length }))
  .sort((a, b) => b.n - a.n)[0];

/* ---------- pages ---------- */

export const MUHURAT_ARTICLES: PageContent[] = [
  /* ===== November–December 2026 ===== */
  {
    lang: "en",
    topic: "weddingDatesNovDec2026",
    slug: "wedding-dates-november-december-2026",
    title: "Wedding Dates November & December 2026 – Shubh Vivah Muhurat List",
    description: `All ${ndNorth.length} Hindu wedding dates in Nov–Dec 2026 with nakshatra, tithi and timings, plus Mithila and Bengali panchang dates and when Kharmas begins.`,
    h1: "Wedding Dates in November and December 2026",
    lead: "The wedding season opens after Devuthani Ekadashi on 20 November 2026 and pauses for Kharmas from 16 December. Here is every auspicious date in between, for North India, Mithila and Bengal.",
    sample: { gender: "girl", templateId: "maroon-heritage" },
    body: `
## When the 2026 wedding season begins

Hindu weddings pause for Chaturmas, the four months from Devshayani Ekadashi to Devuthani (Prabodhini) Ekadashi. In 2026 Chaturmas ends on **Friday 20 November**, and Tulsi Vivah falls on Saturday 21 November. The first wedding muhurat of the season is on the same day, 21 November.

The window is short. On **16 December** the Sun enters Sagittarius and Kharmas (also called Dhanurmas) begins, and most panchangs give no wedding dates until Makar Sankranti on 14 January 2027. So the whole winter season before January fits into about four weeks.

## North India dates (Hindi panchangs)

There are ${ndNorth.length} dates. The times are for New Delhi; your city will differ by a few minutes to an hour.

${northTable(ND.from, ND.to, "en")}

A few things to notice:

- **11 December** looks like a Friday date, but its muhurat starts at 3:04 am, in the early hours of Saturday 12 December. Families who want a Friday evening wedding should ask their purohit about 11 December specifically.
- **24 November** has a night muhurat only (from 11:25 pm), while **25 November** is auspicious from sunrise to sunrise.
- Jupiter is in Leo (Simhastha Guru) during this whole stretch. Some pandits, mainly between the Ganga and the Godavari, avoid weddings then; most panchangs still list these dates.

## Mithila panchang dates

The Mithila Vishwavidyalaya Panchang 2026-27, followed by Maithili families in Bihar, gives ${ndMithila.length} dates in these two months: ${dateList(ndMithila, "en")}. Its season starts a day later, on 22 November, and its last date before Kharmas is 14 December. See all 63 dates for the year in [Mithila panchang marriage dates 2026-27](${path("mithilaMuhurat", "en")}).

## Bengali panjika dates

Beni Madhab Sil's Full Panjika 1433 gives ${ndBengal.length} wedding dates in Agrahayan: ${dateList(ndBengal, "en")}. It also lists 7 and 14 November (20 and 27 Kartik) as additional dates. The full list is in [Bengali marriage dates 2026-27](${path("bengaliMuhurat", "en")}).

## Dates that appear in every list

${dateList(ndCommon, "en")} appear in the North Indian, Mithila and Bengali lists alike. Expect wedding halls, caterers, pandits and photographers to be booked earliest for these days, especially on the weekend.

## What about Maharashtra?

Marathi panchangs such as Date, Kalnirnay and Mahalaxmi often give different dates from the North Indian lists. So far we have found only one published Marathi list for this season, which is not enough to confirm any date. Of its dates, ${dateList(ndMarathiAlsoNorth, "en")} also appear in the North Indian list. Check with your guruji before booking.

## A four-week plan

1. **Now (October):** exchange biodata and match kundalis. [Make your biodata free](/create/) and use [kundali matching](${path("gunaMilan", "en")}) for a first check.
2. **Late October:** shortlist two or three dates from the tables above and take them to your purohit.
3. **As soon as the date is fixed:** book the hall. Weekend dates like 21 November, 5 and 6 December and 12 December fill up first.
4. **Three weeks before:** send the invitation. Design it free with our [wedding invitation maker](${path("invitation", "en")}).

For the full year, with every month to December 2027, open the [vivah muhurat 2026-2027 tool](${path("muhurat", "en")}).
`,
    faqs: [
      {
        q: "What are the wedding dates in November 2026?",
        a: `In the North Indian panchangs: ${dateList(inRange(ndNorth, "2026-11-01", "2026-11-30"), "en")}. Weddings start after Devuthani Ekadashi on 20 November.`,
      },
      {
        q: "What are the wedding dates in December 2026?",
        a: `${dateList(inRange(ndNorth, "2026-12-01", "2026-12-31"), "en")}. Kharmas begins on 16 December, so there are no dates after that until mid-January 2027.`,
      },
      {
        q: "Are there any wedding dates in late December 2026?",
        a: "Most panchangs give none. Kharmas runs from 16 December 2026 to Makar Sankranti on 14 January 2027. The next North Indian date is 15 January 2027.",
      },
      {
        q: "Which dates are best for a big wedding?",
        a: `${dateList(ndCommon, "en")} are auspicious in the North Indian, Mithila and Bengali lists alike, so they will be the busiest. Your purohit will still match the date to both horoscopes.`,
      },
    ],
    updated,
  },
  {
    lang: "hi",
    topic: "weddingDatesNovDec2026",
    slug: "shadi-muhurat-november-december-2026",
    title: "नवंबर-दिसंबर 2026 शादी के शुभ मुहूर्त – विवाह की तारीखें और समय",
    description: `नवंबर और दिसंबर 2026 की सभी ${ndNorth.length} विवाह तारीखें नक्षत्र, तिथि और समय के साथ। मिथिला पंचांग और बांग्ला पंजिका की तारीखें और खरमास कब से, सब एक जगह।`,
    h1: "नवंबर-दिसंबर 2026 में शादी के शुभ मुहूर्त",
    lead: "20 नवंबर 2026 की देवउठनी एकादशी के बाद शादियाँ शुरू होंगी और 16 दिसंबर से खरमास में रुक जाएँगी। इस बीच की हर शुभ तारीख यहाँ है, उत्तर भारत, मिथिला और बंगाल के पंचांगों के अनुसार।",
    sample: { gender: "girl", templateId: "maroon-heritage" },
    body: `
## 2026 में शादियों का सीज़न कब शुरू होगा

देवशयनी एकादशी से देवउठनी (प्रबोधिनी) एकादशी तक के चार महीने चातुर्मास कहलाते हैं, और इस दौरान विवाह नहीं होते। 2026 में चातुर्मास **शुक्रवार 20 नवंबर** को खत्म होगा और शनिवार 21 नवंबर को तुलसी विवाह है। उसी दिन, 21 नवंबर को, सीज़न का पहला विवाह मुहूर्त है।

यह सीज़न छोटा है। **16 दिसंबर** को सूर्य धनु राशि में जाएँगे और खरमास शुरू होगा। इसके बाद 14 जनवरी 2027 की मकर संक्रांति तक ज़्यादातर पंचांग कोई विवाह मुहूर्त नहीं देते। यानी जनवरी से पहले की सारी शादियाँ लगभग चार हफ़्तों में होंगी।

## उत्तर भारत की तारीखें (हिंदी पंचांग)

कुल ${ndNorth.length} तारीखें हैं। समय नई दिल्ली का है; आपके शहर में कुछ मिनट से एक घंटे तक का फ़र्क हो सकता है।

${northTable(ND.from, ND.to, "hi")}

ध्यान देने वाली बातें:

- **11 दिसंबर** शुक्रवार की तारीख दिखती है, पर इसका मुहूर्त रात 3:04 बजे, यानी शनिवार 12 दिसंबर की भोर में शुरू होता है। शुक्रवार शाम की शादी चाहने वाले परिवार 11 दिसंबर के बारे में पुरोहित से अलग से पूछें।
- **24 नवंबर** को केवल रात का मुहूर्त है (रात 11:25 से), जबकि **25 नवंबर** सूर्योदय से अगले सूर्योदय तक शुभ है।
- इस पूरे समय गुरु सिंह राशि में (सिंहस्थ गुरु) हैं। कुछ पंडित, ख़ासकर गंगा-गोदावरी के बीच के क्षेत्र में, इस समय विवाह टालते हैं; फिर भी ज़्यादातर पंचांग ये तारीखें देते हैं।

## मिथिला पंचांग की तारीखें

बिहार के मैथिल परिवार जिस मिथिला विश्वविद्यालय पंचांग 2026-27 को मानते हैं, उसमें इन दो महीनों में ${ndMithila.length} लगन हैं: ${dateList(ndMithila, "hi")}। यहाँ लगन एक दिन बाद, 22 नवंबर से शुरू होते हैं और खरमास से पहले का आख़िरी लगन 14 दिसंबर है। साल भर के सभी 63 लगन [मिथिला पंचांग विवाह मुहूर्त 2026-27](${path("mithilaMuhurat", "hi")}) में देखें।

## बांग्ला पंजिका की तारीखें

बेणीमाधव शील की फुल पंजिका 1433 में अग्रहायण मास में ${ndBengal.length} विवाह तिथियाँ हैं: ${dateList(ndBengal, "hi")}। इसके अलावा 7 और 14 नवंबर (20 और 27 कार्तिक) अतिरिक्त तिथियों के रूप में दी गई हैं।

## जो तारीखें हर सूची में हैं

${dateList(ndCommon, "hi")} उत्तर भारत, मिथिला और बंगाल, तीनों सूचियों में शुभ हैं। इन दिनों के लिए, ख़ासकर वीकेंड पर, मैरिज हॉल, कैटरर, पंडित और फ़ोटोग्राफ़र सबसे पहले बुक होंगे।

## चार हफ़्तों की तैयारी

1. **अभी (अक्टूबर):** बायोडाटा का लेन-देन और कुंडली मिलान। [मुफ़्त बायोडाटा बनाएँ](/hindi/create/) और पहली जाँच के लिए [कुंडली मिलान](${path("gunaMilan", "hi")}) देखें।
2. **अक्टूबर के आख़िर तक:** ऊपर की तालिका से दो-तीन तारीखें चुनकर पुरोहित से मिलें।
3. **तारीख तय होते ही:** हॉल बुक करें। 21 नवंबर, 5-6 दिसंबर और 12 दिसंबर जैसे वीकेंड सबसे पहले भरते हैं।
4. **तीन हफ़्ते पहले:** निमंत्रण भेजें। कार्ड हमारे [शादी कार्ड मेकर](${path("invitation", "hi")}) से मुफ़्त बनाएँ।

दिसंबर 2027 तक के हर महीने की सूची के लिए [विवाह मुहूर्त 2026-2027 टूल](${path("muhurat", "hi")}) खोलें।
`,
    faqs: [
      {
        q: "नवंबर 2026 में शादी की शुभ तारीखें कौन-सी हैं?",
        a: `उत्तर भारतीय पंचांगों के अनुसार ${dateList(inRange(ndNorth, "2026-11-01", "2026-11-30"), "hi")}। शादियाँ 20 नवंबर की देवउठनी एकादशी के बाद शुरू होती हैं।`,
      },
      {
        q: "दिसंबर 2026 में शादी के मुहूर्त कब हैं?",
        a: `${dateList(inRange(ndNorth, "2026-12-01", "2026-12-31"), "hi")}। 16 दिसंबर से खरमास है, इसलिए उसके बाद मध्य जनवरी 2027 तक कोई मुहूर्त नहीं है।`,
      },
      {
        q: "खरमास 2026 कब से कब तक है?",
        a: "16 दिसंबर 2026 (धनु संक्रांति) से 14 जनवरी 2027 (मकर संक्रांति) तक। इसके बाद उत्तर भारत की पहली विवाह तारीख 15 जनवरी 2027 है।",
      },
      {
        q: "मिथिला में नवंबर 2026 में लगन कब हैं?",
        a: `मिथिला विश्वविद्यालय पंचांग के अनुसार ${dateList(inRange(ndMithila, "2026-11-01", "2026-11-30"), "hi")}।`,
      },
    ],
    updated,
  },
  {
    lang: "mr",
    topic: "weddingDatesNovDec2026",
    slug: "lagna-muhurat-november-december-2026",
    title: "नोव्हेंबर-डिसेंबर 2026 लग्न मुहूर्त – लग्नाच्या शुभ तारखा व वेळ",
    description: `नोव्हेंबर आणि डिसेंबर 2026 मधील लग्नाच्या ${ndNorth.length} शुभ तारखा नक्षत्र, तिथी आणि वेळेसह. तुळशी विवाह, धनुर्मास आणि मराठी पंचांगाबद्दल महत्त्वाची माहिती.`,
    h1: "नोव्हेंबर-डिसेंबर 2026 मधील लग्न मुहूर्त",
    lead: "20 नोव्हेंबर 2026 च्या प्रबोधिनी एकादशीनंतर आणि तुळशी विवाहानंतर लग्नसराई सुरू होईल आणि 16 डिसेंबरपासून धनुर्मासात थांबेल. या काळातील सर्व शुभ तारखा येथे आहेत.",
    sample: { gender: "girl", templateId: "kesari-classic" },
    body: `
## 2026 ची लग्नसराई कधी सुरू होणार

आषाढी (देवशयनी) एकादशीपासून प्रबोधिनी (कार्तिकी) एकादशीपर्यंतचे चार महिने चातुर्मास असतो आणि या काळात लग्ने होत नाहीत. 2026 मध्ये चातुर्मास **शुक्रवार 20 नोव्हेंबर** रोजी संपतो आणि शनिवार 21 नोव्हेंबरला तुळशी विवाह आहे. त्याच दिवशी, 21 नोव्हेंबरला, हंगामातील पहिला लग्न मुहूर्त आहे.

हा हंगाम लहान आहे. **16 डिसेंबर** रोजी सूर्य धनु राशीत जातो आणि धनुर्मास (खरमास) सुरू होतो. त्यानंतर 14 जानेवारी 2027 च्या मकर संक्रांतीपर्यंत बहुतेक पंचांगांत लग्नाचा मुहूर्त नसतो. म्हणजे जानेवारीपूर्वीची सगळी लग्ने साधारण चार आठवड्यांत होतील.

## मराठी पंचांगाबद्दल आधी एक महत्त्वाची गोष्ट

दाते, कालनिर्णय, महालक्ष्मी यांसारख्या मराठी पंचांगांतील लग्न मुहूर्त अनेकदा उत्तर भारतीय याद्यांपेक्षा वेगळे असतात. या हंगामासाठी आतापर्यंत आम्हाला एकच प्रकाशित मराठी यादी मिळाली आहे, आणि एका यादीवरून तारीख पक्की मानता येत नाही. त्या यादीतील ${dateList(ndMarathiAlsoNorth, "mr")} या तारखा खालच्या उत्तर भारतीय यादीतही आहेत. त्यामुळे खालील तक्ता सुरुवात म्हणून वापरा आणि अंतिम तारीख आपल्या गुरुजींकडून त्यांच्या पंचांगानुसार नक्की करा.

## उत्तर भारतीय पंचांगातील तारखा

एकूण ${ndNorth.length} तारखा आहेत. वेळ नवी दिल्लीची आहे; तुमच्या शहरात काही मिनिटांपासून एका तासापर्यंत फरक पडू शकतो.

${northTable(ND.from, ND.to, "mr")}

लक्षात ठेवण्यासारखे:

- **11 डिसेंबर** शुक्रवारची तारीख वाटते, पण तिचा मुहूर्त पहाटे 3:04 वाजता, म्हणजे शनिवार 12 डिसेंबरच्या पहाटे सुरू होतो.
- **24 नोव्हेंबर** ला फक्त रात्रीचा मुहूर्त आहे (रात्री 11:25 पासून), तर **25 नोव्हेंबर** सूर्योदयापासून दुसऱ्या दिवशीच्या सूर्योदयापर्यंत शुभ आहे.
- या संपूर्ण काळात गुरू सिंह राशीत (सिंहस्थ) आहे. मुहूर्त चिंतामणीनुसार गंगा-गोदावरीच्या मधल्या प्रदेशात या काळात लग्न वर्ज्य मानले जाते. तरीही बहुतेक पंचांग या तारखा देतात; आपले घराणे काय पाळते ते गुरुजींना नक्की विचारा.

## सर्व याद्यांमध्ये असलेल्या तारखा

${dateList(ndCommon, "mr")} या तारखा उत्तर भारत, मिथिला आणि बंगाल या तिन्ही पंचांगांत शुभ आहेत. या दिवसांसाठी, विशेषतः शनिवार-रविवारी, मंगल कार्यालये, केटरर, गुरुजी आणि फोटोग्राफर सगळ्यात आधी बुक होतील.

## चार आठवड्यांचे नियोजन

1. **आता (ऑक्टोबर):** बायोडाटा देवाणघेवाण आणि पत्रिका जुळवणे. [मोफत बायोडाटा बनवा](/marathi/create/) आणि पहिल्या तपासणीसाठी [गुण मिलन](${path("gunaMilan", "mr")}) करा.
2. **ऑक्टोबरअखेर:** वरच्या तक्त्यातून दोन-तीन तारखा निवडून गुरुजींकडे जा.
3. **तारीख ठरताच:** मंगल कार्यालय बुक करा. 21 नोव्हेंबर, 5-6 डिसेंबर आणि 12 डिसेंबरसारखे शनिवार-रविवार आधी भरतात.
4. **तीन आठवडे आधी:** निमंत्रण पाठवा. आमच्या [लग्नपत्रिका मेकर](${path("invitation", "mr")}) ने पत्रिका मोफत बनवा.

डिसेंबर 2027 पर्यंतच्या प्रत्येक महिन्यासाठी [लग्न मुहूर्त 2026-2027 साधन](${path("muhurat", "mr")}) उघडा.
`,
    faqs: [
      {
        q: "नोव्हेंबर 2026 मध्ये लग्नाच्या तारखा कोणत्या?",
        a: `उत्तर भारतीय पंचांगानुसार ${dateList(inRange(ndNorth, "2026-11-01", "2026-11-30"), "mr")}. मराठी पंचांगातील तारखा अजून दोन स्रोतांनी पक्क्या झालेल्या नाहीत, त्यामुळे गुरुजींना जरूर विचारा.`,
      },
      {
        q: "डिसेंबर 2026 मध्ये लग्न मुहूर्त कधी आहेत?",
        a: `उत्तर भारतीय पंचांगानुसार ${dateList(inRange(ndNorth, "2026-12-01", "2026-12-31"), "mr")}. 16 डिसेंबरपासून धनुर्मास सुरू होतो.`,
      },
      {
        q: "तुळशी विवाह 2026 कधी आहे?",
        a: "प्रबोधिनी एकादशी शुक्रवार 20 नोव्हेंबर 2026 रोजी आहे आणि तुळशी विवाह शनिवार 21 नोव्हेंबर 2026 रोजी. त्यानंतर लग्नसराई सुरू होते.",
      },
      {
        q: "धनुर्मासात लग्न करता येते का?",
        a: "बहुतेक पंचांग धनुर्मासात (16 डिसेंबर 2026 ते 14 जानेवारी 2027) लग्न मुहूर्त देत नाहीत. त्यानंतरचा पहिला उत्तर भारतीय मुहूर्त 15 जानेवारी 2027 आहे.",
      },
    ],
    updated,
  },

  /* ===== January–March 2027 ===== */
  {
    lang: "en",
    topic: "weddingDatesJanMar2027",
    slug: "wedding-dates-january-february-march-2027",
    title: "Wedding Dates January, February & March 2027 – Vivah Muhurat List",
    description: `Hindu wedding dates from Makar Sankranti to Holi 2027: ${jmNorth.length} North Indian dates with nakshatra and timings, plus Mithila and Bengali panchang dates.`,
    h1: "Wedding Dates in January, February and March 2027",
    lead: "After Kharmas ends on Makar Sankranti, weddings resume in mid-January 2027 and run until Holashtak in mid-March. These are the auspicious dates month by month.",
    sample: { gender: "boy", templateId: "haldi-mangal" },
    body: `
## The Magh–Phalgun season

Kharmas ends with Makar Sankranti on 14 January 2027, and the first North Indian wedding muhurat follows the next day, **15 January**. The season then runs through Magh and Phalgun until **14 March**. From 15 March the Sun is in Pisces (Meen Kharmas), and Holashtak, the eight days before Holika Dahan on 21 March, falls inside it, so there are no dates again until mid-April.

Jupiter stays in Leo (Simhastha Guru) until 24 January 2027. If your family avoids weddings in Simhastha, the season starts for you on 26 January.

## North India dates (Hindi panchangs)

There are ${jmNorth.length} dates. The times are for New Delhi.

${northTable(JM.from, JM.to, "en")}

Points to note:

- **18 January** has a muhurat of only a few minutes in the evening. Treat it as a date for small, carefully timed ceremonies.
- **February** has the most dates, and several of them (3, 10, 11 and 28 February) have long daytime muhurats, which suits daytime weddings.
- **3 March** is an early-morning muhurat that actually begins after midnight; the following day, 4 March, is auspicious almost all day.

## Mithila panchang dates

The Mithila Vishwavidyalaya Panchang gives ${jmMithila.length} dates in these three months:

${monthTable(jmMithila, JM.from, JM.to, "en", "none")}

See the whole year in [Mithila panchang marriage dates 2026-27](${path("mithilaMuhurat", "en")}).

## Bengali panjika dates

Beni Madhab Sil's Full Panjika 1433 gives ${jmBengal.length} dates in Magh and Falgun: ${dateList(jmBengal, "en")}. Poush (mid-December to mid-January) and Chaitra (mid-March to mid-April) carry no wedding dates. Details are in [Bengali marriage dates 2026-27](${path("bengaliMuhurat", "en")}).

## Dates in every list

${dateList(jmCommon, "en")} appear in the North Indian, Mithila and Bengali lists alike, so expect these to be the busiest days of the season.

## Planning tips

- January weddings in North India can be very cold in the evening. If you choose an evening muhurat, plan heaters for the mandap and a shorter outdoor programme.
- February is also exam season. If younger cousins are in Class 10 or 12, check board exam dates before fixing the day.
- Fix the date by mid-December so the invitation can go out right after Makar Sankranti. Make it free with our [wedding invitation maker](${path("invitation", "en")}).

Still exchanging biodata? [Make your biodata free](/create/) and try [kundali matching](${path("gunaMilan", "en")}). For all months up to December 2027, use the [vivah muhurat 2026-2027 tool](${path("muhurat", "en")}).
`,
    faqs: [
      {
        q: "What are the wedding dates in January 2027?",
        a: `${dateList(inRange(jmNorth, "2027-01-01", "2027-01-31"), "en")}, after Kharmas ends on Makar Sankranti (14 January).`,
      },
      {
        q: "What are the wedding dates in February 2027?",
        a: `${dateList(inRange(jmNorth, "2027-02-01", "2027-02-28"), "en")} in the North Indian panchangs.`,
      },
      {
        q: "Are there wedding dates around Holi 2027?",
        a: "No. The last date is 14 March. Meen Kharmas runs from 15 March to 14 April 2027, and Holashtak (15–21 March) falls inside it. Weddings resume after mid-April.",
      },
    ],
    updated,
  },
  {
    lang: "hi",
    topic: "weddingDatesJanMar2027",
    slug: "shadi-muhurat-january-february-march-2027",
    title: "जनवरी, फरवरी, मार्च 2027 शादी के मुहूर्त – विवाह की शुभ तारीखें",
    description: `मकर संक्रांति से होली 2027 तक के विवाह मुहूर्त: उत्तर भारत की ${jmNorth.length} तारीखें नक्षत्र और समय के साथ, मिथिला पंचांग और बांग्ला पंजिका की तारीखें भी।`,
    h1: "जनवरी, फरवरी और मार्च 2027 में शादी के मुहूर्त",
    lead: "मकर संक्रांति पर खरमास खत्म होते ही जनवरी 2027 के बीच से शादियाँ फिर शुरू होंगी और मार्च के बीच होलाष्टक तक चलेंगी। महीनेवार सभी शुभ तारीखें यहाँ हैं।",
    sample: { gender: "boy", templateId: "haldi-mangal" },
    body: `
## माघ-फाल्गुन का सीज़न

14 जनवरी 2027 की मकर संक्रांति पर खरमास खत्म होगा और अगले ही दिन, **15 जनवरी** को, उत्तर भारत का पहला विवाह मुहूर्त है। सीज़न माघ और फाल्गुन से होता हुआ **14 मार्च** तक चलेगा। 15 मार्च से सूर्य मीन राशि में (मीन खरमास) होंगे, और 21 मार्च के होलिका दहन से पहले का होलाष्टक भी इसी में पड़ता है। इसलिए अप्रैल के बीच तक फिर कोई मुहूर्त नहीं है।

गुरु 24 जनवरी 2027 तक सिंह राशि में (सिंहस्थ गुरु) रहेंगे। अगर आपका परिवार सिंहस्थ में विवाह नहीं करता, तो आपके लिए सीज़न 26 जनवरी से शुरू होगा।

## उत्तर भारत की तारीखें (हिंदी पंचांग)

कुल ${jmNorth.length} तारीखें हैं। समय नई दिल्ली का है।

${northTable(JM.from, JM.to, "hi")}

ध्यान देने वाली बातें:

- **18 जनवरी** को शाम का मुहूर्त सिर्फ़ कुछ मिनट का है। इसे छोटे, समय से बँधे समारोह के लिए ही देखें।
- **फरवरी** में सबसे ज़्यादा तारीखें हैं, और कई तारीखों (3, 10, 11 और 28 फरवरी) पर दिन में लंबा मुहूर्त है, जो दिन की शादी के लिए अच्छा है।
- **3 मार्च** का मुहूर्त असल में आधी रात के बाद, भोर में है; अगले दिन 4 मार्च लगभग पूरा दिन शुभ है।

## मिथिला पंचांग की तारीखें

मिथिला विश्वविद्यालय पंचांग में इन तीन महीनों में ${jmMithila.length} लगन हैं:

${monthTable(jmMithila, JM.from, JM.to, "hi", "कोई नहीं")}

पूरे साल के लगन [मिथिला पंचांग विवाह मुहूर्त 2026-27](${path("mithilaMuhurat", "hi")}) में देखें।

## बांग्ला पंजिका की तारीखें

बेणीमाधव शील की फुल पंजिका 1433 में माघ और फाल्गुन में ${jmBengal.length} विवाह तिथियाँ हैं: ${dateList(jmBengal, "hi")}। पौष (मध्य दिसंबर से मध्य जनवरी) और चैत्र (मध्य मार्च से मध्य अप्रैल) में कोई तिथि नहीं है।

## जो तारीखें हर सूची में हैं

${dateList(jmCommon, "hi")} उत्तर भारत, मिथिला और बंगाल, तीनों सूचियों में शुभ हैं, इसलिए ये सीज़न के सबसे व्यस्त दिन होंगे।

## तैयारी के सुझाव

- जनवरी में उत्तर भारत की शामें बहुत ठंडी होती हैं। शाम का मुहूर्त चुनें तो मंडप के लिए हीटर और बाहर का छोटा कार्यक्रम रखें।
- फरवरी-मार्च में बोर्ड परीक्षाएँ भी होती हैं। घर में कोई 10वीं या 12वीं में है तो तारीख तय करने से पहले परीक्षा का टाइम-टेबल देख लें।
- तारीख दिसंबर के बीच तक तय कर लें ताकि मकर संक्रांति के तुरंत बाद कार्ड बँट सकें। कार्ड हमारे [शादी कार्ड मेकर](${path("invitation", "hi")}) से मुफ़्त बनाएँ।

अभी बायोडाटा का लेन-देन चल रहा है? [मुफ़्त बायोडाटा बनाएँ](/hindi/create/) और [कुंडली मिलान](${path("gunaMilan", "hi")}) देखें। दिसंबर 2027 तक के सभी महीनों के लिए [विवाह मुहूर्त 2026-2027 टूल](${path("muhurat", "hi")}) खोलें।
`,
    faqs: [
      {
        q: "जनवरी 2027 में शादी के मुहूर्त कब हैं?",
        a: `${dateList(inRange(jmNorth, "2027-01-01", "2027-01-31"), "hi")}। ये तारीखें 14 जनवरी की मकर संक्रांति पर खरमास खत्म होने के बाद हैं।`,
      },
      {
        q: "फरवरी 2027 में विवाह की शुभ तारीखें कौन-सी हैं?",
        a: `उत्तर भारतीय पंचांगों के अनुसार ${dateList(inRange(jmNorth, "2027-02-01", "2027-02-28"), "hi")}।`,
      },
      {
        q: "होली 2027 के आसपास शादी के मुहूर्त हैं?",
        a: "नहीं। आख़िरी तारीख 14 मार्च है। 15 मार्च से 14 अप्रैल 2027 तक मीन खरमास है और होलाष्टक (15–21 मार्च) भी इसी में पड़ता है। अप्रैल के बीच के बाद शादियाँ फिर शुरू होंगी।",
      },
    ],
    updated,
  },
  {
    lang: "mr",
    topic: "weddingDatesJanMar2027",
    slug: "lagna-muhurat-january-february-march-2027",
    title: "जानेवारी, फेब्रुवारी, मार्च 2027 लग्न मुहूर्त – लग्नाच्या शुभ तारखा",
    description: `मकर संक्रांती ते होळी 2027 मधील लग्न मुहूर्त: उत्तर भारतीय पंचांगातील ${jmNorth.length} तारखा नक्षत्र आणि वेळेसह, आणि मराठी पंचांगाबद्दल महत्त्वाची सूचना.`,
    h1: "जानेवारी, फेब्रुवारी आणि मार्च 2027 मधील लग्न मुहूर्त",
    lead: "मकर संक्रांतीला धनुर्मास संपल्यावर जानेवारी 2027 च्या मध्यापासून लग्ने पुन्हा सुरू होतील आणि मार्चच्या मध्यात होळाष्टकापर्यंत चालतील. महिनानिहाय सर्व शुभ तारखा येथे आहेत.",
    sample: { gender: "boy", templateId: "kesari-classic" },
    body: `
## माघ-फाल्गुनचा हंगाम

14 जानेवारी 2027 च्या मकर संक्रांतीला धनुर्मास संपतो आणि दुसऱ्याच दिवशी, **15 जानेवारी** ला, उत्तर भारतीय पंचांगातील पहिला लग्न मुहूर्त आहे. हा हंगाम माघ आणि फाल्गुन महिन्यांतून **14 मार्च** पर्यंत चालतो. 15 मार्चपासून सूर्य मीन राशीत (मीन खरमास) असतो, आणि 21 मार्चच्या होळीआधीचे होळाष्टकही याच काळात येते. त्यामुळे एप्रिलच्या मध्यापर्यंत पुन्हा मुहूर्त नाहीत.

गुरू 24 जानेवारी 2027 पर्यंत सिंह राशीत (सिंहस्थ) आहे. तुमचे घराणे सिंहस्थात लग्न टाळत असेल, तर तुमच्यासाठी हंगाम 26 जानेवारीपासून सुरू होतो.

## मराठी पंचांगाबद्दल

2027 साठी अजून एकही प्रकाशित मराठी यादी आम्हाला मिळालेली नाही. दाते, कालनिर्णय, महालक्ष्मी पंचांगांतील तारखा उत्तर भारतीय यादीपेक्षा वेगळ्या असू शकतात. त्यामुळे खालील तक्ता सुरुवात म्हणून वापरा आणि अंतिम तारीख गुरुजींकडून नक्की करा.

## उत्तर भारतीय पंचांगातील तारखा

एकूण ${jmNorth.length} तारखा आहेत. वेळ नवी दिल्लीची आहे.

${northTable(JM.from, JM.to, "mr")}

लक्षात ठेवण्यासारखे:

- **18 जानेवारी** ला संध्याकाळचा मुहूर्त फक्त काही मिनिटांचा आहे.
- **फेब्रुवारी** मध्ये सर्वाधिक तारखा आहेत, आणि अनेक तारखांना (3, 10, 11 आणि 28 फेब्रुवारी) दिवसा मोठा मुहूर्त आहे, जो दिवसाच्या लग्नासाठी सोयीचा आहे.
- **3 मार्च** चा मुहूर्त प्रत्यक्षात मध्यरात्रीनंतर, पहाटे आहे; दुसऱ्या दिवशी 4 मार्च जवळजवळ दिवसभर शुभ आहे.

## नियोजनासाठी काही सूचना

- फेब्रुवारी-मार्चमध्ये दहावी-बारावीच्या बोर्ड परीक्षा असतात. घरात कोणी परीक्षार्थी असेल तर तारीख ठरवण्याआधी वेळापत्रक पाहा.
- तारीख डिसेंबरच्या मध्यापर्यंत ठरवा, म्हणजे मकर संक्रांतीनंतर लगेच पत्रिका वाटता येतील. [लग्नपत्रिका मेकर](${path("invitation", "mr")}) ने पत्रिका मोफत बनवा.
- अजून स्थळे पाहत असाल तर [मोफत बायोडाटा बनवा](/marathi/create/) आणि [गुण मिलन](${path("gunaMilan", "mr")}) करा.

डिसेंबर 2027 पर्यंतच्या सर्व महिन्यांसाठी [लग्न मुहूर्त 2026-2027 साधन](${path("muhurat", "mr")}) उघडा.
`,
    faqs: [
      {
        q: "जानेवारी 2027 मध्ये लग्नाच्या तारखा कोणत्या?",
        a: `उत्तर भारतीय पंचांगानुसार ${dateList(inRange(jmNorth, "2027-01-01", "2027-01-31"), "mr")}. मकर संक्रांतीनंतर (14 जानेवारी) धनुर्मास संपतो.`,
      },
      {
        q: "फेब्रुवारी 2027 मध्ये लग्न मुहूर्त कधी आहेत?",
        a: `उत्तर भारतीय पंचांगानुसार ${dateList(inRange(jmNorth, "2027-02-01", "2027-02-28"), "mr")}. मराठी पंचांगातील तारखांसाठी गुरुजींना विचारा.`,
      },
      {
        q: "होळीच्या आसपास 2027 मध्ये लग्न मुहूर्त आहेत का?",
        a: "नाही. शेवटची तारीख 14 मार्च आहे. 15 मार्च ते 14 एप्रिल 2027 मीन खरमास आहे आणि होळाष्टक (15–21 मार्च) याच काळात येते.",
      },
    ],
    updated,
  },

  /* ===== Mithila ===== */
  {
    lang: "hi",
    topic: "mithilaMuhurat",
    slug: "mithila-panchang-vivah-muhurat-2026-27",
    title: `मिथिला पंचांग विवाह मुहूर्त 2026-27 – लगन की सभी ${MITHILA_CONFIRMED.length} तिथियाँ`,
    description: `मिथिला विश्वविद्यालय पंचांग 2026-27 के अनुसार विवाह के ${MITHILA_CONFIRMED.length} लगन, 22 नवंबर 2026 से 9 जुलाई 2027 तक, महीनेवार तालिका में।`,
    h1: "मिथिला पंचांग विवाह मुहूर्त 2026-27",
    lead: `कामेश्वर सिंह दरभंगा संस्कृत विश्वविद्यालय के पंचांग 2026-27 में विवाह के ${MITHILA_CONFIRMED.length} शुभ दिन हैं। लगन 22 नवंबर 2026 से शुरू होकर 9 जुलाई 2027 तक चलेंगे।`,
    sample: { gender: "girl", templateId: "maroon-heritage" },
    body: `
## मिथिला पंचांग क्या है

मिथिला क्षेत्र के मैथिल परिवार विवाह, उपनयन, मुंडन और द्विरागमन (गौना) जैसे संस्कारों की तिथि अपने क्षेत्रीय पंचांग से तय करते हैं। इसमें सबसे प्रचलित है कामेश्वर सिंह दरभंगा संस्कृत विश्वविद्यालय का **विश्वविद्यालय पंचांग**। इसकी तिथियाँ अक्सर बनारसी या उत्तर भारत के दूसरे पंचांगों से अलग होती हैं, इसलिए मिथिला में शादी हो तो यही सूची देखनी चाहिए।

## 2026-27 में लगन की तिथियाँ

इस साल विवाह के ${MITHILA_CONFIRMED.length} दिन हैं, जो पिछले साल के 45 दिनों से 18 ज़्यादा हैं।

${monthTable(MITHILA_CONFIRMED, MITHILA_ALL.from, MITHILA_ALL.to, "hi", "कोई नहीं")}

सबसे ज़्यादा लगन ${monthName(mithilaBusiest.k, "hi")} में हैं (${mithilaBusiest.n})। शादी का बड़ा सीज़न अप्रैल के आख़िर से जून तक है, जब गर्मी की छुट्टियों में दूर रहने वाले रिश्तेदार भी आ सकते हैं।

## सीज़न कैसे बँटा है

- **नवंबर-दिसंबर 2026:** 22 नवंबर से 14 दिसंबर तक ${inRange(MITHILA_CONFIRMED, ND.from, ND.to).length} लगन। इसके बाद खरमास।
- **जनवरी-मार्च 2027:** मकर संक्रांति के बाद 18 जनवरी से 11 मार्च तक ${inRange(MITHILA_CONFIRMED, JM.from, JM.to).length} लगन; फरवरी सबसे भरा महीना है।
- **अप्रैल-जुलाई 2027:** 10 अप्रैल से 9 जुलाई तक ${inRange(MITHILA_CONFIRMED, "2027-04-01", "2027-07-31").length} लगन। इसके बाद चातुर्मास।
- **नवंबर 2027 से:** ये तिथियाँ 2027-28 के पंचांग में आएँगी, जो आम तौर पर अप्रैल में जारी होता है।

## उत्तर भारत की सूची से तुलना

${MITHILA_CONFIRMED.length} में से ${mithilaAlsoNorth.length} तिथियाँ उत्तर भारत के हिंदी पंचांगों की सूची में भी हैं, बाकी ${mithilaOnly.length} सिर्फ़ मिथिला पंचांग में। उदाहरण के लिए 22 नवंबर और 30 नवंबर मिथिला में लगन हैं, जबकि उत्तर भारत की सूची में नहीं। उलटे, उत्तर भारत की 21 और 24 नवंबर मिथिला सूची में नहीं हैं। इसलिए मिथिला की शादी के लिए दूसरे राज्यों की सूची पर भरोसा न करें।

एक और फ़र्क: मिथिला पंचांग 10 अप्रैल 2027 को लगन देता है, जबकि उत्तर भारत के पंचांगों में 15 मार्च से 14 अप्रैल तक मीन खरमास के कारण कोई तिथि नहीं है।

## तिथि तय करने से पहले

1. ऊपर की तालिका से दो-तीन लगन चुनें और कुल के पंडित जी से वर-वधू की कुंडली के साथ मिलवाएँ। पंचांग में केवल तिथि है; लग्न का सही समय पंडित जी बताएँगे।
2. सिद्धांत (पंजी) और गोत्र मिलान की परंपरा निभानी हो तो उसके लिए भी समय रखें।
3. तिथि तय होते ही हॉल, बैंड और कैटरर बुक करें; मई-जून के लगन जल्दी भरते हैं।

रिश्ते की बात चल रही है तो [मुफ़्त बायोडाटा बनाएँ](/hindi/create/) और [कुंडली मिलान](${path("gunaMilan", "hi")}) देखें। मिथिला की सूची [विवाह मुहूर्त टूल](${path("muhurat", "hi")}) में "मिथिला" चुनकर भी देख सकते हैं, और नवंबर-दिसंबर की सभी सूचियाँ [नवंबर-दिसंबर 2026 शादी के मुहूर्त](${path("weddingDatesNovDec2026", "hi")}) में हैं।
`,
    faqs: [
      {
        q: "मिथिला पंचांग 2026-27 में विवाह के कितने लगन हैं?",
        a: `${MITHILA_CONFIRMED.length} लगन, 22 नवंबर 2026 से 9 जुलाई 2027 तक। यह पिछले साल के 45 लगनों से 18 ज़्यादा है।`,
      },
      {
        q: "मिथिला में नवंबर-दिसंबर 2026 के लगन कब हैं?",
        a: `${dateList(inRange(MITHILA_CONFIRMED, ND.from, ND.to), "hi")}।`,
      },
      {
        q: "मई 2027 में मिथिला पंचांग के लगन कौन-से हैं?",
        a: `${dateList(inRange(MITHILA_CONFIRMED, "2027-05-01", "2027-05-31"), "hi")}। यह साल का सबसे व्यस्त महीना है।`,
      },
      {
        q: "क्या मिथिला पंचांग की तिथियाँ बनारसी पंचांग जैसी हैं?",
        a: `नहीं, पूरी तरह नहीं। ${MITHILA_CONFIRMED.length} में से ${mithilaAlsoNorth.length} तिथियाँ उत्तर भारत की सूची में भी हैं, बाकी अलग हैं। मिथिला की शादी के लिए विश्वविद्यालय पंचांग ही देखें।`,
      },
    ],
    updated,
  },
  {
    lang: "en",
    topic: "mithilaMuhurat",
    slug: "mithila-panchang-marriage-dates-2026-27",
    title: `Mithila Panchang Marriage Dates 2026-27 – All ${MITHILA_CONFIRMED.length} Lagan Dates`,
    description: `All ${MITHILA_CONFIRMED.length} vivah lagan dates of the Mithila Vishwavidyalaya Panchang 2026-27, 22 Nov 2026 to 9 Jul 2027, month by month, and how they differ from North Indian lists.`,
    h1: "Mithila Panchang Marriage Dates 2026-27",
    lead: `The 2026-27 panchang of Kameshwar Singh Darbhanga Sanskrit University gives ${MITHILA_CONFIRMED.length} wedding days, from 22 November 2026 to 9 July 2027.`,
    sample: { gender: "girl", templateId: "maroon-heritage" },
    body: `
## The Mithila panchang

Maithili families in the Mithila region of Bihar fix weddings, upanayan, mundan and dwiragaman (gauna) by their own regional panchang. The most widely followed is the **Vishwavidyalaya Panchang** of Kameshwar Singh Darbhanga Sanskrit University. Its dates often differ from Banarasi and other North Indian panchangs, so for a Mithila wedding this is the list to use.

## All lagan dates, 2026-27

This year has ${MITHILA_CONFIRMED.length} wedding days, 18 more than last year's 45.

${monthTable(MITHILA_CONFIRMED, MITHILA_ALL.from, MITHILA_ALL.to, "en", "none")}

The busiest month is ${monthName(mithilaBusiest.k, "en")} with ${mithilaBusiest.n} dates. The big season runs from late April to June, when relatives working elsewhere can come during the summer holidays.

## How it compares with the North Indian list

${mithilaAlsoNorth.length} of the ${MITHILA_CONFIRMED.length} dates also appear in the North Indian (Hindi panchang) list; the other ${mithilaOnly.length} are Mithila-only. For example, 22 and 30 November are lagan days in Mithila but not in the North Indian list, while the North Indian 21 and 24 November are not Mithila dates. The Mithila panchang also gives 10 April 2027, which falls in the Meen Kharmas that North Indian panchangs keep free of weddings.

## Next year's dates

The 2026-27 panchang's last wedding date is 9 July 2027, after which Chaturmas begins. Dates from November 2027 onwards will be in the 2027-28 panchang, usually released in April.

## Before you fix the date

The panchang gives the date only. Your family pandit will fix the exact lagna time from both horoscopes. Shortlist two or three dates, keep time for the panji and gotra checks if your family follows them, and book the hall early for May and June.

[Make your biodata free](/create/), check [kundali matching](${path("gunaMilan", "en")}), or pick "Mithila" in the [vivah muhurat tool](${path("muhurat", "en")}).
`,
    faqs: [
      {
        q: "How many wedding dates are in the Mithila panchang 2026-27?",
        a: `${MITHILA_CONFIRMED.length}, from 22 November 2026 to 9 July 2027 – 18 more than the previous year's 45.`,
      },
      {
        q: "What are the Mithila wedding dates in November and December 2026?",
        a: `${dateList(inRange(MITHILA_CONFIRMED, ND.from, ND.to), "en")}.`,
      },
      {
        q: "Are Mithila panchang dates the same as Banarasi panchang dates?",
        a: `Not entirely. ${mithilaAlsoNorth.length} of the ${MITHILA_CONFIRMED.length} dates match the North Indian list; the rest differ. Use the university panchang for a Mithila wedding.`,
      },
    ],
    updated,
  },

  /* ===== Bengal ===== */
  {
    lang: "en",
    topic: "bengaliMuhurat",
    slug: "bengali-marriage-dates-2026-27",
    title: "Bengali Marriage Dates 2026-27 (1433) – Biyer Tarikh in Agrahayan, Magh, Falgun",
    description: `All ${BENGAL_CONFIRMED.length} Bengali wedding dates of 1433 from Agrahayan to Falgun (Nov 2026 – Mar 2027), with Bengali and English dates and weekdays.`,
    h1: "Bengali Marriage Dates 2026-27 (Bengali Year 1433)",
    lead: `Beni Madhab Sil's Full Panjika 1433 gives ${BENGAL_CONFIRMED.length} wedding dates in the winter season, from 4 Agrahayan (21 November 2026) to 29 Falgun (14 March 2027).`,
    sample: { gender: "girl", templateId: "kesari-classic" },
    body: `
## How Bengali wedding dates work

Bengali families follow the panjika, which runs on solar months from Boishakh (mid-April) to Chaitra (mid-April of the next year). The wedding season after the monsoon falls in **Agrahayan, Magh and Falgun**. Poush, from mid-December to mid-January, and Chaitra carry no wedding dates. Bengali panjikas set their own rules, so their dates differ from North Indian lists in places.

The best-known panjikas – Gupta Press, Beni Madhab Sil and Bisuddha Siddhanta – can differ from each other by a day or two. The dates below are from Beni Madhab Sil's Full Panjika for 1433.

## All wedding dates, Agrahayan to Falgun 1433

${bengalTable(BENGAL_CONFIRMED, "en")}

By month: ${inRange(BENGAL_CONFIRMED, ND.from, ND.to).length} dates in Agrahayan, ${BENGAL_CONFIRMED.filter((d) => d.bengali?.[0] === "Magh").length} in Magh and ${BENGAL_CONFIRMED.filter((d) => d.bengali?.[0] === "Falgun").length} in Falgun.

## Additional Kartik dates

The panjika also lists a few Kartik dates as additional (atirikta) dates, before the main season:

${bengalTable(BENGAL_SOME, "en")}

Many families do not use additional dates, so ask your purohit.

## Lagna times

Each date has one or more lagnas. Bengali lagnas are often in the evening or late at night, and a date can have a lagna of only an hour or two. Fix the exact lagna with your purohit before you book the hall and tell the guests the time.

## 1434 dates (from April 2027)

Dates from Poila Boishakh (mid-April 2027) onwards will be in the 1434 panjika. Until it is out, we do not list summer 2027 dates.

## Plan the season

- Weekend dates such as 21 November, 5, 12 and 13 December, and 14 March fill up first.
- ${dateList(common(BENGAL_CONFIRMED, NORTH_CONFIRMED), "en")} are also auspicious in North Indian lists, which matters for mixed families and for booking pandits and caterers who serve both.

[Make your biodata free](/create/), check [kundali matching](${path("gunaMilan", "en")}), or pick "Bengal" in the [vivah muhurat tool](${path("muhurat", "en")}).
`,
    faqs: [
      {
        q: "What are the Bengali marriage dates in Agrahayan 1433?",
        a: `${dateList(inRange(BENGAL_CONFIRMED, ND.from, ND.to), "en")} 2026 (4, 7, 8, 9, 18, 22, 24, 25 and 26 Agrahayan).`,
      },
      {
        q: "Are there Bengali wedding dates in Poush?",
        a: "No. Poush (mid-December 2026 to mid-January 2027) carries no wedding dates. The next date after 13 December 2026 is 3 Magh, 18 January 2027.",
      },
      {
        q: "What are the Bengali marriage dates in Magh and Falgun 1433?",
        a: `${dateList(inRange(BENGAL_CONFIRMED, JM.from, JM.to), "en")} 2027.`,
      },
    ],
    updated,
  },
];
