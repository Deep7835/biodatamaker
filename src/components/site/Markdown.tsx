import Link from "next/link";
import { Fragment, type ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else
      out.push(
        <Link key={m.index} href={m[3]} className="text-maroon underline decoration-gold/50 underline-offset-2 hover:decoration-maroon">
          {m[2]}
        </Link>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** "## " headings of a markdown body, with the ids <Markdown> gives them (for an "On this page" list). */
export function tocOf(source: string) {
  return source
    .trim()
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l, n) => ({ id: `sec-${n + 1}`, text: l.slice(3).replace(/\*\*|\[|\]\([^)]*\)/g, "") }));
}

/** Tiny renderer for the light markdown used in src/content (headings, lists, tables, **bold**, links, image galleries). */
export function Markdown({ source }: { source: string }) {
  const lines = source.trim().split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let h2 = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const images = [...line.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)];
    if (images.length && !line.replace(/!\[[^\]]*\]\([^)\s]+\)/g, "").trim()) {
      // A line of only images renders as a gallery (template previews, samples).
      blocks.push(
        <div key={i} className={`not-prose my-6 grid gap-4 ${images.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "max-w-xs"}`}>
          {images.map((m) => (
            <figure key={m[2]} className="m-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
              <img src={m[2]} alt={m[1]} width={596} height={842} loading="lazy" decoding="async" className="h-auto w-full rounded shadow-sm ring-1 ring-line" />
              <figcaption className="mt-1.5 text-xs leading-snug text-soft">{m[1]}</figcaption>
            </figure>
          ))}
        </div>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## "))
      blocks.push(
        <h2 key={i} id={`sec-${++h2}`}>
          {inline(line.slice(3))}
        </h2>,
      );
    else if (line.startsWith("### ")) blocks.push(<h3 key={i}>{inline(line.slice(4))}</h3>);
    else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|[\s|:-]+\|$/.test(lines[i])) rows.push(lines[i].slice(1, -1).split("|").map((c) => c.trim()));
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={i} className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {head.map((c, j) => (
                  <th key={j}>{inline(c)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, k) => (
                <tr key={k}>
                  {r.map((c, j) => (
                    <td key={j}>{inline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    } else if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) items.push(lines[i++].replace(/^(- |\d+\. )/, ""));
      const Tag = ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={i}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </Tag>,
      );
      continue;
    } else blocks.push(<p key={i}>{inline(line)}</p>);
    i++;
  }
  return <Fragment>{blocks}</Fragment>;
}
