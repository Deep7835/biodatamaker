import type { SymbolId } from "@/lib/biodata";
import type { Frame } from "@/lib/templates";

const W = 794;
const H = 1123;

function Flourish({ color, color2 }: { color: string; color2: string }) {
  // Drawn for the top-left corner; other corners reuse it via transforms.
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      <path d="M8 120 V8 H120" strokeWidth="2" />
      <path d="M16 96 V16 H96" strokeWidth="1" stroke={color2} />
      <path d="M16 16 C40 20 52 34 56 56 C34 52 20 40 16 16 Z" fill={color2} fillOpacity="0.25" strokeWidth="1.2" />
      <path d="M56 56 C66 44 80 42 92 48" strokeWidth="1.2" />
      <path d="M56 56 C44 66 42 80 48 92" strokeWidth="1.2" />
      <path d="M92 48 c6 -8 16 -8 20 -2 c-6 6 -14 7 -20 2 Z" fill={color} fillOpacity="0.35" strokeWidth="1" />
      <path d="M48 92 c-8 6 -8 16 -2 20 c6 -6 7 -14 2 -20 Z" fill={color} fillOpacity="0.35" strokeWidth="1" />
      <path d="M72 44 c2 -8 10 -12 16 -10 c-2 8 -10 12 -16 10 Z" fill={color2} fillOpacity="0.4" strokeWidth="0.8" />
      <path d="M44 72 c-8 2 -12 10 -10 16 c8 -2 12 -10 10 -16 Z" fill={color2} fillOpacity="0.4" strokeWidth="0.8" />
      <circle cx="30" cy="30" r="3" fill={color} stroke="none" />
      <circle cx="120" cy="8" r="3" fill={color} stroke="none" />
      <circle cx="8" cy="120" r="3" fill={color} stroke="none" />
    </g>
  );
}

function Sprig({ color, color2 }: { color: string; color2: string }) {
  const leaves = [0, 1, 2, 3, 4];
  return (
    <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M14 150 C18 90 50 44 150 14" />
      {leaves.map((i) => {
        const t = 30 + i * 24;
        const x = 14 + t * 0.55 - i * 2;
        const y = 150 - t * 0.9 + i * 6;
        return (
          <g key={i}>
            <path d={`M${x} ${y} c-10 -4 -16 -14 -14 -22 c8 2 14 12 14 22 Z`} fill={color2} fillOpacity="0.45" />
            <path d={`M${x + 4} ${y - 2} c10 4 20 2 24 -6 c-8 -4 -18 0 -24 6 Z`} fill={color} fillOpacity="0.25" />
          </g>
        );
      })}
      <circle cx="150" cy="14" r="4" fill={color2} stroke="none" />
      <circle cx="14" cy="150" r="4" fill={color2} stroke="none" />
    </g>
  );
}

export function Mandala({ size, color, opacity = 0.14, x, y }: { size: number; color: string; opacity?: number; x?: number; y?: number }) {
  const r = size / 2;
  const petals = 16;
  return (
    <svg x={x} y={y} width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} aria-hidden>
      <g fill="none" stroke={color} strokeWidth={size / 260} opacity={opacity}>
        {[0.98, 0.9, 0.62, 0.34, 0.14].map((k) => (
          <circle key={k} r={r * k} />
        ))}
        {Array.from({ length: petals }).map((_, i) => (
          <path
            key={`p${i}`}
            transform={`rotate(${(360 / petals) * i})`}
            d={`M0 ${-r * 0.34} C${r * 0.12} ${-r * 0.48} ${r * 0.1} ${-r * 0.74} 0 ${-r * 0.9} C${-r * 0.1} ${-r * 0.74} ${-r * 0.12} ${-r * 0.48} 0 ${-r * 0.34} Z`}
          />
        ))}
        {Array.from({ length: petals }).map((_, i) => (
          <path
            key={`q${i}`}
            transform={`rotate(${(360 / petals) * i + 360 / petals / 2})`}
            d={`M0 ${-r * 0.14} C${r * 0.08} ${-r * 0.22} ${r * 0.08} ${-r * 0.44} 0 ${-r * 0.6} C${-r * 0.08} ${-r * 0.44} ${-r * 0.08} ${-r * 0.22} 0 ${-r * 0.14} Z`}
          />
        ))}
        {Array.from({ length: 48 }).map((_, i) => (
          <circle key={`d${i}`} transform={`rotate(${7.5 * i})`} cy={-r * 0.94} r={size / 200} fill={color} />
        ))}
      </g>
    </svg>
  );
}


