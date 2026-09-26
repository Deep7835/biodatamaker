/**
 * Ashtakoot Guna Milan (36-point North-Indian kundali matching): pure scoring logic.
 *
 * Indices used throughout:
 *   nakshatra 0 = Ashwini … 26 = Revati; rashi 0 = Mesha … 11 = Meena; charan (pada) 1–4.
 *
 * Tables were compiled from and cross-checked against several published references (Sept 2026):
 *   - saravali.github.io/astrology/koota_*.html (yoni, vashya, gana tables)
 *   - PyJHora, src/jhora/horoscope/match/compatibility.py (github.com/naturalstupid/PyJHora)
 *   - astroyogi.com, anytimeastro.com and instaastro.com Vasya Koota articles (same vashya table)
 *   - mohitmrinal.com/blog/four.php (yoni and graha maitri matrices)
 *   - hi.tryxyz.com "वर-वधू मिलान में गण विचार" (gana points with वर/कन्या wording)
 *   - rahasyavedicastrology.com/dina-kuta (tara method), astroguidence.blogspot.com (graha friendships)
 * Where the sources genuinely disagree, the choice made is noted next to the table.
 */
import { FIELDS, RASHI, type Biodata } from "../biodata";

export type KootKey = "varna" | "vashya" | "tara" | "yoni" | "maitri" | "gana" | "bhakoot" | "nadi";
export const KOOT_KEYS: KootKey[] = ["varna", "vashya", "tara", "yoni", "maitri", "gana", "bhakoot", "nadi"];
export const KOOT_MAX: Record<KootKey, number> = { varna: 1, vashya: 2, tara: 3, yoni: 4, maitri: 5, gana: 6, bhakoot: 7, nadi: 8 };

export type Person = {
  /** 0–26 */
  nak: number;
  /** 1–4, or null when unknown (then `rashi` must be one the nakshatra spans). */
  charan: number | null;
  /** 0–11 */
  rashi: number;
};

/* ---------- Nakshatra → rashi ---------- */

/** Each nakshatra has 4 padas of 3°20′; nine padas make one rashi. */
export const rashiOf = (nak: number, charan: number) => Math.floor((nak * 4 + charan - 1) / 9);

/** The rashis a nakshatra falls in (one, or two when it straddles a rashi boundary). */
export function rashiOptions(nak: number): number[] {
  const a = rashiOf(nak, 1);
  const b = rashiOf(nak, 4);
  return a === b ? [a] : [a, b];
}

/** Charans (padas) of a nakshatra that lie in the given rashi. */
export function charansIn(nak: number, rashi: number): number[] {
  return [1, 2, 3, 4].filter((c) => rashiOf(nak, c) === rashi);
}

/** Keeps a person consistent: a known charan fixes the rashi; otherwise the rashi must be one the nakshatra spans. */
export function normalizePerson(p: Person): Person {
  if (p.charan && p.charan >= 1 && p.charan <= 4) return { ...p, rashi: rashiOf(p.nak, p.charan) };
  const opts = rashiOptions(p.nak);
  return { ...p, charan: null, rashi: opts.includes(p.rashi) ? p.rashi : opts[0] };
}

/* ---------- Attribute tables ---------- */

/** Varna by rashi: 0 Brahmin (water signs), 1 Kshatriya (fire), 2 Vaishya (earth), 3 Shudra (air). All sources agree. */
export const VARNA_OF_RASHI = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0];

/**
 * Vashya groups: 0 Chatushpada (quadruped), 1 Manava/Nara (human), 2 Jalachara (water), 3 Vanachara (wild, Leo), 4 Keeta (insect).
 * Classical split used by astroyogi, anytimeastro, instaastro and PyJHora: Dhanu first half Manava, second half
 * Chatushpada; Makara first half Chatushpada, second half Jalachara. (A few sites swap the Makara halves or put
 * Dhanu's second half in Vanachara; we follow the majority.) Dhanu and Makara are resolved in vashyaOf().
 */
const VASHYA_OF_RASHI = [0, 0, 1, 2, 3, 1, 1, 4, -1, -1, 1, 2];

