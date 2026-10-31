"use client";

import Link from "next/link";
import { m, motionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ServiceVisual } from "@/components/visuals";
import type { VisualLabels } from "@/components/visuals/types";
import type { ServiceCardData } from "@/lib/view";

type Item = ServiceCardData & { allFeatures: string[] };

/** Spring that smooths raw scroll progress into an eased, weighty motion. */
const SPRING = { stiffness: 140, damping: 32, mass: 0.6, restDelta: 0.0005 };
/** Space between the pinned panels' top edges, so earlier panels peek out as tabs. */
const PEEK = 16;
/** Pinned distance from the viewport top (clears the fixed header). */
const TOP = 100;

/**
 * Services as a deck of panels (large screens). Each panel pins below the header;
 * as the next one rises over it, it recedes into the deck — scaling down, tucking
 * up and dimming — on a spring, so motion stays fluid between scroll steps.
 * Incoming panels settle into place with a soft parallax on their content.
 * Phones get a simple stacked list.
 */
export function ServicesStack({ items, visuals, learnMore }: { items: Item[]; visuals: VisualLabels; learnMore: string }) {
  const [desktop, setDesktop] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setDesktop(mq.matches);
      setReduce(rm.matches);
    };
    update();
    mq.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      rm.removeEventListener("change", update);
    };
  }, []);

  const animated = desktop && !reduce;
  // One progress value per panel: 0 → 1 as that panel rises into its pinned spot.
  // A panel recedes exactly as fast as the next one arrives.
  const arrivals = useMemo(() => items.map(() => motionValue(0)), [items]);
  const still = useMemo(() => motionValue(0), []);

  return (
    // All panels share this container, so every pinned panel stays in the deck until the section ends.
    <div className="relative space-y-6 lg:space-y-0">
      {items.map((s, i) => (
        <Slot
          key={s.id}
          s={s}
          i={i}
          total={items.length}
          animated={animated}
          pinned={desktop}
          visuals={visuals}
          learnMore={learnMore}
          arrival={arrivals[i]}
          leave={arrivals[i + 1] ?? still}
        />
      ))}
    </div>
  );
}

function Slot(props: {
  s: Item;
  i: number;
  total: number;
  animated: boolean;
  pinned: boolean;
  visuals: VisualLabels;
  learnMore: string;
  arrival: MotionValue<number>;
  leave: MotionValue<number>;
}) {
  const { i, total, pinned, arrival, leave } = props;
  const last = i === total - 1;
  const top = TOP + i * PEEK;
  const ref = useRef<HTMLDivElement>(null);

  // Measured while the panel still scrolls freely; once pinned it holds at 1.
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", `start ${top}px`] });
  useMotionValueEvent(enter, "change", (v) => arrival.set(v));
  useEffect(() => arrival.set(enter.get()), [arrival, enter]);

  return (
    <div
      ref={ref}
      className={pinned ? "sticky" : ""}
      // The gap after each panel is the scroll distance over which the next one covers it.
      style={pinned ? { top, marginBottom: last ? 0 : "62vh" } : undefined}
    >
      <Panel {...props} enter={enter} leave={leave} last={last} />
    </div>
  );
}

function Panel({
  s,
  i,
  total,
  animated,
  visuals,
  learnMore,
  enter,
  leave,
  last,
}: {
  s: Item;
  i: number;
  total: number;
  animated: boolean;
  visuals: VisualLabels;
  learnMore: string;
  enter: MotionValue<number>;
  leave: MotionValue<number>;
  last: boolean;
}) {
  const enterS = useSpring(enter, SPRING);
  const leaveS = useSpring(leave, SPRING);

  // Receding into the deck (deeper panels end up slightly smaller than later ones).
  const depth = total - 1 - i;
  const scale = useTransform(leaveS, [0, 1], [1, last ? 1 : 1 - 0.035 * Math.min(depth, 3) - 0.025]);
  const tuck = useTransform(leaveS, [0, 1], [0, last ? 0 : -18]);
  const dim = useTransform(leaveS, [0, 0.15, 1], [0, 0, last ? 0 : 0.6]);
  const glow = useTransform(leaveS, [0, 0.3], [1, 0]);

  // Arriving: content and visual settle with a little parallax.
  // (The first panel is already on screen when the page opens, so it starts settled.)
  const first = i === 0;
  const textY = useTransform(enterS, [0, 1], first ? [0, 0] : [48, 0]);
  const textO = useTransform(enterS, [0.2, 0.85], first ? [1, 1] : [0, 1]);
  const visualY = useTransform(enterS, [0, 1], first ? [0, 0] : [90, 0]);
  const visualScale = useTransform(enterS, [0, 1], first ? [1, 1] : [0.94, 1]);

  return (
    <m.article
      data-accent={s.accent}
      style={animated ? { scale, y: tuck, transformOrigin: "50% 0%", willChange: "transform" } : undefined}
      className="edge-glow relative grid overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2 shadow-[0_-24px_60px_-28px_rgb(0_0_0/0.85)] lg:h-[min(40rem,calc(100svh-8.5rem))] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
    >
      {/* Accent light along the top edge, fading as the panel recedes */}
      <m.div
        aria-hidden="true"
        style={animated ? { opacity: glow } : undefined}
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(var(--accent-rgb)/0.7),transparent)]"
      />

      <m.div style={animated ? { y: textY, opacity: textO } : undefined} className="flex flex-col p-7 md:p-10 lg:p-12">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-[11px] border border-line bg-night-3 text-[var(--accent)]">
            <Icon name={s.icon} size={23} />
          </span>
          <span className="font-display text-sm tabular-nums text-subtle">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <h2 className="text-h2 mt-8">{s.title}</h2>
        <p className="text-lead mt-4 max-w-[46ch]">{s.summary}</p>
        <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {s.allFeatures.slice(0, 6).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[0.95rem] text-fg/85">
              <span aria-hidden="true" className="mt-[0.5em] size-1.5 shrink-0 rounded-[1px] bg-[var(--accent)]" />
              {f}
            </li>
          ))}
        </ul>
        <Link href={s.href} className="group mt-auto inline-flex items-center gap-3 self-start pt-10 font-medium text-fg transition-colors hover:text-[var(--accent)]">
          {learnMore}
          <span className="grid size-10 place-items-center rounded-full border border-line-strong transition-[background,border-color,color] duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-night">
            <Icon name="arrowUpRight" size={18} />
          </span>
          <span className="sr-only">: {s.title}</span>
        </Link>
      </m.div>

      <div className="pixel-grid relative overflow-hidden border-t border-line p-6 md:p-10 lg:border-l lg:border-t-0">
        <m.div style={animated ? { y: visualY, scale: visualScale } : undefined} className="h-[20rem] md:h-full">
          <ServiceVisual name={s.visual} labels={visuals} size="hero" />
        </m.div>
      </div>

      {/* Dims the panel as it goes into the deck */}
      {animated && <m.div aria-hidden="true" style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-night" />}
    </m.article>
  );
}
