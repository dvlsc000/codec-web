"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "01▪▫■□#%&<>/";

/**
 * Text that "decodes" into place, character by character, left to right —
 * a nod to the codec. Screen readers get the final text immediately; the
 * scrambled layer is decorative. Character widths are locked so nothing shifts.
 */
export function DecodeText({ text, delay = 0, speed = 28, className = "" }: { text: string; delay?: number; speed?: number; className?: string }) {
  const reduce = useReducedMotion();
  const chars = Array.from(text);
  const [revealed, setRevealed] = useState<number>(reduce ? chars.length : -1);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (reduce) {
      setRevealed(chars.length);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + delay * 1000;
    const loop = (now: number) => {
      const n = Math.floor((now - t0) / speed);
      setRevealed(n);
      setTick((x) => x + 1);
      if (n <= chars.length + 6) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduce, delay, speed]);

  const words = text.split(" ");
  let index = 0;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => {
          const nodes = Array.from(word).map((ch) => {
            const i = index++;
            const state = i < revealed - 5 ? "done" : i < revealed ? "scramble" : "hidden";
            return (
              <span key={i} className="relative inline-block">
                <span className={state === "done" ? "" : "invisible"}>{ch}</span>
                {state === "scramble" && (
                  <span className="absolute inset-0 grid place-items-center text-ember">{GLYPHS[(i * 7 + revealed * 3) % GLYPHS.length]}</span>
                )}
              </span>
            );
          });
          index++; // the space
          return (
            <span key={wi} className="inline-block whitespace-nowrap">
              {nodes}
              {wi < words.length - 1 && " "}
            </span>
          );
        })}
      </span>
    </span>
  );
}
