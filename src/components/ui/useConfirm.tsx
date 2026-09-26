"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

const LABELS = {
  en: { ok: "Yes, continue", cancel: "Cancel" },
  hi: { ok: "हाँ, आगे बढ़ें", cancel: "रद्द करें" },
  mr: { ok: "हो, पुढे चला", cancel: "रद्द करा" },
};

type Ask = { message: string; okLabel?: string; danger?: boolean; single?: boolean; resolve: (v: boolean) => void };

/**
 * Styled replacement for window.confirm(). `const { confirm, dialog } = useConfirm(lang)`;
 * render `{dialog}` once, then `if (!(await confirm("…"))) return;`.
 */
export function useConfirm(lang: Lang): {
  confirm: (message: string, opts?: { okLabel?: string; danger?: boolean }) => Promise<boolean>;
  notify: (message: string) => Promise<boolean>;
  dialog: ReactNode;
} {
  const [ask, setAsk] = useState<Ask | null>(null);
  const okRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback(
    (message: string, opts: { okLabel?: string; danger?: boolean } = {}) => new Promise<boolean>((resolve) => setAsk({ message, ...opts, resolve })),
    [],
  );

  const notify = useCallback((message: string) => new Promise<boolean>((resolve) => setAsk({ message, single: true, okLabel: "OK", resolve })), []);

  const close = useCallback(
    (v: boolean) => {
      ask?.resolve(v);
      setAsk(null);
    },
    [ask],
  );

  useEffect(() => {
    if (!ask) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ask, close]);

  const t = LABELS[lang];
  const dialog = ask ? (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-4" role="alertdialog" aria-modal aria-describedby="confirm-msg" onClick={() => close(false)}>
      <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl ring-1 ring-line" onClick={(e) => e.stopPropagation()}>
        <p id="confirm-msg" className="text-base leading-relaxed text-ink">
          {ask.message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          {!ask.single && (
            <button type="button" onClick={() => close(false)} className="rounded-full px-4 py-2 text-sm text-soft hover:text-ink">
              {t.cancel}
            </button>
          )}
          <button
            ref={okRef}
            type="button"
            onClick={() => close(true)}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white ${ask.danger ? "bg-maroon hover:bg-maroon-dark" : "bg-leaf hover:opacity-90"}`}
          >
            {ask.okLabel ?? t.ok}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, notify, dialog };
}
