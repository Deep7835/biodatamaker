"use client";

import { useEffect, useState } from "react";
import { toDevanagariDigits, type Lang } from "@/lib/i18n";
import { copyText } from "@/lib/tools/clipboard";
import { compare, diff, formatDate, parseDate, toISO, todayYMD, type Span } from "@/lib/tools/age";

type Mode = "gap" | "single";
type Who = "bride" | "groom";

const T = {
  en: {
    modeGap: "Age gap (bride & groom)",
    modeSingle: "Age from date of birth",
    bride: "Bride's date of birth",
    groom: "Groom's date of birth",
    dob: "Date of birth",
    asOn: "Age as on",
    today: "Today",
    ageBride: "Bride's age",
    ageGroom: "Groom's age",
    gap: "Age gap",
    older: (who: Who) => (who === "bride" ? "The bride is older." : "The groom is older."),
    same: "Same date of birth.",
    totalDays: (n: string) => `${n} days in all`,
    fill: "Enter both dates of birth to see the ages and the gap.",
    fillOne: "Enter a date of birth to see the age.",
    future: "The date of birth is after the “as on” date. Please check the dates.",
    age: "Age",
    write: "Write it in your biodata as",
    copy: "Copy",
    copied: "Copied!",
    copyFail: "Couldn't copy. Select the text and copy it by hand.",
    digits: "Devanagari digits (१२३)",
    line: (date: string, y: string) => `Date of Birth: ${date} (Age: ${y} years)`,
    under: (who: Who) =>
      who === "groom"
        ? "On this date the groom is under 21, the legal minimum age of marriage for men in India."
        : "On this date the bride is under 18, the legal minimum age of marriage for women in India.",
    note: "Every couple is different. An age gap, small or large, doesn't decide compatibility; families usually weigh it alongside education, nature, health and the couple's own wishes.",
    legal: "Legal minimum age of marriage in India (Prohibition of Child Marriage Act, 2006): 21 years for men, 18 years for women.",
    span: (s: Span, days = true) => {
      const p = [`${s.years} ${s.years === 1 ? "year" : "years"}`, `${s.months} ${s.months === 1 ? "month" : "months"}`];
      if (days) p.push(`${s.days} ${s.days === 1 ? "day" : "days"}`);
      return p.join(", ");
    },
  },
  hi: {
    modeGap: "उम्र का अंतर (वधू और वर)",
    modeSingle: "जन्म तिथि से उम्र",
    bride: "वधू की जन्म तिथि",
    groom: "वर की जन्म तिथि",
    dob: "जन्म तिथि",
    asOn: "इस तारीख़ को उम्र",
    today: "आज",
    ageBride: "वधू की उम्र",
    ageGroom: "वर की उम्र",
    gap: "उम्र का अंतर",
    older: (who: Who) => (who === "bride" ? "वधू उम्र में बड़ी हैं।" : "वर उम्र में बड़े हैं।"),
    same: "दोनों की जन्म तिथि एक ही है।",
    totalDays: (n: string) => `कुल ${n} दिन`,
    fill: "उम्र और अंतर देखने के लिए दोनों जन्म तिथियाँ डालें।",
    fillOne: "उम्र देखने के लिए जन्म तिथि डालें।",
    future: "जन्म तिथि चुनी गई तारीख़ के बाद की है। कृपया तारीख़ें जाँच लें।",
    age: "उम्र",
    write: "बायोडाटा में ऐसे लिखें",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया!",
    copyFail: "कॉपी नहीं हो पाया। टेक्स्ट चुनकर खुद कॉपी करें।",
    digits: "देवनागरी अंक (१२३)",
    line: (date: string, y: string) => `जन्म तिथि: ${date} (आयु: ${y} वर्ष)`,
    under: (who: Who) =>
      who === "groom"
        ? "इस तारीख़ पर वर की उम्र 21 वर्ष से कम है, जो भारत में पुरुषों के विवाह की न्यूनतम क़ानूनी उम्र है।"
        : "इस तारीख़ पर वधू की उम्र 18 वर्ष से कम है, जो भारत में महिलाओं के विवाह की न्यूनतम क़ानूनी उम्र है।",
    note: "हर जोड़ी अलग होती है। उम्र का अंतर कम हो या ज़्यादा, वह अकेले मेल तय नहीं करता; परिवार आमतौर पर इसे शिक्षा, स्वभाव, सेहत और दोनों की अपनी इच्छा के साथ मिलाकर देखते हैं।",
    legal: "भारत में विवाह की न्यूनतम क़ानूनी उम्र (बाल विवाह प्रतिषेध अधिनियम, 2006): पुरुष 21 वर्ष, महिला 18 वर्ष।",
    span: (s: Span, days = true) => {
      const p = [`${s.years} वर्ष`, `${s.months} ${s.months === 1 ? "महीना" : "महीने"}`];
      if (days) p.push(`${s.days} दिन`);
      return p.join(", ");
    },
  },
  mr: {
    modeGap: "वयातील अंतर (वधू व वर)",
    modeSingle: "जन्मतारखेवरून वय",
    bride: "वधूची जन्मतारीख",
    groom: "वराची जन्मतारीख",
    dob: "जन्मतारीख",
    asOn: "या तारखेला वय",
    today: "आज",
    ageBride: "वधूचे वय",
    ageGroom: "वराचे वय",
    gap: "वयातील अंतर",
    older: (who: Who) => (who === "bride" ? "वधू वयाने मोठी आहे." : "वर वयाने मोठा आहे."),
    same: "दोघांची जन्मतारीख एकच आहे.",
    totalDays: (n: string) => `एकूण ${n} दिवस`,
    fill: "वय आणि अंतर पाहण्यासाठी दोन्ही जन्मतारखा टाका.",
    fillOne: "वय पाहण्यासाठी जन्मतारीख टाका.",
    future: "जन्मतारीख निवडलेल्या तारखेनंतरची आहे. कृपया तारखा तपासा.",
    age: "वय",
    write: "बायोडाटामध्ये असे लिहा",
    copy: "कॉपी करा",
    copied: "कॉपी झाले!",
    copyFail: "कॉपी झाले नाही. मजकूर निवडून स्वतः कॉपी करा.",
    digits: "मराठी अंक (१२३)",
    line: (date: string, y: string) => `जन्म तारीख: ${date} (वय: ${y} वर्षे)`,
    under: (who: Who) =>
      who === "groom"
        ? "या तारखेला वराचे वय 21 वर्षांपेक्षा कमी आहे; भारतात मुलासाठी लग्नाचे किमान कायदेशीर वय 21 वर्षे आहे."
        : "या तारखेला वधूचे वय 18 वर्षांपेक्षा कमी आहे; भारतात मुलीसाठी लग्नाचे किमान कायदेशीर वय 18 वर्षे आहे.",
    note: "प्रत्येक जोडी वेगळी असते. वयातील अंतर कमी असो वा जास्त, त्यावरून एकट्याने अनुरूपता ठरत नाही; कुटुंबे साधारणपणे शिक्षण, स्वभाव, आरोग्य आणि दोघांची स्वतःची इच्छा यांच्यासोबत त्याचा विचार करतात.",
    legal: "भारतात लग्नाचे किमान कायदेशीर वय (बालविवाह प्रतिबंध कायदा, 2006): मुलगा 21 वर्षे, मुलगी 18 वर्षे.",
    span: (s: Span, days = true) => {
      const p = [`${s.years} ${s.years === 1 ? "वर्ष" : "वर्षे"}`, `${s.months} ${s.months === 1 ? "महिना" : "महिने"}`];
      if (days) p.push(`${s.days} दिवस`);
      return p.join(", ");
    },
  },
};

