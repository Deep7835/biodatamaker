# Marathi Biodata Make

Free marriage biodata maker in English, हिंदी and मराठी. Next.js static export, deployed on Cloudflare.

- 24 templates (6 layouts × 13 palettes, 5 premium), auto-fit to one A4 page
- Complete Hindu/Marathi field set plus Jain, Buddhist, Muslim, Christian and Sikh presets
- Export: PDF, JPG, Word (.docx), WhatsApp share, all in the browser
- English → Devanagari typing (Google Input Tools endpoint, falls back silently)
- No login: drafts are saved in `localStorage` per language

- Kundali: optional North Indian birth chart (fill planets or upload a photo); गण/नाडी/रास auto-fill from नक्षत्र + चरण

**Free tools** (each has an en/hi/mr page; hub at `/biodata-tools/`, `/hindi/tools/`, `/marathi/sadhane/`):
kundali matching (36 guna), rashi/nakshatra/lagna finder that fills the biodata and its kundali (astronomy-engine, Lahiri ayanamsa), wedding invitation maker (14 designs), vivah muhurat 2026–27 (sourced dates), biodata→WhatsApp text, Marathi/Hindi typing, height converter, age-gap calculator.

See [docs/SEO-STRATEGY.md](docs/SEO-STRATEGY.md) for keyword research and the ranking plan, and [docs/SETUP-TRACKING.md](docs/SETUP-TRACKING.md) for Search Console, Bing, analytics and Clarity setup.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run preview    # serve ./out
npm run dev:full   # build + Worker locally (payments API), http://localhost:8787
npm run deploy     # build + wrangler deploy (Cloudflare)
```

## Premium payments (Razorpay, ₹49 one-time)

₹49 unlocks all premium templates on that device (no credit line). The static site is served by a small Worker (`worker/index.ts`) that handles only `/api/*`:

| Endpoint | Does |
|---|---|
| `POST /api/order` | Creates a ₹49 order (amount fixed server-side) |
| `POST /api/verify` | Checks Razorpay's HMAC signature and returns a signed unlock token |
| `POST /api/restore` | Re-issues the token from a past `pay_…` ID (new phone / cleared browser) |

**Setup**
1. Razorpay Dashboard → Settings → API Keys. Use **Test mode** keys first.
2. Local: `cp .dev.vars.example .dev.vars`, fill in the keys, then run `npm run dev:full` (serves on http://localhost:8787). Plain `npm run dev` has no `/api`, so the Unlock button shows "Payments aren't available".
3. Production: set the three secrets once:
   ```bash
   npx wrangler secret put RAZORPAY_KEY_ID
   npx wrangler secret put RAZORPAY_KEY_SECRET
   npx wrangler secret put UNLOCK_SECRET   # any long random string: openssl rand -hex 32
   ```
4. In Razorpay, keep **automatic payment capture** on (the default for Orders), so payments don't sit in "authorized" and get auto-refunded.
5. Before going live, Razorpay reviews your site. The required pages are included (`/terms/`, `/privacy/`, `/refund-policy/`, `/contact/`). Fill `SITE.operator`, `SITE.address` and `SITE.contactEmail` in `src/lib/i18n.ts` so they match your KYC details.

The unlock is enforced in the browser, because downloads are generated client-side. A determined user could bypass it. Payments themselves can't be faked: the order amount and the signature check happen on the server.

## Where things live

| Path | What |
|---|---|
| `src/lib/biodata.ts` | Data model, fields (labels, samples, dropdown suggestions) per language, religion presets |
| `src/lib/templates.ts` | Palettes and the template list. Add a template by adding one line to `SPECS` |
| `src/components/biodata/` | A4 renderer (`BiodataDocument`), ornaments and symbols (SVG) |
| `src/components/editor/` | Editor UI |
| `src/lib/export.ts` | PDF/JPG/DOCX/share |
| `src/lib/premium.ts`, `worker/index.ts` | Razorpay checkout (client) and payment API (Worker) |
| `src/content/legal.ts` | Terms, Privacy, Refund and Contact pages |
| `src/components/tools/*`, `src/lib/tools/*`, `src/content/tools/*` | The free tools (UI, logic, page copy). Pages are wired via `tool` in `PageContent` |
| `src/lib/analytics.ts`, `.env.example` | Optional analytics/verification IDs (off until set) |
| `scripts/generate-assets.mjs` | `npm run assets`: template preview images, sample PDF/DOCX, PWA icons |
| `src/content/{en,hi,mr}.ts` | SEO landing-page copy. Register new slugs in `src/content/slugs.ts` |
| `src/app/(en)`, `(hi)/hindi`, `(mr)/marathi` | One route tree per language (separate root layouts for `<html lang>`) |

Change the brand or domain in `src/lib/i18n.ts` (`SITE`).
