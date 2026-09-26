# BiodataSathi — Keyword Research & Ranking Plan

_Research date: 26 Sep 2026. Market: Google India. Languages: English, हिंदी, मराठी._

**How to read the numbers.** [S] = from a public tool page (Semrush / Similarweb, Aug 2026 data). [E] = estimate from Google autocomplete, SERP competitors and comparison with [S] figures — treat as a range. Keyword difficulty (KD) is estimated for every row. **Before spending on content, confirm the [E] rows in Google Keyword Planner** (free with an Ads account).

---

## 1. The honest headline

- **Volume is high, CPC is low.** Biodata keywords pay ₹1–11 per click. "marriage biodata format" has ~110k searches/month [S] but ~₹1 CPC. AdSense alone on biodata pages will earn modestly.
- **Competition is weak.** The niche is ~5 small operators running 15+ exact-match domains. The #1 Marathi site gets ~23k visits per quarter [S]. A site with Semrush Authority Score 15 ranks #2 for a 110k keyword [S]. A well-built new site can reach page 1.
- **The gap is language + honesty.** Nobody serves real Devanagari pages with `lang="mr"`/`"hi"` + hreflang. Most sites put a ₹20–150 paywall behind a watermark, disclosed late. Several use fake "downloaded 2 min ago" popups. We win on: native-script pages, genuinely free downloads, complete Marathi fields, speed.

## 2. Keywords to target

### English (root `/`)
| Keyword | Vol/mo | CPC | KD | Our page |
|---|---|---|---|---|
| marriage biodata format | 110,000 [S] | ₹1 | 25–35 | `/marriage-biodata-format/` |
| biodata for marriage | 90,500 [S] | ₹1–6 | 25–35 | `/` |
| marriage biodata word format | 14,800 [S] | ₹1 | 20–30 | `/marriage-biodata-format/` (+ Word export) |
| bio data for marriage pdf | 12,100 [S] | ₹1 | 20–30 | `/marriage-biodata-format/` |
| hindu marriage biodata format | 8,100 [S] | – | 15–25 | `/marriage-biodata-format/` |
| marriage biodata for girl | 6,600 [S] | **₹11** (highest) | 15–25 | `/biodata-for-marriage-for-girl/` |
| biodata maker | 20–40k [E] | ₹6 [S] | 25–35 | `/`, `/create/` |
| biodata for marriage for boy | 3–6k [E] | ~₹9 | 15–20 | `/biodata-for-marriage-for-boy/` |
| muslim biodata (format/maker) | 2–6k [E] | ~₹11 | 10–20 | `/muslim-marriage-biodata/` |
| what to write in marriage biodata | PAA | – | <15 | `/what-to-write-in-marriage-biodata/` |

### Hindi (`/hindi/`)
| Keyword | Vol/mo [E] | KD | Our page |
|---|---|---|---|
| biodata for marriage in hindi / hindi biodata format | 10–25k (mixed intent) | ~20 | `/hindi/` |
| शादी का बायोडाटा / shadi biodata format | 1–4k | <10 | `/hindi/shadi-biodata-format/` |
| बायोडाटा फॉर मैरिज | 2–5k | ~10 | `/hindi/` |
| biodata kaise banaye (shadi ke liye / mobile se) | 3–8k | ~10 (video SERP) | `/hindi/biodata-kaise-banaye/` |
| लड़की / लड़के का बायोडाटा | 1–3k | <10 | `/hindi/ladki-ka-biodata/`, `/hindi/ladke-ka-biodata/` |

### Marathi (`/marathi/`) — strongest niche
| Keyword | Vol/mo [E] | CPC | KD | Our page |
|---|---|---|---|---|
| marathi biodata maker (free) | 5–15k | ₹9–10 [S] | 15–25 | `/marathi/` |
| marathi biodata format (pdf/word) | 5–15k | ~₹9 | 15–20 | `/marathi/biodata-format/` |
| marathi biodata / biodata marathi | 5–12k | – | 15–20 | `/marathi/` |
| biodata for marriage in marathi | 2–6k | ~₹9 | 10–15 | `/marathi/biodata-format/` |
| lagnacha biodata / लग्नाचा बायोडाटा | 1–4k | ~₹9 | <10 | `/marathi/lagnacha-biodata-kasa-banvaycha/` |
| मुलीचा / मुलाचा बायोडाटा | 300–1k each | low | <5 | `/marathi/mulicha-biodata/`, `/marathi/mulacha-biodata/` |
| marathi biodata buddhist / बौद्ध | 300–1k | low | <5 | `/marathi/buddhist-biodata/` |
| parichay patra in marathi | 300–1k | ₹10 [S] | <10 | (next: dedicated page) |

### Higher-CPC adjacent topics (for AdSense revenue) [S]
| Keyword | Volume | CPC |
|---|---|---|
| matrimony sites | 27,100 | ₹50 |
| bharat matrimony | 60,500 | ₹54 |
| matrimony | 40,500 | ₹34 |
| drik panchang / today tithi | 301,000 | ₹14–54 |
| marathi matrimony | 18,100 | ₹15 |
| kundali matching | 301,000 | ₹2 (traffic play, not CPC) |

## 3. Step-by-step plan to reach page 1 (and #1–2)

