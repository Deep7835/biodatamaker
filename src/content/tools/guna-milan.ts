import type { PageContent } from "../types";

const updated = "2026-09-26";

export const GUNA_MILAN: PageContent[] = [
  {
    lang: "en",
    topic: "gunaMilan",
    slug: "kundali-matching",
    title: "Kundali Matching – 36 Guna Milan Calculator (Free)",
    description:
      "Free kundali matching by nakshatra: see all 8 Ashtakoot scores out of 36, Nadi, Bhakoot and Gana dosha, and a clear worked example. Works in your browser.",
    h1: "Kundali Matching: 36 Guna Milan Calculator",
    lead: "Choose the bride's and groom's nakshatra (and charan, if you know it) to see the traditional Ashtakoot guna milan score out of 36, koot by koot, with any doshas explained in plain words.",
    sample: {},
    body: `
## What is guna milan?

Guna milan, also called kundli milan or Ashtakoot milan, is the first check most Hindu families make when a biodata looks promising. It compares the Moon's position at birth for the girl and the boy, that is their **nakshatra** (birth star) and **rashi** (Moon sign). Eight factors, called koots, are scored, and together they add up to a maximum of 36 gunas.

Because only the Moon is used, guna milan can be done with just two nakshatras, which is why nakshatra and rashi are printed on almost every marriage biodata.

## How to use this calculator

1. Pick the bride's nakshatra. If you know the charan (pada, 1 to 4), choose it too; the rashi then fills in by itself.
2. If the charan is not known and the nakshatra spans two rashis (for example Krittika is partly Mesh and partly Vrishabh), choose the rashi from the short list.
3. Do the same for the groom and press **Match**.
4. Already made your biodata here? Press **Fill from my biodata** on either card to use the nakshatra, charan and rashi saved on this device.

Your last entries are remembered on this device only. Nothing is uploaded. If you don't know the nakshatra, use the [rashi and nakshatra finder](/rashi-nakshatra-calculator/) with the date, time and place of birth.

## The eight koots and their points

| Koot | What it looks at | Maximum |
|---|---|---|
| Varna | Work nature and ego (from rashi) | 1 |
| Vashya | Mutual attraction and influence | 2 |
| Tara (Dina) | Health and fortune, counted between birth stars | 3 |
| Yoni | Physical compatibility (14 animal yonis) | 4 |
| Graha Maitri | Friendship between the two rashi lords | 5 |
| Gana | Temperament: Dev, Manushya or Rakshas | 6 |
| Bhakoot | Rashi positions: family welfare and prosperity | 7 |
| Nadi | Adya, Madhya or Antya nadi: health and children | 8 |

## How to read the score

| Total gunas | Commonly read as |
|---|---|
| Below 18 | Not recommended |
| 18 to 24 | Average, acceptable after checking doshas |
| 25 to 32 | Good match |
| 33 to 36 | Excellent match |

A high total with a serious dosha can still worry an astrologer, and a modest total with no dosha is often accepted, so always read the dosha notes along with the number.

## Doshas explained

- **Nadi dosha**: both have the same nadi, so Nadi scores 0 of 8. It is the dosha families take most seriously. Many panchangs cancel it when the rashi is the same but the nakshatras differ, or the nakshatra is the same but the rashis differ.
- **Bhakoot dosha**: the rashis sit 2/12, 5/9 or 6/8 from each other, so Bhakoot scores 0 of 7. It is commonly treated as cancelled when both rashis have the same lord or the lords are friends.
- **Gana dosha**: one partner is Rakshas gana and the other is not.

The tool points out these classical exceptions when they apply, but it never changes the score for them, because traditions differ on when they count. That judgement is best left to your astrologer.

## A worked example

Bride: **Rohini, charan 2** (Vrishabh rashi). Groom: **Hasta, charan 3** (Kanya rashi).

- Varna: Vaishya and Vaishya, **1 of 1**.
- Vashya: Chatushpad and Manav, **1 of 2**.
- Tara: counting Rohini to Hasta gives 10, which is Janma tara; the reverse count gives 19, also Janma. Neither is Vipat, Pratyari or Vadha, so **3 of 3**.
- Yoni: Serpent and Buffalo, **1 of 4**.
- Graha Maitri: Venus and Mercury are friends, **5 of 5**.
- Gana: bride Manushya, groom Dev, **6 of 6**.
- Bhakoot: Kanya is 5th from Vrishabh (and Vrishabh 9th from Kanya), a 5/9 placement, **0 of 7**.
- Nadi: Antya and Adya are different, **8 of 8**.

Total: **25 of 36**, a good match on paper, with a Bhakoot dosha. Because Venus and Mercury are friends, many astrologers would treat that dosha as cancelled, but that is theirs to confirm.

## Why calculators can differ by a point or two

The classical texts leave a few details open. Published tables disagree mainly on Vashya, on which way round the Gana table is read (bride or groom first), and on whether Janma tara counts as good. This calculator follows the most common North Indian convention for each. If your family panchang shows a slightly different number, that is usually the reason.

## What guna milan cannot tell you

Guna milan looks only at the Moon. A full kundli match also checks Mangal dosha, the 7th house, dashas and the overall strength of both charts, and a good astrologer looks at the two families and the couple too. Use this score as a first look, then confirm with your family astrologer or purohit. Once the match feels right, [make your marriage biodata](/create/) or browse more [free biodata tools](/biodata-tools/).
`,
    faqs: [
      {
        q: "How many gunas should match for marriage?",
        a: "Traditionally at least 18 of 36. 18 to 24 is average, 25 to 32 is good and 33 to 36 is excellent. Doshas, especially Nadi and Bhakoot, matter as much as the total.",
      },
      {
        q: "Can I do kundali matching with only the nakshatra?",
        a: "Yes. Guna milan uses only the nakshatra and rashi. If the nakshatra spans two rashis and you don't know the charan, choose the rashi written on the biodata.",
      },
      {
        q: "Why is my score different on another website?",
        a: "Panchangs differ slightly on the Vashya table, the direction of the Gana table and the Janma tara rule, so a one or two point difference is normal. The doshas usually agree.",
      },
      {
        q: "Does the tool cancel Nadi or Bhakoot dosha automatically?",
        a: "No. It shows the classical cancellation conditions when they are present, but the score stays unchanged. Please ask your astrologer whether the exception applies.",
      },
      {
        q: "Is my data stored anywhere?",
        a: "No. Everything is calculated in your browser, and your last entries are saved only on your own device.",
      },
    ],
    updated,
    tool: "gunaMilan",
  },
  {
    lang: "hi",
    topic: "gunaMilan",
    slug: "kundli-milan",
    title: "कुंडली मिलान – 36 गुण मिलान कैलकुलेटर (Kundli Milan)",
    description:
      "नक्षत्र से मुफ़्त कुंडली मिलान: आठों कूट के गुण 36 में से, नाड़ी, भकूट और गण दोष की सरल जानकारी और पूरा उदाहरण। सब कुछ आपके ब्राउज़र में, बिना रजिस्ट्रेशन।",
    h1: "कुंडली मिलान: 36 गुण मिलान कैलकुलेटर",
    lead: "वधू और वर का नक्षत्र (और पता हो तो चरण) चुनें और अष्टकूट गुण मिलान का पारंपरिक स्कोर 36 में से देखें, हर कूट के अंक और दोषों की आसान व्याख्या के साथ।",
    sample: {},
    body: `
## गुण मिलान क्या है?

गुण मिलान, जिसे कुंडली मिलान (kundli milan) या अष्टकूट मिलान भी कहते हैं, रिश्ते की बात आगे बढ़ाने से पहले ज़्यादातर हिंदू परिवारों की पहली जाँच होती है। इसमें लड़की और लड़के के जन्म समय के चंद्रमा की तुलना की जाती है, यानी दोनों का **नक्षत्र** और **राशि**। आठ बातों, जिन्हें कूट कहते हैं, के अंक जोड़कर अधिकतम 36 गुण बनते हैं।

क्योंकि इसमें केवल चंद्रमा देखा जाता है, इसलिए दो नक्षत्रों से ही गुण मिलान हो जाता है। यही कारण है कि लगभग हर शादी के बायोडाटा में राशि और नक्षत्र लिखा होता है।

## कैलकुलेटर का उपयोग कैसे करें

1. वधू का नक्षत्र चुनें। चरण (1 से 4) पता हो तो वह भी चुनें, राशि अपने-आप भर जाएगी।
2. चरण पता नहीं और नक्षत्र दो राशियों में फैला है (जैसे कृत्तिका का कुछ भाग मेष में और बाकी वृषभ में), तो सूची से राशि चुनें।
3. वर के लिए भी यही करें और **मिलान करें** दबाएँ।
4. अगर आपने यहाँ बायोडाटा बनाया है, तो किसी भी कार्ड पर **मेरे बायोडाटा से भरें** दबाएँ। इस डिवाइस पर सेव नक्षत्र, चरण और राशि भर जाएँगे।

आपकी पिछली एंट्री सिर्फ़ इसी डिवाइस पर याद रहती है, कुछ भी अपलोड नहीं होता। नक्षत्र पता नहीं है तो जन्म तिथि, समय और स्थान से [राशि और नक्षत्र जानें](/hindi/rashi-nakshatra-kaise-jane/)।

## आठ कूट और उनके गुण

| कूट | क्या देखता है | अधिकतम गुण |
|---|---|---|
| वर्ण | कार्य-स्वभाव और अहं (राशि से) | 1 |
| वश्य | आपसी आकर्षण और प्रभाव | 2 |
| तारा (दिन) | स्वास्थ्य और भाग्य, नक्षत्रों की गिनती से | 3 |
| योनि | शारीरिक अनुकूलता (14 योनियाँ) | 4 |
| ग्रह मैत्री | दोनों राशि स्वामियों की मित्रता | 5 |
| गण | स्वभाव: देव, मनुष्य या राक्षस | 6 |
| भकूट | राशियों की स्थिति: परिवार का सुख और समृद्धि | 7 |
| नाड़ी | आद्य, मध्य या अंत्य नाड़ी: स्वास्थ्य और संतान | 8 |

## स्कोर कैसे समझें

| कुल गुण | आमतौर पर माना जाता है |
|---|---|
| 18 से कम | अनुशंसित नहीं |
| 18 से 24 | मध्यम, दोष जाँचकर स्वीकार्य |
| 25 से 32 | अच्छा मिलान |
| 33 से 36 | उत्तम मिलान |

ऊँचे स्कोर के साथ कोई गंभीर दोष हो तो ज्योतिषी चिंता कर सकते हैं, और मध्यम स्कोर में कोई दोष न हो तो रिश्ता अक्सर स्वीकार हो जाता है। इसलिए कुल अंक के साथ दोष भी ज़रूर पढ़ें।

## दोष क्या हैं

- **नाड़ी दोष**: दोनों की नाड़ी एक हो तो नाड़ी में 8 में से 0 गुण मिलते हैं। परिवार इसे सबसे गंभीर मानते हैं। कई पंचांगों में राशि एक पर नक्षत्र अलग हों, या नक्षत्र एक पर राशि अलग हो, तो यह दोष नहीं माना जाता।
- **भकूट दोष**: दोनों राशियाँ एक-दूसरे से 2/12, 5/9 या 6/8 पर हों तो भकूट में 7 में से 0 गुण। दोनों राशियों का स्वामी एक हो या स्वामी आपस में मित्र हों, तो इसका परिहार माना जाता है।
- **गण दोष**: एक का गण राक्षस हो और दूसरे का नहीं।

ऐसे परिहार लागू हों तो टूल उन्हें बताता है, पर उनके कारण स्कोर नहीं बदलता, क्योंकि अलग-अलग परंपराएँ इन्हें अलग तरह से मानती हैं। यह निर्णय अपने ज्योतिषी पर छोड़ें।

## एक पूरा उदाहरण

वधू: **रोहिणी, चरण 2** (वृषभ राशि)। वर: **हस्त, चरण 3** (कन्या राशि)।

- वर्ण: वैश्य और वैश्य, **1 में से 1**।
- वश्य: चतुष्पद और मानव, **2 में से 1**।
- तारा: रोहिणी से हस्त तक गिनने पर 10 आता है, यानी जन्म तारा; उल्टी गिनती 19 आती है, वह भी जन्म तारा। विपत, प्रत्यरि या वध नहीं है, इसलिए **3 में से 3**।
- योनि: सर्प और महिष, **4 में से 1**।
- ग्रह मैत्री: शुक्र और बुध मित्र हैं, **5 में से 5**।
- गण: वधू मनुष्य, वर देव, **6 में से 6**।
- भकूट: वृषभ से कन्या 5वीं और कन्या से वृषभ 9वीं राशि है, यानी 5/9, **7 में से 0**।
- नाड़ी: अंत्य और आद्य अलग हैं, **8 में से 8**।

कुल: **36 में से 25**, यानी काग़ज़ पर अच्छा मिलान, पर भकूट दोष के साथ। शुक्र और बुध मित्र हैं, इसलिए कई ज्योतिषी इस दोष का परिहार मानेंगे, पर इसकी पुष्टि उन्हीं से करें।

## अलग कैलकुलेटर में एक-दो गुण का फ़र्क क्यों

शास्त्रों में कुछ बातें खुली छोड़ी गई हैं। छपी हुई तालिकाएँ मुख्य रूप से वश्य में, गण तालिका किस क्रम से पढ़ी जाए (पहले वधू या पहले वर) इसमें, और जन्म तारा शुभ है या नहीं, इसमें अलग हैं। यह कैलकुलेटर हर जगह उत्तर भारत की सबसे प्रचलित पद्धति अपनाता है। आपके पारिवारिक पंचांग में थोड़ा अलग अंक आए तो आमतौर पर यही कारण होता है।

## गुण मिलान की सीमाएँ

गुण मिलान केवल चंद्रमा को देखता है। पूरी कुंडली मिलान में मंगल दोष, सप्तम भाव, दशा और दोनों कुंडलियों की ताक़त भी देखी जाती है, और अच्छे ज्योतिषी परिवार और जोड़े को भी समझते हैं। इस स्कोर को पहली झलक मानें और पारिवारिक ज्योतिषी या पुरोहित से पुष्टि करें। रिश्ता तय होने की ओर बढ़े तो [शादी का बायोडाटा बनाएँ](/hindi/create/), [विवाह मुहूर्त 2026-2027](/hindi/vivah-muhurat-2026-2027/) देखें या हमारे [मुफ़्त टूल](/hindi/tools/) आज़माएँ।
`,
    faqs: [
      {
        q: "शादी के लिए कितने गुण मिलने चाहिए?",
        a: "परंपरा के अनुसार 36 में से कम से कम 18। 18 से 24 मध्यम, 25 से 32 अच्छा और 33 से 36 उत्तम माना जाता है। नाड़ी और भकूट दोष कुल अंक जितने ही महत्वपूर्ण हैं।",
      },
      {
        q: "क्या सिर्फ़ नक्षत्र से कुंडली मिलान हो सकता है?",
        a: "हाँ। गुण मिलान में केवल नक्षत्र और राशि लगती है। नक्षत्र दो राशियों में फैला हो और चरण पता न हो, तो बायोडाटा में लिखी राशि चुनें।",
      },
      {
        q: "दूसरी वेबसाइट पर गुण अलग क्यों आते हैं?",
        a: "वश्य तालिका, गण तालिका के क्रम और जन्म तारा के नियम में पंचांगों में थोड़ा अंतर है, इसलिए एक-दो गुण का फ़र्क सामान्य है। दोष आमतौर पर एक जैसे आते हैं।",
      },
      {
        q: "क्या टूल नाड़ी या भकूट दोष का परिहार अपने-आप कर देता है?",
        a: "नहीं। परिहार की शर्तें मौजूद हों तो टूल उन्हें बताता है, पर स्कोर नहीं बदलता। परिहार लागू होगा या नहीं, यह अपने ज्योतिषी से पूछें।",
      },
      {
        q: "क्या मेरी जानकारी कहीं सेव होती है?",
        a: "नहीं। पूरी गणना आपके ब्राउज़र में होती है और पिछली एंट्री केवल आपके अपने डिवाइस पर सेव रहती है।",
      },
    ],
    updated,
    tool: "gunaMilan",
  },
  {
    lang: "mr",
    topic: "gunaMilan",
    slug: "gun-milan",
    title: "गुण मिलन मराठी – 36 गुण जुळवणी कॅल्क्युलेटर (Gun Milan)",
    description:
      "नक्षत्रावरून मोफत गुण मिलन: आठही कूटांचे गुण 36 पैकी, नाडी, भकूट व गण दोषाची सोपी माहिती आणि पूर्ण उदाहरण. सर्व काही तुमच्या ब्राउझरमध्ये, नोंदणीशिवाय.",
    h1: "गुण मिलन: 36 गुण जुळवणी कॅल्क्युलेटर",
    lead: "वधू व वराचे नक्षत्र (आणि माहीत असल्यास चरण) निवडा आणि अष्टकूट गुण मिलनाचा पारंपरिक स्कोअर 36 पैकी पाहा, प्रत्येक कूटाचे गुण आणि दोषांचे सोपे स्पष्टीकरण यांसह.",
    sample: {},
    body: `
## गुण मिलन म्हणजे काय?

गुण मिलन, ज्याला पत्रिका जुळवणे, कुंडली मिलन किंवा अष्टकूट मिलन असेही म्हणतात, ही स्थळ पुढे नेण्यापूर्वी बहुतेक हिंदू कुटुंबांची पहिली तपासणी असते. यात मुलगी व मुलगा यांच्या जन्मवेळच्या चंद्राची तुलना होते, म्हणजे दोघांचे **नक्षत्र** आणि **रास**. आठ बाबींना, ज्यांना कूट म्हणतात, गुण दिले जातात आणि त्यांची बेरीज जास्तीत जास्त 36 गुण होते.

फक्त चंद्र पाहिला जात असल्यामुळे दोन नक्षत्रांवरूनच गुण मिलन (gun milan marathi) करता येते. म्हणूनच जवळजवळ प्रत्येक लग्नाच्या बायोडाटामध्ये रास व नक्षत्र लिहिलेले असते.

## कॅल्क्युलेटर कसा वापरायचा

1. वधूचे नक्षत्र निवडा. चरण (1 ते 4) माहीत असल्यास तेही निवडा, रास आपोआप भरली जाईल.
2. चरण माहीत नसेल आणि नक्षत्र दोन राशींमध्ये पसरलेले असेल (उदा. कृत्तिकेचा काही भाग मेष राशीत आणि उरलेला वृषभ राशीत), तर यादीतून रास निवडा.
3. वरासाठीही असेच करा आणि **गुण जुळवा** दाबा.
4. तुम्ही इथे बायोडाटा बनवला असेल तर कोणत्याही कार्डवरील **माझ्या बायोडाटामधून भरा** दाबा. या डिव्हाइसवर सेव्ह केलेले नक्षत्र, चरण व रास भरले जातील.

तुमची मागील माहिती फक्त याच डिव्हाइसवर लक्षात ठेवली जाते, काहीही अपलोड होत नाही. नक्षत्र माहीत नसेल तर जन्मतारीख, वेळ व ठिकाणावरून [रास व नक्षत्र शोधा](/marathi/rashi-nakshatra-shodha/).

## आठ कूट आणि त्यांचे गुण

| कूट | काय पाहते | कमाल गुण |
|---|---|---|
| वर्ण | कार्यस्वभाव व अहंभाव (राशीवरून) | 1 |
| वश्य | परस्पर आकर्षण व प्रभाव | 2 |
| तारा (दिन) | आरोग्य व भाग्य, नक्षत्रांच्या मोजणीवरून | 3 |
| योनी | शारीरिक अनुरूपता (14 योनी) | 4 |
| ग्रहमैत्री | दोन्ही राशिस्वामींची मैत्री | 5 |
| गण | स्वभाव: देव, मनुष्य किंवा राक्षस | 6 |
| भकूट | राशींची स्थिती: कुटुंबाचे सुख व समृद्धी | 7 |
| नाडी | आद्य, मध्य किंवा अंत्य नाडी: आरोग्य व संतती | 8 |

## स्कोअर कसा वाचायचा

| एकूण गुण | साधारणपणे मानले जाते |
|---|---|
| 18 पेक्षा कमी | शिफारस नाही |
| 18 ते 24 | मध्यम, दोष तपासून स्वीकारार्ह |
| 25 ते 32 | चांगली जुळणी |
| 33 ते 36 | उत्तम जुळणी |

जास्त गुण असूनही एखादा गंभीर दोष असेल तर ज्योतिषी काळजी व्यक्त करू शकतात, आणि मध्यम गुण असून कोणताही दोष नसेल तर स्थळ अनेकदा स्वीकारले जाते. म्हणून एकूण गुणांसोबत दोषही नक्की वाचा.

## दोष समजून घ्या

- **नाडी दोष**: दोघांची नाडी एकच असेल तर नाडीचे 8 पैकी 0 गुण मिळतात. कुटुंबे हा दोष सर्वात गंभीर मानतात. रास एक पण नक्षत्र वेगळे, किंवा नक्षत्र एक पण रास वेगळी असेल तर अनेक पंचांगांत हा दोष मानला जात नाही.
- **भकूट दोष**: दोन्ही राशी एकमेकांपासून 2/12, 5/9 किंवा 6/8 स्थानी असतील तर भकूटचे 7 पैकी 0 गुण. दोन्ही राशींचा स्वामी एकच असेल किंवा स्वामी परस्पर मित्र असतील तर त्याचा परिहार मानला जातो.
- **गण दोष**: एकाचा गण राक्षस आणि दुसऱ्याचा नाही.

असे परिहार लागू होत असतील तर टूल ते दाखवते, पण त्यांच्यामुळे स्कोअर बदलत नाही, कारण वेगवेगळ्या परंपरा ते वेगळ्या प्रकारे मानतात. हा निर्णय आपल्या ज्योतिषांवर सोपवा.

## एक पूर्ण उदाहरण

वधू: **रोहिणी, चरण 2** (वृषभ रास). वर: **हस्त, चरण 3** (कन्या रास).

- वर्ण: वैश्य व वैश्य, **1 पैकी 1**.
- वश्य: चतुष्पद व मानव, **2 पैकी 1**.
- तारा: रोहिणीपासून हस्तापर्यंत मोजले तर 10 येतात, म्हणजे जन्म तारा; उलट मोजणी 19 येते, तीही जन्म तारा. विपत, प्रत्यरी किंवा वध नाही, म्हणून **3 पैकी 3**.
- योनी: सर्प व महिष, **4 पैकी 1**.
- ग्रहमैत्री: शुक्र व बुध मित्र आहेत, **5 पैकी 5**.
- गण: वधू मनुष्य, वर देव, **6 पैकी 6**.
- भकूट: वृषभेपासून कन्या 5वी आणि कन्येपासून वृषभ 9वी रास, म्हणजे 5/9, **7 पैकी 0**.
- नाडी: अंत्य व आद्य वेगळ्या, **8 पैकी 8**.

एकूण: **36 पैकी 25**, म्हणजे कागदावर चांगली जुळणी, पण भकूट दोषासह. शुक्र व बुध मित्र असल्यामुळे अनेक ज्योतिषी हा दोष रद्द मानतील, पण याची खात्री त्यांच्याकडूनच करून घ्या.

## दुसऱ्या कॅल्क्युलेटरमध्ये एक-दोन गुणांचा फरक का?

शास्त्रात काही तपशील मोकळे ठेवले आहेत. छापील तक्ते मुख्यतः वश्यमध्ये, गण तक्ता कोणत्या क्रमाने वाचायचा (आधी वधू की आधी वर) यात, आणि जन्म तारा शुभ मानायची की नाही यात वेगळे आहेत. हा कॅल्क्युलेटर प्रत्येक ठिकाणी उत्तर भारतातील सर्वाधिक प्रचलित पद्धत वापरतो. तुमच्या घरच्या पंचांगात थोडा वेगळा आकडा आला तर साधारणपणे हेच कारण असते.

## गुण मिलनाच्या मर्यादा

गुण मिलन फक्त चंद्र पाहते. संपूर्ण पत्रिका जुळवताना मंगळ दोष, सप्तम स्थान, दशा आणि दोन्ही पत्रिकांचे बळ पाहिले जाते, आणि चांगले ज्योतिषी दोन्ही कुटुंबे व जोडप्यालाही समजून घेतात. हा स्कोअर पहिला अंदाज म्हणून पाहा आणि घरच्या ज्योतिषी किंवा गुरुजींकडून खात्री करा. स्थळ पुढे जात असेल तर [लग्नाचा बायोडाटा बनवा](/marathi/create/), [लग्न मुहूर्त 2026-2027](/marathi/lagna-muhurat-2026-2027/) पाहा किंवा आमची [मोफत साधने](/marathi/sadhane/) वापरून पाहा.
`,
    faqs: [
      {
        q: "लग्नासाठी किती गुण जुळायला हवेत?",
        a: "परंपरेनुसार 36 पैकी किमान 18. 18 ते 24 मध्यम, 25 ते 32 चांगले आणि 33 ते 36 उत्तम मानले जाते. नाडी व भकूट दोष एकूण गुणांइतकेच महत्त्वाचे आहेत.",
      },
      {
        q: "फक्त नक्षत्रावरून गुण मिलन करता येते का?",
        a: "हो. गुण मिलनासाठी फक्त नक्षत्र व रास लागते. नक्षत्र दोन राशींमध्ये पसरलेले असेल आणि चरण माहीत नसेल तर बायोडाटामध्ये लिहिलेली रास निवडा.",
      },
      {
        q: "दुसऱ्या वेबसाइटवर गुण वेगळे का येतात?",
        a: "वश्य तक्ता, गण तक्त्याचा क्रम आणि जन्म तारेचा नियम यांबाबत पंचांगांत थोडा फरक आहे, त्यामुळे एक-दोन गुणांचा फरक सामान्य आहे. दोष साधारणपणे सारखेच येतात.",
      },
      {
        q: "टूल नाडी किंवा भकूट दोषाचा परिहार आपोआप करते का?",
        a: "नाही. परिहाराच्या अटी असतील तर टूल त्या दाखवते, पण स्कोअर बदलत नाही. परिहार लागू होतो का, हे आपल्या ज्योतिषांना विचारा.",
      },
      {
        q: "माझी माहिती कुठे सेव्ह होते का?",
        a: "नाही. सर्व गणना तुमच्या ब्राउझरमध्येच होते आणि मागील माहिती फक्त तुमच्या स्वतःच्या डिव्हाइसवर राहते.",
      },
    ],
    updated,
    tool: "gunaMilan",
  },
];
