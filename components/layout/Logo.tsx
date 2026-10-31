"use client";

import { m, useReducedMotion } from "framer-motion";
import { MARK_C, MARK_PIXELS, WORDMARK, WORDMARK_DOT, WORDMARK_HEIGHT, WORDMARK_WIDTH } from "@/components/brand/logo-paths";

const ease = [0.16, 1, 0.3, 1] as const;
const GAP = 44;

/**
 * Codec logo, drawn from the same geometry as the logo kit.
 * `animated`: the C settles in and the pixels arrive one by one (largest first),
 * and on hover the pixels step outward along the diagonal — data leaving the codec.
 */
export function Logo({
  variant = "horizontal",
  animated = false,
  className = "",
  title = "Codec",
}: {
  variant?: "horizontal" | "mark";
  animated?: boolean;
  className?: string;
  title?: string;
}) {
  const reduce = useReducedMotion();
  const play = animated && !reduce;
  const wordY = (120 - WORDMARK_HEIGHT) / 2;
  const width = variant === "mark" ? 120 : 120 + GAP + WORDMARK_WIDTH;

  return (
    <svg viewBox={`0 0 ${width} 120`} className={`group/logo block w-auto overflow-visible ${className || "h-8"}`} role="img" aria-label={title}>
      <m.path
        d={MARK_C}
        fill="var(--color-steel)"
        initial={play ? { opacity: 0, x: -10 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease }}
      />
      {MARK_PIXELS.map((p, i) => (
        <g
          key={i}
          className={`transition-transform duration-500 ease-[var(--ease-out-expo)] ${
            ["group-hover/logo:translate-x-[6px] group-hover/logo:-translate-y-[6px]", "group-hover/logo:translate-x-[10px] group-hover/logo:-translate-y-[10px]", "group-hover/logo:translate-x-[13px] group-hover/logo:-translate-y-[13px]"][i]
          }`}
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <m.rect
            x={p.x}
            y={p.y}
            width={p.s}
            height={p.s}
            fill="var(--color-ember)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={play ? { opacity: 0, scale: 0 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.35 + i * 0.12 }}
          />
        </g>
      ))}
      {variant === "horizontal" && (
        <m.g
          initial={play ? { opacity: 0, x: -12 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          <path d={WORDMARK} fill="var(--color-steel)" transform={`translate(${120 + GAP} ${wordY})`} />
          <rect
            x={120 + GAP + WORDMARK_DOT.x}
            y={wordY + WORDMARK_DOT.y}
            width={WORDMARK_DOT.s}
            height={WORDMARK_DOT.s}
            fill="var(--color-ember)"
            className="motion-safe:animate-[v-blink_2.4s_steps(2,jump-none)_infinite]"
          />
        </m.g>
      )}
    </svg>
  );
}
