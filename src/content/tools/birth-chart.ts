import type { PageContent } from "../types";

const updated = "2026-09-26";

export const BIRTH_CHART: PageContent[] = [
  {
    lang: "en",
    topic: "birthChart",
    slug: "rashi-nakshatra-calculator",
    title: "Rashi & Nakshatra Finder by Date of Birth – Free Calculator",
    description:
      "Find your rashi, nakshatra, charan, gan, nadi and lagna from date, time and place of birth (Lahiri ayanamsa), then fill your biodata kundali chart in one tap.",
    h1: "Rashi & Nakshatra Calculator: Find Rashi, Nakshatra and Lagna by Birth Date",
    lead: "Enter the date, time and place of birth to see the Moon sign (rashi), nakshatra with charan, gan, nadi and lagna, with a North Indian kundali you can add to your marriage biodata.",
    sample: {},
    body: `
## How to use the rashi and nakshatra finder

1. Pick the **date of birth**.
2. Choose the **time of birth** with the hour, minute and AM / PM buttons. The line below the time repeats it in words ("6:45 AM, in the morning") so a 12 AM / 12 PM mix-up is easy to spot. If nobody knows the time, tick **I don't know the birth time**.
3. Choose the **place of birth**. The list has every Maharashtra district headquarters, major cities of every state and common NRI cities such as Dubai, London, New York, Toronto, Singapore and Sydney. For a small town, pick the nearest city; for anywhere else, choose "Other place" and type the latitude and longitude.
4. Check the **time zone**. Indian cities use IST (UTC+5:30). For cities abroad, tick the summer-time (DST) box if the clocks were moved ahead at the time of birth, or change the UTC offset yourself.
5. Press **Find rashi & nakshatra**. Your results, the kundali chart and a planet table appear below the form.

## What the results mean

| Result | What it is | Why families ask for it |
|---|---|---|
| Rashi | The sign the Moon was in | Printed on almost every Hindu biodata |
| Nakshatra | One of 27 lunar mansions of 13°20′ each | Used for naming and for gun milan |
| Charan (pada) | Quarter of the nakshatra, 1 to 4 | Fixes the rashi when a nakshatra spans two signs |
| Gan | Dev, Manushya or Rakshas, set by the nakshatra | One of the eight kootas in matching |
| Nadi | Adya, Madhya or Antya, set by the nakshatra | Nadi dosh carries the most points (8 of 36) |
| Lagna | The sign rising in the east at birth | House 1 of the kundali |

The tool also shows your **Vedic sun sign** and your **Western zodiac sign**. They often differ by one sign because Western astrology uses the tropical zodiac while Indian astrology uses the sidereal zodiac, which is currently about 24° behind.

## Why the birth time matters

The Moon moves quickly: it stays in one rashi for about two and a quarter days, in one nakshatra for about a day, and in one charan for roughly six hours. The lagna changes every two hours or so. That is why:

- **Without a birth time** we calculate for 12 noon. The rashi is usually right, but the nakshatra and charan may be off, and the lagna and kundali cannot be found. If the Moon changed nakshatra or rashi on that date, the tool shows the exact time of the change, so you can ask an elder whether the birth was before or after it.
- **With a rough time** ("early morning") the rashi and nakshatra are usually safe, but check the lagna with your family astrologer.

## Worked example

A girl born on **14 March 1998 at 6:45 AM in Pune** gets: rashi **Kanya**, nakshatra **Uttara Phalguni**, charan **4**, gan **Manushya**, nadi **Adya** and lagna **Kumbh**. Her Vedic sun sign is Kumbh and her Western sign is Pisces.

The same date shows why time matters. The Moon entered Hasta at about 9:14 AM, so a baby born at 10:30 AM that day would have nakshatra **Hasta**, gan **Dev** and lagna **Vrishabh**. The lagna at 6:45 AM was also near the end of Kumbh, so a birth only a few minutes later would already have Meen lagna.

## How the calculation works

Everything is calculated in your browser; your birth details are not sent anywhere.

- Planet positions come from the open-source astronomy-engine library (accurate to about one arcminute), as seen from the centre of the Earth (geocentric).
- These positions are converted to the sidereal zodiac with the **Lahiri (Chitrapaksha) ayanamsa**, the standard used by the Indian government's Rashtriya Panchang and by most Indian astrologers. For 1 January 2026 it gives 24°13′19″.
- Rahu is the **mean node** used in traditional panchangs, and Ketu is exactly opposite it.
- The lagna comes from the local sidereal time and latitude of the birth place. Houses are whole signs, as in a North Indian rashi chart.

We checked the results against published charts and panchang tables. Moon nakshatra end times and lagna start times matched a leading online panchang within about 2 minutes. Small differences between software (a different ayanamsa, the true node, or old local time zones) can still change a result when the Moon or the lagna sits right on a boundary. **Please confirm important details with your panchang or family astrologer.**

## How it fills your biodata kundali

Press **Use in my biodata** and the tool writes rashi, nakshatra, charan, gan and nadi into the biodata saved on this device. It also adds the kundali chart with the lagna and the planets in each house, in the language of this page. Fields you have already filled are kept unless you tick "Overwrite". Then open the [biodata maker](/create/) to see the chart on your biodata and download the PDF.

## Next steps

- Match two horoscopes with the [kundali matching (gun milan) calculator](/kundali-matching/), using the nakshatra and charan found here.
- Read [what to write in a marriage biodata](/what-to-write-in-marriage-biodata/) and see the [Hindu marriage biodata format](/hindu-marriage-biodata/).
- Browse all [free biodata tools](/biodata-tools/).
`,
    faqs: [
      {
        q: "I don't know my nakshatra. How can I find it?",
        a: "Enter your date, time and place of birth in the calculator above. It shows your nakshatra with charan, gan and nadi. If you do not know the birth time, it still gives the rashi and warns you if the nakshatra changed on that date.",
      },
      {
        q: "How do I find my rashi by date of birth without the time?",
        a: "Tick 'I don't know the birth time'. We calculate for 12 noon. The Moon spends about two and a quarter days in each rashi, so the rashi is right on most dates; the tool tells you if the Moon changed rashi that day and at what time.",
      },
      {
        q: "Why is my rashi different from my sun sign?",
        a: "In Indian astrology, rashi means the Moon sign, not the sun sign. Also, the Western sun sign uses the tropical zodiac, which is about 24 degrees ahead of the sidereal zodiac used in India, so even the sun sign can differ by one sign.",
      },
      {
        q: "Why does another app or my astrologer show a different lagna or nakshatra?",
        a: "Usually the birth time, the time zone or the ayanamsa differs. We use Lahiri ayanamsa and the mean Rahu. If the Moon or lagna is close to a boundary, a few minutes of difference in time can change the result, so confirm with your family astrologer.",
      },
      {
        q: "Is my birth information saved or shared?",
        a: "No. The calculation runs in your browser. Only when you press 'Use in my biodata' are the results saved, and then only in this browser's storage for your biodata draft.",
      },
    ],
    updated,
    tool: "birthChart",
  },
  {
    lang: "hi",
    topic: "birthChart",
    slug: "rashi-nakshatra-kaise-jane",
    title: "राशि और नक्षत्र कैसे जानें – जन्म तिथि से राशि, लग्न",
    description:
      "जन्म तिथि, समय और स्थान से अपनी राशि, नक्षत्र, चरण, गण, नाड़ी और लग्न जानें (लाहिड़ी अयनांश)। कुंडली चार्ट एक क्लिक में शादी के बायोडाटा में जोड़ें, मुफ़्त।",
    h1: "राशि और नक्षत्र कैसे जानें: जन्म तिथि और समय से राशि, नक्षत्र, लग्न",
    lead: "जन्म की तारीख़, समय और स्थान डालें और तुरंत अपनी चंद्र राशि, नक्षत्र, चरण, गण, नाड़ी और लग्न देखें, साथ में उत्तर भारतीय कुंडली भी, जिसे आप शादी के बायोडाटा में जोड़ सकते हैं।",
    sample: {},
    body: `
## राशि नक्षत्र कैलकुलेटर का उपयोग कैसे करें

1. **जन्म तिथि** चुनें।
2. घंटा, मिनट और AM / PM बटन से **जन्म समय** चुनें। नीचे वही समय शब्दों में दिखता है (जैसे "सुबह 6:45"), ताकि रात 12 और दोपहर 12 की गड़बड़ी तुरंत पकड़ में आ जाए। समय पता न हो तो **जन्म समय पता नहीं है** पर टिक करें।
3. **जन्म स्थान** चुनें। सूची में महाराष्ट्र के सभी ज़िला मुख्यालय, हर राज्य के प्रमुख शहर और दुबई, लंदन, न्यूयॉर्क, टोरंटो, सिंगापुर, सिडनी जैसे NRI शहर हैं। छोटा गाँव या कस्बा हो तो सबसे पास का शहर चुनें, या "अन्य स्थान" में अक्षांश-देशांतर डालें।
4. **टाइम ज़ोन** देख लें। भारत के शहरों के लिए IST (UTC+5:30) अपने आप लगता है। विदेश में जन्म हो और उस समय समर टाइम (DST) चल रहा हो तो उसका बॉक्स टिक करें, या UTC अंतर ख़ुद बदलें।
5. **राशि और नक्षत्र जानें** दबाएँ। नीचे परिणाम, कुंडली चार्ट और ग्रहों की तालिका दिखेगी।

## परिणाम का मतलब

| परिणाम | क्या है | बायोडाटा में क्यों ज़रूरी |
|---|---|---|
| राशि | जन्म के समय चंद्रमा जिस राशि में था | लगभग हर हिंदू बायोडाटा में लिखी जाती है |
| नक्षत्र | 27 नक्षत्रों में से एक, हर एक 13°20′ का | नामकरण और गुण मिलान में काम आता है |
| चरण | नक्षत्र का चौथाई भाग, 1 से 4 | दो राशियों में फैले नक्षत्र में राशि तय करता है |
| गण | देव, मनुष्य या राक्षस, नक्षत्र से तय | अष्टकूट मिलान का एक कूट |
| नाड़ी | आद्य, मध्य या अंत्य, नक्षत्र से तय | नाड़ी दोष के सबसे ज़्यादा 8 अंक |
| लग्न | जन्म के समय पूर्व में उदित राशि | कुंडली का पहला भाव |

साथ में **वैदिक सूर्य राशि** और **पश्चिमी (अंग्रेज़ी) राशि** भी दिखती है। ये अक्सर एक राशि अलग होती हैं, क्योंकि पश्चिमी ज्योतिष सायन राशिचक्र मानता है और भारतीय ज्योतिष निरयन, जिनमें अभी लगभग 24° का अंतर है।

## rashi kaise pata kare: जन्म समय क्यों ज़रूरी है

चंद्रमा तेज़ चलता है। वह एक राशि में लगभग सवा दो दिन, एक नक्षत्र में लगभग एक दिन और एक चरण में करीब 6 घंटे रहता है। लग्न तो हर दो घंटे में बदल जाता है। इसलिए:

- **जन्म समय पता न हो** तो हम दोपहर 12 बजे का समय मानते हैं। राशि आमतौर पर सही रहती है, पर नक्षत्र और चरण बदल सकते हैं, और लग्न व कुंडली नहीं बन सकती। अगर उस दिन चंद्रमा ने नक्षत्र या राशि बदली हो, तो टूल बदलने का सही समय दिखाता है, ताकि आप घर के बड़ों से पूछ सकें कि जन्म उससे पहले हुआ या बाद में।
- **अंदाज़न समय** ("सुबह-सुबह") हो तो राशि और नक्षत्र प्रायः ठीक रहते हैं, पर लग्न अपने ज्योतिषी से ज़रूर मिलवा लें।

## उदाहरण

**14 मार्च 1998, सुबह 6:45, पुणे** में जन्मी लड़की के लिए परिणाम: राशि **कन्या**, नक्षत्र **उत्तरा फाल्गुनी**, चरण **4**, गण **मनुष्य**, नाड़ी **आद्य** और लग्न **कुंभ**। वैदिक सूर्य राशि कुंभ है और अंग्रेज़ी राशि Pisces (मीन)।

इसी दिन से समय का महत्व भी समझ आता है। सुबह लगभग 9:14 बजे चंद्रमा हस्त नक्षत्र में आ गया, इसलिए उसी दिन सुबह 10:30 बजे जन्मे बच्चे का नक्षत्र **हस्त**, गण **देव** और लग्न **वृषभ** होगा। 6:45 बजे लग्न भी कुंभ के आख़िरी अंशों में था, यानी कुछ ही मिनट बाद जन्म होता तो लग्न मीन हो जाता।

## गणना कैसे होती है

पूरी गणना आपके ब्राउज़र में होती है; आपकी जन्म जानकारी कहीं भेजी नहीं जाती।

- ग्रहों की स्थिति ओपन-सोर्स astronomy-engine लाइब्रेरी से पृथ्वी के केंद्र से (भूकेंद्रीय) निकाली जाती है, जिसकी सटीकता लगभग एक कला (arcminute) है।
- फिर **लाहिड़ी (चित्रपक्ष) अयनांश** से निरयन स्थिति निकाली जाती है। यही अयनांश भारत सरकार के राष्ट्रीय पंचांग और ज़्यादातर ज्योतिषी इस्तेमाल करते हैं। 1 जनवरी 2026 को इसका मान 24°13′19″ आता है।
- राहु के लिए पारंपरिक पंचांगों वाला **मध्यम राहु** लिया गया है, केतु ठीक उसके सामने (180°) होता है।
- लग्न जन्म स्थान के अक्षांश और स्थानीय नक्षत्र-काल से निकलता है। भाव "राशि = भाव" पद्धति से हैं, जैसे उत्तर भारतीय कुंडली में।

हमने परिणामों को प्रकाशित कुंडलियों और पंचांग तालिकाओं से मिलाकर जाँचा है। नक्षत्र समाप्ति और लग्न आरंभ के समय एक प्रमुख ऑनलाइन पंचांग से लगभग 2 मिनट के भीतर मिले। फिर भी अलग अयनांश, स्पष्ट (true) राहु या पुराने स्थानीय समय की वजह से सीमा के पास का परिणाम बदल सकता है। **महत्वपूर्ण निर्णय से पहले अपने पंचांग या पारिवारिक ज्योतिषी से पुष्टि ज़रूर करें।**

## बायोडाटा की कुंडली में कैसे भरें

**मेरे बायोडाटा में भरें** दबाते ही इस डिवाइस पर सेव बायोडाटा में राशि, नक्षत्र, चरण, गण और नाड़ी भर जाते हैं। जन्म समय पता हो तो लग्न और हर भाव के ग्रहों के साथ कुंडली चार्ट भी हिंदी में जुड़ जाता है। पहले से भरी जानकारी तभी बदली जाती है जब आप "पहले से भरी जानकारी बदल दें" चुनें। इसके बाद [बायोडाटा मेकर](/hindi/create/) खोलकर कुंडली देखें और PDF डाउनलोड करें।

## आगे क्या करें

- यहाँ मिले नक्षत्र और चरण से [कुंडली मिलान (गुण मिलान) कैलकुलेटर](/hindi/kundli-milan/) में 36 गुण मिलाएँ।
- पढ़ें [शादी का बायोडाटा कैसे बनाएँ](/hindi/biodata-kaise-banaye/)।
- सभी [मुफ़्त बायोडाटा टूल्स](/hindi/tools/) देखें।
`,
    faqs: [
      {
        q: "rashi kaise pata kare? जन्म तिथि से राशि कैसे जानें?",
        a: "ऊपर के कैलकुलेटर में जन्म तिथि, समय और स्थान डालें। यह चंद्रमा की स्थिति से आपकी राशि, नक्षत्र, चरण, गण, नाड़ी और लग्न बता देता है।",
      },
      {
        q: "मुझे अपना नक्षत्र नहीं पता, कैसे पता करूँ?",
        a: "जन्म की तारीख़, समय और स्थान डालें, टूल नक्षत्र और चरण दिखा देगा। समय पता न हो तो भी राशि मिल जाती है, और उस दिन नक्षत्र बदला हो तो बदलने का समय भी दिखता है।",
      },
      {
        q: "बिना जन्म समय के राशि कैसे जानें?",
        a: "'जन्म समय पता नहीं है' चुनें। हम दोपहर 12 बजे की गणना करते हैं। चंद्रमा एक राशि में लगभग सवा दो दिन रहता है, इसलिए ज़्यादातर तारीख़ों पर राशि सही आती है; उस दिन राशि बदली हो तो टूल समय के साथ बता देता है।",
      },
      {
        q: "मेरी राशि और अंग्रेज़ी राशि (सन साइन) अलग क्यों है?",
        a: "भारतीय ज्योतिष में राशि का मतलब चंद्र राशि है, सूर्य राशि नहीं। साथ ही अंग्रेज़ी राशि सायन राशिचक्र से निकलती है, जो भारतीय निरयन राशिचक्र से लगभग 24° आगे है।",
      },
      {
        q: "दूसरे ऐप या ज्योतिषी का लग्न या नक्षत्र अलग क्यों आता है?",
        a: "आमतौर पर जन्म समय, टाइम ज़ोन या अयनांश का फ़र्क होता है। हम लाहिड़ी अयनांश और मध्यम राहु लेते हैं। सीमा के पास कुछ मिनट का अंतर भी परिणाम बदल सकता है, इसलिए पारिवारिक ज्योतिषी से पुष्टि करें।",
      },
    ],
    updated,
    tool: "birthChart",
  },
  {
    lang: "mr",
    topic: "birthChart",
    slug: "rashi-nakshatra-shodha",
    title: "रास व नक्षत्र शोधा – जन्म तारखेवरून रास, नक्षत्र, गण, नाडी, लग्न (मोफत)",
    description:
      "जन्म तारीख, वेळ आणि ठिकाणावरून तुमची रास, नक्षत्र, चरण, गण, नाडी आणि लग्न शोधा (लाहिरी अयनांश). कुंडली एका क्लिकमध्ये लग्नाच्या बायोडाटामध्ये भरा. मोफत.",
    h1: "रास व नक्षत्र शोधा: जन्म तारीख आणि वेळेवरून रास, नक्षत्र, लग्न",
    lead: "जन्म तारीख, वेळ आणि ठिकाण भरा आणि लगेच तुमची चंद्र रास, नक्षत्र, चरण, गण, नाडी व लग्न पाहा. सोबत उत्तर भारतीय पद्धतीची कुंडलीही मिळते, जी तुम्ही लग्नाच्या बायोडाटामध्ये जोडू शकता.",
    sample: {},
    body: `
## रास नक्षत्र शोधक कसे वापरायचे

1. **जन्म तारीख** निवडा.
2. तास, मिनिट आणि AM / PM बटणांनी **जन्म वेळ** निवडा. खाली तीच वेळ शब्दांत दिसते (उदा. "सकाळी 6:45"), त्यामुळे रात्री 12 आणि दुपारी 12 यांतली गल्लत लगेच लक्षात येते. वेळ माहीत नसेल तर **जन्म वेळ माहीत नाही** वर टिक करा.
3. **जन्म ठिकाण** निवडा. यादीत महाराष्ट्रातील सर्व 36 जिल्हा मुख्यालये, बारामती, पंढरपूर, कराड, इचलकरंजी अशी शहरे, प्रत्येक राज्यातील प्रमुख शहरे आणि दुबई, लंडन, न्यूयॉर्क, टोरांटो, सिंगापूर, सिडनी अशी NRI शहरे आहेत. छोटे गाव असेल तर जवळचे शहर निवडा, किंवा "इतर ठिकाण" मध्ये अक्षांश-रेखांश भरा.
4. **टाइम झोन** तपासा. भारतातील शहरांसाठी IST (UTC+5:30) आपोआप लागतो. परदेशात जन्म असेल आणि त्या वेळी समर टाइम (DST) सुरू असेल, तर तो बॉक्स टिक करा किंवा UTC फरक स्वतः बदला.
5. **रास व नक्षत्र शोधा** दाबा. खाली निकाल, कुंडली आणि ग्रहस्थितीचा तक्ता दिसेल.

## निकालाचा अर्थ

| निकाल | म्हणजे काय | बायोडाटामध्ये का लागते |
|---|---|---|
| रास | जन्माच्या वेळी चंद्र ज्या राशीत होता ती | जवळजवळ प्रत्येक हिंदू बायोडाटामध्ये लिहितात |
| नक्षत्र | 27 नक्षत्रांपैकी एक, प्रत्येकी 13°20′ | नामकरण आणि गुण मिलनासाठी |
| चरण | नक्षत्राचा चौथा भाग, 1 ते 4 | दोन राशींत पसरलेल्या नक्षत्रात रास ठरवते |
| गण | देव, मनुष्य किंवा राक्षस, नक्षत्रावरून | अष्टकूट मिलनातील एक कूट |
| नाडी | आद्य, मध्य किंवा अंत्य, नक्षत्रावरून | नाडी दोषाला सर्वाधिक 8 गुण |
| लग्न | जन्माच्या वेळी पूर्व क्षितिजावर उगवणारी रास | कुंडलीचे पहिले स्थान |

सोबत **वैदिक सूर्य रास** आणि **पाश्चात्त्य (इंग्रजी) रास** ही दिसते. या बहुतेक वेळा एका राशीने वेगळ्या असतात, कारण पाश्चात्त्य ज्योतिष सायन राशिचक्र वापरते तर भारतीय ज्योतिष निरयन; दोघांत सध्या सुमारे 24° फरक आहे.

## जन्म वेळ का महत्त्वाची

चंद्र वेगाने फिरतो. तो एका राशीत सुमारे सव्वा दोन दिवस, एका नक्षत्रात सुमारे एक दिवस आणि एका चरणात साधारण 6 तास असतो. लग्न तर दर दोन तासांनी बदलते. म्हणून:

- **जन्म वेळ माहीत नसेल** तर आम्ही दुपारी 12 ची वेळ धरतो. रास बहुतेक बरोबर येते, पण नक्षत्र आणि चरण बदलू शकतात, आणि लग्न व कुंडली काढता येत नाही. त्या दिवशी चंद्राने नक्षत्र किंवा रास बदलली असेल, तर बदलाची नेमकी वेळ दाखवली जाते, म्हणजे घरातील ज्येष्ठांना विचारता येते की जन्म त्याआधी झाला की नंतर.
- **अंदाजे वेळ** ("पहाटे") माहीत असेल तर रास आणि नक्षत्र साधारण बरोबर येतात, पण लग्न आपल्या ज्योतिषांकडून तपासून घ्या.

## उदाहरण

**14 मार्च 1998, सकाळी 6:45, पुणे** येथे जन्मलेल्या मुलीचा निकाल: रास **कन्या**, नक्षत्र **उत्तरा फाल्गुनी**, चरण **4**, गण **मनुष्य**, नाडी **आद्य** आणि लग्न **कुंभ**. वैदिक सूर्य रास कुंभ, तर इंग्रजी रास Pisces (मीन).

याच दिवसावरून वेळेचे महत्त्व कळते. सकाळी सुमारे 9:14 वाजता चंद्र हस्त नक्षत्रात गेला, म्हणून त्याच दिवशी सकाळी 10:30 ला जन्मलेल्या बाळाचे नक्षत्र **हस्त**, गण **देव** आणि लग्न **वृषभ** येते. 6:45 ला लग्नही कुंभेच्या शेवटच्या अंशांत होते, म्हणजे काही मिनिटांनी जन्म झाला असता तर लग्न मीन आले असते.

## गणना कशी होते

संपूर्ण गणना तुमच्या ब्राउझरमध्येच होते; तुमची जन्म माहिती कुठेही पाठवली जात नाही.

- ग्रहस्थिती ओपन-सोर्स astronomy-engine लायब्ररीतून पृथ्वीच्या केंद्रावरून (भूकेंद्रीय) काढली जाते. तिची अचूकता सुमारे एक कला (arcminute) आहे.
- नंतर **लाहिरी (चित्रपक्ष) अयनांश** वापरून निरयन स्थिती काढली जाते. भारत सरकारचे राष्ट्रीय पंचांग आणि बहुतेक ज्योतिषी हेच अयनांश वापरतात. 1 जानेवारी 2026 रोजी त्याचे मूल्य 24°13′19″ येते.
- राहूसाठी पारंपरिक पंचांगांतील **मध्यम राहू** घेतला आहे; केतू त्याच्या बरोबर समोर (180°) असतो.
- लग्न जन्म ठिकाणाच्या अक्षांशावरून आणि स्थानिक नाक्षत्र कालावरून काढले जाते. स्थाने "रास = स्थान" पद्धतीने, उत्तर भारतीय कुंडलीप्रमाणे आहेत.

आम्ही निकाल प्रकाशित कुंडल्या आणि पंचांग तक्त्यांशी जुळवून तपासले आहेत. नक्षत्र समाप्तीच्या आणि लग्नारंभाच्या वेळा एका प्रमुख ऑनलाइन पंचांगाशी सुमारे 2 मिनिटांच्या आत जुळल्या. तरीही वेगळे अयनांश, स्पष्ट (true) राहू किंवा जुनी स्थानिक वेळ यांमुळे सीमेजवळचा निकाल बदलू शकतो. **महत्त्वाचा निर्णय घेण्यापूर्वी आपले पंचांग किंवा कौटुंबिक ज्योतिषी यांच्याकडून खात्री करून घ्या.**

## बायोडाटातील कुंडली कशी भरली जाते

**माझ्या बायोडाटामध्ये भरा** दाबताच या डिव्हाइसवर जतन केलेल्या बायोडाटामध्ये रास, नक्षत्र, चरण, गण आणि नाडी भरली जाते. जन्म वेळ माहीत असेल तर लग्न आणि प्रत्येक स्थानातील ग्रहांसह कुंडलीही मराठीत जोडली जाते. आधी भरलेली माहिती तुम्ही "आधी भरलेली माहिती बदला" निवडले तरच बदलते. नंतर [बायोडाटा मेकर](/marathi/create/) उघडून कुंडली पाहा आणि PDF डाउनलोड करा.

## पुढे काय

- इथे मिळालेले नक्षत्र आणि चरण वापरून [गुण मिलन कॅल्क्युलेटर](/marathi/gun-milan/) मध्ये 36 गुण जुळवा.
- वाचा [लग्नाचा बायोडाटा कसा बनवायचा](/marathi/lagnacha-biodata-kasa-banvaycha/) आणि [हिंदू बायोडाटा नमुना](/marathi/hindu-biodata/).
- सर्व [मोफत बायोडाटा साधने](/marathi/sadhane/) पाहा.
`,
    faqs: [
      {
        q: "मला माझे नक्षत्र माहीत नाही, ते कसे शोधू?",
        a: "वरील साधनात जन्म तारीख, वेळ आणि ठिकाण भरा. तुमचे नक्षत्र, चरण, गण आणि नाडी लगेच दिसेल. वेळ माहीत नसली तरी रास मिळते, आणि त्या दिवशी नक्षत्र बदलले असेल तर बदलाची वेळही दिसते.",
      },
      {
        q: "जन्म तारखेवरून रास कशी शोधायची? (rashi kashi olkhaychi)",
        a: "रास म्हणजे जन्माच्या वेळी चंद्र ज्या राशीत होता ती. जन्म तारीख, वेळ आणि ठिकाण भरले की साधन चंद्राची निरयन स्थिती काढून रास सांगते.",
      },
      {
        q: "लग्न रास म्हणजे काय?",
        a: "लग्न रास म्हणजे जन्माच्या क्षणी पूर्व क्षितिजावर उगवत असलेली रास (जन्मलग्न). ती चंद्र रासपेक्षा वेगळी असते आणि साधारण दर दोन तासांनी बदलते, म्हणून ती काढण्यासाठी अचूक जन्म वेळ लागते. वरील साधन जन्म वेळ व ठिकाण भरल्यावर लग्न रासही दाखवते. लग्नाच्या बायोडाटात मात्र 'रास' म्हणून चंद्र रास लिहिली जाते.",
      },
      {
        q: "जन्म वेळ माहीत नसताना रास कळू शकते का?",
        a: "हो, बहुतेक वेळा. 'जन्म वेळ माहीत नाही' निवडल्यावर आम्ही दुपारी 12 ची गणना करतो. चंद्र एका राशीत सुमारे सव्वा दोन दिवस असतो; त्या दिवशी रास बदलली असेल तर साधन बदलाची वेळ सांगते.",
      },
      {
        q: "माझी रास आणि इंग्रजी रास (सन साइन) वेगळी का?",
        a: "भारतीय ज्योतिषात रास म्हणजे चंद्र रास, सूर्य रास नव्हे. शिवाय इंग्रजी रास सायन राशिचक्रावरून ठरते, जे भारतीय निरयन राशिचक्रापेक्षा सुमारे 24° पुढे आहे.",
      },
      {
        q: "दुसऱ्या ॲप किंवा ज्योतिषांचे लग्न वेगळे का येते?",
        a: "बहुतेक वेळा जन्म वेळ, टाइम झोन किंवा अयनांश वेगळे असतात. आम्ही लाहिरी अयनांश आणि मध्यम राहू वापरतो. सीमेजवळ काही मिनिटांचा फरकही निकाल बदलतो, म्हणून कौटुंबिक ज्योतिषांकडून खात्री करा.",
      },
    ],
    updated: "2026-10-06",
    tool: "birthChart",
  },
];
