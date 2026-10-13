import type { Lang } from "@/lib/i18n";
import type { BengaliMonth } from "./muhurat-data";

/** Names shared by the muhurat tool and the wedding-date articles. */

export const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
};
export const MONTHS_SHORT: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  hi: MONTHS.hi,
  mr: MONTHS.mr,
};
export const WEEKDAYS: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  mr: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
};

export const NAKSHATRA: Record<string, { hi: string; mr: string }> = {
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
export const TITHI: Record<string, { hi: string; mr: string }> = {
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

export const BENGALI_MONTH: Record<BengaliMonth, Record<Lang, string>> = {
  Kartik: { en: "Kartik", hi: "कार्तिक", mr: "कार्तिक" },
  Agrahayan: { en: "Agrahayan", hi: "अग्रहायण", mr: "अग्रहायण" },
  Magh: { en: "Magh", hi: "माघ", mr: "माघ" },
  Falgun: { en: "Falgun", hi: "फाल्गुन", mr: "फाल्गुन" },
};

const pad = (n: number) => String(n).padStart(2, "0");

export const localName = (map: Record<string, { hi: string; mr: string }>, name: string, lang: Lang) =>
  lang === "en" ? name : (map[name]?.[lang] ?? name);

export function fmtTime(hhmm: string, lang: Lang): string {
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
