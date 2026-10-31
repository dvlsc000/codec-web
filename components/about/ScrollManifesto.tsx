"use client";

import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * A single statement that lights up word by word as it scrolls through the
 * viewport — the reader's scroll is the pace.
 */
export function ScrollManifesto({ text, className = "max-w-[21ch] text-[clamp(1.6rem,1rem+2.6vw,3.4rem)]" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={`font-display font-medium leading-[1.12] tracking-[-0.035em] ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <m.span style={{ opacity }}>
        {children}
      </m.span>{" "}
    </>
  );
}
