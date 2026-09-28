# SEO & analytics setup (do once, after the domain is live)

The code is ready. Each service switches on when you put its ID in `.env.local` (copy `.env.example`) and redeploy (`npm run deploy`). Nothing loads until you do.

| Order | Tool | Cost | What it gives you | Time |
|---|---|---|---|---|
| 1 | Google Search Console | Free | Which searches you appear for, positions, indexing errors | 10 min |
| 2 | Bing Webmaster Tools | Free | Bing, plus the index behind ChatGPT/Copilot answers | 5 min |
| 3 | Cloudflare Web Analytics | Free | Visitor counts, cookieless (no consent banner needed) | 3 min |
| 4 | Microsoft Clarity | Free | Heatmaps + session replays to see where people get stuck | 5 min |
| 5 | Google Analytics 4 (optional) | Free | Download/conversion events, audience detail | 10 min |
| 6 | Keyword research: Keyword Planner, Google Trends, Ahrefs Webmaster Tools | Free | Real volumes, seasonality, backlinks | ongoing |
| 7 | Quality checks: PageSpeed Insights, Rich Results Test | Free | Speed + structured-data validation | 5 min |

---

## 1. Google Search Console (most important)
1. Go to https://search.google.com/search-console and click **Add property**, then **Domain**, and enter `marathibiodatamake.in`.
2. Google shows a TXT record. In **Cloudflare → DNS → Add record** choose Type `TXT`, Name `@`, and paste the value. Back in Search Console, click **Verify**.
   - Prefer the HTML-tag method instead? Choose **URL prefix → HTML tag**, copy the `content="…"` value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, then click Verify.
3. **Sitemaps → Add** `https://marathibiodatamake.in/sitemap.xml`. It lists every page in all 3 languages with hreflang and template images.
4. **URL Inspection**: paste each of these and click **Request indexing**:
   `/`, `/marathi/`, `/hindi/`, `/marathi/biodata-format/`, `/marriage-biodata-format/`, `/hindi/shadi-biodata-format/`, `/marathi/gun-milan/`, `/kundali-matching/`
5. Weekly: **Performance → Search results → Queries**. Look for queries at position 5–15 with impressions. Those pages are close; improve their titles and FAQs.

## 2. Bing Webmaster Tools
1. https://www.bing.com/webmasters, then **Import from Google Search Console** (one click; it copies the sites and sitemaps).
2. If importing isn't possible, use the **HTML Meta tag** option and put the value in `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
3. Turn on **IndexNow** in Bing settings if offered (faster indexing of new pages).

## 3. Cloudflare Web Analytics (recommended default)
1. Cloudflare dashboard, then **Analytics & Logs → Web Analytics → Add a site**, and enter `marathibiodatamake.in`.
2. Since the site runs on Cloudflare, choose **automatic setup** (no code needed). If it offers a JS snippet instead, copy the `token` into `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`.

## 4. Microsoft Clarity
1. https://clarity.microsoft.com, then **New project**, and enter the site URL.
2. Copy the **Project ID** into `NEXT_PUBLIC_CLARITY_ID`.
3. Privacy is handled in code: the biodata form and preview carry `data-clarity-mask`, so names, phone numbers and photos never appear in recordings. In Clarity **Settings → Masking**, keep **Balanced** or **Strict**.
4. Useful filters: *Rage clicks*, *Dead clicks*, and pages `/create/`, `/marathi/create/`.

## 5. Google Analytics 4 (set up)
1. Property ID `G-YEKN1NH16E` is the built-in default in `src/lib/analytics.ts`; set `NEXT_PUBLIC_GA_ID` only to override it.
2. GA loads only after the visitor clicks **Accept** on the cookie banner, so the Realtime report shows only visitors who accepted.
3. The editor already sends `biodata_download` events (with `format` = pdf/jpg/docx/share and `template`). In GA4, mark `biodata_download` as a **key event**.
4. The privacy page updates automatically to list GA once the ID is set.

## 6. Keyword research (monthly)
- **Google Keyword Planner** (https://ads.google.com → Tools → Keyword Planner, free with an Ads account; no need to run ads). Check real volumes for the estimated rows in `docs/SEO-STRATEGY.md`, especially Marathi/Hindi terms.
- **Google Trends**: compare "marathi biodata", "biodata for marriage", "kundali matching", with region = India / Maharashtra, over 5 years. Plan new pages 4–6 weeks before the Oct–Jan and Mar–May peaks.
- **Ahrefs Webmaster Tools** (free for your own verified site): backlinks, broken links, site audit.
- **Search Console Queries** (above) is the best keyword tool once you have traffic.
- Paid, only if needed later: Semrush / Ahrefs full plans for competitor tracking.

## 7. Quality checks (after each big change)
- **PageSpeed Insights**: https://pagespeed.web.dev. Test `/marathi/` and `/marathi/create/` on mobile and aim for LCP < 2.5 s.
- **Rich Results Test**: https://search.google.com/test/rich-results. Validates the FAQ, Breadcrumb and WebApplication structured data.
- **Hreflang check**: in Search Console, look at *International targeting* errors, if any.

## 8. HTTPS, security and consent (already in the code)
- **HTTPS:** in Cloudflare, go to **SSL/TLS → Edge Certificates** and turn on **Always Use HTTPS**. The site also sends an HSTS header (`public/_headers`), so browsers remember to use HTTPS.
- **Security headers:** `public/_headers` sets CSP, X-Frame-Options, nosniff, Referrer-Policy and Permissions-Policy for pages. `worker/index.ts` sets them for the payments API. If you add a new third-party script (for example an ad network), add its domain to the CSP in `public/_headers`, or it will be blocked.
- **Payments API protection:** same-origin check, plus 20 requests/minute per IP (`ratelimits` in `wrangler.jsonc`).
- **Cookie consent:** Cloudflare Web Analytics is cookieless, so no banner is needed. A consent banner appears automatically only when GA4 or Clarity IDs are set, and those scripts load only after the visitor accepts.

## 9. UTM links for campaigns
GA4 reads `utm_*` automatically. The site also remembers the first campaign of a visit and attaches it to `biodata_download` events. Use these patterns (or `utmLink()` in `src/lib/analytics.ts`):

| Where you share | Link |
|---|---|
| WhatsApp groups | `https://marathibiodatamake.in/marathi/?utm_source=whatsapp&utm_medium=group&utm_campaign=lagna-season-2026` |
| Instagram bio | `https://marathibiodatamake.in/marathi/?utm_source=instagram&utm_medium=bio&utm_campaign=profile` |
| YouTube video description | `https://marathibiodatamake.in/marathi/create/?utm_source=youtube&utm_medium=video&utm_campaign=how-to-mobile` |
| Facebook community post | `https://marathibiodatamake.in/hindi/?utm_source=facebook&utm_medium=post&utm_campaign=shadi-season-2026` |
| Matrimony bureau partner | `https://marathibiodatamake.in/marathi/?utm_source=bureau-<name>&utm_medium=referral&utm_campaign=partners` |

Keep values lowercase with hyphens. In GA4, see **Reports → Acquisition → Traffic acquisition**, and filter `biodata_download` events by `utm_campaign`.

## Monthly SEO routine (30 minutes)
1. Search Console, then Queries at positions 5–15: improve those pages.
2. Clarity, then the editor recordings: fix anything people struggle with.
3. Add 2–3 new pages from the list in `docs/SEO-STRATEGY.md` §3 step 4.
4. Each January: update "2026" to "2027" in titles, and refresh the muhurat page.
