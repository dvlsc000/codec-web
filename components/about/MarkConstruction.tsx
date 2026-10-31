"use client";

import { m, useReducedMotion } from "framer-motion";
import { MARK_C, MARK_PIXELS } from "@/components/brand/logo-paths";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The Codec mark assembling on its construction grid: grid lines draw in,
 * the C settles and the pixels arrive along their 45° axis.
 */
export function MarkConstruction() {
  const reduce = useReducedMotion();
  const lines = Array.from({ length: 13 }, (_, i) => i * 10);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[17rem] md:max-w-[30rem]" aria-hidden="true">
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.16),transparent)] blur-2xl" />
      <svg viewBox="-24 -24 168 168" className="relative h-full w-full overflow-visible">
        {/* grid */}
        <g stroke="rgb(211 214 220 / 0.09)" strokeWidth="0.35">
          {lines.map((v, i) => (
            <m.line
              key={`h${v}`}
              x1={-20}
              x2={140}
              y1={v}
              y2={v}
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.05 * i }}
            />
          ))}
          {lines.map((v, i) => (
            <m.line
              key={`v${v}`}
              y1={-20}
              y2={140}
              x1={v}
              x2={v}
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.1 + 0.05 * i }}
            />
          ))}
        </g>

        {/* the C */}
        <m.path
          d={MARK_C}
          fill="var(--color-steel)"
          initial={reduce ? false : { opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.7 }}
        />

        {/* 45° axis */}
        <m.line
          x1={120}
          y1={0}
          x2={20}
          y2={100}
          stroke="var(--color-ember)"
          strokeOpacity="0.45"
          strokeWidth="0.6"
          strokeDasharray="2.5 2.5"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease, delay: 1.0 }}
        />

        {/* pixels */}
        {MARK_PIXELS.map((p, i) => (
          <m.rect
            key={i}
            x={p.x}
            y={p.y}
            width={p.s}
            height={p.s}
            fill="var(--color-ember)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 17, delay: 1.25 + i * 0.16 }}
          />
        ))}

      </svg>

    </div>
  );
}