const inputCls = "w-full min-w-0 rounded-lg border border-line bg-ivory/60 px-3 py-2.5 text-base text-ink outline-none transition focus:border-gold focus:bg-paper";

export default function AgeGap({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [mode, setMode] = useState<Mode>("gap");
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [dob, setDob] = useState("");
  const [asOn, setAsOn] = useState("");
  const [today, setToday] = useState("");
  const [digits, setDigits] = useState(false);
  const [status, setStatus] = useState("");

  // "Today" is the visitor's date, so set it after mount (the page itself is pre-rendered).
  useEffect(() => {
    const iso = toISO(todayYMD());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the visitor's local date is only known in the browser
    setToday(iso);
    setAsOn(iso);
  }, []);

  const ref = parseDate(asOn);
  const b = parseDate(bride);
  const g = parseDate(groom);
  const one = parseDate(dob);
  const nf = (n: number) => n.toLocaleString("en-IN");
  const dg = (s: string) => (digits && lang !== "en" ? toDevanagariDigits(s) : s);

  let gapBody: React.ReactNode = <p className="text-sm text-soft">{t.fill}</p>;
  if (b && g && ref) {
    if (compare(b, ref) > 0 || compare(g, ref) > 0) gapBody = <p className="text-sm text-maroon">{t.future}</p>;
    else {
      const ab = diff(b, ref);
      const ag = diff(g, ref);
      const gap = diff(b, g);
      const c = compare(b, g);
      const warn = [ag.years < 21 ? t.under("groom") : "", ab.years < 18 ? t.under("bride") : ""].filter(Boolean);
      gapBody = (
        <>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-paper/70 p-3">
              <dt className="text-xs text-soft">{t.ageBride}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink">{dg(t.span(ab, false))}</dd>
            </div>
            <div className="rounded-xl bg-paper/70 p-3">
              <dt className="text-xs text-soft">{t.ageGroom}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink">{dg(t.span(ag, false))}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-soft">{t.gap}</p>
          <p className="font-display text-2xl text-maroon sm:text-3xl">{dg(t.span(gap))}</p>
          <p className="mt-1 text-sm text-ink">
            {c === 0 ? t.same : t.older(c < 0 ? "bride" : "groom")} {c !== 0 && <span className="text-soft">({dg(t.totalDays(nf(gap.totalDays)))})</span>}
          </p>
          {warn.map((w) => (
            <p key={w} className="mt-2 rounded-lg border border-gold/50 bg-paper px-3 py-2 text-sm text-ink">
              {w}
            </p>
          ))}
        </>
      );
    }
  }

  let singleBody: React.ReactNode = <p className="text-sm text-soft">{t.fillOne}</p>;
  let line = "";
  if (one && ref) {
    if (compare(one, ref) > 0) singleBody = <p className="text-sm text-maroon">{t.future}</p>;
    else {
      const a = diff(one, ref);
      line = dg(t.line(formatDate(one, lang), String(a.years)));
      singleBody = (
        <>
          <p className="text-sm text-soft">{t.age}</p>
          <p className="font-display text-2xl text-maroon sm:text-3xl">{dg(t.span(a))}</p>
          <p className="mt-4 text-sm text-soft">{t.write}</p>
          <p className="mt-1 break-words rounded-lg bg-paper/70 px-3 py-2 text-base text-ink">{line}</p>
        </>
      );
    }
  }

  async function onCopy() {
    setStatus((await copyText(line)) ? t.copied : t.copyFail);
  }

  return (
    <div className="space-y-4">
      <div role="group" className="grid w-full grid-cols-2 gap-0.5 rounded-2xl border border-line bg-paper p-0.5 sm:inline-grid sm:w-auto sm:rounded-full">
        {(["gap", "single"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => {
              setMode(m);
              setStatus("");
            }}
            className={`rounded-xl px-3 py-2 text-center text-sm font-semibold leading-snug transition sm:rounded-full sm:px-4 ${mode === m ? "bg-maroon text-white" : "text-ink hover:text-maroon"}`}
          >
            {m === "gap" ? t.modeGap : t.modeSingle}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
          <div className="grid gap-4">
            {mode === "gap" ? (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-ink">{t.bride}</span>
                  <input type="date" value={bride} max={today || undefined} onChange={(e) => setBride(e.target.value)} className={inputCls} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-ink">{t.groom}</span>
                  <input type="date" value={groom} max={today || undefined} onChange={(e) => setGroom(e.target.value)} className={inputCls} />
                </label>
              </>
            ) : (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink">{t.dob}</span>
                <input
                  type="date"
                  value={dob}
                  max={today || undefined}
                  onChange={(e) => {
                    setDob(e.target.value);
                    setStatus("");
                  }}
                  className={inputCls}
                />
              </label>
            )}
            <div>
              <label htmlFor="age-as-on" className="mb-1 block text-sm font-semibold text-ink">
                {t.asOn}
              </label>
              <div className="flex gap-2">
                <input id="age-as-on" type="date" value={asOn} onChange={(e) => setAsOn(e.target.value)} className={inputCls} />
                {asOn !== today && today && (
                  <button type="button" onClick={() => setAsOn(today)} className="shrink-0 rounded-full border border-line bg-ivory px-4 text-sm font-semibold text-ink hover:border-gold">
                    {t.today}
                  </button>
                )}
              </div>
            </div>
            {lang !== "en" && (
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} className="h-4 w-4 accent-[var(--color-maroon)]" />
                {t.digits}
              </label>
            )}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-gold/60 bg-sand/60 p-4 sm:p-5" aria-live="polite">
          {mode === "gap" ? gapBody : singleBody}
          {mode === "single" && line && (
            <div className="mt-3">
              <button type="button" onClick={onCopy} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark">
                {t.copy}
              </button>
              <p className="mt-2 min-h-5 text-sm text-leaf">{status}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-4 text-sm leading-relaxed text-soft sm:p-5">
        <p>{t.note}</p>
        <p className="mt-2">{t.legal}</p>
      </div>
    </div>
  );
}
