/**
 * Cloudflare Worker: serves the static site and a tiny payments API for premium templates.
 *
 *   POST /api/order    → creates a ₹49 Razorpay order (amount fixed here, never trusted from the client)
 *   POST /api/verify   → checks Razorpay's signature and returns a signed unlock token
 *   POST /api/restore  → re-issues the token from a past payment ID (new phone / cleared browser)
 *
 * Secrets (wrangler secret put …): RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, UNLOCK_SECRET
 */

import { PREMIUM_PRICE } from "../src/lib/premium-price";

const PRICE_PAISE = PREMIUM_PRICE * 100;
const PRODUCT = "premium_templates";
const RZP = "https://api.razorpay.com/v1";

export interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  /** Workers Rate Limiting binding (wrangler.jsonc → ratelimits). Optional so local tests without it still run. */
  API_LIMITER?: { limit(opts: { key: string }): Promise<{ success: boolean }> };
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  UNLOCK_SECRET: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "strict-transport-security": "max-age=31536000; includeSubDomains",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
  });

const enc = new TextEncoder();

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
  return [...sig].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function unlockToken(env: Env, paymentId: string) {
  return `${paymentId}.${(await hmacHex(env.UNLOCK_SECRET, `unlock:${paymentId}`)).slice(0, 32)}`;
}

function razorpay(env: Env, path: string, init: RequestInit = {}) {
  return fetch(`${RZP}${path}`, {
    ...init,
    headers: {
      authorization: `Basic ${btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)}`,
      "content-type": "application/json",
      ...init.headers,
    },
  });
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function createOrder(env: Env) {
  const res = await razorpay(env, "/orders", {
    method: "POST",
    body: JSON.stringify({ amount: PRICE_PAISE, currency: "INR", receipt: `bs_${Date.now()}`, notes: { product: PRODUCT } }),
  });
  if (!res.ok) {
    console.error("razorpay order failed", res.status, await res.text());
    return json({ error: "order_failed" }, 502);
  }
  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.RAZORPAY_KEY_ID });
}

async function verify(env: Env, req: Request) {
  const b = await readJson(req);
  const orderId = String(b.razorpay_order_id ?? "");
  const paymentId = String(b.razorpay_payment_id ?? "");
  const signature = String(b.razorpay_signature ?? "");
  if (!orderId || !paymentId || !signature) return json({ error: "missing_fields" }, 400);
  const expected = await hmacHex(env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
  if (!safeEqual(expected, signature)) return json({ error: "bad_signature" }, 400);
  return json({ token: await unlockToken(env, paymentId), paymentId });
}

async function restore(env: Env, req: Request) {
  const paymentId = String((await readJson(req)).paymentId ?? "").trim();
  if (!/^pay_[A-Za-z0-9]{8,30}$/.test(paymentId)) return json({ error: "invalid_payment_id" }, 400);
  const res = await razorpay(env, `/payments/${paymentId}`);
  if (!res.ok) return json({ error: "not_found" }, 404);
  const p = (await res.json()) as { status: string; amount: number; currency: string; order_id?: string };
  if (p.status !== "captured" || p.amount < PRICE_PAISE || p.currency !== "INR" || !p.order_id) return json({ error: "not_eligible" }, 400);
  const o = await razorpay(env, `/orders/${p.order_id}`);
  const order = o.ok ? ((await o.json()) as { notes?: Record<string, string> }) : null;
  if (order?.notes?.product !== PRODUCT) return json({ error: "not_eligible" }, 400);
  return json({ token: await unlockToken(env, paymentId), paymentId });
}

const worker = {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (!pathname.startsWith("/api/")) return env.ASSETS.fetch(req);
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    // Only our own pages may call the API (blocks cross-site form/script abuse).
    const origin = req.headers.get("origin");
    if (origin && new URL(origin).host !== new URL(req.url).host) return json({ error: "forbidden" }, 403);
    const ip = req.headers.get("cf-connecting-ip") ?? "local";
    if (env.API_LIMITER && !(await env.API_LIMITER.limit({ key: ip })).success) return json({ error: "rate_limited" }, 429);
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET || !env.UNLOCK_SECRET) return json({ error: "payments_not_configured" }, 503);
    try {
      if (pathname === "/api/order") return await createOrder(env);
      if (pathname === "/api/verify") return await verify(env, req);
      if (pathname === "/api/restore") return await restore(env, req);
      return json({ error: "not_found" }, 404);
    } catch (e) {
      console.error(e);
      return json({ error: "server_error" }, 500);
    }
  },
};

export default worker;