/**
 * Vashya points, rows = bride's group, columns = groom's group (order as above).
 * This table is published identically by astroyogi.com, anytimeastro.com ("Bride \ Groom") and instaastro.com,
 * and is one of the two variants shipped in PyJHora. Other sources (saravali) use a stricter variant; vashya is the
 * koot where published tables differ most, so treat its 2 points as indicative.
 */
const VASHYA_POINTS = [
  [2, 1, 1, 1.5, 1],
  [1, 2, 1.5, 0, 1],
  [1, 1.5, 2, 1, 1],
  [0, 0, 0, 2, 0],
  [1, 1, 1, 0, 2],
];

/** Yoni animal per nakshatra: 0 Horse, 1 Elephant, 2 Sheep, 3 Serpent, 4 Dog, 5 Cat, 6 Rat, 7 Cow, 8 Buffalo, 9 Tiger, 10 Deer, 11 Monkey, 12 Mongoose, 13 Lion. */
export const YONI_OF_NAK = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];

/**
 * Yoni points (symmetric). This is the widely circulated 14×14 table (saravali, PyJHora, mohitmrinal).
 * The saravali copy has two asymmetric cells (Horse row/Deer column 3 vs Deer row/Horse column 1; Lion row/Buffalo
 * column 2 vs Buffalo row/Lion column 1); like PyJHora we use the symmetric value 1 for both pairs.
 * The 0s are the seven classic enemy pairs: Horse–Buffalo, Elephant–Lion, Sheep–Monkey, Serpent–Mongoose,
 * Dog–Deer, Cat–Rat, Cow–Tiger.
 */
const YONI_POINTS = [
  [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 1, 3, 2, 1],
  [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0],
  [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1],
  [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2],
  [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1],
  [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1],
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2],
  [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1],
  [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1],
  [1, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1],
  [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2],
  [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2],
  [1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4],
];

/** Rashi lord: 0 Sun, 1 Moon, 2 Mars, 3 Mercury, 4 Jupiter, 5 Venus, 6 Saturn. */
export const LORD_OF_RASHI = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];

/**
 * Natural (naisargika) friendships: for each planet, its view of every other planet. 1 friend, 0 neutral, -1 enemy.
 * Standard Parashari table (all sources agree).
 */
export const FRIENDSHIP = [
  // Su Mo Ma Me Ju Ve Sa
  [0, 1, 1, 0, 1, -1, -1], // Sun: friends Moon, Mars, Jupiter; neutral Mercury; enemies Venus, Saturn
  [1, 0, 0, 1, 0, 0, 0], // Moon: friends Sun, Mercury; rest neutral
  [1, 1, 0, -1, 1, 0, 0], // Mars: friends Sun, Moon, Jupiter; neutral Venus, Saturn; enemy Mercury
  [1, -1, 0, 0, 0, 1, 0], // Mercury: friends Sun, Venus; enemy Moon
  [1, 1, 1, -1, 0, -1, 0], // Jupiter: friends Sun, Moon, Mars; enemies Mercury, Venus; neutral Saturn
  [-1, -1, 0, 1, 0, 0, 1], // Venus: friends Mercury, Saturn; enemies Sun, Moon
  [-1, -1, -1, 1, 0, 1, 0], // Saturn: friends Mercury, Venus; neutral Jupiter; enemies Sun, Moon, Mars
];

/**
 * Graha maitri points between the two rashi lords (symmetric; identical in PyJHora and mohitmrinal):
 * same lord or mutual friends 5, friend+neutral 4, both neutral 3, friend+enemy 1, neutral+enemy 0.5, mutual enemies 0.
 */
const MAITRI_POINTS = [
  [5, 5, 5, 4, 5, 0, 0],
  [5, 5, 4, 1, 4, 0.5, 0.5],
  [5, 4, 5, 0.5, 5, 3, 0.5],
  [4, 1, 0.5, 5, 0.5, 5, 4],
  [5, 4, 5, 0.5, 5, 0.5, 3],
  [0, 0.5, 3, 5, 0.5, 5, 5],
  [0, 0.5, 0.5, 4, 3, 5, 5],
];

/** Gana per nakshatra: 0 Deva, 1 Manushya, 2 Rakshasa (same as src/lib/biodata.ts). */
export const GANA_OF_NAK = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];

