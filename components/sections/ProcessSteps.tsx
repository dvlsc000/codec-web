"use client";

import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

const COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

/**
 * A step-by-step process driven by scroll. A progress rail fills as the reader
 * moves through the section; each step activates in turn (accent card, pulsing
 * marker) and completed steps get a check. Horizontal on desktop, vertical on
 * phones. `icons` is optional and matched by index.
 */
export function ProcessSteps({ steps, icons = [] }: { steps: { title: string; text: string }[]; icons?: IconName[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 25%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [active, setActive] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(v <= 0.02 ? -1 : Math.min(steps.length - 1, Math.floor(v * steps.length * 0.999 + 0.25)));
  });
  const current = reduce ? steps.length - 1 : active;
  const n = steps.length;

  return (
    <div ref={ref} className="relative">
      {/* Rail (vertical on phones, horizontal on desktop) */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-16 left-[1.375rem] top-[1.375rem] w-px bg-line-strong [mask-image:linear-gradient(to_bottom,#000_88%,transparent)] lg:bottom-auto lg:h-px lg:w-auto lg:[mask-image:none]"
        data-rail>
        <m.div
          style={{ ["--p" as string]: reduce ? 1 : fill } as never}
          className="h-full w-full origin-top-left bg-[linear-gradient(180deg,var(--color-ember),var(--color-amber))] [transform:scaleY(var(--p))] lg:bg-[linear-gradient(90deg,var(--color-ember),var(--color-amber))] lg:[transform:scaleX(var(--p))]"
        />
      </div>

      <ol className={`relative grid gap-4 lg:gap-5 ${COLS[n] ?? "lg:grid-cols-4"}`}>

        {steps.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <li key={s.title} className="relative grid grid-cols-[2.75rem_1fr] gap-4 lg:grid-cols-1 lg:gap-6">
              {/* Marker */}
              <div className="relative z-10">
                <span
                  className={`relative grid size-11 place-items-center rounded-[11px] border font-display text-sm font-medium tabular-nums transition-all duration-500 ${
                    state === "todo"
                      ? "border-line-strong bg-night text-subtle"
                      : state === "active"
                        ? "border-ember bg-ember text-night shadow-[0_0_0_6px_rgb(255_90_31/0.12),0_10px_30px_-8px_rgb(255_90_31/0.7)]"
                        : "border-ember/50 bg-night-2 text-ember"
                  }`}
                >
                  {state === "active" && !reduce && <span aria-hidden="true" className="animate-pulse-ring absolute inset-0 rounded-[11px] border border-ember" />}
                  {state === "done" ? <Icon name="check" size={17} strokeWidth={2.4} /> : String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Card */}
              <div
                className={`relative h-full overflow-hidden rounded-[var(--radius-card)] border p-6 transition-all duration-700 ease-[var(--ease-out-expo)] md:p-7 ${
                  state === "active"
                    ? "border-ember/40 bg-[linear-gradient(160deg,rgb(255_90_31/0.12),rgb(22_23_27)_55%)] shadow-[0_24px_60px_-30px_rgb(255_90_31/0.5)]"
                    : state === "done"
                      ? "border-line bg-night-2"
                      : "border-line bg-night-2/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {icons[i] && (
                    <span
                      className={`grid size-11 place-items-center rounded-[11px] border transition-colors duration-500 ${
                        state === "todo" ? "border-line bg-night-3 text-subtle" : "border-ember/30 bg-ember/10 text-ember"
                      }`}
                    >
                      <Icon name={icons[i]} size={20} />
                    </span>
                  )}
                  {/* Decorative numeral drawn with CSS content, so it isn't read as low-contrast text */}
                  <span
                    aria-hidden="true"
                    data-n={String(i + 1).padStart(2, "0")}
                    className={`font-display text-[2.6rem] font-medium leading-none tracking-[-0.06em] transition-colors duration-500 before:content-[attr(data-n)] ${state === "active" ? "text-ember/25" : "text-white/[0.05]"}`}
                  />
                </div>
                <h3 className={`text-h3 mt-6 transition-colors duration-500 ${state === "todo" ? "text-fg/70" : "text-fg"}`}>{s.title}</h3>
                <p className={`mt-2.5 leading-relaxed transition-colors duration-500 ${state === "todo" ? "text-muted/70" : "text-muted"}`}>{s.text}</p>

                {/* per-step progress */}
                <div aria-hidden="true" className="mt-6 h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--color-ember),var(--color-amber))] transition-transform duration-700 ease-[var(--ease-out-expo)]"
                    style={{ transform: `scaleX(${state === "done" ? 1 : state === "active" ? 0.55 : 0})` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <style>{`@media (min-width: 1024px) { [data-rail] { right: calc(${100 / n}% - ${(1.25 * (n - 1)) / n}rem - 1.375rem); } }`}</style>
    </div>
  );
}
