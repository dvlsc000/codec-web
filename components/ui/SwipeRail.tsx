"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Phones: a horizontal, snap-scrolling row of cards with position indicators
 * (swipe like an app). Tablets and up: the same items in a normal grid, set by
 * `gridClassName` (e.g. "md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5").
 */
export function SwipeRail({
  children,
  gridClassName,
  itemClassName,
  label,
}: {
  children: ReactNode;
  gridClassName: string;
  /** Extra classes per item (by index), e.g. column spans on desktop. */
  itemClassName?: string[];
  label: string;
}) {
  const items = Children.toArray(children);
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const kids = Array.from(el.children) as HTMLElement[];
        const left = el.scrollLeft + el.clientWidth * 0.3;
        let idx = 0;
        kids.forEach((k, i) => {
          if (k.offsetLeft - el.offsetLeft <= left) idx = i;
        });
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) idx = kids.length - 1;
        setActive(idx);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = ref.current;
    const kid = el?.children[i] as HTMLElement | undefined;
    if (el && kid) el.scrollTo({ left: kid.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        aria-label={label}
        className={`-mx-[clamp(1rem,4vw,2.5rem)] flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,2.5rem)] gap-3 overflow-x-auto overscroll-x-contain px-[clamp(1rem,4vw,2.5rem)] pb-1 [scrollbar-width:none] md:mx-0 md:snap-none md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden ${gridClassName}`}
      >
        {items.map((child, i) => (
          <li key={i} className={`flex w-[86%] max-w-[23rem] shrink-0 snap-start flex-col md:w-auto md:max-w-none ${itemClassName?.[i] ?? ""}`}>
            {child}
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5 md:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1} / ${items.length}`}
              aria-current={i === active ? "true" : undefined}
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)] ${i === active ? "w-6 bg-ember" : "w-1.5 bg-white/20"}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
