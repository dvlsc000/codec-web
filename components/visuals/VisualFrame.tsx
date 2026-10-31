"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Accent } from "@/content/types";

/**
 * Wrapper for every service illustration: sets the accent, marks the subtree as a
 * looping visual (reduced-motion shows its resting state) and pauses all CSS/SMIL
 * animation while it is off-screen, so many visuals on one page cost nothing.
 */
export function VisualFrame({ accent, className = "", children, label }: { accent: Accent; className?: string; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const paused = !entry.isIntersecting;
        el.dataset.paused = String(paused);
        el.querySelectorAll("svg").forEach((svg) => (paused ? svg.pauseAnimations() : svg.unpauseAnimations()));
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visual
      data-accent={accent}
      data-paused="true"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`relative select-none ${className}`}
    >
      {children}
    </div>
  );
}

/** Small status pill used inside visuals. */
export function VisualPill({ children, live = false, className = "" }: { children: ReactNode; live?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-line bg-night/70 px-3 py-1 text-[0.72rem] text-fg/85 backdrop-blur ${className}`}>
      {live && (
        <span className="relative flex size-1.5">
          <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-[var(--accent)]" />
          <span className="relative inline-flex size-1.5 rounded-full bg-[var(--accent)]" />
        </span>
      )}
      {children}
    </span>
  );
}
