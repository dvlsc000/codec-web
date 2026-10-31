import { SpotlightCard } from "@/components/ui/SpotlightCard";
import type { Accent } from "@/content/types";

export interface ProjectCardData {
  id: string;
  client: string;
  partner?: string;
  title: string;
  summary: string;
  sector: string;
  location: string;
  accent: Accent;
  sites?: string[];
  scope?: string[];
}

export function ProjectCard({ p, labels, detailed = false }: { p: ProjectCardData; labels?: { partner: string; scope: string }; detailed?: boolean }) {
  return (
    <SpotlightCard accent={p.accent} className="h-full">
      <article className="flex h-full flex-col p-7 md:p-8">
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
          <span className="text-[var(--accent)]">{p.sector}</span>
          <span aria-hidden="true" className="text-subtle">/</span>
          <span>{p.location}</span>
        </p>
        <h3 className="text-h3 mt-5">{p.title}</h3>
        {(!p.title.includes(p.client) || (p.partner && labels)) && (
          <p className="mt-2 font-medium text-fg/75">
            {!p.title.includes(p.client) && p.client}
            {p.partner && labels && (
              <span className="font-normal text-muted">
                {!p.title.includes(p.client) && " · "}
                {labels.partner}: {p.partner}
              </span>
            )}
          </p>
        )}
        <p className="mt-4 text-muted">{p.summary}</p>

        {detailed && p.scope && labels && (
          <div className="mt-6">
            <h4 className="sr-only">{labels.scope}</h4>
            <ul className="space-y-2">
              {p.scope.map((s) => (
                <li key={s} className="flex gap-3 text-[0.95rem] text-fg/85">
                  <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-[var(--accent)]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.sites && p.sites.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-7">
            {p.sites.map((s) => (
              <li key={s} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{s}</li>
            ))}
          </ul>
        )}
      </article>
    </SpotlightCard>
  );
}
