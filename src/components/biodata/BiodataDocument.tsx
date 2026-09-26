"use client";

import { forwardRef, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { FIELDS, type Biodata, type Photo, type Row, type Section } from "@/lib/biodata";
import { toDevanagariDigits } from "@/lib/i18n";
import { FONT_STACKS, getTemplate, type Palette, type PhotoShape, type Template } from "@/lib/templates";
import { hasKundali, KundaliChart } from "./KundaliChart";
import { Divider, FrameArt, Mandala, SymbolIcon } from "./Ornaments";

const KUNDALI_TITLE = { en: "Birth Chart", hi: "जन्म कुंडली", mr: "जन्म कुंडली" };

export const A4 = { w: 794, h: 1123 };

type Props = {
  data: Biodata;
  placeholderPhoto?: boolean;
  className?: string;
  credit?: string;
  /** Show faded sample text in empty fields so the full design stays visible while editing. */
  ghost?: boolean;
};

/** A row as rendered; `ghost` marks sample text standing in for an empty field. */
type DocRow = Row & { ghost?: boolean };
type DocSection = Omit<Section, "rows"> & { rows: DocRow[] };

const isNameRow = (r: Row) => r.id.endsWith("-name");
const GHOST_OPACITY = 0.38;

function visibleSections(data: Biodata, ghost?: boolean): DocSection[] {
  return data.sections
    .filter((s) => !s.hidden)
    .map((s) => ({
      ...s,
      rows: s.rows.flatMap((r): DocRow[] => {
        if (r.value.trim()) return [r];
        const sample = ghost ? FIELDS[r.id.split("-").slice(1).join("-")]?.sample[data.lang] : undefined;
        return sample ? [{ ...r, value: sample, ghost: true }] : [];
      }),
    }))
    .filter((s) => s.rows.length > 0);
}

function baseFontSize(sections: DocSection[], twoColumns: boolean) {
  const units = sections.reduce((n, s) => n + s.rows.length + 1.8, 0) / (twoColumns ? 1.7 : 1);
  return Math.max(11.5, Math.min(twoColumns ? 15 : 16, 16.5 - (units - 24) * 0.2));
}

/** A4 biodata page. Shrinks its own type until everything fits on one page. */
export const BiodataDocument = forwardRef<HTMLDivElement, Props>(function BiodataDocument({ data, placeholderPhoto, className, credit, ghost }, ref) {
  const t = getTemplate(data.templateId);
  const p: Palette = data.accent ? { ...t.palette, accent: data.accent } : t.palette;
  const sections = visibleSections(data, ghost);
  const [shrink, setShrink] = useState(1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fmt = (s: string) => (data.devanagariDigits ? toDevanagariDigits(s) : s);

  const base = baseFontSize(sections, t.layout === "twocol");
  const fs = base * shrink;
  const signature = JSON.stringify([sections, data.kundali, data.templateId, data.photo?.src.length, data.invocation, data.title, data.symbol]);

  useLayoutEffect(() => {
    const fit = () => {
      const root = rootRef.current;
      const body = bodyRef.current;
      if (!root || !body) return;
      let k = 1;
      root.style.fontSize = `${base}px`;
      while (body.scrollHeight > body.clientHeight + 1 && k > 0.6) {
        k -= 0.03;
        root.style.fontSize = `${base * k}px`;
      }
      setShrink(k);
    };
    fit();
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
    };
  }, [signature, base]);

  const nameRow = sections.flatMap((s) => s.rows).find(isNameRow);
  const name = nameRow ? <span style={{ opacity: nameRow.ghost ? GHOST_OPACITY : 1 }}>{nameRow.value}</span> : null;
  const fonts = FONT_STACKS[t.fonts];
  const tiro = data.lang === "mr" ? "var(--font-tiro-mr)" : "var(--font-tiro-hi)";
  const style = {
    width: A4.w,
    height: A4.h,
    background: p.paper,
    color: p.ink,
    fontFamily: fonts.body.replace("var(--font-tiro)", tiro),
    fontSize: fs,
    "--acc": p.accent,
    "--acc2": p.accent2,
    "--line": p.line,
    "--muted": p.muted,
    "--hfont": fonts.heading.replace("var(--font-tiro)", tiro),
  } as CSSProperties;

  const photo = data.photo || placeholderPhoto ? <PhotoBox photo={data.photo} shape={t.photo} palette={p} layout={t.layout} /> : null;
  const kundali = hasKundali(data.kundali) ? (
    <KundaliChart k={data.kundali} size={t.layout === "twocol" ? 138 : 150} color={p.accent} ink={p.ink} title={KUNDALI_TITLE[data.lang]} fmt={fmt} />
  ) : null;
  const ctx = { t, p, fmt, photo, name, sections, kundali, lang: data.lang };

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      lang={data.lang}
      data-clarity-mask="true" className={`biodata-doc relative overflow-hidden ${className ?? ""}`} style={style}>
      {t.palette.dark && (
        <div className="pointer-events-none absolute" style={{ left: A4.w / 2 - 330, top: 250 }}>
          <Mandala size={660} color={p.accent} opacity={0.08} />
        </div>
      )}
      <FrameArt frame={t.frame} accent={p.accent} accent2={p.accent2} line={p.line} />
      {t.layout === "sidebar" ? (
        <SidebarLayout {...ctx} data={data} bodyRef={bodyRef} />
      ) : t.layout === "banner" ? (
        <BannerLayout {...ctx} data={data} bodyRef={bodyRef} />
      ) : t.layout === "twocol" ? (
        <TwoColLayout {...ctx} data={data} bodyRef={bodyRef} />
      ) : t.layout === "minimal" ? (
        <MinimalLayout {...ctx} data={data} bodyRef={bodyRef} />
      ) : (
        <ClassicLayout {...ctx} data={data} bodyRef={bodyRef} centered={t.layout !== "classic"} />
      )}
      {credit && (
        <div className="absolute inset-x-0 flex justify-center" style={{ bottom: 3 }}>
          <span style={{ fontSize: 10, lineHeight: "14px", color: p.muted, background: p.paper, padding: "0 8px", borderRadius: 7, fontFamily: "var(--font-mukta), sans-serif" }}>
            {credit}
          </span>
        </div>
      )}
    </div>
  );
});