const LEAF = "#5E7A2B";

/** Genda-phool (marigold) garland with mango leaves, hung across the top edge. */
function Toran({ accent, accent2 }: { accent: string; accent2: string }) {
  const y = 34;
  const hooks = Array.from({ length: 10 }, (_, i) => 40 + (i * (W - 80)) / 9);
  const flower = (cx: number, cy: number, r: number, key: string) => (
    <g key={key}>
      {Array.from({ length: 12 }).map((_, k) => (
        <circle key={k} cx={cx + Math.cos((k * Math.PI) / 6) * r * 0.62} cy={cy + Math.sin((k * Math.PI) / 6) * r * 0.62} r={r * 0.42} fill={accent2} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.5} fill={accent} />
      <circle cx={cx} cy={cy} r={r * 0.18} fill={accent2} />
    </g>
  );
  const leaf = (x: number, yy: number, rot: number, key: string) => (
    <path key={key} transform={`translate(${x} ${yy}) rotate(${rot})`} d="M0 0 C6 6 6 20 0 30 C-6 20 -6 6 0 0 Z" fill={LEAF} opacity="0.85" />
  );
  return (
    <g>
      <path d={`M24 ${y} H${W - 24}`} stroke={accent} strokeWidth="2" />
      {hooks.slice(0, -1).map((x, i) => {
        const x2 = hooks[i + 1];
        const mid = (x + x2) / 2;
        return (
          <g key={i}>
            <path d={`M${x} ${y} Q${mid} ${y + 46} ${x2} ${y}`} fill="none" stroke={accent} strokeWidth="1.4" />
            {leaf(mid - 16, y + 18, 20, "l1")}
            {leaf(mid, y + 24, 0, "l2")}
            {leaf(mid + 16, y + 18, -20, "l3")}
            {[0.25, 0.5, 0.75].map((t, k) => {
              const bx = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * mid + t * t * x2;
              const by = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + 46) + t * t * y;
              return flower(bx, by, 7, `f${k}`);
            })}
          </g>
        );
      })}
      {hooks.map((x, i) => (
        <g key={`h${i}`}>
          <path d={`M${x} ${y} V${y + 58}`} stroke={accent} strokeWidth="1" />
          {flower(x, y, 9, "a")}
          {flower(x, y + 22, 8, "b")}
          {flower(x, y + 42, 7, "c")}
          <path d={`M${x} ${y + 50} l-4 10 h8 z`} fill={accent} />
        </g>
      ))}
    </g>
  );
}

const PAISLEY = "M0 -12 C10 -12 14 -2 9 7 C4 14 -7 14 -9 5 C-11 -4 -4 -7 0 -4 C3 -2 2 2 -1 2";

/** Band of alternating paisley (keri) motifs around the page. */
function PaisleyBand({ accent, accent2 }: { accent: string; accent2: string }) {
  const inset = 31;
  const step = 34;
  const motif = (x: number, y: number, rot: number, k: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot + (k % 2 ? 180 : 0)}) scale(0.95)`}>
      <path d={PAISLEY} fill={k % 2 ? accent2 : accent} fillOpacity="0.28" stroke={k % 2 ? accent2 : accent} strokeWidth="1.1" />
      <circle cx="1" cy="4" r="1.6" fill={accent} />
    </g>
  );
  const nx = Math.floor((W - 2 * inset) / step);
  const ny = Math.floor((H - 2 * inset) / step);
  const ox = (W - nx * step) / 2;
  const oy = (H - ny * step) / 2;
  return (
    <g>
      <rect x="16" y="16" width={W - 32} height={H - 32} fill="none" stroke={accent} strokeWidth="1.6" />
      <rect x="46" y="46" width={W - 92} height={H - 92} fill="none" stroke={accent} strokeWidth="1" />
      {Array.from({ length: nx + 1 }).map((_, i) => motif(ox + i * step, inset, 0, i))}
      {Array.from({ length: nx + 1 }).map((_, i) => motif(ox + i * step, H - inset, 180, i))}
      {Array.from({ length: ny - 1 }).map((_, i) => motif(inset, oy + (i + 1) * step, -90, i))}
      {Array.from({ length: ny - 1 }).map((_, i) => motif(W - inset, oy + (i + 1) * step, 90, i))}
    </g>
  );
}

/** Scalloped (multifoil) arch path along a pointed arch, like a Rajasthani jharokha window. */
function scallopArch(inset: number, spring: number, apex: number) {
  const L = inset;
  const R = W - inset;
  const pts: [number, number][] = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([(1 - t) * (1 - t) * L + 2 * (1 - t) * t * L + t * t * (W / 2), (1 - t) * (1 - t) * spring + 2 * (1 - t) * t * (apex + 30) + t * t * apex]);
  }
  for (let i = n - 1; i >= 0; i--) pts.push([W - pts[i][0], pts[i][1]]);
  let d = `M${L} ${H - inset} V${spring}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const r = Math.hypot(x2 - x1, y2 - y1) * 0.62;
    d += ` A${r} ${r} 0 0 1 ${x2} ${y2}`;
  }
  return `${d} L${R} ${H - inset} Z`;
}