/**
 * Gana points, rows = GROOM's gana, columns = BRIDE's gana.
 * Hindi texts (hi.tryxyz.com, citing Ram Sundar Vaidya) state it with वर/कन्या explicitly: groom Deva + bride
 * Manushya = 6 ("वर का गण श्रेष्ठ"), groom Manushya + bride Deva = 5, groom Rakshasa + bride Deva = 1, other mixed
 * pairs with Rakshasa = 0. saravali, astroyogi and PyJHora print the same numbers but label the rows as the bride's,
 * which swaps the 6/5 and 1/0 cells; we follow the explicit वर/कन्या wording.
 */
const GANA_POINTS = [
  [6, 6, 0],
  [5, 6, 0],
  [1, 0, 6],
];

/** Nadi per nakshatra: 0 Adi (Vata), 1 Madhya (Pitta), 2 Antya (Kapha) (same as src/lib/biodata.ts). */
export const NADI_OF_NAK = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];

/* ---------- Per-koot helpers ---------- */

/**
 * Vashya group of a person. For Dhanu and Makara the half of the sign is found from where the nakshatra (or its
 * charan, when known) sits inside the rashi, in pada units (9 padas = 30°, so the 15° midpoint is 4.5 padas).
 * The single pada that straddles 15° (Purva Ashadha 1 in Dhanu, Shravana 2 in Makara) counts as first half.
 * Without a charan, the half holding most of the nakshatra's portion in that rashi is used.
 */
export function vashyaOf(p: Person): number {
  const base = VASHYA_OF_RASHI[p.rashi];
  if (base >= 0) return base;
  const start = p.rashi * 9;
  let mid: number;
  if (p.charan) mid = p.nak * 4 + p.charan - 1 - start + 0.5;
  else {
    const cs = charansIn(p.nak, p.rashi);
    const lo = p.nak * 4 + cs[0] - 1 - start;
    const hi = p.nak * 4 + cs[cs.length - 1] - 1 - start + 1;
    mid = (lo + hi) / 2;
  }
  const firstHalf = mid <= 4.5 + 1e-9;
  if (p.rashi === 8) return firstHalf ? 1 : 0; // Dhanu: Manava | Chatushpada
  return firstHalf ? 0 : 2; // Makara: Chatushpada | Jalachara
}

/** Count from one nakshatra to another, inclusive (1–27). */
export const countStars = (from: number, to: number) => ((to - from + 27) % 27) + 1;
/** Tara number 1–9: 1 Janma, 2 Sampat, 3 Vipat, 4 Kshema, 5 Pratyari, 6 Sadhaka, 7 Vadha, 8 Mitra, 9 Ati-mitra. */
export const taraNumber = (from: number, to: number) => countStars(from, to) % 9 || 9;
/**
 * Vipat (3), Pratyari (5) and Vadha (7) are the inauspicious taras. Some texts also treat Janma (1) as
 * unfavourable ("even remainders only"); most calculators and the rashi-level tables count it as neutral/good,
 * which is what we do.
 */
const BAD_TARA = [3, 5, 7];

/** Count from one rashi to another, inclusive (1–12). */
export const countRashi = (from: number, to: number) => ((to - from + 12) % 12) + 1;

export type BhakootKind = "1-1" | "1-7" | "3-11" | "4-10" | "2-12" | "5-9" | "6-8";
export function bhakootKind(brideRashi: number, groomRashi: number): BhakootKind {
  const d = countRashi(brideRashi, groomRashi);
  const a = Math.min(d, 14 - d);
  if (d === 1) return "1-1";
  return (["", "", "2-12", "3-11", "4-10", "5-9", "6-8", "1-7"] as const)[a] as BhakootKind;
}
const BAD_BHAKOOT: BhakootKind[] = ["2-12", "5-9", "6-8"];

/* ---------- Main scoring ---------- */

export type Band = "low" | "average" | "good" | "excellent";
/** Commonly cited bands: below 18 not recommended, 18–24 average, 25–32 good, 33–36 excellent. Half points round down into the lower band. */
export function bandOf(total: number): Band {
  if (total < 18) return "low";
  if (total < 25) return "average";
  if (total < 33) return "good";
  return "excellent";
}

export type KootScore = { key: KootKey; score: number; max: number };