type Ctx = {
  t: Template;
  p: Palette;
  fmt: (s: string) => string;
  photo: React.ReactNode;
  name: React.ReactNode;
  sections: DocSection[];
  kundali: React.ReactNode;
  data: Biodata;
  bodyRef: React.RefObject<HTMLDivElement | null>;
};

/** Built-in symbol, or the user's own deity photo / family logo. */
function HeaderSymbol({ data, color, size }: { data: Biodata; color: string; size: number }) {
  const s = data.symbolSize ?? (data.symbol === "custom" ? 72 : size);
  if (data.symbol === "custom") {
    if (!data.symbolImage) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={data.symbolImage} alt="" style={{ height: s, maxWidth: s * 2.4, objectFit: "contain" }} />;
  }
  return <SymbolIcon id={data.symbol} color={color} size={s} />;
}

/** Content padding per frame so text never runs into the ornaments. */
const FRAME_PAD: Partial<Record<Template["frame"], string>> = {
  arch: "110px 78px 60px",
  toran: "108px 70px 52px",
  jharokha: "96px 80px 64px",
  paisley: "66px 76px 64px",
  rangoli: "58px 84px 96px",
};
const framePad = (t: Template) => FRAME_PAD[t.frame] ?? "58px 70px 52px";

function Header({ data, p, compact }: { data: Biodata; p: Palette; compact?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <HeaderSymbol data={data} color={p.accent} size={compact ? 38 : 48} />
      {data.invocation && (
        <div style={{ color: p.accent, fontSize: "0.95em", marginTop: 4, letterSpacing: "0.02em" }}>{data.invocation}</div>
      )}
      {data.title && (
        <div style={{ fontFamily: "var(--hfont)", color: p.accent, fontSize: compact ? "1.9em" : "2.2em", lineHeight: 1.25, marginTop: 2 }}>
          {data.title}
        </div>
      )}
      <div style={{ marginTop: 4 }}>
        <Divider color={p.accent2} width={200} />
      </div>
    </div>
  );
}

