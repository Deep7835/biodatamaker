"use client";

import { IconHeart } from "../editor/Icons";
import { forwardRef, memo, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { toDevanagariDigits } from "@/lib/i18n";
import { FONT_STACKS, type Palette, type PhotoShape } from "@/lib/templates";
import { isHeartJoiner, CARD, getDesign, sampleInvitation, type InviteDesign, type InviteEvent, type Invitation } from "@/lib/tools/invitation";
import { Divider, FrameArt, Mandala, SymbolIcon } from "../biodata/Ornaments";

const BASE = 17;
const MIN_SHRINK = 0.5;

/** Content padding per frame so text never runs into the ornaments. */
const FRAME_PAD: Partial<Record<InviteDesign["frame"], string>> = {
  toran: "114px 78px 58px",
  jharokha: "100px 88px 66px",
  arch: "118px 84px 60px",
  paisley: "72px 82px 68px",
  rangoli: "66px 104px 112px",
  ornate: "66px 86px 62px",
  corners: "66px 86px 62px",
  mandala: "62px 80px 60px",
  double: "58px 74px 56px",
};

const hasText = (e: InviteEvent) => !!(e.name.trim() || e.date.trim() || e.time.trim() || e.venue.trim());

function fonts(inv: Invitation, d: InviteDesign) {
  const f = FONT_STACKS[d.fonts];
  const tiro = inv.lang === "mr" ? "var(--font-tiro-mr)" : "var(--font-tiro-hi)";
  // Latin cards read better with Playfair for the elegant pair.
  const heading = inv.lang === "en" && d.fonts === "elegant" ? "var(--font-playfair), serif" : f.heading.replace("var(--font-tiro)", tiro);
  return { heading, body: f.body.replace("var(--font-tiro)", tiro) };
}

type Props = { inv: Invitation; className?: string };

/** 794×1123 wedding card. Shrinks its own type until everything fits on the card. */
export const InvitationCard = forwardRef<HTMLDivElement, Props>(function InvitationCard({ inv, className }, ref) {
  const d = getDesign(inv.designId);
  const p = d.palette;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [shrink, setShrink] = useState(1);
  const fmt = (s: string) => (inv.devanagariDigits ? toDevanagariDigits(s) : s);
  const signature = JSON.stringify({ ...inv, photo: inv.photo ? [inv.photo.src.length, inv.photo.zoom] : null, symbolImage: inv.symbolImage?.length });

  useLayoutEffect(() => {
    const fit = () => {
      const root = rootRef.current;
      const body = bodyRef.current;
      if (!root || !body) return;
      let k = 1;
      root.style.fontSize = `${BASE}px`;
      while (body.scrollHeight > body.clientHeight + 1 && k > MIN_SHRINK) {
        k -= 0.03;
        root.style.fontSize = `${BASE * k}px`;
      }
      setShrink(k);
    };
    fit();
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
    };
  }, [signature]);

  const f = fonts(inv, d);
  const light = p.dark ? p.bg : "#fff";
  const style = {
    width: CARD.w,
    height: CARD.h,
    background: p.paper,
    color: p.ink,
    fontFamily: f.body,
    fontSize: BASE * shrink,
    "--hfont": f.heading,
  } as CSSProperties;

  const events = inv.events.filter(hasText);
  const first = { name: inv.groom, parents: inv.groomParents };
  const second = { name: inv.bride, parents: inv.brideParents };
  const [a, b] = inv.brideFirst ? [second, first] : [first, second];
  const hosts = [
    { title: inv.hostsTitle, text: inv.hosts },
    { title: inv.wishersTitle, text: inv.wishers },
  ].filter((h) => h.text.trim());

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      lang={inv.lang}
      className={`biodata-doc relative overflow-hidden ${className ?? ""}`}
      style={style}
    >
      {d.mandala && (
        <div className="pointer-events-none absolute" style={{ left: CARD.w / 2 - 320, top: 300 }}>
          <Mandala size={640} color={p.accent} opacity={0.08} />
        </div>
      )}
      <FrameArt frame={d.frame} accent={p.accent} accent2={p.accent2} line={p.line} />
      <div className="absolute inset-0 flex flex-col" style={{ padding: FRAME_PAD[d.frame] ?? "58px 74px 56px" }}>
        <div ref={bodyRef} className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden text-center" style={{ lineHeight: 1.4 }}>
          <Block>
            <HeaderSymbol inv={inv} color={p.accent} />
            {inv.invocation.trim() && <div style={{ color: p.accent, fontSize: "0.92em", marginTop: "0.2em", letterSpacing: "0.02em" }}>{inv.invocation}</div>}
          </Block>
          <Gap />
          {inv.title.trim() && (
            <Block>
              <Title text={inv.title} style={d.title} p={p} light={light} />
            </Block>
          )}
          {inv.opening.trim() && (
            <Block>
              <div style={{ color: p.muted, fontSize: "1.18em", marginTop: "0.35em", fontStyle: inv.lang === "en" ? "italic" : undefined, letterSpacing: "0.03em" }}>{fmt(inv.opening)}</div>
            </Block>
          )}
          {inv.intro.trim() && (
            <>
              <Gap />
              <Block>
                <p style={{ color: p.muted, fontSize: "0.94em", lineHeight: 1.6, maxWidth: "34em", margin: "0 auto", whiteSpace: "pre-line" }}>{fmt(inv.intro)}</p>
              </Block>
            </>
          )}
          <Gap />
          {inv.photo && (
            <Block>
              <CouplePhoto inv={inv} shape={d.photo} p={p} />
              <div style={{ height: "0.5em" }} />
            </Block>
          )}
          <Block>
            <Person name={a.name} parents={a.parents} p={p} fmt={fmt} />
            {a.name.trim() && b.name.trim() && inv.joiner.trim() && <Joiner text={inv.joiner} p={p} />}
            <Person name={b.name} parents={b.parents} p={p} fmt={fmt} />
          </Block>
          {inv.muhurat.trim() && (
            <>
              <Gap />
              <Block>
                <div
                  style={{
                    display: "inline-block",
                    border: `1.5px solid ${p.accent2}`,
                    background: `${p.accent}14`,
                    color: p.dark ? p.ink : p.accent,
                    borderRadius: 999,
                    padding: "0.3em 1.3em",
                    fontSize: "1.08em",
                    fontWeight: 600,
                    maxWidth: "100%",
                  }}
                >
                  {fmt(inv.muhurat)}
                </div>
              </Block>
            </>
          )}
          {events.length > 0 && (
            <>
              <Gap />
              <Block>
                <Events events={events} style={d.events} p={p} fmt={fmt} />
              </Block>
            </>
          )}
          {inv.venue.trim() && (
            <>
              <Gap />
              <Block>
                {inv.venueTitle.trim() && <div style={{ fontFamily: "var(--hfont)", color: p.accent, fontSize: "1.2em", lineHeight: 1.3 }}>{inv.venueTitle}</div>}
                <div style={{ fontSize: "1em", whiteSpace: "pre-line", maxWidth: "32em", margin: "0.1em auto 0" }}>{fmt(inv.venue)}</div>
              </Block>
            </>
          )}
          {hosts.length > 0 && (
            <>
              <Gap />
              <Block>
                <div className="mb-2 flex justify-center">
                  <Divider color={p.accent2} width={180} />
                </div>
                <div className="grid w-full" style={{ gridTemplateColumns: `repeat(${hosts.length}, minmax(0, 1fr))`, columnGap: "1.6em" }}>
                  {hosts.map((h, i) => (
                    <div key={i} className="min-w-0">
                      {h.title.trim() && <div style={{ fontFamily: "var(--hfont)", color: p.accent, fontSize: "1.12em", lineHeight: 1.3 }}>{h.title}</div>}
                      <div style={{ fontSize: "0.92em", whiteSpace: "pre-line", lineHeight: 1.45, marginTop: "0.15em" }}>{fmt(h.text)}</div>
                    </div>
                  ))}
                </div>
              </Block>
            </>
          )}
          {(inv.contact.trim() || inv.closing.trim()) && (
            <>
              <Gap />
              <Block>
                {inv.closing.trim() && (
                  <div style={{ color: p.accent, fontSize: "1.02em", fontStyle: inv.lang === "en" ? "italic" : undefined }}>{fmt(inv.closing)}</div>
                )}
                {inv.contact.trim() && <div style={{ color: p.muted, fontSize: "0.88em", marginTop: "0.2em" }}>{fmt(inv.contact)}</div>}
              </Block>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

/** A row of content that never shrinks; only the gaps between rows do. */
function Block({ children }: { children: ReactNode }) {
  return (
    <div className="w-full shrink-0" style={{ overflowWrap: "anywhere" }}>
      {children}
    </div>
  );
}

/** Flexible gap: grows to spread short cards over the page, collapses to a minimum when space is tight. */
function Gap() {
  return <div aria-hidden style={{ flex: "1 1 0", minHeight: "0.45em", maxHeight: "2.4em" }} />;
}

function HeaderSymbol({ inv, color }: { inv: Invitation; color: string }) {
  const s = inv.symbolSize ?? (inv.symbol === "custom" ? 76 : 50);
  if (inv.symbol === "none") return null;
  if (inv.symbol === "custom") {
    if (!inv.symbolImage) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={inv.symbolImage} alt="" className="mx-auto" style={{ height: s, maxWidth: s * 2.4, objectFit: "contain" }} />;
  }
  return (
    <div className="flex justify-center">
      <SymbolIcon id={inv.symbol} color={color} size={s} />
    </div>
  );
}

function Title({ text, style, p, light }: { text: string; style: InviteDesign["title"]; p: Palette; light: string }) {
  const common: CSSProperties = { fontFamily: "var(--hfont)", lineHeight: 1.25 };
  if (style === "ribbon")
    return (
      <div className="flex justify-center">
        <div
          style={{
            ...common,
            background: p.accent,
            color: light,
            fontSize: "2.6em",
            padding: "0.12em 1.3em 0.16em",
            clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)",
            maxWidth: "100%",
          }}
        >
          {text}
        </div>
      </div>
    );
  if (style === "flourish")
    return (
      <div className="flex items-center justify-center gap-3">
        <Flourish color={p.accent2} />
        <div style={{ ...common, color: p.accent, fontSize: "3em", minWidth: 0 }}>{text}</div>
        <Flourish color={p.accent2} flip />
      </div>
    );
  return (
    <div className="flex flex-col items-center">
      <div style={{ ...common, color: p.accent, fontSize: "3.1em" }}>{text}</div>
      <Divider color={p.accent2} width={220} />
    </div>
  );
}

function Flourish({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg width="70" height="22" viewBox="0 0 70 22" aria-hidden style={{ flexShrink: 0, transform: flip ? "scaleX(-1)" : undefined }}>
      <path d="M2 11 H40" stroke={color} strokeWidth="1.3" />
      <path d="M40 11 C46 3 56 3 58 11 C56 19 46 19 40 11 Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1" />
      <circle cx="64" cy="11" r="3" fill={color} />
      <circle cx="8" cy="11" r="2" fill={color} />
    </svg>
  );
}

function Person({ name, parents, p, fmt }: { name: string; parents: string; p: Palette; fmt: (s: string) => string }) {
  if (!name.trim() && !parents.trim()) return null;
  return (
    <div>
      {name.trim() && <div style={{ fontFamily: "var(--hfont)", color: p.dark ? p.ink : p.accent, fontSize: "2.45em", lineHeight: 1.25 }}>{fmt(name)}</div>}
      {parents.trim() && (
        <div style={{ color: p.muted, fontSize: "0.9em", lineHeight: 1.45, maxWidth: "30em", margin: "0.1em auto 0", whiteSpace: "pre-line" }}>{fmt(parents)}</div>
      )}
    </div>
  );
}

function Joiner({ text, p }: { text: string; p: Palette }) {
  return (
    <div className="flex items-center justify-center gap-3" style={{ margin: "0.35em 0" }}>
      <span style={{ height: 1, width: "4.5em", background: `linear-gradient(to left, ${p.accent2}, transparent)` }} />
      <span
        className="flex items-center justify-center"
        style={{
          fontFamily: "var(--hfont)",
          color: p.accent2,
          fontSize: text.length > 3 ? "1.2em" : "1.55em",
          minWidth: "2.1em",
          height: "2.1em",
          padding: "0 0.4em",
          borderRadius: 999,
          border: `1.5px solid ${p.accent2}`,
          lineHeight: 1,
        }}
      >
        {isHeartJoiner(text) ? <IconHeart style={{ width: "0.8em", height: "0.8em" }} /> : text}
      </span>
      <span style={{ height: 1, width: "4.5em", background: `linear-gradient(to right, ${p.accent2}, transparent)` }} />
    </div>
  );
}

function Events({ events, style, p, fmt }: { events: InviteEvent[]; style: InviteDesign["events"]; p: Palette; fmt: (s: string) => string }) {
  const n = events.length;
  const cols = style === "columns" ? (n <= 4 ? n : 3) : n === 4 ? 2 : Math.min(n, 3);
  const boxed = style === "cards";
  const gap = 0.6;
  return (
    // Flex-wrap rather than grid so a short last row stays centred.
    <div className="flex w-full flex-wrap justify-center" style={{ gap: boxed ? `${gap}em` : "0.8em 0" }}>
      {events.map((e, i) => (
        <div
          key={e.id}
          className="min-w-0"
          style={{
            width: boxed ? `calc((100% - ${(cols - 1) * gap}em) / ${cols})` : `${100 / cols}%`,
            ...(boxed
              ? { border: `1px solid ${p.accent2}`, background: `${p.accent}0D`, borderRadius: 10, padding: "0.5em 0.6em 0.55em" }
              : { borderLeft: i % cols ? `1px solid ${p.line}` : undefined, padding: "0.1em 0.6em" }),
          }}
        >
          {e.name.trim() && <div style={{ fontFamily: "var(--hfont)", color: p.accent, fontSize: "1.22em", lineHeight: 1.25 }}>{e.name}</div>}
          {e.date.trim() && <div style={{ fontSize: "0.92em", marginTop: "0.15em" }}>{fmt(e.date)}</div>}
          {e.time.trim() && <div style={{ fontSize: "0.92em", fontWeight: 600, color: p.muted }}>{fmt(e.time)}</div>}
          {e.venue.trim() && <div style={{ fontSize: "0.85em", color: p.muted, lineHeight: 1.35, marginTop: "0.1em" }}>{fmt(e.venue)}</div>}
        </div>
      ))}
    </div>
  );
}

function CouplePhoto({ inv, shape, p }: { inv: Invitation; shape: PhotoShape; p: Palette }) {
  const photo = inv.photo!;
  const w = shape === "round" ? 150 : 140;
  const h = shape === "round" ? 150 : 176;
  const radius = shape === "round" ? "50%" : shape === "arch" ? `${w / 2}px ${w / 2}px 10px 10px` : 8;
  return (
    <div className="inline-block" style={{ padding: 4, border: `2px solid ${p.accent2}`, borderRadius: radius, background: p.paper }}>
      <div className="relative overflow-hidden" style={{ width: w, height: h, borderRadius: radius, background: p.line }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${photo.zoom})`, objectPosition: `${photo.x}% ${photo.y}%`, transformOrigin: `${photo.x}% ${photo.y}%` }}
        />
      </div>
    </div>
  );
}

/** Renders the card scaled to the width of its container. */
export const ScaledCard = forwardRef<HTMLDivElement, Props>(function ScaledCard({ inv, className }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / CARD.w));
    ro.observe(el);
    setScale(el.clientWidth / CARD.w);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className={`relative w-full overflow-hidden ${className ?? ""}`} style={{ aspectRatio: `${CARD.w} / ${CARD.h}` }}>
      <div style={{ width: CARD.w, height: CARD.h, transform: `scale(${scale})`, transformOrigin: "top left", visibility: scale ? "visible" : "hidden" }}>
        <InvitationCard ref={ref} inv={inv} />
      </div>
    </div>
  );
});

/** Design thumbnail with sample text; memoised so typing in the form never re-renders the picker. */
export const DesignThumb = memo(function DesignThumb({ designId, lang }: { designId: string; lang: Invitation["lang"] }) {
  const inv = useMemo(() => sampleInvitation(lang, designId), [lang, designId]);
  return <ScaledCard inv={inv} />;
});
