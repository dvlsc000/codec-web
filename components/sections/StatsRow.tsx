import { CountUp } from "@/components/ui/CountUp";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export type Stat = { value: number | string; suffix?: string; label: string };

/** Figures computed from content (client list, countries) plus fixed facts like 0–24. */
export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <RevealGroup as="dl" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
      {stats.map((s) => (
        <RevealItem key={s.label} className="flex flex-row-reverse items-center justify-end gap-5 bg-night-2 px-5 py-4 sm:flex-col-reverse sm:items-start sm:gap-2 sm:p-7 md:p-8">
          <dt className="text-[0.95rem] leading-snug text-muted">{s.label}</dt>
          <dd className="w-[5.5rem] shrink-0 whitespace-nowrap font-display text-[2.1rem] font-semibold tracking-[-0.04em] sm:w-auto sm:text-5xl md:text-6xl">
            {typeof s.value === "number" ? <CountUp to={s.value} suffix={s.suffix} /> : s.value}
          </dd>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