function SectionTitle({ title, p, variant }: { title: string; p: Palette; variant: "center" | "left" | "pill" | "caps" }) {
  if (variant === "center")
    return (
      <div className="flex items-center gap-3" style={{ margin: "0.9em 0 0.45em" }}>
        <span className="h-px flex-1" style={{ background: p.line }} />
        <span style={{ fontFamily: "var(--hfont)", color: p.accent, fontSize: "1.28em", lineHeight: 1.2 }}>{title}</span>
        <span className="h-px flex-1" style={{ background: p.line }} />
      </div>
    );
  if (variant === "pill")
    return (
      <div style={{ margin: "0.9em 0 0.45em" }}>
        <span
          style={{ background: p.accent, color: p.dark ? p.bg : "#fff", fontFamily: "var(--hfont)", fontSize: "1.1em", padding: "0.12em 0.9em", borderRadius: 999, display: "inline-block" }}
        >
          {title}
        </span>
      </div>
    );
  if (variant === "caps")
    return (
      <div style={{ margin: "1em 0 0.4em", color: p.accent, fontWeight: 700, fontSize: "0.92em", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: `1px solid ${p.line}`, paddingBottom: "0.3em" }}>
        {title}
      </div>
    );
  return (
    <div style={{ margin: "0.9em 0 0.45em", fontFamily: "var(--hfont)", color: p.accent, fontSize: "1.22em", borderLeft: `4px solid ${p.accent2}`, paddingLeft: "0.5em", lineHeight: 1.25 }}>
      {title}
    </div>
  );
}

