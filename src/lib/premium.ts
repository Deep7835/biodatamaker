"use client";

/**
 * Premium unlock (₹49 one-time, all premium templates on this device).
 * The Worker in /worker creates the order and verifies Razorpay's signature;
 * we only keep the signed token it returns.
 */

export { PREMIUM_PRICE } from "./premium-price";
const KEY = "biodatasathi:premium";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayCtor = new (opts: Record<string, unknown>) => { open(): void; on(ev: string, cb: (r: { error?: { description?: string } }) => void): void };

export class PaymentError extends Error {
  constructor(
    public code: "unavailable" | "cancelled" | "failed" | "invalid",
    message?: string,
  ) {
    super(message ?? code);
  }
}

export function isPremiumUnlocked() {
  try {
    return /^pay_[A-Za-z0-9]+\.[0-9a-f]{32}$/.test(localStorage.getItem(KEY) ?? "");
  } catch {
    return false;
  }
}

function save(token: string) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* private mode: unlock still applies for this session via state */
  }
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
  } catch {
    throw new PaymentError("unavailable");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  // 5xx / missing API (e.g. plain `next dev`) means we couldn't reach Razorpay, not that a payment failed.
  if (!res.ok) throw new PaymentError(res.status >= 500 || res.status === 404 || res.status === 405 || res.status === 429 ? "unavailable" : "failed", data.error);
  return data;
}

let scriptPromise: Promise<RazorpayCtor> | null = null;
function loadCheckout(): Promise<RazorpayCtor> {
  const w = window as unknown as { Razorpay?: RazorpayCtor };
  if (w.Razorpay) return Promise.resolve(w.Razorpay);
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => (w.Razorpay ? resolve(w.Razorpay) : reject(new PaymentError("unavailable")));
    s.onerror = () => {
      scriptPromise = null;
      reject(new PaymentError("unavailable"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Opens Razorpay Checkout for ₹49; resolves once the Worker has verified the payment. */
export async function buyPremium(opts: { description: string; color: string }): Promise<void> {
  const [order, Razorpay] = await Promise.all([post<{ orderId: string; amount: number; currency: string; keyId: string }>("/api/order"), loadCheckout()]);
  const response = await new Promise<RazorpayResponse>((resolve, reject) => {
    const rzp = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "BiodataSathi",
      description: opts.description,
      theme: { color: opts.color },
      handler: resolve,
      modal: { ondismiss: () => reject(new PaymentError("cancelled")), confirm_close: true },
      notes: { product: "premium_templates" },
    });
    rzp.on("payment.failed", (r) => reject(new PaymentError("failed", r.error?.description)));
    rzp.open();
  });
  const { token } = await post<{ token: string }>("/api/verify", response);
  save(token);
}

/** Re-unlock on a new device or after clearing the browser, using the Razorpay payment ID (pay_…). */
export async function restorePremium(paymentId: string): Promise<void> {
  const id = paymentId.trim();
  if (!/^pay_[A-Za-z0-9]{8,30}$/.test(id)) throw new PaymentError("invalid");
  const { token } = await post<{ token: string }>("/api/restore", { paymentId: id });
  save(token);
}