### Step 1 — Launch the foundation (done in this repo)
- [x] One route tree per language: `/`, `/hindi/`, `/marathi/` with `<html lang>`, Devanagari titles/H1s, self-canonical + reciprocal hreflang + `x-default`.
- [x] 17 keyword-mapped pages (6 EN, 5 HI, 6 MR) with real, useful content — not thin doorway pages.
- [x] JSON-LD: WebApplication (free offer), FAQPage, BreadcrumbList. **No self-awarded star ratings** (Google ignores or penalises them).
- [x] `sitemap.xml` with hreflang alternates, `robots.txt`.
- [x] Static export → very fast TTFB on Cloudflare's edge (competitors: up to 5 s).
- [x] Tool on every landing page within one click; the editor has the complete Marathi field set (देवक, नाडी, गण, कुलदैवत, चरण, मामा…), English→Devanagari typing, Word export, no watermark.

### Step 2 — Go live (week 1)
1. Buy `biodatasathi.com` (+ `biodatasathi.in` to redirect). Both were unregistered on 26 Sep 2026.
2. `npm run deploy` (Cloudflare). Attach the domain.
3. Google Search Console: verify, submit `sitemap.xml`, request indexing for the 3 home pages + 3 format pages.
4. Bing Webmaster Tools: import from GSC (Bing feeds ChatGPT/Copilot answers).
5. Add GA4 (the editor already fires a `biodata_download` event if `gtag` exists).
6. **Timing matters:** biodata searches ramp up in Oct–Jan (after Navratri/Diwali, before the Nov–Dec and Jan–Feb muhurats) and again Mar–May. Launching now gets you indexed before the peak.

### Step 3 — Win the image pack & video (weeks 2–4)
- The SERP for "marathi bio data" shows an **Images** block. Export a PNG of each template with sample data and publish with descriptive filenames and alt text (`marathi-biodata-format-mulgi.webp`), plus an image sitemap.
- Record 60–90 s screen videos: "लग्नाचा बायोडाटा मोबाईलवर कसा बनवायचा", "shadi ka biodata kaise banaye mobile se". Post to YouTube + Shorts, embed on the guide pages with VideoObject schema. These how-to queries show video results.

### Step 4 — Expand topical coverage (months 1–3), 2–3 pages/week
- **Community pages (each with a matching preset + sample):** Brahmin, Maratha, Jain, Christian, Sikh, Agarwal/Maheshwari, Kunbi, Mali, Maithil Brahmin.
- **Situational:** biodata for second marriage, NRI biodata, "how to write manglik in biodata", biodata without photo, `/marathi/parichay-patra/`.
- **Explainers (AI Overview bait):** "देवक म्हणजे काय", "गण/नाडी जुळवणी", "gotra list", "36 guna milan explained".
- **Seasonal traffic magnet:** `/vivah-muhurat-2026-2027/` in all three languages. Use a verified panchang source for dates. It has better CPC and earns natural links.
- **Job biodata** (10–40k/month, separate intent): a separate `/biodata-for-job/` section so marriage pages stay topically clean.

### Step 5 — Earn authority (ongoing)
- **Shareable output = backlinks.** Every biodata is forwarded on WhatsApp. The optional credit line on premium designs ("Made with biodatasathi.com") builds brand searches.
- Get listed on marathi/hindi matrimony-bureau directories and community (samaj) websites, and offer bureaus a free co-branded link.
- Answer "biodata" questions on Quora (Hindi/Marathi Quora is active) and in Reddit r/india, linking to the relevant guide.
- Pitch a "free tools for wedding season" roundup to Marathi/Hindi news-tech sections (Lokmat, Maharashtra Times, Navbharat Times).

### Step 6 — Optimise (monthly)
- In GSC, find queries at positions 5–15 and strengthen those pages (FAQ answers, better title, internal links).
- Watch Core Web Vitals (target LCP < 2 s on 4G). Fonts are self-hosted, and decorative fonts are not preloaded.
- Refresh "2026" in titles to "2027" each January.

## 4. Monetisation (your choice: AdSense + freemium)
1. **AdSense** only on content pages (formats, guides, muhurat), **never inside the editor**. Ads there slow the tool and hurt conversions and rankings.
2. **Premium templates** (16 designs): ₹49 one-time unlock via Razorpay (UPI, cards, netbanking), with the price shown up front. Built. Add live keys to switch it on (see README). Users who don't pay can still download premium designs with a small credit line.
3. **Matrimony affiliate links** (Shaadi, Jeevansathi, BharatMatrimony). Their keywords carry ₹34–54 CPC, so their affiliate payouts are the best revenue per visitor. Place them as a "Next step: share your biodata on…" card after download.
4. Later: kundali-matching page (huge traffic, low CPC) linking to an affiliate astrologer service.

## 5. Competitor landscape (summary)
| Operator | Domains | Model | Weakness we exploit |
|---|---|---|---|
| Pirangut (Pune) network | freebiodatamaker.com, freemarathibiodata.in, lagnachabiodata.in, marriagebiodataonline.com | Watermark, then fee (price not always stated) | No देवक/नाडी/कुलदैवत fields, inconsistent messaging |
| "Shanipeeth" | marriagebiodata.app, mybiodata.app | ₹39–150 per premium template, PDF via WhatsApp | 784 KB HTML pages, 53–74% of traffic is paid |
| marathibiodata.ai / marriagebiodata.ai | — | ₹39/49/59, fake countdown timer | Switching language resets your data |
| marathibiodatamaker.com (#1) | — | ₹50 to remove the watermark | English-only HTML, no देवक field |
| mymarriagebiodata.in | — | ₹20 to remove credit, AdSense | 5 s TTFB, contradictory template counts |