function Rows({
  rows,
  p,
  fmt,
  labelWidth = "36%",
  skipName,
  centered,
}: {
  rows: DocRow[];
  p: Palette;
  fmt: (s: string) => string;
  labelWidth?: string;
  skipName?: boolean;
  centered?: boolean;
}) {
  return (
    <table className="border-collapse" style={{ tableLayout: "fixed", width: centered ? "92%" : "100%", margin: centered ? "0 auto" : undefined }}>
      <colgroup>
        <col style={{ width: labelWidth }} />
        <col style={{ width: centered ? "1.8em" : "1.2em" }} />
        <col />
      </colgroup>
      <tbody>
        {rows
          .filter((r) => !(skipName && isNameRow(r)))
          .map((r) => (
            <tr key={r.id} style={{ verticalAlign: "top" }}>
              <th scope="row" style={{ color: p.muted, fontWeight: 600, padding: "0.16em 0", lineHeight: 1.45, textAlign: centered ? "right" : "left" }}>
                {r.label}
              </th>
              <td style={{ color: p.muted, padding: "0.16em 0", lineHeight: 1.45, textAlign: "center" }}>:</td>
              <td style={{ padding: "0.16em 0", lineHeight: 1.45, whiteSpace: "pre-wrap", overflowWrap: "anywhere", opacity: r.ghost ? GHOST_OPACITY : 1 }}>{fmt(r.value)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

const KUNDALI_SIDE = 150 + 16; // chart width + gap

/**
 * Section rows, with the birth chart beside the horoscope section — or below it in centered and
 * narrow layouts. Beside: the label column is sized against the full width so it lines up with
 * the other sections.
 */
function SectionRows({ s, kundali, stack, ...rows }: { s: DocSection; kundali: React.ReactNode; stack?: boolean } & React.ComponentProps<typeof Rows>) {
  if (s.id !== "horoscope" || !kundali) return <Rows {...rows} />;
  if (stack || rows.centered)
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-full">
          <Rows {...rows} />
        </div>
        {kundali}
      </div>
    );
  const pct = parseFloat(rows.labelWidth ?? "36%") / 100;
  return (
    <div className="flex items-start gap-4">
      <div className="min-w-0 flex-1 self-stretch">
        <Rows {...rows} labelWidth={`calc((100% + ${KUNDALI_SIDE}px) * ${pct})`} />
      </div>
      {kundali}
    </div>
  );
}

function ClassicLayout({ t, data, p, fmt, photo, name, sections, kundali, bodyRef, centered }: Ctx & { centered: boolean }) {
  const [first, ...rest] = sections;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ padding: framePad(t) }}>
      <Header data={data} p={p} />
      {centered && (
        <div className="flex flex-col items-center" style={{ marginTop: "0.4em" }}>
          {photo}
          {name && (
            <div style={{ fontFamily: "var(--hfont)", fontSize: "1.55em", color: p.ink, marginTop: "0.25em", lineHeight: 1.2 }}>{name}</div>
          )}
        </div>
      )}
      <div ref={bodyRef} className="min-h-0 flex-1 overflow-hidden">
        {first && (
          <div>
            <SectionTitle title={first.title} p={p} variant="center" />
            {centered || !photo ? (
              <SectionRows s={first} kundali={kundali} rows={first.rows} p={p} fmt={fmt} skipName={centered} centered={centered} labelWidth={centered ? "44%" : undefined} />
            ) : (
              <div className="flex gap-5">
                <div className="min-w-0 flex-1">
                  <Rows rows={first.rows} p={p} fmt={fmt} labelWidth="40%" />
                </div>
                <div className="shrink-0 pt-1">{photo}</div>
              </div>
            )}
          </div>
        )}
        {rest.map((s) => (
          <div key={s.id}>
            <SectionTitle title={s.title} p={p} variant="center" />
            <SectionRows s={s} kundali={kundali} rows={s.rows} p={p} fmt={fmt} centered={centered} labelWidth={centered ? "44%" : undefined} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Header, photo beside the name, then sections balanced across two columns. */
function TwoColLayout({ t, data, p, fmt, photo, name, sections, kundali, bodyRef }: Ctx) {
  const cols: DocSection[][] = [[], []];
  const load = [0, 0];
  for (const s of sections) {
    const i = load[0] <= load[1] ? 0 : 1;
    cols[i].push(s);
    load[i] += s.rows.filter((r) => !isNameRow(r)).length + 2;
  }
  return (
    <div className="absolute inset-0 flex flex-col" style={{ padding: framePad(t) }}>
      <Header data={data} p={p} compact />
      {(photo || name) && (
        <div className="flex items-center justify-center gap-6" style={{ marginTop: "0.6em" }}>
          {photo}
          {name && <div style={{ fontFamily: "var(--hfont)", fontSize: "1.7em", color: p.ink, lineHeight: 1.2, maxWidth: 320 }}>{name}</div>}
        </div>
      )}
      <div ref={bodyRef} className="grid min-h-0 flex-1 grid-cols-2 gap-x-7 overflow-hidden" style={{ alignContent: "start" }}>
        {cols.map((col, i) => (
          <div key={i} className="min-w-0">
            {col.map((s) => (
              <div key={s.id}>
                <SectionTitle title={s.title} p={p} variant="left" />
                <SectionRows s={s} kundali={kundali} stack rows={s.rows} p={p} fmt={fmt} labelWidth="45%" skipName />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarLayout({ data, p, fmt, photo, name, sections, kundali, bodyRef }: Ctx) {
  const contact = sections.find((s) => s.id === "contact");
  const others = sections.filter((s) => s !== contact);
  const light = p.dark ? p.ink : "#fff";
  return (
    <div className="absolute inset-0 flex">
      <aside className="flex shrink-0 flex-col items-center text-center" style={{ width: 250, background: p.accent, color: light, padding: "54px 22px" }}>
        {photo}
        {name && <div style={{ fontFamily: "var(--hfont)", fontSize: "1.55em", lineHeight: 1.25, marginTop: "0.6em" }}>{name}</div>}
        <div style={{ width: 60, height: 2, background: p.accent2, margin: "0.9em auto" }} />
        {contact && (
          <div className="w-full text-left">
            <div style={{ fontFamily: "var(--hfont)", fontSize: "1.15em", marginBottom: "0.4em", opacity: 0.95 }}>{contact.title}</div>
            {contact.rows.map((r) => (
              <div key={r.id} style={{ marginBottom: "0.7em", lineHeight: 1.4 }}>
                <div style={{ fontSize: "0.82em", opacity: 0.75 }}>{r.label}</div>
                <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", opacity: r.ghost ? GHOST_OPACITY + 0.15 : 1 }}>{fmt(r.value)}</div>
              </div>
            ))}
          </div>
        )}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col" style={{ padding: "48px 44px 44px" }}>
        <Header data={data} p={p} compact />
        <div ref={bodyRef} className="min-h-0 flex-1 overflow-hidden">
          {others.map((s) => (
            <div key={s.id}>
              <SectionTitle title={s.title} p={p} variant="left" />
              <SectionRows s={s} kundali={kundali} rows={s.rows} p={p} fmt={fmt} labelWidth="42%" skipName />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BannerLayout({ data, p, fmt, photo, name, sections, kundali, bodyRef }: Ctx) {
  const light = p.dark ? p.bg : "#fff";
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative shrink-0" style={{ background: p.accent, color: light, padding: "34px 60px 30px", minHeight: 200 }}>
        <div className="flex flex-col items-center text-center">
          <HeaderSymbol data={data} color={light} size={40} />
          {data.invocation && <div style={{ fontSize: "0.95em", marginTop: 4, opacity: 0.95 }}>{data.invocation}</div>}
          {data.title && <div style={{ fontFamily: "var(--hfont)", fontSize: "2.1em", lineHeight: 1.25 }}>{data.title}</div>}
          {name && <div style={{ fontSize: "1.2em", marginTop: 2, opacity: 0.95 }}>{name}</div>}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -6, height: 6, background: p.accent2 }} />
      </div>
      <div className="flex min-h-0 flex-1 gap-8" style={{ padding: "18px 56px 44px" }}>
        <div ref={bodyRef} className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {sections.map((s) => (
            <div key={s.id}>
              <SectionTitle title={s.title} p={p} variant="pill" />
              <SectionRows s={s} kundali={kundali} rows={s.rows} p={p} fmt={fmt} labelWidth="38%" skipName />
            </div>
          ))}
        </div>
        {photo && <div className="shrink-0 pt-4">{photo}</div>}
      </div>
    </div>
  );
}

function MinimalLayout({ data, p, fmt, photo, name, sections, kundali, bodyRef }: Ctx) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ padding: "56px 64px 48px" }}>
      <div className="text-center" style={{ color: p.accent, fontSize: "0.92em" }}>
        {data.invocation}
      </div>
      <div className="flex items-end justify-between gap-6" style={{ borderBottom: `2px solid ${p.accent}`, paddingBottom: "0.8em", marginTop: "0.6em" }}>
        <div className="min-w-0">
          <div style={{ color: p.muted, fontSize: "0.95em", letterSpacing: "0.06em" }}>{data.title}</div>
          <div style={{ fontFamily: "var(--hfont)", fontSize: "2.2em", fontWeight: 700, lineHeight: 1.2, color: p.ink }}>{name}</div>
        </div>
        {photo}
      </div>
      <div ref={bodyRef} className="min-h-0 flex-1 overflow-hidden">
        {sections.map((s) => (
          <div key={s.id}>
            <SectionTitle title={s.title} p={p} variant="caps" />
            <SectionRows s={s} kundali={kundali} rows={s.rows} p={p} fmt={fmt} labelWidth="34%" skipName />
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotoBox({ photo, shape, palette: p, layout }: { photo: Photo | null; shape: PhotoShape; palette: Palette; layout: Template["layout"] }) {
  const big = layout === "classic" || layout === "banner";
  const w = layout === "minimal" || layout === "centered" || layout === "royal" || layout === "twocol" ? 116 : big ? 158 : 150;
  const h = shape === "round" ? w : Math.round(w * 1.25);
  const radius = shape === "round" ? "50%" : shape === "arch" ? `${w / 2}px ${w / 2}px 10px 10px` : 6;
  return (
    <div style={{ padding: 4, border: `2px solid ${p.accent2}`, borderRadius: radius, background: p.paper }}>
      <div className="relative overflow-hidden" style={{ width: w, height: h, borderRadius: radius, background: p.line }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: `scale(${photo.zoom})`, objectPosition: `${photo.x}% ${photo.y}%`, transformOrigin: `${photo.x}% ${photo.y}%` }}
          />
        ) : (
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
            <circle cx="50" cy="40" r="17" fill={p.paper} opacity="0.85" />
            <path d="M18 100 C18 72 34 62 50 62 C66 62 82 72 82 100 Z" fill={p.paper} opacity="0.85" />
          </svg>
        )}
      </div>
    </div>
  );
}
