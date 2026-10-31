import { CountUp } from "@/components/ui/CountUp";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export type Stat = { value: number | string; suffix?: string; label: string };

/** Figures computed from content (client list, countries) plus fixed facts like 0–24. */
export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <RevealGroup as="dl" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
      {stats.map((s) => (
        <RevealItem key={s.label} className="flex flex-col-reverse gap-2 bg-night-2 p-7 md:p-8">
          <dt className="text-muted">{s.label}</dt>
          <dd className="font-display text-5xl font-semibold tracking-[-0.04em] md:text-6xl">
            {typeof s.value === "number" ? <CountUp to={s.value} suffix={s.suffix} /> : s.value}
          </dd>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
