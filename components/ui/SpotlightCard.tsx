"use client";

import type { ReactNode, PointerEvent } from "react";
import type { Accent } from "@/content/types";

/**
 * Card with a soft light that follows the pointer, tinted by the accent.
 * Hover only changes border and shadow (cheap to paint) — no movement and no
 * backdrop blur, which made hover choppy.
 */
export function SpotlightCard({ accent, className = "", children }: { accent: Accent; className?: string; children: ReactNode }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      data-accent={accent}
      onPointerMove={onMove}
      className={`edge-glow group/card relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-[linear-gradient(180deg,rgb(255_255_255/0.035),rgb(255_255_255/0.01))] bg-night-3/60 shadow-[0_30px_60px_-34px_rgb(0_0_0/0.7)] transition-[border-color,box-shadow] duration-500 ease-out hover:border-[rgb(var(--accent-rgb)/0.35)] hover:shadow-[0_30px_70px_-30px_rgb(var(--accent-rgb)/0.22)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgb(var(--accent-rgb) / 0.13), transparent 60%)" }}
      />
      {children}
    </div>
  );
}
