"use client";

import type { Biodata } from "./biodata";
import { toDevanagariDigits } from "./i18n";

const A4 = { w: 794, h: 1123 };

function fileBase(data: Biodata) {
  const name = data.sections.flatMap((s) => s.rows).find((r) => r.id.endsWith("-name"))?.value.trim();
  const safe = (name || "biodata").replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "-").slice(0, 60);
  return `${safe}-biodata`;
}

async function renderJpeg(node: HTMLElement, pixelRatio = 2.5) {
  const { toJpeg } = await import("html-to-image");
  // Use the template's own paper colour; a fixed white would wipe out dark designs.
  const backgroundColor = getComputedStyle(node).backgroundColor || "#ffffff";
  const opts = { width: A4.w, height: A4.h, pixelRatio, quality: 0.93, backgroundColor, style: { transform: "none" } };
  // First pass warms the font/image cache; Safari often drops web fonts on the very first capture.
  await toJpeg(node, { ...opts, pixelRatio: 0.3 });
  return toJpeg(node, opts);
}

function download(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function exportJpg(node: HTMLElement, data: Biodata) {
  download(await renderJpeg(node), `${fileBase(data)}.jpg`);
}

export async function exportPdf(node: HTMLElement, data: Biodata) {
  const [img, { jsPDF }] = await Promise.all([renderJpeg(node), import("jspdf")]);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  pdf.addImage(img, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  pdf.setProperties({ title: `${fileBase(data)}`, creator: "BiodataSathi" });
  pdf.save(`${fileBase(data)}.pdf`);
}

export async function shareImage(node: HTMLElement, data: Biodata) {
  const url = await renderJpeg(node);
  const blob = await (await fetch(url)).blob();
  const file = new File([blob], `${fileBase(data)}.jpg`, { type: "image/jpeg" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: data.title });
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
  }
  // Desktop fallback: save the image, then open WhatsApp so the user can attach it.
  download(url, file.name);
  window.open(`https://wa.me/?text=${encodeURIComponent(data.title)}`, "_blank", "noopener");
}

function imageSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 1, h: img.naturalHeight || 1 });
    img.onerror = () => resolve({ w: 1, h: 1 });
    img.src = src;
  });
}

function dataUrlToBytes(dataUrl: string) {
  const bin = atob(dataUrl.split(",")[1]);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Editable Word file: same content as the design, laid out as simple tables so it stays easy to edit. */
/** Rasterise the on-page birth chart SVG so it can go into the Word file. */
async function kundaliPng(node: HTMLElement | null | undefined): Promise<string | null> {
  const svg = node?.querySelector("[data-kundali] svg");
  if (!svg) return null;
  const xml = new XMLSerializer().serializeToString(svg).replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  await img.decode().catch(() => undefined);
  const c = document.createElement("canvas");
  c.width = c.height = 600;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 600, 600);
  g.drawImage(img, 0, 0, 600, 600);
  return c.toDataURL("image/png");
}

export async function exportDocx(data: Biodata, accent: string, node?: HTMLElement | null) {
  const d = await import("docx");
  const color = accent.replace("#", "");
  const font = data.lang === "en" ? "Cambria" : "Nirmala UI";
  const fmt = (s: string) => (data.devanagariDigits ? toDevanagariDigits(s) : s);
  const none = { style: d.BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
  const children: (InstanceType<typeof d.Paragraph> | InstanceType<typeof d.Table>)[] = [];

  if (data.symbol === "custom" && data.symbolImage) {
    const { w, h } = await imageSize(data.symbolImage);
    const height = Math.min(90, data.symbolSize ?? 72);
    children.push(
      new d.Paragraph({
        alignment: d.AlignmentType.CENTER,
        children: [
          new d.ImageRun({
            type: data.symbolImage.startsWith("data:image/png") ? "png" : "jpg",
            data: dataUrlToBytes(data.symbolImage),
            transformation: { width: Math.round((height * w) / h), height },
          }),
        ],
      }),
    );
  }
  if (data.invocation)
    children.push(new d.Paragraph({ alignment: d.AlignmentType.CENTER, children: [new d.TextRun({ text: data.invocation, color, font, size: 24 })] }));
  if (data.title)
    children.push(
      new d.Paragraph({ alignment: d.AlignmentType.CENTER, spacing: { after: 200 }, children: [new d.TextRun({ text: data.title, bold: true, color, font, size: 40 })] }),
    );
  if (data.photo?.src.startsWith("data:image/jpeg"))
    children.push(
      new d.Paragraph({
        alignment: d.AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new d.ImageRun({ type: "jpg", data: dataUrlToBytes(data.photo.src), transformation: { width: 130, height: 160 } })],
      }),
    );

  const kundali = data.kundali?.show ? (data.kundali.mode === "image" ? (data.kundali.image ?? null) : await kundaliPng(node)) : null;

  for (const s of data.sections) {
    const rows = s.rows.filter((r) => r.value.trim());
    if (s.hidden || rows.length === 0) continue;
    children.push(
      new d.Paragraph({
        spacing: { before: 240, after: 80 },
        border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color, space: 2 } },
        children: [new d.TextRun({ text: s.title, bold: true, color, font, size: 28 })],
      }),
    );
    children.push(
      new d.Table({
        width: { size: 100, type: d.WidthType.PERCENTAGE },
        borders: noBorders,
        rows: rows.map(
          (r) =>
            new d.TableRow({
              children: [
                new d.TableCell({ width: { size: 38, type: d.WidthType.PERCENTAGE }, borders: noBorders, children: [new d.Paragraph({ children: [new d.TextRun({ text: r.label, bold: true, font, size: 23 })] })] }),
                new d.TableCell({ width: { size: 4, type: d.WidthType.PERCENTAGE }, borders: noBorders, children: [new d.Paragraph({ children: [new d.TextRun({ text: ":", font, size: 23 })] })] }),
                new d.TableCell({ width: { size: 58, type: d.WidthType.PERCENTAGE }, borders: noBorders, children: [new d.Paragraph({ children: [new d.TextRun({ text: fmt(r.value), font, size: 23 })] })] }),
              ],
            }),
        ),
      }),
    );
    if (s.id === "horoscope" && kundali)
      children.push(
        new d.Paragraph({
          alignment: d.AlignmentType.CENTER,
          spacing: { before: 120 },
          children: [new d.ImageRun({ type: kundali.startsWith("data:image/png") ? "png" : "jpg", data: dataUrlToBytes(kundali), transformation: { width: 170, height: 170 } })],
        }),
      );
  }

  const doc = new d.Document({
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } }, children }],
  });
  const blob = await d.Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  download(url, `${fileBase(data)}.docx`);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Downscale an uploaded image so it fits comfortably in localStorage (~60–120 KB).
 * `keepAlpha` keeps PNG/WebP transparency (for deity cut-outs and logos).
 */
export function resizePhoto(file: File, max = 700, keepAlpha = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      const alpha = keepAlpha && /png|webp|gif|svg/.test(file.type);
      resolve(alpha ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", 0.86));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
