"use client";

import { useConfirm } from "../ui/useConfirm";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { applyCached, pendingWords, transliterateWord } from "@/lib/transliterate";
import { copyText } from "@/lib/tools/clipboard";
import { convertAroundCaret, counts, fetchSuggestions, lastCompletedWord, replaceNear, type Script } from "@/lib/tools/typing";

const STORE = "biodatasathi:typing";

const T = {
  en: {
    target: "Type in",
    mr: "Marathi",
    hi: "Hindi",
    convert: "Convert as I type",
    label: "Type in English letters, press space to convert",
    placeholder: { mr: "e.g. type  maze naav Priya aahe  and press space", hi: "e.g. type  mera naam Neha hai  and press space" },
    sugg: (w: string) => `Other spellings for “${w}”:`,
    suggHint: "Type a word and press space. Tap an option here to swap it.",
    offline: "Couldn't reach the transliteration service. Check your internet; your text is safe.",
    words: "words",
    chars: "characters",
    copy: "Copy",
    copied: "Copied!",
    copyFail: "Couldn't copy. Select the text and copy it by hand.",
    clear: "Clear",
    confirmClear: "Clear all the text?",
    tipsTitle: "Quick spelling guide",
    tipsNote: "Conversion is word-based, so type the whole word the way you say it. These examples were checked with the tool.",
    keep: "Words in ALL CAPS (MBA, CA), emails and numbers stay in English.",
    saved: "Your text is kept only in this browser.",
  },
  hi: {
    target: "भाषा",
    mr: "मराठी",
    hi: "हिंदी",
    convert: "टाइप करते ही बदलें",
    label: "अंग्रेज़ी अक्षरों में लिखें, स्पेस दबाते ही हिंदी बनेगा",
    placeholder: { mr: "जैसे  maze naav Priya aahe  लिखकर स्पेस दबाएँ", hi: "जैसे  mera naam Neha hai  लिखकर स्पेस दबाएँ" },
    sugg: (w: string) => `“${w}” के दूसरे रूप:`,
    suggHint: "कोई शब्द लिखकर स्पेस दबाएँ। दूसरा रूप चाहिए तो यहाँ टैप करें।",
    offline: "ट्रांसलिटरेशन सेवा से जुड़ नहीं पाए। इंटरनेट देखें; आपका लिखा हुआ सुरक्षित है।",
    words: "शब्द",
    chars: "अक्षर",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया!",
    copyFail: "कॉपी नहीं हो पाया। टेक्स्ट चुनकर खुद कॉपी करें।",
    clear: "साफ़ करें",
    confirmClear: "पूरा टेक्स्ट मिटा दें?",
    tipsTitle: "स्पेलिंग की छोटी गाइड",
    tipsNote: "शब्द पूरा बोलने के ढंग से लिखें — बदलाव पूरे शब्द पर होता है। ये उदाहरण टूल में जाँचे हुए हैं।",
    keep: "पूरे कैपिटल अक्षर वाले शब्द (MBA, CA), ईमेल और नंबर अंग्रेज़ी में ही रहते हैं।",
    saved: "आपका टेक्स्ट सिर्फ़ इसी ब्राउज़र में रहता है।",
  },
  mr: {
    target: "भाषा",
    mr: "मराठी",
    hi: "हिंदी",
    convert: "टाइप करताच बदला",
    label: "इंग्रजी अक्षरांत लिहा, स्पेस दाबताच मराठी होईल",
    placeholder: { mr: "उदा.  maze naav Priya aahe  लिहून स्पेस दाबा", hi: "उदा.  mera naam Neha hai  लिहून स्पेस दाबा" },
    sugg: (w: string) => `“${w}” चे इतर पर्याय:`,
    suggHint: "एखादा शब्द लिहून स्पेस दाबा. दुसरा पर्याय हवा असल्यास इथे टॅप करा.",
    offline: "लिप्यंतरण सेवेशी जोडता आले नाही. इंटरनेट तपासा; तुमचा मजकूर सुरक्षित आहे.",
    words: "शब्द",
    chars: "अक्षरे",
    copy: "कॉपी करा",
    copied: "कॉपी झाले!",
    copyFail: "कॉपी झाले नाही. मजकूर निवडून स्वतः कॉपी करा.",
    clear: "पुसून टाका",
    confirmClear: "सगळा मजकूर पुसायचा?",
    tipsTitle: "स्पेलिंगची छोटी मार्गदर्शिका",
    tipsNote: "संपूर्ण शब्द उच्चारानुसार लिहा — रूपांतर पूर्ण शब्दावर होते. ही उदाहरणे साधनात तपासलेली आहेत.",
    keep: "पूर्ण कॅपिटल अक्षरांतील शब्द (MBA, CA), ईमेल आणि आकडे इंग्रजीतच राहतात.",
    saved: "तुमचा मजकूर फक्त याच ब्राउझरमध्ये राहतो.",
  },
};

