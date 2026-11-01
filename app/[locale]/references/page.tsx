import type { Metadata } from "next";
import Link from "next/link";
import { clientCount, clientGroups, countryCount, countryNames, projects } from "@/content/projects";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { CtaBand } from "@/components/sections/CtaBand";
import { Testimonials } from "@/components/people/Testimonials";
import { testimonials } from "@/content/people";
import { ClientWall } from "@/components/references/ClientWall";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "references", title: dict.references.pageTitle, description: dict.references.metaDescription });
}

export default async function ReferencesPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.references;

  const stats = [
    { value: clientCount(), suffix: "+", label: t.stats.clients },
    { value: countryCount(), suffix: "", label: t.stats.countries },
    { value: clientGroups.length, suffix: "", label: t.stats.sectors },
  ];
  const countries = [...new Set(clientGroups.flatMap((g) => g.clients.map((c) => c.country)))].map((c) => l(countryNames[c], locale));

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="relative isolate overflow-hidden pb-14 pt-28 md:pb-24 md:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-[12%] -top-1/3 size-[60vw] max-w-[820px] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.2),transparent)] blur-2xl" />
          <div className="pixel-grid absolute inset-0 [mask-image:radial-gradient(ellipse_65%_70%_at_70%_20%,#000,transparent)]" />
        </div>
        <div className="container-site">
          <nav aria-label={dict.common.breadcrumb}>
            <ol className="flex items-center gap-2 text-sm text-muted">
              <li>
                <Link href={href(locale, "home")} className="transition-colors hover:text-fg">{dict.common.home}</Link>
              </li>
              <li aria-hidden="true" className="text-subtle">/</li>
              <li aria-current="page" className="text-fg/80">{t.pageTitle}</li>
            </ol>
          </nav>
          <Reveal>
            <h1 className="text-display mt-6 md:mt-8">{t.pageTitle}</h1>
            <p className="text-lead mt-6 max-w-[58ch]">{t.pageLead}</p>
          </Reveal>

          {/* Figures — open row, no boxes */}
          <RevealGroup as="dl" className="mt-12 grid gap-y-6 border-t border-line pt-8 sm:grid-cols-3 md:mt-16 md:pt-10">
            {stats.map((s, i) => (
              <RevealItem key={s.label} className={`flex flex-row-reverse items-center justify-end gap-5 sm:flex-col-reverse sm:items-start sm:gap-2 ${i > 0 ? "sm:border-l sm:border-line sm:pl-8" : ""}`}>
                <dt className="text-muted">{s.label}</dt>
                <dd className="w-[6.5rem] shrink-0 font-display text-[2.6rem] font-medium leading-none tracking-[-0.05em] sm:w-auto sm:text-[clamp(3rem,2rem+3vw,5rem)]">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              {countries.map((c, i) => (
                <span key={c} className="inline-flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="size-1 rounded-[1px] bg-subtle" />}
                  {c}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Projects */}
      <section aria-labelledby="projects-title" className="border-t border-line bg-night-2/40 py-16 md:py-32">
        <div className="container-site">
          <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
            <Reveal>
              <h2 id="projects-title" className="text-h2">{t.projectsTitle}</h2>
            </Reveal>
            <Reveal>
              <p className="text-lead max-w-[46ch]">{t.projectsLead}</p>
            </Reveal>
          </div>

          <RevealGroup as="ol" className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2/80">
            {projects.map((p, i) => (
              <RevealItem as="li" key={p.id} className="border-b border-line last:border-b-0">
                <ProjectRow p={p} locale={locale} partnerLabel={t.partner} sitesLabel={t.sites} index={i + 1} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ------------------------------------------------------------ Client wall */}
      <section aria-labelledby="clients-title" className="py-16 md:py-32">
        <div className="container-site">
          <div className="mb-8 grid gap-4 md:mb-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
            <Reveal>
              <h2 id="clients-title" className="text-h2">{t.clientsTitle}</h2>
            </Reveal>
            <Reveal>
              <p className="text-lead max-w-[46ch]">{t.clientsLead}</p>
            </Reveal>
          </div>
          <Reveal>
            <ClientWall
              allLabel={t.filterAll}
              groups={clientGroups.map((g) => ({ id: g.id, title: l(g.title, locale), clients: g.clients.map((c) => ({ name: c.name, country: c.country })) }))}
            />
          </Reveal>
        </div>
      </section>

      <Testimonials items={testimonials} locale={locale} title={dict.common.testimonials} className="pb-16 md:pb-32" />

      <CtaBand title={t.joinTitle} text={t.joinText} primary={{ label: dict.cta.primary, href: href(locale, "contact") }} />
    </>
  );
}

function ProjectRow({
  p,
  locale,
  partnerLabel,
  sitesLabel,
  index,
}: {
  p: (typeof projects)[number];
  locale: "hr" | "en";
  partnerLabel: string;
  sitesLabel: string;
  index: number;
}) {
  return (
    <article
      data-accent={p.accent}
      className="group relative grid gap-6 p-6 transition-colors duration-500 hover:bg-white/[0.018] md:grid-cols-12 md:gap-8 md:p-10"
    >
      {/* accent edge on hover */}
      <span aria-hidden="true" className="absolute inset-y-6 left-0 w-[2px] origin-center scale-y-0 bg-[var(--accent)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 md:inset-y-10" />

      {/* Index + meta */}
      <div className="flex items-center justify-between gap-4 md:col-span-3 md:flex-col md:items-start md:justify-start">
        <span className="font-display text-[clamp(2rem,1.4rem+1.6vw,2.75rem)] font-medium leading-none tracking-[-0.05em] text-fg/25 transition-colors duration-500 group-hover:text-[var(--accent)]">
          {String(index).padStart(2, "0")}
        </span>
        <div className="text-right text-sm md:mt-6 md:text-left">
          <p className="text-[var(--accent)]">{l(p.sector, locale)}</p>
          <p className="mt-1 text-muted">{l(p.location, locale)}</p>
        </div>
      </div>

      {/* Story */}
      <div className="md:col-span-5">
        <h3 className="font-display text-[clamp(1.4rem,1.15rem+0.9vw,1.95rem)] font-medium leading-[1.12] tracking-[-0.03em]">{l(p.title, locale)}</h3>
        <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{l(p.summary, locale)}</p>
        {p.partner && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-sm">
            <span className="text-subtle">{partnerLabel}</span>
            <span className="size-1 rounded-[1px] bg-[var(--accent)]" aria-hidden="true" />
            <span className="font-medium text-fg">{p.partner}</span>
          </p>
        )}
      </div>

      {/* Included */}
      {p.sites && p.sites.length > 0 && (
        <div className="md:col-span-4 md:border-l md:border-line md:pl-8">
          <p className="flex items-baseline justify-between text-xs text-subtle">
            {sitesLabel}
            <span className="font-display text-sm tabular-nums text-fg/70">{p.sites.length}</span>
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5">
            {p.sites.map((site) => (
              <li key={site} className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-fg/85">
                <span aria-hidden="true" className="mt-[0.5em] size-[5px] shrink-0 rounded-[1px] bg-[var(--accent)] opacity-70" />
                {site}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