export type MatchResult = {
  koots: KootScore[];
  total: number;
  band: Band;
  bride: Person;
  groom: Person;
  /** Attributes of each side, as indices into the tables above (for display). */
  attrs: {
    varna: [number, number];
    vashya: [number, number];
    yoni: [number, number];
    lord: [number, number];
    gana: [number, number];
    nadi: [number, number];
  };
  /** Tara counted from the bride's nakshatra to the groom's, and from the groom's to the bride's (1–9). */
  tara: { fromBride: number; fromGroom: number };
  bhakoot: BhakootKind;
  doshas: {
    /** Same nadi: Nadi scores 0. */
    nadi: boolean;
    /** 2/12, 6/8 or 5/9 rashi placement: Bhakoot scores 0. */
    bhakoot: boolean;
    /** One partner Rakshasa gana and the other not (Gana 0 or 1). */
    gana: boolean;
  };
  /**
   * Classical cancellation conditions that are present. Shown as information only; the score is NOT changed,
   * because traditions differ on when these apply.
   */
  exceptions: {
    nadi: ("sameRashiDiffNak" | "sameNakDiffRashi" | "sameNakDiffCharan")[];
    bhakoot: ("sameLord" | "friendlyLords")[];
    gana: ("friendlyLords")[];
  };
};

export function matchGuna(brideIn: Person, groomIn: Person): MatchResult {
  const bride = normalizePerson(brideIn);
  const groom = normalizePerson(groomIn);

  const varna: [number, number] = [VARNA_OF_RASHI[bride.rashi], VARNA_OF_RASHI[groom.rashi]];
  // 1 point when the groom's varna is the same as or higher than the bride's (lower index = higher varna).
  const varnaScore = varna[1] <= varna[0] ? 1 : 0;

  const vashya: [number, number] = [vashyaOf(bride), vashyaOf(groom)];
  const vashyaScore = VASHYA_POINTS[vashya[0]][vashya[1]];

  const tara = { fromBride: taraNumber(bride.nak, groom.nak), fromGroom: taraNumber(groom.nak, bride.nak) };
  const taraScore = (BAD_TARA.includes(tara.fromBride) ? 0 : 1.5) + (BAD_TARA.includes(tara.fromGroom) ? 0 : 1.5);

  const yoni: [number, number] = [YONI_OF_NAK[bride.nak], YONI_OF_NAK[groom.nak]];
  const yoniScore = YONI_POINTS[yoni[0]][yoni[1]];

  const lord: [number, number] = [LORD_OF_RASHI[bride.rashi], LORD_OF_RASHI[groom.rashi]];
  const maitriScore = MAITRI_POINTS[lord[0]][lord[1]];

  const gana: [number, number] = [GANA_OF_NAK[bride.nak], GANA_OF_NAK[groom.nak]];
  const ganaScore = GANA_POINTS[gana[1]][gana[0]];

  const bhakoot = bhakootKind(bride.rashi, groom.rashi);
  const bhakootScore = BAD_BHAKOOT.includes(bhakoot) ? 0 : 7;

  const nadi: [number, number] = [NADI_OF_NAK[bride.nak], NADI_OF_NAK[groom.nak]];
  const nadiScore = nadi[0] === nadi[1] ? 0 : 8;

  const scores: Record<KootKey, number> = {
    varna: varnaScore,
    vashya: vashyaScore,
    tara: taraScore,
    yoni: yoniScore,
    maitri: maitriScore,
    gana: ganaScore,
    bhakoot: bhakootScore,
    nadi: nadiScore,
  };
  const koots = KOOT_KEYS.map((key) => ({ key, score: scores[key], max: KOOT_MAX[key] }));
  const total = koots.reduce((s, k) => s + k.score, 0);

  const doshas = {
    nadi: nadiScore === 0,
    bhakoot: bhakootScore === 0,
    gana: gana[0] !== gana[1] && (gana[0] === 2 || gana[1] === 2),
  };

  const sameLord = lord[0] === lord[1];
  const friendlyLords = !sameLord && maitriScore === 5;
  const exceptions: MatchResult["exceptions"] = { nadi: [], bhakoot: [], gana: [] };
  if (doshas.nadi) {
    if (bride.rashi === groom.rashi && bride.nak !== groom.nak) exceptions.nadi.push("sameRashiDiffNak");
    if (bride.nak === groom.nak && bride.rashi !== groom.rashi) exceptions.nadi.push("sameNakDiffRashi");
    if (bride.nak === groom.nak && bride.rashi === groom.rashi && bride.charan && groom.charan && bride.charan !== groom.charan)
      exceptions.nadi.push("sameNakDiffCharan");
  }
  if (doshas.bhakoot) {
    if (sameLord) exceptions.bhakoot.push("sameLord");
    if (friendlyLords) exceptions.bhakoot.push("friendlyLords");
  }
  if (doshas.gana && (sameLord || friendlyLords)) exceptions.gana.push("friendlyLords");

  return { koots, total, band: bandOf(total), bride, groom, attrs: { varna, vashya, yoni, lord, gana, nadi }, tara, bhakoot, doshas, exceptions };
}