/** Each pair was checked against the live endpoint (top result) before listing. */
const TIPS: Record<Script, { hint: string; in: string; out: string }[]> = {
  mr: [
    { hint: "aa → आ", in: "aai", out: "आई" },
    { hint: "sh → श", in: "shubh", out: "शुभ" },
    { hint: "chh → छ", in: "chhan", out: "छान" },
    { hint: "ksh → क्ष", in: "shikshan", out: "शिक्षण" },
    { hint: "dny → ज्ञ", in: "dnyan", out: "ज्ञान" },
    { hint: "shtr → ष्ट्र", in: "rashtra", out: "राष्ट्र" },
    { hint: "n → ं", in: "sanskar", out: "संस्कार" },
    { hint: "l → ळ", in: "shala", out: "शाळा" },
    { hint: "shr → श्र", in: "shri", out: "श्री" },
    { hint: "gn → ग्न", in: "lagna", out: "लग्न" },
  ],
  hi: [
    { hint: "aa → आ", in: "aap", out: "आप" },
    { hint: "sh → श", in: "shaadi", out: "शादी" },
    { hint: "chh → छ", in: "chhota", out: "छोटा" },
    { hint: "ksh → क्ष", in: "shiksha", out: "शिक्षा" },
    { hint: "gy → ज्ञ", in: "gyan", out: "ज्ञान" },
    { hint: "shtr → ष्ट्र", in: "rashtra", out: "राष्ट्र" },
    { hint: "n → ं", in: "sanskar", out: "संस्कार" },
    { hint: "d → ड़", in: "ladki", out: "लड़की" },
    { hint: "shr → श्र", in: "shrimati", out: "श्रीमती" },
    { hint: "nm → न्म", in: "janm", out: "जन्म" },
  ],
};

type Last = { latin: string; out: string };