function Jharokha({ accent, accent2, line }: { accent: string; accent2: string; line: string }) {
  return (
    <g fill="none">
      <path d={scallopArch(24, 250, 30)} stroke={accent} strokeWidth="2.2" />
      <path d={scallopArch(34, 256, 44)} stroke={accent2} strokeWidth="1" />
      {[24, W - 24].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="240" width="18" height="14" fill={accent} />
          <rect x={x - 6} y="254" width="12" height="4" fill={accent2} />
          <path d={`M${x} 262 V${H - 60}`} stroke={line} strokeWidth="1" strokeDasharray="2 5" />
        </g>
      ))}
      <g transform={`translate(${W / 2} 22)`} fill={accent}>
        <circle r="6" />
        <path d="M-8 12 Q0 2 8 12 Z" />
        <path d="M0 -14 L3 -6 H-3 Z" />
      </g>
    </g>
  );
}

function RangoliCorner({ accent, accent2 }: { accent: string; accent2: string }) {
  const petals = (n: number, r0: number, r1: number, w: number, fill: string, op: number, off = 0) =>
    Array.from({ length: n }).map((_, i) => (
      <path
        key={`${r0}-${i}`}
        transform={`rotate(${(360 / n) * i + off})`}
        d={`M0 ${-r0} C${w} ${-(r0 + r1) / 2} ${w} ${-r1 + 6} 0 ${-r1} C${-w} ${-r1 + 6} ${-w} ${-(r0 + r1) / 2} 0 ${-r0} Z`}
        fill={fill}
        fillOpacity={op}
        stroke={fill}
        strokeWidth="0.8"
      />
    ));
  return (
    <g>
      <circle r="16" fill={accent} fillOpacity="0.8" />
      <circle r="8" fill={accent2} />
      {petals(8, 18, 46, 12, accent2, 0.55)}
      {petals(16, 48, 78, 8, accent, 0.35, 11.25)}
      <circle r="84" fill="none" stroke={accent2} strokeWidth="1.2" />
      {Array.from({ length: 32 }).map((_, i) => (
        <circle key={i} transform={`rotate(${i * 11.25})`} cy="-92" r="2.4" fill={i % 2 ? accent : accent2} />
      ))}
      {petals(32, 98, 112, 4, accent2, 0.5)}
    </g>
  );
}

