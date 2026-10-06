import type { Lang } from "./i18n";

export type Row = { id: string; label: string; value: string };
export type Section = { id: string; title: string; hidden?: boolean; rows: Row[] };

export type Photo = { src: string; zoom: number; x: number; y: number };

export type Biodata = {
  version: 1;
  lang: Lang;
  templateId: string;
  invocation: string;
  symbol: SymbolId;
  /** User-uploaded deity photo or family logo, used when `symbol` is "custom". */
  symbolImage?: string;
  /** Header symbol height in px (built-in or custom). */
  symbolSize?: number;
  title: string;
  photo: Photo | null;
  sections: Section[];
  devanagariDigits: boolean;
  accent?: string;
  kundali?: Kundali;
  /** Religion preset the sections were built from (used to restore deleted standard lines). */
  religion?: Religion;
};

/** Optional birth chart: planets per house (North Indian style) or an uploaded image of the kundali. */
export type Kundali = {
  show: boolean;
  mode: "chart" | "image";
  /** Rashi number (1–12) of the ascendant; house 1 holds this number. 0 = not set. */
  lagna: number;
  /** Planet abbreviations per house, index 0 = house 1 (lagna). */
  houses: string[];
  image?: string;
};

export const emptyKundali = (): Kundali => ({ show: true, mode: "chart", lagna: 0, houses: Array(12).fill("") });

export const PLANETS: Record<Lang, { abbr: string; name: string }[]> = {
  mr: [
    { abbr: "र", name: "रवी" },
    { abbr: "चं", name: "चंद्र" },
    { abbr: "मं", name: "मंगळ" },
    { abbr: "बु", name: "बुध" },
    { abbr: "गु", name: "गुरू" },
    { abbr: "शु", name: "शुक्र" },
    { abbr: "श", name: "शनी" },
    { abbr: "रा", name: "राहू" },
    { abbr: "के", name: "केतू" },
  ],
  hi: [
    { abbr: "सू", name: "सूर्य" },
    { abbr: "चं", name: "चंद्र" },
    { abbr: "मं", name: "मंगल" },
    { abbr: "बु", name: "बुध" },
    { abbr: "गु", name: "गुरु" },
    { abbr: "शु", name: "शुक्र" },
    { abbr: "श", name: "शनि" },
    { abbr: "रा", name: "राहु" },
    { abbr: "के", name: "केतु" },
  ],
  en: [
    { abbr: "Su", name: "Sun" },
    { abbr: "Mo", name: "Moon" },
    { abbr: "Ma", name: "Mars" },
    { abbr: "Me", name: "Mercury" },
    { abbr: "Ju", name: "Jupiter" },
    { abbr: "Ve", name: "Venus" },
    { abbr: "Sa", name: "Saturn" },
    { abbr: "Ra", name: "Rahu" },
    { abbr: "Ke", name: "Ketu" },
  ],
};

export type SymbolId =
  | "none"
  | "om"
  | "ganesh"
  | "swastik"
  | "kalash"
  | "lotus"
  | "cross"
  | "crescent"
  | "khanda"
  | "chakra"
  | "jain"
  | "custom";

type L = Record<Lang, string>;

/** A field that can appear in a section. `suggest` powers the dropdown hints. */
type FieldDef = { key: string; label: L; sample: L; suggest?: Record<Lang, string[]> };

export const RASHI: Record<Lang, string[]> = {
  en: ["Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)", "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"],
  hi: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
  mr: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तूळ", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
};
const NAKSHATRA_HI = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"];
const NAKSHATRA: Record<Lang, string[]> = {
  en: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
  hi: NAKSHATRA_HI,
  mr: NAKSHATRA_HI.map((n) => n.replace("पूर्वाषाढ़ा", "पूर्वाषाढा").replace("उत्तराषाढ़ा", "उत्तराषाढा")),
};
const same = (list: string[]): Record<Lang, string[]> => ({ en: list, hi: list, mr: list });

const EDUCATION = same(["10th", "12th", "Diploma", "B.A.", "B.Com.", "B.Sc.", "B.E. / B.Tech.", "BCA", "BBA", "B.Pharm.", "LL.B.", "M.A.", "M.Com.", "M.Sc.", "M.E. / M.Tech.", "MCA", "MBA", "MBBS", "BDS", "BAMS", "BHMS", "M.D. / M.S.", "CA", "CS", "Ph.D."]);

