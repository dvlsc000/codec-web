"use client";

import { useState } from "react";

export interface WallGroup {
  id: string;
  title: string;
  clients: { name: string; country: string }[];
}

/**
 * Client index: a quiet grid of cells divided by hairlines. Sector filters
 * highlight the matching clients and fade the rest, so nothing jumps.
 */
export function ClientWall({ groups, allLabel }: { groups: WallGroup[]; allLabel: string }) {
  const [active, setActive] = useState<string>("all");
  const total = groups.reduce((n, g) => n + g.clients.length, 0);
  const items = groups.flatMap((g) => g.clients.map((c) => ({ ...c, group: g.id, groupTitle: g.title })));
  const filters = [{ id: "all", title: allLabel, count: total }, ...groups.map((g) => ({ id: g.id, title: g.title, count: g.clients.length }))];

  return (
    <div>
      {/* Segmented filter */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <div role="group" className="inline-flex gap-1 rounded-full border border-line bg-night-2/70 p-1">
          {filters.map((f) => {
            const on = active === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(f.id)}
                className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[0.85rem] transition-colors duration-300 ${
                  on ? "bg-white/[0.09] text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {on && <span aria-hidden="true" className="size-1.5 rounded-[1px] bg-ember" />}
                {f.title}
                <span className="tabular-nums text-xs text-subtle">{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Index */}
      <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-2">
      <ul className="-mb-px -mr-px grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
        {items.map((c) => {
          const lit = active === "all" || c.group === active;
          return (
            <li
              key={c.name}
              className={`group relative flex items-center justify-between gap-4 border-b border-r border-line px-5 py-3.5 transition-[opacity,background-color] duration-500 hover:bg-night-3 sm:min-h-[4.75rem] sm:flex-col sm:items-start sm:justify-center sm:gap-1 sm:py-4 ${
                lit ? "opacity-100" : "opacity-[0.22]"
              }`}
            >
              <span aria-hidden="true" className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-ember transition-all duration-300 group-hover:h-8" />
              <span className="text-[0.95rem] font-medium leading-snug text-fg/90">{c.name}</span>
              <span className="flex shrink-0 items-center gap-2 text-[0.75rem] text-subtle">
                <span className="hidden sm:inline">{c.groupTitle}</span>
                <span aria-hidden="true" className="hidden size-[3px] rounded-full bg-subtle/60 sm:inline-block" />
                <span className="tabular-nums tracking-wide">{c.country}</span>
              </span>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}
