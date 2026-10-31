"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export interface FootprintRow {
  country: string;
  count: number;
  /** client names, used as tooltips on each pixel */
  clients: string[];
}

/**
 * One pixel per reference client, grouped by country. Pixels light up in
 * sequence when the section scrolls into view. Counts come from content/projects.ts.
 */
export function Footprint({ rows, total }: { rows: FootprintRow[]; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  let index = 0;

  return (
    <div ref={ref} className="divide-y divide-line border-y border-line">
      {rows.map((r) => (
        <div key={r.country} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[11rem_4rem_1fr] sm:gap-8 sm:py-6">
          <span className="text-h3">{r.country}</span>
          <span className="font-display text-2xl font-medium tabular-nums text-fg/90 sm:text-right">{r.count}</span>
          <ul className="col-span-2 flex flex-wrap gap-[6px] sm:col-span-1" aria-label={`${r.country}: ${r.clients.join(", ")}`}>
            {r.clients.map((name) => {
              const i = index++;
              return (
                <li
                  key={name}
                  title={name}
                  className="size-[14px] rounded-[2px] transition-[background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-125 md:size-[18px]"
                  style={{
                    transitionDelay: inView ? `${i * 28}ms` : "0ms",
                    backgroundColor: inView ? "var(--color-ember)" : "rgb(211 214 220 / 0.08)",
                    transform: inView ? "scale(1)" : "scale(0.6)",
                    boxShadow: inView ? "0 0 14px -4px rgb(255 90 31 / 0.8)" : "none",
                  }}
                />
              );
            })}
          </ul>
        </div>
      ))}
      <p className="sr-only">{total}</p>
    </div>
  );
}
