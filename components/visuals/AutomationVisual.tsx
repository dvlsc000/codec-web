"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { VisualFrame } from "./VisualFrame";
import type { VisualProps } from "./types";

const ICONS: IconName[] = ["chat", "automation", "database", "server", "mail"];
const TIMES = ["180 ms", "1,2 s", "240 ms", "410 ms", "90 ms"];

/** Run timing (ms). */
const START_MS = 500;
const RUN_MS = 950; // time a step spends "running"
const NEXT_MS = 180; // pause before the next step starts
const DONE_HOLD_MS = 2600; // summary stays before the run restarts

/**
 * A workflow run, like an automation log: steps start one after another,
 * show a spinner while running, then a check and their duration. An amber
 * progress line advances down the steps, and a summary appears at the end.
 * Card size runs the first three steps; hero size runs all five.
 */
export function AutomationVisual({ labels, size }: VisualProps<"automation">) {
  const hero = size === "hero";
  const steps = labels.nodes.slice(0, hero ? 5 : 3);
  const box = useRef<HTMLDivElement>(null);
  // `done` steps are complete; step `done` (if < length) is running.
  const [run, setRun] = useState({ done: -1, n: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRun({ done: steps.length, n: 0 });
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let cur = { done: -1, n: 0 };
    const go = (next: typeof cur, ms: number) => {
      timer = setTimeout(() => {
        if (!visible) return;
        cur = next;
        setRun(next);
        advance();
      }, ms);
    };
    const advance = () => {
      if (cur.done < 0) go({ done: 0, n: cur.n }, START_MS);
      else if (cur.done < steps.length) go({ done: cur.done + 1, n: cur.n }, RUN_MS + (cur.done === 0 ? 0 : NEXT_MS));
      else go({ done: -1, n: cur.n + 1 }, DONE_HOLD_MS);
    };
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) advance();
      if (!visible) clearTimeout(timer);
    });
    if (box.current) io.observe(box.current);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [steps.length]);

  const finished = run.done >= steps.length;
  // progress line: reaches the centre of the running / last step
  const progress = run.done < 0 ? 0 : Math.min(run.done, steps.length - 1) / Math.max(1, steps.length - 1);

  return (
    <VisualFrame accent="amber" className="flex h-full w-full flex-col justify-center">
      <div ref={box} className="relative">
        <div className="relative">
          {/* connector track + progress */}
          <div aria-hidden="true" className={`absolute left-[24px] w-px bg-line-strong ${hero ? "top-[1.6rem] bottom-[1.6rem]" : "top-[1.4rem] bottom-[1.4rem]"}`}>
            <div
              className="absolute inset-x-0 top-0 origin-top bg-[linear-gradient(to_bottom,var(--color-amber),var(--color-ember))] transition-transform duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]"
              style={{ height: "100%", transform: `scaleY(${progress})` }}
            />
            <div
              className="absolute -left-[3px] size-[7px] rounded-[1.5px] bg-ember shadow-[0_0_10px_2px_rgb(255_90_31/0.6)] transition-[top,opacity] duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]"
              style={{ top: `calc(${progress * 100}% - 3px)`, opacity: run.done < 0 || finished ? 0 : 1 }}
            />
          </div>

        <ol className={`relative ${hero ? "space-y-3" : "space-y-2.5"}`}>
          {steps.map((label, i) => {
            const state = i < run.done ? "done" : i === run.done ? "running" : "waiting";
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-[12px] border py-1.5 pl-1.5 pr-3 transition-[background-color,border-color,opacity] duration-500 ${
                  state === "running"
                    ? "border-amber/40 bg-amber/[0.07]"
                    : state === "done"
                      ? "border-line bg-white/[0.03]"
                      : "border-transparent opacity-55"
                }`}
              >
                <span
                  className={`relative grid shrink-0 place-items-center rounded-[9px] border transition-colors duration-500 ${hero ? "size-9" : "size-8"} ${
                    state === "waiting" ? "border-line bg-night-2 text-subtle" : "border-amber/40 bg-night-3 text-amber"
                  }`}
                >
                  <Icon name={ICONS[i] ?? "flow"} size={hero ? 17 : 16} />
                </span>
                <span className={`min-w-0 flex-1 truncate ${hero ? "text-[0.92rem]" : "text-[0.84rem]"} ${state === "waiting" ? "text-muted" : "text-fg"}`}>{label}</span>
                <span className="relative grid h-5 min-w-14 place-items-end text-[0.72rem] tabular-nums">
                  {state === "running" && <span className="size-4 animate-spin rounded-full border-2 border-amber/25 border-t-amber" />}
                  {state === "done" && (
                    <span className="auto-in inline-flex items-center gap-1 text-fg/70">
                      <Icon name="check" size={13} strokeWidth={2.4} className="text-amber" />
                      {TIMES[i]}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        </div>

        {/* run summary */}
        <div className={`mt-4 flex h-7 items-center gap-2 pl-1 ${hero ? "mt-5" : ""}`}>
          {finished && (
            <>
              <span key={`ok-${run.n}`} className="auto-in inline-flex items-center gap-1.5 rounded-[var(--radius-pixel)] bg-amber px-2.5 py-1 text-xs font-medium text-night">
                <Icon name="check" size={13} strokeWidth={2.4} />
                {labels.status}
              </span>
              <span key={`rec-${run.n}`} className="auto-in text-xs text-amber" style={{ animationDelay: "120ms" }}>
                +128 {labels.records}
              </span>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes auto-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .auto-in { animation: auto-in .45s cubic-bezier(.16,1,.3,1) both; }
      `}</style>
    </VisualFrame>
  );
}
