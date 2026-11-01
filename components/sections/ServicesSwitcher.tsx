"use client";

import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ServiceVisual } from "@/components/visuals";
import type { VisualLabels } from "@/components/visuals/types";
import type { ServiceCardData } from "@/lib/view";

const ease = [0.16, 1, 0.3, 1] as const;
const AUTO_MS = 7000;

/**
 * Phone version of "What we do": a tab bar of services above one large panel.
 * Tabs auto-advance with a progress line until the visitor taps or swipes;
 * the panel can be swiped left/right.
 */
export function ServicesSwitcher({ services, learnMore, visuals }: { services: ServiceCardData[]; learnMore: string; visuals: VisualLabels }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const s = services[index];
  const running = auto && visible && !reduce;

  // Only auto-advance while on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      setDir(1);
      setIndex((i) => (i + 1) % services.length);
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [running, index, services.length]);

  // Keep the active tab in view.
  useEffect(() => {
    const bar = tabs.current;
    const tab = bar?.children[index] as HTMLElement | undefined;
    if (bar && tab) bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  const select = (i: number) => {
    setAuto(false);
    setDir(i > index ? 1 : -1);
    setIndex(i);
  };
  const step = (d: number) => {
    setAuto(false);
    setDir(d);
    setIndex((i) => (i + d + services.length) % services.length);
  };

  return (
    <div ref={root}>
      {/* Tabs */}
      <div
        ref={tabs}
        role="tablist"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((t, i) => {
          const on = i === index;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="services-panel"
              onClick={() => select(i)}
              data-accent={t.accent}
              className={`relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border py-2.5 pl-3 pr-4 text-[0.88rem] font-medium transition-colors duration-300 ${
                on ? "border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.1)] text-fg" : "border-line bg-white/[0.02] text-muted"
              }`}
            >
              <Icon name={t.icon} size={16} className={on ? "text-[var(--accent)]" : ""} />
              {t.title}
              {on && running && (
                <span
                  key={`p-${index}`}
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-[3px] h-[2px] origin-left rounded-full bg-[var(--accent)]"
                  style={{ animation: `svc-progress ${AUTO_MS}ms linear both` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div id="services-panel" role="tabpanel" className="relative mt-4">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <m.div
            key={s.id}
            custom={dir}
            data-accent={s.accent}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -40 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) step(1);
              else if (info.offset.x > 50) step(-1);
            }}
            className="edge-glow overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2"
          >
            <div className="pixel-grid relative border-b border-line p-5">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.18),transparent)]" />
              <div className="relative h-[15.5rem]">
                <ServiceVisual name={s.visual} labels={visuals} size="card" />
              </div>
            </div>

            <div className="flex min-h-[23rem] flex-col p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-[11px] border border-line bg-night-3 text-[var(--accent)]">
                  <Icon name={s.icon} size={21} />
                </span>
                <span className="font-display text-sm tabular-nums text-subtle">
                  {String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-h3 mt-5 !text-[1.45rem]">{s.title}</h3>
              <p className="mt-2.5 leading-relaxed text-muted">{s.summary}</p>
              <ul className="mb-7 mt-5 space-y-2.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[0.95rem] text-fg/85">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-[1px] bg-[var(--accent)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={s.href}
                className="mt-auto flex h-12 items-center justify-center gap-2 rounded-[14px] border border-line-strong bg-white/[0.03] font-medium text-fg transition-colors active:bg-white/[0.07]"
              >
                {learnMore}
                <Icon name="arrowRight" size={16} className="text-[var(--accent)]" />
              </Link>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Prev / next */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden="true">
          {services.map((t, i) => (
            <span key={t.id} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-ember" : "w-1.5 bg-white/20"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="‹" className="grid size-11 place-items-center rounded-full border border-line-strong text-fg active:bg-white/[0.06]">
            <Icon name="arrowRight" size={17} className="rotate-180" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="›" className="grid size-11 place-items-center rounded-full border border-line-strong text-fg active:bg-white/[0.06]">
            <Icon name="arrowRight" size={17} />
          </button>
        </div>
      </div>

      <style>{`@keyframes svc-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}
