import { href, type Lang } from "@/lib/i18n";
import type { Topic } from "./types";

/** Slug of each topic per language. Kept separate from page bodies so client code can import it cheaply. */
export const TOPIC_SLUGS: Partial<Record<Topic, Partial<Record<Lang, string>>>> = {
  home: { en: "", hi: "", mr: "" },
  format: { en: "marriage-biodata-format", hi: "shadi-biodata-format", mr: "biodata-format" },
  girl: { en: "biodata-for-marriage-for-girl", hi: "ladki-ka-biodata", mr: "mulicha-biodata" },
  boy: { en: "biodata-for-marriage-for-boy", hi: "ladke-ka-biodata", mr: "mulacha-biodata" },
  guide: { en: "what-to-write-in-marriage-biodata", hi: "biodata-kaise-banaye", mr: "lagnacha-biodata-kasa-banvaycha" },
  samples: { en: "marriage-biodata-word-format", hi: "shadi-biodata-pdf-word", mr: "biodata-namuna" },
  hindu: { en: "hindu-marriage-biodata", mr: "hindu-biodata" },
  jain: { en: "jain-marriage-biodata", mr: "jain-biodata" },
  buddhist: { mr: "buddhist-biodata" },
  muslim: { en: "muslim-marriage-biodata", hi: "muslim-biodata" },
  christian: { en: "christian-marriage-biodata" },
  sikh: { en: "sikh-marriage-biodata" },
  brahmin: { en: "brahmin-marriage-biodata" },
  secondMarriage: { en: "biodata-for-second-marriage", mr: "dusrya-lagnasathi-biodata" },
  withoutPhoto: { en: "marriage-biodata-without-photo" },
  tools: { en: "biodata-tools", hi: "tools", mr: "sadhane" },
  gunaMilan: { en: "kundali-matching", hi: "kundli-milan", mr: "gun-milan" },
  birthChart: { en: "rashi-nakshatra-calculator", hi: "rashi-nakshatra-kaise-jane", mr: "rashi-nakshatra-shodha" },
  invitation: { en: "wedding-invitation-maker", hi: "shadi-card-maker", mr: "lagna-patrika-maker" },
  muhurat: { en: "vivah-muhurat-2026-2027", hi: "vivah-muhurat-2026-2027", mr: "lagna-muhurat-2026-2027" },
  whatsapp: { en: "biodata-for-whatsapp", hi: "whatsapp-biodata", mr: "whatsapp-biodata" },
  typing: { en: "english-to-marathi-hindi-typing", hi: "hindi-typing", mr: "marathi-typing" },
  height: { en: "height-converter", hi: "height-converter", mr: "height-converter" },
  ageGap: { en: "age-gap-calculator", hi: "age-gap-calculator", mr: "age-gap-calculator" },
};

export function topicPath(topic: Topic, lang: Lang): string | undefined {
  if (topic === "create" || topic === "templates") return href(lang, `/${topic}`);
  const slug = TOPIC_SLUGS[topic]?.[lang];
  return slug === undefined ? undefined : href(lang, slug ? `/${slug}` : "/");
}

export function topicOf(lang: Lang, slug: string): Topic | undefined {
  if (slug === "create" || slug === "templates") return slug;
  return (Object.keys(TOPIC_SLUGS) as Topic[]).find((t) => TOPIC_SLUGS[t]?.[lang] === slug);
}
