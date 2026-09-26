import type { PageContent } from "../types";

const updated = "2026-09-26";

export const WHATSAPP: PageContent[] = [
  {
    lang: "en",
    topic: "whatsapp",
    slug: "biodata-for-whatsapp",
    title: "Biodata for WhatsApp – Marriage Biodata as Text, Free",
    description:
      "Turn your marriage biodata into neat WhatsApp text: bold headings, one detail per line, empty fields skipped. Copy it or share straight to WhatsApp. Free.",
    h1: "Biodata for WhatsApp: Copy-Ready Marriage Biodata Text",
    lead: "Many families first share a biodata as a plain WhatsApp message, not a file. This tool turns the biodata you made in our editor into clean, readable text you can copy or send in one tap.",
    sample: {},
    body: `
## Why send your biodata as WhatsApp text?

A printed or PDF biodata looks best, but a text message has its own advantages. It opens instantly on any phone, even on a slow connection. Relatives can forward it to a group without downloading anything. Marriage bureaus and community groups often ask for "details in text" so they can search and copy names, dates and phone numbers. And elders who find small PDF text hard to read can zoom a WhatsApp message comfortably.

The trouble is that typing it by hand is slow and it usually ends up messy: no headings, inconsistent spacing, and fields in a random order. This tool builds the message from the biodata you have already filled in, so the order and wording match your biodata exactly.

## How to use the tool

1. Fill in your biodata in the [free biodata maker](/create/). It saves automatically in your browser, so you don't need an account.
2. Open this page on the same phone or computer. The tool finds your saved biodata and shows the WhatsApp text right away.
3. Pick a style: **Simple** keeps it clean with small bullets; **Decorative** adds star marks around the title, divider lines between sections and a small diamond before each heading. Both use plain text marks rather than emoji, so the message looks the same on every phone.
4. For Hindi and Marathi biodata you can switch on Devanagari digits (१२३) if your family prefers them.
5. Change anything you like in the text box. Your edits stay until you change the style or press "Undo my edits".
6. Press **Copy text** and paste it into any chat, or press **Share on WhatsApp** to choose a contact directly.

No biodata saved yet? Press "Try with a sample" to see how the message looks, then [make your own](/create/) in a few minutes.

## How it works

The tool reads the draft that our editor keeps in your browser's local storage. Nothing is uploaded to a server, and nothing is sent anywhere until you press Copy or Share yourself.

It then follows a few simple rules:

- The invocation line (for example "|| Shree Ganeshaya Namah ||") and the biodata title come first.
- Each section title is wrapped in single stars, like *Personal Details*. WhatsApp shows text between single stars in bold.
- Every filled field becomes one line: "• Name: Priya Suresh Deshmukh".
- Sections you have hidden in the editor, and fields you left empty, are skipped, so no blank "Income:" lines appear.
- An address typed on several lines is joined into one tidy line.
- Mobile numbers and email addresses always keep English digits, even with Devanagari digits on, so WhatsApp can still make the number tappable.

The photo and the kundali chart cannot travel inside a text message. Send the biodata image or PDF along with the text if you want to include them.

## A worked example

Suppose your biodata has a Personal Details section with name, date of birth, height and education, and a Family Details section with parents' names. The message comes out like this:

- *Personal Details*
- • Name: Priya Suresh Deshmukh
- • Date of Birth: 14 March 1998
- • Height: 5' 4"
- • Education: B.E. (Computer), MBA
- *Family Details*
- • Father's Name: Suresh Ramchandra Deshmukh

In WhatsApp the section names show in bold and each detail sits on its own line, which makes it easy to read on a small screen.

## Tips for a good WhatsApp biodata

- Keep it short. A long message is tiring to read on a phone; leave detailed family history for the PDF.
- Check the height and age. Use our [height converter](/height-converter/) to write height as 5' 4" (163 cm), and the [age calculator](/age-gap-calculator/) to get the age right.
- Think about privacy. A forwarded message can reach many people. You may prefer to leave out the full address and share only the city until talks move ahead.
- If the message is very long (over about 4,000 characters), the WhatsApp button may cut it on some phones. Use Copy and paste instead.
- Writing in Marathi or Hindi but typing on an English keyboard? Try our [Marathi and Hindi typing tool](/english-to-marathi-hindi-typing/).

For more help deciding what to include, read [what to write in a marriage biodata](/what-to-write-in-marriage-biodata/), or explore all our [free biodata tools](/biodata-tools/).
`,
    faqs: [
      { q: "Do I need to create my biodata first?", a: "Yes. The tool formats the biodata you made in our editor on the same device and browser. If you haven't made one yet, you can try it with sample data and then create your own for free." },
      { q: "Is my biodata uploaded anywhere?", a: "No. The text is built inside your browser from the draft saved there. Nothing is sent until you copy the text or press the WhatsApp button yourself." },
      { q: "Why is the photo not included?", a: "A WhatsApp text message cannot hold a photo. Download your biodata as an image or PDF from the editor and send it along with the text." },
      { q: "How do bold headings work in WhatsApp?", a: "WhatsApp shows text between single stars as bold. The tool wraps each section title like *Family Details*, so it appears in bold once sent." },
      { q: "The WhatsApp button cut my message. What should I do?", a: "Very long pre-filled messages can be cut on some phones. Press Copy text instead and paste the message into the chat." },
    ],
    updated,
    tool: "whatsapp",
  },
  {
    lang: "hi",
    topic: "whatsapp",
    slug: "whatsapp-biodata",
    title: "WhatsApp Biodata – शादी का बायोडाटा टेक्स्ट में (फ्री)",
    description:
      "शादी के बायोडाटा को साफ़-सुथरे WhatsApp मैसेज में बदलें: बोल्ड हेडिंग, हर जानकारी अलग लाइन में, खाली खाने अपने-आप हटें। कॉपी करें या सीधे WhatsApp पर भेजें।",
    h1: "WhatsApp बायोडाटा: शादी का बायोडाटा टेक्स्ट मैसेज में",
    lead: "रिश्ते की बात अक्सर WhatsApp पर एक टेक्स्ट मैसेज से शुरू होती है। यह टूल हमारे एडिटर में बने आपके बायोडाटा को साफ़, पढ़ने में आसान मैसेज में बदल देता है, जिसे आप एक टैप में कॉपी या शेयर कर सकते हैं।",
    sample: {},
    body: `
## बायोडाटा WhatsApp टेक्स्ट में क्यों भेजें?

प्रिंट या PDF बायोडाटा देखने में सबसे अच्छा लगता है, पर टेक्स्ट मैसेज के अपने फ़ायदे हैं। यह किसी भी फ़ोन पर तुरंत खुल जाता है, कमज़ोर नेटवर्क पर भी। रिश्तेदार इसे बिना कुछ डाउनलोड किए किसी ग्रुप में आगे भेज सकते हैं। कई मैरिज ब्यूरो और समाज के ग्रुप "टेक्स्ट में डिटेल" माँगते हैं ताकि नाम, तारीख़ और मोबाइल नंबर सीधे कॉपी हो सकें। और घर के बड़े-बुज़ुर्ग, जिन्हें PDF के छोटे अक्षर पढ़ने में दिक़्क़त होती है, WhatsApp मैसेज को आराम से बड़ा करके पढ़ लेते हैं।

दिक़्क़त यह है कि हाथ से टाइप करने में समय लगता है और मैसेज अक्सर बिखरा हुआ बनता है: न हेडिंग, न सही क्रम। यह टूल आपके भरे हुए बायोडाटा से ही मैसेज बनाता है, इसलिए क्रम और शब्द बिल्कुल वही रहते हैं।

## टूल कैसे इस्तेमाल करें

1. पहले [फ्री बायोडाटा मेकर](/hindi/create/) में अपनी जानकारी भरें। वह आपके ब्राउज़र में अपने-आप सेव होती है, कोई लॉगिन नहीं चाहिए।
2. उसी फ़ोन या कंप्यूटर पर यह पेज खोलें। टूल आपका सेव बायोडाटा ढूँढकर तुरंत WhatsApp टेक्स्ट दिखा देगा।
3. स्टाइल चुनें: **सादा** में छोटे बुलेट के साथ साफ़ मैसेज बनता है; **सजावटी** में शीर्षक के दोनों ओर तारे का निशान, सेक्शन के बीच लाइन और हर हेडिंग से पहले छोटा ◆ निशान आता है। दोनों में इमोजी नहीं, सादे अक्षर-चिह्न हैं, इसलिए मैसेज हर फ़ोन पर एक जैसा दिखता है।
4. चाहें तो देवनागरी अंक (१२३) चालू करें।
5. टेक्स्ट बॉक्स में जो बदलना हो, बदल लें। स्टाइल बदलने या "मेरे बदलाव हटाएँ" दबाने तक आपके बदलाव बने रहते हैं।
6. **टेक्स्ट कॉपी करें** दबाकर किसी भी चैट में पेस्ट करें, या **WhatsApp पर भेजें** दबाकर सीधे संपर्क चुनें।

अभी बायोडाटा नहीं बनाया? "सैंपल से आज़माएँ" दबाकर देखें कि मैसेज कैसा दिखेगा, फिर कुछ ही मिनट में [अपना बायोडाटा बनाएँ](/hindi/create/)।

## यह कैसे काम करता है

हमारा एडिटर आपका ड्राफ़्ट ब्राउज़र की लोकल स्टोरेज में रखता है, और यह टूल वहीं से पढ़ता है। कुछ भी किसी सर्वर पर अपलोड नहीं होता, और जब तक आप खुद कॉपी या शेयर न दबाएँ, कुछ भी कहीं नहीं जाता।

मैसेज बनाने के नियम सीधे हैं:

- सबसे ऊपर मंगल-वचन (जैसे "।। श्री गणेशाय नमः ।।") और बायोडाटा का शीर्षक आता है।
- हर सेक्शन का नाम एक-एक स्टार के बीच लिखा जाता है, जैसे *पारिवारिक विवरण*। WhatsApp इसे बोल्ड दिखाता है।
- हर भरी हुई जानकारी एक लाइन बनती है: "• नाम: प्रिया सुरेश शर्मा"।
- एडिटर में छिपाए गए सेक्शन और खाली छोड़े गए खाने हटा दिए जाते हैं, ताकि "आय:" जैसी खाली लाइनें न दिखें।
- कई लाइनों में लिखा पता एक साफ़ लाइन में जुड़ जाता है।
- देवनागरी अंक चालू होने पर भी मोबाइल नंबर और ईमेल अंग्रेज़ी अंकों में रहते हैं, ताकि WhatsApp में नंबर पर टैप करके कॉल हो सके।

फ़ोटो और कुंडली चार्ट टेक्स्ट मैसेज में नहीं जा सकते। उन्हें दिखाना हो तो बायोडाटा की फ़ोटो या PDF साथ में भेजें।

## एक उदाहरण

मान लीजिए आपके बायोडाटा में व्यक्तिगत विवरण (नाम, जन्म तिथि, ऊँचाई, शिक्षा) और पारिवारिक विवरण (माता-पिता के नाम) हैं। मैसेज कुछ ऐसा बनेगा:

- *व्यक्तिगत विवरण*
- • नाम: प्रिया सुरेश शर्मा
- • जन्म तिथि: 14 मार्च 1998
- • ऊँचाई: 5' 4"
- • शिक्षा: बी.टेक (कंप्यूटर साइंस)
- *पारिवारिक विवरण*
- • पिता का नाम: श्री सुरेश कुमार शर्मा

WhatsApp में सेक्शन के नाम बोल्ड दिखेंगे और हर जानकारी अपनी लाइन में होगी, जो छोटी स्क्रीन पर पढ़ने में आसान है।

## अच्छे WhatsApp बायोडाटा के लिए सुझाव

- मैसेज छोटा रखें। फ़ोन पर लंबा मैसेज पढ़ना थकाऊ होता है; परिवार का पूरा ब्योरा PDF के लिए रखें।
- ऊँचाई और उम्र सही लिखें। [हाइट कन्वर्टर](/hindi/height-converter/) से ऊँचाई "5 फुट 4 इंच (163 से.मी.)" जैसे लिखें और [उम्र कैलकुलेटर](/hindi/age-gap-calculator/) से उम्र जाँच लें।
- निजता का ध्यान रखें। फ़ॉरवर्ड हुआ मैसेज बहुत लोगों तक पहुँच सकता है; शुरुआत में पूरा पता न देकर सिर्फ़ शहर लिखना भी ठीक है।
- मैसेज बहुत लंबा हो (लगभग 4,000 अक्षर से ज़्यादा) तो कुछ फ़ोन में WhatsApp बटन से पूरा टेक्स्ट नहीं जाता। तब कॉपी करके पेस्ट करें।
- अंग्रेज़ी कीबोर्ड से हिंदी लिखनी हो तो हमारा [हिंदी टाइपिंग टूल](/hindi/hindi-typing/) आज़माएँ।

क्या लिखें और क्या नहीं, यह जानने के लिए पढ़ें [बायोडाटा कैसे बनाएँ](/hindi/biodata-kaise-banaye/), या हमारे सभी [फ्री बायोडाटा टूल](/hindi/tools/) देखें।
`,
    faqs: [
      { q: "क्या पहले बायोडाटा बनाना ज़रूरी है?", a: "हाँ। यह टूल उसी फ़ोन और ब्राउज़र में हमारे एडिटर से बने बायोडाटा को मैसेज में बदलता है। बायोडाटा न हो तो सैंपल से आज़माकर देखें, फिर मुफ़्त में अपना बनाएँ।" },
      { q: "क्या मेरी जानकारी कहीं अपलोड होती है?", a: "नहीं। टेक्स्ट आपके ब्राउज़र में ही बनता है। जब तक आप खुद कॉपी न करें या WhatsApp बटन न दबाएँ, कुछ भी कहीं नहीं भेजा जाता।" },
      { q: "मैसेज में फ़ोटो क्यों नहीं है?", a: "WhatsApp के टेक्स्ट मैसेज में फ़ोटो नहीं जा सकती। एडिटर से बायोडाटा की फ़ोटो (JPG) या PDF डाउनलोड करके साथ में भेजें।" },
      { q: "WhatsApp में हेडिंग बोल्ड कैसे दिखती है?", a: "WhatsApp में एक-एक स्टार के बीच लिखा टेक्स्ट बोल्ड दिखता है। टूल हर सेक्शन का नाम *पारिवारिक विवरण* की तरह लिखता है, इसलिए भेजने पर वह बोल्ड दिखेगा।" },
      { q: "WhatsApp बटन से पूरा मैसेज नहीं गया, क्या करें?", a: "बहुत लंबा मैसेज कुछ फ़ोन में कट सकता है। ऐसे में 'टेक्स्ट कॉपी करें' दबाकर चैट में पेस्ट करें।" },
    ],
    updated,
    tool: "whatsapp",
  },
  {
    lang: "mr",
    topic: "whatsapp",
    slug: "whatsapp-biodata",
    title: "WhatsApp Biodata – लग्नाचा बायोडाटा मेसेजमध्ये (मोफत)",
    description:
      "तुमचा लग्नाचा बायोडाटा नीटनेटक्या WhatsApp मेसेजमध्ये बदला: ठळक शीर्षके, प्रत्येक माहिती वेगळ्या ओळीत, रिकाम्या ओळी आपोआप वगळल्या. कॉपी करा किंवा थेट पाठवा.",
    h1: "WhatsApp बायोडाटा: लग्नाचा बायोडाटा मेसेजमध्ये",
    lead: "स्थळांची बोलणी बहुतेक वेळा WhatsApp वरच्या एका मेसेजने सुरू होतात. हे साधन आमच्या एडिटरमध्ये बनवलेला तुमचा बायोडाटा वाचायला सोप्या, नीटनेटक्या मेसेजमध्ये बदलते; तो एका टॅपमध्ये कॉपी किंवा शेअर करा.",
    sample: {},
    body: `
## बायोडाटा WhatsApp मेसेजमध्ये का पाठवायचा?

छापील किंवा PDF बायोडाटा दिसायला सर्वात छान असतो, पण मेसेजचे स्वतःचे फायदे आहेत. तो कोणत्याही फोनवर लगेच उघडतो, नेटवर्क कमी असले तरी. नातेवाईक काहीही डाउनलोड न करता तो ग्रुपमध्ये पुढे पाठवू शकतात. अनेक वधू-वर सूचक मंडळे आणि समाजाचे ग्रुप "माहिती मेसेजमध्ये पाठवा" असे सांगतात, कारण नाव, तारीख आणि मोबाईल नंबर थेट कॉपी करता येतात. आणि घरातील ज्येष्ठांना PDF मधली बारीक अक्षरे वाचायला त्रास होत असेल, तर WhatsApp मेसेज मोठा करून आरामात वाचता येतो.

अडचण अशी की हाताने टाइप करायला वेळ लागतो आणि मेसेज बहुधा विस्कळीत होतो: शीर्षके नाहीत, क्रम नाही. हे साधन तुम्ही भरलेल्या बायोडाटावरूनच मेसेज तयार करते, त्यामुळे क्रम आणि शब्द अगदी तसेच राहतात.

## साधन कसे वापरायचे

1. आधी [मोफत बायोडाटा मेकर](/marathi/create/) मध्ये माहिती भरा. ती तुमच्या ब्राउझरमध्ये आपोआप सेव्ह होते; लॉगिनची गरज नाही.
2. त्याच फोन किंवा कॉम्प्युटरवर हे पान उघडा. साधन तुमचा सेव्ह केलेला बायोडाटा शोधून लगेच WhatsApp मजकूर दाखवते.
3. शैली निवडा: **साधी** शैलीत छोट्या बुलेटसह स्वच्छ मेसेज बनतो; **सजावटीची** शैलीत शीर्षकाभोवती ताऱ्याची खूण, विभागांमध्ये रेषा आणि प्रत्येक शीर्षकाआधी छोटे ◆ चिन्ह येते. दोन्हीत इमोजी नाहीत, साधी अक्षरचिन्हे आहेत, त्यामुळे मेसेज प्रत्येक फोनवर सारखाच दिसतो.
4. हवे असल्यास मराठी अंक (१२३) चालू करा.
5. मजकुरात जे बदलायचे ते बदला. शैली बदलेपर्यंत किंवा "माझे बदल काढा" दाबेपर्यंत तुमचे बदल तसेच राहतात.
6. **मजकूर कॉपी करा** दाबून कोणत्याही चॅटमध्ये पेस्ट करा, किंवा **WhatsApp वर पाठवा** दाबून थेट व्यक्ती निवडा.

अजून बायोडाटा बनवला नाही? "नमुना वापरून पाहा" दाबून मेसेज कसा दिसतो ते बघा आणि मग काही मिनिटांत [स्वतःचा बायोडाटा बनवा](/marathi/create/).

## हे कसे काम करते

आमचा एडिटर तुमचा ड्राफ्ट ब्राउझरच्या लोकल स्टोरेजमध्ये ठेवतो आणि हे साधन तिथूनच माहिती वाचते. काहीही सर्व्हरवर अपलोड होत नाही आणि तुम्ही स्वतः कॉपी किंवा शेअर दाबेपर्यंत काहीही कुठेही जात नाही.

मेसेज बनवण्याचे नियम साधे आहेत:

- सर्वात वर मंगलवचन (उदा. "।। श्री गणेशाय नमः ।।") आणि बायोडाटाचे शीर्षक येते.
- प्रत्येक विभागाचे नाव एकेका स्टारमध्ये लिहिले जाते, जसे *कौटुंबिक माहिती*. WhatsApp असे शब्द ठळक दाखवते.
- भरलेली प्रत्येक माहिती एक ओळ बनते: "• नाव: प्रिया सुरेश देशमुख".
- एडिटरमध्ये लपवलेले विभाग आणि रिकामे ठेवलेले रकाने वगळले जातात, त्यामुळे "उत्पन्न:" अशा रिकाम्या ओळी दिसत नाहीत.
- अनेक ओळींमध्ये लिहिलेला पत्ता एकाच नीट ओळीत जोडला जातो.
- मराठी अंक चालू असले तरी मोबाईल नंबर आणि ईमेल इंग्रजी अंकांतच राहतात, म्हणजे WhatsApp मध्ये नंबरवर टॅप करून फोन लावता येतो.

फोटो आणि कुंडली चार्ट मेसेजमध्ये जाऊ शकत नाहीत. ते दाखवायचे असतील तर बायोडाटाचा फोटो किंवा PDF सोबत पाठवा.

## एक उदाहरण

समजा तुमच्या बायोडाटामध्ये वैयक्तिक माहिती (नाव, जन्म तारीख, उंची, शिक्षण) आणि कौटुंबिक माहिती (आई-वडिलांची नावे) आहे. मेसेज असा दिसेल:

- *वैयक्तिक माहिती*
- • नाव: प्रिया सुरेश देशमुख
- • जन्म तारीख: 14 मार्च 1998
- • उंची: 5' 4"
- • शिक्षण: बी.ई. (कॉम्प्युटर), एम.बी.ए.
- *कौटुंबिक माहिती*
- • वडिलांचे नाव: श्री. सुरेश रामचंद्र देशमुख

WhatsApp मध्ये विभागांची नावे ठळक दिसतील आणि प्रत्येक माहिती स्वतंत्र ओळीत असेल, जी छोट्या स्क्रीनवर वाचायला सोपी असते.

## चांगल्या WhatsApp बायोडाटासाठी टिप्स

- मेसेज आटोपशीर ठेवा. फोनवर लांबलचक मेसेज वाचणे कंटाळवाणे होते; कुटुंबाची सविस्तर माहिती PDF साठी ठेवा.
- उंची आणि वय नीट लिहा. [उंची कन्व्हर्टर](/marathi/height-converter/) वापरून उंची "5 फूट 4 इंच (163 सें.मी.)" अशी लिहा आणि [वय कॅल्क्युलेटर](/marathi/age-gap-calculator/) ने वय तपासा.
- गोपनीयतेचा विचार करा. फॉरवर्ड झालेला मेसेज अनेकांपर्यंत पोहोचू शकतो; सुरुवातीला पूर्ण पत्त्याऐवजी फक्त गाव/शहर लिहिणेही चालते.
- मेसेज खूप मोठा असेल (साधारण 4,000 अक्षरांपेक्षा जास्त) तर काही फोनमध्ये WhatsApp बटणाने पूर्ण मजकूर जात नाही. तेव्हा कॉपी करून पेस्ट करा.
- इंग्रजी कीबोर्डवरून मराठी लिहायचे असेल तर आमचे [मराठी टायपिंग साधन](/marathi/marathi-typing/) वापरा.

बायोडाटामध्ये काय लिहावे हे ठरवण्यासाठी वाचा [लग्नाचा बायोडाटा कसा बनवायचा](/marathi/lagnacha-biodata-kasa-banvaycha/), किंवा आमची सर्व [मोफत बायोडाटा साधने](/marathi/sadhane/) पाहा.
`,
    faqs: [
      { q: "आधी बायोडाटा बनवावा लागतो का?", a: "हो. हे साधन त्याच फोन आणि ब्राउझरमध्ये आमच्या एडिटरने बनवलेला बायोडाटा मेसेजमध्ये बदलते. बायोडाटा नसेल तर नमुना वापरून पाहा आणि मग मोफत स्वतःचा बनवा." },
      { q: "माझी माहिती कुठे अपलोड होते का?", a: "नाही. मजकूर तुमच्या ब्राउझरमध्येच तयार होतो. तुम्ही स्वतः कॉपी करेपर्यंत किंवा WhatsApp बटण दाबेपर्यंत काहीही कुठेही पाठवले जात नाही." },
      { q: "मेसेजमध्ये फोटो का नाही?", a: "WhatsApp च्या मजकूर मेसेजमध्ये फोटो जाऊ शकत नाही. एडिटरमधून बायोडाटाचा फोटो (JPG) किंवा PDF डाउनलोड करून सोबत पाठवा." },
      { q: "WhatsApp मध्ये शीर्षक ठळक कसे दिसते?", a: "WhatsApp मध्ये एकेका स्टारमध्ये लिहिलेला मजकूर ठळक दिसतो. साधन प्रत्येक विभागाचे नाव *कौटुंबिक माहिती* असे लिहिते, त्यामुळे पाठवल्यावर ते ठळक दिसते." },
      { q: "WhatsApp बटणाने पूर्ण मेसेज गेला नाही, काय करू?", a: "खूप मोठा मेसेज काही फोनमध्ये कापला जाऊ शकतो. अशा वेळी 'मजकूर कॉपी करा' दाबून चॅटमध्ये पेस्ट करा." },
    ],
    updated,
    tool: "whatsapp",
  },
];
