import { ANALYTICS } from "@/lib/analytics";
import { SITE } from "@/lib/i18n";

const enabled = [
  ANALYTICS.cloudflareToken && "Cloudflare Web Analytics (cookieless page counts)",
  ANALYTICS.gaId && "Google Analytics (anonymised visits and download counts)",
  ANALYTICS.clarityId && "Microsoft Clarity (anonymous usage heatmaps; your biodata details and form entries are masked and never recorded)",
].filter(Boolean);
const ANALYTICS_LINE = enabled.length
  ? `we use ${enabled.join(", ")} to understand which pages and features help people. None of them receive your biodata content.`
  : "we don't run third-party analytics right now. If we add them, they will never receive your biodata content, and this page will list them.";
import { PREMIUM_PRICE } from "@/lib/premium-price";

export type LegalDoc = { slug: string; title: string; description: string; body: string };

const updated = "26 September 2026";

export const LEGAL: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Use",
    description: `Terms for using ${SITE.name}, the free marriage biodata maker, and the optional premium templates.`,
    body: `
Last updated: ${updated}

${SITE.name} (${SITE.url}) is operated by **${SITE.operator}**. By using the site you agree to these terms.

## The service
- ${SITE.name} lets you create a marriage biodata in your browser and download it as PDF, JPG or Word.
- Free templates are free to use without a watermark.
- **Premium templates** can be unlocked with a one-time payment of **₹${PREMIUM_PRICE}** (inclusive of applicable taxes). The unlock applies to the browser and device on which you paid. You can restore it on another device with your Razorpay payment ID.

## Your content
- You are responsible for the details and photos you enter. Only upload photos you have the right to use.
- Your biodata is stored in your own browser. We do not receive or store it (see our [Privacy Policy](/privacy/)).

## Payments
- Payments are processed by Razorpay. We never see or store your card, UPI or bank details.
- Prices may change in future. The price you pay is always shown before you pay.

## Acceptable use
Do not use the site to create misleading or unlawful documents, or try to disrupt or reverse-engineer the service.

## Disclaimer
The service is provided "as is". We are not a matrimonial service and are not responsible for decisions made using a biodata created here.

## Contact
Questions: [${SITE.contactEmail}](mailto:${SITE.contactEmail}).
`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: `How ${SITE.name} handles your data: your biodata stays in your browser, no login, payments by Razorpay.`,
    body: `
Last updated: ${updated}

## What we don't collect
- **Your biodata details and photos never leave your device.** They are saved in your browser's local storage so you can come back and edit. Clearing your browser data deletes them.
- There are no accounts and no login.

## What we do process
- **Payments:** if you buy premium, Razorpay processes the payment and may collect your name, phone, email and payment details under [Razorpay's privacy policy](https://razorpay.com/privacy/). We receive only the order and payment IDs and the payment status.
- **Typing in Hindi/Marathi:** if you turn on "Type in English → Devanagari", the word you type is sent to Google Input Tools to get the Devanagari spelling.
- **Analytics:** ${ANALYTICS_LINE}

## Your choices
You can use every free feature without sharing any personal data with us. To delete your saved biodata, use "Start fresh" in the editor or clear your browser data.

## Contact
[${SITE.contactEmail}](mailto:${SITE.contactEmail})
`,
  },
  {
    slug: "refund-policy",
    title: "Cancellation & Refund Policy",
    description: `Refunds for ${SITE.name} premium templates (₹${PREMIUM_PRICE} one-time unlock).`,
    body: `
Last updated: ${updated}

Premium is a digital unlock that is delivered instantly after payment, so there is nothing to cancel or ship.

## When we refund
We give a **full refund** if, within **7 days** of payment:
- you were charged but premium did not unlock and the "Restore purchase" option did not fix it, or
- you were charged twice for the same unlock.

Email [${SITE.contactEmail}](mailto:${SITE.contactEmail}) with your Razorpay payment ID (it starts with pay_). Approved refunds go back to the original payment method within **5–7 working days**, as per Razorpay and bank timelines.

## Failed payments
If money was deducted but the payment failed, Razorpay reverses it automatically, usually within 5–7 working days.

## Delivery
Premium unlocks immediately in your browser after a successful payment. No physical goods are shipped.
`,
  },
  {
    slug: "contact",
    title: "Contact Us",
    description: `Contact ${SITE.name} for help with biodata downloads or premium payments.`,
    body: `
We usually reply within 1–2 working days.

- **Email:** [${SITE.contactEmail}](mailto:${SITE.contactEmail})
- **Operated by:** ${SITE.operator}${SITE.address ? `\n- **Address:** ${SITE.address}` : ""}

For payment questions, please include your Razorpay payment ID (starts with pay_).
`,
  },
];
