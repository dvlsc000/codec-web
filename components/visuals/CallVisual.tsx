import { VisualFrame, VisualPill } from "./VisualFrame";
import type { VisualProps } from "./types";

const VALUES = [0.82, 0.58, 0.94, 0.36];
const AMOUNTS = ["412,30 €", "286,10 €", "468,90 €", "117,30 €"];
const CALLS = [
  ["214", "+385 1 ••• 4471", "03:12", "0,84 €"],
  ["108", "+385 21 ••• 902", "01:05", "0,22 €"],
  ["331", "+49 30 ••• 1188", "07:48", "2,96 €"],
  ["205", "+385 98 ••• 310", "00:41", "0,18 €"],
  ["117", "+385 1 ••• 6620", "12:02", "1,94 €"],
  ["342", "+43 1 ••• 5501", "02:16", "0,91 €"],
];

/** Call accounting dashboard: department costs build up while live calls are priced. */
export function CallVisual({ labels, size }: VisualProps<"callAccounting">) {
  const hero = size === "hero";
  return (
    <VisualFrame accent="ember" className="flex h-full w-full flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.72rem] text-subtle">{labels.total}</p>
          <p className="font-display text-xl font-medium tabular-nums tracking-tight md:text-2xl">1.284,60 €</p>
        </div>
        <VisualPill live>{labels.live}</VisualPill>
      </div>

      <div className="space-y-2.5">
        <p className="text-[0.72rem] text-subtle">{labels.title}</p>
        {labels.departments.map((d, i) => (
          <div key={d} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-[0.72rem] md:grid-cols-[6.5rem_1fr_auto]">
            <span className="truncate text-fg/75">{d}</span>
            <span className="relative h-3 overflow-hidden rounded-[2px] bg-white/[0.05]">
              <span
                className="absolute inset-y-0 left-0 origin-left bg-[linear-gradient(90deg,var(--color-ember),var(--color-amber))] [mask-image:repeating-linear-gradient(90deg,#000_0_6px,transparent_6px_8px)]"
                style={{ width: `${VALUES[i % VALUES.length] * 100}%`, animation: `v-bar-loop 7s var(--ease-out-expo) ${i * 0.25}s infinite both` }}
              />
            </span>
            <span className="tabular-nums text-fg/70">{AMOUNTS[i % AMOUNTS.length]}</span>
          </div>
        ))}
      </div>

      {hero && (
        <div className="relative mt-1 h-40 overflow-hidden rounded-xl border border-line bg-night/60 [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]">
          <div className="animate-[v-ticker_14s_linear_infinite]">
            {[...CALLS, ...CALLS].map((c, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-line px-3.5 py-2 text-[0.72rem] tabular-nums">
                <span className="rounded-[3px] bg-white/[0.06] px-1.5 py-0.5 text-fg/70">
                  {labels.ext} {c[0]}
                </span>
                <span className="truncate text-fg/80">{c[1]}</span>
                <span className="text-subtle">{c[2]}</span>
                <span className="text-amber">{c[3]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </VisualFrame>
  );
}
