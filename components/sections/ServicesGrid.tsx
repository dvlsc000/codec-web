import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ServiceVisual } from "@/components/visuals";
import type { VisualLabels } from "@/components/visuals/types";
import type { ServiceCardData } from "@/lib/view";

/**
 * Data-driven bento grid. Each tile carries its service's live illustration.
 * `featured` services take a wide tile (text beside the visual); the rest are
 * tall tiles (visual above text). Alternating wide/narrow rows reads best.
 */
export function ServicesGrid({ services, learnMore, visuals }: { services: ServiceCardData[]; learnMore: string; visuals: VisualLabels }) {
  return (
    <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {services.map((s) => (
        <RevealItem as="li" key={s.id} className={s.featured ? "md:col-span-2" : ""}>
          <SpotlightCard accent={s.accent} className="h-full">
            <Link href={s.href} className={`relative grid h-full ${s.featured ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" : "grid-rows-[auto_1fr]"}`}>
              <div className={`pixel-grid relative overflow-hidden border-line p-6 md:p-7 ${s.featured ? "order-first border-b lg:order-last lg:border-b-0 lg:border-l" : "border-b"}`}>
                <div className={s.featured ? "h-60 md:h-64" : "h-56"}>
                  <ServiceVisual name={s.visual} labels={visuals} size="card" />
                </div>
              </div>

              <div className="flex flex-col p-7 md:p-8">
                <span className="grid size-11 place-items-center rounded-[10px] border border-line bg-night-2 text-[var(--accent)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/card:-rotate-6 group-hover/card:scale-110">
                  <Icon name={s.icon} size={21} />
                </span>
                <h3 className={`text-h3 mt-6 ${s.featured ? "md:text-[1.6rem]" : ""}`}>{s.title}</h3>
                <p className="mt-3 max-w-[46ch] text-muted">{s.featured ? s.summary : s.tagline}</p>
                {s.featured && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.features.map((f) => (
                      <li key={f} className="rounded-[var(--radius-pixel)] border border-line bg-white/[0.03] px-2.5 py-1 text-[0.82rem] text-fg/80">{f}</li>
                    ))}
                  </ul>
                )}
                <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-medium text-fg/80 transition-colors group-hover/card:text-[var(--accent)]">
                  {learnMore}
                  <Icon name="arrowRight" size={16} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/card:translate-x-1" />
                </span>
              </div>
            </Link>
          </SpotlightCard>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