const GOTRA: Record<Lang, string[]> = {
  en: ["Kashyap", "Bharadwaj", "Vashishtha", "Gautam", "Atri", "Vishwamitra", "Jamadagni", "Agastya", "Shandilya", "Kaushik", "Vatsa", "Garg", "Parashar", "Harit", "Kaundinya", "Bhargav", "Mudgal", "Sankhyayan"],
  hi: ["कश्यप", "भारद्वाज", "वशिष्ठ", "गौतम", "अत्रि", "विश्वामित्र", "जमदग्नि", "अगस्त्य", "शांडिल्य", "कौशिक", "वत्स", "गर्ग", "पराशर", "हरित", "कौंडिन्य", "भार्गव", "मुद्गल", "सांख्यायन"],
  mr: ["कश्यप", "भारद्वाज", "वसिष्ठ", "गौतम", "अत्री", "विश्वामित्र", "जमदग्नी", "अगस्ती", "शांडिल्य", "कौशिक", "वत्स", "गर्ग", "पराशर", "हरित", "कौंडिण्य", "भार्गव", "मुद्गल", "सांख्यायन"],
};

const KULDAIVAT: Record<Lang, string[]> = {
  en: ["Khandoba (Jejuri)", "Tulja Bhavani", "Mahalakshmi (Kolhapur)", "Renuka Mata (Mahur)", "Ekvira Devi", "Jyotiba", "Saptashrungi", "Jogeshwari", "Kalubai", "Vitthal-Rukmini", "Bhairavnath", "Vaishno Devi", "Karni Mata", "Chamunda Mata", "Kuldevi Ambe Maa"],
  hi: ["माँ अम्बे", "वैष्णो देवी", "करणी माता", "चामुंडा माता", "ज्वाला देवी", "शाकंभरी माता", "कैला देवी", "नैना देवी", "सच्चियाय माता", "जीण माता", "खाटू श्याम जी", "बालाजी", "भैरव बाबा", "तुलजा भवानी", "खंडोबा"],
  mr: ["खंडोबा (जेजुरी)", "तुळजाभवानी", "महालक्ष्मी (कोल्हापूर)", "रेणुका माता (माहूर)", "एकवीरा देवी", "ज्योतिबा", "सप्तशृंगी", "जोगेश्वरी", "काळूबाई", "विठ्ठल-रुक्मिणी", "भैरवनाथ", "म्हाळसा", "मरीआई", "यल्लम्मा", "नरसिंह"],
};

const DEVAK: Record<Lang, string[]> = {
  en: ["Panchpalvi", "Kalamb", "Suryaphool", "Umbar", "Vad (Banyan)", "Pimpal", "Amba (Mango)", "Kel (Banana)", "Halad", "Sonchafa", "Morpis (Peacock feather)", "Shankh"],
  hi: ["पंचपल्लव", "कदंब", "सूर्यमुखी", "गूलर", "बरगद", "पीपल", "आम", "केला", "हल्दी", "सोनचंपा", "मोरपंख", "शंख"],
  mr: ["पंचपालवी", "कळंब", "सूर्यफूल", "उंबर", "वड", "पिंपळ", "आंबा", "केळ", "हळद", "सोनचाफा", "मोरपीस", "शंख"],
};

const HEIGHTS = (() => {
  const out: string[] = [];
  for (let ft = 4; ft <= 6; ft++)
    for (let inch = 0; inch < 12; inch++) {
      const total = ft * 12 + inch;
      if (total >= 54 && total <= 78) out.push(`${ft}' ${inch}" (${Math.round(total * 2.54)} cm)`);
    }
  return { en: out, hi: out, mr: out };
})();

