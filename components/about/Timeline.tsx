"use client";

import { m, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/** Vertical timeline: the line fills as you scroll; each step lights up as it reaches the middle of the screen. */
export function Timeline({ items }: { items: { title: string; text: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const fill = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative">
      <div aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 w-px bg-line-strong">
        <m.div style={{ scaleY: fill }} className="h-full w-full origin-top bg-[linear-gradient(to_bottom,var(--color-amber),var(--color-ember))]" />
      </div>
      {items.map((it, i) => (
        <Step key={it.title} index={i} {...it} />
      ))}
    </ol>
  );
}

function Step({ index, title, text }: { index: number; title: string; text: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: "-48% 0px -48% 0px" });
  const passed = useInView(ref, { margin: "0px 0px -52% 0px" });
  const lit = active || passed;

  return (
    <li ref={ref} className="relative grid grid-cols-[24px_1fr] gap-6 pb-14 last:pb-0 md:gap-10">
      <span
        className="relative z-10 mt-1.5 grid size-6 place-items-center rounded-[5px] border transition-all duration-500"
        style={{
          borderColor: lit ? "rgb(255 90 31 / 0.6)" : "var(--color-line-strong)",
          background: lit ? "rgb(255 90 31 / 0.12)" : "var(--color-night)",
          boxShadow: active ? "0 0 0 6px rgb(255 90 31 / 0.08)" : "none",
        }}
      >
        <span className="size-2 rounded-[1.5px] transition-colors duration-500" style={{ background: lit ? "var(--color-ember)" : "var(--color-line-strong)" }} />
      </span>
      <div className="transition-opacity duration-500" style={{ opacity: lit ? 1 : 0.72 }}>
        <span className="font-display text-sm tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="text-h2 mt-2 !text-[clamp(1.4rem,1.1rem+1.2vw,2.1rem)]">{title}</h3>
        <p className="mt-3 max-w-[46ch] text-lg text-muted">{text}</p>
      </div>
    </li>
  );
}
