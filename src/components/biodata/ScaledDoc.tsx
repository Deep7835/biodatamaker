"use client";

import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import type { Biodata } from "@/lib/biodata";
import { A4, BiodataDocument } from "./BiodataDocument";

type Props = { data: Biodata; placeholderPhoto?: boolean; className?: string; credit?: string; ghost?: boolean };

/** Renders the A4 page scaled to the width of its container. */
export const ScaledDoc = forwardRef<HTMLDivElement, Props>(function ScaledDoc({ data, placeholderPhoto, className, credit, ghost }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / A4.w));
    ro.observe(el);
    setScale(el.clientWidth / A4.w);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} data-scaled-box className={`relative w-full overflow-hidden ${className ?? ""}`} style={{ aspectRatio: `${A4.w} / ${A4.h}` }}>
      <div data-scaled style={{ width: A4.w, height: A4.h, transform: `scale(${scale})`, transformOrigin: "top left", visibility: scale ? "visible" : "hidden" }}>
        <BiodataDocument ref={ref} data={data} placeholderPhoto={placeholderPhoto} credit={credit} ghost={ghost} />
      </div>
    </div>
  );
});