/* ---------- Reading values typed in any language (biodata draft) ---------- */

const NAK_ALIASES: string[][] = [
  ["Ashwini", "Ashvini", "Aswini", "Asvini"],
  ["Bharani"],
  ["Krittika", "Kritika", "Kruttika", "Karthika", "Kartika", "कृतिका"],
  ["Rohini"],
  ["Mrigashira", "Mrigashirsha", "Mrigasira", "Mrugashira", "Mrig", "Mriga", "Mrug", "मृग", "मृगशीर्ष", "मृगशीर्षा"],
  ["Ardra", "Arudra", "Aridra", "आद्रा"],
  ["Punarvasu", "Punarvashu", "पुनर्वसू"],
  ["Pushya", "Pushyami", "Pooyam"],
  ["Ashlesha", "Aslesha", "Ayilyam", "अश्लेषा"],
  ["Magha", "Makha", "Magh"],
  ["Purva Phalguni", "Poorva Phalguni", "Purvaphalguni", "Pubba", "पूर्वाफाल्गुनी"],
  ["Uttara Phalguni", "Uttaraphalguni", "उत्तराफाल्गुनी"],
  ["Hasta", "Hast", "Hastha"],
  ["Chitra", "Chitta", "Chithira"],
  ["Swati", "Svati", "Swathi", "स्वाती"],
  ["Vishakha", "Visakha", "Vishaka", "Vishakam"],
  ["Anuradha", "Anuradham", "Anusham"],
  ["Jyeshtha", "Jyeshta", "Jyestha", "Jyeshtaa", "Kettai", "ज्येष्ठ"],
  ["Mula", "Moola", "Mool", "Moolam", "मूळ"],
  ["Purva Ashadha", "Purvashadha", "Poorvashadha", "Purvashada", "Poorvashada", "Purva Shadha", "पूर्वाषाढ़ा", "पूर्वाषाढा"],
  ["Uttara Ashadha", "Uttarashadha", "Uttarashada", "Uttara Shadha", "उत्तराषाढ़ा", "उत्तराषाढा"],
  ["Shravana", "Sravana", "Shravan", "Shrawan", "Thiruvonam"],
  ["Dhanishta", "Dhanishtha", "Shravishtha", "Avittam"],
  ["Shatabhisha", "Satabhisha", "Shatabhishak", "Shatabhishaj", "Shatataraka", "शततारका", "शतभिषक"],
  ["Purva Bhadrapada", "Poorva Bhadrapada", "Purvabhadrapada", "Purvabhadra", "Poorvabhadra", "पूर्वाभाद्रपद", "पूर्वा भाद्रपदा", "पूर्वाभाद्रपदा"],
  ["Uttara Bhadrapada", "Uttarabhadrapada", "Uttarabhadra", "उत्तराभाद्रपद", "उत्तरा भाद्रपदा", "उत्तराभाद्रपदा"],
  ["Revati", "Revathi"],
];

