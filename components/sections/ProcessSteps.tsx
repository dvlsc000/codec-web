"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Four-step process; the connecting line draws itself as you scroll. */
export function ProcessSteps({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="absolute left-[1.35rem] top-0 h-full w-px bg-line lg:left-0 lg:top-[1.35rem] lg:h-px lg:w-full">
        <m.div
          style={{ ["--p" as string]: scale } as never}
          className="h-full w-full origin-top-left [transform:scaleY(var(--p))] lg:[transform:scaleX(var(--p))] bg-[linear-gradient(90deg,var(--color-ember),var(--color-steel))] max-lg:bg-[linear-gradient(180deg,var(--color-ember),var(--color-steel))]"
        />
      </div>
      <RevealGroup as="ol" className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
        {steps.map((s, i) => (
          <RevealItem as="li" key={s.title} className="relative pl-16 lg:pl-0 lg:pt-16">
            <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-[10px] border border-line-strong bg-night font-display text-sm font-semibold text-fg">
              {i + 1}
            </span>
            <h3 className="text-h3">{s.title}</h3>
            <p className="mt-3 max-w-[30ch] text-muted">{s.text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
