import type { PageContent } from "../types";

const updated = "2026-09-26";

export const AGE_GAP: PageContent[] = [
  {
    lang: "en",
    topic: "ageGap",
    slug: "age-gap-calculator",
    title: "Age Gap Calculator for Marriage – Bride & Groom Age Difference",
    description:
      "Find the exact age difference between bride and groom in years, months and days, or get age from a date of birth to write in your biodata. Free and private.",
    h1: "Age Gap Calculator for Marriage",
    lead: "Enter the bride's and groom's dates of birth to see each person's age and the exact gap between them. Or switch to single mode to work out age from a date of birth for your biodata.",
    sample: {},
    body: `
## What this calculator does

When a proposal comes in, one of the first things families look at is age. Birth dates in two biodatas are easy to compare roughly, but working out the exact difference in years, months and days by hand is fiddly, especially across leap years and months of different lengths. This tool does it instantly, and it also tells you each person's current age.

It has two modes:

- **Age gap (bride & groom)**: two dates of birth give each person's age and the difference between them.
- **Age from date of birth**: one date of birth gives the exact age, plus a ready line for your biodata, such as "Date of Birth: 14 March 1998 (Age: 28 years)".

## How to use it

1. Choose a mode at the top.
2. Pick the date(s) of birth using the date boxes.
3. "Age as on" is set to today. Change it if you want the age on another date, for example the wedding date or the date a form asks for.
4. Read the result on the right: ages in years and months, and the gap in years, months and days, with the total number of days.
5. In single mode, press **Copy** to paste the age line into the [biodata maker](/create/).

Everything is calculated in your browser. The dates you enter are not saved or sent anywhere.

## How the calculation works

Age is counted the way people normally count it: whole months first, then the days left over.

1. Count the full months from the earlier date to the later date.
2. If adding that many months would go past the later date, use one month fewer.
3. The remaining days are counted exactly on the calendar.
4. Twelve months make a year.

When a date falls at the end of a month, the calculator uses the last day of the shorter month. So from 31 January to 28 February counts as one full month. A person born on 29 February completes another year on 28 February in years that are not leap years. The total number of days is always exact, since it simply counts calendar days between the two dates.

## Worked example

Bride born 5 February 1999, groom born 20 November 1996.

- From 20 November 1996 to 20 January 1999 is 2 years and 2 months.
- From 20 January 1999 to 5 February 1999 is 16 days.
- So the gap is **2 years, 2 months, 16 days**, which is 807 days in all. The groom is older.

## A note on age difference

Every couple is different. An age gap, small or large, doesn't decide whether two people are right for each other. Families usually look at it together with education, nature, health, values and, above all, what the two people themselves want. This calculator only gives you the numbers; it doesn't judge them.

Under the Prohibition of Child Marriage Act, 2006, the legal minimum age of marriage in India is **21 years for men and 18 years for women**. A bill to raise the age for women to 21 was introduced in 2021 but lapsed without becoming law. If the chosen date shows either person below these ages, the tool points it out.

## Tips for writing age in a biodata

- Write the full date of birth, and add the age in brackets if you like. People reading the biodata months later can then work out the current age themselves.
- If you add birth time and place for kundali matching, keep them exact. Our [kundali matching tool](/kundali-matching/) and [rashi and nakshatra finder](/rashi-nakshatra-calculator/) use them.
- Write height clearly too, using the [height converter](/height-converter/).
- Planning ahead? See the [vivah muhurat dates](/vivah-muhurat-2026-2027/) for auspicious wedding dates.

Browse all [biodata tools](/biodata-tools/) for more free helpers.
`,
    faqs: [
      { q: "How is the age gap calculated?", a: "The calculator counts full calendar months between the two dates of birth, then the remaining days. Twelve months make a year. It also shows the exact total number of days." },
      { q: "What about someone born on 29 February?", a: "In years without 29 February, the calculator treats 28 February as the day the next year of age is completed. The total day count is always exact." },
      { q: "Can I see the age on the wedding date?", a: "Yes. Change the 'Age as on' date to the wedding date and both ages update." },
      { q: "What is the legal age of marriage in India?", a: "Under the Prohibition of Child Marriage Act, 2006, the minimum age is 21 years for men and 18 years for women." },
      { q: "Is there an ideal age gap for marriage?", a: "No single number is right for everyone. Families usually consider the age gap together with education, nature, health and the couple's own wishes." },
    ],
    updated,
    tool: "ageGap",
  },
  {
    lang: "hi",
    topic: "ageGap",
    slug: "age-gap-calculator",
    title: "उम्र का अंतर कैलकुलेटर – वर-वधू की उम्र में फ़र्क (फ्री)",
    description:
      "वर और वधू की उम्र में सटीक अंतर साल, महीने और दिन में जानें, या जन्म तिथि से उम्र निकालकर बायोडाटा में लिखें। मुफ़्त, तेज़ और पूरी तरह निजी कैलकुलेटर।",
    h1: "उम्र का अंतर कैलकुलेटर (शादी के लिए)",
    lead: "वधू और वर की जन्म तिथि डालें और दोनों की उम्र व उनके बीच का सटीक अंतर देखें। या सिर्फ़ एक जन्म तिथि से उम्र निकालकर बायोडाटा में लिखें।",
    sample: {},
    body: `
## यह कैलकुलेटर क्या करता है

कोई रिश्ता आने पर परिवार सबसे पहले जिन बातों को देखते हैं, उनमें उम्र भी है। दो बायोडाटा की जन्म तिथियाँ मोटे तौर पर मिलाना आसान है, पर साल, महीने और दिन में सटीक अंतर हाथ से निकालना झंझट का काम है, ख़ासकर लीप वर्ष और छोटे-बड़े महीनों की वजह से। यह टूल यह काम तुरंत कर देता है और दोनों की मौजूदा उम्र भी बताता है।

इसके दो तरीक़े हैं:

- **उम्र का अंतर (वधू और वर)**: दो जन्म तिथियों से दोनों की उम्र और उनके बीच का अंतर।
- **जन्म तिथि से उम्र**: एक जन्म तिथि से सटीक उम्र, और बायोडाटा के लिए तैयार लाइन, जैसे "जन्म तिथि: 14 मार्च 1998 (आयु: 28 वर्ष)"।

## कैसे इस्तेमाल करें

1. ऊपर तरीक़ा चुनें।
2. तारीख़ वाले खाने से जन्म तिथि चुनें।
3. "इस तारीख़ को उम्र" में आज की तारीख़ पहले से होती है। किसी और दिन की उम्र चाहिए, जैसे शादी की तारीख़ या किसी फ़ॉर्म की तारीख़, तो उसे बदल दें।
4. नतीजे में दोनों की उम्र (साल और महीने) और अंतर (साल, महीने, दिन) दिखेगा, साथ में कुल दिन भी।
5. एक जन्म तिथि वाले तरीक़े में **कॉपी करें** दबाकर लाइन को [बायोडाटा मेकर](/hindi/create/) में पेस्ट करें।

सारी गणना आपके ब्राउज़र में होती है। आपकी डाली तारीख़ें न कहीं सेव होती हैं, न कहीं भेजी जाती हैं।

## गणना कैसे होती है

उम्र वैसे ही गिनी जाती है जैसे हम आम तौर पर गिनते हैं: पहले पूरे महीने, फिर बचे हुए दिन।

1. पहली तारीख़ से दूसरी तारीख़ तक पूरे महीने गिने जाते हैं।
2. अगर उतने महीने जोड़ने से दूसरी तारीख़ पार हो जाए, तो एक महीना कम लिया जाता है।
3. बचे हुए दिन कैलेंडर पर सटीक गिने जाते हैं।
4. बारह महीने मिलकर एक साल।

महीने के आख़िरी दिन वाली तारीख़ में छोटे महीने का आख़िरी दिन लिया जाता है, इसलिए 31 जनवरी से 28 फ़रवरी तक एक पूरा महीना माना जाता है। 29 फ़रवरी को जन्मे व्यक्ति का अगला साल ग़ैर-लीप वर्ष में 28 फ़रवरी को पूरा माना जाता है। कुल दिनों की संख्या हमेशा सटीक होती है, क्योंकि वह सीधे कैलेंडर के दिन गिनती है।

## एक उदाहरण

वधू की जन्म तिथि 5 फ़रवरी 1999, वर की 20 नवंबर 1996।

- 20 नवंबर 1996 से 20 जनवरी 1999 तक 2 साल 2 महीने।
- 20 जनवरी 1999 से 5 फ़रवरी 1999 तक 16 दिन।
- यानी अंतर **2 वर्ष, 2 महीने, 16 दिन**, कुल 807 दिन। वर उम्र में बड़े हैं।

## उम्र के अंतर पर एक बात

हर जोड़ी अलग होती है। उम्र का अंतर कम हो या ज़्यादा, वह अकेले तय नहीं करता कि दो लोग एक-दूसरे के लिए सही हैं या नहीं। परिवार आमतौर पर इसे शिक्षा, स्वभाव, सेहत, संस्कार और सबसे बढ़कर दोनों की अपनी इच्छा के साथ मिलाकर देखते हैं। यह कैलकुलेटर सिर्फ़ आँकड़े देता है, उन पर कोई राय नहीं देता।

बाल विवाह प्रतिषेध अधिनियम, 2006 के अनुसार भारत में विवाह की न्यूनतम क़ानूनी उम्र **पुरुषों के लिए 21 वर्ष और महिलाओं के लिए 18 वर्ष** है। महिलाओं की उम्र 21 करने का एक विधेयक 2021 में लाया गया था, पर वह क़ानून बने बिना समाप्त हो गया। चुनी गई तारीख़ पर कोई इससे कम उम्र का हो तो टूल यह बता देता है।

## बायोडाटा में उम्र लिखने के सुझाव

- पूरी जन्म तिथि लिखें, और चाहें तो कोष्ठक में उम्र भी। महीनों बाद बायोडाटा पढ़ने वाले तब भी सही उम्र निकाल लेंगे।
- कुंडली मिलान के लिए जन्म समय और स्थान लिखें तो सटीक लिखें। हमारा [कुंडली मिलान टूल](/hindi/kundli-milan/) और [राशि-नक्षत्र जानने का टूल](/hindi/rashi-nakshatra-kaise-jane/) इन्हीं पर चलते हैं।
- ऊँचाई भी साफ़ लिखें, इसके लिए [हाइट कन्वर्टर](/hindi/height-converter/) देखें।
- आगे की तैयारी? शुभ तारीख़ों के लिए [विवाह मुहूर्त](/hindi/vivah-muhurat-2026-2027/) देखें।

और मुफ़्त टूल के लिए सभी [बायोडाटा टूल](/hindi/tools/) देखें।
`,
    faqs: [
      { q: "उम्र का अंतर कैसे निकाला जाता है?", a: "कैलकुलेटर दोनों जन्म तिथियों के बीच पूरे कैलेंडर महीने गिनता है, फिर बचे हुए दिन। बारह महीने से एक साल बनता है। साथ में कुल दिनों की सटीक गिनती भी दिखती है।" },
      { q: "29 फ़रवरी को जन्मे व्यक्ति की उम्र कैसे गिनी जाती है?", a: "जिस साल 29 फ़रवरी नहीं होती, उसमें 28 फ़रवरी को अगला साल पूरा माना जाता है। कुल दिनों की गिनती हमेशा सटीक रहती है।" },
      { q: "क्या शादी की तारीख़ पर उम्र देख सकते हैं?", a: "हाँ। 'इस तारीख़ को उम्र' में शादी की तारीख़ डालें, दोनों की उम्र उसी हिसाब से बदल जाएगी।" },
      { q: "भारत में शादी की क़ानूनी उम्र क्या है?", a: "बाल विवाह प्रतिषेध अधिनियम, 2006 के अनुसार पुरुषों के लिए न्यूनतम उम्र 21 वर्ष और महिलाओं के लिए 18 वर्ष है।" },
      { q: "शादी के लिए उम्र का सही अंतर कितना होना चाहिए?", a: "कोई एक संख्या सबके लिए सही नहीं होती। परिवार आमतौर पर उम्र के अंतर को शिक्षा, स्वभाव, सेहत और दोनों की इच्छा के साथ मिलाकर देखते हैं।" },
    ],
    updated,
    tool: "ageGap",
  },
  {
    lang: "mr",
    topic: "ageGap",
    slug: "age-gap-calculator",
    title: "वयातील अंतर कॅल्क्युलेटर – वधू-वराच्या वयातील फरक (मोफत)",
    description:
      "वधू आणि वराच्या वयातील नेमके अंतर वर्षे, महिने आणि दिवसांत काढा, किंवा जन्मतारखेवरून वय काढून बायोडाटात लिहा. मोफत, झटपट आणि पूर्णपणे खाजगी साधन.",
    h1: "वयातील अंतर कॅल्क्युलेटर (लग्नासाठी)",
    lead: "वधू आणि वराची जन्मतारीख टाका आणि दोघांचे वय व त्यांच्यातील नेमके अंतर पाहा. किंवा एकाच जन्मतारखेवरून वय काढून बायोडाटात लिहा.",
    sample: {},
    body: `
## हे कॅल्क्युलेटर काय करते

स्थळ आल्यावर कुटुंबे सर्वात आधी ज्या गोष्टी पाहतात, त्यात वयही असते. दोन बायोडाटांतील जन्मतारखा ढोबळमानाने ताडून पाहणे सोपे आहे, पण वर्षे, महिने आणि दिवसांत नेमके अंतर हाताने काढणे किचकट असते, विशेषतः लीप वर्ष आणि लहान-मोठ्या महिन्यांमुळे. हे साधन ते काम लगेच करते आणि दोघांचे सध्याचे वयही सांगते.

याच्या दोन पद्धती आहेत:

- **वयातील अंतर (वधू व वर)**: दोन जन्मतारखांवरून दोघांचे वय आणि त्यांच्यातील अंतर.
- **जन्मतारखेवरून वय**: एका जन्मतारखेवरून नेमके वय, आणि बायोडाटासाठी तयार ओळ, जसे "जन्म तारीख: 14 मार्च 1998 (वय: 28 वर्षे)".

## कसे वापरायचे

1. वर पद्धत निवडा.
2. तारखेच्या रकान्यातून जन्मतारीख निवडा.
3. "या तारखेला वय" मध्ये आजची तारीख आधीच असते. दुसऱ्या दिवशीचे वय हवे असेल, जसे लग्नाची तारीख किंवा एखाद्या फॉर्मची तारीख, तर ती बदला.
4. निकालात दोघांचे वय (वर्षे आणि महिने) आणि अंतर (वर्षे, महिने, दिवस) दिसते, सोबत एकूण दिवसही.
5. एका जन्मतारखेच्या पद्धतीत **कॉपी करा** दाबून ती ओळ [बायोडाटा मेकर](/marathi/create/) मध्ये पेस्ट करा.

सगळे गणित तुमच्या ब्राउझरमध्येच होते. तुम्ही टाकलेल्या तारखा कुठे सेव्ह होत नाहीत आणि कुठे पाठवल्याही जात नाहीत.

"या तारखेला वय" हा पर्याय अनेक ठिकाणी उपयोगी पडतो. वधू-वर मेळाव्याच्या फॉर्ममध्ये ठरावीक तारखेचे वय विचारले जाते, सरकारी अर्जांमध्ये एखाद्या कट-ऑफ तारखेचे वय लागते, आणि लग्नाच्या दिवशी दोघांचे वय किती असेल हेही घरच्यांना बघायचे असते. फक्त ती तारीख बदला, बाकी सगळे आपोआप मोजले जाते.

## गणित कसे होते

वय आपण नेहमी मोजतो तसेच मोजले जाते: आधी पूर्ण महिने, मग उरलेले दिवस.

1. पहिल्या तारखेपासून दुसऱ्या तारखेपर्यंत पूर्ण महिने मोजले जातात.
2. तेवढे महिने जोडल्यावर दुसरी तारीख ओलांडली जात असेल, तर एक महिना कमी धरला जातो.
3. उरलेले दिवस कॅलेंडरवर नेमके मोजले जातात.
4. बारा महिने म्हणजे एक वर्ष.

महिन्याच्या शेवटच्या दिवसाची तारीख असेल तर लहान महिन्याचा शेवटचा दिवस धरला जातो, म्हणून 31 जानेवारी ते 28 फेब्रुवारी हा एक पूर्ण महिना मानला जातो. 29 फेब्रुवारीला जन्मलेल्या व्यक्तीचे पुढचे वर्ष लीप नसलेल्या वर्षी 28 फेब्रुवारीला पूर्ण झाले असे धरले जाते. एकूण दिवसांची संख्या नेहमी अचूक असते, कारण ती थेट कॅलेंडरचे दिवस मोजते.

## एक उदाहरण

वधूची जन्मतारीख 5 फेब्रुवारी 1999, वराची 20 नोव्हेंबर 1996.

- 20 नोव्हेंबर 1996 ते 20 जानेवारी 1999: 2 वर्षे 2 महिने.
- 20 जानेवारी 1999 ते 5 फेब्रुवारी 1999: 16 दिवस.
- म्हणजे अंतर **2 वर्षे, 2 महिने, 16 दिवस**, एकूण 807 दिवस. वर वयाने मोठा आहे.

## वयातील अंतराबद्दल थोडेसे

प्रत्येक जोडी वेगळी असते. वयातील अंतर कमी असो वा जास्त, केवळ त्यावरून दोघे एकमेकांसाठी योग्य आहेत की नाही हे ठरत नाही. कुटुंबे साधारणपणे शिक्षण, स्वभाव, आरोग्य, संस्कार आणि सर्वात महत्त्वाचे म्हणजे दोघांची स्वतःची इच्छा यांच्यासोबत त्याचा विचार करतात. हे कॅल्क्युलेटर फक्त आकडे देते, त्यावर कोणताही निर्णय देत नाही.

बालविवाह प्रतिबंध कायदा, 2006 नुसार भारतात लग्नाचे किमान कायदेशीर वय **मुलासाठी 21 वर्षे आणि मुलीसाठी 18 वर्षे** आहे. मुलींचे वय 21 करण्याचे विधेयक 2021 मध्ये मांडले गेले होते, पण ते कायदा न होताच रद्द झाले. निवडलेल्या तारखेला कोणाचे वय यापेक्षा कमी असेल तर साधन तसे सांगते.

## बायोडाटात वय लिहिण्याच्या टिप्स

- पूर्ण जन्मतारीख लिहा, आणि हवे असल्यास कंसात वयही. काही महिन्यांनी बायोडाटा वाचणाऱ्यांनाही मग नेमके वय काढता येते.
- गुण मिलनासाठी जन्मवेळ आणि जन्मस्थळ लिहिणार असाल तर ते अचूक लिहा. आमचे [गुण मिलन साधन](/marathi/gun-milan/) आणि [रास-नक्षत्र शोधा](/marathi/rashi-nakshatra-shodha/) हेच वापरतात.
- उंचीही स्पष्ट लिहा, त्यासाठी [उंची कन्व्हर्टर](/marathi/height-converter/) पाहा.
- पुढची तयारी? शुभ तारखांसाठी [लग्न मुहूर्त](/marathi/lagna-muhurat-2026-2027/) पाहा.

आणखी मोफत साधनांसाठी सर्व [बायोडाटा साधने](/marathi/sadhane/) पाहा.
`,
    faqs: [
      { q: "वयातील अंतर कसे काढले जाते?", a: "कॅल्क्युलेटर दोन्ही जन्मतारखांमधील पूर्ण कॅलेंडर महिने मोजते, मग उरलेले दिवस. बारा महिन्यांचे एक वर्ष होते. सोबत एकूण दिवसांची अचूक संख्याही दिसते." },
      { q: "29 फेब्रुवारीला जन्मलेल्यांचे वय कसे मोजतात?", a: "ज्या वर्षी 29 फेब्रुवारी नसते, त्या वर्षी 28 फेब्रुवारीला पुढचे वर्ष पूर्ण झाले असे धरले जाते. एकूण दिवसांची मोजणी नेहमी अचूक असते." },
      { q: "लग्नाच्या तारखेला वय किती असेल ते पाहता येते का?", a: "हो. 'या तारखेला वय' मध्ये लग्नाची तारीख टाका, दोघांचे वय त्यानुसार बदलेल." },
      { q: "भारतात लग्नाचे कायदेशीर वय किती आहे?", a: "बालविवाह प्रतिबंध कायदा, 2006 नुसार मुलासाठी किमान वय 21 वर्षे आणि मुलीसाठी 18 वर्षे आहे." },
      { q: "लग्नासाठी वयात किती अंतर योग्य?", a: "सगळ्यांसाठी योग्य असा एकच आकडा नाही. कुटुंबे साधारणपणे वयातील अंतराचा विचार शिक्षण, स्वभाव, आरोग्य आणि दोघांच्या इच्छेसोबत करतात." },
    ],
    updated,
    tool: "ageGap",
  },
];