export const FIELDS: Record<string, FieldDef> = {
  name: { key: "name", label: { en: "Name", hi: "नाम", mr: "नाव" }, sample: { en: "Priya Suresh Deshmukh", hi: "प्रिया सुरेश शर्मा", mr: "प्रिया सुरेश देशमुख" } },
  dob: { key: "dob", label: { en: "Date of Birth", hi: "जन्म तिथि", mr: "जन्म तारीख" }, sample: { en: "14 March 1998", hi: "14 मार्च 1998", mr: "14 मार्च 1998" } },
  birthTime: { key: "birthTime", label: { en: "Birth Time", hi: "जन्म समय", mr: "जन्म वेळ" }, sample: { en: "6:45 AM", hi: "सुबह 6:45", mr: "सकाळी 6:45" } },
  birthPlace: { key: "birthPlace", label: { en: "Birth Place", hi: "जन्म स्थान", mr: "जन्म स्थळ" }, sample: { en: "Pune, Maharashtra", hi: "जयपुर, राजस्थान", mr: "पुणे" } },
  height: { key: "height", label: { en: "Height", hi: "ऊँचाई", mr: "उंची" }, sample: { en: `5' 4"`, hi: `5' 4"`, mr: `5' 4"` }, suggest: HEIGHTS },
  complexion: {
    key: "complexion",
    label: { en: "Complexion", hi: "रंग", mr: "वर्ण" },
    sample: { en: "Fair", hi: "गोरा", mr: "गोरा" },
    suggest: { en: ["Very Fair", "Fair", "Wheatish", "Wheatish Brown", "Dark"], hi: ["बहुत गोरा", "गोरा", "गेहुँआ", "साँवला"], mr: ["गोरा", "गव्हाळ", "निमगोरा", "सावळा"] },
  },
  bloodGroup: { key: "bloodGroup", label: { en: "Blood Group", hi: "रक्त समूह", mr: "रक्त गट" }, sample: { en: "B+", hi: "B+", mr: "B+" }, suggest: { en: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], hi: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], mr: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] } },
  religion: { key: "religion", label: { en: "Religion / Caste", hi: "धर्म / जाति", mr: "धर्म / जात" }, sample: { en: "Hindu, Maratha", hi: "हिंदू, ब्राह्मण", mr: "हिंदू, मराठा" } },
  education: { key: "education", label: { en: "Education", hi: "शिक्षा", mr: "शिक्षण" }, sample: { en: "B.E. (Computer), MBA", hi: "बी.टेक (कंप्यूटर साइंस)", mr: "बी.ई. (कॉम्प्युटर), एम.बी.ए." }, suggest: EDUCATION },
  occupation: { key: "occupation", label: { en: "Occupation", hi: "व्यवसाय", mr: "नोकरी / व्यवसाय" }, sample: { en: "Software Engineer, Infosys, Pune", hi: "सॉफ्टवेयर इंजीनियर, बेंगलुरु", mr: "सॉफ्टवेअर इंजिनिअर, इन्फोसिस, पुणे" } },
  income: { key: "income", label: { en: "Annual Income", hi: "वार्षिक आय", mr: "वार्षिक उत्पन्न" }, sample: { en: "₹ 12 Lakh", hi: "₹ 12 लाख", mr: "₹ 12 लाख" } },

  rashi: { key: "rashi", label: { en: "Rashi", hi: "राशि", mr: "रास" }, sample: { en: "Kanya (Virgo)", hi: "कन्या", mr: "कन्या" }, suggest: RASHI },
  nakshatra: { key: "nakshatra", label: { en: "Nakshatra", hi: "नक्षत्र", mr: "नक्षत्र" }, sample: { en: "Hasta", hi: "हस्त", mr: "हस्त" }, suggest: NAKSHATRA },
  gan: { key: "gan", label: { en: "Gan", hi: "गण", mr: "गण" }, sample: { en: "Dev", hi: "देव", mr: "देव" }, suggest: { en: ["Dev", "Manushya", "Rakshas"], hi: ["देव", "मनुष्य", "राक्षस"], mr: ["देव", "मनुष्य", "राक्षस"] } },
  nadi: { key: "nadi", label: { en: "Nadi", hi: "नाड़ी", mr: "नाडी" }, sample: { en: "Adya", hi: "आद्य", mr: "आद्य" }, suggest: { en: ["Adya", "Madhya", "Antya"], hi: ["आद्य", "मध्य", "अंत्य"], mr: ["आद्य", "मध्य", "अंत्य"] } },
  gotra: { key: "gotra", label: { en: "Gotra", hi: "गोत्र", mr: "गोत्र" }, sample: { en: "Kashyap", hi: "भारद्वाज", mr: "कश्यप" }, suggest: GOTRA },
  devak: { key: "devak", label: { en: "Devak", hi: "देवक", mr: "देवक" }, sample: { en: "Panchpalvi", hi: "पंचपल्लव", mr: "पंचपालवी" }, suggest: DEVAK },
  kuldaivat: { key: "kuldaivat", label: { en: "Kuldevta", hi: "कुलदेवी / कुलदेवता", mr: "कुलदैवत" }, sample: { en: "Tulja Bhavani", hi: "माँ अम्बे", mr: "तुळजाभवानी" }, suggest: KULDAIVAT },
  charan: { key: "charan", label: { en: "Charan", hi: "चरण", mr: "चरण" }, sample: { en: "2", hi: "2", mr: "2" }, suggest: { en: ["1", "2", "3", "4"], hi: ["1", "2", "3", "4"], mr: ["1", "2", "3", "4"] } },
  subcaste: { key: "subcaste", label: { en: "Sub-caste", hi: "उपजाति", mr: "पोटजात" }, sample: { en: "96 Kuli", hi: "गौड़", mr: "96 कुळी" } },
  native: { key: "native", label: { en: "Native Place", hi: "मूल निवास", mr: "मूळ गाव" }, sample: { en: "Satara", hi: "अजमेर", mr: "सातारा" } },
  diet: { key: "diet", label: { en: "Diet", hi: "आहार", mr: "आहार" }, sample: { en: "Vegetarian", hi: "शाकाहारी", mr: "शाकाहारी" }, suggest: { en: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Jain Food"], hi: ["शाकाहारी", "मांसाहारी", "अंडाहारी", "जैन भोजन"], mr: ["शाकाहारी", "मांसाहारी", "अंडी चालतात", "जैन आहार"] } },
  sect: { key: "sect", label: { en: "Sect / Maslak", hi: "फिरका / मसलक", mr: "पंथ / मसलक" }, sample: { en: "Sunni", hi: "सुन्नी", mr: "सुन्नी" } },
  church: { key: "church", label: { en: "Church / Denomination", hi: "चर्च / संप्रदाय", mr: "चर्च / संप्रदाय" }, sample: { en: "St. Mary's Church, Catholic", hi: "सेंट मैरी चर्च, कैथोलिक", mr: "सेंट मेरी चर्च, कॅथलिक" } },
  gurdwara: { key: "gurdwara", label: { en: "Gurdwara", hi: "गुरुद्वारा", mr: "गुरुद्वारा" }, sample: { en: "Gurdwara Sahib, Pune", hi: "गुरुद्वारा साहिब, जयपुर", mr: "गुरुद्वारा साहिब, पुणे" } },
  maritalStatus: {
    key: "maritalStatus",
    label: { en: "Marital Status", hi: "वैवाहिक स्थिति", mr: "वैवाहिक स्थिती" },
    sample: { en: "Never married", hi: "अविवाहित", mr: "अविवाहित" },
    suggest: { en: ["Never married", "Divorced", "Widowed", "Awaiting divorce"], hi: ["अविवाहित", "तलाकशुदा", "विधवा / विधुर", "तलाक प्रक्रिया में"], mr: ["अविवाहित", "घटस्फोटित", "विधवा / विधुर", "घटस्फोट प्रक्रियेत"] },
  },
  weight: { key: "weight", label: { en: "Weight", hi: "वज़न", mr: "वजन" }, sample: { en: "55 kg", hi: "55 किलो", mr: "55 किलो" } },
  hobbies: { key: "hobbies", label: { en: "Hobbies", hi: "शौक", mr: "छंद" }, sample: { en: "Reading, classical music, travel", hi: "पढ़ना, संगीत, यात्रा", mr: "वाचन, शास्त्रीय संगीत, प्रवास" } },
  aboutMe: { key: "aboutMe", label: { en: "About Me", hi: "मेरे बारे में", mr: "माझ्याबद्दल" }, sample: { en: "Cheerful, family-oriented and independent", hi: "हँसमुख, परिवार से जुड़ी और आत्मनिर्भर", mr: "आनंदी, कुटुंबप्रिय आणि स्वावलंबी" } },
  grandfather: { key: "grandfather", label: { en: "Grandfather", hi: "दादा जी", mr: "आजोबा" }, sample: { en: "Ramchandra Deshmukh", hi: "श्री रामप्रसाद शर्मा", mr: "कै. रामचंद्र देशमुख" } },
  kaka: { key: "kaka", label: { en: "Paternal Uncle", hi: "चाचा", mr: "काका" }, sample: { en: "Prakash Deshmukh, Nashik", hi: "श्री प्रकाश शर्मा, दिल्ली", mr: "श्री. प्रकाश देशमुख, नाशिक" } },
  atya: { key: "atya", label: { en: "Paternal Aunt", hi: "बुआ", mr: "आत्या" }, sample: { en: "Shobha Jadhav, Satara", hi: "श्रीमती शोभा तिवारी", mr: "सौ. शोभा जाधव, सातारा" } },
  mavshi: { key: "mavshi", label: { en: "Maternal Aunt", hi: "मौसी", mr: "मावशी" }, sample: { en: "Vandana Patil, Mumbai", hi: "श्रीमती वंदना मिश्रा", mr: "सौ. वंदना पाटील, मुंबई" } },
  property: { key: "property", label: { en: "Property", hi: "संपत्ति", mr: "मालमत्ता / शेती" }, sample: { en: "Own house in Pune, 5 acres farmland", hi: "अपना मकान, 5 बीघा खेती", mr: "पुण्यात स्वतःचे घर, 5 एकर शेती" } },
  expectations: { key: "expectations", label: { en: "Expectations", hi: "अपेक्षाएँ", mr: "अपेक्षा" }, sample: { en: "Well-educated, working professional from a cultured family", hi: "सुशिक्षित, संस्कारी परिवार से", mr: "सुशिक्षित, नोकरी करणारा, संस्कारी कुटुंबातील" } },
  manglik: { key: "manglik", label: { en: "Manglik", hi: "मांगलिक", mr: "मंगळ" }, sample: { en: "No", hi: "नहीं", mr: "नाही" }, suggest: { en: ["No", "Yes", "Anshik (Partial)"], hi: ["नहीं", "हाँ", "आंशिक"], mr: ["नाही", "आहे", "सौम्य"] } },

  father: { key: "father", label: { en: "Father's Name", hi: "पिता का नाम", mr: "वडिलांचे नाव" }, sample: { en: "Suresh Ramchandra Deshmukh", hi: "श्री सुरेश कुमार शर्मा", mr: "श्री. सुरेश रामचंद्र देशमुख" } },
  fatherOcc: { key: "fatherOcc", label: { en: "Father's Occupation", hi: "पिता का व्यवसाय", mr: "वडिलांचा व्यवसाय" }, sample: { en: "Retired Bank Manager", hi: "सेवानिवृत्त बैंक प्रबंधक", mr: "निवृत्त बँक व्यवस्थापक" } },
  mother: { key: "mother", label: { en: "Mother's Name", hi: "माता का नाम", mr: "आईचे नाव" }, sample: { en: "Sunita Suresh Deshmukh", hi: "श्रीमती सुनीता शर्मा", mr: "सौ. सुनिता सुरेश देशमुख" } },
  motherOcc: { key: "motherOcc", label: { en: "Mother's Occupation", hi: "माता का व्यवसाय", mr: "आईचा व्यवसाय" }, sample: { en: "Homemaker", hi: "गृहिणी", mr: "गृहिणी" } },
  brothers: { key: "brothers", label: { en: "Brother(s)", hi: "भाई", mr: "भाऊ" }, sample: { en: "1 (Rahul – Married, CA)", hi: "1 (राहुल – विवाहित)", mr: "1 (राहुल – विवाहित, सी.ए.)" } },
  sisters: { key: "sisters", label: { en: "Sister(s)", hi: "बहन", mr: "बहीण" }, sample: { en: "None", hi: "कोई नहीं", mr: "नाही" } },
  mama: { key: "mama", label: { en: "Maternal Uncle", hi: "मामा", mr: "मामा (आजोळ)" }, sample: { en: "Anil Patil, Satara", hi: "श्री अनिल तिवारी, अजमेर", mr: "श्री. अनिल पाटील, सातारा" } },
  relatives: { key: "relatives", label: { en: "Relatives", hi: "रिश्तेदार", mr: "नातेवाईक" }, sample: { en: "Deshmukh, Patil, Jadhav", hi: "शर्मा, तिवारी, मिश्रा", mr: "देशमुख, पाटील, जाधव" } },

  address: { key: "address", label: { en: "Address", hi: "पता", mr: "पत्ता" }, sample: { en: "Flat 12, Shree Apartments, Kothrud, Pune – 411038", hi: "12, शिव कॉलोनी, मालवीय नगर, जयपुर", mr: "फ्लॅट 12, श्री अपार्टमेंट, कोथरूड, पुणे – 411038" } },
  phone: { key: "phone", label: { en: "Mobile", hi: "मोबाइल", mr: "मोबाईल" }, sample: { en: "+91 98XXX XXXXX", hi: "+91 98XXX XXXXX", mr: "+91 98XXX XXXXX" } },
  email: { key: "email", label: { en: "Email", hi: "ईमेल", mr: "ईमेल" }, sample: { en: "family@example.com", hi: "family@example.com", mr: "family@example.com" } },
};

export function suggestionsFor(label: string, lang: Lang): string[] | undefined {
  for (const f of Object.values(FIELDS)) {
    if (!f.suggest) continue;
    if (f.label.en === label || f.label.hi === label || f.label.mr === label) return f.suggest[lang];
  }
  return undefined;
}

export const SECTION_TITLES: Record<string, L> = {
  personal: { en: "Personal Details", hi: "व्यक्तिगत विवरण", mr: "वैयक्तिक माहिती" },
  horoscope: { en: "Horoscope Details", hi: "कुंडली विवरण", mr: "पत्रिका माहिती" },
  family: { en: "Family Details", hi: "पारिवारिक विवरण", mr: "कौटुंबिक माहिती" },
  contact: { en: "Contact Details", hi: "संपर्क विवरण", mr: "संपर्क" },
  community: { en: "Community Details", hi: "सामुदायिक विवरण", mr: "समाज माहिती" },
};

const SECTION_FIELDS: Record<Lang, Record<string, string[]>> = {
  en: {
    personal: ["name", "dob", "birthTime", "birthPlace", "height", "complexion", "bloodGroup", "religion", "education", "occupation", "income"],
    horoscope: ["rashi", "nakshatra", "charan", "gan", "nadi", "gotra", "manglik"],
    family: ["father", "fatherOcc", "mother", "motherOcc", "brothers", "sisters", "mama"],
    contact: ["address", "phone", "email"],
  },
  hi: {
    personal: ["name", "dob", "birthTime", "birthPlace", "height", "complexion", "religion", "education", "occupation", "income"],
    horoscope: ["rashi", "nakshatra", "charan", "gan", "nadi", "gotra", "kuldaivat", "manglik"],
    family: ["father", "fatherOcc", "mother", "motherOcc", "brothers", "sisters", "mama", "native"],
    contact: ["address", "phone", "expectations"],
  },
  mr: {
    personal: ["name", "dob", "birthTime", "birthPlace", "height", "complexion", "bloodGroup", "religion", "education", "occupation", "income"],
    horoscope: ["rashi", "nakshatra", "charan", "gan", "nadi", "manglik", "devak", "kuldaivat", "gotra"],
    family: ["father", "fatherOcc", "mother", "brothers", "sisters", "mama", "relatives", "native"],
    contact: ["address", "phone", "expectations"],
  },
};

export const INVOCATIONS: Record<Lang, string[]> = {
  mr: ["।। श्री गणेशाय नमः ।।", "।। श्री ।।", "।। ॐ ।।", "।। श्री स्वामी समर्थ ।।", "।। जय मल्हार ।।", "।। श्री गुरुदेव दत्त ।।", "।। जय श्री राम ।।", "।। श्री विठ्ठल प्रसन्न ।।", "।। श्री तुळजाभवानी प्रसन्न ।।", "।। श्री महालक्ष्मी प्रसन्न ।।", "।। श्री ज्योतिबा प्रसन्न ।।", "।। श्री साईनाथ प्रसन्न ।।", "।। नमो बुद्धाय ।।", "।। जय भीम ।।", "।। जय जिनेंद्र ।।"],
  hi: ["।। श्री गणेशाय नमः ।।", "।। ॐ ।।", "।। जय श्री राम ।।", "।। जय श्री कृष्ण ।।", "।। श्री राधे ।।", "।। हर हर महादेव ।।", "।। ॐ नमः शिवाय ।।", "।। जय माता दी ।।", "।। जय श्री श्याम ।।", "।। जय बजरंगबली ।।", "।। जय श्री महाकाल ।।", "।। जय जिनेन्द्र ।।", "।। नमो बुद्धाय ।।"],
  en: ["|| Shree Ganeshaya Namah ||", "|| Om ||", "|| Jai Shree Krishna ||", "|| Jai Shree Ram ||", "|| Jai Jinendra ||", "In the name of God", "|| Waheguru ||"],
};

export const TITLES: Record<Lang, string[]> = {
  mr: ["बायोडाटा", "परिचय पत्र", "विवाह परिचय", "माहिती पत्रक"],
  hi: ["बायोडाटा", "परिचय पत्र", "विवाह हेतु परिचय", "जीवन परिचय"],
  en: ["Biodata", "Marriage Biodata", "Bio Data", "Profile"],
};

let counter = 0;
export const uid = () => `r${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export type Gender = "girl" | "boy";
export type Religion = "hindu" | "jain" | "buddhist" | "muslim" | "christian" | "sikh";
export const RELIGIONS: Religion[] = ["hindu", "jain", "buddhist", "muslim", "christian", "sikh"];

type Preset = { symbol: SymbolId; invocation: L; religion: L; horoscope: string[] | null; community?: string[] };
export const RELIGION_PRESETS: Record<Religion, Preset> = {
  hindu: { symbol: "ganesh", invocation: { en: INVOCATIONS.en[0], hi: INVOCATIONS.hi[0], mr: INVOCATIONS.mr[0] }, religion: { en: "Hindu, Maratha", hi: "हिंदू, ब्राह्मण", mr: "हिंदू, मराठा" }, horoscope: null },
  jain: { symbol: "jain", invocation: { en: "|| Jai Jinendra ||", hi: "।। जय जिनेन्द्र ।।", mr: "।। जय जिनेंद्र ।।" }, religion: { en: "Jain, Digambar", hi: "जैन, श्वेतांबर", mr: "जैन, दिगंबर" }, horoscope: ["rashi", "gotra", "kuldaivat"], community: [] },
  buddhist: { symbol: "chakra", invocation: { en: "|| Namo Buddhaya ||", hi: "।। नमो बुद्धाय ।।", mr: "।। नमो बुद्धाय ।।" }, religion: { en: "Buddhist", hi: "बौद्ध", mr: "बौद्ध" }, horoscope: [] },
  muslim: { symbol: "crescent", invocation: { en: "Bismillahir Rahmanir Raheem", hi: "बिस्मिल्लाहिर्रहमानिर्रहीम", mr: "बिस्मिल्लाहिर्रहमानिर्रहीम" }, religion: { en: "Muslim", hi: "मुस्लिम", mr: "मुस्लिम" }, horoscope: [], community: ["sect", "diet"] },
  christian: { symbol: "cross", invocation: { en: "God is Love", hi: "परमेश्वर प्रेम है", mr: "देव प्रीती आहे" }, religion: { en: "Christian", hi: "ईसाई", mr: "ख्रिश्चन" }, horoscope: [], community: ["church"] },
  sikh: { symbol: "khanda", invocation: { en: "Ik Onkar", hi: "ੴ सतिनाम", mr: "ੴ सतनाम" }, religion: { en: "Sikh", hi: "सिख", mr: "शीख" }, horoscope: [], community: ["gurdwara", "diet"] },
};

export function createBiodata(
  lang: Lang,
  opts: { sample?: boolean; templateId?: string; gender?: Gender; religion?: Religion } = {},
): Biodata {
  const { sample = false, templateId = "kesari-classic", gender = "girl", religion = "hindu" } = opts;
  const preset = RELIGION_PRESETS[religion];
  const layout: [string, string[]][] = Object.entries(SECTION_FIELDS[lang]).map(([sid, keys]) => [
    sid,
    sid === "horoscope" && preset.horoscope ? preset.horoscope : keys,
  ]);
  if (preset.community?.length) layout.splice(1, 0, ["community", preset.community]);
  const sections: Section[] = layout
    .filter(([, keys]) => keys.length > 0)
    .map(([sid, keys]) => ({
      id: sid,
      title: SECTION_TITLES[sid][lang],
      rows: keys.map((k) => ({
        id: `${sid}-${k}`,
        label: FIELDS[k].label[lang],
        value: !sample ? "" : k === "religion" ? preset.religion[lang] : sampleValue(k, lang, gender),
      })),
    }));
  return {
    version: 1,
    lang,
    templateId,
    invocation: preset.invocation[lang],
    symbol: preset.symbol,
    religion,
    title: TITLES[lang][0],
    photo: null,
    sections,
    devanagariDigits: false,
  };
}

const BOY: Partial<Record<string, L>> = {
  name: { en: "Rohan Vijay Kulkarni", hi: "रोहन विजय शर्मा", mr: "रोहन विजय कुलकर्णी" },
  height: { en: `5' 10"`, hi: `5' 10"`, mr: `5' 10"` },
  complexion: { en: "Wheatish", hi: "गेहुँआ", mr: "गव्हाळ" },
  father: { en: "Vijay Madhav Kulkarni", hi: "श्री विजय कुमार शर्मा", mr: "श्री. विजय माधव कुलकर्णी" },
  mother: { en: "Anjali Vijay Kulkarni", hi: "श्रीमती अंजलि शर्मा", mr: "सौ. अंजली विजय कुलकर्णी" },
  brothers: { en: "None", hi: "कोई नहीं", mr: "नाही" },
  sisters: { en: "1 (Neha – Married)", hi: "1 (नेहा – विवाहित)", mr: "1 (नेहा – विवाहित)" },
};

function sampleValue(key: string, lang: Lang, gender: Gender) {
  if (gender === "boy" && BOY[key]) return BOY[key]![lang];
  return FIELDS[key].sample[lang];
}

export function allLabels(): string[] {
  return Object.values(FIELDS).flatMap((f) => [f.label.en, f.label.hi, f.label.mr]);
}

/* ---------- Horoscope auto-fill ---------- */

// Per nakshatra (Ashwini … Revati): gan 0 Dev · 1 Manushya · 2 Rakshas; nadi 0 Adya · 1 Madhya · 2 Antya.
const GAN_OF = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];
const NADI_OF = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];

/** Every nakshatra with its gan, nadi and the rashi of each charan (the same data the auto-fill uses; for content tables). */
export function nakshatraFacts(lang: Lang) {
  return NAKSHATRA[lang].map((name, i) => ({
    name,
    gan: FIELDS.gan.suggest![lang][GAN_OF[i]],
    nadi: FIELDS.nadi.suggest![lang][NADI_OF[i]],
    rashiByCharan: [1, 2, 3, 4].map((c) => RASHI[lang][Math.floor((i * 4 + c - 1) / 9)]),
  }));
}

function nakshatraIndex(value: string) {
  const v = value.trim().toLowerCase();
  if (!v) return -1;
  for (const list of Object.values(NAKSHATRA)) {
    const i = list.findIndex((n) => n.toLowerCase() === v);
    if (i >= 0) return i;
  }
  return -1;
}

const keyOf = (r: Row) => r.id.split("-").slice(1).join("-");

/**
 * Fills गण and नाडी from the नक्षत्र (fixed by the nakshatra), and रास from नक्षत्र + चरण
 * (each nakshatra pada is 3°20′, nine padas per rashi). Only fills empty fields.
 */
export function autofillHoroscope(b: Biodata): Biodata {
  const rows = b.sections.flatMap((s) => s.rows);
  const find = (k: string) => rows.find((r) => keyOf(r) === k);
  const nak = find("nakshatra");
  const idx = nak ? nakshatraIndex(nak.value) : -1;
  if (idx < 0) return b;
  const fill = (k: string, value: string | undefined) => {
    const row = find(k);
    if (row && !row.value.trim() && value) row.value = value;
  };
  fill("gan", FIELDS.gan.suggest?.[b.lang][GAN_OF[idx]]);
  fill("nadi", FIELDS.nadi.suggest?.[b.lang][NADI_OF[idx]]);
  const charan = Number(find("charan")?.value.trim());
  if (charan >= 1 && charan <= 4) fill("rashi", RASHI[b.lang][Math.floor((idx * 4 + charan - 1) / 9)]);
  return b;
}

/** Fields offered in "Add field" quick picks (skipped if the biodata already has them). */
export const QUICK_FIELDS = ["maritalStatus", "hobbies", "aboutMe", "weight", "diet", "subcaste", "native", "grandfather", "kaka", "atya", "mavshi", "property", "email", "expectations", "bloodGroup"];

export function newFieldRow(sectionId: string, key: string, lang: Lang): Row {
  return { id: `${sectionId}-${key}`, label: FIELDS[key].label[lang], value: "" };
}

/* ---------- Restore deleted standard lines ---------- */

const keyOfRow = (r: Row) => r.id.split("-").slice(1).join("-");

/** Best guess of the preset for drafts saved before `religion` was stored. */
function presetOf(b: Biodata): Religion {
  if (b.religion) return b.religion;
  return RELIGIONS.find((r) => RELIGION_PRESETS[r].invocation[b.lang] === b.invocation) ?? "hindu";
}

/**
 * Deleting a line only removes it for now: on the next load every standard line (and standard
 * section) of the biodata's preset comes back, empty, at its usual position. Empty lines never
 * print or download, so a finished biodata still stays compact. Custom lines, renamed labels,
 * reordering and hidden sections are left as the user made them.
 */
export function restoreStandardLines(b: Biodata): Biodata {
  const template = createBiodata(b.lang, { religion: presetOf(b) });
  const present = new Set(b.sections.flatMap((s) => s.rows.map(keyOfRow)));
  const sections = b.sections.map((s) => ({ ...s, rows: [...s.rows] }));

  template.sections.forEach((ts, tIndex) => {
    let section = sections.find((s) => s.id === ts.id);
    if (!section) {
      // Whole standard section was deleted: bring it back empty, near its usual place.
      section = { ...ts, rows: [] };
      const before = template.sections.slice(0, tIndex).map((x) => x.id);
      const at = sections.reduce((pos, s, i) => (before.includes(s.id) ? i + 1 : pos), 0);
      sections.splice(at, 0, section);
    }
    ts.rows.forEach((row, rIndex) => {
      const key = keyOfRow(row);
      if (present.has(key)) return;
      // Insert after the nearest standard line that precedes it in the template.
      const prevKeys = ts.rows.slice(0, rIndex).map(keyOfRow);
      const at = section!.rows.reduce((pos, r, i) => (prevKeys.includes(keyOfRow(r)) ? i + 1 : pos), 0);
      section!.rows.splice(at, 0, { ...row, value: "" });
      present.add(key);
    });
  });
  return { ...b, sections, religion: presetOf(b) };
}
