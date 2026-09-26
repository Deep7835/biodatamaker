import type { Kundali } from "@/lib/biodata";

// North Indian chart in a unit square: house 1 is the top diamond, then anticlockwise.
// [planet text anchor, rashi-number anchor] per house.
const HOUSES: [[number, number], [number, number]][] = [
  [[0.5, 0.24], [0.5, 0.43]],
  [[0.25, 0.08], [0.25, 0.165]],
  [[0.08, 0.25], [0.165, 0.25]],
  [[0.25, 0.49], [0.43, 0.5]],
  [[0.08, 0.75], [0.165, 0.75]],
  [[0.25, 0.92], [0.25, 0.835]],
  [[0.5, 0.74], [0.5, 0.57]],
  [[0.75, 0.92], [0.75, 0.835]],
  [[0.92, 0.75], [0.835, 0.75]],
  [[0.75, 0.49], [0.57, 0.5]],
  [[0.92, 0.25], [0.835, 0.25]],
  [[0.75, 0.08], [0.75, 0.165]],
];
const DIAMONDS = new Set([0, 3, 6, 9]);

/** Splits "सू, बु गु" into short lines that fit a house. */
function lines(text: string, perLine: number) {
  const parts = text.split(/[\s,]+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += perLine) out.push(parts.slice(i, i + perLine).join(" "));
  return out.slice(0, 3);
}

export function hasKundali(k: Kundali | undefined): k is Kundali {
  if (!k?.show) return false;
  return k.mode === "image" ? !!k.image : k.lagna > 0 || k.houses.some((h) => h.trim());
}

export function KundaliChart({
  k,
  size,
  color,
  ink,
  title,
  fmt,
}: {
  k: Kundali;
  size: number;
  color: string;
  ink: string;
  title: string;
  fmt: (s: string) => string;
}) {
  return (
    <figure data-kundali className="m-0 flex shrink-0 flex-col items-center" style={{ width: size }}>
      <figcaption style={{ fontFamily: "var(--hfont)", color, fontSize: "0.95em", marginBottom: 4, lineHeight: 1.2 }}>{title}</figcaption>
      {k.mode === "image" && k.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={k.image} alt="" style={{ width: size, height: size, objectFit: "contain", border: `1.5px solid ${color}`, padding: 2 }} />
      ) : (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
          <g fill="none" stroke={color} strokeWidth="0.9">
            <rect x="0.5" y="0.5" width="99" height="99" />
            <path d="M0.5 0.5 L99.5 99.5 M99.5 0.5 L0.5 99.5" />
            <path d="M50 0.5 L99.5 50 L50 99.5 L0.5 50 Z" />
          </g>
          {HOUSES.map(([[px, py], [nx, ny]], i) => {
            const rashi = k.lagna > 0 ? ((k.lagna - 1 + i) % 12) + 1 : 0;
            const planetLines = lines(fmt(k.houses[i] ?? ""), DIAMONDS.has(i) ? 3 : 2);
            const fs = DIAMONDS.has(i) ? 7.2 : 6;
            return (
              <g key={i}>
                {rashi > 0 && (
                  <text x={nx * 100} y={ny * 100} fontSize="5.4" fill={color} textAnchor="middle" dominantBaseline="middle" opacity="0.85">
                    {fmt(String(rashi))}
                  </text>
                )}
                {planetLines.map((line, j) => (
                  <text key={j} x={px * 100} y={py * 100 + (j - (planetLines.length - 1) / 2) * (fs + 1)} fontSize={fs} fill={ink} textAnchor="middle" dominantBaseline="middle">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      )}
    </figure>
  );
}
