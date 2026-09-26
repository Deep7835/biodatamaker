#!/usr/bin/env node
/**
 * Generates SEO/static assets from the built site (run `npm run assets`):
 *   public/templates/<lang>/<keyword>-<template>[-sm].webp   template previews (Google Images, gallery thumbnails)
 *   public/hero/<lang>-<slug>.webp            hero sample per content page (fast LCP, no JS needed)
 *   public/samples/<keyword>[-boy].pdf|.docx   sample biodata formats for "format pdf / word download" searches
 *   public/icons/icon-192.png, icon-512.png   PWA icons
 *
 * Needs Google Chrome (set CHROME_PATH if it isn't in the default macOS location) and a fresh `next build`.
 */
import { spawn } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, mkdtempSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");
const PUB = join(ROOT, "public");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const LANGS = ["en", "hi", "mr"];
const SAMPLE_NAMES = { en: "marriage-biodata-format", hi: "hindi-biodata-format", mr: "marathi-biodata-format" };
const A4 = { w: 794, h: 1123 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!existsSync(join(OUT, "render", "index.html"))) {
  console.error("Run `next build` first (out/render/ is missing).");
  process.exit(1);
}

// --- tiny static server for ./out ---
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon" };
const server = createServer((req, res) => {
  let p = join(OUT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://127.0.0.1:${server.address().port}`;

// --- Chrome over the DevTools protocol ---
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "bs-assets-"))}`, "about:blank"], { stdio: "ignore" });
let ws;
for (let i = 0; i < 60 && !ws; i++) {
  await sleep(250);
  try {
    const page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page");
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {}
}
if (!ws) throw new Error("Could not start Chrome. Set CHROME_PATH.");
await new Promise((r) => (ws.onopen = r));
let seq = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d);
    pending.delete(d.id);
  }
};
const send = (method, params = {}) => new Promise((r) => (pending.set(++seq, r), ws.send(JSON.stringify({ id: seq, method, params }))));
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
const waitFor = async (expr, ms = 15000) => {
  for (const t0 = Date.now(); Date.now() - t0 < ms; await sleep(100)) if (await evaluate(expr)) return;
  throw new Error(`timeout waiting for ${expr}`);
};
const open = async (url) => {
  await send("Page.navigate", { url });
  await sleep(300);
  await waitFor("window.__renderReady === true");
  await sleep(250);
};

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: A4.w, height: A4.h, deviceScaleFactor: 0.75, mobile: false });

// 1) Template previews
await send("Page.navigate", { url: `${BASE}/render/?t=kesari-classic&l=en` });
await waitFor("window.__renderReady === true");
const ids = JSON.parse(await evaluate(`fetch('/templates/').then(r => r.text()).then(h => JSON.stringify([...new Set([...h.matchAll(/[?]t=([a-z0-9-]+)/g)].map(m => m[1]))]))`));
if (!ids.length) throw new Error("No template ids found on /templates/");
let n = 0;
for (const lang of LANGS) {
  mkdirSync(join(PUB, "templates", lang), { recursive: true });
  for (const id of ids) {
    await open(`${BASE}/render/?t=${id}&l=${lang}`);
    const shot = await send("Page.captureScreenshot", { format: "webp", quality: 82, clip: { x: 0, y: 0, width: A4.w, height: A4.h, scale: 1 } });
    writeFileSync(join(PUB, "templates", lang, `${SAMPLE_NAMES[lang]}-${id}.webp`), Buffer.from(shot.result.data, "base64"));
    // Small variant for phone grids (srcset 302w).
    const small = await send("Page.captureScreenshot", { format: "webp", quality: 80, clip: { x: 0, y: 0, width: A4.w, height: A4.h, scale: 0.38 / 0.75 } });
    writeFileSync(join(PUB, "templates", lang, `${SAMPLE_NAMES[lang]}-${id}-sm.webp`), Buffer.from(small.result.data, "base64"));
    n++;
  }
}
console.log(`✓ ${n} template previews (+ small variants)`);

// 1b) Hero sample for each content page, matching its gender / religion / photo settings.
mkdirSync(join(PUB, "hero"), { recursive: true });
const heroes = await (await fetch(`${BASE}/hero-index.json`)).json();
for (const h of heroes) {
  await open(`${BASE}/render/?t=${h.t}&l=${h.lang}&g=${h.g}&r=${h.r}&np=${h.np}`);
  const shot = await send("Page.captureScreenshot", { format: "webp", quality: 82, clip: { x: 0, y: 0, width: A4.w, height: A4.h, scale: 1 } });
  writeFileSync(join(PUB, "hero", `${h.lang}-${h.slug || "home"}.webp`), Buffer.from(shot.result.data, "base64"));
}
console.log(`✓ ${heroes.length} hero samples`);

// 2) Sample PDF / Word per language
await send("Emulation.setDeviceMetricsOverride", { width: A4.w, height: A4.h, deviceScaleFactor: 1, mobile: false });
mkdirSync(join(PUB, "samples"), { recursive: true });
for (const lang of LANGS) for (const [gender, tpl, suffix] of [["girl", "kesari-classic", ""], ["boy", "royal-blue-classic", "-boy"]]) {
  for (const kind of ["pdf", "docx"]) {
    await open(`${BASE}/render/?t=${tpl}&l=${lang}&g=${gender}`);
    const b64 = await evaluate(`(async () => {
      let href;
      HTMLAnchorElement.prototype.click = function () { if (this.download) href = this.href; };
      const od = EventTarget.prototype.dispatchEvent;
      EventTarget.prototype.dispatchEvent = function (e) { if (this instanceof HTMLAnchorElement && this.download && e.type === 'click') { href = this.href; return true; } return od.call(this, e); };
      await window.__exportSample('${kind}');
      for (let i = 0; i < 100 && !href; i++) await new Promise(r => setTimeout(r, 100));
      const buf = new Uint8Array(await (await fetch(href)).arrayBuffer());
      let s = ''; for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode(...buf.subarray(i, i + 32768));
      return btoa(s);
    })()`);
    const file = join(PUB, "samples", `${SAMPLE_NAMES[lang]}${suffix}.${kind}`);
    writeFileSync(file, Buffer.from(b64, "base64"));
    console.log(`✓ ${file.replace(ROOT + "/", "")}`);
  }
}

// 3) PWA icons from the SVG app icon
mkdirSync(join(PUB, "icons"), { recursive: true });
for (const size of [192, 512]) {
  await send("Emulation.setDeviceMetricsOverride", { width: size, height: size, deviceScaleFactor: 1, mobile: false });
  const html = `<body style="margin:0;background:#FBF8F3;display:grid;place-items:center;height:100vh"><img src="${BASE}/icon.svg" style="width:82%;height:82%"></body>`;
  await send("Page.navigate", { url: `data:text/html,${encodeURIComponent(html)}` });
  await sleep(600);
  const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: size, height: size, scale: 1 } });
  writeFileSync(join(PUB, "icons", `icon-${size}.png`), Buffer.from(shot.result.data, "base64"));
}
console.log("✓ PWA icons");

ws.close();
chrome.kill();
server.close();
