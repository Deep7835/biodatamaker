"use client";

import { useState } from "react";
import { DICTS } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import { buyPremium, PaymentError, PREMIUM_PRICE, restorePremium } from "@/lib/premium";
import { IconCrown } from "./Icons";

type Props = { lang: Lang; onClose: () => void; onUnlocked: () => void; onCredit: () => void };

export function PremiumDialog({ lang, onClose, onUnlocked, onCredit }: Props) {
  const t = DICTS[lang].editor;
  const [mode, setMode] = useState<"offer" | "restore">("offer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const message = (e: unknown, restoring: boolean) => {
    const code = e instanceof PaymentError ? e.code : "failed";
    if (code === "cancelled") return "";
    if (code === "unavailable") return t.payUnavailable;
    if (code === "invalid") return t.invalidId;
    return restoring ? t.restoreFailed : t.payFailed;
  };

  async function unlock() {
    setBusy(true);
    setError("");
    try {
      await buyPremium({ description: t.premiumTitle, color: "#8A1C2B" });
      onUnlocked();
    } catch (e) {
      setError(message(e, false));
    } finally {
      setBusy(false);
    }
  }

  async function restore(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await restorePremium(paymentId);
      onUnlocked();
    } catch (err) {
      setError(message(err, true));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" role="dialog" aria-modal aria-labelledby="premium-title" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-ink">
          <IconCrown /> {t.premium}
        </div>
        <h3 id="premium-title" className="font-display text-xl">
          {t.premiumTitle}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-soft">{t.premiumBody}</p>

        <ul className="mt-4 space-y-2 text-sm">
          {t.premiumPerks.map((perk) => (
            <li key={perk} className="flex gap-2">
              <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-leaf" fill="currentColor" aria-hidden>
                <path d="M8 13.2 4.8 10l-1.1 1.1L8 15.4l8.3-8.3-1.1-1.1z" />
              </svg>
              {perk}
            </li>
          ))}
        </ul>

        {mode === "offer" ? (
          <>
            <button
              onClick={unlock}
              disabled={busy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-maroon py-3 text-base font-semibold text-white shadow-md shadow-maroon/20 transition hover:bg-maroon-dark disabled:opacity-60"
            >
              {busy ? t.opening : t.unlockCta}
              {!busy && <span className="text-xs font-normal text-white/75">· {t.oneTime}</span>}
            </button>
            <p className="mt-2 text-center text-[11px] text-soft">{t.securePay}</p>
          </>
        ) : (
          <form onSubmit={restore} className="mt-5">
            <div className="flex gap-2">
              <input
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                placeholder={t.restorePlaceholder}
                aria-label={t.restorePlaceholder}
                autoFocus
                className="min-w-0 flex-1 rounded-full border border-line bg-ivory px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
              <button disabled={busy || !paymentId.trim()} className="rounded-full bg-maroon px-4 text-sm font-semibold text-white disabled:opacity-50">
                {busy ? "…" : t.restoreBtn}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-soft">{t.restoreHint}</p>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-maroon/5 px-3 py-2 text-xs text-maroon">
            {error}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-4 text-sm">
          <button
            onClick={() => {
              setMode(mode === "offer" ? "restore" : "offer");
              setError("");
            }}
            className="text-left text-xs text-soft underline decoration-line underline-offset-2 hover:text-ink"
          >
            {mode === "offer" ? t.restoreLink : `← ${t.unlockCta}`}
          </button>
          <button onClick={onCredit} className="shrink-0 text-xs font-medium text-soft hover:text-ink">
            {t.premiumContinue}
          </button>
        </div>
        <span className="sr-only">₹{PREMIUM_PRICE}</span>
      </div>
    </div>
  );
}