const RASHI_ALIASES: string[][] = [
  ["Mesh", "Mesha", "Aries", "मेष"],
  ["Vrishabh", "Vrishabha", "Vrushabh", "Vrushabha", "Vrish", "Taurus", "वृषभ", "वृष"],
  ["Mithun", "Mithuna", "Gemini", "मिथुन"],
  ["Kark", "Karka", "Karkat", "Cancer", "कर्क"],
  ["Simha", "Sinh", "Singh", "Leo", "सिंह"],
  ["Kanya", "Virgo", "कन्या"],
  ["Tula", "Tul", "Libra", "तुला", "तूळ"],
  ["Vrishchik", "Vrishchika", "Vrushchik", "Scorpio", "वृश्चिक"],
  ["Dhanu", "Dhanus", "Dhanush", "Sagittarius", "धनु"],
  ["Makar", "Makara", "Capricorn", "मकर"],
  ["Kumbh", "Kumbha", "Aquarius", "कुंभ", "कुम्भ"],
  ["Meen", "Meena", "Pisces", "मीन"],
];

/** Loose key for comparing names typed in Latin or Devanagari script. */
function norm(s: string): string {
  let v = s.toLowerCase().normalize("NFC").replace(/़/g, "").replace(/[^a-zऀ-ॿ]/g, "");
  if (/[a-z]/.test(v)) {
    v = v.replace(/aa/g, "a").replace(/ee/g, "i").replace(/oo/g, "u").replace(/w/g, "v").replace(/sh/g, "s").replace(/th/g, "t").replace(/a$/, "");
  } else {
    v = v.replace(/ी/g, "ि").replace(/ू/g, "ु").replace(/ळ/g, "ल").replace(/[ंँ]/g, "").replace(/म्/g, "").replace(/ा$/, "");
  }
  return v;
}

function buildIndex(lists: string[][], extra: string[][]): Map<string, number> {
  const map = new Map<string, number>();
  const add = (name: string, i: number) => {
    const k = norm(name);
    if (k && !map.has(k)) map.set(k, i);
  };
  // Official lists first so that they win over looser aliases.
  for (const list of extra) list.forEach((name, i) => add(name, i));
  lists.forEach((names, i) => names.forEach((n) => add(n, i)));
  return map;
}

let nakIndex: Map<string, number> | null = null;
let rashiIndex: Map<string, number> | null = null;

function lookup(value: string, index: Map<string, number>): number {
  const v = value.trim();
  if (!v) return -1;
  const whole = index.get(norm(v));
  if (whole !== undefined) return whole;
  // "Kanya (Virgo)", "Hasta / हस्त", "Rohini – 2" …
  for (const part of v.split(/[()[\]/,|:;–—-]+/)) {
    const hit = index.get(norm(part));
    if (hit !== undefined) return hit;
  }
  return -1;
}

/** Nakshatra index (0–26) of a name in English, Hindi or Marathi (common spellings), or -1. */
export function parseNakshatra(value: string): number {
  nakIndex ??= buildIndex(NAK_ALIASES, [FIELDS.nakshatra.suggest!.en, FIELDS.nakshatra.suggest!.hi, FIELDS.nakshatra.suggest!.mr]);
  return lookup(value, nakIndex);
}

/** Rashi index (0–11) of a name in English, Hindi or Marathi, or -1. */
export function parseRashi(value: string): number {
  rashiIndex ??= buildIndex(RASHI_ALIASES, [RASHI.en, RASHI.hi, RASHI.mr]);
  return lookup(value, rashiIndex);
}

/** Charan 1–4 from "2", "२", "Charan 3" …, or null. */
export function parseCharan(value: string): number | null {
  const m = value.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))).match(/[1-4]/);
  return m ? Number(m[0]) : null;
}

/** Reads nakshatra / charan / rashi from a saved biodata draft (rows "horoscope-nakshatra" etc.). */
export function personFromBiodata(b: Biodata): { person: Person; hasRashi: boolean } | null {
  const rows = b.sections?.flatMap((s) => s.rows ?? []) ?? [];
  const val = (key: string) => rows.find((r) => r.id.split("-").slice(1).join("-") === key)?.value ?? "";
  const nak = parseNakshatra(val("nakshatra"));
  if (nak < 0) return null;
  const charan = parseCharan(val("charan"));
  const typedRashi = parseRashi(val("rashi"));
  const opts = rashiOptions(nak);
  if (charan) return { person: { nak, charan, rashi: rashiOf(nak, charan) }, hasRashi: true };
  const ok = opts.includes(typedRashi);
  return { person: { nak, charan: null, rashi: ok ? typedRashi : opts[0] }, hasRashi: ok || opts.length === 1 };
}
