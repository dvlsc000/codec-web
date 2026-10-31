import type { Metadata } from "next";
import Link from "next/link";
import { clientCount, clientGroups, countryCount, countryNames, projects } from "@/content/projects";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { CtaBand } from "@/components/sections/CtaBand";
import { ClientWall } from "@/components/references/ClientWall";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

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
  const [lead, ...rest] = projects;

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

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-5">
            {lead && (
              <Reveal className="h-full">
                <ProjectPanel p={lead} locale={locale} partnerLabel={t.partner} sitesLabel={t.sites} index={1} large />
              </Reveal>
            )}
            <RevealGroup className="grid gap-4 lg:gap-5">
              {rest.map((p, i) => (
                <RevealItem key={p.id}>
                  <ProjectPanel p={p} locale={locale} partnerLabel={t.partner} sitesLabel={t.sites} index={i + 2} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
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

      <CtaBand title={t.joinTitle} text={t.joinText} primary={{ label: dict.cta.primary, href: href(locale, "contact") }} />
    </>
  );
}

function ProjectPanel({
  p,
  locale,
  partnerLabel,
  sitesLabel,
  index,
  large = false,
}: {
  p: (typeof projects)[number];
  locale: "hr" | "en";
  partnerLabel: string;
  sitesLabel: string;
  index: number;
  large?: boolean;
}) {
  return (
    <SpotlightCard accent={p.accent} className="h-full">
      <article className={`relative flex h-full flex-col p-7 ${large ? "md:p-10" : "md:p-8"}`}>
        {large && (
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.16),transparent)]" />
        )}
        <div className="relative flex items-start justify-between gap-4">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
            <span className="text-[var(--accent)]">{l(p.sector, locale)}</span>
            <span aria-hidden="true" className="text-subtle">/</span>
            <span className="text-muted">{l(p.location, locale)}</span>
          </p>
          <span className="font-display text-sm tabular-nums text-subtle">{String(index).padStart(2, "0")}</span>
        </div>

        <h3 className={`relative mt-6 font-display font-medium tracking-[-0.03em] ${large ? "text-[clamp(1.7rem,1.2rem+1.6vw,2.6rem)] leading-[1.08]" : "text-h3 md:text-[1.6rem]"}`}>{l(p.title, locale)}</h3>
        <p className={`relative mt-4 max-w-[52ch] text-muted ${large ? "text-lg" : ""}`}>{l(p.summary, locale)}</p>

        {p.partner && (
          <p className="relative mt-5 inline-flex items-center gap-2 self-start rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-sm">
            <span className="text-subtle">{partnerLabel}</span>
            <span className="size-1 rounded-[1px] bg-[var(--accent)]" aria-hidden="true" />
            <span className="font-medium text-fg">{p.partner}</span>
          </p>
        )}

        {p.sites && p.sites.length > 0 && (
          <div className={`relative mt-auto ${large ? "pt-10" : "pt-8"}`}>
            {large ? (
              <p className="mb-5 flex items-end gap-3">
                <span className="font-display text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] font-medium leading-[0.85] tracking-[-0.05em] text-[var(--accent)]">{p.sites.length}</span>
                <span className="pb-1 text-sm text-muted">{sitesLabel}</span>
              </p>
            ) : (
              <p className="mb-3 flex items-center justify-between border-t border-line pt-6 text-xs text-subtle">
                {sitesLabel}
                <span className="tabular-nums">{p.sites.length}</span>
              </p>
            )}
            <ul className="flex flex-wrap gap-1.5">
              {p.sites.map((s) => (
                <li key={s} className="rounded-[6px] border border-line bg-night/60 px-2.5 py-1 text-[0.82rem] text-fg/80">{s}</li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </SpotlightCard>
  );
}
