"use client";

import Link from "next/link";
import { domAnimation, LazyMotion, m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

type Img = { src: string; srcSet?: string; sizes?: string; alt: string; width: number; height: number };

const spring = { stiffness: 140, damping: 18, mass: 0.6 };

/**
 * Hero biodata stack.
 * - Entrance (fan-out) is plain CSS (.hero-front-enter / .hero-back-enter) so the LCP image paints
 *   immediately, without waiting for JavaScript.
 * - Motion adds the interactive layer: 3D tilt toward the pointer, opposite parallax on the back
 *   card, a straighten-and-lift on hover, and a gentle drift on scroll. All off for reduced motion.
 */
export function HeroStack({ href, front, back }: { href: string; front: Img; back: Img }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Pointer position within the stack, -0.5 … 0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const backX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const backY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  // Scroll drift: the stack rises a little as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useSpring(useTransform(scrollYProgress, [0, 1], [18, -36]), spring);
  const backDrift = useSpring(useTransform(scrollYProgress, [0, 1], [8, -14]), spring);
  const backYTotal = useTransform([backY, backDrift] as const, ([a, b]: number[]) => a + b);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative mx-auto w-full max-w-[380px] md:max-w-[420px]" style={{ perspective: 1200 }}>
        {/* Back card: fans out from behind (CSS), then parallaxes against the pointer (Motion). */}
        <div data-print-hide className="hero-back-enter absolute -right-6 top-6 w-[82%] opacity-70">
          <m.div style={reduce ? undefined : { x: backX, y: backYTotal }} className="rounded-sm shadow-lg ring-1 ring-line">
            <Picture img={back} lazy />
          </m.div>
        </div>

        {/* Front card: settles into place (CSS), tilts toward the pointer and straightens on hover (Motion). */}
        <div className="hero-front-enter relative">
          <m.div
            style={reduce ? undefined : { rotateX, rotateY, y: drift, transformPerspective: 1200 }}
            whileHover={reduce ? undefined : { rotate: 2, scale: 1.02 }}
            transition={{ type: "spring", ...spring }}
            className="rounded-sm shadow-[0_24px_60px_-20px_rgba(60,30,20,0.35)] ring-1 ring-line"
          >
            <Link href={href} className="block">
              <Picture img={front} priority />
            </Link>
            {/* Soft sheen that follows the tilt, like light on paper. */}
            {!reduce && <Sheen x={sx} y={sy} />}
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}

function Picture({ img, priority, lazy }: { img: Img; priority?: boolean; lazy?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, pre-rendered webp
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.sizes}
      alt={img.alt}
      width={img.width}
      height={img.height}
      fetchPriority={priority ? "high" : undefined}
      loading={lazy ? "lazy" : undefined}
      decoding={lazy ? "async" : undefined}
      className="block h-auto w-full bg-paper"
    />
  );
}

function Sheen({ x, y }: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> }) {
  const bg = useTransform(
    [x, y] as const,
    ([vx, vy]: number[]) => `radial-gradient(60% 45% at ${50 + vx * 90}% ${35 + vy * 80}%, rgba(255,255,255,0.28), transparent 70%)`,
  );
  return <m.div aria-hidden className="pointer-events-none absolute inset-0 rounded-sm" style={{ background: bg }} />;
}

/** Primary CTA with a spring lift on hover and a press on tap. */
export function SpringCta({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.span
        className="inline-block"
        whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        <Link href={href} className={className}>
          {children}
        </Link>
      </m.span>
    </LazyMotion>
  );
}
