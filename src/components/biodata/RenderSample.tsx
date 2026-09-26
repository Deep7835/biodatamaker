"use client";

import { useEffect, useRef, useState } from "react";
import { createBiodata, RELIGIONS, type Biodata } from "@/lib/biodata";
import { exportDocx, exportPdf } from "@/lib/export";
import { LANGS, type Lang } from "@/lib/i18n";
import { getTemplate } from "@/lib/templates";
import { BiodataDocument } from "./BiodataDocument";

/** Full-size sample biodata for the asset generator: /render/?t=<template>&l=<lang>. */
export function RenderSample() {
  const [data, setData] = useState<(Biodata & { noPhoto: boolean }) | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const l = q.get("l");
    const lang: Lang = LANGS.includes(l as Lang) ? (l as Lang) : "mr";
    const gender = q.get("g") === "boy" ? "boy" : "girl";
    const religion = RELIGIONS.find((r) => r === q.get("r"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads query params after mount (static export)
    setData({ ...createBiodata(lang, { sample: true, templateId: getTemplate(q.get("t") ?? undefined).id, gender, religion }), noPhoto: q.get("np") === "1" });
  }, []);

  useEffect(() => {
    if (!data) return;
    const w = window as unknown as Record<string, unknown>;
    w.__exportSample = async (kind: "pdf" | "docx") => (kind === "pdf" ? exportPdf(ref.current!, data) : exportDocx(data, getTemplate(data.templateId).palette.accent, ref.current));
    document.fonts.ready.then(() => (w.__renderReady = true));
  }, [data]);

  if (!data) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff" }}>
      <BiodataDocument ref={ref} data={data} placeholderPhoto={!data.noPhoto} />
    </div>
  );
}