export default function TypingTool({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { confirm: confirmDlg, dialog } = useConfirm(lang);
  const [target, setTarget] = useState<Script>(lang === "hi" ? "hi" : "mr");
  const [on, setOn] = useState(true);
  const [text, setText] = useState("");
  const [last, setLast] = useState<Last | null>(null);
  const [sugg, setSugg] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [offline, setOffline] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef("");
  const caretRef = useRef<number | null>(null);
  const tokenRef = useRef(0);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) {
        textRef.current = saved;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore from localStorage after mount
        setText(saved);
      }
    } catch {
      /* storage blocked */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORE, text);
      } catch {
        /* storage full or blocked */
      }
    }, 400);
    return () => clearTimeout(id);
  }, [text]);

  // Keep the caret where the user was after Latin words are swapped for (shorter or longer) Devanagari.
  useLayoutEffect(() => {
    const ta = taRef.current;
    if (ta && caretRef.current !== null && document.activeElement === ta) ta.setSelectionRange(caretRef.current, caretRef.current);
    caretRef.current = null;
  }, [text]);

  function commit(next: string, caret?: number) {
    textRef.current = next;
    if (caret !== undefined) caretRef.current = caret;
    setText(next);
  }

  /** After lookups finish, swap in any newly cached words without moving the caret. */
  function sync(script: Script) {
    const cur = textRef.current;
    const ta = taRef.current;
    if (ta && document.activeElement === ta) {
      const r = convertAroundCaret(cur, ta.selectionStart, (x) => applyCached(x, script));
      if (r.text !== cur) commit(r.text, r.caret);
    } else {
      const next = applyCached(cur, script);
      if (next !== cur) commit(next);
    }
  }

  async function track(word: string, script: Script) {
    const token = ++tokenRef.current;
    const out = await transliterateWord(word, script);
    if (token !== tokenRef.current) return;
    setOffline(out === word);
    setLast({ latin: word, out });
    setSugg([]);
    const list = await fetchSuggestions(word, script, 5);
    if (token === tokenRef.current) setSugg(list);
  }

  /** Look up completed words (skipping the one being typed), then swap them in. */
  async function convert(parts: string[], script: Script) {
    const words = [...new Set(parts.flatMap((p) => pendingWords(p, script)))];
    if (!words.length) return;
    await Promise.all(words.map((w) => transliterateWord(w, script)));
    sync(script);
  }

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const raw = e.target.value;
    setStatus("");
    if (!on) return commit(raw);
    const caret = e.target.selectionStart ?? raw.length;
    const word = lastCompletedWord(raw, caret);
    const r = convertAroundCaret(raw, caret, (x) => applyCached(x, target));
    commit(r.text, r.text === raw ? undefined : r.caret);
    if (word) track(word, target);
    convert(r.parts, target);
  }

  /** Convert a final word that wasn't followed by a space when the user leaves the box. */
  async function onBlur() {
    if (!on) return;
    const word = lastCompletedWord(`${textRef.current} `);
    const words = pendingWords(`${textRef.current} `, target);
    if (!words.length) return;
    await Promise.all(words.map((w) => transliterateWord(w, target)));
    const cur = textRef.current;
    const next = applyCached(`${cur} `, target).slice(0, -1);
    if (next !== cur) commit(next);
    if (word && words.includes(word)) track(word, target);
  }

  function pick(s: string) {
    if (!last || s === last.out) return;
    const ta = taRef.current;
    const caret = ta?.selectionStart ?? textRef.current.length;
    const r = replaceNear(textRef.current, last.out, s, caret);
    if (!r) return;
    const delta = s.length - last.out.length;
    const at = r.at - s.length;
    commit(r.text, at < caret ? caret + delta : caret);
    setLast({ ...last, out: s });
    ta?.focus();
  }

  async function onCopy() {
    setStatus((await copyText(text)) ? t.copied : t.copyFail);
  }

  async function onClear() {
    if (text.trim() && !(await confirmDlg(t.confirmClear, { danger: true }))) return;
    commit("");
    setLast(null);
    setSugg([]);
    setStatus("");
    taRef.current?.focus();
  }

  const c = counts(text);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
      {dialog}
      <div className="min-w-0 rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">{t.target}</legend>
            <span className="text-sm text-soft" aria-hidden>
              {t.target}:
            </span>
            <div className="inline-flex rounded-full border border-line bg-ivory p-0.5">
              {(["mr", "hi"] as Script[]).map((s) => (
                <label key={s} className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${target === s ? "bg-maroon text-white" : "text-ink hover:text-maroon"}`}>
                  <input
                    type="radio"
                    name="typing-target"
                    value={s}
                    checked={target === s}
                    onChange={() => {
                      setTarget(s);
                      setLast(null);
                      setSugg([]);
                      tokenRef.current++;
                    }}
                    className="sr-only"
                  />
                  {t[s]}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} className="h-4 w-4 accent-[var(--color-maroon)]" />
            {t.convert}
          </label>
        </div>

        <label htmlFor="typing-box" className="mb-1.5 block text-sm font-semibold text-ink">
          {t.label}
        </label>
        <textarea
          id="typing-box"
          ref={taRef}
          value={text}
          onChange={onChange}
          onBlur={onBlur}
          rows={10}
          lang={on ? target : undefined}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          placeholder={t.placeholder[target]}
          className="block min-h-56 w-full resize-y rounded-xl border border-line bg-ivory/60 px-3 py-2.5 text-lg leading-relaxed text-ink outline-none placeholder:text-soft/70 focus:border-gold focus:bg-paper"
        />

        <div className="mt-2 min-h-11" aria-live="polite">
          {last && sugg.length > 1 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs text-soft">{t.sugg(last.latin)}</span>
              {sugg.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                  aria-pressed={s === last.out}
                  className={`rounded-full border px-3 py-1 text-base transition ${s === last.out ? "border-maroon bg-maroon text-white" : "border-line bg-ivory text-ink hover:border-gold"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : offline && on ? (
            <p className="text-xs text-maroon">{t.offline}</p>
          ) : (
            <p className="text-xs text-soft">{t.suggHint}</p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onCopy} disabled={!text.trim()} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark disabled:opacity-50">
            {t.copy}
          </button>
          <button type="button" onClick={onClear} disabled={!text} className="rounded-full border border-line bg-ivory px-5 py-2.5 text-sm font-semibold text-ink hover:border-gold disabled:opacity-50">
            {t.clear}
          </button>
          <span className="ml-auto text-sm text-soft">
            {c.words} {t.words} · {c.chars} {t.chars}
          </span>
        </div>
        <p aria-live="polite" className="mt-2 min-h-5 text-sm text-leaf">
          {status}
        </p>
        <p className="text-xs text-soft">
          {t.keep} {t.saved}
        </p>
      </div>

      <aside className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <h2 className="font-display text-lg text-maroon">{t.tipsTitle}</h2>
        <p className="mt-1 text-xs leading-relaxed text-soft">{t.tipsNote}</p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {TIPS[target].map((r) => (
              <tr key={r.in} className="border-t border-line first:border-t-0">
                <td className="py-1.5 pr-2 text-soft">{r.hint}</td>
                <td className="py-1.5 text-right">
                  <span className="font-mono text-xs text-soft">{r.in}</span> → <span className="text-base text-ink">{r.out}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    </div>
  );
}