export function FrameArt({ frame, accent, accent2, line }: { frame: Frame; accent: string; accent2: string; line: string }) {
  if (frame === "none") return null;
  const corners = (node: React.ReactNode, size: number) =>
    [
      "",
      `translate(${W} 0) scale(-1 1)`,
      `translate(0 ${H}) scale(1 -1)`,
      `translate(${W} ${H}) scale(-1 -1)`,
    ].map((t, i) => (
      <g key={i} transform={t}>
        <g transform={`translate(10 10) scale(${size / 150})`}>{node}</g>
      </g>
    ));
  return (
    <svg className="pointer-events-none absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {frame === "double" && (
        <g fill="none">
          <rect x="18" y="18" width={W - 36} height={H - 36} stroke={accent} strokeWidth="2.5" />
          <rect x="26" y="26" width={W - 52} height={H - 52} stroke={accent2} strokeWidth="1" />
          {[
            [18, 18],
            [W - 18, 18],
            [18, H - 18],
            [W - 18, H - 18],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 6} y={y - 6} width="12" height="12" fill={accent} transform={`rotate(45 ${x} ${y})`} />
          ))}
        </g>
      )}
      {frame === "ornate" && (
        <>
          <rect x="30" y="30" width={W - 60} height={H - 60} fill="none" stroke={line} strokeWidth="1" />
          {corners(<Flourish color={accent} color2={accent2} />, 150)}
          <g transform={`translate(${W / 2} 22)`} fill={accent}>
            <path d="M-60 0 H-12 M12 0 H60" stroke={accent} strokeWidth="1.5" />
            <rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" />
          </g>
          <g transform={`translate(${W / 2} ${H - 22})`} fill={accent}>
            <path d="M-60 0 H-12 M12 0 H60" stroke={accent} strokeWidth="1.5" />
            <rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" />
          </g>
        </>
      )}
      {frame === "corners" && (
        <>
          <rect x="22" y="22" width={W - 44} height={H - 44} fill="none" stroke={line} strokeWidth="1.2" />
          {corners(<Sprig color={accent} color2={accent2} />, 150)}
        </>
      )}
      {frame === "mandala" && (
        <>
          <rect x="20" y="20" width={W - 40} height={H - 40} fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="26" y="26" width={W - 52} height={H - 52} fill="none" stroke={line} strokeWidth="0.8" />
          <Mandala x={-170} y={-170} size={340} color={accent} opacity={0.2} />
          <Mandala x={W - 170} y={H - 170} size={340} color={accent} opacity={0.2} />
        </>
      )}
      {frame === "toran" && (
        <>
          <rect x="18" y="18" width={W - 36} height={H - 36} fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="24" y="24" width={W - 48} height={H - 48} fill="none" stroke={line} strokeWidth="0.8" />
          <Toran accent={accent} accent2={accent2} />
          <g transform={`translate(${W / 2} ${H - 18})`} fill={accent}>
            <path d="M-80 0 H-14 M14 0 H80" stroke={accent} strokeWidth="1.5" />
            <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" />
          </g>
        </>
      )}
      {frame === "paisley" && <PaisleyBand accent={accent} accent2={accent2} />}
      {frame === "jharokha" && <Jharokha accent={accent} accent2={accent2} line={line} />}
      {frame === "rangoli" && (
        <>
          <rect x="20" y="20" width={W - 40} height={H - 40} fill="none" stroke={accent} strokeWidth="1.4" />
          {[
            [20, 20],
            [W - 20, 20],
            [20, H - 20],
            [W - 20, H - 20],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(0.95)`}>
              <RangoliCorner accent={accent} accent2={accent2} />
            </g>
          ))}
        </>
      )}
      {frame === "arch" && (
        <g fill="none">
          <path
            d={`M26 ${H - 26} V210 C26 120 110 96 200 88 C290 80 340 60 ${W / 2} 26 C${W - 340} 60 ${W - 290} 80 ${W - 200} 88 C${W - 110} 96 ${W - 26} 120 ${W - 26} 210 V${H - 26} Z`}
            stroke={accent}
            strokeWidth="2"
          />
          <path
            d={`M36 ${H - 36} V214 C36 130 116 106 202 98 C290 90 342 72 ${W / 2} 40 C${W - 342} 72 ${W - 290} 90 ${W - 202} 98 C${W - 116} 106 ${W - 36} 130 ${W - 36} 214 V${H - 36} Z`}
            stroke={accent2}
            strokeWidth="1"
          />
          <circle cx={W / 2} cy="26" r="5" fill={accent} />
        </g>
      )}
    </svg>
  );
}

export function SymbolIcon({ id, color, size = 46 }: { id: SymbolId; color: string; size?: number }) {
  if (id === "none" || id === "custom") return null;
  const common = { width: size, height: size, viewBox: "0 0 100 100", "aria-hidden": true } as const;
  const stroke = { fill: "none", stroke: color, strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (id) {
    case "om":
      return (
        <span style={{ fontSize: size * 0.95, lineHeight: 1, color, fontFamily: "var(--font-rozha), serif" }} aria-hidden>
          ॐ
        </span>
      );
    case "ganesh":
      return (
        <svg {...common}>
          <g {...stroke}>
            <path d="M40 24 L50 8 L60 24" />
            <path d="M36 26 H64" />
            <path d="M37 30 C37 22 63 22 63 30 C66 40 60 50 50 51 C40 50 34 40 37 30 Z" />
            <path d="M38 32 C24 22 10 36 16 52 C20 60 30 60 38 48" />
            <path d="M62 32 C76 22 90 36 84 52 C80 60 70 60 62 48" />
            <path d="M50 50 C50 62 44 70 50 78 C55 84 64 80 62 72" strokeWidth="5" />
            <path d="M44 38 q2 -2 4 0 M52 38 q2 -2 4 0" strokeWidth="2.5" />
            <path d="M50 27 V33" strokeWidth="2.5" />
            <path d="M42 50 L38 60 M58 50 L62 60" strokeWidth="2.5" />
            <path d="M26 88 C36 82 64 82 74 88" />
          </g>
        </svg>
      );
    case "swastik":
    case "jain":
      return (
        <svg {...common}>
          <g {...stroke} strokeWidth={5}>
            <path d="M50 22 V78 M22 50 H78" />
            <path d="M50 22 H72 M78 50 V72 M50 78 H28 M22 50 V28" />
          </g>
          <g fill={color}>
            {[
              [36, 36],
              [64, 36],
              [36, 64],
              [64, 64],
            ].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="4" />
            ))}
          </g>
          {id === "jain" && (
            <g fill={color}>
              <circle cx="38" cy="10" r="3" />
              <circle cx="50" cy="8" r="3" />
              <circle cx="62" cy="10" r="3" />
            </g>
          )}
        </svg>
      );
    case "kalash":
      return (
        <svg {...common}>
          <g {...stroke}>
            <path d="M34 50 C18 58 20 86 36 90 H64 C80 86 82 58 66 50 Z" />
            <path d="M38 50 V44 H62 V50" />
            <path d="M34 44 H66" />
            <path d="M42 44 C40 30 60 30 58 44" />
            <path d="M50 30 C44 20 36 18 30 22 C36 26 44 28 50 30 C56 20 64 18 70 22 C64 26 56 28 50 30" />
            <path d="M30 68 H70" strokeWidth="2" />
            <circle cx="50" cy="70" r="5" strokeWidth="2.5" />
          </g>
        </svg>
      );
    case "lotus":
      return (
        <svg {...common}>
          <g {...stroke} strokeWidth={3}>
            <path d="M50 20 C62 36 62 58 50 74 C38 58 38 36 50 20 Z" />
            <path d="M50 74 C40 60 28 48 16 46 C18 62 32 74 50 74 Z" />
            <path d="M50 74 C60 60 72 48 84 46 C82 62 68 74 50 74 Z" />
            <path d="M50 74 C34 70 20 66 10 70 C22 80 38 80 50 74" />
            <path d="M50 74 C66 70 80 66 90 70 C78 80 62 80 50 74" />
            <path d="M30 86 H70" />
          </g>
        </svg>
      );
    case "cross":
      return (
        <svg {...common}>
          <path d="M44 12 H56 V36 H76 V48 H56 V90 H44 V48 H24 V36 H44 Z" fill="none" stroke={color} strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      );
    case "crescent":
      return (
        <svg {...common}>
          <path d="M60 16 A36 36 0 1 0 60 84 A28 28 0 1 1 60 16 Z" fill={color} />
          <path d="M72 38 l3.5 7.5 8 1 -6 5.5 1.6 8 -7.1 -4 -7.1 4 1.6 -8 -6 -5.5 8 -1 Z" fill={color} />
        </svg>
      );
    case "khanda":
      return (
        <svg {...common}>
          <g {...stroke}>
            <circle cx="50" cy="56" r="18" />
            <path d="M50 10 L55 22 V80 H45 V22 Z" strokeWidth="3" />
            <path d="M28 30 C8 50 16 80 40 88" />
            <path d="M72 30 C92 50 84 80 60 88" />
          </g>
        </svg>
      );
    case "chakra":
      return (
        <svg {...common}>
          <g {...stroke} strokeWidth={3}>
            <circle cx="50" cy="50" r="36" />
            <circle cx="50" cy="50" r="8" />
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={i} d="M50 42 V14" transform={`rotate(${i * 45} 50 50)`} />
            ))}
          </g>
        </svg>
      );
  }
}

export function Divider({ color, width = 220 }: { color: string; width?: number }) {
  const h = width / 2;
  return (
    <svg width={width} height="14" viewBox={`0 0 ${width} 14`} aria-hidden>
      <path d={`M0 7 H${h - 16} M${h + 16} 7 H${width}`} stroke={color} strokeWidth="1.2" />
      <path d={`M${h - 10} 7 L${h} 1 L${h + 10} 7 L${h} 13 Z`} fill={color} />
      <circle cx={h - 16} cy="7" r="2" fill={color} />
      <circle cx={h + 16} cy="7" r="2" fill={color} />
    </svg>
  );
}
